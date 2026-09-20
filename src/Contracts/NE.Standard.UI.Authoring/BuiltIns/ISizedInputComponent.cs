using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents an input that says how much room it takes — every built-in input, a field and a toggle alike.
/// </summary>
public interface ISizedInputComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Size"/>.
    /// </summary>
    static UIProperty SizeProperty { get; } = new(nameof(Size));

    /// <summary>
    /// Gets how much room the input takes: a field's height, side padding and text; a toggle's box and text; a slider's track and
    /// handle.
    /// </summary>
    UIInputSize? Size { get; }
}
