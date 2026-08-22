using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Container;

internal sealed partial class ContainerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIResponsive<UIGridPlacement> Placement { get; set; } = new UIGridPlacement(1, 1, 12, 1);

    [RecursiveMember]
    public partial UIThickness Padding { get; set; } = UIThickness.Uniform(0);

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; } = UIThemeColor.Primary;

    [RecursiveMember]
    public partial UIThemeColor? BorderColor { get; set; }

    [RecursiveMember]
    public partial UIThickness? BorderThickness { get; set; }

    [RecursiveMember]
    public partial UICornerRadius? BorderRadius { get; set; }

    public void CyclePlacement()
        => SetLastChange(nameof(Placement), Placement = CycleValue(Placement, new UIGridPlacement(1, 1, 12, 1), new UIGridPlacement(13, 1, 12, 1), new UIGridPlacement(13, 1, 12, 2), new UIGridPlacement(1, 2, 24, 1)));

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(0), UIThickness.Uniform(8), UIThickness.Uniform(16), UIThickness.Uniform(24)));

    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background, UIThemeColor.Primary, UIThemeColor.Accent, UIThemeColor.Surface));

    public void CycleBorderColor()
    {
        CheckBorder();
        SetLastChange(nameof(BorderColor), BorderColor = CycleValue(BorderColor, null, UIThemeColor.Border, UIThemeColor.Accent));
    }

    public void CycleBorderThickness()
    {
        CheckBorder();
        SetLastChange(nameof(BorderThickness), BorderThickness = CycleValue(BorderThickness, null, UIThickness.Uniform(1), UIThickness.Uniform(2), UIThickness.Uniform(4)));
    }

    public void CycleBorderRadius()
    {
        CheckBorder();
        SetLastChange(nameof(BorderRadius), BorderRadius = CycleValue(BorderRadius, null, UICornerRadius.Uniform(4), UICornerRadius.Uniform(12), UICornerRadius.Uniform(24)));
    }

    private void CheckBorder()
    {
        if (!(BorderThickness is UIThickness thickness && thickness.Left > 1))
            BorderThickness = UIThickness.Uniform(1);
    }
}

internal sealed partial class ContainerBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial ContainerGroupContext ContainerGroup { get; set; } = new();

    [UICommand]
    public void CyclePlacement()
        => ContainerGroup.CyclePlacement();

    [UICommand]
    public void CyclePadding()
        => ContainerGroup.CyclePadding();

    [UICommand]
    public void CycleBackground()
        => ContainerGroup.CycleBackground();

    [UICommand]
    public void CycleBorderColor()
        => ContainerGroup.CycleBorderColor();

    [UICommand]
    public void CycleBorderThickness()
        => ContainerGroup.CycleBorderThickness();

    [UICommand]
    public void CycleBorderRadius()
        => ContainerGroup.CycleBorderRadius();
}
