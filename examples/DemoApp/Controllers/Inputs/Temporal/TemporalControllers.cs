using System;
using DemoApp.Controllers.Base;

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
    public partial TimeSpan? MinDistance { get; set; }

    [RecursiveMember]
    public partial DateOnly? Min { get; set; }

    [RecursiveMember]
    public partial DateOnly? Max { get; set; }

    public DateValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(EndValue), CycleEndValue, () => EndValue);
        AddOption(nameof(MinDistance), CycleMinDistance, () => MinDistance);
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddReadOnlyOption();
    }

    public void CycleValue()
    {
        SetLastChange(nameof(Value), Value = CycleValue(Value, Sample, new DateOnly(2026, 12, 31), null));
        KeepApart(endMoved: false);
    }

    // Read only by the period pane; the single pane carries the binding and ignores it.
    public void CycleEndValue()
    {
        SetLastChange(nameof(EndValue), EndValue = CycleValue(EndValue, Sample.AddDays(4), Sample.AddDays(30), null));
        KeepApart(endMoved: true);
    }

    // Whole days: a date input refuses a part of one.
    public void CycleMinDistance()
    {
        SetLastChange(nameof(MinDistance), MinDistance = CycleValue(MinDistance, null, TimeSpan.FromDays(2), TimeSpan.FromDays(7)));
        KeepApart(endMoved: true);
    }

    /// <summary>The period's other end moves out of the way of the one just set, so the page and the server hold the distance it names.</summary>
    private void KeepApart(bool endMoved)
    {
        if (MinDistance is not TimeSpan distance || Value is not DateOnly start || EndValue is not DateOnly end || end.DayNumber - start.DayNumber >= distance.Days)
            return;

        if (endMoved)
            Value = end.AddDays(-distance.Days);
        else
            EndValue = start.AddDays(distance.Days);
    }

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
    public partial TimeSpan? MinDistance { get; set; }

    [RecursiveMember]
    public partial TimeOnly? Min { get; set; }

    [RecursiveMember]
    public partial TimeOnly? Max { get; set; }

    public TimeValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(EndValue), CycleEndValue, () => EndValue);
        AddOption(nameof(MinDistance), CycleMinDistance, () => MinDistance);
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddReadOnlyOption();
    }

    public void CycleValue()
    {
        SetLastChange(nameof(Value), Value = CycleValue(Value, Sample, new TimeOnly(23, 45), null));
        KeepApart(endMoved: false);
    }

    public void CycleEndValue()
    {
        SetLastChange(nameof(EndValue), EndValue = CycleValue(EndValue, new TimeOnly(17, 0), new TimeOnly(23, 59), null));
        KeepApart(endMoved: true);
    }

    public void CycleMinDistance()
    {
        SetLastChange(nameof(MinDistance), MinDistance = CycleValue(MinDistance, null, TimeSpan.FromHours(1), TimeSpan.FromHours(10)));
        KeepApart(endMoved: true);
    }

    /// <summary>The period's other end moves out of the way of the one just set, as far as the day lets it: a time has no day past its own.</summary>
    private void KeepApart(bool endMoved)
    {
        if (MinDistance is not TimeSpan distance || Value is not TimeOnly start || EndValue is not TimeOnly end || end.ToTimeSpan() - start.ToTimeSpan() >= distance)
            return;

        if (endMoved)
            Value = TimeOnly.FromTimeSpan(end.ToTimeSpan() > distance ? end.ToTimeSpan() - distance : TimeSpan.Zero);
        else
            EndValue = TimeOnly.FromTimeSpan(start.ToTimeSpan() + distance < TimeSpan.FromDays(1) ? start.ToTimeSpan() + distance : new TimeSpan(23, 59, 0));
    }

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
    public partial TimeSpan? MinDistance { get; set; }

    [RecursiveMember]
    public partial DateTimeOffset? Min { get; set; }

    [RecursiveMember]
    public partial DateTimeOffset? Max { get; set; }

    public DateTimeValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(EndValue), CycleEndValue, () => EndValue);
        AddOption(nameof(MinDistance), CycleMinDistance, () => MinDistance);
        AddOption("Offset", CycleOffset, () => Value?.Offset);
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddReadOnlyOption();
    }

    public void CycleValue()
    {
        SetLastChange(nameof(Value), Value = CycleValue(Value, Sample, new DateTimeOffset(2026, 12, 31, 23, 45, 0, TimeSpan.Zero), null));
        KeepApart(endMoved: false);
    }

    public void CycleEndValue()
    {
        SetLastChange(nameof(EndValue), EndValue = CycleValue(EndValue, Sample.AddHours(30), new DateTimeOffset(2026, 12, 31, 23, 59, 0, TimeSpan.Zero), null));
        KeepApart(endMoved: true);
    }

    public void CycleMinDistance()
    {
        SetLastChange(nameof(MinDistance), MinDistance = CycleValue(MinDistance, null, TimeSpan.FromHours(12), TimeSpan.FromHours(36)));
        KeepApart(endMoved: true);
    }

    /// <summary>
    /// The period's other end moves out of the way of the one just set, by instant, as the server's gate compares them; the end moved
    /// keeps its own offset.
    /// </summary>
    internal void KeepApart(bool endMoved)
    {
        if (MinDistance is not TimeSpan distance || Value is not DateTimeOffset start || EndValue is not DateTimeOffset end || end - start >= distance)
            return;

        if (endMoved)
            Value = (end - distance).ToOffset(start.Offset);
        else
            EndValue = (start + distance).ToOffset(end.Offset);
    }

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
internal sealed partial class DateInputController() : DemoStandardController
{
    [RecursiveMember]
    public partial DateValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TemporalFieldGroupContext FieldGroup { get; set; } = new("dd.MM.yyyy", "d MMMM yyyy");

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Release date");

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class TimeInputController() : DemoStandardController
{
    [RecursiveMember]
    public partial TimeValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TemporalFieldGroupContext FieldGroup { get; set; } = new("h:mm tt", "HH:mm:ss");

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Deploy window opens");

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class DateTimeInputController() : DemoStandardController
{
    [RecursiveMember]
    public partial DateTimeValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TemporalFieldGroupContext FieldGroup { get; set; } = new("dd.MM.yyyy HH:mm", "d MMMM yyyy, HH:mm");

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Scheduled for");

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();
}
