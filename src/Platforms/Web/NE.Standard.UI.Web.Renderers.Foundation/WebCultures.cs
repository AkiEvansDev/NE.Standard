using System.Globalization;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Resolves an authored culture name the way <c>UIFormattedValueNormalizer</c> does: an unknown or empty one is invariant.</summary>
public static class WebCultures
{
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
