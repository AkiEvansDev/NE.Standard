using System.Text;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>
/// An icon pack the host can ask how one of its glyphs is drawn, so a framework glyph an application maps onto it (<c>MapUIGlyph</c>)
/// is drawn by the pack; a pack registers one beside its stylesheet.
/// </summary>
public interface IWebIconPack
{
    /// <summary>
    /// Appends the declarations the pack's rule for <paramref name="icon"/> sets — <c>--ui-icon-font</c>, <c>--ui-icon-glyph</c>,
    /// <c>--ui-icon-fill</c>, what <c>.ui-icon::before</c> reads — whether or not the application registered that glyph; false, with
    /// nothing written, for a name the pack does not draw.
    /// </summary>
    bool TryWriteDeclarations(string icon, StringBuilder css);
}
