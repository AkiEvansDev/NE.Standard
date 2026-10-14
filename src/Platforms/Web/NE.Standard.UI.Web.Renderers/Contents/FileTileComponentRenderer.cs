using System;
using System.Globalization;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Layouts;

namespace NE.Standard.UI.Web.Renderers.Contents;

/// <summary>
/// The tile an image input's shelf draws for a file that is no picture (<c>file-tile.ts</c>): the glyph, the name and the size, the
/// file's facts on the root, from which <c>file-tile-engine.ts</c> writes the size in the reader's language and the glyph again as they
/// change; pressable as a surface is.
/// </summary>
public sealed class FileTileComponentRenderer : WebComponentRendererBase
{
    // Every tile registers these same lists, so they are built once rather than per tile.
    private static readonly WebDomOperation[] NameOperations =
    [
        WebDomOperation.Attribute(WebAttributes.FileTileName),
        WebDomOperation.Attribute("title"),
        WebDomOperation.Text(target: $".{WebClassNames.FileTileName}")
    ];

    private static readonly WebDomOperation[] ContentTypeOperations = [WebDomOperation.Attribute(WebAttributes.FileTileType)];
    private static readonly WebDomOperation[] FileSizeOperations = [WebDomOperation.Attribute(WebAttributes.FileTileSize)];
    private static readonly WebDomOperation[] IconOperations = [WebDomOperation.Attribute(WebAttributes.FileTileIcon)];

    public override string ComponentTypeKey => FileTileComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.FileTile;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SurfaceRendererBase.RenderClickable(context, root);

        // The first paint's glyph, the author's or the file kind's, as the engine picks it from the same three facts (UIFileGlyphs).
        var icon = ReadRenderValue<string?>(context, FileTileComponent.IconProperty, null);
        var glyph = IconValueRenderer.Draws(icon) ? icon : UIFileGlyphs.For(ReadRenderValue<string?>(context, FileTileComponent.FileNameProperty, null), ReadRenderValue<string?>(context, FileTileComponent.ContentTypeProperty, null));

        IconValueRenderer.RenderIcon(root, glyph, WebClassNames.FileTileGlyph);

        IHtmlElementBuilder? name = null;

        _ = root.Element("span", part =>
        {
            name = part;
            _ = part.Class(WebClassNames.FileTileName);
        });

        // Empty until the page writes it: a size reads in the reader's language ("1,5 МБ"), which one render shared by every reader cannot carry.
        _ = root.Element("span", part => part.Class(WebClassNames.FileTileSize));

        // The tree is written out only once the whole component is built, so writing the name after its element returned is safe.
        _ = RenderProperty<string?>(context, root, FileTileComponent.FileNameProperty, (target, value) =>
        {
            if (string.IsNullOrEmpty(value))
                return;

            _ = target.Attribute(WebAttributes.FileTileName, value);
            _ = target.Attribute("title", value);
            _ = name!.Text(value);
        }, NameOperations);

        _ = RenderProperty<string?>(context, root, FileTileComponent.ContentTypeProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute(WebAttributes.FileTileType, value);
        }, ContentTypeOperations);

        _ = RenderProperty<long?>(context, root, FileTileComponent.FileSizeProperty, static (target, value) =>
        {
            if (value is long bytes && bytes >= 0)
                _ = target.Attribute(WebAttributes.FileTileSize, bytes.ToString(CultureInfo.InvariantCulture));
        }, FileSizeOperations);

        _ = RenderProperty<string?>(context, root, FileTileComponent.IconProperty, static (target, value) =>
        {
            if (IconValueRenderer.Draws(value))
                _ = target.Attribute(WebAttributes.FileTileIcon, value);
        }, IconOperations);
    }
}
