using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Client;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Testing;

/// <summary>An open in-process test page holding synchronized client state and driving host actions.</summary>
public sealed class UITestPage
{
    private readonly UITestApp _app;
    private readonly InProcessUIClientTransport _transport;
    private readonly UITestSession _initialSession;

    internal UITestPage(UITestApp app, UIClientPage clientPage, InProcessUIClientTransport transport, UITestSession session)
    {
        _app = app;
        ClientPage = clientPage;
        _transport = transport;
        _initialSession = session;
    }

    /// <summary>Gets the underlying platform-neutral client page.</summary>
    public UIClientPage ClientPage { get; }

    /// <summary>Gets the component-local UI preference store (<c>ne.ui:&lt;id&gt;:&lt;slot&gt;</c>).</summary>
    public UIClientStore Store => ClientPage.Store;

    /// <summary>Gets the route that answered: the one asked for, or where a refusal or a filter sent the page.</summary>
    public string Route => ClientPage.Route;

    /// <summary>Gets the address the page shows, as a browser's address bar would after every address effect it received.</summary>
    public string Address => ClientPage.Address;

    /// <summary>Gets the navigation the page stands at: its route and the parameters its address carries.</summary>
    public UINavigationRequest Navigation => ClientPage.Navigation;

    /// <summary>Gets whether the page has an earlier address history entry to step back to.</summary>
    public bool CanGoBack => ClientPage.CanGoBack;

    /// <summary>Gets whether the page has a later address history entry to step forward to.</summary>
    public bool CanGoForward => ClientPage.CanGoForward;

    /// <summary>Gets the active responsive breakpoint tier of the page (defaults to <see cref="UIResponsiveTier.Xxl"/>).</summary>
    public UIResponsiveTier ResponsiveTier => ClientPage.ResponsiveTier;

    /// <summary>Gets the language the page shows its words in: its session's.</summary>
    public string Language => ClientPage.Language;

    /// <summary>Gets the session of this page, reflecting sign-in, sign-out, language, time zone and notification permission updates.</summary>
    public UITestSession Session => _app.ReadCurrentSession(_transport, _initialSession, ClientState.NotificationPermission);

    /// <summary>The page's compiled view, for the component and row handles.</summary>
    internal CompiledView View => ClientPage.View;

    /// <summary>Gets every effect the page received, in order: from command answers, pushes and the view's own interactions.</summary>
    public IReadOnlyList<ClientEffect> Effects => ClientPage.Effects;

    /// <summary>Gets every file the application sent the page to save, in order.</summary>
    public IReadOnlyList<UITestDownload> Downloads
    {
        get
        {
            IReadOnlyList<UIClientDownload> downloads = ClientPage.Downloads;
            UITestDownload[] mapped = new UITestDownload[downloads.Count];

            for (var i = 0; i < mapped.Length; i++)
                mapped[i] = UITestDownload.From(downloads[i]);

            return mapped;
        }
    }

    /// <summary>Gets the dialogs open on the page, by key, from bottom to top.</summary>
    public IReadOnlyCollection<string> OpenDialogs => ClientPage.OpenDialogs;

    /// <summary>Gets what the page's view compile warned of, each of its kind: a binding naming nothing, or advice.</summary>
    public IReadOnlyList<UICompileWarning> CompileWarnings => ClientPage.CompileWarnings;

    /// <summary>Gets whether the page holds work its reader has not saved, as the controller last said.</summary>
    public bool HoldsUnsavedWork => ClientPage.HoldsUnsavedWork;

    /// <summary>Sets the active responsive breakpoint tier of the page.</summary>
    public void SetResponsiveTier(UIResponsiveTier tier)
        => ClientPage.SetResponsiveTier(tier);

    /// <summary>Sets the active responsive breakpoint tier from a viewport width in pixels (<c>640 / 768 / 1280 / 1536</c>).</summary>
    public void SetViewportWidth(double width)
        => ClientPage.SetViewportWidth(width);

    /// <summary>Steps back to the previous address history entry of this page and notifies the controller in place.</summary>
    public async Task<UITestCommandResult> GoBackAsync(CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await ClientPage.GoBackAsync(cancellationToken).ConfigureAwait(false));

