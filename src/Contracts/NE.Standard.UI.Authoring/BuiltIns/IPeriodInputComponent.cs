using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.BuiltIns;

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
    /// Gets the registered property key for the least distance between the period's two ends, where the input offers one (a range
    /// slider); the server holds such an input's ends in order, that far apart, on every write.
    /// </summary>
    static UIProperty MinDistanceProperty { get; } = new("MinDistance");
}
