using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>What a page render read from the runtime it prepared, and where the runtime's updates stood when it read it.</summary>
/// <remarks>The page carries <see cref="Sequence"/> and presents it at its first attach, which is then sent only what moved past it.</remarks>
public sealed class UIRenderSnapshot
{
    /// <summary>Gets every bound value and bound collection the page is rendered with.</summary>
    public required ServerChangeSet Changes { get; init; }

    /// <summary>Gets the runtime's update sequence the snapshot stands at; null for a runtime that cannot answer from it.</summary>
    public long? Sequence { get; init; }
}
