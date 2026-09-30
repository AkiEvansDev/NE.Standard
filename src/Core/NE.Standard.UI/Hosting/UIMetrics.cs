using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Application;
using NE.Standard.UI.Files;
using NE.Standard.UI.Scheduling;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Hosting;

/// <summary>The framework's instruments under <see cref="UIDiagnostics.Name"/>.</summary>
/// <remarks>
/// Recording costs nothing measurable while no listener is attached, which is why the flush pass records every interval. The
/// observed counts are read only when a listener collects, so walking a store for its size is a cost of being measured, not of
/// serving. A store the application replaced reports nothing: its size is its own to measure.
/// </remarks>
internal sealed class UIMetrics : IDisposable
{
    public static readonly ActivitySource Activities = new(UIDiagnostics.Name);

    private readonly Meter _meter;
    // A meter the host's factory made is the factory's to dispose; one made here, for a host with no factory, is this one's.
    private readonly bool _ownsMeter;
    private readonly Counter<long> _runtimesCreated;
    private readonly Histogram<double> _runtimeStartDuration;
    private readonly Histogram<double> _commandDuration;
    private readonly Histogram<double> _flushDuration;
    private readonly Counter<long> _flushFailures;

    public UIMetrics(IMeterFactory? factory, UIRuntimeStore runtimes, UIUpdateDispatcher dispatcher, IServiceProvider services)
    {
        ArgumentNullException.ThrowIfNull(runtimes);
        ArgumentNullException.ThrowIfNull(dispatcher);
        ArgumentNullException.ThrowIfNull(services);

        _ownsMeter = factory is null;
        _meter = factory?.Create(UIDiagnostics.Name) ?? new Meter(UIDiagnostics.Name);

        _ = _meter.CreateObservableUpDownCounter("ne.ui.runtimes", () => runtimes.Count, "{runtime}", "The runtimes held: open pages and the ones kept for a while after they closed.");
        _ = _meter.CreateObservableUpDownCounter("ne.ui.runtimes.attached", () => runtimes.AttachedCount, "{connection}", "The connections attached to a runtime: the pages open now.");
        _ = _meter.CreateObservableUpDownCounter("ne.ui.updates.pending", () => dispatcher.PendingCount, "{change_set}", "Change sets waiting to be sent, over every client; a slow client shows here before its queue overflows.");
        _ = _meter.CreateObservableUpDownCounter("ne.ui.sessions", () => ObserveSessions(services), "{session}", "The sessions the in-memory session store holds.");
        _ = _meter.CreateObservableUpDownCounter("ne.ui.files", () => ObserveFileCount(services), "{file}", "The files the file store keeps on disk: uploads and staged downloads.");
        _ = _meter.CreateObservableUpDownCounter("ne.ui.files.size", () => ObserveFileSize(services), "By", "The bytes the file store's files take on disk.");
        _runtimesCreated = _meter.CreateCounter<long>("ne.ui.runtimes.created", "{runtime}", "Runtimes created, one per page a controller was built for.");
        _runtimeStartDuration = _meter.CreateHistogram<double>("ne.ui.runtime.start.duration", "s", "How long a new runtime took to initialize and start its controller.");
        _commandDuration = _meter.CreateHistogram<double>("ne.ui.command.duration", "s", "How long a command took, from the client's event to its answer.");
        _flushDuration = _meter.CreateHistogram<double>("ne.ui.flush.duration", "s", "How long one scheduled flush pass over every runtime took.");
        _flushFailures = _meter.CreateCounter<long>("ne.ui.flush.failures", "{runtime}", "Runtimes whose scheduled flush failed.");
    }

    private static IEnumerable<Measurement<int>> ObserveSessions(IServiceProvider services)
    {
        UserSessionMemoryStore? memory = services.GetService<IUserSessionStore>() switch
        {
            UserSessionMemoryStore store => store,
            UserSessionSplitStore split => split.Anonymous,
            _ => null
        };

        if (memory is not null)
            yield return new Measurement<int>(memory.Count);
    }

    private static IEnumerable<Measurement<int>> ObserveFileCount(IServiceProvider services)
    {
        if (services.GetService<IUIFileStore>() is FileSystemUIFileStore store)
            yield return new Measurement<int>(store.Count);
    }

    private static IEnumerable<Measurement<long>> ObserveFileSize(IServiceProvider services)
    {
        if (services.GetService<IUIFileStore>() is FileSystemUIFileStore store)
            yield return new Measurement<long>(store.Size);
    }

    public void RuntimeCreated()
        => _runtimesCreated.Add(1);

    public void RuntimeStarted(TimeSpan elapsed)
        => _runtimeStartDuration.Record(elapsed.TotalSeconds);

    public void CommandCompleted(string route, bool succeeded, TimeSpan elapsed)
        => _commandDuration.Record(elapsed.TotalSeconds, new KeyValuePair<string, object?>("ne.ui.route", route), new KeyValuePair<string, object?>("ne.ui.command.outcome", succeeded ? "ok" : "failed"));

    public void FlushCompleted(TimeSpan elapsed, int failedRuntimes)
    {
        _flushDuration.Record(elapsed.TotalSeconds);

        if (failedRuntimes > 0)
            _flushFailures.Add(failedRuntimes);
    }

    public void Dispose()
    {
        if (_ownsMeter)
            _meter.Dispose();
    }
}
