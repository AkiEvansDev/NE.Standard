namespace NE.Standard.UI.Abstractions.Binding;

/// <summary>
/// Represents an item that can be addressed by the UI binding system.
/// </summary>
public interface IBindableItem
{
    /// <summary>
    /// Gets the stable item identifier.
    /// </summary>
    string Id { get; }
}

/// <summary>
/// Represents a bindable item that belongs to a logical group.
/// </summary>
public interface IBindableGroup : IBindableItem
{
    /// <summary>
    /// Gets the group key, or <see langword="null"/> when the item is not grouped.
    /// </summary>
    string? Group { get; }
}
