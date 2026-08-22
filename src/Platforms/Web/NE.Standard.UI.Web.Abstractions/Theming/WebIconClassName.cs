using System;
using System.Text;

namespace NE.Standard.UI.Web.Abstractions.Theming;

public static class WebIconClassName
{
    public static string FromIconName(string icon)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        StringBuilder builder = new("ui-icon-glyph--");

        for (var i = 0; i < icon.Length; i++)
        {
            var c = icon[i];

            if (char.IsAsciiLetterOrDigit(c))
            {
                _ = builder.Append(char.ToLowerInvariant(c));
                continue;
            }

            if (c is '-' or '_' or '.' or ' ')
            {
                AppendDash(builder);
                continue;
            }
        }

        if (builder.Length == "ui-icon-glyph--".Length)
            throw new ArgumentException("Icon name does not contain any valid characters.", nameof(icon));

        return builder.ToString();
    }

    private static void AppendDash(StringBuilder builder)
    {
        if (builder[^1] != '-')
            _ = builder.Append('-');
    }
}
