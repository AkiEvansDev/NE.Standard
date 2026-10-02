using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// An input that can choose a period — a temporal input or a calendar under <c>IsRange</c> — with <c>Value</c> as its start and
/// <c>EndValue</c> as its end, the end held to the bounds the start is.
/// </summary>
public interface IPeriodInputComponent : IBoundedInputComponent
{
    /// <summary>
    /// Gets the registered property key for whether the input chooses a period.
    /// </summary>
    static UIProperty IsRangeProperty { get; } = new("IsRange");

    /// <summary>
    /// Gets the registered property key for the period's end.
    /// </summary>
    static UIProperty EndValueProperty { get; } = new("EndValue");
}
