using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents an input the viewer types free text into: what is typed can be trimmed, and Escape can cancel the edit.
/// </summary>
public interface ITextEntryInputComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="TrimInput"/>.
    /// </summary>
    static UIProperty TrimInputProperty { get; } = new(nameof(TrimInput));

    /// <summary>
    /// Gets the registered property key for <see cref="CancelOnEscape"/>.
    /// </summary>
    static UIProperty CancelOnEscapeProperty { get; } = new(nameof(CancelOnEscape));

    /// <summary>
    /// Gets whether leading and trailing whitespace is trimmed from the input.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    bool? TrimInput { get; }

    /// <summary>
    /// Gets whether Escape is the field's cancel where it has an <c>OnEscape</c> command: it goes back to its last committed value
    /// and runs the command. Off, Escape commits and leaves as in a field without one; bound, a field cancels only while it holds an
    /// edit.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    bool? CancelOnEscape { get; }
}
