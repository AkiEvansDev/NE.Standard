using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Actions;

public sealed class ButtonComponentRenderer : ButtonRendererBase
{
    private static readonly WebDomOperation[] PressedOperations = [WebDomOperation.Attribute("aria-pressed", converter: WebDomConverters.AriaBooleanAttribute, convertsNull: true)];

    public override string ComponentTypeKey => ButtonComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Button;

    /// <summary>The button's look on an anchor where it links to an address (<see cref="ILinkableComponent.Url"/>), as a menu entry's is.</summary>
    protected override (string ElementName, string ClassName) ResolveRoot(WebRenderContext context)
        => DrawsLink(context) ? ("a", ClassName) : base.ResolveRoot(context);

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        var link = DrawsLink(context);

        RenderButtonChrome(context, root, isButtonElement: !link);

        if (link)
            RenderLinkAddress(context, root, ILinkableComponent.UrlProperty);

        RenderPressed(context, root);
        RenderButtonLabel(context, root);
    }

    /// <summary>A toggle's state: <c>aria-pressed</c> on the root, which the toggle engine flips and reads back as the value.</summary>
    private static void RenderPressed(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = ResolveRenderValue(context, ButtonComponent.PressedProperty, out bool? pressed, out CompiledUIBinding? binding);

        // A button that is neither pressed nor bound is no toggle, and a press on it flips nothing.
        if (pressed is null && binding is null)
            return;

        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.Pressed);

        _ = RenderProperty<bool?>(context, root, ButtonComponent.PressedProperty, static (target, value) =>
            target.Attribute("aria-pressed", value == true ? "true" : "false"),
        PressedOperations);
    }
}
