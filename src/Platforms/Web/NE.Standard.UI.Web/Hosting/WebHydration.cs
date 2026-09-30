using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The values a page is rendered with: read once, painted into the markup, and carried in the page so the client starts with the same copy.
/// </summary>
/// <remarks>
/// Every page carries its words — the table it translates by and its title's key — whether or not it has values, since a page with
/// no controller switches language too.
/// </remarks>
internal sealed class WebHydration
{
    private static readonly JsonSerializerOptions JsonOptions = WebWireJson.CreateOptions();

    private WebHydration(string json, IWebRenderValues? values)
    {
        Json = json;
        Values = values;
    }

    /// <summary>The page's hydration JSON: its words, and on a page with a controller its id, compile and values.</summary>
    public string Json { get; }

    /// <summary>
    /// The same values, for the render that paints them — null on a page that has none to paint.
    /// </summary>
    public IWebRenderValues? Values { get; }

    public static async Task<WebHydration> PrepareAsync(IUIHost host, UIViewResolution resolution, WebCachedViewRender render, WebPageWords words, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentNullException.ThrowIfNull(render);
        ArgumentNullException.ThrowIfNull(words);

        // A page with no controller is finished the moment it is rendered: nothing to fill in, only its words to tell the client.
        if (!resolution.HasController)
            return new WebHydration(JsonSerializer.Serialize(new { words = words.Table, title = words.Title }, JsonOptions), null);

        IUIRuntime? existing = host.TryGetRenderRuntime(resolution);

        if (existing is null)
            return await PrepareNewAsync(host, resolution, render, words, cancellationToken).ConfigureAwait(false);

        // A runtime kept while its session moved to another language or theme hears it first, so the paint is not its old text.
        await UIHost.HearBeforeRenderAsync(existing, resolution, cancellationToken).ConfigureAwait(false);

        return await ReadAsync(existing, pageId: null, resolution.View.Fingerprint, render, words, cancellationToken).ConfigureAwait(false);
    }

    private static async Task<WebHydration> PrepareNewAsync(IUIHost host, UIViewResolution resolution, WebCachedViewRender render, WebPageWords words, CancellationToken cancellationToken)
    {
        var pageId = Guid.NewGuid().ToString("N");

        UIInstance instance = new()
        {
            Id = pageId,
            WindowId = pageId,
            Navigation = resolution.Navigation,
            PageId = pageId
        };

        RuntimeResolution runtime = await host.AttachRuntimeAsync(resolution, instance, cancellationToken).ConfigureAwait(false);

        try
        {
            return await ReadAsync(runtime.Runtime, pageId, resolution.View.Fingerprint, render, words, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            // Released whatever happened: the render only authors this runtime; disconnected retention keeps it alive for the client.
            _ = host.DetachRuntime(runtime.Handle);
        }
    }

    private static async Task<WebHydration> ReadAsync(IUIRuntime? runtime, string? pageId, string view, WebCachedViewRender render, WebPageWords words, CancellationToken cancellationToken)
    {
        ServerChangeSet changes = await WebInitialChanges
            .BuildAsync(runtime, render.InitBindingIds ?? [], cancellationToken)
            .ConfigureAwait(false);

        // `view` is the compile's fingerprint: the attach presents it, and a page of another compile is reloaded rather than attached.
        return new WebHydration(
            JsonSerializer.Serialize(new { pageId, view, changes, words = words.Table, title = words.Title }, JsonOptions),
            WebRenderValues.Create(changes)
        );
    }
}
