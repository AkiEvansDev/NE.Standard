using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using NE.Standard.UI.Abstractions.Navigation;

namespace NE.Standard.UI.Navigation;

/// <summary>
/// Writes a navigation request as the address a browser names it by, the way the client's <c>buildNavigationUrl</c> does.
/// </summary>
internal static class UINavigationAddress
{
    /// <summary>
    /// The route with its parameters as a query — what a return address must carry: a deep link's <c>?id=42</c> is what the
    /// reader signed in to reach.
    /// </summary>
    public static string Format(UINavigationRequest navigation)
    {
        ArgumentNullException.ThrowIfNull(navigation);

        if (navigation.Parameters is not { Count: > 0 } parameters)
            return navigation.Route;

        StringBuilder address = new(navigation.Route);
        var separator = '?';

        foreach (KeyValuePair<string, object?> parameter in parameters)
        {
            if (parameter.Value is IEnumerable values and not string)
            {
                foreach (var value in values)
                    AppendParameter(address, ref separator, parameter.Key, value);
            }
            else
            {
                AppendParameter(address, ref separator, parameter.Key, parameter.Value);
            }
        }

        return address.ToString();
    }

    private static void AppendParameter(StringBuilder address, ref char separator, string key, object? value)
    {
        if (value is null)
            return;

        var text = value as string ?? Convert.ToString(value, CultureInfo.InvariantCulture) ?? string.Empty;

        _ = address.Append(separator).Append(Uri.EscapeDataString(key)).Append('=').Append(Uri.EscapeDataString(text));
        separator = '&';
    }
}
