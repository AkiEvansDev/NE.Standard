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
    private readonly Counter<long> _runtimesEvicted;
    private readonly Counter<long> _runtimesRefused;
    private readonly Counter<long> _resyncs;
    private readonly Counter<long> _valuesRefused;
    private readonly Counter<long> _sessionsEvicted;

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
        _runtimesEvicted = _meter.CreateCounter<long>("ne.ui.runtimes.evicted", "{runtime}", "Runtimes given up to make room for a new one, by the limit that gave them up.");
        _runtimesRefused = _meter.CreateCounter<long>("ne.ui.runtimes.refused", "{runtime}", "New runtimes refused because the session or the process held as many as it may, none of which could go.");
        _resyncs = _meter.CreateCounter<long>("ne.ui.resyncs", "{resync}", "Full resyncs a runtime was asked for: a client fallen behind, a send that failed, a handler's call.");
        _valuesRefused = _meter.CreateCounter<long>("ne.ui.values.refused", "{value}", "Client value writes not taken: refused by a gate, rejected by the input's format, forged, or stale (a row no longer held).");
        _sessionsEvicted = _meter.CreateCounter<long>("ne.ui.sessions.evicted", "{session}", "Sessions no client used, given up oldest first past the process's limit on them.");
    }

    private static IEnumerable<Measurement<int>> ObserveSessions(IServiceProvider services)
    {
        if (UserSessionMemoryStore.Of(services.GetService<IUserSessionStore>()) is { } memory)
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

    /// <summary>Records a command's run; <paramref name="outcome"/> is <c>ok</c>, <c>failed</c>, or <c>cancelled</c> by its page leaving.</summary>
    public void CommandCompleted(string route, string outcome, TimeSpan elapsed)
        => _commandDuration.Record(elapsed.TotalSeconds, new KeyValuePair<string, object?>("ne.ui.route", route), new KeyValuePair<string, object?>("ne.ui.command.outcome", outcome));

    public void RuntimeEvicted(UIRuntimeEviction eviction)
        => _runtimesEvicted.Add(1, new KeyValuePair<string, object?>("ne.ui.eviction.reason", eviction switch
        {
            UIRuntimeEviction.SessionUnclaimed => "session_unclaimed",
            UIRuntimeEviction.SessionFull => "session_full",
            UIRuntimeEviction.ProcessUnclaimed => "process_unclaimed",
            _ => "process_disconnected"
        }));

    /// <summary>Records a new runtime refused, by the process's limit or by the session's.</summary>
    public void RuntimeRefused(bool processFull)
        => _runtimesRefused.Add(1, new KeyValuePair<string, object?>("ne.ui.refusal.reason", processFull ? "process_full" : "session_full"));

    public void ResyncRequested()
        => _resyncs.Add(1);

    /// <summary>Records a client value not taken; <paramref name="outcome"/> is <c>refused</c>, <c>rejected</c>, <c>forged</c> or <c>stale</c>.</summary>
    public void ValueRefused(string outcome)
        => _valuesRefused.Add(1, new KeyValuePair<string, object?>("ne.ui.value.outcome", outcome));

    public void SessionsEvicted(int count)
        => _sessionsEvicted.Add(count);

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
