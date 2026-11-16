using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Rendering;

/// <summary>
/// Bounded in-memory view render cache with zero filesystem churn, used by single-process hosts such as <c>NE.Standard.UI.Desktop</c>.
/// </summary>
internal sealed class InMemoryWebViewRenderCache : IWebViewRenderCache
{
    private readonly ConcurrentDictionary<string, HeldRender> _renders = new(StringComparer.Ordinal);
    private readonly int _maxHeldRenders;
    private readonly long _maxHeldBytes;
    private long _reads;
    private long _heldBytes;

    public InMemoryWebViewRenderCache(IOptions<WebViewRenderCacheOptions> options)
    {
        ArgumentNullException.ThrowIfNull(options);

        _maxHeldRenders = options.Value.MaxHeldRenders > 0
            ? options.Value.MaxHeldRenders
            : throw new ArgumentOutOfRangeException(nameof(options), options.Value.MaxHeldRenders, "Held render count must be greater than zero.");

        _maxHeldBytes = options.Value.MaxHeldBytes > 0
            ? options.Value.MaxHeldBytes
            : throw new ArgumentOutOfRangeException(nameof(options), options.Value.MaxHeldBytes, "Held render bytes must be greater than zero.");
    }

    public long HeldCount => _renders.Count;

    public long HeldBytes => Interlocked.Read(ref _heldBytes);

    public ValueTask ClearAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        foreach (KeyValuePair<string, HeldRender> pair in _renders)
            Release(pair);

        return ValueTask.CompletedTask;
    }

    private void Release(KeyValuePair<string, HeldRender> pair)
    {
        if (_renders.TryRemove(pair))
            _ = Interlocked.Add(ref _heldBytes, -pair.Value.Bytes);
    }

    public ValueTask<WebCachedViewRender?> GetRenderAsync(string key, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        cancellationToken.ThrowIfCancellationRequested();

        if (!_renders.TryGetValue(key, out HeldRender? held))
            return ValueTask.FromResult<WebCachedViewRender?>(null);

        held.Touch(Interlocked.Increment(ref _reads));
        return ValueTask.FromResult<WebCachedViewRender?>(held.Render);
    }

    public ValueTask SetRenderAsync(string key, WebCachedViewRender render, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(render);
        cancellationToken.ThrowIfCancellationRequested();

        render.Validate();
        Hold(key, render);
        return ValueTask.CompletedTask;
    }

    private void Hold(string key, WebCachedViewRender render)
    {
        HeldRender held = new(render, Interlocked.Increment(ref _reads));

        while (true)
        {
            if (_renders.TryGetValue(key, out HeldRender? previous))
            {
                if (_renders.TryUpdate(key, held, previous))
                {
                    _ = Interlocked.Add(ref _heldBytes, held.Bytes - previous.Bytes);
                    break;
                }
            }
            else if (_renders.TryAdd(key, held))
            {
                _ = Interlocked.Add(ref _heldBytes, held.Bytes);
                break;
            }
        }

        if (_renders.Count > _maxHeldRenders || Interlocked.Read(ref _heldBytes) > _maxHeldBytes)
            TrimHeldRenders();
    }

    private void TrimHeldRenders()
    {
        var targetCount = Math.Max(1, _maxHeldRenders * 3 / 4);
        var targetBytes = _maxHeldBytes / 4 * 3;

        KeyValuePair<string, HeldRender>[] snapshot = [.. _renders];
        Array.Sort(snapshot, static (left, right) => left.Value.Stamp.CompareTo(right.Value.Stamp));

        for (var i = 0; i < snapshot.Length - 1 && (_renders.Count > targetCount || Interlocked.Read(ref _heldBytes) > targetBytes); i++)
            Release(snapshot[i]);
    }

    public ValueTask<IReadOnlyList<int>?> GetInitBindingIdsAsync(string key, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        cancellationToken.ThrowIfCancellationRequested();

        if (!_renders.TryGetValue(key, out HeldRender? held))
            return ValueTask.FromResult<IReadOnlyList<int>?>(null);

        held.Touch(Interlocked.Increment(ref _reads));
        return ValueTask.FromResult<IReadOnlyList<int>?>(held.Render.InitBindingIds);
    }

    private sealed class HeldRender(WebCachedViewRender render, long stamp)
    {
        public WebCachedViewRender Render { get; } = render;

        public long Bytes { get; } = (long)render.Html.Length + render.MetadataJson.Length + ((long)render.InitBindingIds.Count * sizeof(int));

        public long Stamp { get; private set; } = stamp;

        public void Touch(long value) => Stamp = value;
    }
}
