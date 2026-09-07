using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// The strip and its segments: the items view's selection vocabulary (the key on the root, the mark on the segment's
/// wrapper) over the button template, which <c>button-group-engine.ts</c> presses and walks.
/// </summary>
public sealed class ButtonGroupComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-button-group__item";

    public override string ComponentTypeKey => ButtonGroupComponent.ComponentTypeKey;

    protected override string ClassName => "ui-button-group";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Attribute("role", "group");

        RenderTooltip(context, root);
        ContainerStyleRenderer.RenderContainerStyle(context, root, includeOverflow: false);
        SelectionStyleRenderer.RenderSelectionStyle(context, root);

        _ = RenderProperty<UIButtonSize?>(context, root, ButtonGroupComponent.SizeProperty, static (target, value) =>
        {
            if (value is UIButtonSize size)
                _ = target.Class(WebClassNames.ButtonGroupSize(size));
        }, [WebDomOperation.Class(converter: WebDomConverters.ButtonGroupSizeClass)]);

        // The same reader and attribute as an items view's one key: a written value that is not a field's is read by kind.
        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.SelectedKey);
        _ = RenderProperty<string?>(context, root, ButtonGroupComponent.SelectedKeyProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute(WebAttributes.SelectedKey, value);
        }, [WebDomOperation.Attribute(WebAttributes.SelectedKey)]);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    /// <summary>Renders the segments into an inner host, the current one marked on its wrapper as an items view marks a row.</summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        _ = ResolveRenderValue(context, ButtonGroupComponent.SelectedKeyProperty, out string? selectedKey, out _);

        RenderItemsHost(context, root, "ui-button-group__host", items, isBound, ItemClassName, decorateItem: (itemRoot, item, index) =>
        {
            if (selectedKey is not null && item is IBindableItem { Id: { } id } && id == selectedKey)
                _ = itemRoot.Attribute(WebAttributes.Selected);
        });
    }
}
