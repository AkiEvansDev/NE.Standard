using System;
using System.Threading;

namespace NE.Standard.UI.Hosting;

internal readonly record struct UIFlushOptions(TimeSpan Interval)
{
    public void Validate()
    {
        // Infinite where the application flushes nothing on a schedule: the runtime then waits for an explicit flush.
        if (Interval <= TimeSpan.Zero && Interval != Timeout.InfiniteTimeSpan)
            throw new ArgumentOutOfRangeException(nameof(Interval), Interval, "Flush interval must be greater than zero.");
    }
}
