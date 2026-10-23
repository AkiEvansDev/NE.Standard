using System;
using System.Text;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Renders a layout value drawn by a class — an orientation, a size, a list's layout — per breakpoint: the base tier's class, and where
/// the tiers differ every tier's class on the family's attribute, which the client fits to the width at boot, on every breakpoint
/// crossed and on every patch (<c>tier-class.ts</c>). Every rule the class carries keeps working at every tier, where bands per tier
/// around each would multiply the stylesheet, and the engines reading the class read the width's.
/// </summary>
public static class TierClassRenderer
{
    /// <summary>Renders <paramref name="property"/> through <paramref name="family"/>, kept by a live patch.</summary>
    public static void Render<T>(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, TierClassFamily<T> family)
        where T : struct
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);
        ArgumentNullException.ThrowIfNull(family);

        _ = WebComponentRendererBase.RenderProperty(context, target, property, family.Write, family.Operations);
    }

    /// <summary>The base tier's class, and the family's attribute where the tiers differ.</summary>
    public static void Write<T>(IHtmlElementBuilder target, UIResponsive<T>? value, TierClassFamily<T> family)
        where T : struct
    {
        ArgumentNullException.ThrowIfNull(target);
        ArgumentNullException.ThrowIfNull(family);

        if (value is not UIResponsive<T> responsive)
            return;

        var baseClass = family.ClassName(responsive.Base);

        _ = target.Class(baseClass);

        if (Tiers(responsive, family.ClassName, baseClass) is string tiers)
            _ = target.Attribute(family.Attribute, tiers);
    }

    /// <summary>Every tier's class narrowest first, or null where every tier draws <paramref name="baseClass"/>.</summary>
    /// <remarks>Read before it is built: nearly every value is one class at every width, and it is drawn on every stack, button and field.</remarks>
    private static string? Tiers<T>(UIResponsive<T> value, Func<T, string> className, string baseClass)
        where T : struct
    {
        if (!Differs(value, className, baseClass))
            return null;

        StringBuilder tiers = new(baseClass);

        for (UIResponsiveTier tier = UIResponsiveTier.Sm; tier <= UIResponsiveTier.Xxl; tier++)
            _ = tiers.Append(' ').Append(className(value.Resolve(tier)));

        return tiers.ToString();
    }

    private static bool Differs<T>(UIResponsive<T> value, Func<T, string> className, string baseClass)
        where T : struct
    {
        for (UIResponsiveTier tier = UIResponsiveTier.Sm; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (value.Get(tier) is not null && !string.Equals(className(value.Resolve(tier)), baseClass, StringComparison.Ordinal))
                return true;
        }

        return false;
    }
}
