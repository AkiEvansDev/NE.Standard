using System;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>The button chrome plus a trailing side: an optional value and the chevron that says the row leads somewhere.</summary>
public sealed class ActionComponentRenderer : ButtonRendererBase
{
    private const string TrailingIconAttribute = "data-ui-action-icon";
    private const string TrailingTextAttribute = "data-ui-action-text";

    public override string ComponentTypeKey => ActionComponent.ComponentTypeKey;

    protected override string ClassName => "ui-action";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-button");

        RenderButtonChrome(context, root);
        RenderButtonLabel(context, root);

        _ = root.Element("span", trailing =>
        {
            _ = trailing.Class("ui-action__trailing");

            _ = trailing.Element("span", text => RenderTrailingText(context, root, text));
            _ = trailing.Element("span", icon => RenderTrailingIcon(context, root, icon));

            // Drawn from borders rather than a glyph, so a row points somewhere with no icon package registered.
            _ = trailing.Element("span", chevron =>
            {
                _ = chevron.Class("ui-action__chevron");

                _ = RenderProperty<bool?>(context, chevron, ActionComponent.ShowChevronProperty, static (target, value) =>
                {
                    if (value == false)
                        _ = target.Class("ui-hidden");
                }, [WebDomOperation.ToggleClass("ui-hidden", condition: WebValueCondition.IsFalse)]);
            });
        });
    }

    /// <summary>Renders the trailing value, its presence driving a root attribute so an empty value collapses the element.</summary>
    private static void RenderTrailingText(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder text)
    {
        _ = text.Class("ui-action__trailing-text");

        _ = RenderProperty<string?>(context, text, ActionComponent.TrailingTextProperty, (target, value) =>
        {
            if (string.IsNullOrWhiteSpace(value))
                return;

            _ = root.Attribute(TrailingTextAttribute);
            _ = target.Text(value);
        }, [
            WebDomOperation.Text(),
            WebDomOperation.ToggleAttribute(TrailingTextAttribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }

    private static void RenderTrailingIcon(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder icon)
    {
        _ = icon.Class("ui-action__icon");
        _ = icon.Class("ui-icon");

        _ = RenderProperty<string?>(context, icon, ActionComponent.TrailingIconProperty, (target, value) =>
        {
            if (string.IsNullOrWhiteSpace(value))
                return;

            _ = root.Attribute(TrailingIconAttribute);
            IconValueRenderer.RenderIconValue(target, value);
        }, [
            .. IconValueRenderer.Operations,
            WebDomOperation.ToggleAttribute(TrailingIconAttribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }
}
