using System;
using System.Text;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// How a property name becomes part of an attribute name, matching the client's <c>toKebabCase</c> in <c>dom-attributes.ts</c>.
/// </summary>
public static class WebNaming
{
    /// <summary>
    /// Converts <c>IsURLValid</c>-style names to kebab-case (<c>is-url-valid</c>), matching the client's algorithm exactly.
    /// </summary>
    public static string ToKebabCase(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        StringBuilder result = new(value.Length + 8);

        for (var i = 0; i < value.Length; i++)
        {
            var character = value[i];

            if (character == '_')
            {
                _ = result.Append('-');
                continue;
            }

            if (char.IsUpper(character) && i > 0 && StartsWord(value, i))
                _ = result.Append('-');

            _ = result.Append(char.ToLowerInvariant(character));
        }

        return result.ToString();
    }

    private static bool StartsWord(string value, int index)
    {
        var previous = value[index - 1];

        if (char.IsLower(previous) || char.IsDigit(previous))
            return true;

        return char.IsUpper(previous) && index + 1 < value.Length && char.IsLower(value[index + 1]);
    }
}
