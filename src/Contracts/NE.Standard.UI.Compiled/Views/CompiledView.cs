using System.Collections.Generic;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Compiled.Views;

/// <summary>
/// Represents a compiled UI view with component graph, state, bindings, events, interactions, and validations.
/// </summary>
public sealed class CompiledView
{
    /// <summary>
    /// Gets the view title.
    /// </summary>
    public required string Title { get; init; }

    /// <summary>
    /// Gets the choices the view makes about its own shell.
    /// </summary>
    public UIViewOptions Options { get; init; } = UIViewOptions.Default;

    /// <summary>
    /// Gets compiled regions declared by the view.
    /// </summary>
    public required CompiledRegion[] Regions { get; init; }

    /// <summary>
    /// Gets compiled dialogs declared by the view.
    /// </summary>
    public required CompiledDialog[] Dialogs { get; init; }

    /// <summary>
    /// Gets the compiled component graph.
    /// </summary>
    public required UIComponentGraph Graph { get; init; }

    /// <summary>
    /// Gets compiled component state.
    /// </summary>
    public required UIComponentStateIndex State { get; init; }

    /// <summary>
    /// Gets compiled binding sources.
    /// </summary>
    public required UICompiledBindingSourceIndex Sources { get; init; }

    /// <summary>
    /// Gets compiled binding templates.
    /// </summary>
    public required UICompiledBindingTemplateIndex Templates { get; init; }

    /// <summary>
    /// Gets compiled component contexts.
    /// </summary>
    public required UIComponentContextIndex Contexts { get; init; }

    /// <summary>
    /// Gets compiled bindings.
    /// </summary>
    public required UICompiledBindingIndex Bindings { get; init; }

    /// <summary>
    /// Gets compiled client-side interactions.
    /// </summary>
    public required UIInteractionIndex Interactions { get; init; }

    /// <summary>
    /// Gets compiled UI events.
    /// </summary>
    public required UIEventIndex Events { get; init; }

    /// <summary>
    /// Gets compiled validation rules.
    /// </summary>
    public required UIValidationIndex Validations { get; init; }

    /// <summary>What compiled but is not what the author meant, for the host to log.</summary>
    public IReadOnlyList<string> Warnings { get; init; } = [];

    /// <summary>
    /// One short hash over what a page's client holds of this compile — components, bindings, events and interactions by id — so a
    /// page rendered from another compile of the same view is told apart from this one.
    /// </summary>
    public required string Fingerprint { get; init; }
}
