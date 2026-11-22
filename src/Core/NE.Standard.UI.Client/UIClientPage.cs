using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Primitives.Text;
using NE.Standard.UI.Serialization;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Client;

/// <summary>
/// One open client page: holds its live state, applies server change sets and effects, evaluates client interactions,
/// validation rules, item filters and sorts, and acts through an <see cref="IUIClientTransport"/>.
/// </summary>
public sealed partial class UIClientPage
{
    private readonly Lock _sync = new();

    private UINavigationRequest _navigation;
    private readonly List<UINavigationRequest> _history = [];
    private int _historyIndex;
    private UIResponsiveTier _responsiveTier = UIResponsiveTier.Xxl;

    private readonly Dictionary<UIPropertyAddress, object?> _values = [];
    private readonly Dictionary<(UIComponentId Id, UIProperty Property), HashSet<UIPropertyAddress>> _scopedValues = [];
    private readonly Dictionary<(UIComponentAddress Host, string Key), HashSet<UIPropertyAddress>> _valuesByRow = [];
    private readonly Dictionary<UIComponentAddress, HashSet<string>> _rowKeysByHost = [];
    private readonly Dictionary<UIComponentAddress, UIClientRowBuffer> _rows = [];
    private readonly Dictionary<UIComponentAddress, (long Stamp, string Language, List<UIClientRowEntry> Rows)> _visibleRowsCache = [];
    private long _visibleRowsStamp;
    private readonly Dictionary<UIComponentAddress, UIClientField> _fields = [];
    private readonly Dictionary<UIPropertyAddress, object?> _held = [];
    // The server's latest value of a held address, which a discard puts back.
    private readonly Dictionary<UIPropertyAddress, object?> _serverValues = [];
    private readonly HashSet<UIComponentAddress> _openedRenames = [];
    private readonly HashSet<UIPropertyAddress> _redirectedTargets = [];
    private readonly HashSet<UIPropertyAddress> _contentValues = [];
    private readonly Dictionary<int, PendingClientCommand> _pendingCommands = [];
    private int _nextRequestId;
    private readonly List<ClientEffect> _effects = [];
    private readonly List<UIClientDownload> _downloads = [];
    private readonly List<string> _openDialogs = [];
    private readonly HashSet<UISide> _pinnedDrawers = [];
    private bool _pinsInitialized;
    private UISide? _openDrawer;
    private UIComponentAddress? _expandedField;
    private UIComponentAddress? _openContextMenu;
    // What effects left for after the act, run once the lock is let go (RunReactionsAsync).
    private readonly List<UIClientReaction> _reactions = [];
    private bool _resync;
    private Task _pendingReactionDrain = Task.CompletedTask;

    private readonly HashSet<UIPropertyAddress> _changedProperties = [];
    private readonly HashSet<UIComponentAddress> _changedCollections = [];
    private readonly HashSet<UIComponentAddress> _changedValidations = [];
    private readonly List<ClientEffect> _changedEffects = [];
    private bool _dialogsChanged;
    private bool _tierChanged;
    private bool _navigationChanged;
    private bool _languageOrThemeChanged;
    private bool _fullResyncOccurred;

    /// <summary>Initializes a new <see cref="UIClientPage"/> over <paramref name="transport"/>.</summary>
    public UIClientPage(IUIClientTransport transport, IUIClientStorageProvider? storage = null)
    {
        ArgumentNullException.ThrowIfNull(transport);

        Transport = transport;
        _navigation = transport.InitialNavigation;
        StandInAddress = NormalizeStandInAddress(transport.InitialAddress, _navigation);
        _history.Add(_navigation);
        Store = new UIClientStore(transport.View, storage ?? new InMemoryUIClientStorageProvider());
    }

    /// <summary>Raised after a batch of server updates, client edits, interactions, effects or tier changes has been applied.</summary>
    [SuppressMessage("Design", "CA1003:Use generic event handler instances", Justification = "Client page subscriptions take the change batch directly without a redundant sender or EventArgs base class.")]
    public event Action<UIClientPageChange>? Changed;

    /// <summary>Gets the transport backing this page.</summary>
    public IUIClientTransport Transport { get; }

