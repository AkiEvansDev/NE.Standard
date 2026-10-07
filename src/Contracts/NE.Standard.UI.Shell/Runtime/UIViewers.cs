namespace NE.Standard.UI.Shell.Runtime;

/// <summary>Which runtimes a broadcast reaches, by who looks at them now.</summary>
public enum UIViewers
{
    /// <summary>Every runtime that takes the work, kept ones no page shows included.</summary>
    All,

    /// <summary>Runtimes a page is attached to (<see cref="IUIRuntimeAccess.HasViewers"/>), whether or not it is on screen.</summary>
    Connected,

    /// <summary>Runtimes a page shows on screen now (<see cref="IUIRuntimeAccess.HasVisibleViewers"/>).</summary>
    Visible
}
