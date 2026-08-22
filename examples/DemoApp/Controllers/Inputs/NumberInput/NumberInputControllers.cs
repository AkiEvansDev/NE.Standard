using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.NumberInput;

internal sealed partial class NumberValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial decimal? Value { get; set; } = 3m;

    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, 3m, 1250000m, 12.5m, null));

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);
}

internal sealed partial class NumberFieldGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool AllowDecimals { get; set; } = true;

    [RecursiveMember]
    public partial bool AllowNegative { get; set; } = true;

    [RecursiveMember]
    public partial bool AllowThousandsSeparator { get; set; } = true;

    [RecursiveMember]
    public partial bool TrimTrailingZeros { get; set; }

    [RecursiveMember]
    public partial bool ShowStepper { get; set; } = true;

    [RecursiveMember]
    public partial string? PrefixText { get; set; }

    [RecursiveMember]
    public partial string? SuffixText { get; set; }

    public void ToggleAllowDecimals()
        => SetLastChange(nameof(AllowDecimals), AllowDecimals = !AllowDecimals);

    public void ToggleAllowNegative()
        => SetLastChange(nameof(AllowNegative), AllowNegative = !AllowNegative);

    public void ToggleAllowThousandsSeparator()
        => SetLastChange(nameof(AllowThousandsSeparator), AllowThousandsSeparator = !AllowThousandsSeparator);

    public void ToggleTrimTrailingZeros()
        => SetLastChange(nameof(TrimTrailingZeros), TrimTrailingZeros = !TrimTrailingZeros);

    public void ToggleShowStepper()
        => SetLastChange(nameof(ShowStepper), ShowStepper = !ShowStepper);

    public void TogglePrefixText()
        => SetLastChange(nameof(PrefixText), PrefixText = CycleValue(PrefixText, null, "$"));

    public void ToggleSuffixText()
        => SetLastChange(nameof(SuffixText), SuffixText = CycleValue(SuffixText, null, "s"));
}

internal sealed partial class NumberInputBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial NumberValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial NumberFieldGroupContext FieldGroup { get; set; } = new();

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
    public void ToggleAllowDecimals()
        => FieldGroup.ToggleAllowDecimals();

    [UICommand]
    public void ToggleAllowNegative()
        => FieldGroup.ToggleAllowNegative();

    [UICommand]
    public void ToggleAllowThousandsSeparator()
        => FieldGroup.ToggleAllowThousandsSeparator();

    [UICommand]
    public void ToggleTrimTrailingZeros()
        => FieldGroup.ToggleTrimTrailingZeros();

    [UICommand]
    public void ToggleShowStepper()
        => FieldGroup.ToggleShowStepper();

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
    public void CycleBadgeStyle()
        => BadgeGroup.CycleBadgeStyle();

    [UICommand]
    public void ToggleBadgeText()
        => BadgeGroup.ToggleBadgeText();

    [UICommand]
    public void ToggleBadgeIcon()
        => BadgeGroup.ToggleBadgeIcon();

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

internal sealed partial class NumberCommitGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial decimal? Value { get; set; } = 3m;

    /// <summary>
    /// Reports the raw controller value: the client formats for display (grouping, trimmed zeros), and
    /// what matters here is that none of that formatting reaches the server.
    /// </summary>
    public void RecordChange()
        => LogEvent($"change -> {Value?.ToString() ?? "null"}");
}

internal sealed partial class NumberInputTestController() : DemoController
{
    [RecursiveMember]
    public partial NumberCommitGroupContext CommitGroup { get; set; } = new();

    [UICommand]
    public void RecordChange()
        => CommitGroup.RecordChange();
}