    /// <summary>Gets the component-local UI preference store (<c>ne.ui:&lt;id&gt;:&lt;slot&gt;</c>).</summary>
    public UIClientStore Store { get; }

    /// <summary>Gets the route that answered: the one asked for, or where a refusal or a filter sent the page.</summary>
    public string Route => Transport.Route;

    private string? StandInAddress { get; set; }

    /// <summary>Gets the address the page shows, as an address bar would after every address effect it received.</summary>
    public string Address
    {
        get
        {
            lock (_sync)
                return StandInAddress ?? UINavigationAddress.Format(_navigation);
        }
    }

    /// <summary>Gets the navigation the page stands at: its route and the parameters its address carries.</summary>
    public UINavigationRequest Navigation
    {
        get
        {
            lock (_sync)
                return _navigation;
        }
    }

    /// <summary>Gets whether the page has an earlier address history entry to step back to.</summary>
    public bool CanGoBack
    {
        get
        {
            lock (_sync)
                return _historyIndex > 0;
        }
    }

    /// <summary>Gets whether the page has a later address history entry to step forward to.</summary>
    public bool CanGoForward
    {
        get
        {
            lock (_sync)
                return _historyIndex + 1 < _history.Count;
        }
    }

    /// <summary>Gets the active responsive breakpoint tier of the page (defaults to <see cref="UIResponsiveTier.Xxl"/>).</summary>
    public UIResponsiveTier ResponsiveTier
    {
        get
        {
            lock (_sync)
                return _responsiveTier;
        }
    }

    /// <summary>Gets the language the page shows its words in: its session's.</summary>
    public string Language => Transport.Language;

    /// <summary>Gets the theme mode of the page's session.</summary>
    public UIThemeMode? ThemeMode => Transport.ThemeMode;

    /// <summary>Gets the custom theme colours of the page's session, or <see langword="null"/> for the default palette.</summary>
    public UIThemeColors? ThemeColors => Transport.ThemeColors;

    /// <summary>Gets the page's compiled view.</summary>
    public CompiledView View => Transport.View;

    /// <summary>Gets every effect the page received, in order: from command answers, pushes and the view's own interactions.</summary>
    public IReadOnlyList<ClientEffect> Effects
    {
        get
        {
            lock (_sync)
                return [.. _effects];
        }
    }

    /// <summary>Gets every file the application sent the page to save, in order.</summary>
    public IReadOnlyList<UIClientDownload> Downloads
    {
        get
        {
            lock (_sync)
                return [.. _downloads];
        }
    }

    /// <summary>Gets the dialogs open on the page, by key, from bottom to top.</summary>
    public IReadOnlyCollection<string> OpenDialogs
    {
        get
        {
            lock (_sync)
                return [.. _openDialogs];
        }
    }

    /// <summary>Gets what the page's view compile warned of, each of its kind: a binding naming nothing, or advice.</summary>
    public IReadOnlyList<UICompileWarning> CompileWarnings => View.Warnings;

    /// <summary>Gets whether the page holds work its reader has not saved, as the controller last said.</summary>
    public bool HoldsUnsavedWork { get; private set; }

    /// <summary>Sets the active responsive breakpoint tier of the page.</summary>
    public void SetResponsiveTier(UIResponsiveTier tier)
    {
        lock (_sync)
        {
            if (_responsiveTier == tier)
                return;

            _responsiveTier = tier;
            if (_openDrawer is UISide openSide && !IsSideDrawerNoLock(openSide))
            {
                _openDrawer = null;
                _dialogsChanged = true;
            }

            _tierChanged = true;
        }

        NotifyIfChanged();
    }

    /// <summary>Sets the active responsive breakpoint tier from a viewport width in pixels (<c>640 / 768 / 1280 / 1536</c>).</summary>
    public void SetViewportWidth(double width)
        => SetResponsiveTier(ResolveTierForWidth(width));

