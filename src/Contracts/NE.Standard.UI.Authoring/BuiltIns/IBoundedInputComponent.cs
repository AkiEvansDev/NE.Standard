using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// An input whose value is held between a <c>Min</c> and a <c>Max</c> of the value's own type — a number's, a slider's, a date's, a
/// time's, a calendar's; the server refuses a value written outside them, read by these keys.
/// </summary>
public interface IBoundedInputComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for the least value the input takes.
    /// </summary>
    static UIProperty MinProperty { get; } = new("Min");

    /// <summary>
    /// Gets the registered property key for the greatest value the input takes.
    /// </summary>
    static UIProperty MaxProperty { get; } = new("Max");
}
