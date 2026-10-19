using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// Provides services and runtime access to UI controllers.
/// </summary>
public sealed class UIContext
{
    private IUIRuntimeAccess? _runtime;

    // The command running now, and the connection that raised it; differs from the attached connection only under
    // UIRuntimeLifetime.PerClient sharing.
    private readonly AsyncLocal<Invocation?> _invocation = new();

    // The host itself, never a service an application may decorate: a sign-in that missed it would fall back to a rotation at the next
    // load, which a load of the old id could claim.
    private readonly IUISessionSignIn _signIn;

    internal UIContext(ILogger logger, IServiceProvider services, ITranslator translator, IUIContentAddressResolver? content, UIRouteDefinition route, UIHandle handle, IUIDownloadStager downloads, IUIUploadService uploads, IUISessionSignIn signIn)
    {
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(translator);

        ArgumentNullException.ThrowIfNull(route);
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(downloads);
        ArgumentNullException.ThrowIfNull(uploads);
        ArgumentNullException.ThrowIfNull(signIn);

        handle.Instance.Validate();

        Logger = logger;
        Services = services;
        Translator = translator;
        if (content is not null)
            Content = content;

        Route = route;
        _signIn = signIn;
        _connection = new ConnectionState(handle, downloads, uploads);
        Dialogs = new RuntimeDialogs(this);
        Downloads = new RuntimeDownloads(this);
    }

    /// <summary>
    /// Gets the logger available to the controller.
    /// </summary>
    public ILogger Logger { get; }

    /// <summary>
    /// Gets the runtime's own service scope: a scoped service is this page's, gone with its runtime.
    /// </summary>
    public IServiceProvider Services { get; }

    /// <summary>
    /// Gets the translator used by the current UI context.
    /// </summary>
    public ITranslator Translator { get; }

    /// <summary>Resolves the address a piece of registered content is served at.</summary>
    /// <exception cref="InvalidOperationException">
    /// No platform has registered an <see cref="IUIContentAddressResolver"/>.
    /// </exception>
    public IUIContentAddressResolver Content
    {
        get => field ?? throw new InvalidOperationException("No platform has registered an IUIContentAddressResolver; the platform's startup registers one.");
        private init;
    }

    /// <summary>
    /// Gets synchronized access to the attached runtime.
    /// </summary>
    public IUIRuntimeAccess Runtime
        => _runtime ?? throw new InvalidOperationException("Runtime access is not attached.");

    /// <summary>Gets the route this controller is running on.</summary>
    /// <remarks>Fixed for the lifetime of the runtime, unlike <see cref="Handle"/>, which follows the connection.</remarks>
    public UIRouteDefinition Route { get; }

    // Swapped whole: under PerClient, a reattach can replace it while a command reads it; four separate properties could
    // then split across old and new connections.
    private volatile ConnectionState _connection;

    private sealed record ConnectionState(UIHandle Handle, IUIDownloadStager DownloadStager, IUIUploadService Uploads);

    /// <summary>
    /// Gets the UI handle a command is running for — the connection that raised it, or the connection the
    /// runtime is attached to outside a command.
    /// </summary>
    public UIHandle Handle => _invocation.Value?.Handle ?? _connection.Handle;

    /// <summary>Marks the connection a command is running for.</summary>
    /// <remarks>
    /// Ambient because it must reach a controller that never asked for it; per-flow because a background command
    /// runs beside others on the same runtime.
    /// </remarks>
    internal IDisposable BeginInvocation(UIHandle handle)
    {
        ArgumentNullException.ThrowIfNull(handle);

        Invocation invocation = new(this, handle, _invocation.Value);
        _invocation.Value = invocation;

        return invocation;
    }

    /// <summary>One command's run for one connection; ended once it returns, though work it started still sees it.</summary>
    /// <remarks>
    /// Work a command starts and does not await carries the flow it began in, so it reads that command's connection after the command
    /// is over. Posted work runs in no caller's flow: it reads the attached connection.
    /// </remarks>
    private sealed class Invocation(UIContext context, UIHandle handle, Invocation? previous) : IDisposable
    {
        private volatile bool _ended;

        public UIHandle Handle { get; } = handle;

        /// <summary>Whether the command is still running, so its connection is the one asking.</summary>
        public bool IsRunning => !_ended;

        public void Dispose()
        {
            _ended = true;
            context._invocation.Value = previous;
        }
    }

    /// <summary>Gets what the platform knows about the connection a command is running for — <see cref="Handle"/>'s.</summary>
    public UIConnectionInfo Connection => Handle.Connection;

