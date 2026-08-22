using System;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>
/// The button chrome plus a trailing side: an optional value and the chevron that says the row leads
/// somewhere. Wears <c>ui-button</c> next to its own <c>ui-action</c>, so one stylesheet serves both.
/// </summary>
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
        RenderRegion(context, root, RegionNames.Content);

        _ = root.Element("span", trailing =>
        {
            _ = trailing.Class("ui-action__trailing");

            _ = trailing.Element("span", text => RenderTrailingText(context, root, text));
            _ = trailing.Element("span", icon => RenderTrailingIcon(context, root, icon));

            // The chevron is drawn from borders rather than a glyph, so a row points somewhere with no icon
            // package registered — the same trick the expander header and the temporal toggle use. CSS hides
            // it whenever a real trailing icon is present.
            _ = trailing.Element("span", chevron => _ = chevron.Class("ui-action__chevron"));
        });
    }

    /// <summary>
    /// Presence drives a root attribute rather than the element's own class, because an empty value has to
    /// collapse the element and no <c>WebDomOperationKind</c> adds or removes one.
    /// </summary>
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
            _ = target.Class(WebIconClassName.FromIconName(value));
        }, [
            WebDomOperation.Class(converter: WebDomConverters.IconClass),
            WebDomOperation.ToggleAttribute(TrailingIconAttribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }
}
