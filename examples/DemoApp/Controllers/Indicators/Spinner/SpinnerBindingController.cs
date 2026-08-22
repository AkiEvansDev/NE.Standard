using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Indicators.Spinner;

internal sealed partial class SpinnerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIIconSize Size { get; set; } = UIIconSize.Medium;

    [RecursiveMember]
    public partial UIThemeColor Color { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Primary);

    [RecursiveMember]
    public partial string? Label { get; set; }

    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Info), UIThemeColor.FromStyle(UIColorStyle.Warning), UIThemeColor.FromStyle(UIColorStyle.Success), UIThemeColor.FromStyle(UIColorStyle.Danger)));

    public void ToggleLabel()
        => SetLastChange(nameof(Label), Label = CycleValue(Label, null, "Loading..."));
}

internal sealed partial class SpinnerBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial SpinnerGroupContext SpinnerGroup { get; set; } = new();

    [UICommand]
    public void CycleSize()
        => SpinnerGroup.CycleSize();

    [UICommand]
    public void CycleColor()
        => SpinnerGroup.CycleColor();

    [UICommand]
    public void ToggleLabel()
        => SpinnerGroup.ToggleLabel();
}
