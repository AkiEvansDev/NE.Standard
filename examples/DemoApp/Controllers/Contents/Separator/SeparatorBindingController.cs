using DemoApp.Controllers.Base;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Contents.Separator;

internal sealed partial class SeparatorOrientationGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIOrientation Orientation { get; set; } = UIOrientation.Horizontal;

    [RecursiveMember]
    public partial string? Label { get; set; }

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void ToggleLabel()
        => SetLastChange(nameof(Label), Label = CycleValue(Label, null, "Section"));
}

internal sealed partial class SeparatorStyleGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    public void CycleStyle()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, null, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Danger), UIThemeColor.FromStyle(UIColorStyle.Muted)));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, null, UIThemeColor.FromColorVariant(ColorName.StellarRed), UIThemeColor.FromColorVariant(ColorName.AuroraGreen)));
}

internal sealed partial class SeparatorBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial SeparatorOrientationGroupContext OrientationGroup { get; set; } = new();

    [RecursiveMember]
    public partial SeparatorStyleGroupContext StyleGroup { get; set; } = new();

    [UICommand]
    public void CycleOrientation()
        => OrientationGroup.CycleOrientation();

    [UICommand]
    public void ToggleLabel()
        => OrientationGroup.ToggleLabel();

    [UICommand]
    public void CycleStyle()
        => StyleGroup.CycleStyle();

    [UICommand]
    public void CycleColor()
        => StyleGroup.CycleColor();
}
