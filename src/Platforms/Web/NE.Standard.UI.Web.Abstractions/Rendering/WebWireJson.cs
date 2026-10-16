using System;
using System.Globalization;
using System.Numerics;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// The JSON conventions shared by everything this platform sends its client — live hub payloads and render metadata alike.
/// </summary>
public static class WebWireJson
{
    // JSON's own digits: no white space round them, no group separator.
    private const NumberStyles QuotedNumber = NumberStyles.AllowLeadingSign | NumberStyles.AllowDecimalPoint | NumberStyles.AllowExponent;

    /// <summary>
    /// Applies the conventions to <paramref name="options"/>: a property travels camel-cased, an enum as its name and never its ordinal,
    /// and a number JSON has no literal for (NaN, an infinity) as null; a number is read as the built-in converter reads it, under a
    /// member's own <see cref="JsonNumberHandlingAttribute"/> too.
    /// </summary>
    public static void Apply(JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);
        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.Converters.Add(new JsonStringEnumConverter());
        options.Converters.Add(new FiniteDoubleConverter(handling: null));
        options.Converters.Add(new FiniteSingleConverter(handling: null));
        options.TypeInfoResolver = (options.TypeInfoResolver ?? new DefaultJsonTypeInfoResolver()).WithAddedModifier(HoldMemberNumberHandling);
    }

    /// <summary>
    /// Gives a double or a float member — a nullable one too — whose own <see cref="JsonNumberHandlingAttribute"/>, or its type's, says
    /// how it reads a converter holding that handling: a converter of the options never sees it, where the built-in one honours it.
    /// </summary>
    private static void HoldMemberNumberHandling(JsonTypeInfo type)
    {
        if (type.Kind != JsonTypeInfoKind.Object)
            return;

        foreach (JsonPropertyInfo property in type.Properties)
        {
            if (property.CustomConverter is null && (property.NumberHandling ?? type.NumberHandling) is { } handling)
                property.CustomConverter = NumberConverter(property.PropertyType, handling);
        }
    }

    /// <summary>The converter of a number type under a member's own handling; null for a type that is no double or float.</summary>
    private static JsonConverter? NumberConverter(Type type, JsonNumberHandling handling)
    {
        if (type == typeof(double))
            return new FiniteDoubleConverter(handling);

        if (type == typeof(double?))
            return new NullableNumberConverter<double>(new FiniteDoubleConverter(handling));

        if (type == typeof(float))
            return new FiniteSingleConverter(handling);

        return type == typeof(float?) ? new NullableNumberConverter<float>(new FiniteSingleConverter(handling)) : null;
    }

    /// <summary>
    /// A fresh web-flavoured options instance carrying the conventions.
    /// </summary>
    public static JsonSerializerOptions CreateOptions()
    {
        JsonSerializerOptions options = new(JsonSerializerDefaults.Web);
        Apply(options);

        return options;
    }

    /// <summary>
    /// A number written as text, read as the built-in converter reads one under <paramref name="handling"/>: JSON's digits, or NaN and
    /// the infinities by name, where reading from text is allowed; the names alone where only named literals are.
    /// </summary>
    private static T ReadQuoted<T>(ref Utf8JsonReader reader, JsonNumberHandling handling)
        where T : IBinaryFloatingPointIeee754<T>
    {
        var text = reader.GetString();

        if ((handling & JsonNumberHandling.AllowReadingFromString) != 0 && T.TryParse(text, QuotedNumber, CultureInfo.InvariantCulture, out T? number) && T.IsFinite(number))
            return number;

        if ((handling & (JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.AllowNamedFloatingPointLiterals)) != 0)
        {
            // In their exact case: .NET's own parse takes "nan" or "INFINITY" too, and the built-in converter refuses them.
            switch (text)
            {
                case "NaN":
                    return T.NaN;
                case "Infinity":
                    return T.PositiveInfinity;
                case "-Infinity":
                    return T.NegativeInfinity;
                default:
                    break;
            }
        }

        throw new JsonException($"'{text}' is no number the options read from text.");
    }

    /// <summary>
    /// Writes a NaN or an infinity as null, which the page reads as no value: written as a number it throws, and a hub write that
    /// throws drops the connection, whose reattach replays the same value. Reads as the built-in converter does, under a member's own
    /// handling where it holds one, else the options'.
    /// </summary>
    private sealed class FiniteDoubleConverter(JsonNumberHandling? handling) : JsonConverter<double>
    {
        public override double Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            => reader.TokenType == JsonTokenType.String ? ReadQuoted<double>(ref reader, handling ?? options.NumberHandling) : reader.GetDouble();

        public override void Write(Utf8JsonWriter writer, double value, JsonSerializerOptions options)
        {
            ArgumentNullException.ThrowIfNull(writer);

            if (double.IsFinite(value))
                writer.WriteNumberValue(value);
            else
                writer.WriteNullValue();
        }
    }

    /// <inheritdoc cref="FiniteDoubleConverter"/>
    private sealed class FiniteSingleConverter(JsonNumberHandling? handling) : JsonConverter<float>
    {
        public override float Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            => reader.TokenType == JsonTokenType.String ? ReadQuoted<float>(ref reader, handling ?? options.NumberHandling) : reader.GetSingle();

        public override void Write(Utf8JsonWriter writer, float value, JsonSerializerOptions options)
        {
            ArgumentNullException.ThrowIfNull(writer);

            if (float.IsFinite(value))
                writer.WriteNumberValue(value);
            else
                writer.WriteNullValue();
        }
    }

    /// <summary>A nullable member's number over its own converter: null is none, anything else the number's.</summary>
    private sealed class NullableNumberConverter<T>(JsonConverter<T> number) : JsonConverter<T?>
        where T : struct
    {
        public override T? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            => reader.TokenType == JsonTokenType.Null ? null : number.Read(ref reader, typeof(T), options);

        public override void Write(Utf8JsonWriter writer, T? value, JsonSerializerOptions options)
        {
            ArgumentNullException.ThrowIfNull(writer);

            if (value is { } present)
                number.Write(writer, present, options);
            else
                writer.WriteNullValue();
        }
    }
}
