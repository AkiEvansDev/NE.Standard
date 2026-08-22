using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Controllers;

/// <summary>
/// Defines controller support for receiving a UI runtime context.
/// </summary>
public interface IUIContextController
{
    /// <summary>
    /// Gets the attached UI context.
    /// </summary>
    UIContext Context { get; }

    /// <summary>
    /// Attaches the UI context created by the runtime.
    /// </summary>
    void AttachContext(UIContext context);
}
