using System;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Updates;

namespace NE.Standard.UI.Hosting;

internal readonly record struct UIClientServices(IUIUpdateSink Updates, IUIDialogService Dialogs, IUIDownloadService Downloads, IUIUploadService Uploads)
{
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Updates);
        ArgumentNullException.ThrowIfNull(Dialogs);
        ArgumentNullException.ThrowIfNull(Downloads);
        ArgumentNullException.ThrowIfNull(Uploads);
    }
}
