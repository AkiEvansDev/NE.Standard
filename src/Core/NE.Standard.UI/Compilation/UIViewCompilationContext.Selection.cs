using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
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
            if (_componentOrder[i] is not ISelectableItemsComponent selectable || IsBound(selectable, ISelectableItemsComponent.SelectionModeProperty))
                continue;

            UISelectionMode mode = selectable.SelectionMode ?? UISelectionMode.None;

            if (mode != UISelectionMode.One && IsBound(selectable, ISelectableItemsComponent.SelectedKeyProperty))
                _warnings.Add($"Component '{selectable.Id}' binds '{nameof(ISelectableItemsComponent.SelectedKey)}' but its selection mode is {mode}, which never reads it.");

            if (mode != UISelectionMode.Many && IsBound(selectable, ISelectableItemsComponent.SelectedKeysProperty))
                _warnings.Add($"Component '{selectable.Id}' binds '{nameof(ISelectableItemsComponent.SelectedKeys)}' but its selection mode is {mode}, which never reads it.");
        }
    }

    private static bool IsBound(IVisualComponent component, UIProperty property)
    {
        foreach (UIBinding binding in component.Bindings)
        {
            if (binding.Target == property)
                return true;
        }

        return false;
    }
}
