using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A multi-select as the compiler checks it: what it is drawn as, and whether the reader may type values of their own.
/// </summary>
public interface IMultiSelectComponent : IVisualComponent
{
    /// <summary>
    /// Gets what the input is drawn as; unset is chips.
    /// </summary>
    UIMultiSelectVariant? Variant { get; }

    /// <summary>
    /// Gets whether the reader may type values of their own as chips.
    /// </summary>
    bool? AllowFreeText { get; }
}