    /// <summary>Steps forward to the next address history entry of this page and notifies the controller in place.</summary>
    public async Task<UITestCommandResult> GoForwardAsync(CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await ClientPage.GoForwardAsync(cancellationToken).ConfigureAwait(false));

    /// <summary>Gets the effects of one type the page received, in order.</summary>
    public IReadOnlyList<TEffect> EffectsOf<TEffect>() where TEffect : ClientEffect
        => ClientPage.EffectsOf<TEffect>();

    /// <summary>Clears the recorded client effects on this page.</summary>
    public void ClearEffects()
        => ClientPage.ClearEffects();

    /// <summary>Clears the recorded file downloads on this page.</summary>
    public void ClearDownloads()
        => ClientPage.ClearDownloads();

    /// <summary>Gets whether the dialog <paramref name="key"/> is open.</summary>
    public bool IsDialogOpen(string key)
        => ClientPage.IsDialogOpen(key);

    /// <summary>Dismisses the open dialog <paramref name="key"/> via Escape or backdrop, discarding its buffered form and raising <c>OnClose</c>.</summary>
    /// <exception cref="InvalidOperationException">The dialog is not open, or takes neither Escape nor a press beside it.</exception>
    public async Task<UITestCommandResult> DismissDialogAsync(string key, CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await ClientPage.DismissDialogAsync(key, cancellationToken).ConfigureAwait(false));

    /// <summary>Gets whether the <paramref name="side"/> drawer is currently open as an overlay drawer.</summary>
    public bool IsDrawerOpen(UISide side)
        => ClientPage.IsDrawerOpen(side);

    /// <summary>Opens the <paramref name="side"/> overlay drawer when that side acts as a drawer at the current viewport tier, raising <c>open</c> on its root when wired.</summary>
    public async Task<UITestCommandResult> OpenDrawerAsync(UISide side, CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await ClientPage.OpenDrawerAsync(side, cancellationToken).ConfigureAwait(false));

    /// <summary>Closes the <paramref name="side"/> overlay drawer when open.</summary>
    public void CloseDrawer(UISide side)
        => ClientPage.CloseDrawer(side);

    /// <summary>Gets the component currently open in the full-height expanded field modal, or <see langword="null"/> when none is open.</summary>
    public UITestComponent? ExpandedField => ClientPage.ExpandedField is { } expanded ? new UITestComponent(this, expanded) : null;

    /// <summary>Gets the authored id of the field currently open in the full-height expanded field modal, or <see langword="null"/> when none is open.</summary>
    public string? ExpandedFieldId => ClientPage.ExpandedFieldId;

    /// <summary>Gets whether the field with authored id <paramref name="componentId"/> currently stands open in the expanded field modal.</summary>
    public bool IsFieldExpanded(string componentId)
        => ClientPage.IsFieldExpanded(componentId);

    /// <summary>Closes the currently open expanded field modal when one is open.</summary>
    public void CloseExpandedField()
        => ClientPage.CloseExpandedField();

    /// <summary>Closes any open context menu on the page.</summary>
    public void CloseContextMenu()
        => ClientPage.CloseContextMenu();

    /// <summary>Gets the page's controller as <typeparamref name="TController"/>.</summary>
    /// <exception cref="InvalidOperationException">The page has no controller, or one of another type.</exception>
    public TController Controller<TController>() where TController : class
        => ClientPage.Controller<TController>();

    /// <summary>Gets the root component of the declared dialog <paramref name="key"/>.</summary>
    /// <exception cref="InvalidOperationException">The view declares no dialog with that key.</exception>
    public UITestComponent Dialog(string key)
        => new(this, ClientPage.Dialog(key));

    /// <summary>Gets the component with the authored id <paramref name="id"/>.</summary>
    /// <exception cref="InvalidOperationException">The view has no such component, or it stands in a list's rows.</exception>
    public UITestComponent Component(string id)
        => new(this, ClientPage.Component(id));

    /// <summary>Gets the one component in the active view or modal dialog whose value — else another property — is bound to <paramref name="path"/> on the controller.</summary>
    public UITestComponent ComponentBoundTo<TSource>(Expression<Func<TSource, object?>> path)
        => new(this, ClientPage.ComponentBoundTo(path));

