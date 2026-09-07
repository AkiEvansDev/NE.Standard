using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.NumberInput;

/// <summary>
/// The number, and the window it is allowed to move in.
/// </summary>
/// <remarks>Min and Max live with the value because the control validates the three together.</remarks>
internal sealed partial class NumberValueGroupContext : InputValueGroupContext
{
    [RecursiveMember]
    public partial decimal? Value { get; set; } = 12.5m;

    [RecursiveMember]
    public partial decimal? Min { get; set; }

    [RecursiveMember]
    public partial decimal? Max { get; set; }

    [RecursiveMember]
    public partial decimal? Step { get; set; }

    public NumberValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddOption(nameof(Step), CycleStep, () => Step);
        AddReadOnlyOption();
    }

    // No row clamps for itself: only the controller knows whether decimals and the minus sign are still allowed.
    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, 12.5m, -3m, 1250m, null));

    public void CycleMin()
        => SetLastChange(nameof(Min), Min = CycleValue(Min, null, 0m, -100m));

    public void CycleMax()
        => SetLastChange(nameof(Max), Max = CycleValue(Max, null, 100m, 2000m));

    // Seen with ShowStepper on, or with the arrow keys in the field.
    public void CycleStep()
        => SetLastChange(nameof(Step), Step = CycleValue(Step, null, 0.5m, 5m, 100m));

    /// <summary>
    /// Brings the value back between the bounds, and the bounds back into order, under the Format section's rules.
    /// </summary>
    public void Clamp(bool allowDecimals = true, bool allowNegative = true)
    {
        if (Min is decimal min && Max is decimal max && min > max)
            (Min, Max) = (max, min);

        if (!allowNegative)
        {
            if (Min is decimal lowerBound && lowerBound < 0m)
                Min = 0m;

            if (Max is decimal upperBound && upperBound < 0m)
                Max = 0m;
        }

        if (Value is not decimal value)
            return;

        if (!allowDecimals)
            value = decimal.Truncate(value);

        if (!allowNegative && value < 0m)
            value = 0m;

        if (Min is decimal lower && value < lower)
            value = lower;
        else if (Max is decimal upper && value > upper)
            value = upper;

        Value = value;
    }
}

/// <summary>
/// The field itself: the two appearances, what stands at either end of the number, and the stepper.
/// </summary>
internal sealed partial class NumberFieldGroupContext : AffixedFieldGroupContext
{
    [RecursiveMember]
    public partial string? PrefixText { get; set; }

    [RecursiveMember]
    public partial string? SuffixText { get; set; }

    [RecursiveMember]
    public partial bool ShowStepper { get; set; }

    public NumberFieldGroupContext() : base("0", DemoIcons.Clock, DemoIcons.Sliders)
    {
        AddAppearanceOption();
        AddPlaceholderOption();
        AddOption(nameof(PrefixText), TogglePrefixText, () => PrefixText);
        AddOption(nameof(SuffixText), ToggleSuffixText, () => SuffixText);
        AddAffixIconOptions();
        AddOption(nameof(ShowStepper), ToggleShowStepper, () => ShowStepper);
    }

    public void TogglePrefixText()
        => SetLastChange(nameof(PrefixText), PrefixText = CycleValue(PrefixText, null, "€"));

    public void ToggleSuffixText()
        => SetLastChange(nameof(SuffixText), SuffixText = CycleValue(SuffixText, null, "seconds"));

    public void ToggleShowStepper()
        => SetLastChange(nameof(ShowStepper), ShowStepper = !ShowStepper);
}

/// <summary>
/// What the number is allowed to be, and how it is written down once it is.
/// </summary>
/// <remarks>These four can leave the value in a state the component refuses, so the controller brings it back with them.</remarks>
internal sealed partial class NumberFormatGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? DisplayFormat { get; set; }

    [RecursiveMember]
    public partial bool AllowDecimals { get; set; } = true;

    [RecursiveMember]
    public partial bool AllowNegative { get; set; } = true;

    [RecursiveMember]
    public partial bool AllowThousandsSeparator { get; set; } = true;

    [RecursiveMember]
    public partial bool TrimTrailingZeros { get; set; }

    public NumberFormatGroupContext()
    {
        AddOption(nameof(DisplayFormat), CycleDisplayFormat, () => DisplayFormat);
        AddOption(nameof(AllowDecimals), ToggleAllowDecimals, () => AllowDecimals);
        AddOption(nameof(AllowNegative), ToggleAllowNegative, () => AllowNegative);
        AddOption(nameof(AllowThousandsSeparator), ToggleAllowThousandsSeparator, () => AllowThousandsSeparator);
        AddOption(nameof(TrimTrailingZeros), ToggleTrimTrailingZeros, () => TrimTrailingZeros);
    }

    public void CycleDisplayFormat()
        => SetLastChange(nameof(DisplayFormat), DisplayFormat = CycleValue(DisplayFormat, null, "N2", "C"));

    public void ToggleAllowDecimals()
        => SetLastChange(nameof(AllowDecimals), AllowDecimals = !AllowDecimals);

    public void ToggleAllowNegative()
        => SetLastChange(nameof(AllowNegative), AllowNegative = !AllowNegative);

    public void ToggleAllowThousandsSeparator()
        => SetLastChange(nameof(AllowThousandsSeparator), AllowThousandsSeparator = !AllowThousandsSeparator);

    public void ToggleTrimTrailingZeros()
        => SetLastChange(nameof(TrimTrailingZeros), TrimTrailingZeros = !TrimTrailingZeros);
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class NumberInputMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial NumberValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial NumberFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial NumberFormatGroupContext FormatGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Request timeout");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
    {
        ValueGroup.CycleOption(id);
        ValueGroup.Clamp(FormatGroup.AllowDecimals, FormatGroup.AllowNegative);
    }

    [UICommand]
    public void CycleFieldOption(string id)
        => FieldGroup.CycleOption(id);

    /// <summary>
    /// The one section whose rows reach into another: the value follows the constraint that was just tightened.
    /// </summary>
    [UICommand]
    public void CycleFormatOption(string id)
    {
        FormatGroup.CycleOption(id);
        ValueGroup.Clamp(FormatGroup.AllowDecimals, FormatGroup.AllowNegative);
    }

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
