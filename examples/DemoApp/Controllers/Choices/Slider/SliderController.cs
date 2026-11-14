using System;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs;

namespace DemoApp.Controllers.Choices.Slider;

/// <summary>
/// The slider's chosen value, the band's upper handle, and whether the handles are read-only.
/// </summary>
internal sealed partial class SliderValueGroupContext : InputValueGroupContext
{
    [RecursiveMember]
    public partial decimal? Value { get; set; } = 40m;

    [RecursiveMember]
    public partial decimal? EndValue { get; set; } = 70m;

    public SliderValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(EndValue), CycleEndValue, () => EndValue);
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, 0m, 40m, 100m, null));

    public void CycleEndValue()
        => SetLastChange(nameof(EndValue), EndValue = CycleValue(EndValue, 70m, 100m, 20m, null));

    /// <summary>Keeps both handles inside <paramref name="bounds"/> and at least <see cref="SliderBoundsGroupContext.MinDistance"/> apart.</summary>
    public void Normalize(SliderBoundsGroupContext bounds, bool endMoved)
    {
        bounds.NormalizeOrder();
        Value = Clamp(Value, bounds);
        EndValue = Clamp(EndValue, bounds);
        KeepApart(bounds, endMoved);
    }

    private static decimal? Clamp(decimal? value, SliderBoundsGroupContext bounds)
    {
        if (value is not decimal current)
            return null;

        if (bounds.Min is decimal lower && current < lower)
            return lower;

        return bounds.Max is decimal upper && current > upper ? upper : current;
    }

    /// <summary>The band's other end moves out of the way of the one just set, as far as the bounds let it, so the band stays a band.</summary>
    private void KeepApart(SliderBoundsGroupContext bounds, bool endMoved)
    {
        var distance = bounds.MinDistance ?? 0;

        if (Value is not decimal start || EndValue is not decimal end || end - start >= distance)
            return;

        if (endMoved)
            Value = Math.Max(bounds.Min ?? 0, end - distance);
        else
            EndValue = Math.Min(bounds.Max ?? 100, start + distance);
    }
}

/// <summary>
/// The range the handles move in, the step they snap to, and the minimum gap between a band's two handles.
/// </summary>
internal sealed partial class SliderBoundsGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial decimal? Min { get; set; } = 0m;

    [RecursiveMember]
    public partial decimal? Max { get; set; } = 100m;

    [RecursiveMember]
    public partial decimal? Step { get; set; }

    [RecursiveMember]
    public partial decimal? MinDistance { get; set; }

    public SliderBoundsGroupContext()
    {
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddOption(nameof(Step), CycleStep, () => Step);
        AddOption(nameof(MinDistance), CycleMinDistance, () => MinDistance);
    }

    public void CycleMin()
        => SetLastChange(nameof(Min), Min = CycleValue(Min, 0m, -50m, 20m, null));

    public void CycleMax()
        => SetLastChange(nameof(Max), Max = CycleValue(Max, 100m, 10m, 250m, null));

    public void CycleStep()
        => SetLastChange(nameof(Step), Step = CycleValue(Step, null, 5m, 25m));

    public void CycleMinDistance()
        => SetLastChange(nameof(MinDistance), MinDistance = CycleValue(MinDistance, null, 10m, 30m));

    public void NormalizeOrder()
    {
        if (Min is decimal min && Max is decimal max && min > max)
            (Min, Max) = (max, min);
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
    public partial UISize? Size { get; set; } = UISize.Medium;

    [RecursiveMember]
    public partial bool ShowValue { get; set; }

    [RecursiveMember]
    public partial bool ShowRange { get; set; }

    public SliderTrackGroupContext()
    {
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Size), CycleSize, () => Size);
        AddOption(nameof(ShowValue), ToggleShowValue, () => ShowValue);
        AddOption(nameof(ShowRange), ToggleShowRange, () => ShowRange);
    }

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));

    public void ToggleShowValue()
        => SetLastChange(nameof(ShowValue), ShowValue = !ShowValue);

    public void ToggleShowRange()
        => SetLastChange(nameof(ShowRange), ShowRange = !ShowRange);
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class SliderController() : DemoStandardController
{
    [RecursiveMember]
    public partial SliderValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial SliderBoundsGroupContext BoundsGroup { get; set; } = new();

    [RecursiveMember]
    public partial SliderTrackGroupContext TrackGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Replicas");

    protected override Task OnOptionCycledAsync(string group, string id, CancellationToken cancellationToken)
    {
        if (group is nameof(ValueGroup) or nameof(BoundsGroup))
            ValueGroup.Normalize(BoundsGroup, endMoved: id is nameof(SliderValueGroupContext.EndValue) or nameof(SliderBoundsGroupContext.MinDistance));

        return Task.CompletedTask;
    }
}
