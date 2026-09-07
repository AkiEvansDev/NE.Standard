using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

/// <summary>
/// A reading of how far along something is: the number, the window it is read against, and the two shapes it
/// may be drawn as.
/// </summary>
/// <remarks>An unset <c>Value</c> means indeterminate — running, but not knowing how far — which both shapes draw as movement.</remarks>
internal sealed partial class ProgressGroupContext : DemoGroupContext
{
    private const string SampleProgressLabel = "Restoring packages";

    [RecursiveMember]
    public partial string? Label { get; set; }

    [RecursiveMember]
    public partial decimal? Value { get; set; } = 62;

    [RecursiveMember]
    public partial decimal? Min { get; set; }

    [RecursiveMember]
    public partial decimal? Max { get; set; }

    [RecursiveMember]
    public partial UIProgressVariant? Variant { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    [RecursiveMember]
    public partial bool ShowValue { get; set; }

    [RecursiveMember]
    public partial string? ValueUnit { get; set; }

    public ProgressGroupContext()
    {
        AddOption(nameof(Label), ToggleLabel, () => Label);
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddOption(nameof(Variant), CycleVariant, () => Variant);
        AddOption(nameof(Color), CycleColor, () => Color);
        AddOption(nameof(ShowValue), ToggleShowValue, () => ShowValue);
        AddOption(nameof(ValueUnit), CycleValueUnit, () => ValueUnit);
    }

    public void ToggleLabel()
        => SetLastChange(nameof(Label), Label = CycleValue(Label, null, SampleProgressLabel));

    // (none) is a value here: an indeterminate bar runs on its own rather than standing still.
    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, 62m, 0m, 100m, null));

    // The window the number is read against: 62 of 0..100 and 62 of 0..200 are the same value and a different bar.
    public void CycleMin()
        => SetLastChange(nameof(Min), Min = CycleValue(Min, null, 50m));

    public void CycleMax()
        => SetLastChange(nameof(Max), Max = CycleValue(Max, null, 200m));

    public void CycleVariant()
        => SetLastChange(nameof(Variant), Variant = CycleEnum(Variant));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color,
            UIThemeColor.FromStyle(UIColorStyle.Success), UIThemeColor.FromStyle(UIColorStyle.Danger), null));

    public void ToggleShowValue()
        => SetLastChange(nameof(ShowValue), ShowValue = !ShowValue);

    // Says nothing until ShowValue is on, which is the point of the row sitting under it.
    public void CycleValueUnit()
        => SetLastChange(nameof(ValueUnit), ValueUnit = CycleValue(ValueUnit, null, "%", " MB"));
}

/// <summary>
/// The other half of "wait": a mark that turns while something is happening and says nothing about how far.
/// </summary>
internal sealed partial class SpinnerGroupContext : DemoGroupContext
{
    private const string SampleLabel = "Reading the manifest";

    [RecursiveMember]
    public partial string? Label { get; set; }

    [RecursiveMember]
    public partial UIIconSize? Size { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    public SpinnerGroupContext()
    {
        AddOption(nameof(Label), ToggleLabel, () => Label);
        AddOption(nameof(Size), CycleSize, () => Size);
        AddOption(nameof(Color), CycleColor, () => Color);
    }

    public void ToggleLabel()
        => SetLastChange(nameof(Label), Label = CycleValue(Label, null, SampleLabel));

    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color,
            UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.Muted, null));
}
