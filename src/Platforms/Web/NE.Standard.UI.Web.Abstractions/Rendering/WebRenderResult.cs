using System;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderResult
{
    public required IHtmlContent Content { get; init; }

    public required WebRenderMetadata Metadata { get; init; }

    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Content);
        ArgumentNullException.ThrowIfNull(Metadata);

        Metadata.Validate();
    }
}
