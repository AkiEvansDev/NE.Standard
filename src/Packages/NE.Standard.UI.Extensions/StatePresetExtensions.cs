using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A component shown, hidden or enabled by what another component holds, without a round trip (the block a switch reveals,
/// the address a "same as shipping" box folds away). Each is one <c>Interact</c> whose source is the other component's
/// value; the fuller overloads name the property and comparison.
/// </summary>
public static class StatePresetExtensions
{
    /// <summary>Shown while the source has a value — a switch on, a box ticked, a select with a choice — and collapsed otherwise.</summary>
    public static T ShownWhen<T>(this T component, string sourceComponentId) where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.ShownWhen(sourceComponentId, IInputComponent.ValueProperty, UIComparisonOperator.Required, null);

    /// <summary>Shown while the source's value equals <paramref name="value"/>, and collapsed otherwise.</summary>
    public static T ShownWhen<T>(this T component, string sourceComponentId, object? value) where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.ShownWhen(sourceComponentId, IInputComponent.ValueProperty, UIComparisonOperator.Equal, value);

    /// <summary>Shown while the source's property satisfies the comparison, and collapsed otherwise.</summary>
    public static T ShownWhen<T>(this T component, string sourceComponentId, UIProperty source, UIComparisonOperator @operator, object? value)
        where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.Interact(sourceComponentId, source, IVisualComponent.VisibilityProperty, @operator, value, UIVisibility.Visible, UIVisibility.Collapsed);

    /// <summary>Collapsed while the source has a value, and shown otherwise.</summary>
    public static T HiddenWhen<T>(this T component, string sourceComponentId) where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.HiddenWhen(sourceComponentId, IInputComponent.ValueProperty, UIComparisonOperator.Required, null);

    /// <summary>Collapsed while the source's value equals <paramref name="value"/>, and shown otherwise.</summary>
    public static T HiddenWhen<T>(this T component, string sourceComponentId, object? value) where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.HiddenWhen(sourceComponentId, IInputComponent.ValueProperty, UIComparisonOperator.Equal, value);

    /// <summary>Collapsed while the source's property satisfies the comparison, and shown otherwise.</summary>
    public static T HiddenWhen<T>(this T component, string sourceComponentId, UIProperty source, UIComparisonOperator @operator, object? value)
        where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.Interact(sourceComponentId, source, IVisualComponent.VisibilityProperty, @operator, value, UIVisibility.Collapsed, UIVisibility.Visible);

    /// <summary>Enabled while the source has a value, and disabled otherwise.</summary>
    public static T EnabledWhen<T>(this T component, string sourceComponentId) where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.EnabledWhen(sourceComponentId, IInputComponent.ValueProperty, UIComparisonOperator.Required, null);

    /// <summary>Enabled while the source's value equals <paramref name="value"/>, and disabled otherwise.</summary>
    public static T EnabledWhen<T>(this T component, string sourceComponentId, object? value) where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.EnabledWhen(sourceComponentId, IInputComponent.ValueProperty, UIComparisonOperator.Equal, value);

    /// <summary>Enabled while the source's property satisfies the comparison, and disabled otherwise.</summary>
    public static T EnabledWhen<T>(this T component, string sourceComponentId, UIProperty source, UIComparisonOperator @operator, object? value)
        where T : VisualComponentBase<T>, IUIComponentDefinition
        => component.Interact(sourceComponentId, source, IVisualComponent.EnabledProperty, @operator, value, true, false);
}
