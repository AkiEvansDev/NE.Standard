using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Primitives.Json;

/// <summary>
/// A converter for a polymorphic wire type: it writes a value by its runtime type and leaves reading the right derived type back to
/// the converter.
/// </summary>
public abstract class UIRuntimeTypeJsonConverter<T> : JsonConverter<T>
    where T : class
{
    /// <inheritdoc />
    /// <remarks>
    /// By the runtime type because System.Text.Json would otherwise serialize by the declared element type, losing every derived member.
    /// </remarks>
    public sealed override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);

        if (value is null)
        {
            writer.WriteNullValue();
            return;
        }

        JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }
}
