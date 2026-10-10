using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Text.Json;
using NE.Standard.UI.Abstractions.Navigation;

namespace NE.Standard.UI.Navigation;

/// <summary>
/// Writes a navigation request as the address a browser names it by, the way the client's <c>buildNavigationUrl</c> does, and reads
/// one back as the host and the page read a query.
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
            // A list goes one pair per value, as the page writes an array; a document is one value, its JSON.
            if (parameter.Value is IEnumerable values and not string and not IDictionary)
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

        var text = value switch
        {
            string written => written,
            bool flag => flag ? "true" : "false",
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture),
            // An object goes as its JSON, as the page writes one: its ToString names its type, which no route reads back.
            _ => JsonSerializer.Serialize(value)
        };

        _ = address.Append(separator).Append(Uri.EscapeDataString(key)).Append('=').Append(Uri.EscapeDataString(text));
        separator = '&';
    }

    /// <summary>
    /// The route and its query's parameters, read as the host reads a request's query and the page its address (<c>readQueryParameters</c>):
    /// <c>+</c> a space, a key given more than once an array of its values in order, a key with no <c>=</c> an empty value; no query, none.
    /// </summary>
    public static UINavigationRequest Parse(string address)
    {
        ArgumentNullException.ThrowIfNull(address);

        // A fragment never reaches the host.
        var end = address.IndexOf('#', StringComparison.Ordinal);
        var path = end < 0 ? address : address[..end];
        var query = path.IndexOf('?', StringComparison.Ordinal);

        if (query < 0)
            return new UINavigationRequest { Route = path };

        Dictionary<string, object?> parameters = new(StringComparer.Ordinal);

        foreach (var pair in path[(query + 1)..].Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var equals = pair.IndexOf('=', StringComparison.Ordinal);
            var key = Unescape(equals < 0 ? pair : pair[..equals]);
            var value = equals < 0 ? string.Empty : Unescape(pair[(equals + 1)..]);

            if (!parameters.TryGetValue(key, out var given))
            {
                parameters[key] = value;
                continue;
            }

            string[] values = given is string[] earlier ? [.. earlier, value] : [(string)given!, value];

            parameters[key] = values;
        }

        return new UINavigationRequest { Route = path[..query], Parameters = parameters.Count == 0 ? null : parameters };
    }

    private static string Unescape(string text)
        => Uri.UnescapeDataString(text.Replace('+', ' '));
}
