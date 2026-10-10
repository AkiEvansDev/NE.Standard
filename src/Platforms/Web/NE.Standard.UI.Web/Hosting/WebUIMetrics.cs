using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Application;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Rendering;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The web platform's instruments, on the framework's meter (<see cref="UIDiagnostics.Name"/>) beside the host's own.
/// </summary>
/// <remarks>
/// The render cache and the staged values are observed rather than recorded into, so neither needs this type to be built; a
/// render cache the application replaced reports nothing.
/// </remarks>
internal sealed class WebUIMetrics : IDisposable
{
    private readonly Meter _meter;
    // A meter the host's factory made is the factory's to dispose; one made here, for a host with no factory, is this one's.
    private readonly bool _ownsMeter;
    private readonly UpDownCounter<long> _connections;
    private readonly Histogram<double> _renderDuration;
    private readonly Histogram<long> _renderLength;
    private readonly Counter<long> _filesTransferred;

    public WebUIMetrics(IServiceProvider services, WebValueStagingStore values)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(values);

        IMeterFactory? factory = services.GetService<IMeterFactory>();

        _ownsMeter = factory is null;
        _meter = factory?.Create(UIDiagnostics.Name) ?? new Meter(UIDiagnostics.Name);

        _connections = _meter.CreateUpDownCounter<long>("ne.ui.web.connections", "{connection}", "The hub connections open now.");
        _renderDuration = _meter.CreateHistogram<double>("ne.ui.web.render.duration", "s", "How long a page render took, from the resolved view to the finished document.");
        _renderLength = _meter.CreateHistogram<long>("ne.ui.web.render.length", "{char}", "How long a rendered page is, in characters, before compression.");
        _filesTransferred = _meter.CreateCounter<long>("ne.ui.web.files.transferred", "By", "Bytes of files uploaded to and downloaded from the file endpoints.");

        _ = _meter.CreateObservableUpDownCounter("ne.ui.web.render_cache.held", () => ObserveHeld(services, static cache => cache.HeldCount), "{render}", "The renders the render cache holds in memory.");
        _ = _meter.CreateObservableUpDownCounter("ne.ui.web.render_cache.held.size", () => ObserveHeld(services, static cache => cache.HeldBytes), "By", "The bytes the renders the render cache holds in memory take.");
        _ = _meter.CreateObservableCounter("ne.ui.web.render_cache.disk.io", () => ObserveDisk(services), "By", "Bytes the render cache read from and wrote to its folder.");
        _ = _meter.CreateObservableUpDownCounter("ne.ui.web.values.staged", () => values.Count, "{value}", "Values too large for the hub staged beside it now.");
        _ = _meter.CreateObservableUpDownCounter("ne.ui.web.values.staged.size", () => values.Size, "By", "The bytes the staged values hold now.");
    }

    private static IEnumerable<Measurement<long>> ObserveHeld(IServiceProvider services, Func<FileSystemWebViewRenderCache, long> read)
    {
        if (services.GetService<IWebViewRenderCache>() is FileSystemWebViewRenderCache cache)
            yield return new Measurement<long>(read(cache));
    }

    private static IEnumerable<Measurement<long>> ObserveDisk(IServiceProvider services)
    {
        if (services.GetService<IWebViewRenderCache>() is not FileSystemWebViewRenderCache cache)
            yield break;

        yield return new Measurement<long>(cache.DiskBytesRead, new KeyValuePair<string, object?>("ne.ui.io.direction", "read"));
        yield return new Measurement<long>(cache.DiskBytesWritten, new KeyValuePair<string, object?>("ne.ui.io.direction", "write"));
    }

    public void ConnectionOpened()
        => _connections.Add(1);

    public void ConnectionClosed()
        => _connections.Add(-1);

    public void PageRendered(string route, TimeSpan elapsed, int length)
    {
        KeyValuePair<string, object?> tag = new("ne.ui.route", route);

        _renderDuration.Record(elapsed.TotalSeconds, tag);
        _renderLength.Record(length, tag);
    }

    public void FileUploaded(long bytes)
        => _filesTransferred.Add(bytes, new KeyValuePair<string, object?>("ne.ui.io.direction", "upload"));

    public void FileDownloaded(long bytes)
        => _filesTransferred.Add(bytes, new KeyValuePair<string, object?>("ne.ui.io.direction", "download"));

    public void Dispose()
    {
        if (_ownsMeter)
            _meter.Dispose();
    }
}
