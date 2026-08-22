using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Defines the kind of component slot in the compiled component graph.
/// </summary>
public enum UIComponentSlotKind
{
    Child = 0,
    Region = 1,
    Template = 2,
    TemplateVariant = 3,
    EmptyTemplate = 4,
    GroupTemplate = 5,

    /// <summary>
    /// The component shown when the owner is right-clicked. Any component may declare one, so this is the
    /// only slot kind whose owner is not a container, a region host or a templated component.
    /// </summary>
    ContextMenu = 6
}

/// <summary>
/// Represents a named or structural component slot in the compiled component graph.
/// </summary>
public sealed class UIComponentSlot
{
    /// <summary>
    /// Gets the slot kind.
    /// </summary>
    public required UIComponentSlotKind Kind { get; init; }

    /// <summary>
    /// Gets the component that owns the slot.
    /// </summary>
    public required UIComponentId OwnerComponentId { get; init; }

    /// <summary>
    /// Gets the root component rendered in the slot.
    /// </summary>
    public required UIComponentId RootComponentId { get; init; }

    /// <summary>
    /// Gets the slot key for named slots.
    /// </summary>
    public string? Key { get; init; }
}
