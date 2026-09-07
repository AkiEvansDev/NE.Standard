using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The values a page is rendered with: read once, painted into the markup, and carried in the page so the client starts with the same copy.
/// </summary>
internal sealed class WebHydration
{
    private static readonly JsonSerializerOptions JsonOptions = CreateOptions();

    public static WebHydration None { get; } = new(null, null);

    private WebHydration(string? json, IWebRenderValues? values)
    {
        Json = json;
        Values = values;
    }

    /// <summary>The payload to put in the page, or null when this page hydrates nothing.</summary>
    public string? Json { get; }

    /// <summary>
    /// The same values, for the render that paints them — null on a page that has none to paint.
    /// </summary>
    public IWebRenderValues? Values { get; }

    public static async Task<WebHydration> PrepareAsync(
        IUIHost host,
        UIViewResolution resolution,
        WebCachedViewRender render,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentNullException.ThrowIfNull(render);

        // A page with no controller is finished the moment it is rendered: nothing to fill in, nothing to tell the client.
        if (!resolution.HasController)
            return None;

        IUIRuntime? existing = host.TryGetRenderRuntime(resolution);

        return existing is not null
            ? await ReadAsync(existing, pageId: null, resolution.View.Fingerprint, render, cancellationToken).ConfigureAwait(false)
            : await PrepareNewAsync(host, resolution, render, cancellationToken).ConfigureAwait(false);
    }

    private static async Task<WebHydration> PrepareNewAsync(IUIHost host, UIViewResolution resolution, WebCachedViewRender render, CancellationToken cancellationToken)
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
            return await ReadAsync(runtime.Runtime, pageId, resolution.View.Fingerprint, render, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            // Released whatever happened: the render only authors this runtime; disconnected retention keeps it alive for the client.
            _ = host.DetachRuntime(runtime.Handle);
        }
    }

    private static async Task<WebHydration> ReadAsync(IUIRuntime? runtime, string? pageId, string view, WebCachedViewRender render, CancellationToken cancellationToken)
    {
        ServerChangeSet changes = await WebInitialChanges
            .BuildAsync(runtime, render.InitBindingIds ?? [], cancellationToken)
            .ConfigureAwait(false);

        // `view` is the compile's fingerprint: the attach presents it, and a page of another compile is reloaded rather than attached.
        return new WebHydration(
            JsonSerializer.Serialize(new { pageId, view, changes }, JsonOptions),
            WebRenderValues.Create(changes)
        );
    }

    private static JsonSerializerOptions CreateOptions()
    {
        JsonSerializerOptions options = new();

        WebWireJson.Apply(options);

        return options;
    }
}
