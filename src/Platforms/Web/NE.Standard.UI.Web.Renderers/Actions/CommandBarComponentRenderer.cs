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

/// <summary>Renders a command bar as a flat list of buttons, owning only the flex layout and spacing.</summary>
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

        // A modifier on the root, read by the stylesheet from the group headers inside the items host.
        _ = RenderProperty<UIGroupSeparator?>(context, root, CommandBarComponent.GroupSeparatorProperty, static (target, value) =>
        {
            if (value is UIGroupSeparator separator)
                _ = target.Class(WebClassNames.GroupSeparator(separator));
        }, [WebDomOperation.Class(converter: WebDomConverters.GroupSeparatorClass)]);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    /// <summary>Renders the items into an inner host; the client's lookup searches descendants only, so the root cannot be it.</summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderItemsHost(context, root, "ui-command-bar__host", items, isBound, ItemClassName);
    }
}
