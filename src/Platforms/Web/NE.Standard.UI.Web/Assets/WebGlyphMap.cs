using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Assets;

/// <summary>
/// The framework glyphs an application draws with its own pack's icons (<c>MapUIGlyph</c>), and the stylesheet that does it: each
/// glyph's class restated with the declarations its pack's rule for the target sets, so a server render and a client patch, which
/// both write the glyph's class, draw the target alike.
/// </summary>
internal sealed class WebGlyphMap
{
    // After ui.css (order 0), whose `ne-` rule each rule here restates at the same specificity, and after every package's (100).
    private const int Order = 200;

    private static readonly FrozenSet<string> GlyphNames = ReadGlyphNames();

    // The class every glyph of the core's own face wears the start of: a target there is the core's face again, no pack's.
    private static readonly string CoreGlyphClassPrefix = WebIconClassName.FromIconName(UIGlyphs.Prefix);

    private readonly Dictionary<string, string> _icons = new(StringComparer.Ordinal);

    /// <summary>Maps <paramref name="glyph"/> to <paramref name="icon"/>; refuses a glyph that is not the framework's and a target no pack could draw.</summary>
    public void Add(string glyph, string icon)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(glyph);
        ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        if (!GlyphNames.Contains(glyph))
            throw new ArgumentException($"'{glyph}' is not a framework glyph. Name it by a UIGlyphs constant.", nameof(glyph));

        var target = icon.Trim();

        // A picture is drawn by a form of its own (a mask or an image on the element), not by the declarations a glyph's rule sets.
        if (WebIconValue.TryReadImage(target, out _, out _))
            throw new ArgumentException($"'{glyph}' cannot be drawn as the picture '{icon}'. Map it to a glyph of a registered icon pack.", nameof(icon));

        if (!WebIconValue.Names(target) || WebIconClassName.FromIconName(target).StartsWith(CoreGlyphClassPrefix, StringComparison.Ordinal))
            throw new ArgumentException($"'{icon}' is no icon pack's glyph. Map '{glyph}' to a glyph of a registered pack, such as MaterialIcons.Outlined(MaterialIcons.ContentCopy).", nameof(icon));

        if (_icons.TryGetValue(glyph, out var mapped) && !string.Equals(mapped, target, StringComparison.Ordinal))
            throw new InvalidOperationException($"'{glyph}' is already drawn as '{mapped}'. A glyph is drawn one way across the application.");

        _icons[glyph] = target;
    }

    /// <summary>The stylesheet asset; a target no registered pack draws fails the startup, naming it.</summary>
    public WebAssetDescriptor BuildAsset(IWebIconPack[] packs)
    {
        ArgumentNullException.ThrowIfNull(packs);

        return new WebAssetDescriptor
        {
            Key = "ui-glyph-map.css",
            Kind = UIWebAssetKind.Css,
            SourceKind = UIWebAssetSourceKind.Content,
            Source = "ui-glyph-map",
            Content = Build(packs),
            PublicPath = "/_ne/css/ui-glyph-map.css",
            Order = Order
        };
    }

    private string Build(IWebIconPack[] packs)
    {
        StringBuilder css = new();

        _ = css.AppendLine("/* Framework glyphs drawn by an application's icon pack (MapUIGlyph). Generated at startup — see WebGlyphMap. */");

        foreach (KeyValuePair<string, string> entry in _icons.OrderBy(static entry => entry.Key, StringComparer.Ordinal))
        {
            _ = css.Append('.').Append(WebIconClassName.FromIconName(entry.Key)).Append(" { ");

            if (!WriteDeclarations(packs, entry.Value, css))
                throw new InvalidOperationException($"No registered icon pack draws '{entry.Value}', which '{entry.Key}' is mapped to. Register its pack (AddMaterialWebIcons for an ms- name) and check the name.");

            _ = css.AppendLine("}");
        }

        return css.ToString();
    }

    private static bool WriteDeclarations(IWebIconPack[] packs, string icon, StringBuilder css)
    {
        foreach (IWebIconPack pack in packs)
        {
            if (pack.TryWriteDeclarations(icon, css))
                return true;
        }

        return false;
    }

    private static FrozenSet<string> ReadGlyphNames()
        => typeof(UIGlyphs).GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(static field => field.IsLiteral && field.Name != nameof(UIGlyphs.Prefix))
            .Select(static field => (string)field.GetRawConstantValue()!)
            .ToFrozenSet(StringComparer.Ordinal);
}
