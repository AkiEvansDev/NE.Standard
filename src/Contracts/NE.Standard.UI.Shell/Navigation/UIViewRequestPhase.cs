namespace NE.Standard.UI.Shell.Navigation;

/// <summary>
/// Which request is resolving the view: the one that opens it for the client, or a live connection attaching to it.
/// </summary>
/// <remarks>
/// A page load on the web resolves the view twice — the page request, then the client's live connection — and both
/// must be guarded, but a side effect belongs to exactly one of them. A platform with one step passes <see cref="Open"/>.
/// </remarks>
public enum UIViewRequestPhase
{
    /// <summary>
    /// The request that opens the view for the client and can hand it a session id: a pending id rotation is carried
    /// out here and nowhere else.
    /// </summary>
    Open = 0,

    /// <summary>
    /// A live connection attaching a runtime to a view already open.
    /// </summary>
    Attach = 1
}
