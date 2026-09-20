using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// An items view that lays out a collection, held whole, virtualized or windowed from a source, with grouping, scrolling and
/// configurable orientation/spacing.
/// </summary>
/// <remarks>Row choice is two-way through <c>SelectionMode</c>; <c>SelectionStyle</c> says what a chosen row looks like.</remarks>
[UIComponentPropertyBlock(typeof(IItemsHostComponent))]
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
[UIComponentPropertyBlock(typeof(ISelectableItemsComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
public abstract partial class ItemsViewComponent<T> : GroupedItemsComponentBase<T, object, IVisualComponent>, IItemsHostComponent, IScrollableComponent, ISelectableItemsComponent, ISelectionStyleComponent, IRowHoverableComponent
    where T : ItemsViewComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<double> DefaultSpacing = 0d;

    /// <summary>
    /// Keeps only the rows in view in the document, for a collection the client holds whole.
    /// </summary>
    public T Virtualized()
    {
        HostMode = ItemsHostModes.Virtualize(HostMode);
        return Self;
    }

    /// <summary>
    /// Binds the view's items to a windowed source on the controller.
    /// </summary>
    /// <remarks>The path names the source; the compiler appends the property holding its realized window.</remarks>
    public T BindSource(string path, UIBindingScope scope = UIBindingScope.Root)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);

        HostMode = ItemsHostModes.Window(HostMode);

        return BindItems(path, scope);
    }

    /// <summary>
    /// Registers a click command invoked when an item is clicked, passing the item's key.
    /// </summary>
    public T OnItemClickWithItemKey(string command, string argumentName = "id")
        => OnItemClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a click command invoked when an item is clicked, passing the item.
    /// </summary>
    public T OnItemClickWithItem(string command, string argumentName = "item")
        => OnItemClick(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with UI action arguments.
    /// </summary>
    public T OnItemClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredTemplate.On(EventNames.Click, command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a click command with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public T OnItemClickWith(string command, string argumentName, UIActionArgumentKind argumentKind)
        => OnItemClick(command, UIAction.ArgCurrent(argumentKind, argumentName));

    /// <summary>
    /// Registers a command invoked when an item is opened — Enter on the keyboard's item, or a double click — with the item's key.
    /// </summary>
    public T OnItemOpenWithItemKey(string command, string argumentName = "id")
        => OnItemOpen(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when an item is opened — Enter on the keyboard's item, or a double click.
    /// </summary>
    public T OnItemOpen(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredTemplate.On(EventNames.Open, command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a command invoked when the Delete key is pressed on an item that may be removed, with the item's key.
    /// </summary>
    public T OnItemRemoveWithItemKey(string command, string argumentName = "id")
        => OnItemRemove(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when the Delete key is pressed on an item that may be removed; the controller removes it or leaves it.
    /// </summary>
    public T OnItemRemove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredTemplate.On(EventNames.Remove, command, arguments);
        return Self;
    }

    /// <summary>
    /// Gets or sets the layout algorithm used to arrange items.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIItemsLayoutType.Stack)]
    public UIItemsLayoutType? LayoutType { get; set; }

    /// <summary>
    /// Gets or sets the orientation used to arrange items.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Vertical)]
    public UIOrientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets the spacing between items, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSpacing))]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>
    /// Initializes a new items view with the built-in text, empty and group templates.
    /// </summary>
    protected ItemsViewComponent(string? id = null) : base(id)
    {
        _ = SetTemplate(new DefaultTextTemplate(binds: true));
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
        _ = SetGroupTemplate(new DefaultGroupTemplate(binds: true));
    }

    /// <summary>
    /// Configures the built-in default text template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultTemplate(Action<DefaultTextTemplate> configure)
        => Self.ConfigureTemplate(Template as DefaultTextTemplate, configure, "template");

    /// <summary>
    /// Configures the built-in default empty template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultEmptyTemplate(Action<DefaultEmptyTemplate> configure)
        => Self.ConfigureTemplate(EmptyTemplate as DefaultEmptyTemplate, configure, "template");

    /// <summary>
    /// Configures the built-in default group template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultGroupTemplate(Action<DefaultGroupTemplate> configure)
        => Self.ConfigureTemplate(GroupTemplate as DefaultGroupTemplate, configure, "template");

}

/// <summary>
/// An items view that lays out a collection, held whole, virtualized or windowed from a source.
/// </summary>
public sealed class ItemsViewComponent(string? id = null) : ItemsViewComponent<ItemsViewComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.items-view";
}
