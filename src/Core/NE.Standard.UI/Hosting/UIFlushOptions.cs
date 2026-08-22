using System;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Hosting;

internal readonly record struct UIFlushOptions(UIControllerUpdateMode Mode, TimeSpan Interval)
{
    public void Validate()
    {
        if (Interval <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(Interval), Interval, "Flush interval must be greater than zero.");
    }

    public bool IsScheduled => Mode == UIControllerUpdateMode.Batch;
}