    /// <summary>Resolves the <see cref="UIResponsiveTier"/> corresponding to <paramref name="width"/> in pixels.</summary>
    public static UIResponsiveTier ResolveTierForWidth(double width)
        => width switch
        {
            < 640 => UIResponsiveTier.Base,
            < 768 => UIResponsiveTier.Sm,
            < 1280 => UIResponsiveTier.Md,
            < 1536 => UIResponsiveTier.Xl,
            _ => UIResponsiveTier.Xxl
        };

    /// <summary>Steps back to the previous address history entry of this page and notifies the controller in place.</summary>
    public Task<UIClientCommandResult> GoBackAsync(CancellationToken cancellationToken = default)
        => StepHistoryAsync(-1, cancellationToken);

    /// <summary>Steps forward to the next address history entry of this page and notifies the controller in place.</summary>
    public Task<UIClientCommandResult> GoForwardAsync(CancellationToken cancellationToken = default)
        => StepHistoryAsync(1, cancellationToken);

    private async Task<UIClientCommandResult> StepHistoryAsync(int delta, CancellationToken cancellationToken)
    {
        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        IReadOnlyDictionary<string, object?>? parameters;
        int mark;

        lock (_sync)
        {
            var nextIndex = _historyIndex + delta;

            if (nextIndex < 0)
                throw new InvalidOperationException("The page stands at its first history entry: a reader cannot go back.");

            if (nextIndex >= _history.Count)
                throw new InvalidOperationException("The page stands at its latest history entry: a reader cannot go forward.");

            _historyIndex = nextIndex;
            _navigation = _history[nextIndex];
            StandInAddress = null;
            _navigationChanged = true;
            parameters = _navigation.Parameters;
            mark = _effects.Count;
        }

        if (!Transport.HasController)
        {
            NotifyIfChanged();
            return UIClientCommandResult.RanOnPage(EffectsSince(mark));
        }

        UICommandExecutionResult result = await Transport.NavigateInPlaceAsync(parameters, cancellationToken).ConfigureAwait(false);

        lock (_sync)
        {
            ApplyNoLock(result.Changes.For(Transport.InstanceId));
            ApplyEffectsNoLock(result.Command.Effects);
        }

        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();

        return UIClientCommandResult.Answered(result.Command.Success, result.Command.Error, EffectsSince(mark));
    }

    /// <summary>Gets the effects of one type the page received, in order.</summary>
    public IReadOnlyList<TEffect> EffectsOf<TEffect>() where TEffect : ClientEffect
    {
        List<TEffect> found = [];

        lock (_sync)
        {
            foreach (ClientEffect effect in _effects)
            {
                if (effect is TEffect typed)
                    found.Add(typed);
            }
        }

        return found;
    }

    /// <summary>Clears the recorded client effects on this page.</summary>
    public void ClearEffects()
    {
        lock (_sync)
            _effects.Clear();
    }

    /// <summary>Clears the recorded file downloads on this page.</summary>
    public void ClearDownloads()
    {
        lock (_sync)
            _downloads.Clear();
    }

    /// <summary>Gets whether the dialog <paramref name="key"/> is open.</summary>
    public bool IsDialogOpen(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        lock (_sync)
            return _openDialogs.Contains(key);
    }

