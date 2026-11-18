using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Sessions;
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
    private WebHydration(ReadOnlyMemory<byte> jsonUtf8, IWebRenderValues? values, UISessionSecret? signedInKey = null)
    {
        JsonUtf8 = jsonUtf8;
        Values = values;
        SignedInKey = signedInKey;
    }

    /// <summary>The page's hydration JSON as UTF-8: its words, and on a page with a controller its id, compile and values.</summary>
    public ReadOnlyMemory<byte> JsonUtf8 { get; }

    /// <summary>The page's hydration JSON decoded as text.</summary>
    public string Json => Encoding.UTF8.GetString(JsonUtf8.Span);

    /// <summary>
    /// The same values, for the render that paints them — null on a page with no controller, served from its cached markup.
    /// </summary>
    public IWebRenderValues? Values { get; }

    /// <summary>
    /// The key of a sign-in the controller made as the render built its runtime, which the render's response hands the client; none
    /// where it made none.
    /// </summary>
    public UISessionSecret? SignedInKey { get; }

    public static async Task<WebHydration> PrepareAsync(IUIHost host, UIViewResolution resolution, WebCachedViewRender render, WebPageWords words, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentNullException.ThrowIfNull(render);
        ArgumentNullException.ThrowIfNull(words);

        if (!resolution.HasController)
            return new WebHydration(JsonSerializer.SerializeToUtf8Bytes(new { words = words.Table, title = words.Title }, WebWireJson.Options), null);

        ServerPreparedSnapshot snapshot = await ServerEndpointCore
            .PrepareSnapshotAsync(host, resolution, render.InitBindingIds ?? [], cancellationToken)
            .ConfigureAwait(false);
        var view = resolution.View.Fingerprint;

        return new WebHydration(
            JsonSerializer.SerializeToUtf8Bytes(new { pageId = snapshot.PageId, view, sequence = snapshot.Sequence, identity = resolution.Route.IdentityParameters, changes = snapshot.Changes, words = words.Table, title = words.Title }, WebWireJson.Options),
            WebRenderValues.Create(snapshot.Changes),
            snapshot.SignedInKey
        );
    }
}
