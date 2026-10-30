using NE.Colors;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A colour input: a swatch that opens a free picker, optionally paired with the named palette.
/// </summary>
/// <remarks>Semantic roles are not offered: a role pushed into <c>Value</c> is kept as-is and reads as empty until something is picked.</remarks>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(IFieldInputComponent))]
public abstract partial class ColorInputComponent<T>(string? id = null) : InputComponentBase<T, UIThemeColor?>(id), IBorderedComponent, IFieldInputComponent, IClientWriteCheckComponent
    where T : ColorInputComponent<T>, IUIComponentDefinition
{
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
    /// Gets or sets whether the palette tab and segmented switcher are offered alongside the free picker.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowPalette { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IClientWriteCheckComponent), IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public UIClientWriteCheck? ClientWriteCheck => ColorInputWriteCheck.Instance;

    /// <summary>
    /// Writes the colour as <c>rgb(...)</c> rather than as hex.
    /// </summary>
    public T AsRgbText()
        => SetTextFormat(UIColorTextFormat.Rgb);
}

/// <summary>
/// A colour input: a swatch that opens a free picker, optionally paired with the named palette.
/// </summary>
public sealed class ColorInputComponent(string? id = null) : ColorInputComponent<ColorInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.color";
}

/// <summary>Refuses semantic roles and split light/dark pairs, which the colour picker never offers.</summary>
internal sealed class ColorInputWriteCheck : UIClientWriteCheck
{
    public static ColorInputWriteCheck Instance { get; } = new();

    /// <inheritdoc/>
    public override bool Accepts(UIProperty property, object? value)
        => property != IInputComponent.ValueProperty
            || value is null
            || (value is UIThemeColor { Style: null, Light: ColorVariant light, Dark: ColorVariant dark } && light == dark);
}
