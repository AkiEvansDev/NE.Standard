using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// A sequence of steps over a collection: the chosen key on the root, the current step marked with <c>data-ui-selected</c> and
/// <c>aria-current="step"</c>, and the steps before it marked with <c>data-ui-step-completed</c>; <c>steps-engine.ts</c> keeps the marks.
/// </summary>
public sealed class StepsComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = WebClassNames.StepsItem;

    public override string ComponentTypeKey => StepsComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Steps;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Attribute("role", "group");
        RenderAccessibleName(context, root);

        OrientationStyleRenderer.RenderOrientation(context, root, IOrientationComponent.OrientationProperty);
        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, ISpacingComponent.SpacingProperty, "--ui-steps-spacing");

        RenderSelectedKey(context, root);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        _ = ResolveRenderValue(context, StepsComponent.SelectedKeyProperty, out string? selectedKey, out _);

        var selectedIndex = ResolveSelectedIndex(items, selectedKey);
        List<(IHtmlElementBuilder Row, UIResponsive<UIVisibility>? Visibility)> steps = [];

        RenderItemsHost(context, root, "ui-steps__host", items, isBound, ItemClassName,
            decorateItem: (itemRoot, _, index) =>
            {
                if (selectedIndex < 0)
                    return;

                if (index < selectedIndex)
                    _ = itemRoot.Attribute(WebAttributes.StepCompleted);
                else if (index == selectedIndex)
                    _ = itemRoot.Attribute(WebAttributes.Selected).Attribute("aria-current", "step");
            },
            appendItem: (row, item, _) => steps.Add((row, ReadItemRootValue<UIResponsive<UIVisibility>?>(context, row, item, IVisualComponent.VisibilityProperty)))
        );

        BreadcrumbsComponentRenderer.MarkSteps(steps);
    }

    private static int ResolveSelectedIndex(IReadOnlyList<object?> items, string? selectedKey)
    {
        if (string.IsNullOrEmpty(selectedKey))
            return -1;

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is IBindableItem { Id: { } id } && string.Equals(id, selectedKey, StringComparison.Ordinal))
                return i;
        }

        return -1;
    }
}
