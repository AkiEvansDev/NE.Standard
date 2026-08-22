using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public interface IWebViewRenderCache
{
    ValueTask ClearAsync(CancellationToken cancellationToken);

    ValueTask<WebCachedViewRender?> GetRenderAsync(string key, CancellationToken cancellationToken);

    ValueTask SetRenderAsync(string key, WebCachedViewRender render, CancellationToken cancellationToken);

    ValueTask<IReadOnlyList<int>?> GetInitBindingIdsAsync(string key, CancellationToken cancellationToken);
}
