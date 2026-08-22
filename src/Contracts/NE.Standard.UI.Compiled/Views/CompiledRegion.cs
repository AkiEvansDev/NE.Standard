using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Views;

/// <summary>
/// Represents a compiled region entry in a view.
/// </summary>
public sealed class CompiledRegion
{
    /// <summary>
    /// Gets the stable region key.
    /// </summary>
    public required string Key { get; init; }

    /// <summary>
    /// Gets the root component id rendered in the region.
    /// </summary>
    public required UIComponentId RootComponentId { get; init; }
}
