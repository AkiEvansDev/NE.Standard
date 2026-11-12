using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.Foundation.Items;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    /// <summary>
    /// Warns about a bound <c>SelectedKey</c> or <c>SelectedKeys</c> the selection mode never reads; a bound mode is left alone.
    /// </summary>
    private void ValidateSelectionBindings()
    {
        for (var i = 0; i < _componentOrder.Count; i++)
        {
            if (_componentOrder[i] is not ISelectableItemsComponent selectable || FindBinding(selectable, ISelectableItemsComponent.SelectionModeProperty) is not null)
                continue;

            UISelectionMode mode = selectable.SelectionMode ?? UISelectionMode.None;

            if (mode != UISelectionMode.One && FindBinding(selectable, ISelectedKeyComponent.SelectedKeyProperty) is not null)
                _warnings.Add(new(UICompileWarningKind.Advisory, $"Component '{selectable.Id}' binds '{nameof(ISelectableItemsComponent.SelectedKey)}' but its selection mode is {mode}, which never reads it."));

            if (mode != UISelectionMode.Many && FindBinding(selectable, ISelectableItemsComponent.SelectedKeysProperty) is not null)
                _warnings.Add(new(UICompileWarningKind.Advisory, $"Component '{selectable.Id}' binds '{nameof(ISelectableItemsComponent.SelectedKeys)}' but its selection mode is {mode}, which never reads it."));
        }
    }

    /// <summary>
    /// Refuses inline rename authored without a writable <see cref="IRenamableComponent.RenamedTitle"/> binding, since the client sends
    /// the edited caption back through <c>RenamedTitle</c> and <c>OnRename</c> carries no value of its own; a bound
    /// <c>TabMenuEntries</c> alone is left alone.
    /// </summary>
    private void ValidateInlineRenameBindings(CompiledUIInteraction[] interactions)
    {
        HashSet<UIComponentId>? renameTargets = null;

        for (var i = 0; i < interactions.Length; i++)
        {
            if (interactions[i].Effect is RenameItemEffect { ResolvedTarget: { } target })
                _ = (renameTargets ??= []).Add(target.Id);
        }

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];
            UIComponentId componentId = GetComponentId(component.Id);

            if (component is IItemRenameComponent and IItemsHostAbilitiesComponent abilities)
            {
                ValidateHostInlineRenameBindings(component, abilities, componentId, renameTargets);
                continue;
            }

            if (!UIEffectTargets.TakesInlineRename(component.TypeKey) || IsItemsTemplateRootOf<IItemRenameComponent>(component))
                continue;

            var renamable = component is IRenamableItemsComponent { Renamable: true }
                || FindBinding(component, IRenamableItemsComponent.RenamableProperty) is not null;
            var raisesRename = FindEventName(component, EventNames.Rename, StringComparison.Ordinal) is not null;
            var targeted = renameTargets?.Contains(componentId) == true;

            if ((renamable || raisesRename || targeted) && !HasWritableRenamedTitle(component))
                throw new InvalidOperationException($"Component '{component.Id}' ({component.TypeKey}) enables inline rename without a writable '{nameof(IRenamableComponent.RenamedTitle)}' binding; bind '{nameof(IRenamableComponent.RenamedTitle)}' with TwoWay, OneWayToSource or OnSubmit.");
        }
    }

    private void ValidateHostInlineRenameBindings(IVisualComponent host, IItemsHostAbilitiesComponent abilities, UIComponentId hostId, HashSet<UIComponentId>? renameTargets)
    {
        if (!_slotsByOwnerComponentId.TryGetValue(host.Id, out List<UIComponentSlot>? slots) || slots is null)
            return;

        var hostRenamable = (abilities.Renamable == true && FindBinding(host, IItemsHostAbilitiesComponent.RenamableProperty) is null)
            || FindBinding(host, IItemsHostAbilitiesComponent.RenamableProperty) is not null;
        var menuRenames = host is TabsViewComponent { TabMenuEntries: { } entries } tabs && entries.HasFlag(UITabMenuEntries.Rename) && FindBinding(tabs, TabsViewComponent.TabMenuEntriesProperty) is null;
        var targeted = renameTargets?.Contains(hostId) == true;
        var raisesRename = false;
        var rowStaticallyRefuses = false;

        for (var i = 0; i < slots.Count; i++)
        {
            UIComponentSlot slot = slots[i];

            if (!IsItemsTemplateSlot(slot.Kind))
                continue;

            IVisualComponent root = _components[GetAuthoringId(slot.RootComponentId)];

            raisesRename |= FindEventName(root, EventNames.Rename, StringComparison.Ordinal) is not null;

            if (string.Equals(slot.Key, TemplateNames.Row, StringComparison.Ordinal) && IsStaticallyUnrenamable(root))
                rowStaticallyRefuses = true;
        }

        if ((!hostRenamable && !menuRenames && !targeted && !raisesRename) || (rowStaticallyRefuses && !raisesRename))
            return;

        for (var i = 0; i < slots.Count; i++)
        {
            UIComponentSlot slot = slots[i];

            if (!IsItemsTemplateSlot(slot.Kind))
                continue;

            IVisualComponent root = _components[GetAuthoringId(slot.RootComponentId)];

            if (root is not IRenamableComponent || (IsStaticallyUnrenamable(root) && FindEventName(root, EventNames.Rename, StringComparison.Ordinal) is null))
                continue;

            if (!HasWritableRenamedTitle(root))
                throw new InvalidOperationException($"Items host '{host.Id}' ({host.TypeKey}) enables inline rename, but template '{root.Id}' ({root.TypeKey}) has no writable '{nameof(IRenamableComponent.RenamedTitle)}' binding; bind '{nameof(IRenamableComponent.RenamedTitle)}' with TwoWay, OneWayToSource or OnSubmit.");
        }
    }

    private static bool IsStaticallyUnrenamable(IVisualComponent component)
        => component is IItemAbilitiesComponent { CanRename: false } && FindBinding(component, IItemAbilitiesComponent.CanRenameProperty) is null;

    private static bool HasWritableRenamedTitle(IVisualComponent component)
        => FindBinding(component, IRenamableComponent.RenamedTitleProperty) is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource or UIBindingMode.OnSubmit };
}
