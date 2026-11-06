using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Client;

/// <summary>The seam between an open <see cref="UIClientPage"/> and the host or server running its view.</summary>
public interface IUIClientTransport
{
    /// <summary>Gets the client instance id of this page connection.</summary>
    string InstanceId { get; }

    /// <summary>Gets the route that answered when the page was opened.</summary>
    string Route { get; }

    /// <summary>Gets the navigation the page opened at.</summary>
    UINavigationRequest InitialNavigation { get; }

    /// <summary>Gets the compiled view of the page.</summary>
    CompiledView View { get; }

    /// <summary>Gets the language the page shows its words in.</summary>
    string Language { get; }

    /// <summary>Gets the theme mode of the page's session.</summary>
    UIThemeMode? ThemeMode { get; }

    /// <summary>Gets the custom theme colours of the page's session, or <see langword="null"/> for the default palette.</summary>
    UIThemeColors? ThemeColors { get; }

    /// <summary>Gets the client state last reported by the page.</summary>
    UIClientState ClientState { get; }

    /// <summary>Gets the translator used to format keys and phrases in the page's language.</summary>
    ITranslator Translator { get; }

    /// <summary>Gets whether the page's route declares a controller.</summary>
    bool HasController { get; }

    /// <summary>Gets the page's in-process controller as <typeparamref name="TController"/>.</summary>
    TController Controller<TController>() where TController : class;

    /// <summary>Gets the initial attach snapshot for the given component property bindings.</summary>
    Task<ServerChangeSet> BuildAttachChangesAsync(UIBindingId[] bindingIds, CancellationToken cancellationToken = default);

    /// <summary>Processes a client-originated UI command or event request.</summary>
    Task<UICommandExecutionResult> ProcessEventAsync(UICommandRequest request, CancellationToken cancellationToken = default);

    /// <summary>Processes client-originated value changes.</summary>
    Task<ServerChangeSet> ProcessChangeSetAsync(ClientChangeSet changeSet, CancellationToken cancellationToken = default);

    /// <summary>Reads a window of items for a windowed host.</summary>
    Task<ServerChangeSet> RequestItemWindowAsync(UIItemWindowClientRequest request, CancellationToken cancellationToken = default);

    /// <summary>Notifies the current runtime of an in-place navigation to another history entry of the same route.</summary>
    Task<UICommandExecutionResult> NavigateInPlaceAsync(IReadOnlyDictionary<string, object?>? parameters, CancellationToken cancellationToken = default);

    /// <summary>Flushes pending server-originated changes for this page's runtime.</summary>
    Task<ServerChangeSet> FlushAsync(CancellationToken cancellationToken = default);

    /// <summary>Reports the page's visibility and notification permission to the runtime.</summary>
    Task ReportClientStateAsync(UIClientState state, CancellationToken cancellationToken = default);

    /// <summary>Gets whether the session already holds the setting carried by <paramref name="effect"/>.</summary>
    bool SessionHolds(ClientEffect effect);

    /// <summary>Persists a language, theme mode or theme colours change into the session and notifies the session's pages.</summary>
    Task ApplySettingAsync(ClientEffect setting, CancellationToken cancellationToken = default);

    /// <summary>Detaches the page from its runtime.</summary>
    Task CloseAsync(CancellationToken cancellationToken = default);
}
