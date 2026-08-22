using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Contents;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Regions;

public sealed class ButtonContentRegionRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => ButtonContentRegion.ComponentTypeKey;

    protected override string ClassName => "ui-button-content";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltipAndMaxLines(context, root);

        _ = RenderProperty<UITextAlignment?>(context, root, TextComponent.TextAlignmentProperty, static (target, value) =>
        {
            if (value is UITextAlignment alignment)
                _ = target.Class(WebClassNames.ButtonContentTextAlignment(alignment));
        }, [WebDomOperation.Class(converter: WebDomConverters.ButtonContentTextAlignmentClass)]);

        // On the region root, the nearest element enclosing both title and icon — colouring only the title
        // leaves a recoloured label next to a default-coloured glyph.
        RenderTitleColor(context, root);

        _ = root.Element("span", icon => RenderIcon(context, root, icon, ClassName));

        _ = root.Element("span", body =>
        {
            _ = body.Class("ui-button-content__body");

            _ = body.Element("span", header =>
            {
                _ = header.Class("ui-button-content__header");

                _ = header.Element("span", title => RenderTitle(context, root, title, ClassName));

                _ = header.Element("span", badge =>
                {
                    _ = badge.Class("ui-button-content__badge");
                    _ = badge.Class("ui-badge");

                    _ = RenderProperty<UITextBadgePlacement?>(context, badge, TextComponent.BadgePlacementProperty, static (target, value)
                        => _ = target.Class(WebClassNames.ButtonContentBadgePlacement(value ?? UITextBadgePlacement.Trailing))
                    , [
                        WebDomOperation.Class(converter: WebDomConverters.ButtonContentBadgePlacementClass)
                    ]);

                    BadgeComponentRenderer.RenderBadge(
                        context,
                        root,
                        badge,
                        new WebBadgeRenderOptions
                        {
                            StyleProperty = TextComponent.BadgeStyleProperty,
                            IconProperty = TextComponent.BadgeIconProperty,
                            IconColorProperty = TextComponent.BadgeIconColorProperty,
                            IconSizeProperty = TextComponent.BadgeIconSizeProperty,
                            TextProperty = TextComponent.BadgeTextProperty,
                            TextTypeProperty = TextComponent.BadgeTextTypeProperty,
                            TooltipProperty = TextComponent.BadgeTooltipProperty,
                            ContentStateTarget = ".ui-button-content__badge"
                        });
                });
            });

            _ = body.Element("span", description => RenderDescription(context, root, description, ClassName));
        });
    }
}
