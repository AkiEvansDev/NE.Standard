using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// An input that can choose a period — a temporal input, a calendar or a slider under <c>IsRange</c> — with <c>Value</c> as its start
/// and <c>EndValue</c> as its end, the end held to the bounds the start is.
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

    /// <summary>
    /// Gets the registered property key for the least distance between the period's two ends — a number for a slider, a span of time
    /// for a temporal input or a calendar; the server holds the ends in order, that far apart, on every write (a temporal period's only
    /// where a distance is set).
    /// </summary>
    static UIProperty MinDistanceProperty { get; } = new("MinDistance");
}
