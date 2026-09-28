using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A control whose name to a screen reader is words it does not show: a switch drawn as "Aa", a checkbox alone in a table's column.
/// </summary>
public interface IAccessibleNameComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="AccessibleName"/>.
    /// </summary>
    static UIProperty AccessibleNameProperty { get; } = new UIProperty(nameof(AccessibleName));

    /// <summary>
    /// Gets the name a screen reader announces in place of the visible words; unset, the control is named by what it shows.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    string? AccessibleName { get; }
}
