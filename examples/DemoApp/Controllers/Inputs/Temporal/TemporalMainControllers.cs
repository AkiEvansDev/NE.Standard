using System;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.Temporal;

/// <summary>
/// A calendar date and the window it may fall in.
/// </summary>
/// <remarks>The control validates bounds and value together, so a row that moves a bound brings the value back inside.</remarks>
internal sealed partial class DateValueGroupContext : InputValueGroupContext
{
    private static readonly DateOnly Sample = new(2026, 7, 14);

    [RecursiveMember]
    public partial DateOnly? Value { get; set; } = Sample;

    [RecursiveMember]
    public partial DateOnly? EndValue { get; set; } = Sample.AddDays(4);

    [RecursiveMember]
    public partial DateOnly? Min { get; set; }

    [RecursiveMember]
    public partial DateOnly? Max { get; set; }

    public DateValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(EndValue), CycleEndValue, () => EndValue);
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, Sample, new DateOnly(2026, 12, 31), null));

    // Read only by the period pane; the single pane carries the binding and ignores it.
    public void CycleEndValue()
        => SetLastChange(nameof(EndValue), EndValue = CycleValue(EndValue, Sample.AddDays(4), Sample.AddDays(30), null));

    public void CycleMin()
    {
        SetLastChange(nameof(Min), Min = CycleValue(Min, null, new DateOnly(2026, 7, 1), new DateOnly(2026, 8, 1)));
        Clamp();
    }

    public void CycleMax()
    {
        SetLastChange(nameof(Max), Max = CycleValue(Max, null, new DateOnly(2026, 7, 31), new DateOnly(2026, 6, 30)));
        Clamp();
    }

    private void Clamp()
    {
        if (Min is DateOnly min && Max is DateOnly max && min > max)
            (Min, Max) = (max, min);

        if (Value is not DateOnly value)
            return;

        if (Min is DateOnly lower && value < lower)
            Value = lower;
        else if (Max is DateOnly upper && value > upper)
            Value = upper;
    }
}

/// <summary>
/// A time of day and the window it may fall in.
/// </summary>
internal sealed partial class TimeValueGroupContext : InputValueGroupContext
{
    private static readonly TimeOnly Sample = new(9, 30);

    [RecursiveMember]
    public partial TimeOnly? Value { get; set; } = Sample;

    [RecursiveMember]
    public partial TimeOnly? EndValue { get; set; } = new(17, 0);

    [RecursiveMember]
    public partial TimeOnly? Min { get; set; }

    [RecursiveMember]
    public partial TimeOnly? Max { get; set; }

    public TimeValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(EndValue), CycleEndValue, () => EndValue);
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, Sample, new TimeOnly(23, 45), null));

    public void CycleEndValue()
        => SetLastChange(nameof(EndValue), EndValue = CycleValue(EndValue, new TimeOnly(17, 0), new TimeOnly(23, 59), null));

    public void CycleMin()
    {
        SetLastChange(nameof(Min), Min = CycleValue(Min, null, new TimeOnly(8, 0), new TimeOnly(12, 0)));
        Clamp();
    }

    public void CycleMax()
    {
        SetLastChange(nameof(Max), Max = CycleValue(Max, null, new TimeOnly(18, 0), new TimeOnly(10, 0)));
        Clamp();
    }

    private void Clamp()
    {
        if (Min is TimeOnly min && Max is TimeOnly max && min > max)
            (Min, Max) = (max, min);

        if (Value is not TimeOnly value)
            return;

        if (Min is TimeOnly lower && value < lower)
            Value = lower;
        else if (Max is TimeOnly upper && value > upper)
            Value = upper;
    }
}

/// <summary>
/// A moment — a date, a time and the offset they are read in.
/// </summary>
/// <remarks>The offset is part of the value, so changing only it moves the same wall-clock reading to a different instant.</remarks>
internal sealed partial class DateTimeValueGroupContext : InputValueGroupContext
{
    private static readonly DateTimeOffset Sample = new(2026, 7, 14, 9, 30, 0, TimeSpan.Zero);

    [RecursiveMember]
    public partial DateTimeOffset? Value { get; set; } = Sample;

    [RecursiveMember]
    public partial DateTimeOffset? EndValue { get; set; } = Sample.AddHours(30);

    [RecursiveMember]
    public partial DateTimeOffset? Min { get; set; }

    [RecursiveMember]
    public partial DateTimeOffset? Max { get; set; }

    public DateTimeValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(EndValue), CycleEndValue, () => EndValue);
        AddOption("Offset", CycleOffset, () => Value?.Offset);
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, Sample, new DateTimeOffset(2026, 12, 31, 23, 45, 0, TimeSpan.Zero), null));

    public void CycleEndValue()
        => SetLastChange(nameof(EndValue), EndValue = CycleValue(EndValue, Sample.AddHours(30), new DateTimeOffset(2026, 12, 31, 23, 59, 0, TimeSpan.Zero), null));

    /// <summary>
    /// Keeps the wall-clock reading and moves the offset.
    /// </summary>
    public void CycleOffset()
    {
        if (Value is not DateTimeOffset value)
        {
            Value = Sample;
            value = Sample;
        }

        TimeSpan next = value.Offset == TimeSpan.Zero
            ? TimeSpan.FromHours(2)
            : value.Offset == TimeSpan.FromHours(2) ? TimeSpan.FromHours(-5) : TimeSpan.Zero;

        Value = new DateTimeOffset(value.DateTime, next);
        SetLastChange("Offset", next);
    }

    public void CycleMin()
    {
        SetLastChange(nameof(Min), Min = CycleValue(Min, null, new DateTimeOffset(2026, 7, 1, 0, 0, 0, TimeSpan.Zero), new DateTimeOffset(2026, 8, 1, 0, 0, 0, TimeSpan.Zero)));
        Clamp();
    }

    public void CycleMax()
    {
        SetLastChange(nameof(Max), Max = CycleValue(Max, null, new DateTimeOffset(2026, 7, 31, 23, 59, 0, TimeSpan.Zero), new DateTimeOffset(2026, 6, 30, 23, 59, 0, TimeSpan.Zero)));
        Clamp();
    }

    private void Clamp()
    {
        if (Min is DateTimeOffset min && Max is DateTimeOffset max && min > max)
            (Min, Max) = (max, min);

        if (Value is not DateTimeOffset value)
            return;

        if (Min is DateTimeOffset lower && value < lower)
            Value = lower;
        else if (Max is DateTimeOffset upper && value > upper)
            Value = upper;
    }
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class DateInputMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial DateValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TemporalFieldGroupContext FieldGroup { get; set; } = new("yyyy-MM-dd", "d MMMM yyyy");

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Release date");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleFieldOption(string id)
        => FieldGroup.CycleOption(id);

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

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class TimeInputMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial TimeValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TemporalFieldGroupContext FieldGroup { get; set; } = new("HH:mm", "h:mm tt");

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Deploy window opens");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleFieldOption(string id)
        => FieldGroup.CycleOption(id);

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

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class DateTimeInputMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial DateTimeValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TemporalFieldGroupContext FieldGroup { get; set; } = new("yyyy-MM-dd HH:mm", "d MMMM yyyy, HH:mm");

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Scheduled for");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleFieldOption(string id)
        => FieldGroup.CycleOption(id);

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
