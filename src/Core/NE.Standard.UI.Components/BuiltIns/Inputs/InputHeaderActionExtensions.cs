using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// Fluent helpers for placing multiple controls at the far edge of an input's caption row.
/// </summary>
public static class InputHeaderActionExtensions
{
    /// <summary>
    /// Sets the controls the caption row carries at its far edge (one as it is, more in a horizontal row 4 px apart).
    /// </summary>
    public static TComponent SetHeaderActions<TComponent, TValue>(this InputComponentBase<TComponent, TValue> input, params IVisualComponent[] actions)
        where TComponent : InputComponentBase<TComponent, TValue>, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(input);
        ArgumentNullException.ThrowIfNull(actions);

        if (actions.Length == 0)
            return (TComponent)input;

        return input.SetHeaderAction(PackActions(actions));
    }

    /// <summary>
    /// Sets the controls the caption row carries at its far edge (one as it is, more in a horizontal row 4 px apart).
    /// </summary>
    public static TComponent SetHeaderActions<TComponent, TItem, TValue, TTemplate>(this InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate> input, params IVisualComponent[] actions)
        where TComponent : InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate>, IUIComponentDefinition
        where TItem : class
        where TTemplate : class, IVisualComponent
    {
        ArgumentNullException.ThrowIfNull(input);
        ArgumentNullException.ThrowIfNull(actions);

        if (actions.Length == 0)
            return (TComponent)input;

        return input.SetHeaderAction(PackActions(actions));
    }

    private static IVisualComponent PackActions(IVisualComponent[] actions)
    {
        foreach (IVisualComponent action in actions)
            ArgumentNullException.ThrowIfNull(action);

        return actions.Length == 1
            ? actions[0]
            : new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(4)
                .SetVerticalAlignment(UIAlignment.Center)
                .AddChildren(actions);
    }
}
