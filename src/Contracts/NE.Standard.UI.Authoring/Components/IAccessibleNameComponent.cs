using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Authoring.Components;

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
    /// Gets or sets the name a screen reader announces in place of the visible words; unset, the control is named by what it shows.
    /// The set is a wrapper's hand (a labelled control is named by its label), an author's own words said at the component.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    UIPhrase? AccessibleName { get; set; }
}
