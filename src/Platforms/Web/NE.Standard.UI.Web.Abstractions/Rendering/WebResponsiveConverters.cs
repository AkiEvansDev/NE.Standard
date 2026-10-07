using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// The converters of one responsive value, one per breakpoint tier, named <c>{prefix}{Tier}{suffix}</c> — <c>responsiveThicknessSmCss</c>
/// — the same on both sides of the wire (<c>tierConverters</c> in <c>web-dom-converters.ts</c>).
/// </summary>
public sealed class WebResponsiveConverters(string prefix, string suffix)
{
    private readonly string[] _names = [prefix + "Base" + suffix, prefix + "Sm" + suffix, prefix + "Md" + suffix, prefix + "Xl" + suffix, prefix + "Xxl" + suffix];

    /// <summary>Gets every tier's converter, narrowest first.</summary>
    public IReadOnlyList<string> Names => _names;

    /// <summary>Gets the converter of one tier.</summary>
    public string this[UIResponsiveTier tier]
        => _names[(int)tier];
}
