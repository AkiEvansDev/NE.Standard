namespace NE.Standard.UI.Compiled.Debugging;

/// <summary>
/// Configures which sections and metadata are included in compiled view debug output.
/// </summary>
public sealed class CompiledViewDebugOptions
{
    /// <summary>
    /// Gets whether the binding-source index section is included.
    /// </summary>
    public bool IncludeSources { get; init; } = true;

    /// <summary>
    /// Gets whether the binding-template index section is included.
    /// </summary>
    public bool IncludeTemplates { get; init; } = true;

    /// <summary>
    /// Gets whether the context index section is included.
    /// </summary>
    public bool IncludeContexts { get; init; } = true;

    /// <summary>
    /// Gets whether the binding index section is included.
    /// </summary>
    public bool IncludeBindings { get; init; } = true;

    /// <summary>
    /// Gets whether the interaction index section is included.
    /// </summary>
    public bool IncludeInteractions { get; init; } = true;

    /// <summary>
    /// Gets whether the event index section is included.
    /// </summary>
    public bool IncludeEvents { get; init; } = true;

    /// <summary>
    /// Gets whether the validation index section is included.
    /// </summary>
    public bool IncludeValidations { get; init; } = true;

    /// <summary>
    /// Gets whether the state-binding index section is included.
    /// </summary>
    public bool IncludeStateBindings { get; init; } = true;

    /// <summary>
    /// Gets whether the static (non-bound) property value section is included.
    /// </summary>
    public bool IncludeStaticValues { get; init; } = true;

    /// <summary>
    /// Gets whether static values left unset are listed alongside the ones the author set.
    /// </summary>
    public bool IncludeUnsetStaticValues { get; init; }

    /// <summary>
    /// Gets whether the component tree section is included.
    /// </summary>
    public bool IncludeComponentTree { get; init; } = true;

    /// <summary>
    /// Gets whether each component's parent id is included in the component tree section.
    /// </summary>
    public bool IncludeParent { get; init; } = true;

    /// <summary>
    /// Gets whether each component's slot root/owner is included in the component tree section.
    /// </summary>
    public bool IncludeSlotRootAndOwner { get; init; } = true;

    /// <summary>
    /// Gets whether each binding source's kind is included.
    /// </summary>
    public bool IncludeSourceKind { get; init; } = true;

    /// <summary>
    /// Gets whether each context's resolved path is included.
    /// </summary>
    public bool IncludeContextPath { get; init; } = true;

    /// <summary>
    /// Gets whether each context's dynamic-parameter count is included.
    /// </summary>
    public bool IncludeContextParameterCount { get; init; } = true;

    /// <summary>
    /// Gets whether the marker for a context-defining component is included.
    /// </summary>
    public bool IncludeContextParameterMarker { get; init; } = true;

    /// <summary>
    /// Gets whether ids are sorted numerically rather than by their raw string form.
    /// </summary>
    public bool SortByNumericIds { get; init; } = true;

    /// <summary>
    /// Gets the number of spaces used per indent level in the rendered output.
    /// </summary>
    public int IndentSize { get; init; } = 2;

    /// <summary>
    /// Gets the default debug rendering options.
    /// </summary>
    public static CompiledViewDebugOptions Default { get; } = new();

    /// <summary>
    /// Gets options that render only the component tree.
    /// </summary>
    public static CompiledViewDebugOptions TreeOnly { get; } = new()
    {
        IncludeSources = false,
        IncludeTemplates = false,
        IncludeContexts = false,
        IncludeBindings = false,
        IncludeInteractions = false,
        IncludeEvents = false,
        IncludeValidations = false,
        IncludeStateBindings = false,
        IncludeStaticValues = false,
        IncludeComponentTree = true
    };

    /// <summary>
    /// Gets options that render binding-related indexes without the component tree.
    /// </summary>
    public static CompiledViewDebugOptions BindingsOnly { get; } = new()
    {
        IncludeSources = true,
        IncludeTemplates = true,
        IncludeContexts = true,
        IncludeBindings = true,
        IncludeInteractions = false,
        IncludeEvents = false,
        IncludeValidations = false,
        IncludeStateBindings = true,
        IncludeStaticValues = false,
        IncludeComponentTree = false
    };
}
