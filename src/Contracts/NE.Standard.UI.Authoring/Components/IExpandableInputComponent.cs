using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a multi-line input that can promote its live editor into a full-height modal dialog with its own expanded settings.
/// </summary>
public interface IExpandableInputComponent : IFieldInputComponent
{
    /// <summary>Gets the registered property key for <see cref="Expandable"/>.</summary>
    static UIProperty ExpandableProperty { get; } = new(nameof(Expandable));

    /// <summary>Gets the registered property key for <see cref="ShowExpandButton"/>.</summary>
    static UIProperty ShowExpandButtonProperty { get; } = new(nameof(ShowExpandButton));

    /// <summary>Gets the registered property key for <see cref="ExpandedWidth"/>.</summary>
    static UIProperty ExpandedWidthProperty { get; } = new(nameof(ExpandedWidth));

    /// <summary>Gets the registered property key for <see cref="ExpandedAppearance"/>.</summary>
    static UIProperty ExpandedAppearanceProperty { get; } = new(nameof(ExpandedAppearance));

    /// <summary>Gets or sets whether the field can open in a full-height modal dialog.</summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = false, GenerateSetter = false)]
    bool? Expandable { get; set; }

    /// <summary>Gets or sets whether the field draws its own expand button in the caption row; off when an external button triggers <c>ExpandFieldEffect</c>.</summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = true, GenerateSetter = false)]
    bool? ShowExpandButton { get; set; }

    /// <summary>Gets or sets the width of the expanded dialog surface; unset, the dialog fills the overlay's width.</summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = null, GenerateSetter = false)]
    UIResponsive<UILayoutLength>? ExpandedWidth { get; set; }

    /// <summary>Gets or sets how the field surface is drawn while expanded; unset, the field keeps its inline <see cref="IFieldInputComponent.Appearance"/>.</summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = null, GenerateSetter = false)]
    UIInputAppearance? ExpandedAppearance { get; set; }
}

/// <summary>
/// Configures the modal presentation of an <see cref="IExpandableInputComponent"/> opened via its caption button or <c>ExpandFieldEffect</c>.
/// </summary>
public interface IUIExpandedFieldBuilder<out TSelf>
    where TSelf : IUIExpandedFieldBuilder<TSelf>
{
    /// <summary>Sets whether the field renders the default expand button in its caption row.</summary>
    TSelf SetShowButton(bool showButton = true);

    /// <summary>Sets the width of the expanded dialog surface.</summary>
    TSelf SetWidth(UILayoutLength width);

    /// <summary>Sets the responsive width of the expanded dialog surface across breakpoints.</summary>
    TSelf SetWidth(UIResponsive<UILayoutLength> width);

    /// <summary>Sets the field appearance used while expanded in the dialog.</summary>
    TSelf SetAppearance(UIInputAppearance appearance);
}
