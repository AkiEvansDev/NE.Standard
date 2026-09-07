using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Styling;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Coerces a value into a target property's actual CLR type, when the two don't already match: a client-dispatched
/// value (a boxed <see cref="string"/>, <see cref="long"/>, <see cref="double"/> or <see cref="bool"/>, or an array of them) on the way
/// in, and a controller's plain value against a <see cref="UIResponsive{T}"/> property on the way out. A JSON object or array the
/// client sent against a model type is rebuilt through the serializer, so a component's value may be a document of its own.
/// </summary>
/// <remarks>
/// One rule for every path — a client change, a server update, a page render — or a value that fits on one of them
/// silently does nothing on another.
/// </remarks>
public static class RecursiveValueCoercion
{
    private static readonly ConcurrentDictionary<Type, Func<object, object>?> ResponsiveWrappers = new();

    // The wire's own conventions read back: a property camel-cased either way, an enum by its name, an `object` as the value it holds.
    private static readonly JsonSerializerOptions ModelOptions = new(JsonSerializerDefaults.Web) { Converters = { new JsonStringEnumConverter(), new ObjectToInferredTypesConverter() } };

    /// <summary>
    /// Attempts to coerce a boxed value into the target type <typeparamref name="T"/>.
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

        if (TryCoerce(value, typeof(T), out var coerced) && coerced is T typedResult)
        {
            result = typedResult;
            return true;
        }

        return false;
    }

    /// <summary>
    /// Attempts to coerce a boxed value into <paramref name="targetType"/>; a <see cref="UIResponsive{T}"/> target
    /// takes a plain element value and wraps it.
    /// </summary>
    public static bool TryCoerce(object? value, Type targetType, out object? result)
    {
        ArgumentNullException.ThrowIfNull(targetType);

        result = null;

        if (value is null)
            return false;

        Type underlyingType = Nullable.GetUnderlyingType(targetType) ?? targetType;

        if (underlyingType.IsInstanceOfType(value))
        {
            result = value;
            return true;
        }

        Func<object, object>? wrapper = ResponsiveWrappers.GetOrAdd(underlyingType, CreateResponsiveWrapper);

        if (wrapper is not null)
        {
            Type elementType = underlyingType.GetGenericArguments()[0];

            if (TryCoerce(value, elementType, out var element) && element is not null)
            {
                result = wrapper(element);
                return true;
            }

            return false;
        }

        try
        {
            var converted = underlyingType switch
            {
                _ when underlyingType == typeof(DateOnly) && value is string dateText => DateOnly.Parse(dateText, CultureInfo.InvariantCulture),
                _ when underlyingType == typeof(TimeOnly) && value is string timeText => TimeOnly.Parse(timeText, CultureInfo.InvariantCulture),
                _ when underlyingType == typeof(DateTime) && value is string dateTimeText => DateTime.Parse(dateTimeText, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind),
                // AssumeLocal, not RoundtripKind (.NET rejects combining them): an offset-less string becomes the server's local time.
                _ when underlyingType == typeof(DateTimeOffset) && value is string dateTimeOffsetText => DateTimeOffset.Parse(dateTimeOffsetText, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal),
                _ when underlyingType == typeof(Guid) && value is string guidText => Guid.Parse(guidText),
                // A colour travels back as the canonical text UIThemeColor.TryParse reads.
                _ when underlyingType == typeof(UIThemeColor) && value is string colorText => UIThemeColor.TryParse(colorText, out UIThemeColor color) ? color : null,
                // A list of keys arrives as the client's own array, one text per element.
                _ when IsStringList(underlyingType) && value is IEnumerable<object?> listItems => ToStringArray(listItems),
                _ when underlyingType.IsEnum && value is string enumText => Enum.Parse(underlyingType, enumText, ignoreCase: false),
                _ when underlyingType.IsEnum => Enum.ToObject(underlyingType, value),
                // A document the client sent, as the inferred dictionary or array it arrives as, against the model that declares its
                // shape — a graph's nodes, a grid's sort terms.
                _ when value is IDictionary<string, object?> or object?[] && IsModelType(underlyingType) => JsonSerializer.Deserialize(JsonSerializer.SerializeToUtf8Bytes(value, ModelOptions), underlyingType, ModelOptions),

                _ when underlyingType != typeof(string) && value is IConvertible => Convert.ChangeType(value, underlyingType, CultureInfo.InvariantCulture),
                _ => null
            };

            if (converted is not null && underlyingType.IsInstanceOfType(converted))
            {
                result = converted;
                return true;
            }
        }
        catch (Exception exception) when (exception is FormatException or InvalidCastException or OverflowException or ArgumentException or JsonException or NotSupportedException)
        {
            return false;
        }

        return false;
    }

    /// <summary>
    /// Compiles a <c>UIResponsive&lt;T&gt;.FromValue</c> call for one element type, or <see langword="null"/> when
    /// the target is not a responsive type at all.
    /// </summary>
    private static Func<object, object>? CreateResponsiveWrapper(Type targetType)
    {
        if (!targetType.IsGenericType || targetType.GetGenericTypeDefinition() != typeof(UIResponsive<>))
            return null;

        Type elementType = targetType.GetGenericArguments()[0];
        MethodInfo fromValue = targetType.GetMethod(nameof(UIResponsive<>.FromValue), BindingFlags.Public | BindingFlags.Static)!;

        ParameterExpression parameter = Expression.Parameter(typeof(object), "value");

        UnaryExpression body = Expression.Convert(
            Expression.Call(fromValue, Expression.Convert(parameter, elementType)),
            typeof(object)
        );

        return Expression.Lambda<Func<object, object>>(body, parameter).Compile();
    }

    private static bool IsStringList(Type type)
        => type == typeof(string[]) || type == typeof(IReadOnlyList<string>) || type == typeof(IEnumerable<string>) || type == typeof(IReadOnlyCollection<string>);

    private static string[] ToStringArray(IEnumerable<object?> items)
    {
        List<string> result = [];

        foreach (var item in items)
        {
            if (item is not null)
                result.Add(item as string ?? Convert.ToString(item, CultureInfo.InvariantCulture) ?? string.Empty);
        }

        return [.. result];
    }

    /// <summary>A type the serializer builds rather than a value it parses: not a primitive, a text or a name.</summary>
    private static bool IsModelType(Type type)
        => type != typeof(object) && type != typeof(string) && !type.IsPrimitive && !type.IsEnum && !typeof(IConvertible).IsAssignableFrom(type);
}
