using System.Text.Json.Serialization;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Defines server-originated update kinds.
/// </summary>
public enum ServerUIUpdateKind
{
    Value = 0,
    ContextRebuild = 1,
    CollectionChange = 2,
    FullResync = 3,
    Validation = 4
}

/// <summary>
/// Base type for updates sent from the runtime to the UI client.
/// </summary>
[JsonConverter(typeof(ServerUIUpdateJsonConverter))]
public abstract class ServerUIUpdate
{
    /// <summary>
    /// Gets the server update kind.
    /// </summary>
    public abstract ServerUIUpdateKind Kind { get; }
}