    /// <summary>
    /// Gets whether the browser of the page a command is running for lets it show system notifications, as the page last reported —
    /// <see cref="Handle"/>'s.
    /// </summary>
    /// <remarks>
    /// The browser's, not the reader's: whether the reader wants notifications, and of which kinds, is the application's to keep.
    /// <see cref="UINotificationPermission.Denied"/> is for the page to say, since asking again shows nothing.
    /// </remarks>
    public UINotificationPermission NotificationPermission => Handle.ClientState.NotificationPermission;

    /// <summary>Gets the reader's time zone: the one the session's client reported, or UTC while it has reported none this host knows.</summary>
    public TimeZoneInfo TimeZone => UITimeZones.Find(Handle.Session.TimeZone);

    /// <summary>The wall-clock time an instant reads in the reader's zone; a <see cref="DateTimeKind.Unspecified"/> one is read as UTC.</summary>
    public DateTime ToLocalTime(DateTime utcInstant)
        => UITimeZones.ToLocalTime(TimeZone, utcInstant);

    /// <summary>An instant as the reader's clock shows it, with the reader's offset.</summary>
    public DateTimeOffset ToLocalTime(DateTimeOffset instant)
        => UITimeZones.ToLocalTime(TimeZone, instant);

    /// <summary>The instant a day begins for the reader, in UTC — where a filter by a picked <see cref="DateOnly"/> starts.</summary>
    /// <remarks>The next day's start is where it ends: a day is not always 24 hours long.</remarks>
    public DateTime StartOfDayUtc(DateOnly day)
        => UITimeZones.StartOfDayUtc(TimeZone, day);

    /// <summary>
    /// Gets the dialog service: opens and closes a dialog on a page of this runtime, sent as <see cref="SendEffectsAsync"/> sends.
    /// </summary>
    public IUIDialogService Dialogs { get; }

    /// <summary>
    /// A dialog shown or hidden outside a command's answer is an effect sent outside a command, so it goes the runtime's one way for
    /// those (<see cref="IUIRuntimeAccess.SendEffectsToAsync"/>): resolved, and with the page state any such send carries.
    /// </summary>
    private sealed class RuntimeDialogs(UIContext context) : IUIDialogService
    {
        public Task<bool> ShowAsync(UIHandle handle, string dialogName, CancellationToken cancellationToken = default)
            => SendAsync(handle, new OpenDialogEffect(dialogName), cancellationToken);

        public Task<bool> HideAsync(UIHandle handle, string dialogName, CancellationToken cancellationToken = default)
            => SendAsync(handle, new CloseDialogEffect(dialogName), cancellationToken);

        // "Handled", not "the dialog is now on screen": delivery is one-way, with nothing to await for confirmation.
        private async Task<bool> SendAsync(UIHandle handle, ClientEffect effect, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(handle);

            handle.Instance.Validate();

            await context.Runtime.SendEffectsToAsync([handle], [effect], cancellationToken).ConfigureAwait(false);

            return true;
        }
    }

    /// <summary>
    /// Gets the download service: stages a file through the platform's <see cref="IUIDownloadStager"/> and has the page fetch it, the
    /// fetch sent as <see cref="SendEffectsAsync"/> sends.
    /// </summary>
    public IUIDownloadService Downloads { get; }

    /// <summary>
    /// The stager owns the file; the effect that has the page fetch it is one sent outside a command, so it goes the runtime's one way for
    /// those (<see cref="IUIRuntimeAccess.SendEffectsToAsync"/>), as a dialog does.
    /// </summary>
    private sealed class RuntimeDownloads(UIContext context) : IUIDownloadService
    {
        public async Task<UITransferResult> DownloadAsync(UIHandle handle, string fileName, string contentType, Stream content, CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(handle);
            ArgumentException.ThrowIfNullOrWhiteSpace(fileName);
            ArgumentException.ThrowIfNullOrWhiteSpace(contentType);
            ArgumentNullException.ThrowIfNull(content);

            handle.Instance.Validate();

            try
            {
                if (await context._connection.DownloadStager.StageAsync(handle, fileName, contentType, content, cancellationToken).ConfigureAwait(false) is ClientEffect fetch)
                    await context.Runtime.SendEffectsToAsync([handle], [fetch], cancellationToken).ConfigureAwait(false);

                return UITransferResult.Ok();
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                return UITransferResult.Cancel();
            }
        }

        public async Task<UITransferResult> DownloadAsync(UIHandle handle, string fileName, string contentType, byte[] content, CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(content);

            MemoryStream stream = new(content, writable: false);

            await using (stream.ConfigureAwait(false))
                return await DownloadAsync(handle, fileName, contentType, stream, cancellationToken).ConfigureAwait(false);
        }
    }

