using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Resolution;

/// <summary>
/// Represents a resolved command argument value, binding path, or contextual argument marker.
/// </summary>
public readonly record struct CompiledUIActionArgumentResolution(
    CompiledUIActionArgument Argument,
    CompiledUIBindingSource? Source,
    RecursivePath? Path,
    object? LiteralValue
);
