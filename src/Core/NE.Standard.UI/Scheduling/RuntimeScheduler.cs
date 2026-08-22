using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace NE.Standard.UI.Scheduling;

internal sealed partial class RuntimeScheduler : IAsyncDisposable, IDisposable
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "UI runtime scheduler loop failed.")]
        public static partial void RuntimeSchedulerLoopFailed(ILogger logger, Exception exception);

        [LoggerMessage(EventId = 2, Level = LogLevel.Error, Message = "UI runtime scheduled task '{TaskType}' failed.")]
        public static partial void RuntimeScheduledTaskFailed(ILogger logger, Exception exception, string taskType);
    }

    private sealed class Entry
    {
        public required RuntimeScheduledTask Task { get; init; }
        public required DateTime NextRunUtc { get; set; }
    }

    private readonly Lock _sync = new();
    private readonly List<Entry> _entries = [];
    private readonly ILogger _logger;

    private CancellationTokenSource? _stop;
    private Task? _loop;
    private bool _disposed;

    public RuntimeScheduler(ILogger logger)
    {
        ArgumentNullException.ThrowIfNull(logger);
        _logger = logger;
    }

    public void Add(RuntimeScheduledTask task)
    {
        ThrowIfDisposed();
        ArgumentNullException.ThrowIfNull(task);

        lock (_sync)
        {
            _entries.Add(new Entry
            {
                Task = task,
                NextRunUtc = DateTime.UtcNow + task.Options.Interval
            });
        }
    }

    private void ThrowIfDisposed()
        => ObjectDisposedException.ThrowIf(_disposed, this);

    public void Start()
    {
        ThrowIfDisposed();

        lock (_sync)
        {
            if (_loop is not null)
                throw new InvalidOperationException("Runtime scheduler is already started.");

            _stop = new CancellationTokenSource();
            _loop = RunAsync(_stop.Token);
        }
    }

    public async ValueTask StopAsync()
    {
        CancellationTokenSource? stop;
        Task? loop;

        lock (_sync)
        {
            stop = _stop;
            loop = _loop;

            _stop = null;
            _loop = null;
        }

        if (stop is null || loop is null)
            return;

        await stop.CancelAsync().ConfigureAwait(false);

        try
        {
            await loop.ConfigureAwait(false);
        }
        catch (OperationCanceledException) { }
        finally
        {
            stop.Dispose();
        }
    }

    private async Task RunAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                DateTime utcNow = DateTime.UtcNow;
                TimeSpan delay = GetDelay(utcNow);

                await Task.Delay(delay, cancellationToken).ConfigureAwait(false);

                await ExecuteDueAsync(DateTime.UtcNow, cancellationToken).ConfigureAwait(false);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                Log.RuntimeSchedulerLoopFailed(_logger, exception);
            }
        }
    }

    private TimeSpan GetDelay(DateTime utcNow)
    {
        lock (_sync)
        {
            if (_entries.Count == 0)
                return Timeout.InfiniteTimeSpan;

            DateTime next = _entries[0].NextRunUtc;

            for (var i = 1; i < _entries.Count; i++)
            {
                if (_entries[i].NextRunUtc < next)
                    next = _entries[i].NextRunUtc;
            }

            TimeSpan delay = next - utcNow;

            return delay <= TimeSpan.Zero
                ? TimeSpan.Zero
                : delay;
        }
    }

    private async ValueTask ExecuteDueAsync(DateTime utcNow, CancellationToken cancellationToken)
    {
        Entry[] due;

        lock (_sync)
        {
            List<Entry> buffer = [];

            for (var i = 0; i < _entries.Count; i++)
            {
                Entry entry = _entries[i];

                if (entry.NextRunUtc <= utcNow)
                {
                    entry.NextRunUtc = utcNow + entry.Task.Options.Interval;
                    buffer.Add(entry);
                }
            }

            due = [.. buffer];
        }

        for (var i = 0; i < due.Length; i++)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                await due[i].Task.ExecuteAsync(utcNow, cancellationToken).ConfigureAwait(false);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception exception)
            {
                Log.RuntimeScheduledTaskFailed(_logger, exception, due[i].Task.GetType().Name);
            }
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_disposed)
            return;

        await StopAsync().ConfigureAwait(false);

        _disposed = true;

        lock (_sync)
            _entries.Clear();
    }

    public void Dispose()
    {
        if (_disposed)
            return;

        _disposed = true;

        lock (_sync)
        {
            _stop?.Cancel();
            _stop?.Dispose();

            _stop = null;
            _loop = null;
            _entries.Clear();
        }
    }
}
