using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
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
    private readonly Dictionary<UIComponentAddress, List<UIClientRowEntry>> _rows = [];
    private readonly Dictionary<UIComponentAddress, UIClientField> _fields = [];
    private readonly Dictionary<UIPropertyAddress, object?> _held = [];
    // The server's latest value of a held address, which a discard puts back.
    private readonly Dictionary<UIPropertyAddress, object?> _serverValues = [];
    private readonly List<ClientEffect> _effects = [];
    private readonly List<UIClientDownload> _downloads = [];
    private readonly HashSet<string> _openDialogs = new(StringComparer.Ordinal);
    // What effects left for after the act, run once the lock is let go (RunReactionsAsync).
    private readonly List<UIClientReaction> _reactions = [];
    private bool _resync;

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

    /// <summary>Gets the address the page shows, as an address bar would after every address effect it received.</summary>
    public string Address
    {
        get
        {
            lock (_sync)
                return UINavigationAddress.Format(_navigation);
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

    /// <summary>Gets the dialogs open on the page, by key.</summary>
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

    /// <summary>Gets whether the dialog <paramref name="key"/> is open.</summary>
    public bool IsDialogOpen(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        lock (_sync)
            return _openDialogs.Contains(key);
    }

    /// <summary>
    /// Closes the dialog <paramref name="key"/> as its viewer does — Escape, or a press beside it — letting the edit of a form under its
    /// key go and raising its <c>OnClose</c>, whose command's answer this is.
    /// </summary>
    /// <exception cref="InvalidOperationException">The dialog is not open, or takes neither Escape nor a press beside it.</exception>
    public Task<UIClientCommandResult> DismissDialogAsync(string key, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

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

        return DispatchCoreAsync(root, [], EventNames.Close, [], cancellationToken);
    }

    /// <summary>Gets the page's in-process controller as <typeparamref name="TController"/>.</summary>
    public TController Controller<TController>() where TController : class
        => Transport.Controller<TController>();

    /// <summary>Gets the component with the authored id <paramref name="id"/>.</summary>
    /// <exception cref="InvalidOperationException">The view has no such component, or it stands in a list's rows.</exception>
    public UIClientComponent Component(string id)
        => Find(id, scope: null, rowKeys: []);

    /// <summary>Gets the component with the compiled <paramref name="componentId"/> in the given <paramref name="rowKeys"/> scope.</summary>
    public UIClientComponent Component(UIComponentId componentId, object?[]? rowKeys = null)
        => At(componentId, rowKeys ?? []);

    /// <summary>Gets the one component whose value — else another property — is bound to <paramref name="path"/> on the controller.</summary>
    public UIClientComponent ComponentBoundTo<TSource>(Expression<Func<TSource, object?>> path)
        => ComponentBoundTo(RecursivePath.FromExpression(path).ToString());

    /// <summary>Gets the one component whose value — else another property — is bound to <paramref name="path"/> on the controller.</summary>
    public UIClientComponent ComponentBoundTo(string path)
        => FindBoundTo(path, scope: null, rowKeys: []);

    /// <summary>Gets the one component a reader knows by <paramref name="name"/>: its title, accessible name or tooltip, as written or as shown.</summary>
    public UIClientComponent ComponentNamed(string name)
        => FindNamed(name, scope: null, rowKeys: []);

    /// <summary>
    /// Gets <paramref name="value"/> as the page shows it in its language: a key or a phrase translated, a validation message's words;
    /// null for none, a NaN or an infinity among them.
    /// </summary>
    public string? Words(object? value)
    {
        var language = Language;
        ITranslator translator = Transport.Translator;

        return value switch
        {
            // A NaN or an infinity is the null the page holds it as.
            _ when UIScriptNumber.ReadsAsNull(value) => null,
            UIValidationMessage message => Words(message.Message),
            UIPhrase { IsText: true } text => translator.Translate(language, text.Key),
            UIPhrase phrase => translator.Translate(language, phrase.Key, phrase.Arguments),
            IReadOnlyDictionary<string, object?> wirePhrase when CompiledViewWireSerializer.CoerceWireValue(typeof(UIPhrase), wirePhrase) is UIPhrase coercedPhrase => Words(coercedPhrase),
            string text => translator.Translate(language, text),
            // As the page writes them: a number by its shortest digits (1.5, not 1.50), a flag in the wire's words.
            _ => UIScriptText.Of(value)
        };
    }

    /// <summary>Delivers what the runtime holds for its pages, as the scheduled flush does.</summary>
    public async Task FlushAsync(CancellationToken cancellationToken = default)
    {
        _ = await Transport.FlushAsync(cancellationToken).ConfigureAwait(false);

        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();
    }

    /// <summary>Reads a window of items for the windowed host <paramref name="componentId"/>.</summary>
    public async Task RequestItemWindowAsync(UIComponentId componentId, object?[] rowKeys, UIItemAnchor anchor, int count, UIItemWindowMode mode = UIItemWindowMode.Replace, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(rowKeys);

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

        Receive(changes);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();
    }

    /// <summary>Presses the action a notification offered — its Undo — through the command path, once, as a press on the toast does.</summary>
    /// <exception cref="InvalidOperationException">The notification offers no action.</exception>
    public async Task<UIClientCommandResult> PressNotificationActionAsync(ShowNotificationEffect notification, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(notification);

        var action = notification.Action?.Id ?? throw new InvalidOperationException("The notification offers no action the page could press.");

        return await SendCommandAsync(new UICommandRequest { Action = action }, source: null, eventName: null, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Gets what the page last reported of itself: whether it is on screen, and its notification permission.</summary>
    public UIClientState ClientState => Transport.ClientState;

    /// <summary>
    /// Takes the page off screen — another tab chosen, the window minimised — as the page reports it; returns once the controller's
    /// <c>OnVisibilityChangedAsync</c>, where the runtime went off screen, has run.
    /// </summary>
    public Task HideAsync(CancellationToken cancellationToken = default)
        => ReportAsync(ClientState with { IsVisible = false }, cancellationToken);

    /// <summary>Brings the page back on screen, as the page reports it; returns once the controller heard it, as <see cref="HideAsync"/> does.</summary>
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
        await Transport.ReportClientStateAsync(state, cancellationToken).ConfigureAwait(false);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();
    }

    /// <summary>
    /// Closes the page as a reader closing its tab does: its connection leaves the runtime through the transport, and the page receives
    /// nothing more.
    /// </summary>
    public Task CloseAsync(CancellationToken cancellationToken = default)
        => Transport.CloseAsync(cancellationToken);

    internal void NotifyIfChanged()
    {
        Action<UIClientPageChange>? handler = Changed;

        if (handler is null)
        {
            lock (_sync)
                ClearPendingNotificationNoLock();

            return;
        }

        UIClientPageChange? batch;

        lock (_sync)
            batch = TakePendingNotificationNoLock();

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
