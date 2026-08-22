using System;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// One server-rendered item, addressed by the same key its element carries.
/// </summary>
public sealed class WebRenderItemValue
{
    public required string Key { get; init; }

    public object? Item { get; init; }

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(Key))
            throw new InvalidOperationException("Item value key must not be empty.");
    }
}