    /// <summary>
    /// Gets the upload service for the current client connection.
    /// </summary>
    public IUIUploadService Uploads => _connection.Uploads;

    /// <summary>Sends client effects to the connection this is running for, without waiting for a command to answer.</summary>
    /// <remarks>
    /// A command's own effects apply only once it answers, so long-running work (a node network, a long import) needs this
    /// channel instead. A runtime answering a single request, not holding a connection, drops them.
    /// </remarks>
    public Task SendEffectsAsync(IReadOnlyList<ClientEffect> effects, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(effects);

        return Runtime.SendEffectsToAsync([Handle], effects, cancellationToken);
    }

    /// <summary>
    /// Sends client effects to every page attached to this runtime — under <c>PerClient</c>, every tab sharing it — without waiting
    /// for a command to answer.
    /// </summary>
    public Task SendEffectsToAllAsync(IReadOnlyList<ClientEffect> effects, CancellationToken cancellationToken = default)
        => Runtime.SendEffectsToAllAsync(effects, except: null, cancellationToken);

    /// <summary>Subscribes this runtime to a topic <see cref="IUIBroadcast"/> posts to — a chat room, a ticket, a dashboard.</summary>
    /// <remarks>Kept until <see cref="Unsubscribe"/> or the runtime ends, whichever comes first; subscribing twice is subscribing once.</remarks>
    public void Subscribe(string topic)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(topic);

