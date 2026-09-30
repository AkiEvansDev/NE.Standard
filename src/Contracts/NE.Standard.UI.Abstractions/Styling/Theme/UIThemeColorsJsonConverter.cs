using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Colors;

namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Writes <see cref="UIThemeColors"/> as an object of the colours that are set, each in the text <see cref="UIThemeColor.TryParse"/>
/// reads, and reads it back — the page hands the colours back as it was sent them, and a store keeps them as one text.
/// </summary>
public sealed class UIThemeColorsJsonConverter : JsonConverter<UIThemeColors>
{
    private const string LightPrimary = "lightPrimary";
    private const string LightAccent = "lightAccent";
    private const string DarkPrimary = "darkPrimary";
    private const string DarkAccent = "darkAccent";

    /// <inheritdoc />
    public override UIThemeColors? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
            return null;

        if (reader.TokenType != JsonTokenType.StartObject)
            throw new JsonException("Theme colours are an object.");

        UIThemeColors colors = new();

        while (reader.Read() && reader.TokenType != JsonTokenType.EndObject)
        {
            var name = reader.GetString();

            _ = reader.Read();

            ColorVariant? color = ReadColor(ref reader);

            if (string.Equals(name, LightPrimary, StringComparison.OrdinalIgnoreCase))
                colors = colors with { LightPrimary = color };
            else if (string.Equals(name, LightAccent, StringComparison.OrdinalIgnoreCase))
                colors = colors with { LightAccent = color };
            else if (string.Equals(name, DarkPrimary, StringComparison.OrdinalIgnoreCase))
                colors = colors with { DarkPrimary = color };
            else if (string.Equals(name, DarkAccent, StringComparison.OrdinalIgnoreCase))
                colors = colors with { DarkAccent = color };
        }

        return colors;
    }

    private static ColorVariant? ReadColor(ref Utf8JsonReader reader)
    {
        if (reader.TokenType == JsonTokenType.Null)
            return null;

        if (reader.TokenType != JsonTokenType.String)
        {
            reader.Skip();
            throw new JsonException("A theme colour is a colour's text.");
        }

        // A colour only: a role (`@Primary`) names no colour of its own.
        return UIThemeColor.TryParse(reader.GetString(), out UIThemeColor parsed) && parsed.Light is ColorVariant color
            ? color
            : throw new JsonException($"'{reader.GetString()}' is not a colour.");
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, UIThemeColors value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);

        if (value is null)
        {
            writer.WriteNullValue();
            return;
        }

        writer.WriteStartObject();

        WriteColor(writer, LightPrimary, value.LightPrimary);
        WriteColor(writer, LightAccent, value.LightAccent);
        WriteColor(writer, DarkPrimary, value.DarkPrimary);
        WriteColor(writer, DarkAccent, value.DarkAccent);

        writer.WriteEndObject();
    }

    private static void WriteColor(Utf8JsonWriter writer, string name, ColorVariant? color)
    {
        if (color is ColorVariant value)
            writer.WriteString(name, UIThemeColor.FromColorVariant(value).ToCanonical());
    }
}
