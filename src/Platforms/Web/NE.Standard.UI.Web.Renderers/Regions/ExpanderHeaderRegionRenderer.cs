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

public sealed class ExpanderHeaderRegionRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => ExpanderHeaderRegion.ComponentTypeKey;

    protected override string ClassName => "ui-expander-header";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltipAndMaxLines(context, root);

        RenderTitleColor(context, root);

        _ = root.Element("span", icon => RenderIcon(context, root, icon, ClassName));

        _ = root.Element("span", body =>
        {
            _ = body.Class("ui-expander-header__body");

            _ = body.Element("span", titleRow =>
            {
                _ = titleRow.Class("ui-expander-header__title-row");

                _ = titleRow.Element("span", title => RenderTitle(context, root, title, ClassName));

                _ = titleRow.Element("span", badge =>
                {
                    _ = badge.Class("ui-expander-header__badge");
                    _ = badge.Class("ui-badge");

                    _ = RenderProperty<UITextBadgePlacement?>(context, badge, TextComponent.BadgePlacementProperty, static (target, value)
                        => _ = target.Class(WebClassNames.TextBadgePlacement(value ?? UITextBadgePlacement.Trailing))
                    , [
                        WebDomOperation.Class(converter: WebDomConverters.TextBadgePlacementClass)
                    ]);

                    BadgeComponentRenderer.RenderBadge(context, root, badge,
                        new WebBadgeRenderOptions
                        {
                            StyleProperty = TextComponent.BadgeStyleProperty,
                            IconProperty = TextComponent.BadgeIconProperty,
                            IconColorProperty = TextComponent.BadgeIconColorProperty,
                            IconSizeProperty = TextComponent.BadgeIconSizeProperty,
                            TextProperty = TextComponent.BadgeTextProperty,
                            TextTypeProperty = TextComponent.BadgeTextTypeProperty,
                            TooltipProperty = TextComponent.BadgeTooltipProperty,
                            ContentStateTarget = ".ui-expander-header__badge"
                        });
                });

                _ = titleRow.Element("span", chevron =>
                {
                    _ = chevron.Class("ui-expander-header__chevron");

                    _ = RenderProperty<bool?>(context, chevron, ExpanderHeaderRegion.ShowChevronProperty, static (target, value) =>
                    {
                        if (value == false)
                            _ = target.Class("ui-hidden");
                    }, [WebDomOperation.ToggleClass("ui-hidden", condition: WebValueCondition.IsFalse)]);
                });
            });

            _ = body.Element("span", description => RenderDescription(context, root, description, ClassName));
        });
    }
}