        Topics.Subscribe(topic);
    }

    /// <summary>Stops this runtime hearing what <see cref="IUIBroadcast"/> posts to a topic; a topic it never took is ignored.</summary>
    public void Unsubscribe(string topic)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(topic);

        Topics.Unsubscribe(topic);
    }

    private IUITopicSubscriber Topics
        => Runtime as IUITopicSubscriber
            ?? throw new InvalidOperationException("This runtime takes no topics; the host's runtimes do.");

    /// <summary>
    /// Translates a plain value using the current session language — under key prefixes, only a prefixed one.
    /// </summary>
    public string? Translate(string? key)
        => Translator.Translate(Handle.Session.Language, key);

    /// <summary>
    /// Translates a key using the current session language and fills its <c>{name}</c> slots; a numeric <c>count</c> picks the
    /// plural form.
    /// </summary>
    public string Translate(string key, IReadOnlyDictionary<string, object?>? arguments)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return Translator.Translate(Handle.Session.Language, key, arguments) ?? key;
    }

    /// <summary>
    /// Translates a key using the current session language and fills its numbered slots — <c>{0}</c>, <c>{1}</c>, … — in order.
    /// </summary>
    public string Translate(string key, params object?[] arguments)
        => Translate(key, UIWords.Positional(arguments));

    /// <summary>
    /// Translates a phrase — its key and its arguments — using the current session language; an author's text as a plain value.
    /// </summary>
    public string Translate(UIPhrase phrase)
    {
        ArgumentNullException.ThrowIfNull(phrase);

        return phrase.IsText ? Translate(phrase.Key) ?? phrase.Key : Translate(phrase.Key, phrase.Arguments);
    }

    /// <summary>
    /// Reads the stored session behind this connection, or <see langword="null"/> when it has been signed out
    /// or has expired.
    /// </summary>
    /// <remarks>
    /// Read from the store, not <see cref="UIHandle.Session"/>, which moves only when this connection itself updates the session.
    /// </remarks>
    public ValueTask<UserSessionState?> GetSessionAsync(CancellationToken cancellationToken = default)
        => Sessions.TryGetAsync(Handle.Session.SessionId, cancellationToken);

    private IUserSessionStore Sessions
        => (IUserSessionStore?)Services.GetService(typeof(IUserSessionStore))
            ?? throw new InvalidOperationException($"'{nameof(IUserSessionStore)}' is not registered.");

    internal void AttachRuntime(IUIRuntimeAccess runtime)
    {
        ArgumentNullException.ThrowIfNull(runtime);

        if (_runtime is not null)
            throw new InvalidOperationException("Runtime access is already attached.");

        _runtime = runtime;
    }

    internal void RefreshConnection(UIHandle handle, IUIDownloadStager downloads, IUIUploadService uploads)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(downloads);
        ArgumentNullException.ThrowIfNull(uploads);

        handle.Instance.Validate();

        _connection = new ConnectionState(handle, downloads, uploads);

        Validate();
    }

    /// <summary>Marks this session authenticated, giving it roles and permissions the route and command access checks read.</summary>
    /// <remarks>
    /// The session moves to a new id at once: the old one is gone from the store, every other page open under it ends unannounced, and a
    /// load presenting it later is a new anonymous session. This page goes on under the new id, and its client is handed the new key — on
    /// the web a one-time token the page trades for the cookie before it loads another page. A no-op when the session is gone.
    /// </remarks>
    /// <exception cref="InvalidOperationException">
    /// Called outside a running command — posted work, a job, a call from outside — while the runtime is shared by more than one page:
    /// which page signs in is then not known, so sign in from the page's own command.
    /// </exception>
    public async ValueTask SignInAsync(string? userId = null, IReadOnlySet<string>? roles = null, IReadOnlySet<string>? permissions = null, CancellationToken cancellationToken = default)
    {
        UserSessionState SignIn(UserSessionState session)
        {
            return session with
            {
                IsAuthenticated = true,
                UserId = userId ?? session.UserId,
                Roles = roles ?? session.Roles,
                Permissions = permissions ?? session.Permissions
            };
        }

        // Outside a running command the handle is a guess — the last page to attach, or the page whose work started the posted queue — and
        // the key goes to whoever it names: the host refuses it where another page shares the runtime.
        Invocation? invocation = _invocation.Value;
        UIHandle handle = invocation is { IsRunning: true } ? invocation.Handle : _connection.Handle;
        IUserSessionContext previous = handle.Session;

        if (!await _signIn.SignInAsync(handle, invocation is { IsRunning: true }, SignIn, cancellationToken).ConfigureAwait(false))
            return;

        if (_runtime is IUISessionChangeListener listener)
            await listener.SessionChangedAsync(handle, previous, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Ends the session; this page keeps running to finish its own answer.</summary>
    /// <remarks>
    /// Every later command under it is refused, the files uploaded under it go, and every other page open under it is sent to sign in
    /// and its runtime ended — through <see cref="IUISessions"/> where the host registers one; without it, only the stored session and
    /// its files go.
    /// </remarks>
    public async ValueTask SignOutAsync(CancellationToken cancellationToken = default)
    {
        UIHandle handle = Handle;
        var sessionId = handle.Session.SessionId;

        if (Services.GetService(typeof(IUISessions)) is IUISessions sessions)
        {
            await sessions.EndSessionAsync(sessionId, handle, cancellationToken).ConfigureAwait(false);
            return;
        }

        await Sessions.RemoveAsync(sessionId, cancellationToken).ConfigureAwait(false);

        if (Services.GetService(typeof(IUIFileStore)) is IUIFileStore files)
            await files.RemoveSessionAsync(sessionId, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Applies a change to the stored session — the way to set language, theme or anything else that has to
    /// outlive this connection.
    /// </summary>
    /// <remarks>
    /// A no-op when the session is gone. What was stored is this connection's <see cref="UIHandle.Session"/> for the rest of the
    /// command. A new language or theme mode runs the controller's hook, and a new language, theme mode or set of colours switches
    /// this page, before it returns; the session's other pages open under a controller are switched too, their controllers told as a
    /// command runs, and a page kept for later is told at its next attach. Every page of the session holds the new session, and one
    /// whose route it no longer passes ends as a change made from outside ends it — this page once its command answered.
    /// </remarks>
    public async ValueTask UpdateSessionAsync(Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(update);

        UIHandle handle = Handle;
        IUserSessionContext previous = handle.Session;
        UserSessionState? written = null;

        // Applied to what the store holds at the write, so a change made meanwhile from elsewhere is not overwritten; and never
        // recreating a session signed out since. Something written into a session is a client using it: the full idle timeout.
        var stored = await Sessions.TryUpdateAsync(handle.Session.SessionId, session => written = (update(session) ?? throw new InvalidOperationException("A session update returned no session.")) with { IsUnclaimed = false }, cancellationToken).ConfigureAwait(false);

        if (!stored || written is null)
            return;

        handle.RefreshSession(written);

        if (_runtime is IUISessionChangeListener listener)
            await listener.SessionChangedAsync(handle, previous, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Validates the context and its current runtime connection.
    /// </summary>
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Logger);
        ArgumentNullException.ThrowIfNull(Services);
        ArgumentNullException.ThrowIfNull(Translator);
        ArgumentNullException.ThrowIfNull(Route);
        ArgumentNullException.ThrowIfNull(_runtime);
        ArgumentNullException.ThrowIfNull(Handle);
        ArgumentNullException.ThrowIfNull(Downloads);
        ArgumentNullException.ThrowIfNull(Uploads);

        Handle.Instance.Validate();

        ArgumentException.ThrowIfNullOrWhiteSpace(Handle.Session.SessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(Handle.Session.Language);
        ArgumentNullException.ThrowIfNull(Handle.Session.Roles);
        ArgumentNullException.ThrowIfNull(Handle.Session.Permissions);
    }
}
