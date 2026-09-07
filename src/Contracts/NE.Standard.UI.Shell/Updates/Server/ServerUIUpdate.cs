using System.Text.Json.Serialization;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Defines server-originated update kinds.
/// </summary>
public enum ServerUIUpdateKind
{
    Value = 0,
    CollectionChange = 1,
    FullResync = 2,
    Validation = 3
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
