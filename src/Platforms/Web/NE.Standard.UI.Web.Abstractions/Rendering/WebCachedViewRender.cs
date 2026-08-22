using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebCachedViewRender
{
    public required string Html { get; init; }

    public required string MetadataJson { get; init; }

    public IReadOnlyList<int> InitBindingIds { get; init; } = [];

    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Html);
        ArgumentNullException.ThrowIfNull(MetadataJson);
        ArgumentNullException.ThrowIfNull(InitBindingIds);
    }
}
