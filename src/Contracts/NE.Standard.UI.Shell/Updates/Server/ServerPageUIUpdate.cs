namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>What the page as a whole holds, rather than one of its components: whether it holds work its reader has not saved.</summary>
/// <remarks>
/// Travels in the change set like any update: in the first render's and every attach's while the page holds unsaved work, as it
/// changes, and ahead of a navigation a command answers with, so the page decides that navigation by the state the command left.
/// </remarks>
public sealed class ServerPageUIUpdate : ServerUIUpdate
{
    /// <inheritdoc />
    public override ServerUIUpdateKind Kind => ServerUIUpdateKind.Page;

    /// <summary>
    /// Gets whether the page holds work its reader has not saved: a leave the page starts asks its controller first, and closing or
    /// reloading the tab asks the browser's question.
    /// </summary>
    public bool HoldsUnsavedWork { get; init; }
}
