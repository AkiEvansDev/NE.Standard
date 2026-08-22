using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Indicators;

/// <summary>
/// An indeterminate loading indicator, optionally shown alongside a label.
/// </summary>
public abstract partial class SpinnerComponent<T> : VisualComponentBase<T>
    where T : SpinnerComponent<T>, IUIComponentDefinition
{
    private static readonly UIThemeColor DefaultColor = UIThemeColor.FromStyle(UIColorStyle.Default);

    /// <summary>
    /// Gets or sets the label text shown alongside the spinner.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Label { get; set; }

    /// <summary>
    /// Gets or sets the spinner's size.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIIconSize.Medium)]
    public UIIconSize? Size { get; set; }

    /// <summary>
    /// Gets or sets the spinner's color.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultColor))]
    public UIThemeColor? Color { get; set; }

    /// <summary>
    /// Initializes the spinner with a centered alignment.
    /// </summary>
    protected SpinnerComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Center;
        VerticalAlignment = UIAlignment.Center;
    }
}

/// <summary>
/// An indeterminate loading indicator, optionally shown alongside a label.
/// </summary>
public sealed class SpinnerComponent(string? id = null) : SpinnerComponent<SpinnerComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.spinner";
}
