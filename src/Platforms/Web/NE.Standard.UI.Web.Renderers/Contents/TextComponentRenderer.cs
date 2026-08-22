using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public sealed class TextComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => TextComponent.ComponentTypeKey;

    protected override string ClassName => "ui-text";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltipAndMaxLines(context, root);

        _ = RenderProperty<UITextAlignment?>(context, root, TextComponent.TextAlignmentProperty, static (target, value) =>
        {
            if (value is UITextAlignment alignment)
                _ = target.Class(WebClassNames.TextAlignment(alignment));
        }, [WebDomOperation.Class(converter: WebDomConverters.TextAlignmentClass)]);

        _ = RenderProperty<UITextWrapMode?>(context, root, TextComponent.WrapModeProperty, static (target, value) =>
        {
            if (value is UITextWrapMode wrapMode)
                _ = target.Class(WebClassNames.TextWrap(wrapMode));
        }, [WebDomOperation.Class(converter: WebDomConverters.TextWrapClass)]);

        _ = RenderProperty<bool?>(context, root, TextComponent.SelectableProperty, static (target, value) =>
        {
            if (value is true)
                _ = target.Class("ui-text--selectable");
        }, [WebDomOperation.ToggleClass("ui-text--selectable")]);

        _ = root.Element("div", body =>
        {
            _ = body.Class("ui-text__body");

            _ = body.Element("div", header =>
            {
                _ = header.Class("ui-text__header");

                // On the header, which encloses both the title and the icon — see TextContentRendererBase.
                RenderTitleColor(context, header);

                _ = header.Element("span", icon => RenderIcon(context, root, icon, ClassName));

                _ = header.Element("span", title => RenderTitle(context, root, title, ClassName));

                _ = header.Element("span", badge =>
                {
                    _ = badge.Class("ui-text__badge");
                    _ = badge.Class("ui-badge");

                    _ = RenderProperty<UITextBadgePlacement?>(context, badge, TextComponent.BadgePlacementProperty, static (target, value)
                        => _ = target.Class(WebClassNames.TextBadgePlacement(value ?? UITextBadgePlacement.Inline))
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
                            ContentStateTarget = ".ui-text__badge"
                        });
                });
            });

            _ = body.Element("span", description => RenderDescription(context, root, description, ClassName));
        });
    }
}
