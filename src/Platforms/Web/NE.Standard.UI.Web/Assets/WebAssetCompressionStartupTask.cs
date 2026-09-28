using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using NE.Standard.UI.Web.Abstractions.Assets;

namespace NE.Standard.UI.Web.Assets;

/// <summary>Compresses the framework's assets in the background once the host has started; a start is never held up by it.</summary>
internal sealed class WebAssetCompressionStartupTask(WebAssetCompression compression, IWebAssetRegistry assets) : IHostedService, IDisposable
{
    private readonly CancellationTokenSource _stopping = new();

    public Task StartAsync(CancellationToken cancellationToken)
    {
        if (compression.Enabled)
            _ = Task.Run(() => compression.Warm([.. assets.Assets], _stopping.Token), CancellationToken.None);

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
        => _stopping.CancelAsync();

    public void Dispose()
        => _stopping.Dispose();
}
