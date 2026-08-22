namespace NE.Standard.UI.Shell.Navigation;

/// <summary>
/// Identifies which half of a page request is resolving the view.
/// </summary>
/// <remarks>
/// One page load resolves the view <b>twice</b>: the shell render draws the initial HTML, and the client
/// then opens its live connection and resolves again to create the runtime. Both are real entry points and
/// both have to be guarded — closing only the first leaves the second as an unlocked door to the same
/// controller — but an action with a side effect (an audit record, a counter) belongs to exactly one of them.
/// A filter that must run once tests this.
/// </remarks>
public enum UIViewRequestPhase
{
    /// <summary>
    /// The view is being resolved to render the initial page shell.
    /// </summary>
    ShellRender = 0,

    /// <summary>
    /// The view is being resolved to attach a live runtime to an already-rendered page.
    /// </summary>
    RuntimeAttach = 1
}
