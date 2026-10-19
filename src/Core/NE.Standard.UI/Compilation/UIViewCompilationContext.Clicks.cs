using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    // The components an interaction runs on the click of, by authored id: found once, when the first clickable component asks.
    private HashSet<string>? _clickInteractionSources;

    /// <summary>
    /// The value a component implies where its author left a property unset: a clickable component with a click of its own — a command
    /// or an interaction on its click, or an address it links to — is clickable, as if its author had said so; a set or bound
    /// <c>Clickable</c> stays the gate.
    /// </summary>
    private bool? ImpliedValue(IVisualComponent component, UIProperty property)
        => property.Equals(IClickableComponent.ClickableProperty) && component is IClickableComponent && HasClickOfItsOwn(component) ? true : null;

    private bool HasClickOfItsOwn(IVisualComponent component)
        => HasEvent(component, EventNames.Click) || ClickInteractionSources().Contains(component.Id) || IsLink(component);

    private HashSet<string> ClickInteractionSources()
    {
        if (_clickInteractionSources is not null)
            return _clickInteractionSources;

        HashSet<string> sources = new(StringComparer.Ordinal);

        foreach (IVisualComponent owner in _componentOrder)
        {
            foreach (UIInteraction interaction in owner.Interactions)
            {
                if (interaction.SourceKind == UIInteractionSourceKind.Event && string.Equals(interaction.SourceEvent, EventNames.Click, StringComparison.Ordinal))
                    _ = sources.Add(interaction.ComponentId);
            }
        }

        return _clickInteractionSources = sources;
    }

    /// <summary>Whether a component is drawn as a link: its address set or bound.</summary>
    private static bool IsLink(IVisualComponent component)
        => component is ILinkableComponent linkable && (!string.IsNullOrWhiteSpace(linkable.Url) || FindBinding(component, ILinkableComponent.UrlProperty) is not null);

    private void ValidateLinks()
    {
        foreach (IVisualComponent component in _componentOrder)
            ValidateLink(component);
    }

    /// <summary>
    /// Refuses what a link cannot hold: a press of its own — a command on its click, a toggle's, a drawer's — which would race the
    /// navigation the press starts, and a control of its own inside it, since an anchor takes no interactive descendant, as a button
    /// takes none. Its right-click menu is a popup of its own, not a control it holds, but no input stands in it: the page keeps every
    /// press in a link's menu from the link, a box's own tick or a picker's chooser with it.
    /// </summary>
    private void ValidateLink(IVisualComponent component)
    {
        if (!IsLink(component))
            return;

        if (HasEvent(component, EventNames.Click))
            throw new InvalidOperationException($"'{component.Id}' links to an address and runs a command on its click; the press would race the navigation, so drop the Url or the click command.");

        if (SetOrBound(component, ButtonComponent.PressedProperty) || SetOrBound(component, ButtonComponent.OpensDrawerProperty) || SetOrBound(component, ButtonComponent.PinsDrawerProperty))
            throw new InvalidOperationException($"'{component.Id}' links to an address and is a toggle or a drawer's button; one press cannot do both, so drop the Url or the press of its own.");

        foreach (UIComponentTreeSlot slot in UIComponentTree.EnumerateSlots(component))
        {
            if (slot.Kind != UIComponentSlotKind.ContextMenu && FindControl(slot.Root) is IVisualComponent control)
                throw new InvalidOperationException($"'{component.Id}' links to an address and holds '{control.Id}', a control of its own; an anchor takes none, so drop the Url or move the control out.");

            if (slot.Kind == UIComponentSlotKind.ContextMenu && FindInput(slot.Root) is IVisualComponent input)
                throw new InvalidOperationException($"'{component.Id}' links to an address and its right-click menu holds '{input.Id}', an input; a press in a link's menu is kept from the link, the input's own toggle or chooser with it, so drop the Url or the input.");
        }
    }

    /// <summary>Whether the component's type has the property and the component sets or binds it: a button's or an action row's alike.</summary>
    private bool SetOrBound(IVisualComponent component, UIProperty property)
        => TryGetPropertyDefinition(component.TypeKey, property, out UIPropertyDefinition? definition) && (definition.Getter(component) is not null || FindBinding(component, property) is not null);

    /// <summary>
    /// The first control in a part of a link, its right-click menus aside: a button, a field, a link, a host of presses, or anything with
    /// a click of its own.
    /// </summary>
    private IVisualComponent? FindControl(IVisualComponent root)
    {
        if (IsControl(root))
            return root;

        foreach (UIComponentTreeSlot slot in UIComponentTree.EnumerateSlots(root))
        {
            if (slot.Kind != UIComponentSlotKind.ContextMenu && FindControl(slot.Root) is IVisualComponent control)
                return control;
        }

        return null;
    }

    // A click of its own counts its click interactions too (OnClickShowImage on a picture with Clickable unset). A host whose own parts
    // are presses is one, whatever its items' template says: a pager's pages, a switcher's choices, a splitter's handle, a panel's fold
    // toggle, rows the reader chooses, and what says so itself (tabs, an expander, a tree, a package's grid or chart).
    private bool IsControl(IVisualComponent component)
        => component is IButtonComponent or IInputComponent or IPagerComponent or ISwitcherComponent or IGridSplitterComponent or ICollapsibleComponent { ShowCollapseToggle: true }
            || component is IPressablePartsComponent { HasPressableParts: true }
            || component.TypeKey == LinkComponent.ComponentTypeKey
            || HasChosenRows(component)
            || HasClickOfItsOwn(component)
            || component is IClickableComponent { Clickable: true };

    /// <summary>Whether the reader chooses the component's rows: its selection mode one or many, or bound.</summary>
    private static bool HasChosenRows(IVisualComponent component)
        => component is ISelectableItemsComponent selectable
            && (selectable.SelectionMode is UISelectionMode.One or UISelectionMode.Many || FindBinding(component, ISelectableItemsComponent.SelectionModeProperty) is not null);

    /// <summary>The first input anywhere in a part of a link — its right-click menu — its entries' templates included.</summary>
    private static IVisualComponent? FindInput(IVisualComponent root)
    {
        if (root is IInputComponent)
            return root;

        foreach (UIComponentTreeSlot slot in UIComponentTree.EnumerateSlots(root))
        {
            if (FindInput(slot.Root) is IVisualComponent input)
                return input;
        }

        return null;
    }
}
