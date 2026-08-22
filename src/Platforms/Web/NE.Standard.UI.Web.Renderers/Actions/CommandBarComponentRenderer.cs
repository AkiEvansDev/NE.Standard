using System;
using System.Collections.Generic;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>
/// A flat list of buttons — each item resolves through <c>DefaultButtonTemplate</c> by default (already
/// aliased to <c>ButtonComponentRenderer</c>, see <c>WebRendererRegistryExtensions.AddDefaultTemplateAliases</c>),
/// so this renderer only owns the flex layout/spacing; <see cref="ItemsCollectionRendererBase.RenderItem"/>
/// handles resolving and rendering each item's own template.
/// </summary>
public sealed class CommandBarComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-command-bar__item";

    public override string ComponentTypeKey => CommandBarComponent.ComponentTypeKey;

    protected override string ClassName => "ui-command-bar";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<UIOrientation?>(context, root, CommandBarComponent.OrientationProperty, static (target, value) =>
        {
            if (value is UIOrientation orientation)
                _ = target.Class(WebClassNames.Orientation(orientation));
        }, [WebDomOperation.Class(converter: WebDomConverters.OrientationClass)]);

        _ = RenderProperty<bool?>(context, root, CommandBarComponent.WrapProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-command-bar--wrap");
        }, [WebDomOperation.ToggleClass("ui-command-bar--wrap")]);

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, CommandBarComponent.SpacingProperty, "--ui-command-bar-spacing");

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    /// <summary>
    /// Items live in an inner host rather than directly under the root, mirroring
    /// <c>ItemsViewComponentRenderer</c>: the client resolves a collection's host with
    /// <c>root.querySelector("[data-ui-items-host]")</c>, which searches descendants only, so a bound
    /// collection whose root *is* the container has nowhere to render into and silently stays empty.
    /// The flex layout moves to the host with it; the orientation/wrap modifier classes stay on the root,
    /// where the renderer's own live class patches already target them.
    /// </summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        _ = root.Element("div", host =>
        {
            _ = host.Class("ui-command-bar__host");
            _ = host.Attribute("data-ui-items-host");

            if (isBound)
                return;

            if (items.Count == 0)
            {
                RenderEmptyPlaceholder(context, host);
                return;
            }

            RenderItemList(context, host, items, ItemClassName);
        });
    }
}
