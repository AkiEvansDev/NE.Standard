using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// One rendered item's scope: which compiled component introduced it, the key it is addressed by, and the
/// item itself. The key is required — every item collection is keyed, see <c>docs/PROJECT.md</c> §5.
/// </summary>
public readonly record struct WebDynamicParameterScope(
    UIComponentId ComponentId,
    string Key,
    object? Item = null
);
