using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// A view's shared render as the render cache keeps it: its markup and metadata as UTF-8, and the bindings a first paint fills.
/// </summary>
public sealed class WebCachedViewRender
{
    /// <summary>Gets the view's markup as UTF-8; empty in an entry that keeps only its init bindings.</summary>
    public ReadOnlyMemory<byte> Html { get; init; }

    /// <summary>Gets the render metadata's JSON as UTF-8; empty in an entry that keeps only its init bindings.</summary>
    public ReadOnlyMemory<byte> MetadataJson { get; init; }

    /// <summary>Gets the bindings whose values a page's first paint carries.</summary>
    public IReadOnlyList<int> InitBindingIds { get; init; } = [];

    /// <summary>Gets whether the entry carries the page itself, which only a view without a controller is served from.</summary>
    public bool HasPage => !Html.IsEmpty;

    /// <summary>An entry without a page, carrying only the init bindings: all a view with a controller reads off it.</summary>
    public static WebCachedViewRender InitBindingsOnly(IReadOnlyList<int> initBindingIds)
        => new() { InitBindingIds = initBindingIds };

    /// <summary>Checks the entry carries its markup and metadata together, or neither.</summary>
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(InitBindingIds);

        if (Html.IsEmpty != MetadataJson.IsEmpty)
            throw new InvalidOperationException("A cached render carries its markup and its metadata together, or neither.");
    }
}
