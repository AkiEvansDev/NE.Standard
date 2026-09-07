using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Resolution;

/// <summary>
/// One rendered item's scope: which compiled component introduced it, the key it is addressed by, and the item itself.
/// </summary>
public readonly record struct UIDynamicParameterScope(
    UIComponentId ComponentId,
    string Key,
    object? Item = null
);
