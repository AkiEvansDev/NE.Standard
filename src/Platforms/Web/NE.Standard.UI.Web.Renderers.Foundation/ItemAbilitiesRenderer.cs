using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Writes the marks a row's abilities become (<see cref="IItemAbilitiesComponent"/>) as attributes on the row's root, patched live.</summary>
/// <remarks>The item's own marks at render are the same attributes, written on the row's wrapper by the items host.</remarks>
public static class ItemAbilitiesRenderer
{
    /// <summary>Renders the five refusals as attributes on the root, each present only when the flag is false.</summary>
    public static void RenderItemAbilities(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderRefusal(context, root, IItemAbilitiesComponent.CanSelectProperty, WebAttributes.Unselectable);
        RenderRefusal(context, root, IItemAbilitiesComponent.CanDragProperty, WebAttributes.Undraggable);
        RenderRefusal(context, root, IItemAbilitiesComponent.CanRemoveProperty, WebAttributes.Unremovable);
        RenderRefusal(context, root, IItemAbilitiesComponent.CanRenameProperty, WebAttributes.Unrenamable);
        RenderRefusal(context, root, IItemAbilitiesComponent.CanShowContextMenuProperty, WebAttributes.NoContextMenu);
    }

    private static void RenderRefusal(WebRenderContext context, IHtmlElementBuilder root, UIProperty property, string attribute)
        => _ = WebComponentRendererBase.RenderProperty<bool?>(context, root, property, (target, value) =>
        {
            if (value == false)
                _ = target.Attribute(attribute);
        }, [WebDomOperation.ToggleAttribute(attribute, target: "root", condition: WebValueCondition.IsFalse)]);
}
