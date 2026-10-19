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
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// An items view that lays out a collection, held whole, virtualized or windowed from a source, with grouping, scrolling and
/// configurable orientation/spacing.
/// </summary>
/// <remarks>
/// Row choice is two-way through <c>SelectionMode</c>; <c>SelectionStyle</c> says what a chosen row looks like. Unset, <c>Spacing</c> is
/// the stylesheet's by the shape: none down a column or across a wrap, whose rows and tiles keep their own air, and a step between
/// rows laid across, which would otherwise run their words together.
/// </remarks>
[UIComponentPropertyBlock(typeof(IOrientationComponent))]
[UIComponentPropertyBlock(typeof(ISpacingComponent))]
[UIComponentPropertyBlock(typeof(IItemsHostComponent))]
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
[UIComponentPropertyBlock(typeof(ISelectableItemsComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
[UIComponentPropertyBlock(typeof(IEmptyStateComponent))]
[UIComponentPropertyBlock(typeof(IDraggableRowsComponent))]
[UIComponentPropertyBlock(typeof(IDragSourceComponent))]
public abstract partial class ItemsViewComponent<T> : GroupedItemsComponentBase<T, object, IVisualComponent>, IOrientationComponent, ISpacingComponent, IItemsHostComponent, IScrollableComponent, ISelectableItemsComponent, ISelectionStyleComponent, IRowHoverableComponent, IDraggableRowsComponent, IDragSourceComponent, IEmptyStateComponent, IItemClickComponent
    where T : ItemsViewComponent<T>, IUIComponentDefinition
{
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
    /// Writes a click registration on the item template, now and on every one set later.
    /// </summary>
    public void OnClickableItemTemplates(Action<IVisualComponent> register)
        => _ = OnItemTemplate(register);

    /// <summary>
    /// Registers a command invoked when an item is opened — Enter on the keyboard's item, or a double click — with the item's key.
    /// </summary>
    public T OnItemOpenWithItemKey(string command, string argumentName = "id")
        => OnItemOpen(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when an item is opened — Enter on the keyboard's item, or a double click.
    /// </summary>
    public T OnItemOpen(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnItemTemplate(template => _ = template.On(EventNames.Open, command, arguments));

    /// <summary>
    /// Registers a command invoked when an item is opened, with literal argument values.
    /// </summary>
    public T OnItemOpenLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnItemOpen(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Registers the command a row dropped at another place among the rows raises — by a drag with <c>Draggable</c> on, or Alt+Up and
    /// Alt+Down — with the item's key and the index it now takes in the collection. The row stands there at once; the controller's
    /// Move of it keeps it there or puts it where the controller did, and an answer without one puts it back.
    /// </summary>
    /// <remarks>
    /// The index is where <c>RecursiveCollection.Move</c> puts it; in a windowed host, its place in the source's whole query.
    /// </remarks>
    public T OnItemMoveWithItemKey(string command, string keyArgumentName = "id", string indexArgumentName = "index")
        => OnItemMove(command, UIAction.ArgCurrentItemKey(keyArgumentName), UIAction.ArgEventValue(indexArgumentName));

    /// <summary>
    /// Registers the command a row dropped at another place raises; <c>UIAction.ArgEventValue</c> reads the index it takes.
    /// </summary>
    public T OnItemMove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnItemTemplate(template => _ = template.On(EventNames.Move, command, arguments));

    /// <summary>
    /// Registers the command a row dropped at another place raises, with literal argument values.
    /// </summary>
    public T OnItemMoveLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnItemMove(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Registers a command invoked when the Delete key is pressed on an item that may be removed, with the item's key.
    /// </summary>
    public T OnItemRemoveWithItemKey(string command, string argumentName = "id")
        => OnItemRemove(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when the Delete key is pressed on an item that may be removed; the controller removes it or leaves it.
    /// </summary>
    public T OnItemRemove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnItemTemplate(template => _ = template.On(EventNames.Remove, command, arguments));

    /// <summary>
    /// Registers a command invoked when the Delete key is pressed on an item that may be removed, with literal argument values.
    /// </summary>
    public T OnItemRemoveLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnItemRemove(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Gets or sets what a windowed view shows while it reads rows it does not have yet: grey bars in the rows' shape, the default,
    /// or a small ring at the edge the rows come in at, for rows unlike each other — a conversation's messages.
    /// </summary>
    /// <remarks>Decided at render: it is how the view draws the rows it stands for, not a state.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIItemsLoadingLook.Skeleton)]
    public UIItemsLoadingLook? LoadingLook { get; set; }

    /// <summary>
    /// Gets or sets the layout algorithm used to arrange items.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIItemsLayoutType.Stack)]
    public UIItemsLayoutType? LayoutType { get; set; }

    /// <summary>
    /// Gets or sets the room inside the view's scroll around its rows, optionally overridden per breakpoint: the rows scroll through it,
    /// so a list ending under something laid over its foot (a composer) shows its last row clear of it. A list held at its end stays there
    /// as the padding changes.
    /// </summary>
    /// <remarks>
    /// On the side the bar is drawn it is at least the overlay bar's room (<c>--ui-scrollbar-room</c>), whether the rows overflow or not,
    /// so a padding of 12 or more holds the thumb and a smaller one is widened; the classic bar's own strip stands past it while they
    /// do. A screen where nothing hovers (a touch screen) keeps none.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null)]
    public UIResponsive<UIThickness>? Padding { get; set; }

    /// <summary>
    /// Gets or sets the widest the rows' column stands inside the view, optionally overridden per breakpoint: wider, the column is
    /// centred and the view's own width stays the scroll's, so its bar stands at the region's edge rather than beside the words — a
    /// conversation's or a document's column in a wide pane. Unset, the rows take the view's width.
    /// </summary>
    [UIComponentProperty]
    public UIResponsive<double>? ContentMaxWidth { get; set; }

    /// <summary>
    /// Gets the key of the row at the top of the view where the reader stands: the first row whose box shows below the scroll's top edge,
    /// past the view's <see cref="Padding"/> and a group header held over it. Written by the page once the reader's scroll settles, once
    /// after the first layout, and again as the rows under the top change; follow it in the bound property's setter.
    /// </summary>
    /// <remarks>
    /// Bound one way, from the page: a value the controller sets scrolls nothing and is not sent. Unbound, the page reports nothing.
    /// A windowed view reports a row of the window it holds; while only rows still on their way stand in view, it reports nothing.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false, BindingCapabilities = UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.OneWayToSource)]
    public string? FirstVisibleKey { get; set; }

    /// <summary>
    /// Gets the key of the row at the foot of the view where the reader stands: the last row whose box shows above the scroll's bottom
    /// edge, past the view's <see cref="Padding"/> (room a composer laid over the list's foot stands in). Written as
    /// <see cref="FirstVisibleKey"/> is: once the reader's scroll settles, once after the first layout, and again as the rows change.
    /// </summary>
    /// <remarks>
    /// Bound one way, from the page: a value the controller sets scrolls nothing and is not sent. Unbound, the page reports nothing.
    /// A windowed view reports a row of the window it holds; while only rows still on their way stand in view, it reports nothing.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false, BindingCapabilities = UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.OneWayToSource)]
    public string? LastVisibleKey { get; set; }

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
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.items-view";
}
