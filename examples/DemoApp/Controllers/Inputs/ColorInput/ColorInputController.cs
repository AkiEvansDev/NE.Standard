using DemoApp.Controllers.Base;
using NE.Colors;

namespace DemoApp.Controllers.Inputs.ColorInput;

/// <summary>
/// The colour itself, and how it is written; every step is one the control can reach on its own.
/// </summary>
internal sealed partial class ColorValueGroupContext : InputValueGroupContext
{
    [RecursiveMember]
    public partial UIThemeColor? Value { get; set; } = UIThemeColor.FromColorVariant(ColorName.AstralTeal);

    [RecursiveMember]
    public partial UIColorTextFormat? TextFormat { get; set; } = UIColorTextFormat.Hex;

    public ColorValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(TextFormat), CycleTextFormat, () => TextFormat);
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, UIThemeColor.FromColorVariant(ColorName.AstralTeal), UIThemeColor.FromColorVariant(ColorName.NebulaRose, ColorAdjustment.Tint, 3), UIThemeColor.FromColorVariant(ColorVariant.FromRgb(0x33, 0x99, 0xCC)), null));

    public void CycleTextFormat()
        => SetLastChange(nameof(TextFormat), TextFormat = CycleEnum(TextFormat));
}

/// <summary>
/// How the control presents itself: the field's surface, size, and what its popup offers.
/// </summary>
internal sealed partial class ColorFieldGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIInputAppearance? Appearance { get; set; } = UIInputAppearance.Filled;

    [RecursiveMember]
    public partial UISize? Size { get; set; } = UISize.Medium;

    [RecursiveMember]
    public partial bool ShowPalette { get; set; } = true;

    [RecursiveMember]
    public partial bool ShowOpacity { get; set; } = true;

    public ColorFieldGroupContext()
    {
        AddOption(nameof(Appearance), CycleAppearance, () => Appearance);
        AddOption(nameof(Size), CycleSize, () => Size);
        AddOption(nameof(ShowPalette), ToggleShowPalette, () => ShowPalette);
        AddOption(nameof(ShowOpacity), ToggleShowOpacity, () => ShowOpacity);
    }

    public void CycleAppearance()
        => SetLastChange(nameof(Appearance), Appearance = CycleEnum(Appearance));

    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));

    public void ToggleShowPalette()
        => SetLastChange(nameof(ShowPalette), ShowPalette = !ShowPalette);

    public void ToggleShowOpacity()
        => SetLastChange(nameof(ShowOpacity), ShowOpacity = !ShowOpacity);
}

internal sealed partial class ColorInputController() : DemoStandardController
{
    [RecursiveMember]
    public partial ColorValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial ColorFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Brand color");

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();
}
