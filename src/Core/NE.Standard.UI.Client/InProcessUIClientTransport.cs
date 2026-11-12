using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Client;

/// <summary>In-process implementation of <see cref="IUIClientTransport"/> talking directly to an <see cref="IUIHost"/>.</summary>
public sealed class InProcessUIClientTransport : IUIClientTransport
{
    private readonly IUIHost _host;
    private readonly IServiceProvider _services;
    private readonly UIApplication _application;
    private readonly UIViewResolution? _view;
    private readonly Action<string>? _onClose;
    private RuntimeResolution? _resolution;

    /// <summary>Initializes a new in-process transport for a resolved <see cref="UIViewResolution"/> prior to runtime attachment.</summary>
    public InProcessUIClientTransport(IUIHost host, IServiceProvider services, UIApplication application, string instanceId, UIViewResolution view, Action<string>? onClose = null)
    {
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(application);
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);
        ArgumentNullException.ThrowIfNull(view);

        _host = host;
        _services = services;
        _application = application;
        InstanceId = instanceId;
        _view = view;
        _onClose = onClose;
    }

    /// <summary>Initializes a new in-process transport for an already attached <see cref="RuntimeResolution"/>.</summary>
    public InProcessUIClientTransport(IUIHost host, IServiceProvider services, UIApplication application, string instanceId, RuntimeResolution resolution, Action<string>? onClose = null)
    {
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(application);
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);
        ArgumentNullException.ThrowIfNull(resolution);

        _host = host;
        _services = services;
        _application = application;
        InstanceId = instanceId;
        _resolution = resolution;
        _onClose = onClose;
    }

    /// <summary>Gets the underlying attached runtime resolution.</summary>
    public RuntimeResolution Resolution => _resolution ?? throw new InvalidOperationException($"Transport '{InstanceId}' has not attached its runtime yet.");

    /// <summary>Gets the session id of this page.</summary>
    public string SessionId => Session.SessionId;

    /// <summary>Gets the live session context of this page.</summary>
    public IUserSessionContext Session => _resolution is not null ? _resolution.Handle.Session : _view!.Session;

    /// <inheritdoc />
    public string InstanceId { get; }

    /// <inheritdoc />
    public string Route => _resolution is not null ? _resolution.Route.Route : _view!.Route.Route;

    /// <inheritdoc />
    public UINavigationRequest InitialNavigation => _resolution is not null ? _resolution.Navigation : _view!.Navigation;

    /// <inheritdoc />
    public CompiledView View => _resolution is not null ? _resolution.CompiledView : _view!.View;

    /// <inheritdoc />
    public string Language => Session.Language;

    /// <inheritdoc />
    public UIThemeMode? ThemeMode => Session.ThemeMode;

    /// <inheritdoc />
    public UIThemeColors? ThemeColors => Session.ThemeColors;

    /// <inheritdoc />
    public UIClientState ClientState => Resolution.Handle.ClientState;

    /// <inheritdoc />
    public ITranslator Translator => _application.Translator;

    /// <inheritdoc />
    public bool HasController => _resolution is not null ? _resolution.Runtime is not null : _view!.HasController;

    /// <summary>Attaches the resolved view to its runtime on the host and binds the resulting <see cref="RuntimeResolution"/>.</summary>
    public async Task<RuntimeResolution> AttachRuntimeAsync(UIInstance instance, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(instance);

        UIViewResolution view = _view ?? throw new InvalidOperationException($"Transport '{InstanceId}' is already attached.");
        RuntimeResolution resolution = await _host.AttachRuntimeAsync(view, instance, cancellationToken).ConfigureAwait(false);
        _resolution = resolution;
        return resolution;
    }

    /// <inheritdoc />
    public TController Controller<TController>() where TController : class
    {
        IUIRuntime runtime = RequireRuntime();

        return runtime.Controller as TController
            ?? throw new InvalidOperationException($"The page at '{Route}' runs '{runtime.Controller.GetType().Name}', not '{typeof(TController).Name}'.");
    }

    private IUIRuntime RequireRuntime()
        => Resolution.Runtime ?? throw new InvalidOperationException($"The page at '{Route}' has no controller.");

    /// <inheritdoc />
    public Task<ServerChangeSet> BuildAttachChangesAsync(UIBindingId[] bindingIds, CancellationToken cancellationToken = default)
        => Resolution.Runtime is { } runtime
            ? runtime.BuildAttachChangesAsync(InstanceId, bindingIds, cancellationToken)
            : Task.FromResult(ServerChangeSet.Empty);

    /// <inheritdoc />
    public Task<UICommandExecutionResult> ProcessEventAsync(UICommandRequest request, CancellationToken cancellationToken = default)
        => _host.ProcessEventAsync(Resolution.Handle, request, cancellationToken);

    /// <inheritdoc />
    public Task<ServerChangeSet> ProcessChangeSetAsync(ClientChangeSet changeSet, CancellationToken cancellationToken = default)
        => _host.ProcessChangeSetAsync(Resolution.Handle, changeSet, cancellationToken);

    /// <inheritdoc />
    public Task<ServerChangeSet> RequestItemWindowAsync(UIItemWindowClientRequest request, CancellationToken cancellationToken = default)
        => _host.RequestItemWindowAsync(Resolution.Handle, request, cancellationToken);

    /// <inheritdoc />
    public Task<UICommandExecutionResult> NavigateInPlaceAsync(IReadOnlyDictionary<string, object?>? parameters, CancellationToken cancellationToken = default)
        => _host.NavigateInPlaceAsync(Resolution.Handle, parameters, cancellationToken);

    /// <inheritdoc />
    public Task<ServerChangeSet> FlushAsync(CancellationToken cancellationToken = default)
    {
        _ = RequireRuntime();
        return _host.FlushAsync(Resolution.Handle, cancellationToken);
    }

    /// <inheritdoc />
    public async Task ReportClientStateAsync(UIClientState state, CancellationToken cancellationToken = default)
    {
        _host.ReportClientState(Resolution.Handle, state);

        if (Resolution.Runtime is { } runtime)
            await runtime.WhenPostedRanAsync().WaitAsync(cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public bool SessionHolds(ClientEffect effect)
    {
        IUserSessionContext session = Session;

        return effect switch
        {
            SetLanguageEffect language => string.Equals(language.Language, session.Language, StringComparison.Ordinal),
            SetThemeEffect theme => theme.Stored || theme.Mode == session.ThemeMode,
            SetThemeColorsEffect colors => Equals(colors.Colors, session.ThemeColors),
            _ => true
        };
    }

    /// <inheritdoc />
    public async Task ApplySettingAsync(ClientEffect setting, CancellationToken cancellationToken = default)
    {
        IUserSessionStore store = _services.GetRequiredService<IUserSessionStore>();
        var sessionId = Session.SessionId;

        UserSessionState? written = setting switch
        {
            SetLanguageEffect language => await store.SetLanguageAsync(sessionId, language.Language, cancellationToken).ConfigureAwait(false),
            SetThemeEffect theme => await store.SetThemeModeAsync(sessionId, theme.Mode, cancellationToken).ConfigureAwait(false),
            SetThemeColorsEffect colors => await store.SetThemeColorsAsync(sessionId, colors.Colors, cancellationToken).ConfigureAwait(false),
            _ => null
        };

        if (written is not null)
            await _host.ApplySessionChangeAsync(Resolution.Handle, written, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task CloseAsync(CancellationToken cancellationToken = default)
    {
        _ = _host.DetachRuntime(Resolution.Handle);
        _onClose?.Invoke(InstanceId);

        if (Resolution.Runtime is { } runtime)
            await runtime.WhenPostedRanAsync().WaitAsync(cancellationToken).ConfigureAwait(false);
    }
}
