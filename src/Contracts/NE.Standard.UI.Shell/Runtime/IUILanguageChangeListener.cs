using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// What a runtime does when code running for one of its connections switched that connection's session language.
/// </summary>
internal interface IUILanguageChangeListener
{
    /// <summary>
    /// Tells the controller and the connection, in the flow of the code that made the change; the handle is already refreshed.
    /// </summary>
    Task LanguageChangedAsync(UIHandle handle, string previousLanguage, CancellationToken cancellationToken);
}
