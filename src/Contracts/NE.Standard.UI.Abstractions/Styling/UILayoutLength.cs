using System;
using System.Diagnostics;
using System.Globalization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a layout length value.
/// </summary>
/// <param name="Kind">Whether the length is absolute, a share of the free space, or the content's own.</param>
/// <param name="Value">The length in the kind's own terms; ignored by the kinds that carry none.</param>
public readonly record struct UILayoutLength(UILayoutLengthKind Kind, double Value)
{
    /// <summary>
    /// Creates a layout length that sizes automatically to its content.
    /// </summary>
    public static UILayoutLength Auto()
        => new(UILayoutLengthKind.Auto, -1);

    /// <summary>
    /// Creates a layout length with a fixed absolute value.
    /// </summary>
    public static UILayoutLength Absolute(double value)
        => new(UILayoutLengthKind.Absolute, value);

    /// <summary>
    /// The whole of what the parent gives.
    /// </summary>
    public static UILayoutLength Fill()
        => new(UILayoutLengthKind.Fill, -1);

    /// <summary>
    /// Validates the layout length value for its kind.
    /// </summary>
    public void Validate()
    {
        switch (Kind)
        {
            case UILayoutLengthKind.Auto:
                ArgumentOutOfRangeException.ThrowIfNotEqual(Value, -1);
                break;
            case UILayoutLengthKind.Absolute:
                ArgumentOutOfRangeException.ThrowIfNegative(Value);
                break;
            case UILayoutLengthKind.Fill:
                ArgumentOutOfRangeException.ThrowIfNotEqual(Value, -1);
                break;
            default:
                throw new UnreachableException();
        }
    }

    public override string ToString()
        => Kind switch
        {
            UILayoutLengthKind.Auto => nameof(UILayoutLengthKind.Auto),
            UILayoutLengthKind.Absolute => Value.ToString(CultureInfo.InvariantCulture),
            UILayoutLengthKind.Fill => nameof(UILayoutLengthKind.Fill),
            _ => throw new UnreachableException()
        };
}
