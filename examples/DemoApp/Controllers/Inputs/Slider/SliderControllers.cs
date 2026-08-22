using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs.Slider;

internal sealed partial class SliderValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial decimal Value { get; set; } = 40m;

    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, 0m, 40m, 80m, 100m));

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);
}

internal sealed partial class SliderRangeGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial decimal Min { get; set; }

    [RecursiveMember]
    public partial decimal Max { get; set; } = 100m;

    [RecursiveMember]
    public partial decimal Step { get; set; } = 1m;

    public void CycleMin()
        => SetLastChange(nameof(Min), Min = CycleValue(Min, 0m, 20m, 50m));

    public void CycleMax()
        => SetLastChange(nameof(Max), Max = CycleValue(Max, 100m, 200m, 60m));

    public void CycleStep()
        => SetLastChange(nameof(Step), Step = CycleValue(Step, 1m, 5m, 25m));
}

internal sealed partial class SliderReadoutGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIOrientation Orientation { get; set; } = UIOrientation.Horizontal;

    [RecursiveMember]
    public partial bool ShowValue { get; set; } = true;

    [RecursiveMember]
    public partial bool ShowRange { get; set; } = true;

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void ToggleShowValue()
        => SetLastChange(nameof(ShowValue), ShowValue = !ShowValue);

    public void ToggleShowRange()
        => SetLastChange(nameof(ShowRange), ShowRange = !ShowRange);
}

internal sealed partial class SliderBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial SliderValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial SliderRangeGroupContext RangeGroup { get; set; } = new();

    [RecursiveMember]
    public partial SliderReadoutGroupContext ReadoutGroup { get; set; } = new();

    [UICommand]
    public void CycleValue()
        => ValueGroup.CycleValue();

    [UICommand]
    public void ToggleIsReadOnly()
        => ValueGroup.ToggleIsReadOnly();

    [UICommand]
    public void CycleMin()
        => RangeGroup.CycleMin();

    [UICommand]
    public void CycleMax()
        => RangeGroup.CycleMax();

    [UICommand]
    public void CycleStep()
        => RangeGroup.CycleStep();

    [UICommand]
    public void CycleOrientation()
        => ReadoutGroup.CycleOrientation();

    [UICommand]
    public void ToggleShowValue()
        => ReadoutGroup.ToggleShowValue();

    [UICommand]
    public void ToggleShowRange()
        => ReadoutGroup.ToggleShowRange();
}

/// <summary>
/// The clamp scenario: the controller deliberately pushes a value outside the slider's own bounds. A
/// range input silently clamps whatever it is given, so without the reconciliation this page exists to
/// check, the controller would keep believing 500 while the handle sat at the maximum.
/// </summary>
internal sealed partial class SliderClampGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial decimal Value { get; set; } = 8m;

    public void PushAbove()
        => SetLastChange(nameof(Value), Value = 500m);

    public void PushBelow()
        => SetLastChange(nameof(Value), Value = -40m);

    public void RecordChange()
        => LogEvent($"server now holds {Value}");
}

internal sealed partial class SliderTestController() : DemoController
{
    [RecursiveMember]
    public partial SliderClampGroupContext ClampGroup { get; set; } = new();

    [UICommand]
    public void PushAbove()
        => ClampGroup.PushAbove();

    [UICommand]
    public void PushBelow()
        => ClampGroup.PushBelow();

    [UICommand]
    public void RecordChange()
        => ClampGroup.RecordChange();
}
