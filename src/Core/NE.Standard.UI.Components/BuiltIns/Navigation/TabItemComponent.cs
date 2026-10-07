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

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// One tab of a <see cref="TabsViewComponent"/>: a caption and the page it opens, rendered as one item.
/// </summary>
/// <remarks>Not a <see cref="Actions.ButtonComponent{T}"/>: the caption carries a close button, and a button inside a button is invalid markup.</remarks>
[UIComponentPropertyBlock(typeof(IItemAbilitiesComponent))]
public abstract partial class TabItemComponent<T> : RegionContainerComponentBase<T>, ITabItemComponent, IItemAbilitiesComponent
    where T : TabItemComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the caption region — the icon, title and badge a button's content carries.
    /// </summary>
    public virtual ITextComponent? Caption => GetRegionOrDefault(RegionNames.Header) as ITextComponent;

    /// <summary>
    /// Gets the page this tab opens.
    /// </summary>
    public virtual IVisualComponent? Page => GetRegionOrDefault(RegionNames.Content);

    /// <summary>
    /// Gets or sets the caption as a rename wrote it back; the caption region itself draws the title.
    /// </summary>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultValue = null)]
    public string? RenamedTitle { get; set; }

    /// <summary>
    /// Gets or sets where this tab sits in the strip, ascending.
    /// </summary>
    /// <remarks>
    /// Bound two-way, but written by the server alone: a drag or a pin tells it where the tab goes, and it writes the orders that
    /// put it there, so reordering changes the item, not the collection. A page's own write of it is refused.
    /// </remarks>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultValue = null)]
    public double? Order { get; set; }

    /// <summary>
    /// Gets or sets whether the tab is pinned: drawn with a pin, without its close control, and left where it is by a drag.
    /// </summary>
    /// <remarks>
    /// Whether a close from elsewhere is refused is the controller's answer. Two-way: the strip's tab menu pins and unpins, writing the
    /// new state back.
    /// </remarks>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultValue = false)]
    public bool? Pinned { get; set; }

    /// <summary>
    /// Initializes a new tab with the built-in caption region.
    /// </summary>
    protected TabItemComponent(string? id = null) : base(id)
    {
        SetRegion(RegionNames.Header, new TabCaptionRegion());

        // Written by the page, an order is no move the server can judge: a drag renumbers tabs that did not move, one write at a time.
        _ = On(EventNames.Move, UIBuiltInCommands.MoveTab, UIAction.ArgCurrentItemKey(UIBuiltInCommands.KeyArgument), UIAction.ArgEventValue(UIBuiltInCommands.IndexArgument));
        _ = On(EventNames.TabPin, UIBuiltInCommands.PlaceTab, UIAction.ArgCurrentItemKey(UIBuiltInCommands.KeyArgument));
    }

    /// <summary>
    /// Configures the built-in caption region.
    /// </summary>
    public T ConfigureDefaultCaption(Action<TabCaptionRegion> configure)
        => Self.ConfigureTemplate(Caption as TabCaptionRegion, configure, "caption");

    /// <summary>
    /// Sets the page this tab opens.
    /// </summary>
    public virtual T SetPage(IVisualComponent page)
    {
        SetRegion(RegionNames.Content, page);
        return Self;
    }

    /// <summary>
    /// Registers a command invoked when this tab's close is pressed; the controller removes the tab or leaves it.
    /// </summary>
    public T OnRemove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Remove, command, arguments);

    /// <summary>
    /// Registers a command invoked when this tab's caption is renamed in place.
    /// </summary>
    public T OnRename(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Rename, command, arguments);

    ITabItemComponent ITabItemComponent.SetPage(IVisualComponent page)
        => SetPage(page);

    ITabItemComponent ITabItemComponent.OnRemove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnRemove(command, arguments);

    ITabItemComponent ITabItemComponent.OnRename(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnRename(command, arguments);
}

/// <summary>
/// One tab of a <see cref="TabsViewComponent"/>.
/// </summary>
public sealed class TabItemComponent(string? id = null) : TabItemComponent<TabItemComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.tab-item";
}
