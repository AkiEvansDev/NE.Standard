using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for field inputs whose field is a single row, so a glyph can stand beside the text. It sits
/// below <see cref="FieldInputComponentBase{TComponent, TValue}"/> rather than on it to keep the pair off
/// <c>TextAreaComponent</c>, whose field is a box: an icon at the start of a paragraph has nowhere to be.
/// </summary>
public abstract partial class AffixedInputComponentBase<TComponent, TValue>(string? id = null) : FieldInputComponentBase<TComponent, TValue>(id), IAffixedInputComponent
    where TComponent : AffixedInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IAffixedInputComponent), DefaultValue = null)]
    public string? PrefixIcon { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IAffixedInputComponent), DefaultValue = null)]
    public string? SuffixIcon { get; set; }
}
