using System;
using System.Text.Json;

namespace NE.Standard.UI.Primitives.Json;

/// <summary>
/// Reads a JSON object's member by its name ignoring case, as the framework's converters read the wire.
/// </summary>
public static class UIJsonElementExtensions
{
    /// <summary>
    /// Finds the object's first member named <paramref name="name"/>, ignoring case; false where it has none.
    /// </summary>
    public static bool TryGetPropertyIgnoreCase(this JsonElement element, string name, out JsonElement value)
    {
        ArgumentNullException.ThrowIfNull(name);

        foreach (JsonProperty property in element.EnumerateObject())
        {
            if (string.Equals(property.Name, name, StringComparison.OrdinalIgnoreCase))
            {
                value = property.Value;
                return true;
            }
        }

        value = default;
        return false;
    }
}