    /// <summary>Dismisses the open dialog <paramref name="key"/> via Escape or backdrop, discarding its buffered form and raising <c>OnClose</c>.</summary>
    /// <exception cref="InvalidOperationException">The dialog is not open, or takes neither Escape nor a press beside it.</exception>
    public async Task<UIClientCommandResult> DismissDialogAsync(string key, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        UIComponentId root;

        lock (_sync)
        {
            CompiledDialog dialog = View.FindDialog(key) ?? throw new InvalidOperationException($"The page at '{Route}' declares no dialog '{key}'.");

            if (!_openDialogs.Contains(key))
                throw new InvalidOperationException($"Dialog '{key}' is not open: a reader cannot dismiss it.");

            if (!dialog.CloseOnEscape && !dialog.CloseOnBackdrop)
                throw new InvalidOperationException($"Dialog '{key}' takes neither Escape nor a press beside it: only its own buttons close it.");

            DiscardDialogFormNoLock(dialog);
            _ = _openDialogs.Remove(key);
            _dialogsChanged = true;
            root = dialog.RootComponentId;
        }

        return await DispatchCoreAsync(root, [], EventNames.Close, [], cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Gets whether the <paramref name="side"/> drawer is currently open as an overlay drawer.</summary>
    public bool IsDrawerOpen(UISide side)
    {
        EnsureDrawerSide(side);

        lock (_sync)
            return _openDrawer == side && IsSideDrawerNoLock(side);
    }

    /// <summary>Opens the <paramref name="side"/> overlay drawer when that side acts as a drawer at the current viewport tier, raising <c>open</c> on its root when wired.</summary>
    public async Task<UIClientCommandResult> OpenDrawerAsync(UISide side, CancellationToken cancellationToken = default)
    {
        EnsureDrawerSide(side);

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        UIComponentId root;
        bool hasOpen;
        int mark;

        lock (_sync)
        {
            var regionKey = DrawerRegionKey(side);
            CompiledRegion region = View.FindRegion(regionKey) ?? throw new InvalidOperationException($"The page at '{Route}' declares no '{regionKey}' region.");
            mark = _effects.Count;

            if (_openDrawer == side || !IsSideDrawerNoLock(side))
                return UIClientCommandResult.RanOnPage([]);

            _openDrawer = side;
            _dialogsChanged = true;
            root = region.RootComponentId;
            hasOpen = HasEventOrInteraction(root, [], EventNames.Open);
        }

        if (hasOpen)
            return await DispatchCoreAsync(root, [], EventNames.Open, [], cancellationToken).ConfigureAwait(false);

        NotifyIfChanged();
        return UIClientCommandResult.RanOnPage(EffectsSince(mark));
    }

    /// <summary>Closes the <paramref name="side"/> overlay drawer when open.</summary>
    public void CloseDrawer(UISide side)
    {
        EnsureDrawerSide(side);

        var closed = false;
        lock (_sync)
        {
            if (_openDrawer == side)
            {
                _openDrawer = null;
                _dialogsChanged = true;
                closed = true;
            }
        }

        if (closed)
            NotifyIfChanged();
    }

    private static void EnsureDrawerSide(UISide side)
    {
        if (side is not (UISide.Left or UISide.Right))
            throw new ArgumentOutOfRangeException(nameof(side), side, "A side drawer must be UISide.Left or UISide.Right.");
    }

    private static string DrawerRegionKey(UISide side)
        => side == UISide.Right ? RegionNames.RightSide : RegionNames.LeftSide;

    internal bool IsSideDrawerNoLock(UISide side)
    {
        var regionKey = DrawerRegionKey(side);
        if (View.FindRegion(regionKey) is null)
            return false;

        if (side == UISide.Left && HasBottomBar())
            return false;

        if (!SidesAreDrawersAtTier(View.Options.SideDrawers, _responsiveTier))
            return false;

        return !(IsSidePinnedNoLock(side) && _responsiveTier >= UIResponsiveTier.Xl);
    }

    private bool HasBottomBar()
        => View.Options.SideDrawers != UISideDrawers.Never && View.Options.RailBottomBar && IsRailAlone(RegionNames.LeftSide);

    private bool IsRailAlone(string regionKey)
    {
        if (FindSideSingleMenu(regionKey) is not UIComponentNode menu)
            return false;

        if (!View.State.TryGetValue(menu.ComponentId, MenuComponent.DisplayProperty, out CompiledUIPropertyValue? display) || display.IsBind)
            return false;

        return RecursiveValueCoercion.TryCoerce(display.Value, out UIResponsive<UIMenuDisplay> shape) && shape.Base == UIMenuDisplay.Rail;
    }

    private UIComponentNode? FindSideSingleMenu(string regionKey)
    {
        if (View.FindRegion(regionKey) is not CompiledRegion region)
            return null;

        UIComponentNode node = View.Graph.GetRequired(region.RootComponentId);

        while (node.TypeKey is "standard.container" or "standard.stack-panel" or "standard.scroll-container" or "standard.surface")
        {
            if (OnlyChildOf(node) is not UIComponentId child)
                return null;

            node = View.Graph.GetRequired(child);
        }

        return string.Equals(node.TypeKey, MenuComponent.ComponentTypeKey, StringComparison.Ordinal) ? node : null;
    }

    private static UIComponentId? OnlyChildOf(UIComponentNode node)
    {
        if (node.Children.Length == 1 && node.Slots.Length == 0)
            return node.Children[0];

        if (node.Children.Length == 0 && node.Slots.Length == 1 && node.Slots[0].Kind == UIComponentSlotKind.Region)
            return node.Slots[0].RootComponentId;

        return null;
    }

    private static bool SidesAreDrawersAtTier(UISideDrawers drawers, UIResponsiveTier tier)
        => drawers switch
        {
            UISideDrawers.Never => false,
            UISideDrawers.BelowMd => tier < UIResponsiveTier.Md,
            UISideDrawers.BelowXl => tier < UIResponsiveTier.Xl,
            UISideDrawers.BelowXxl => tier < UIResponsiveTier.Xxl,
            UISideDrawers.Always => true,
            _ => false
        };

    internal bool IsSidePinnedNoLock(UISide side)
    {
        EnsurePinsInitializedNoLock();
        return _pinnedDrawers.Contains(side);
    }

    private void EnsurePinsInitializedNoLock()
    {
        if (_pinsInitialized)
            return;

        _pinsInitialized = true;
        LoadStoredPinNoLock(UISide.Left);
        LoadStoredPinNoLock(UISide.Right);
    }

    private void LoadStoredPinNoLock(UISide side)
    {
        if (FirstAuthoredIdInSide(side) is string ownerId && string.Equals(Store.Get(ownerId, "pinned"), "true", StringComparison.Ordinal))
            _ = _pinnedDrawers.Add(side);
    }

    internal string? FirstAuthoredIdInSide(UISide side)
    {
        if (View.FindRegion(DrawerRegionKey(side)) is not CompiledRegion region)
            return null;

        return FindFirstAuthoredId(region.RootComponentId);
    }

    private string? FindFirstAuthoredId(UIComponentId rootId)
    {
        UIComponentNode node = View.Graph.GetRequired(rootId);
        if (node.HasAuthoredId)
            return node.AuthoringId;

        for (var i = 0; i < node.Children.Length; i++)
        {
            if (FindFirstAuthoredId(node.Children[i]) is string childId)
                return childId;
        }

        for (var i = 0; i < node.Slots.Length; i++)
        {
            if (FindFirstAuthoredId(node.Slots[i].RootComponentId) is string slotId)
                return slotId;
        }

        return null;
    }

    /// <summary>Gets the component currently open in the full-height expanded field modal, or <see langword="null"/> when none is open.</summary>
    public UIClientComponent? ExpandedField
    {
        get
        {
            lock (_sync)
                return _expandedField is UIComponentAddress expanded ? At(expanded.Id, expanded.DynamicParameters) : null;
        }
    }

    /// <summary>Gets the authored id of the field currently open in the full-height expanded field modal, or <see langword="null"/> when none is open.</summary>
    public string? ExpandedFieldId
    {
        get
        {
            lock (_sync)
                return _expandedField is UIComponentAddress expanded ? View.Graph.GetRequired(expanded.Id).AuthoringId : null;
        }
    }

    /// <summary>Gets whether the field with authored id <paramref name="componentId"/> currently stands open in the expanded field modal.</summary>
    public bool IsFieldExpanded(string componentId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);

        lock (_sync)
        {
            return _expandedField is UIComponentAddress expanded
                && View.Graph.TryGetComponentId(componentId, out UIComponentId id)
                && expanded.Id == id;
        }
    }

    internal bool IsFieldExpanded(UIComponentId componentId, object?[] rowKeys)
    {
        lock (_sync)
            return _expandedField == new UIComponentAddress(componentId, rowKeys);
    }

    /// <summary>Closes the currently open expanded field modal when one is open.</summary>
    public void CloseExpandedField()
    {
        var closed = false;
        lock (_sync)
        {
            if (_expandedField is not null)
            {
                _expandedField = null;
                _dialogsChanged = true;
                closed = true;
            }
        }

        if (closed)
            NotifyIfChanged();
    }

    /// <summary>Closes any open context menu on the page.</summary>
    public void CloseContextMenu()
    {
        lock (_sync)
            _openContextMenu = null;
    }

    internal void TryOpenContextMenu(UIComponentId ownerId, object?[] rowKeys)
    {
        lock (_sync)
        {
            if (IsShownNoLock(ownerId, rowKeys) && IsEnabledNoLock(ownerId, rowKeys) && CanShowContextMenuOnOwnerNoLock(ownerId, rowKeys))
                _openContextMenu = new UIComponentAddress(ownerId, rowKeys);
        }
    }

    /// <summary>Gets the page's in-process controller as <typeparamref name="TController"/>.</summary>
    public TController Controller<TController>() where TController : class
        => Transport.Controller<TController>();

    /// <summary>Gets the root component of the declared dialog <paramref name="key"/>.</summary>
    /// <exception cref="InvalidOperationException">The view declares no dialog with that key.</exception>
    public UIClientComponent Dialog(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        CompiledDialog dialog = View.FindDialog(key) ?? throw new InvalidOperationException($"The page at '{Route}' declares no dialog '{key}'.");
        return At(dialog.RootComponentId, []);
    }

    /// <summary>Gets the component with the authored id <paramref name="id"/>.</summary>
    /// <exception cref="InvalidOperationException">The view has no such component, or it stands in a list's rows.</exception>
    public UIClientComponent Component(string id)
        => Find(id, scope: null, rowKeys: []);

    /// <summary>Gets the component with the compiled <paramref name="componentId"/> in the given <paramref name="rowKeys"/> scope.</summary>
    public UIClientComponent Component(UIComponentId componentId, object?[]? rowKeys = null)
        => At(componentId, rowKeys ?? []);

    /// <summary>Gets the one component in the active view or modal dialog whose value — else another property — is bound to <paramref name="path"/> on the controller.</summary>
    public UIClientComponent ComponentBoundTo<TSource>(Expression<Func<TSource, object?>> path)
        => ComponentBoundTo(RecursivePath.FromExpression(path).ToString());

    /// <summary>Gets the one component in the active view or modal dialog whose value — else another property — is bound to <paramref name="path"/> on the controller.</summary>
    public UIClientComponent ComponentBoundTo(string path)
        => FindBoundTo(path, scope: null, rowKeys: []);

    /// <summary>Gets the one component in the active view or modal dialog a reader knows by <paramref name="name"/>: its title, accessible name or tooltip, as written or as shown.</summary>
    public UIClientComponent ComponentNamed(string name)
        => FindNamed(name, scope: null, rowKeys: []);

    /// <summary>Formats <paramref name="value"/> as displayed in the page's language, or <see langword="null"/> when empty or non-finite.</summary>
    public string? Words(object? value)
        => Words(value, translatable: true);

    internal string? Words(object? value, bool translatable)
    {
        var language = Language;
        ITranslator translator = Transport.Translator;

        return value switch
        {
            // A NaN or an infinity is the null the page holds it as.
            _ when UIScriptNumber.ReadsAsNull(value) => null,
            UIValidationMessage message => Words(message.Message, translatable),
            UIPhrase { IsText: true } text => translatable ? translator.Translate(language, text.Key) : text.Key,
            UIPhrase phrase => translator.Translate(language, phrase.Key, phrase.Arguments),
            IReadOnlyDictionary<string, object?> wirePhrase when CompiledViewWireSerializer.CoerceWireValue(typeof(UIPhrase), wirePhrase) is UIPhrase coercedPhrase => Words(coercedPhrase, translatable),
            string text => translatable ? translator.Translate(language, text) : text,
            // As the page writes them: a number by its shortest digits (1.5, not 1.50), a flag in the wire's words.
            _ => UIScriptText.Of(value)
        };
    }

    /// <summary>Delivers what the runtime holds for its pages, as the scheduled flush does.</summary>
    public async Task FlushAsync(CancellationToken cancellationToken = default)
    {
        _ = await Transport.FlushAsync(cancellationToken).ConfigureAwait(false);

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();
    }

    /// <summary>Reads a window of items for the windowed host <paramref name="componentId"/>.</summary>
    public async Task RequestItemWindowAsync(UIComponentId componentId, object?[] rowKeys, UIItemAnchor anchor, int count, UIItemWindowMode mode = UIItemWindowMode.Replace, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(rowKeys);

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        UIComponentNode node = View.Graph.GetRequired(componentId);

        if (!IsShown(componentId, rowKeys))
            throw new InvalidOperationException($"'{node.AuthoringId}' is not shown: a reader cannot scroll its window.");

        ServerChangeSet changes = await Transport.RequestItemWindowAsync(
            new Shell.Data.UIItemWindowClientRequest
            {
                ComponentId = componentId,
                DynamicParameters = rowKeys,
                Anchor = anchor,
                Count = count,
                Mode = mode
            },
            cancellationToken
        ).ConfigureAwait(false);

        ApplyReceivedChanges(changes);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();
    }

    /// <summary>Asks the page whether it may leave for <paramref name="target"/>, running the controller's leave hook while holding unsaved work.</summary>
    public async Task<UIClientCommandResult> RequestLeaveAsync(string target, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target);

        if (!UIRoutePath.IsLocal(target))
            throw new ArgumentException("A leave names an address of this site.", nameof(target));

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        int mark;
        lock (_sync)
            mark = _effects.Count;

        if (!Transport.HasController)
        {
            lock (_sync)
                ApplyEffectsNoLock([new NavigateEffect(target)]);

            await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
            NotifyIfChanged();
            return UIClientCommandResult.RanOnPage(EffectsSince(mark));
        }

        UICommandExecutionResult result = await Transport.RequestLeaveAsync(target, cancellationToken).ConfigureAwait(false);

        lock (_sync)
        {
            ApplyNoLock(result.Changes.For(Transport.InstanceId));
            ApplyEffectsNoLock(result.Command.Effects);
        }

        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();

        return UIClientCommandResult.Answered(result.Command.Success, result.Command.Error, EffectsSince(mark));
    }