    /// <summary>Gets the one component in the active view or modal dialog whose value — else another property — is bound to <paramref name="path"/> on the controller.</summary>
    public UITestComponent ComponentBoundTo(string path)
        => new(this, ClientPage.ComponentBoundTo(path));

    /// <summary>Gets the one component in the active view or modal dialog a reader knows by <paramref name="name"/>: its title, accessible name or tooltip, as written or as shown.</summary>
    public UITestComponent ComponentNamed(string name)
        => new(this, ClientPage.ComponentNamed(name));

    /// <summary>
    /// Gets <paramref name="value"/> as the page shows it in its language: a key or a phrase translated, a validation message's words;
    /// null for none, a NaN or an infinity among them.
    /// </summary>
    public string? Words(object? value)
        => ClientPage.Words(value);

    /// <summary>Delivers what the runtime holds for its pages, as the scheduled flush does.</summary>
    public Task FlushAsync(CancellationToken cancellationToken = default)
        => ClientPage.FlushAsync(cancellationToken);

    /// <summary>Asks the page whether it may leave for <paramref name="target"/>, running the controller's leave hook while holding unsaved work.</summary>
    public async Task<UITestCommandResult> RequestLeaveAsync(string target, CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await ClientPage.RequestLeaveAsync(target, cancellationToken).ConfigureAwait(false));

    /// <summary>Presses the action a notification offered — its Undo — through the command path, once, as a press on the toast does.</summary>
    /// <exception cref="InvalidOperationException">The notification offers no action.</exception>
    public async Task<UITestCommandResult> PressNotificationActionAsync(ShowNotificationEffect notification, CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await ClientPage.PressNotificationActionAsync(notification, cancellationToken).ConfigureAwait(false));

    /// <summary>Follows a system notification click on this page: navigates through the page's leave guard when <see cref="ShowSystemNotificationEffect.Address"/> names another address, otherwise runs <see cref="ShowSystemNotificationEffect.Action"/>.</summary>
    /// <exception cref="InvalidOperationException">The page already stands at the notification's address (or none was given) and the notification offers no action.</exception>
    public async Task<UITestCommandResult> PressNotificationActionAsync(ShowSystemNotificationEffect notification, CancellationToken cancellationToken = default)
        => UITestCommandResult.From(await ClientPage.PressNotificationActionAsync(notification, cancellationToken).ConfigureAwait(false));

    /// <summary>Gets what the page last reported of itself: whether it is on screen, and its notification permission.</summary>
    public UIClientState ClientState => ClientPage.ClientState;

    /// <summary>Marks the page hidden and awaits the controller's <c>OnVisibilityChangedAsync</c> hook.</summary>
    public Task HideAsync(CancellationToken cancellationToken = default)
        => ClientPage.HideAsync(cancellationToken);

    /// <summary>Marks the page visible and awaits the controller's <c>OnVisibilityChangedAsync</c> hook.</summary>
    public Task ShowAsync(CancellationToken cancellationToken = default)
        => ClientPage.ShowAsync(cancellationToken);

    /// <summary>Reports <paramref name="permission"/> and awaits the controller's <c>OnNotificationPermissionChangedAsync</c> hook.</summary>
    public Task ReportNotificationPermissionAsync(UINotificationPermission permission, CancellationToken cancellationToken = default)
        => ClientPage.ReportNotificationPermissionAsync(permission, cancellationToken);

    /// <summary>Opens <paramref name="address"/> in another page of this page's session, as following a link to it would.</summary>
    public Task<UITestPage> OpenAsync(string address, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(address);

        return OpenAsync(UINavigationAddress.Parse(address), cancellationToken);
    }

    /// <summary>Opens <paramref name="navigation"/> — a <see cref="NavigateEffect"/>'s request — in another page of this page's session.</summary>
    public Task<UITestPage> OpenAsync(UINavigationRequest navigation, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(navigation);

        return _app.OpenFromPageAsync(navigation, _transport.SessionId, _initialSession, ClientState.NotificationPermission, cancellationToken);
    }

    /// <summary>Detaches the page from its runtime as closing its tab does, awaiting <c>OnDetachedAsync</c>.</summary>
    /// <remarks>The runtime remains subject to its retention policy, and a closed page accepts no further actions.</remarks>
    public Task CloseAsync(CancellationToken cancellationToken = default)
        => ClientPage.CloseAsync(cancellationToken);
}
