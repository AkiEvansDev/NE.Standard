using System;
using System.Globalization;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Coerces a client-dispatched value (boxed as <see cref="string"/>, <see cref="long"/>,
/// <see cref="double"/>, or <see cref="bool"/> — see <c>ObjectToInferredTypesConverter</c>, the only
/// shapes a two-way value-change payload ever arrives as) into a target property's actual CLR type, when
/// the two don't already match. Called from the source-generated <c>TrySetValueCore</c> (see
/// <c>RecursiveMemberGenerator</c>) as a fallback after its own direct <c>is</c> pattern match fails —
/// every bound property whose CLR type isn't already <see cref="string"/>/<see cref="bool"/> (numeric
/// types, <see cref="DateOnly"/>/<see cref="TimeOnly"/>/<see cref="DateTimeOffset"/>/<see cref="Guid"/>/
/// enums) needs this to round-trip a client edit back into the property at all.
/// </summary>
public static class RecursiveValueCoercion
{
    /// <summary>
    /// Attempts to coerce a client-dispatched boxed value into the target type <typeparamref name="T"/>.
    /// </summary>
    public static bool TryCoerce<T>(object? value, out T result)
    {
        result = default!;

        if (value is null)
            return false;

        if (value is T typed)
        {
            result = typed;
            return true;
        }

        Type targetType = typeof(T);
        Type underlyingType = Nullable.GetUnderlyingType(targetType) ?? targetType;

        try
        {
            var converted = underlyingType switch
            {
                _ when underlyingType == typeof(DateOnly) && value is string dateText => DateOnly.Parse(dateText, CultureInfo.InvariantCulture),
                _ when underlyingType == typeof(TimeOnly) && value is string timeText => TimeOnly.Parse(timeText, CultureInfo.InvariantCulture),
                _ when underlyingType == typeof(DateTime) && value is string dateTimeText => DateTime.Parse(dateTimeText, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind),
                // AssumeLocal (not RoundtripKind, which .NET rejects combined with it) so an offset-less
                // string — what a native `<input type="datetime-local">` produces, see
                // DateTimeInputComponentRenderer — is interpreted as the server's local time rather than UTC.
                // So the offset is the server's, not the user's; a client in another zone loses that difference.
                _ when underlyingType == typeof(DateTimeOffset) && value is string dateTimeOffsetText => DateTimeOffset.Parse(dateTimeOffsetText, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal),
                _ when underlyingType == typeof(Guid) && value is string guidText => Guid.Parse(guidText),
                _ when underlyingType.IsEnum && value is string enumText => Enum.Parse(underlyingType, enumText, ignoreCase: false),
                _ when underlyingType.IsEnum => Enum.ToObject(underlyingType, value),

                _ when underlyingType != typeof(string) && value is IConvertible => Convert.ChangeType(value, underlyingType, CultureInfo.InvariantCulture),
                _ => null
            };

            if (converted is T convertedResult)
            {
                result = convertedResult;
                return true;
            }
        }
        catch (Exception exception) when (exception is FormatException or InvalidCastException or OverflowException or ArgumentException)
        {
            return false;
        }

        return false;
    }
}
