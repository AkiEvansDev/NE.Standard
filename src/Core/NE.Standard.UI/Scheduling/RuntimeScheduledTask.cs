using System;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.UI.Scheduling;

internal abstract class RuntimeScheduledTask
{
    protected RuntimeScheduledTask(RuntimeScheduledTaskOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);

        options.Validate();

        Options = options;
    }

    public RuntimeScheduledTaskOptions Options { get; }

    public abstract ValueTask ExecuteAsync(DateTime utcNow, CancellationToken cancellationToken);
}
