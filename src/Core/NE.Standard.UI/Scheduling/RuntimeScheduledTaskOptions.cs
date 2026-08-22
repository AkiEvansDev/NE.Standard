using System;

namespace NE.Standard.UI.Scheduling;

internal sealed class RuntimeScheduledTaskOptions
{
    public required TimeSpan Interval { get; init; }

    public void Validate()
    {
        if (Interval <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(Interval), Interval, "Interval must be greater than zero.");
    }
}
