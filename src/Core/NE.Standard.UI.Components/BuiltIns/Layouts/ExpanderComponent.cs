using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
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
public abstract partial class ExpanderComponent<T> : BorderedRegionComponentBase<T>
    where T : ExpanderComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Two-way bound: a client-initiated expand/collapse (clicking the summary) syncs back through the
    /// ordinary <c>data-ui-bind-expanded</c>/<c>ValueBindingEngine</c> path on the native
    /// <c>&lt;details&gt;</c> <c>toggle</c> event, the same way a two-way-bound <c>Value</c> syncs on
    /// <c>change</c>.
    /// </summary>
    [UIComponentProperty(DefaultValue = true, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public bool? Expanded { get; set; }

    /// <summary>
    /// Gets the header region.
    /// </summary>
    public virtual ITextComponent? Header => GetRegionOrDefault(RegionNames.Header) as ITextComponent;

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

    /// <summary>
    /// Sets the header region.
    /// </summary>
    public virtual T SetHeader(ITextComponent component)
    {
        SetRegion(RegionNames.Header, component);
        return Self;
    }

    /// <summary>
    /// Registers a command to invoke when the expander is toggled.
    /// </summary>
    public T OnToggle(string command)
        => On(EventNames.Toggle, command);
    /// <summary>
    /// Registers a command with bound arguments to invoke when the expander is toggled.
    /// </summary>
    public T OnToggle(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Toggle, command, arguments);
    /// <summary>
    /// Registers a command with literal arguments to invoke when the expander is toggled.
    /// </summary>
    public T OnToggleLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Toggle, command, arguments);

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
