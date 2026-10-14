using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Testing;

/// <summary>
/// The platform's side of the host for a test: what the runtimes push — the dialogs they open among it — and the files they send reach
/// the open page they are addressed to, by its instance id, as a connection would carry them. No file is ever picked for an upload.
/// </summary>
internal sealed class UITestClient : IUIUpdateSink, IUIDownloadStager, IUIUploadService
{
    private const string NoFiles = "A test page picks no files.";

    private readonly ConcurrentDictionary<string, UITestPage> _pages = new(StringComparer.Ordinal);

    public void Add(string instanceId, UITestPage page)
        => _pages[instanceId] = page;

    public void Remove(string instanceId)
        => _pages.TryRemove(instanceId, out _);

    public Task SendChangesAsync(UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(instanceIds);
        ArgumentNullException.ThrowIfNull(changes);

        changes.Validate();

        foreach (var instanceId in instanceIds)
        {
            if (_pages.TryGetValue(instanceId, out UITestPage? page))
                page.Receive(changes);
        }

        return Task.CompletedTask;
    }

    public Task SendCommandResultAsync(UIHandle handle, UICommandExecutionResult result, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(result);

        result.Validate();

        if (_pages.TryGetValue(handle.Instance.Id, out UITestPage? page))
            page.Receive(result);

        return Task.CompletedTask;
    }


    // Delivered here, as an in-process platform delivers a file itself: the page holds the bytes, and no fetch is sent.
    public async Task<ClientEffect?> StageAsync(UIHandle handle, string fileName, string contentType, Stream content, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileName);
        ArgumentException.ThrowIfNullOrWhiteSpace(contentType);
        ArgumentNullException.ThrowIfNull(content);

        using MemoryStream copy = new();

        await content.CopyToAsync(copy, cancellationToken).ConfigureAwait(false);

        if (_pages.TryGetValue(handle.Instance.Id, out UITestPage? page))
            page.Receive(new UITestDownload(fileName, contentType, copy.ToArray()));

        return null;
    }

    public Task<UIUploadSelection> GetSelectionAsync(UIHandle handle, string selectionId, CancellationToken cancellationToken = default)
        => Task.FromResult(new UIUploadSelection([]));

    public Task<UIUploadedFile> OpenAsync(UIHandle handle, string fileId, IProgress<double>? progress = null, CancellationToken cancellationToken = default)
        => throw new NotSupportedException(NoFiles);

    public Task<UIUploadedFile[]> OpenManyAsync(UIHandle handle, string[] fileIds, IProgress<double>? progress = null, CancellationToken cancellationToken = default)
        => Task.FromResult(Array.Empty<UIUploadedFile>());

    public Task<UITransferResult> CopyToAsync(UIHandle handle, string fileId, Stream destination, IProgress<double>? progress = null, CancellationToken cancellationToken = default)
        => Task.FromResult(UITransferResult.Fail(NoFiles));

    public Task<UITransferResult[]> CopyManyToAsync(UIHandle handle, string[] fileIds, Func<UIUploadFile, Stream> destinationFactory, IProgress<double>? progress = null, CancellationToken cancellationToken = default)
        => Task.FromResult(Array.Empty<UITransferResult>());
}
