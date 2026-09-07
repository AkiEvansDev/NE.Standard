using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A colour input: a swatch that opens a picker, holding either a palette colour or one picked freely.
/// </summary>
/// <remarks>Semantic roles are not offered: a role pushed into <c>Value</c> is kept as-is and reads as empty until something is picked.</remarks>
public abstract partial class ColorInputComponent<T>(string? id = null) : FieldInputComponentBase<T, UIThemeColor?>(id)
    where T : ColorInputComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets how the input presents itself when closed.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIColorInputVariant.Field)]
    public UIColorInputVariant? Variant { get; set; }

    /// <summary>
    /// Gets or sets how the colour is written.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIColorTextFormat.Hex)]
    public UIColorTextFormat? TextFormat { get; set; }

    /// <summary>
    /// Gets or sets whether the opacity slider is shown.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowOpacity { get; set; }

    /// <summary>
    /// Gets or sets whether the palette tab is offered; with both tabs off the field still reads its colour.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowPalette { get; set; }

    /// <summary>
    /// Gets or sets whether the free picker tab is offered.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowPicker { get; set; }

    /// <summary>
    /// Presents the input as a swatch alone, with the colour written across it.
    /// </summary>
    public T AsSwatch()
        => SetVariant(UIColorInputVariant.Swatch);

    /// <summary>
    /// Writes the colour as <c>rgb(...)</c> rather than as hex.
    /// </summary>
    public T AsRgbText()
        => SetTextFormat(UIColorTextFormat.Rgb);
}

/// <summary>
/// A colour input: a swatch that opens a picker, holding either a palette colour or one picked freely.
/// </summary>
public sealed class ColorInputComponent(string? id = null) : ColorInputComponent<ColorInputComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.color";
}
