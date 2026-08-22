namespace NE.Standard.UI.Shell.Updates.Client;

/// <summary>
/// Defines client-originated update kinds.
/// </summary>
public enum ClientUIUpdateKind
{
    Value = 0
}

/// <summary>
/// Base type for updates sent from the UI client to the runtime.
/// </summary>
public abstract class ClientUIUpdate
{
    /// <summary>
    /// Gets the client update kind.
    /// </summary>
    public abstract ClientUIUpdateKind Kind { get; }
}
