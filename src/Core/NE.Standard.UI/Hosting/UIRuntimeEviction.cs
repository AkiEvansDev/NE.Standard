namespace NE.Standard.UI.Hosting;

/// <summary>Which rule gave a runtime up to make room for a new one, for the host's meter.</summary>
internal enum UIRuntimeEviction
{
    /// <summary>None was given up.</summary>
    None,

    /// <summary>The session held as many runtimes no tab presented as it may, and gave up its longest-idle one.</summary>
    SessionUnclaimed,

    /// <summary>The session held as many runtimes as it may, and gave up its longest-idle one without a tab.</summary>
    SessionFull,

    /// <summary>The process held as many as it may, and gave up the one no tab presented that has been without a page longest.</summary>
    ProcessUnclaimed,

    /// <summary>The process held as many as it may, none unclaimed, and gave up the one without a page longest.</summary>
    ProcessDisconnected
}
