using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// Provides services and runtime access to UI controllers.
/// </summary>
public sealed class UIContext
{
    private IUIRuntimeAccess? _runtime;

    // The connection that raised the current command; differs from the attached connection only under UIRuntimeLifetime.PerClient sharing.
    private readonly AsyncLocal<UIHandle?> _invokingHandle = new();

    internal UIContext(ILogger logger, IServiceProvider services, ITranslator translator, IUIContentAddressResolver? content, UIRouteDefinition route, UIHandle handle, IUIDialogService dialogs, IUIDownloadService downloads, IUIUploadService uploads)
    {
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(translator);

        ArgumentNullException.ThrowIfNull(route);
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(dialogs);
        ArgumentNullException.ThrowIfNull(downloads);
        ArgumentNullException.ThrowIfNull(uploads);

        handle.Instance.Validate();

        Logger = logger;
        Services = services;
        Translator = translator;
        if (content is not null)
            Content = content;

        Route = route;
        _connection = new ConnectionState(handle, dialogs, downloads, uploads);
    }

    /// <summary>
    /// Gets the logger available to the controller.
    /// </summary>
    public ILogger Logger { get; }

    /// <summary>
    /// Gets the application service provider.
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

    private sealed record ConnectionState(UIHandle Handle, IUIDialogService Dialogs, IUIDownloadService Downloads, IUIUploadService Uploads);

    /// <summary>
    /// Gets the UI handle a command is running for — the connection that raised it, or the connection the
    /// runtime is attached to outside a command.
    /// </summary>
    public UIHandle Handle => _invokingHandle.Value ?? _connection.Handle;

    /// <summary>Marks the connection a command is running for.</summary>
    /// <remarks>
    /// Ambient because it must reach a controller that never asked for it; per-flow because a background command
    /// runs beside others on the same runtime.
    /// </remarks>
    internal IDisposable BeginInvocation(UIHandle handle)
    {
        ArgumentNullException.ThrowIfNull(handle);

        UIHandle? previous = _invokingHandle.Value;
        _invokingHandle.Value = handle;

        return new InvocationScope(this, previous);
    }

    private sealed class InvocationScope(UIContext context, UIHandle? previous) : IDisposable
    {
        public void Dispose() => context._invokingHandle.Value = previous;
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
    /// Gets the dialog service for the current client connection.
    /// </summary>
    public IUIDialogService Dialogs => _connection.Dialogs;

    /// <summary>
    /// Gets the download service for the current client connection.
    /// </summary>
    public IUIDownloadService Downloads => _connection.Downloads;

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

        if (effects.Count == 0)
            return Task.CompletedTask;

        // The command-result channel with no command behind it, the route a download already takes when it is raised outside one.
        UICommandExecutionResult result = new()
        {
            Command = UICommandResult.Ok(Runtime.ResolveEffects(effects)),
            Changes = ServerChangeSet.Empty
        };

        return Updates.SendCommandResultAsync(Handle, result, cancellationToken);
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

    private IUIUpdateSink Updates
        => (IUIUpdateSink?)Services.GetService(typeof(IUIUpdateSink))
            ?? throw new InvalidOperationException($"'{nameof(IUIUpdateSink)}' is not registered.");

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

    internal void RefreshConnection(UIHandle handle, IUIDialogService dialogs, IUIDownloadService downloads, IUIUploadService uploads)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(dialogs);
        ArgumentNullException.ThrowIfNull(downloads);
        ArgumentNullException.ThrowIfNull(uploads);

        handle.Instance.Validate();

        _connection = new ConnectionState(handle, dialogs, downloads, uploads);

        Validate();
    }

    /// <summary>Marks this session authenticated, giving it roles and permissions the route and command access checks read.</summary>
    /// <remarks>
    /// Only marks the session for id rotation; the actual rotation happens on the next full page load, so sign-in must end in a navigation.
    /// </remarks>
    public ValueTask SignInAsync(string? userId = null, IReadOnlySet<string>? roles = null, IReadOnlySet<string>? permissions = null, CancellationToken cancellationToken = default)
        => UpdateSessionAsync(
            session => session with
            {
                IsAuthenticated = true,
                UserId = userId ?? session.UserId,
                Roles = roles ?? session.Roles,
                Permissions = permissions ?? session.Permissions,
                PendingIdRotation = true
            },
            cancellationToken
        );

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
    /// command runs, and a page kept for later is told at its next attach.
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

        if (UISessionMoves.Any(previous, written) && _runtime is IUISessionChangeListener listener)
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
        ArgumentNullException.ThrowIfNull(Dialogs);
        ArgumentNullException.ThrowIfNull(Downloads);
        ArgumentNullException.ThrowIfNull(Uploads);

        Handle.Instance.Validate();

        ArgumentException.ThrowIfNullOrWhiteSpace(Handle.Session.SessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(Handle.Session.Language);
        ArgumentNullException.ThrowIfNull(Handle.Session.Roles);
        ArgumentNullException.ThrowIfNull(Handle.Session.Permissions);
    }
}
