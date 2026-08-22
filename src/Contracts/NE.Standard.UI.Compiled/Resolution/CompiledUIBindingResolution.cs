using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Resolution;

/// <summary>
/// Represents a resolved compiled binding with its source and materialized path.
/// </summary>
public readonly record struct CompiledUIBindingResolution(CompiledUIBinding Binding, CompiledUIBindingSource Source, RecursivePath Path);
