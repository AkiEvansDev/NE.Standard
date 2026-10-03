using System;
using Microsoft.Extensions.Hosting;
using NE.Standard.UI.Application;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The name of the cookie that carries the session's secret, resolved once for the application.
/// </summary>
internal sealed class WebSessionCookie
{
    public const string DefaultName = "ne.ui.session";

    public WebSessionCookie(UIApplication application, IHostEnvironment? environment = null)
    {
        ArgumentNullException.ThrowIfNull(application);

        Name = application.Sessions.ClientKey ?? NameFor(environment?.ApplicationName);
    }

    /// <summary>The cookie's name: the configured client key, or the default followed by the application's name.</summary>
    public string Name { get; }

    /// <summary>The default name followed by the application's name as a cookie token — lowercase, anything else a dash.</summary>
    public static string NameFor(string? applicationName)
    {
        if (string.IsNullOrWhiteSpace(applicationName))
            return DefaultName;

        var token = new char[applicationName.Length];

        for (var i = 0; i < token.Length; i++)
        {
            var c = char.ToLowerInvariant(applicationName[i]);

            token[i] = c is (>= 'a' and <= 'z') or (>= '0' and <= '9') or '.' or '_' or '-' ? c : '-';
        }

        return $"{DefaultName}.{new string(token)}";
    }
}
