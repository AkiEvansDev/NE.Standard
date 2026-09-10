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
    /// <remarks>Two-way: a drag writes the dropped tab's new position back, so reordering changes the item, not the collection.</remarks>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultValue = null)]
    public double? Order { get; set; }

    /// <summary>
    /// Gets or sets whether the tab is pinned: drawn with a pin, without its close control, and left where it is by a drag. Whether a
    /// close from elsewhere is refused is the controller's answer.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Pinned { get; set; }

    /// <summary>
    /// Initializes a new tab with the built-in caption region.
    /// </summary>
    protected TabItemComponent(string? id = null) : base(id)
    {
        SetRegion(RegionNames.Header, new TabCaptionRegion());
    }

    /// <summary>
    /// Configures the built-in caption region.
    /// </summary>
    public T ConfigureDefaultCaption(Action<TabCaptionRegion> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (Caption is not TabCaptionRegion caption)
            throw new InvalidOperationException($"Only {nameof(TabCaptionRegion)} caption is supported.");

        configure(caption);
        return Self;
    }

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
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.tab-item";
}
