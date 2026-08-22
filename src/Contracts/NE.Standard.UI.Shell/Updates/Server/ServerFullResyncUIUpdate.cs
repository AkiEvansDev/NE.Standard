namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Requests the client to perform a full UI resynchronization.
/// </summary>
public sealed class ServerFullResyncUIUpdate : ServerUIUpdate
{
    /// <inheritdoc />
    public override ServerUIUpdateKind Kind => ServerUIUpdateKind.FullResync;
}
