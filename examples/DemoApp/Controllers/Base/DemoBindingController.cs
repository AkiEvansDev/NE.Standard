using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

internal sealed partial class StandardGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIResponsive<bool> Visible { get; set; } = true;

    [RecursiveMember]
    public partial bool Enabled { get; set; } = true;

    [RecursiveMember]
    public partial UIAlignment HorizontalAlignment { get; set; } = UIAlignment.Start;

    [RecursiveMember]
    public partial UIAlignment VerticalAlignment { get; set; } = UIAlignment.Start;

    [RecursiveMember]
    public partial UIResponsive<UIThickness> Margin { get; set; } = UIThickness.Uniform(0);

    [RecursiveMember]
    public partial UIResponsive<UILayoutLength> Width { get; set; } = UILayoutLength.Auto();

    [RecursiveMember]
    public partial UIResponsive<UILayoutLength> Height { get; set; } = UILayoutLength.Auto();

    public void ToggleVisible()
        => SetLastChange(nameof(Visible), Visible = !Visible.Base);

    public void ToggleEnabled()
        => SetLastChange(nameof(Enabled), Enabled = !Enabled);

    public void CycleHorizontalAlignment()
        => SetLastChange(nameof(HorizontalAlignment), HorizontalAlignment = CycleEnum(HorizontalAlignment));

    public void CycleVerticalAlignment()
        => SetLastChange(nameof(VerticalAlignment), VerticalAlignment = CycleEnum(VerticalAlignment));

    public void CycleMargin()
        => SetLastChange(nameof(Margin), Margin = CycleValue(Margin, UIThickness.Uniform(0), UIThickness.Uniform(8), UIThickness.Uniform(16), UIThickness.Uniform(24)));

    public void CycleWidth()
        => SetLastChange(nameof(Width), Width = CycleValue(Width, UILayoutLength.Auto(), UILayoutLength.Absolute(120), UILayoutLength.Absolute(220)));

    public void CycleHeight()
        => SetLastChange(nameof(Height), Height = CycleValue(Height, UILayoutLength.Auto(), UILayoutLength.Absolute(60), UILayoutLength.Absolute(120)));
}

internal abstract partial class DemoBindingController : DemoController
{
    [RecursiveMember]
    public partial StandardGroupContext MainGroup { get; set; } = new();

    [UICommand]
    public void ToggleVisible()
        => MainGroup.ToggleVisible();

    [UICommand]
    public void ToggleEnabled()
        => MainGroup.ToggleEnabled();

    [UICommand]
    public void CycleHorizontalAlignment()
        => MainGroup.CycleHorizontalAlignment();

    [UICommand]
    public void CycleVerticalAlignment()
        => MainGroup.CycleVerticalAlignment();

    [UICommand]
    public void CycleMargin()
        => MainGroup.CycleMargin();

    [UICommand]
    public void CycleWidth()
        => MainGroup.CycleWidth();

    [UICommand]
    public void CycleHeight()
        => MainGroup.CycleHeight();
}
