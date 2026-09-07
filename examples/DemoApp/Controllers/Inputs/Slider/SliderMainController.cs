using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs.Slider;

/// <summary>
/// The number itself, and the range it is allowed to move in.
/// </summary>
/// <remarks>Min, Max and Step are one section because the slider validates them together.</remarks>
internal sealed partial class SliderValueGroupContext : InputValueGroupContext
{
    [RecursiveMember]
    public partial decimal? Value { get; set; } = 40m;

    [RecursiveMember]
    public partial decimal? Min { get; set; } = 0m;

    [RecursiveMember]
    public partial decimal? Max { get; set; } = 100m;

    [RecursiveMember]
    public partial decimal? Step { get; set; }

    public SliderValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddOption(nameof(Step), CycleStep, () => Step);
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, 0m, 40m, 100m, null));

    // The bounds bring the value back inside themselves: an out-of-range slider is refused, not a state.
    public void CycleMin()
    {
        SetLastChange(nameof(Min), Min = CycleValue(Min, 0m, -50m, 20m, null));
        Clamp();
    }

    public void CycleMax()
    {
        SetLastChange(nameof(Max), Max = CycleValue(Max, 100m, 10m, 250m, null));
        Clamp();
    }

    public void CycleStep()
        => SetLastChange(nameof(Step), Step = CycleValue(Step, null, 5m, 25m));

    private void Clamp()
    {
        if (Min is decimal min && Max is decimal max && min > max)
            (Min, Max) = (max, min);

        if (Value is not decimal value)
            return;

        if (Min is decimal lower && value < lower)
            Value = lower;
        else if (Max is decimal upper && value > upper)
            Value = upper;
    }
}

/// <summary>
/// How the track is drawn, and what it says beside itself.
/// </summary>
internal sealed partial class SliderTrackGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIOrientation? Orientation { get; set; } = UIOrientation.Horizontal;

    [RecursiveMember]
    public partial bool ShowValue { get; set; }

    [RecursiveMember]
    public partial bool ShowRange { get; set; }

    public SliderTrackGroupContext()
    {
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(ShowValue), ToggleShowValue, () => ShowValue);
        AddOption(nameof(ShowRange), ToggleShowRange, () => ShowRange);
    }

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void ToggleShowValue()
        => SetLastChange(nameof(ShowValue), ShowValue = !ShowValue);

    public void ToggleShowRange()
        => SetLastChange(nameof(ShowRange), ShowRange = !ShowRange);
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class SliderMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial SliderValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial SliderTrackGroupContext TrackGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Replicas");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleTrackOption(string id)
        => TrackGroup.CycleOption(id);

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);
}