    /// <summary>Presses the action a notification offered — its Undo — through the command path, once, as a press on the toast does.</summary>
    /// <exception cref="InvalidOperationException">The notification offers no action.</exception>
    public async Task<UIClientCommandResult> PressNotificationActionAsync(ShowNotificationEffect notification, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(notification);

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        var action = notification.Action?.Id ?? throw new InvalidOperationException("The notification offers no action the page could press.");

        return await SendCommandAsync(new UICommandRequest { Action = action }, source: null, eventName: null, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Follows a system notification click on this page: navigates through the page's leave guard when <see cref="ShowSystemNotificationEffect.Address"/> names another address, otherwise runs <see cref="ShowSystemNotificationEffect.Action"/>.</summary>
    /// <exception cref="InvalidOperationException">The page already stands at the notification's address (or none was given) and the notification offers no action.</exception>
    public async Task<UIClientCommandResult> PressNotificationActionAsync(ShowSystemNotificationEffect notification, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(notification);

        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);

        if (notification.Address is { Length: > 0 } bringTo && IsNotificationTargetElsewhere(bringTo))
            return await RequestLeaveAsync(bringTo, cancellationToken).ConfigureAwait(false);

        var action = notification.Action?.Id ?? throw new InvalidOperationException("The notification offers no action the page could press.");

        return await SendCommandAsync(new UICommandRequest { Action = action }, source: null, eventName: null, cancellationToken).ConfigureAwait(false);
    }

    private bool IsNotificationTargetElsewhere(string targetAddress)
    {
        var current = Address;
        (var targetWithoutHash, var targetHash) = SplitAddressFragment(targetAddress);
        (var currentWithoutHash, var currentHash) = SplitAddressFragment(current);

        var normalizedTarget = UINavigationAddress.Format(UINavigationAddress.Parse(targetWithoutHash));
        var normalizedCurrent = UINavigationAddress.Format(UINavigationAddress.Parse(currentWithoutHash));

        if (!string.Equals(normalizedTarget, normalizedCurrent, StringComparison.Ordinal))
            return true;

        return targetHash.Length > 0 && !string.Equals(targetHash, currentHash, StringComparison.Ordinal);
    }

    private static (string Address, string Fragment) SplitAddressFragment(string address)
    {
        var hashIndex = address.IndexOf('#', StringComparison.Ordinal);
        return hashIndex < 0 ? (address, string.Empty) : (address[..hashIndex], address[hashIndex..]);
    }

    /// <summary>Gets what the page last reported of itself: whether it is on screen, and its notification permission.</summary>
    public UIClientState ClientState => Transport.ClientState;

    /// <summary>Marks the page hidden and awaits the runtime's visibility hook.</summary>
    public Task HideAsync(CancellationToken cancellationToken = default)
        => ReportAsync(ClientState with { IsVisible = false }, cancellationToken);

    /// <summary>Marks the page visible and awaits the runtime's visibility hook.</summary>
    public Task ShowAsync(CancellationToken cancellationToken = default)
        => ReportAsync(ClientState with { IsVisible = true }, cancellationToken);

    /// <summary>
    /// Reports the browser's answer to a notification permission prompt, or a change made in its settings; returns once the
    /// controller's <c>OnNotificationPermissionChangedAsync</c> has run.
    /// </summary>
    public Task ReportNotificationPermissionAsync(UINotificationPermission permission, CancellationToken cancellationToken = default)
        => ReportAsync(ClientState with { NotificationPermission = permission }, cancellationToken);

    private async Task ReportAsync(UIClientState state, CancellationToken cancellationToken)
    {
        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);
        await Transport.ReportClientStateAsync(state, cancellationToken).ConfigureAwait(false);
        await DrainPendingReactionsAsync(cancellationToken).ConfigureAwait(false);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();
    }

