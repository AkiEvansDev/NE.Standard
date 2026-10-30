using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component a person folds and unfolds as a whole — an expander, a collapsible panel, a menu folding to its rail — raising
/// <see cref="EventNames.Expand"/> and <see cref="EventNames.Collapse"/> as they do, so the <c>OnExpand</c>/<c>OnCollapse</c> forms reach it.
/// </summary>
public interface IExpandableComponent : IVisualComponent
{
    /// <summary>
    /// Gets or sets whether the component is unfolded.
    /// </summary>
    /// <remarks>An expander's is two-way, the viewer's fold written back; a collapsible's fold stays the viewer's, client-side.</remarks>
    bool? Expanded { get; set; }
}

/// <summary>
/// The fold setters and fold-event forms shared by every <see cref="IExpandableComponent"/>.
/// </summary>
/// <remarks>Raised by a person's fold alone, not by a bound <c>Expanded</c> the controller pushes; an inner fold raises no outer component's.</remarks>
public static class ExpandableComponentExtensions
{
    /// <summary>
    /// Sets <see cref="IExpandableComponent.Expanded"/> to <see langword="true"/>.
    /// </summary>
    public static T SetExpanded<T>(this T component)
        where T : IExpandableComponent
        => Fold(component, true);

    private static T Fold<T>(T component, bool expanded)
        where T : IExpandableComponent
    {
        ArgumentNullException.ThrowIfNull(component);

        component.Expanded = expanded;
        return component;
    }

    /// <summary>
    /// Sets <see cref="IExpandableComponent.Expanded"/> to <see langword="false"/>.
    /// </summary>
    public static T SetCollapsed<T>(this T component)
        where T : IExpandableComponent
        => Fold(component, false);

    // Two events, not three: a `Toggle` beside these would dispatch two commands per gesture in no promised order.

    /// <summary>
    /// Registers a command to invoke when the component is expanded.
    /// </summary>
    public static T OnExpand<T>(this T component, string command)
        where T : IExpandableComponent
        => component.OnExpand(command, []);

    /// <summary>
    /// Registers a command with bound arguments to invoke when the component is expanded.
    /// </summary>
    public static T OnExpand<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : IExpandableComponent
        => On(component, EventNames.Expand, command, arguments);

    private static T On<T>(T component, string eventName, string command, KeyValuePair<string, UIActionArgument>[] arguments)
        where T : IExpandableComponent
    {
        ArgumentNullException.ThrowIfNull(component);

        _ = component.On(eventName, command, arguments);
        return component;
    }

    /// <summary>
    /// Registers a command with literal arguments to invoke when the component is expanded.
    /// </summary>
    public static T OnExpandLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments)
        where T : IExpandableComponent
        => component.OnExpand(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Registers a command to invoke when the component is collapsed.
    /// </summary>
    public static T OnCollapse<T>(this T component, string command)
        where T : IExpandableComponent
        => component.OnCollapse(command, []);

    /// <summary>
    /// Registers a command with bound arguments to invoke when the component is collapsed.
    /// </summary>
    public static T OnCollapse<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : IExpandableComponent
        => On(component, EventNames.Collapse, command, arguments);

    /// <summary>
    /// Registers a command with literal arguments to invoke when the component is collapsed.
    /// </summary>
    public static T OnCollapseLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments)
        where T : IExpandableComponent
        => component.OnCollapse(command, UIActionArgument.Literals(arguments));
}
