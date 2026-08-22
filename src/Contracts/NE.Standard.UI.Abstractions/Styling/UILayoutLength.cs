using System;
using System.Diagnostics;
using System.Globalization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a layout length value.
/// </summary>
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
            default:
                throw new UnreachableException();
        }
    }

    public override string ToString()
        => Kind switch
        {
            UILayoutLengthKind.Auto => nameof(UILayoutLengthKind.Auto),
            UILayoutLengthKind.Absolute => Value.ToString(CultureInfo.InvariantCulture),
            _ => throw new UnreachableException()
        };
}
