using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs.TextArea;

/// <summary>
/// TextArea's own two properties. <c>Wrap</c> is deliberately not driven here: it is declared but never
/// rendered, since an editable multi-line control has no native equivalent of <c>WrapEllipsis</c>
/// (<c>docs/PROJECT.md</c> §7), and a control that cycles a value nothing reacts to is
/// exactly what these pages exist to avoid.
/// </summary>
internal sealed partial class TextAreaFieldGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial int Rows { get; set; } = 3;

    [RecursiveMember]
    public partial UITextAreaResizeMode Resize { get; set; } = UITextAreaResizeMode.Vertical;

    public void CycleRows()
        => SetLastChange(nameof(Rows), Rows = CycleValue(Rows, 2, 3, 6));

    public void CycleResize()
        => SetLastChange(nameof(Resize), Resize = CycleEnum(Resize));
}

internal sealed partial class TextAreaBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial TextValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextAreaFieldGroupContext FieldGroup { get; set; } = new();

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
    public void CycleRows()
        => FieldGroup.CycleRows();

    [UICommand]
    public void CycleResize()
        => FieldGroup.CycleResize();

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
