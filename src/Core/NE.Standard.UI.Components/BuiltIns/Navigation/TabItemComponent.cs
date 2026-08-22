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
/// <remarks>
/// Both halves come from the same item, so they are one component rather than two: the caption sits in the
/// strip and the page below it, and the layout — not the tree — is what puts them in different places. That
/// is also what keeps a page's own state alive across a switch, since nothing is re-rendered on one.
/// <para>
/// Not a <see cref="Actions.ButtonComponent{T}"/>, unlike a menu entry: the caption carries a close button of
/// its own, and a button inside a button is not markup a browser accepts.
/// </para>
/// </remarks>
public abstract partial class TabItemComponent<T> : RegionContainerComponentBase<T>, ITabItemComponent
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
    /// Gets or sets whether this tab shows a close button.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? Closable { get; set; }

    /// <summary>
    /// Gets or sets the caption's text as the tab itself carries it.
    /// </summary>
    /// <remarks>
    /// The caption region renders the title; this is the same value in a form that can be <em>written</em> —
    /// the span the caption draws is not a field and has no value to read, so the tab carries the text as an
    /// attribute instead, the way the strip carries its key. Its own name rather than <c>Title</c> because a
    /// two-way property is recognized by its binding attribute, and that list is global: <c>Title</c> is on
    /// half the components in the library.
    /// </remarks>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultValue = null)]
    public string? CaptionText { get; set; }

    /// <summary>
    /// Gets or sets where this tab sits in the strip, ascending.
    /// </summary>
    /// <remarks>
    /// Two-way: a drag writes the dropped tab's new position back through the ordinary value path, which is
    /// what makes reordering a change to the item rather than to the collection. See
    /// <see cref="Authoring.BuiltIns.Models.ITabItemModel.Order"/> for why it is fractional.
    /// </remarks>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultValue = null)]
    public double? Order { get; set; }

    /// <summary>
    /// Initializes a new tab with the built-in caption region.
    /// </summary>
    protected TabItemComponent(string? id = null) : base(id)
    {
        SetRegion(RegionNames.Header, new ButtonContentRegion());
    }

    /// <summary>
    /// Configures the built-in caption region, throwing if a different caption has been set.
    /// </summary>
    public T ConfigureDefaultCaption(Action<ButtonContentRegion> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (Caption is not ButtonContentRegion caption)
            throw new InvalidOperationException($"Only {nameof(ButtonContentRegion)} caption is supported.");

        configure(caption);
        return Self;
    }

    /// <summary>
    /// Sets the caption region.
    /// </summary>
    public virtual T SetCaption(ITextComponent caption)
    {
        SetRegion(RegionNames.Header, caption);
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
    /// Registers a command invoked when this tab's close button is pressed.
    /// </summary>
    public T OnClose(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Close, command, arguments);

    /// <summary>
    /// Registers a command invoked when this tab's caption is renamed in place.
    /// </summary>
    public T OnRename(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Rename, command, arguments);

    ITabItemComponent ITabItemComponent.SetPage(IVisualComponent page)
        => SetPage(page);

    ITabItemComponent ITabItemComponent.OnClose(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnClose(command, arguments);

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
