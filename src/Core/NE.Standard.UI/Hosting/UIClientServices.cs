using System;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Updates;

namespace NE.Standard.UI.Hosting;

internal readonly record struct UIClientServices(IUIUpdateSink Updates, IUIDownloadStager Downloads, IUIUploadService Uploads)
{
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Updates);
        ArgumentNullException.ThrowIfNull(Downloads);
        ArgumentNullException.ThrowIfNull(Uploads);
    }
}
