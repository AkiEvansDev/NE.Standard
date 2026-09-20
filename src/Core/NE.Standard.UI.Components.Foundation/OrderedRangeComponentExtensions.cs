using NE.Standard.UI.Components.Foundation.Inputs;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// A component holding a value between a minimum and a maximum, the three kept in order.
/// </summary>
public interface IOrderedRangeComponent
{
    /// <summary>
    /// Gets or sets the minimum of the range.
    /// </summary>
    decimal? Min { get; set; }

    /// <summary>
    /// Gets or sets the maximum of the range.
    /// </summary>
    decimal? Max { get; set; }

    /// <summary>
    /// Gets the current value, checked against the range.
    /// </summary>
    decimal? Value { get; }
}

/// <summary>
/// The validation ceremony <see cref="IOrderedRangeComponent"/> components share; each names its own noun for the message.
/// </summary>
public static class OrderedRangeComponentExtensions
{
    /// <summary>
    /// Sets the minimum of the range, validated against the maximum and the current value.
    /// </summary>
    public static T SetOrderedMin<T>(this T component, decimal min, string valueNoun) where T : IOrderedRangeComponent
    {
        OrderedRange.Validate(min, component.Max, component.Value, valueNoun);
        component.Min = min;
        return component;
    }

    /// <summary>
    /// Sets the maximum of the range, validated against the minimum and the current value.
    /// </summary>
    public static T SetOrderedMax<T>(this T component, decimal max, string valueNoun) where T : IOrderedRangeComponent
    {
        OrderedRange.Validate(component.Min, max, component.Value, valueNoun);
        component.Max = max;
        return component;
    }

    /// <summary>
    /// Sets the minimum and maximum of the range, validated against the current value.
    /// </summary>
    public static T SetOrderedRange<T>(this T component, decimal min, decimal max, string valueNoun) where T : IOrderedRangeComponent
    {
        OrderedRange.Validate(min, max, component.Value, valueNoun);
        component.Min = min;
        component.Max = max;
        return component;
    }
}
