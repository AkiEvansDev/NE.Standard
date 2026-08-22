using System;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a step value for temporal input components.
/// </summary>
public readonly record struct UITemporalStep(UITemporalStepUnit Unit, int Value)
{
    /// <summary>
    /// Creates a step measured in days.
    /// </summary>
    public static UITemporalStep Days(int value)
        => new(UITemporalStepUnit.Day, value);

    /// <summary>
    /// Creates a step measured in hours.
    /// </summary>
    public static UITemporalStep Hours(int value)
        => new(UITemporalStepUnit.Hour, value);

    /// <summary>
    /// Creates a step measured in minutes.
    /// </summary>
    public static UITemporalStep Minutes(int value)
        => new(UITemporalStepUnit.Minute, value);

    /// <summary>
    /// Creates a step measured in seconds.
    /// </summary>
    public static UITemporalStep Seconds(int value)
        => new(UITemporalStepUnit.Second, value);

    /// <summary>
    /// Validates that the step value is positive.
    /// </summary>
    public void Validate()
        => ArgumentOutOfRangeException.ThrowIfNegativeOrZero(Value);

    public override string ToString()
        => $"{Value}({Unit})";
}
