using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Primitives.Localization;

/// <summary>
/// Writes a <see cref="UIMoment"/> as <c>{"moment":"2026-09-30T14:05:00.000Z","format":"relative"}</c> — the instant in UTC to the
/// millisecond, <c>format</c> only when it is not the day and the time — and reads that shape back, nothing else.
/// </summary>
/// <remarks>The format's names are a timestamp's (<see cref="FormatName"/>), which the page reads both by.</remarks>
public sealed class UIMomentJsonConverter : JsonConverter<UIMoment>
{
    private const string MomentName = "moment";
    private const string FormatPropertyName = "format";
    private const string InstantFormat = "yyyy-MM-dd'T'HH:mm:ss.fff'Z'";

    // Read to the tick, so a moment another writer sent finer than the millisecond is still the instant it named.
    private const string InstantReadFormat = "yyyy-MM-dd'T'HH:mm:ss.FFFFFFF'Z'";

    /// <summary>The name the page reads a format by.</summary>
    public static string FormatName(UITimestampFormat format)
        => format switch
        {
            UITimestampFormat.Date => "date",
            UITimestampFormat.Time => "time",
            UITimestampFormat.Relative => "relative",
            UITimestampFormat.RelativeDate => "relative-date",
            _ => "date-time"
        };

    /// <summary>The instant as the wire names it: UTC to the millisecond, <c>Z</c> after it.</summary>
    public static string InstantText(DateTimeOffset instant)
        => instant.UtcDateTime.ToString(InstantFormat, CultureInfo.InvariantCulture);

    /// <inheritdoc />
    public override UIMoment Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument document = JsonDocument.ParseValue(ref reader);

        return ReadMoment(document.RootElement);
    }

    /// <summary>Whether an object on the wire is a moment rather than a phrase: it names one.</summary>
    internal static bool IsMoment(JsonElement element)
    {
        foreach (JsonProperty property in element.EnumerateObject())
        {
            if (string.Equals(property.Name, MomentName, StringComparison.OrdinalIgnoreCase))
                return true;
        }

        return false;
    }

    /// <summary>Reads <c>{"moment":…,"format"?:…}</c>, refusing any other member, an instant in another shape and a format no timestamp has.</summary>
    internal static UIMoment ReadMoment(JsonElement element)
    {
        if (element.ValueKind != JsonValueKind.Object)
            throw new JsonException("A moment is an object naming its instant.");

        DateTimeOffset? instant = null;
        UITimestampFormat format = UITimestampFormat.DateTime;

        foreach (JsonProperty property in element.EnumerateObject())
        {
            if (string.Equals(property.Name, MomentName, StringComparison.OrdinalIgnoreCase))
                instant = ReadInstant(property.Value);
            else if (string.Equals(property.Name, FormatPropertyName, StringComparison.OrdinalIgnoreCase))
                format = ReadFormat(property.Value);
            else
                throw new JsonException($"A moment has no member '{property.Name}'.");
        }

        return instant is { } named
            ? new UIMoment(named, format)
            : throw new JsonException("A moment needs its instant.");
    }

    private static DateTimeOffset ReadInstant(JsonElement value)
    {
        if (value.ValueKind == JsonValueKind.String && DateTimeOffset.TryParseExact(value.GetString(), InstantReadFormat, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out DateTimeOffset instant))
            return instant;

        throw new JsonException("A moment's instant is UTC in the wire's shape: yyyy-MM-ddTHH:mm:ss.fffZ.");
    }

    private static UITimestampFormat ReadFormat(JsonElement value)
    {
        if (value.ValueKind != JsonValueKind.String)
            throw new JsonException("A moment's format is a timestamp's name for it.");

        return value.GetString() switch
        {
            "date-time" => UITimestampFormat.DateTime,
            "date" => UITimestampFormat.Date,
            "time" => UITimestampFormat.Time,
            "relative" => UITimestampFormat.Relative,
            "relative-date" => UITimestampFormat.RelativeDate,
            var name => throw new JsonException($"A moment has no format '{name}'.")
        };
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, UIMoment value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);

        writer.WriteStartObject();
        writer.WriteString(MomentName, InstantText(value.Instant));

        if (value.Format != UITimestampFormat.DateTime)
            writer.WriteString(FormatPropertyName, FormatName(value.Format));

        writer.WriteEndObject();
    }
}
