using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Represents a compiled recursive path template for a binding source.
/// </summary>
public sealed class CompiledUIBindingTemplate
{
    /// <summary>
    /// Gets the compiled binding template id.
    /// </summary>
    public required UIBindingTemplateId Id { get; init; }

    /// <summary>
    /// Gets the binding source id this template belongs to.
    /// </summary>
    public required UIBindingSourceId SourceId { get; init; }

    /// <summary>
    /// Gets the recursive path template string.
    /// </summary>
    public required string Template { get; init; }

    /// <summary>
    /// Gets the number of parameters required to materialize the template.
    /// </summary>
    public int ParameterCount { get; init; }
}
