using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
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

    // The connection the runtime last attached to, and — for the duration of one command — the connection
    // that actually raised it. They differ only for a runtime shared by several tabs, which is what
    // UIRuntimeLifetime.Persistent is; everywhere else the invoking handle is the connection handle.
    private readonly AsyncLocal<UIHandle?> _invokingHandle = new();

    internal UIContext(ILogger logger, IServiceProvider services, ITranslator translator, UIRouteDefinition route, UIHandle handle, IUIDialogService dialogs, IUIDownloadService downloads, IUIUploadService uploads)
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

        Route = route;
        ConnectionHandle = handle;
        Dialogs = dialogs;
        Downloads = downloads;
        Uploads = uploads;
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

    private UIHandle ConnectionHandle { get; set; }

    /// <summary>
    /// Gets the UI handle a command is running for — the connection that raised it, or the connection the
    /// runtime is attached to outside a command.
    /// </summary>
    public UIHandle Handle => _invokingHandle.Value ?? ConnectionHandle;

    /// <summary>
    /// Marks the connection a command is running for. Ambient rather than a parameter, because it has to
    /// reach a controller that never asked for it, and per-flow rather than per-instance, because a
    /// background command runs beside others on the same runtime.
    /// </summary>
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
    public IUIDialogService Dialogs { get; private set; }

    /// <summary>
    /// Gets the download service for the current client connection.
    /// </summary>
    public IUIDownloadService Downloads { get; private set; }

    /// <summary>
    /// Gets the upload service for the current client connection.
    /// </summary>
    public IUIUploadService Uploads { get; private set; }

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
    /// Read from the store rather than from <see cref="UIHandle.Session"/>, which is the snapshot taken when
    /// this connection attached and does not move until it attaches again.
    /// </remarks>
    public ValueTask<UserSessionState?> GetSessionAsync(CancellationToken cancellationToken = default)
        => Sessions.TryGetAsync(Handle.Session.SessionId, cancellationToken);

    /// <summary>
    /// Marks this session authenticated and gives it its roles and permissions, which is what the route and
    /// command access checks read.
    /// </summary>
    /// <remarks>
    /// Marks the session for id rotation rather than rotating here: only the shell render can write the cookie
    /// that carries the id, so a new one issued over this live connection would never reach the browser. The
    /// rotation therefore happens on the next full page load, which means <b>sign-in must end in a navigation</b>
    /// — until it does, the old id stays valid. See <c>docs/PLAN.md</c> §6.
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
    /// Removes the session. Every later command on this connection is refused, because the access check reads
    /// the store rather than the snapshot it attached with.
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

        ConnectionHandle = handle;
        Dialogs = dialogs;
        Downloads = downloads;
        Uploads = uploads;

        Validate();
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
