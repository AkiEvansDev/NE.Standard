using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Testing;

/// <summary>
/// One open page: its components as the page holds them — every change set it received applied the way the client applies it — and
/// the ways a reader acts on them, each sent through the host's own entry points.
/// </summary>
/// <remarks>
/// Modelled: values and collections from the change sets, a binding read off its row's item, visibility and enabled state with
/// their ancestors', the field rules (change, blur, submit), a bound message and the server's refusal, the client interactions a
/// view declares, dialogs, the address an effect writes, and a submit refused while its form has an error. Not modelled: layout,
/// a responsive value at any width but the widest, a plain host's own filter and sort rules (rows stand as the server sent them),
/// item windows read on scroll, popups other than dialogs (a context menu and a flyout stand open), the validation message sent
/// into another component, trimming and debouncing a field does in the browser, and fields in rows on a submit.
/// </remarks>
public sealed partial class UITestPage
{
    private readonly Lock _sync = new();
    private readonly UITestApp _app;
    private readonly string _instanceId;

    private RuntimeResolution _resolution = null!;
    private UINavigationRequest _navigation = null!;

    private readonly Dictionary<UIPropertyAddress, object?> _values = [];
    private readonly Dictionary<UIComponentAddress, List<UITestRowEntry>> _rows = [];
    private readonly Dictionary<UIComponentAddress, UITestField> _fields = [];
    private readonly Dictionary<UIPropertyAddress, object?> _held = [];
    private readonly List<ClientEffect> _effects = [];
    private readonly List<UITestDownload> _downloads = [];
    private readonly HashSet<string> _openDialogs = new(StringComparer.Ordinal);
    private bool _resync;

    internal UITestPage(UITestApp app, string instanceId, UITestSession session)
    {
        _app = app;
        _instanceId = instanceId;
        Session = session;
    }

    /// <summary>Gets the route that answered: the one asked for, or where a refusal or a filter sent the page.</summary>
    public string Route => _resolution.Route.Route;

    /// <summary>Gets the address the page shows, as a browser's address bar would after every address effect it received.</summary>
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

    /// <summary>Gets the language the page shows its words in: its session's.</summary>
    public string Language => _resolution.Handle.Session.Language;

    /// <summary>Gets the session the page was opened in, as the test described it.</summary>
    public UITestSession Session { get; }

    /// <summary>The page's compiled view, for the component and row handles.</summary>
    internal CompiledView View { get; private set; } = null!;

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
    public IReadOnlyList<UITestDownload> Downloads
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

    /// <summary>Gets whether the page holds work its reader has not saved, as the controller last said.</summary>
    public bool HoldsUnsavedWork { get; private set; }

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

    /// <summary>Gets the page's controller as <typeparamref name="TController"/>.</summary>
    /// <exception cref="InvalidOperationException">The page has no controller, or one of another type.</exception>
    public TController Controller<TController>() where TController : class
    {
        IUIRuntime runtime = RequireRuntime();

        return runtime.Controller as TController
            ?? throw new InvalidOperationException($"The page at '{Route}' runs '{runtime.Controller.GetType().Name}', not '{typeof(TController).Name}'.");
    }

    private IUIRuntime RequireRuntime()
        => _resolution.Runtime ?? throw new InvalidOperationException($"The page at '{Route}' has no controller.");

    /// <summary>Gets the component with the authored id <paramref name="id"/>.</summary>
    /// <exception cref="InvalidOperationException">The view has no such component, or it stands in a list's rows.</exception>
    public UITestComponent Component(string id)
        => Find(id, scope: null, rowKeys: []);

    /// <summary>Gets the one component whose value — else another property — is bound to <paramref name="path"/> on the controller.</summary>
    public UITestComponent ComponentBoundTo(string path)
        => FindBoundTo(path, scope: null, rowKeys: []);

    /// <summary>Gets the one component a reader knows by <paramref name="name"/>: its title, accessible name or tooltip, as written or as shown.</summary>
    public UITestComponent ComponentNamed(string name)
        => FindNamed(name, scope: null, rowKeys: []);

    /// <summary>Gets <paramref name="value"/> as the page shows it in its language: a key or a phrase translated, a validation message's words.</summary>
    public string? Words(object? value)
    {
        var language = Language;
        ITranslator translator = _app.Application.Translator;

        return value switch
        {
            null => null,
            UIValidationMessage message => Words(message.Message),
            UIPhrase { IsText: true } text => translator.Translate(language, text.Key),
            UIPhrase phrase => translator.Translate(language, phrase.Key, phrase.Arguments),
            string text => translator.Translate(language, text),
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture),
            _ => value.ToString()
        };
    }

    /// <summary>Delivers what a <c>Batch</c> runtime holds for its pages, as the scheduled flush does; a <c>Direct</c> one has sent it already.</summary>
    public async Task FlushAsync(CancellationToken cancellationToken = default)
    {
        IUIRuntime runtime = RequireRuntime();
        ServerChangeSet changes = await _app.Host.FlushAsync(_resolution.Handle, cancellationToken).ConfigureAwait(false);

        // A batch runtime only drains; the scheduled flush hands what it drained to every page attached, and so does this.
        if (runtime is Runtime.UIBatchRuntime && !changes.IsEmpty && runtime.AttachedInstanceIds.Count > 0)
            await Runtime.UIChangeDelivery.SendAsync(_app.Client, runtime, _resolution.Handle, runtime.AttachedInstanceIds, changes, cancellationToken).ConfigureAwait(false);

        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Presses the action a notification offered — its Undo — through the command path, once, as a press on the toast does.</summary>
    /// <exception cref="InvalidOperationException">The notification offers no action.</exception>
    public async Task<UITestCommandResult> PressNotificationActionAsync(ShowNotificationEffect notification, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(notification);

        var action = notification.Action?.Id ?? throw new InvalidOperationException("The notification offers no action the page could press.");

        return await SendCommandAsync(new UICommandRequest { Action = action }, source: null, eventName: null, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Opens <paramref name="address"/> in another page of this page's session, as following a link to it would.</summary>
    public Task<UITestPage> OpenAsync(string address, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(address);

        return OpenAsync(UITestApp.ParseAddress(address), cancellationToken);
    }

    /// <summary>Opens <paramref name="navigation"/> — a <see cref="NavigateEffect"/>'s request — in another page of this page's session.</summary>
    public Task<UITestPage> OpenAsync(UINavigationRequest navigation, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(navigation);

        return _app.OpenAsync(navigation, _resolution.Handle.Session.SessionId, Session, cancellationToken);
    }
}
