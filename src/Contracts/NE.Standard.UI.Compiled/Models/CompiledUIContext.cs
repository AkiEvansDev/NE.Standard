using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Represents a compiled component data context.
/// </summary>
public sealed class CompiledUIContext
{
    /// <summary>
    /// Gets the compiled context id.
    /// </summary>
    public required UIContextId Id { get; init; }

    /// <summary>
    /// Gets the binding template id used to resolve the context.
    /// </summary>
    public required UIBindingTemplateId TemplateId { get; init; }
}