    /// <summary>
    /// Closes the page as a reader closing its tab does: its connection leaves the runtime through the transport, and the page receives
    /// nothing more.
    /// </summary>
    public Task CloseAsync(CancellationToken cancellationToken = default)
    {
        CancelPendingCommands(new OperationCanceledException("The client page closed before the background command completed."));
        return Transport.CloseAsync(cancellationToken);
    }

    internal void NotifyIfChanged()
    {
        Action<UIClientPageChange>? handler = Changed;

        if (handler is null)
        {
            lock (_sync)
            {
                SyncRedirectedValidationMessagesNoLock();
                ClearPendingNotificationNoLock();
            }

            return;
        }

        UIClientPageChange? batch;

        lock (_sync)
        {
            SyncRedirectedValidationMessagesNoLock();
            batch = TakePendingNotificationNoLock();
        }

        if (batch is { HasChanges: true })
            handler(batch);
    }

    private void ClearPendingNotificationNoLock()
    {
        _changedProperties.Clear();
        _changedCollections.Clear();
        _changedValidations.Clear();
        _changedEffects.Clear();
        _dialogsChanged = false;
        _tierChanged = false;
        _navigationChanged = false;
        _languageOrThemeChanged = false;
        _fullResyncOccurred = false;
    }

    private UIClientPageChange? TakePendingNotificationNoLock()
    {
        if (_changedProperties.Count == 0
            && _changedCollections.Count == 0
            && _changedValidations.Count == 0
            && _changedEffects.Count == 0
            && !_dialogsChanged
            && !_tierChanged
            && !_navigationChanged
            && !_languageOrThemeChanged
            && !_fullResyncOccurred)
        {
            return null;
        }

        UIClientPageChange batch = new()
        {
            Properties = _changedProperties.Count == 0 ? [] : _changedProperties.ToFrozenSet(),
            Collections = _changedCollections.Count == 0 ? [] : _changedCollections.ToFrozenSet(),
            Validations = _changedValidations.Count == 0 ? [] : _changedValidations.ToFrozenSet(),
            Effects = _changedEffects.Count == 0 ? [] : [.. _changedEffects],
            DialogsChanged = _dialogsChanged,
            TierChanged = _tierChanged,
            NavigationChanged = _navigationChanged,
            LanguageOrThemeChanged = _languageOrThemeChanged,
            FullResync = _fullResyncOccurred
        };

        ClearPendingNotificationNoLock();
        return batch;
    }
}
