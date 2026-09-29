using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Writes the marks a row's abilities become as attributes on the row: a template's bound abilities patched live, or an item's own at render.</summary>
public static class ItemAbilitiesRenderer
{
    // The five refusals, once: the template's property, the item's ability and the attribute both become.
    private static readonly ItemRefusal[] Refusals =
    [
        new(IItemAbilitiesComponent.CanSelectProperty, static abilities => abilities.CanSelect, WebAttributes.Unselectable),
        new(IItemAbilitiesComponent.CanDragProperty, static abilities => abilities.CanDrag, WebAttributes.Undraggable),
        new(IItemAbilitiesComponent.CanRemoveProperty, static abilities => abilities.CanRemove, WebAttributes.Unremovable),
        new(IItemAbilitiesComponent.CanRenameProperty, static abilities => abilities.CanRename, WebAttributes.Unrenamable),
        new(IItemAbilitiesComponent.CanShowContextMenuProperty, static abilities => abilities.CanShowContextMenu, WebAttributes.NoContextMenu)
    ];

    /// <summary>Renders the template's abilities (<see cref="IItemAbilitiesComponent"/>) as attributes on the root, each present only when the flag is false.</summary>
    public static void RenderItemAbilities(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        foreach (ItemRefusal refusal in Refusals)
        {
            _ = WebComponentRendererBase.RenderProperty<bool?>(context, root, refusal.Property, (target, value) =>
            {
                if (value == false)
                    _ = target.Attribute(refusal.Attribute);
            }, refusal.Operations);
        }
    }

    /// <summary>Renders the item's own abilities as the same attributes on its row, each present only when the item says false.</summary>
    public static void RenderItemAbilities(IHtmlElementBuilder row, IItemAbilitiesModel abilities)
    {
        ArgumentNullException.ThrowIfNull(row);
        ArgumentNullException.ThrowIfNull(abilities);

        foreach (ItemRefusal refusal in Refusals)
        {
            if (refusal.Ability(abilities) == false)
                _ = row.Attribute(refusal.Attribute);
        }
    }

    private sealed class ItemRefusal(UIProperty property, Func<IItemAbilitiesModel, bool?> ability, string attribute)
    {
        public UIProperty Property { get; } = property;

        public Func<IItemAbilitiesModel, bool?> Ability { get; } = ability;

        public string Attribute { get; } = attribute;

        public WebDomOperation[] Operations { get; } = [WebDomOperation.ToggleAttribute(attribute, target: "root", condition: WebValueCondition.IsFalse)];
    }
}
