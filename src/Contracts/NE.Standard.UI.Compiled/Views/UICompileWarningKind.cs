namespace NE.Standard.UI.Compiled.Views;

/// <summary>
/// Which kind a compile warning is: one the page shows as a blank control for ever, or advice an author may mean against.
/// </summary>
public enum UICompileWarningKind
{
    /// <summary>
    /// A binding or a path that names nothing the server can read: the component keeps the value it was authored with.
    /// </summary>
    UnresolvedBinding = 0,

    /// <summary>
    /// Likely not meant, but it may be: an argument the command has no parameter for, a <c>Root</c> binding a row's item shadows, a
    /// selection binding its mode never reads.
    /// </summary>
    Advisory = 1
}
