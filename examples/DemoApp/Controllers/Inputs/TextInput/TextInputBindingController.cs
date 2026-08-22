using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs.TextInput;

/// <summary>
/// The one group that is genuinely TextInput's own: the single-line field's prefix/suffix adornments and
/// its native input type. Everything else on its binding page reuses the shared input contexts.
/// </summary>
internal sealed partial class TextInputFieldGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UITextInputType Type { get; set; } = UITextInputType.Text;

    [RecursiveMember]
    public partial string? PrefixText { get; set; }

    [RecursiveMember]
    public partial string? SuffixText { get; set; }

    // Each control cycles one property and records what it changed, so a page can be read as "this button
    // moved that value" rather than needing the controller open beside it.
    public void CycleType()
        => SetLastChange(nameof(Type), Type = CycleValue(Type,
            UITextInputType.Text, UITextInputType.Password, UITextInputType.Email, UITextInputType.Url, UITextInputType.Tel));

    public void TogglePrefixText()
        => SetLastChange(nameof(PrefixText), PrefixText = CycleValue(PrefixText, null, "https://nova.dev"));

    public void ToggleSuffixText()
        => SetLastChange(nameof(SuffixText), SuffixText = CycleValue(SuffixText, null, "seconds"));
}

internal sealed partial class TextInputBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial TextValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextInputFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial InputContentGroupContext ContentGroup { get; set; } = new();

    [RecursiveMember]
    public partial InputBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial InputBorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleValue()
        => ValueGroup.CycleValue();

    [UICommand]
    public void ToggleIsReadOnly()
        => ValueGroup.ToggleIsReadOnly();

    [UICommand]
    public void CycleMaxLength()
        => ValueGroup.CycleMaxLength();

    [UICommand]
    public void ToggleTrimInput()
        => ValueGroup.ToggleTrimInput();

    [UICommand]
    public void CycleType()
        => FieldGroup.CycleType();

    [UICommand]
    public void TogglePrefixText()
        => FieldGroup.TogglePrefixText();

    [UICommand]
    public void ToggleSuffixText()
        => FieldGroup.ToggleSuffixText();

    [UICommand]
    public void ToggleIcon()
        => ContentGroup.ToggleIcon();

    [UICommand]
    public void CycleIconColor()
        => ContentGroup.CycleIconColor();

    [UICommand]
    public void CycleIconSize()
        => ContentGroup.CycleIconSize();

    [UICommand]
    public void ToggleTitle()
        => ContentGroup.ToggleTitle();

    [UICommand]
    public void CycleTitleType()
        => ContentGroup.CycleTitleType();

    [UICommand]
    public void CycleTitleColor()
        => ContentGroup.CycleTitleColor();

    [UICommand]
    public void ToggleTooltip()
        => ContentGroup.ToggleTooltip();

    [UICommand]
    public void CycleBadgePlacement()
        => BadgeGroup.CycleBadgePlacement();

    [UICommand]
    public void CycleBadgeStyle()
        => BadgeGroup.CycleBadgeStyle();

    [UICommand]
    public void ToggleBadgeIcon()
        => BadgeGroup.ToggleBadgeIcon();

    [UICommand]
    public void CycleBadgeIconColor()
        => BadgeGroup.CycleBadgeIconColor();

    [UICommand]
    public void CycleBadgeIconSize()
        => BadgeGroup.CycleBadgeIconSize();

    [UICommand]
    public void ToggleBadgeText()
        => BadgeGroup.ToggleBadgeText();

    [UICommand]
    public void CycleBadgeTextType()
        => BadgeGroup.CycleBadgeTextType();

    [UICommand]
    public void ToggleBadgeTooltip()
        => BadgeGroup.ToggleBadgeTooltip();

    [UICommand]
    public void CycleBorderColor()
        => BorderGroup.CycleBorderColor();

    [UICommand]
    public void CycleBorderThickness()
        => BorderGroup.CycleBorderThickness();

    [UICommand]
    public void CycleBorderRadius()
        => BorderGroup.CycleBorderRadius();
}
