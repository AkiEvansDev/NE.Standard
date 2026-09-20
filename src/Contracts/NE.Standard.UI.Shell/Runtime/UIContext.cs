using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Effects;
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
        _connection = new Connection(handle, dialogs, downloads, uploads);
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

    /// <summary>
    /// Resolves the address a piece of registered content is served at.
    /// </summary>
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

    /// <summary>
    /// Gets the route this controller is running on.
    /// </summary>
    /// <remarks>
    /// Fixed for the lifetime of the runtime, unlike <see cref="Handle"/>, which follows the connection.
    /// </remarks>
    public UIRouteDefinition Route { get; }

    // Swapped whole: under PerClient, a reattach can replace it while a command reads it; four separate properties could
    // then split across old and new connections.
    private volatile Connection _connection;

    private sealed record Connection(UIHandle Handle, IUIDialogService Dialogs, IUIDownloadService Downloads, IUIUploadService Uploads);

    /// <summary>
    /// Gets the UI handle a command is running for — the connection that raised it, or the connection the
    /// runtime is attached to outside a command.
    /// </summary>
    public UIHandle Handle => _invokingHandle.Value ?? _connection.Handle;

    /// <summary>
    /// Marks the connection a command is running for.
    /// </summary>
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

    /// <summary>
    /// Sends client effects to the connection this is running for, without waiting for a command to answer.
    /// </summary>
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

    private IUIUpdateSink Updates
        => (IUIUpdateSink?)Services.GetService(typeof(IUIUpdateSink))
            ?? throw new InvalidOperationException($"'{nameof(IUIUpdateSink)}' is not registered.");

    /// <summary>
    /// Translates a key using the current session language.
    /// </summary>
    public string? Translate(string? key)
        => Translator.Translate(Handle.Session.Language, key);

    /// <summary>
    /// Reads the stored session behind this connection, or <see langword="null"/> when it has been signed out
    /// or has expired.
    /// </summary>
    /// <remarks>
    /// Read from the store, not <see cref="UIHandle.Session"/>, a snapshot that does not move until this connection attaches again.
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

        _connection = new Connection(handle, dialogs, downloads, uploads);

        Validate();
    }

    /// <summary>
    /// Marks this session authenticated, giving it roles and permissions the route and command access checks read.
    /// </summary>
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

    /// <summary>
    /// Removes the session, so every later command on this connection is refused.
    /// </summary>
    public ValueTask SignOutAsync(CancellationToken cancellationToken = default)
        => Sessions.RemoveAsync(Handle.Session.SessionId, cancellationToken);

    /// <summary>
    /// Applies a change to the stored session — the way to set language, theme or anything else that has to
    /// outlive this connection.
    /// </summary>
    /// <remarks>
    /// A no-op when the session is already gone, so signing out twice is not an error.
    /// </remarks>
    public async ValueTask UpdateSessionAsync(Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(update);

        IUserSessionStore store = Sessions;
        UserSessionState? session = await store.TryGetAsync(Handle.Session.SessionId, cancellationToken).ConfigureAwait(false);

        if (session is null)
            return;

        UserSessionState updated = update(session);

        ArgumentNullException.ThrowIfNull(updated);

        await store.SaveAsync(updated, cancellationToken).ConfigureAwait(false);
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
