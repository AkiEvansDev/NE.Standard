using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A collapsible bordered region with a header that toggles the visibility of its content.
/// </summary>
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
public abstract partial class ExpanderComponent<T> : BorderedRegionComponentBase<T>, ISurfaceStyleComponent
    where T : ExpanderComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Whether the section is open; two-way, so clicking the summary syncs back.
    /// </summary>
    [UIComponentProperty(DefaultValue = true, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public bool? Expanded { get; set; }

    /// <summary>
    /// Whether the trailing disclosure chevron is drawn.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowChevron { get; set; }

    /// <summary>
    /// Gets the header region — any visual component, not only the built-in text one.
    /// </summary>
    /// <remarks>The header renders into a native <c>summary</c>, which swallows clicks: nothing interactive works there.</remarks>
    public virtual IVisualComponent? Header => GetRegionOrDefault(RegionNames.Header);

    /// <summary>
    /// Initializes a new expander with the built-in header region.
    /// </summary>
    protected ExpanderComponent(string? id = null) : base(id)
    {
        SetRegion(RegionNames.Header, new ExpanderHeaderRegion());
    }

    /// <summary>
    /// Configures the built-in default header region, throwing if a different header has been set.
    /// </summary>
    public T ConfigureDefaultHeader(Action<ExpanderHeaderRegion> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (Header is not ExpanderHeaderRegion header)
            throw new InvalidOperationException($"Only {nameof(ExpanderHeaderRegion)} header is supported.");

        configure(header);
        return Self;
    }

    /// <summary>
    /// Sets <see cref="Expanded"/> to <see langword="true"/>.
    /// </summary>
    public T SetExpanded()
    {
        Expanded = true;
        return Self;
    }

    /// <summary>
    /// Sets <see cref="Expanded"/> to <see langword="false"/>.
    /// </summary>
    public T SetCollapsed()
    {
        Expanded = false;
        return Self;
    }

    // Two events, not three: a `Toggle` beside these would dispatch two commands per gesture in no promised order.

    /// <summary>
    /// Registers a command to invoke when the expander is expanded.
    /// </summary>
    public T OnExpand(string command)
        => On(EventNames.Expand, command);
    /// <summary>
    /// Registers a command with bound arguments to invoke when the expander is expanded.
    /// </summary>
    public T OnExpand(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Expand, command, arguments);
    /// <summary>
    /// Registers a command with literal arguments to invoke when the expander is expanded.
    /// </summary>
    public T OnExpandLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Expand, command, arguments);

    /// <summary>
    /// Registers a command to invoke when the expander is collapsed.
    /// </summary>
    public T OnCollapse(string command)
        => On(EventNames.Collapse, command);
    /// <summary>
    /// Registers a command with bound arguments to invoke when the expander is collapsed.
    /// </summary>
    public T OnCollapse(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Collapse, command, arguments);
    /// <summary>
    /// Registers a command with literal arguments to invoke when the expander is collapsed.
    /// </summary>
    public T OnCollapseLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Collapse, command, arguments);
}

/// <summary>
/// A collapsible bordered region with a header that toggles the visibility of its content.
/// </summary>
public sealed class ExpanderComponent(string? id = null) : ExpanderComponent<ExpanderComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.expander";
}
