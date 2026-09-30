using NE.Standard.UI.Components.Foundation.Inputs;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// A component holding a value between a minimum and a maximum, the three kept in order; an unset bound is the one the page draws,
/// <see cref="DefaultMin"/> or <see cref="DefaultMax"/>, for the value, and holds no other bound in check.
/// </summary>
public interface IOrderedRangeComponent
{
    /// <summary>
    /// The minimum an unset <see cref="Min"/> stands for.
    /// </summary>
    const decimal DefaultMin = 0;

    /// <summary>
    /// The maximum an unset <see cref="Max"/> stands for.
    /// </summary>
    const decimal DefaultMax = 100;

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
        ValidateOrderedRange(min, component.Max, component.Value, valueNoun);
        component.Min = min;
        return component;
    }

    /// <summary>
    /// Sets the maximum of the range, validated against the minimum and the current value.
    /// </summary>
    public static T SetOrderedMax<T>(this T component, decimal max, string valueNoun) where T : IOrderedRangeComponent
    {
        ValidateOrderedRange(component.Min, max, component.Value, valueNoun);
        component.Max = max;
        return component;
    }

    /// <summary>
    /// Sets the minimum and maximum of the range, validated against the current value.
    /// </summary>
    public static T SetOrderedRange<T>(this T component, decimal min, decimal max, string valueNoun) where T : IOrderedRangeComponent
    {
        ValidateOrderedRange(min, max, component.Value, valueNoun);
        component.Min = min;
        component.Max = max;
        return component;
    }

    /// <summary>
    /// Checks the bounds against each other only when both are set, and the value against each bound or, unset, the one the page
    /// draws.
    /// </summary>
    public static void ValidateOrderedRange(decimal? min, decimal? max, decimal? value, string valueNoun)
    {
        OrderedRange.Validate(min, max, null, valueNoun);
        OrderedRange.Validate(min ?? IOrderedRangeComponent.DefaultMin, null, value, valueNoun);
        OrderedRange.Validate(null, max ?? IOrderedRangeComponent.DefaultMax, value, valueNoun);
    }
}
