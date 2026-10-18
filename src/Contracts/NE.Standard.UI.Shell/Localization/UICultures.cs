using System.Globalization;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>Resolves an authored culture name, the one rule the server's value parsing and a platform's formatting share.</summary>
public static class UICultures
{
    /// <summary>The culture of that name; an unknown or empty one is the invariant culture rather than a failure.</summary>
    public static CultureInfo Resolve(string? culture)
    {
        if (string.IsNullOrWhiteSpace(culture))
            return CultureInfo.InvariantCulture;

        try
        {
            return CultureInfo.GetCultureInfo(culture);
        }
        catch (CultureNotFoundException)
        {
            return CultureInfo.InvariantCulture;
        }
    }
}
