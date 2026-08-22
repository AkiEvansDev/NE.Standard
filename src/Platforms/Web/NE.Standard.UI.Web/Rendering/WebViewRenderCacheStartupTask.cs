using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Rendering;

internal sealed class WebViewRenderCacheStartupTask(IWebViewRenderCache cache, IOptions<WebViewRenderCacheOptions> options) : IHostedService
{
    private readonly IWebViewRenderCache _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    private readonly IOptions<WebViewRenderCacheOptions> _options = options ?? throw new ArgumentNullException(nameof(options));

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        if (!_options.Value.ClearOnStartup)
            return;

        await _cache.ClearAsync(cancellationToken).ConfigureAwait(false);
    }

    public Task StopAsync(CancellationToken cancellationToken)
        => Task.CompletedTask;
}
