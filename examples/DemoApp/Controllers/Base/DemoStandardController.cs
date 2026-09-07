using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

internal sealed partial class StandardGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIResponsive<UIVisibility> Visibility { get; set; } = UIVisibility.Visible;

    [RecursiveMember]
    public partial bool Enabled { get; set; } = true;

    // Unset, not Start: a preview has to open on what the control does when nobody has said anything.
    [RecursiveMember]
    public partial UIAlignment? HorizontalAlignment { get; set; }

    [RecursiveMember]
    public partial UIAlignment? VerticalAlignment { get; set; }

    [RecursiveMember]
    public partial UIResponsive<UIThickness> Margin { get; set; } = UIThickness.Uniform(0);

    [RecursiveMember]
    public partial UIResponsive<UILayoutLength> Width { get; set; } = UILayoutLength.Auto();

    [RecursiveMember]
    public partial UIResponsive<UILayoutLength> Height { get; set; } = UILayoutLength.Auto();

    [RecursiveMember]
    public partial UIThemeMode? Theme { get; set; }

    [RecursiveMember]
    public partial bool Loading { get; set; }

    // The rows every Main page's "Standard" section shows, in this order; the extents are left out on purpose.
    public StandardGroupContext()
    {
        AddOption(nameof(Visibility), CycleVisibility, () => Visibility);
        AddOption(nameof(Enabled), ToggleEnabled, () => Enabled);
        AddOption(nameof(HorizontalAlignment), CycleHorizontalAlignment, () => HorizontalAlignment);
        AddOption(nameof(VerticalAlignment), CycleVerticalAlignment, () => VerticalAlignment);
        AddOption(nameof(Margin), CycleMargin, () => Margin);
        AddOption(nameof(Width), CycleWidth, () => Width);
        AddOption(nameof(Height), CycleHeight, () => Height);
        AddOption(nameof(Theme), CycleTheme, () => Theme);
        AddOption(nameof(Loading), ToggleLoading, () => Loading);
    }

    // The fourth step is the responsive one: gone on a narrow window and back from `md` up.
    public void CycleVisibility()
        => SetLastChange(nameof(Visibility), Visibility = CycleValue(Visibility,
            UIVisibility.Visible,
            UIVisibility.Hidden,
            UIVisibility.Collapsed,
            UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, md: UIVisibility.Visible)));

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

    // A subtree theme override: the control repaints while the page around it does not.
    public void CycleTheme()
        => SetLastChange(nameof(Theme), Theme = CycleEnum(Theme));

    public void ToggleLoading()
        => SetLastChange(nameof(Loading), Loading = !Loading);
}

internal abstract partial class DemoStandardController : DemoController
{
    [RecursiveMember]
    public partial StandardGroupContext MainGroup { get; set; } = new();

    /// <summary>
    /// Cycles one Standard row's property, told apart by the row's own key.
    /// </summary>
    [UICommand]
    public void CycleMainOption(string id)
        => MainGroup.CycleOption(id);

    [UICommand]
    public void CycleVisibility()
        => MainGroup.CycleVisibility();

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
