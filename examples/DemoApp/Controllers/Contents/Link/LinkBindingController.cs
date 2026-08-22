using DemoApp.Controllers.Base;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Contents.Link;

internal sealed partial class LinkTypographyGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UITextAppearance TextType { get; set; } = UITextAppearance.Body;

    [RecursiveMember]
    public partial UIThemeColor? TextColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Primary);

    [RecursiveMember]
    public partial string Url { get; set; } = "#";

    public void CycleTextType()
        => SetLastChange(nameof(TextType), TextType = CycleValue(TextType,
            UITextAppearance.Body, UITextAppearance.Caption, UITextAppearance.Subtitle));

    public void CycleTextStyle()
        => SetLastChange(nameof(TextColor), TextColor = CycleValue(TextColor, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Danger), UIThemeColor.FromStyle(UIColorStyle.Default)));

    public void CycleTextColor()
        => SetLastChange(nameof(TextColor), TextColor = CycleValue(TextColor, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromColorVariant(ColorName.StellarRed), UIThemeColor.FromColorVariant(ColorName.AuroraGreen)));

    public void ToggleUrl()
        => SetLastChange(nameof(Url), Url = CycleValue(Url, "#", "https://example.com"));
}

internal sealed partial class LinkIconGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Icon { get; set; } = LucideIcons.ExternalLink;

    [RecursiveMember]
    public partial UIThemeColor IconColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Primary);

    [RecursiveMember]
    public partial UIIconSize IconSize { get; set; } = UIIconSize.Medium;

    public void ToggleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleValue(Icon, null, LucideIcons.ExternalLink, LucideIcons.Download));

    public void CycleIconColor()
    {
        CheckIcon();
        SetLastChange(nameof(IconColor), IconColor = CycleValue(IconColor, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Info), UIThemeColor.FromStyle(UIColorStyle.Danger), UIThemeColor.FromStyle(UIColorStyle.Default)));
    }

    public void CycleIconSize()
    {
        CheckIcon();
        SetLastChange(nameof(IconSize), IconSize = CycleEnum(IconSize));
    }

    private void CheckIcon()
    {
        if (string.IsNullOrEmpty(Icon))
            Icon = LucideIcons.ExternalLink;
    }
}

internal sealed partial class LinkBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial LinkTypographyGroupContext TypographyGroup { get; set; } = new();

    [RecursiveMember]
    public partial LinkIconGroupContext IconGroup { get; set; } = new();

    [UICommand]
    public void CycleTextType()
        => TypographyGroup.CycleTextType();

    [UICommand]
    public void CycleTextStyle()
        => TypographyGroup.CycleTextStyle();

    [UICommand]
    public void CycleTextColor()
        => TypographyGroup.CycleTextColor();

    [UICommand]
    public void ToggleUrl()
        => TypographyGroup.ToggleUrl();

    [UICommand]
    public void ToggleIcon()
        => IconGroup.ToggleIcon();

    [UICommand]
    public void CycleIconColor()
        => IconGroup.CycleIconColor();

    [UICommand]
    public void CycleIconSize()
        => IconGroup.CycleIconSize();
}
