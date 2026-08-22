using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A popup surface anchored to another component that opens/closes on interaction and hosts arbitrary content.
/// </summary>
public abstract partial class FlyoutComponent<T>(string? id = null) : RegionContainerComponentBase<T>(id)
    where T : FlyoutComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Two-way bound: a client-initiated open/close (anchor click, outside click, Escape) syncs back
    /// through the ordinary <c>data-ui-bind-is-open</c>/<c>ValueBindingEngine</c> path on the synthetic
    /// <c>toggle</c> event <c>FlyoutInteractionEngine</c> (client) dispatches, the same way a
    /// two-way-bound <c>Value</c> syncs on <c>change</c>.
    /// </summary>
    [UIComponentProperty(DefaultValue = false, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public bool? IsOpen { get; set; }

    /// <summary>
    /// Gets or sets the preferred placement of the flyout relative to its anchor.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIFlyoutPlacement.BottomStart)]
    public UIFlyoutPlacement? FlyoutPlacement { get; set; }

    /// <summary>
    /// Gets or sets whether clicking outside the flyout closes it.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? CloseOnBackdrop { get; set; }

    /// <summary>
    /// Gets or sets whether pressing Escape closes the flyout.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? CloseOnEscape { get; set; }

    /// <summary>
    /// Gets the anchor region the flyout is positioned relative to.
    /// </summary>
    public virtual IVisualComponent? Anchor => GetRegionOrDefault(RegionNames.Anchor);

    /// <summary>
    /// Gets the content region shown inside the flyout.
    /// </summary>
    public virtual IVisualComponent? Content => GetRegionOrDefault(RegionNames.Content);

    /// <summary>
    /// Sets the anchor region the flyout is positioned relative to.
    /// </summary>
    public virtual T SetAnchor(IVisualComponent component)
    {
        ArgumentNullException.ThrowIfNull(component);
        SetRegion(RegionNames.Anchor, component);
        return Self;
    }

    /// <summary>
    /// Sets the content region shown inside the flyout.
    /// </summary>
    public virtual T SetContent(IVisualComponent component)
    {
        ArgumentNullException.ThrowIfNull(component);
        SetRegion(RegionNames.Content, component);
        return Self;
    }

    /// <summary>
    /// Sets <see cref="IsOpen"/> to <see langword="true"/>.
    /// </summary>
    public T Open()
    {
        IsOpen = true;
        return Self;
    }

    /// <summary>
    /// Sets <see cref="IsOpen"/> to <see langword="false"/>.
    /// </summary>
    public T Close()
    {
        IsOpen = false;
        return Self;
    }

    /// <summary>
    /// Registers a command to invoke when the flyout is toggled.
    /// </summary>
    public T OnToggle(string command)
        => On(EventNames.Toggle, command);
    /// <summary>
    /// Registers a command with bound arguments to invoke when the flyout is toggled.
    /// </summary>
    public T OnToggle(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Toggle, command, arguments);
    /// <summary>
    /// Registers a command with literal arguments to invoke when the flyout is toggled.
    /// </summary>
    public T OnToggleLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Toggle, command, arguments);

    /// <summary>
    /// Registers a command to invoke when the flyout is opened.
    /// </summary>
    public T OnOpen(string command)
        => On(EventNames.Open, command);
    /// <summary>
    /// Registers a command with bound arguments to invoke when the flyout is opened.
    /// </summary>
    public T OnOpen(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Open, command, arguments);
    /// <summary>
    /// Registers a command with literal arguments to invoke when the flyout is opened.
    /// </summary>
    public T OnOpenLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Open, command, arguments);

    /// <summary>
    /// Registers a command to invoke when the flyout is closed.
    /// </summary>
    public T OnClose(string command)
        => On(EventNames.Close, command);
    /// <summary>
    /// Registers a command with bound arguments to invoke when the flyout is closed.
    /// </summary>
    public T OnClose(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Close, command, arguments);
    /// <summary>
    /// Registers a command with literal arguments to invoke when the flyout is closed.
    /// </summary>
    public T OnCloseLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Close, command, arguments);
}

/// <summary>
/// A popup surface anchored to another component that opens/closes on interaction and hosts arbitrary content.
/// </summary>
public sealed class FlyoutComponent(string? id = null) : FlyoutComponent<FlyoutComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.flyout";
}
