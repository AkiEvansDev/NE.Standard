using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A host with rows that may wash under the pointer — a key-value list, a table, a tree. Presentational only, independent of a
/// row click or the selection; off by default, and a host whose rows are a list to walk turns it on for itself.
/// </summary>
public interface IRowHoverableComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="RowHoverable"/>.
    /// </summary>
    static UIProperty RowHoverableProperty { get; } = new(nameof(RowHoverable));

    /// <summary>
    /// Gets whether rows highlight under the pointer; off by default unless the host turns it on for itself.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    bool? RowHoverable { get; }
}
