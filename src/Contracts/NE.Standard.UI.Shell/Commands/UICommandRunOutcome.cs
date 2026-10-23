namespace NE.Standard.UI.Shell.Commands;

/// <summary>How an accepted background command's run ended, read off its own token rather than the connection's.</summary>
internal enum UICommandRunOutcome
{
    /// <summary>It ran and its result succeeded.</summary>
    Succeeded,

    /// <summary>It ran and failed, or its result did.</summary>
    Failed,

    /// <summary>Its tab's stay ended under it, so it did not finish for anyone.</summary>
    Cancelled
}
