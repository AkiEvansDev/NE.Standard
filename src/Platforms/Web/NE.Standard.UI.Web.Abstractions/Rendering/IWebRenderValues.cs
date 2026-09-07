using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// This session's own values, for a render that paints them instead of leaving them to the client.
/// </summary>
public interface IWebRenderValues
{
    /// <summary>Reads a bound property's current value.</summary>
    bool TryGetValue(UIPropertyAddress address, out object? value);

    /// <summary>Reads a bound collection's current items, in order.</summary>
    bool TryGetItems(UIComponentAddress component, out IReadOnlyList<object?> items);
}
