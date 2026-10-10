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
/// <remarks>Row choice is two-way through <c>SelectionMode</c>; <c>SelectionStyle</c> says what a chosen row looks like.</remarks>
[UIComponentPropertyBlock(typeof(IItemsHostComponent))]
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
[UIComponentPropertyBlock(typeof(ISelectableItemsComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
[UIComponentPropertyBlock(typeof(IEmptyStateComponent))]
[UIComponentPropertyBlock(typeof(IDragSourceComponent))]
public abstract partial class ItemsViewComponent<T> : GroupedItemsComponentBase<T, object, IVisualComponent>, IItemsHostComponent, IScrollableComponent, ISelectableItemsComponent, ISelectionStyleComponent, IRowHoverableComponent, IDraggableRowsComponent, IDragSourceComponent, IEmptyStateComponent, IItemClickComponent
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
    /// Drags a <c>Draggable</c> row only by a grip at <paramref name="placement"/> (<see cref="DragHandle"/>).
    /// </summary>
    public T SetDragHandle(UIDragHandlePlacement placement)
        => SetDragHandle(true).SetDragHandlePlacement(placement);

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
    /// Gets or sets whether a row whose item does not refuse it (<c>CanDrag</c>) can be dragged to another place among the rows, or
    /// moved one place by Alt+Up and Alt+Down; the move raises <c>move</c> (<see cref="OnItemMove"/>). Refused while a sort orders the
    /// rows, which would put the row back.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IDraggableRowsComponent), DefaultValue = false)]
    public bool? Draggable { get; set; }

    /// <summary>
    /// Gets or sets whether a <c>Draggable</c> row is dragged only by a grip drawn at its end or its start
    /// (<see cref="DragHandlePlacement"/>); the rest of the row keeps its text selection and its presses, and the keyboard still moves
    /// rows by Alt+Up and Alt+Down. A wrapped layout draws no grip, and its tiles drag whole.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IDraggableRowsComponent), DefaultValue = false)]
    public bool? DragHandle { get; set; }

    /// <summary>
    /// Gets or sets where a row's grip stands (<see cref="DragHandle"/>): at its end by default, or at its start.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IDraggableRowsComponent), DefaultValue = UIDragHandlePlacement.End)]
    public UIDragHandlePlacement? DragHandlePlacement { get; set; }

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
    /// Gets or sets the orientation used to arrange items.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Vertical)]
    public UIOrientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets the spacing between items, optionally overridden per breakpoint.
    /// </summary>
    /// <remarks>
    /// Unset, the stylesheet decides by the shape: none down a column or across a wrap, whose rows and tiles keep their own air, and a
    /// step between rows laid across, which would otherwise run their words together.
    /// </remarks>
    [UIComponentProperty]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>
    /// Gets or sets the room inside the view's scroll around its rows, optionally overridden per breakpoint: the rows scroll through it,
    /// so a list ending under something laid over its foot (a composer) shows its last row clear of it. A list held at its end stays there
    /// as the padding changes.
    /// </summary>
    /// <remarks>
    /// An overlay spanning the view's width stands over its scrollbar too, a strip that comes and goes with the rows' overflow.
    /// <c>VerticalScroll = UIScrollMode.Always</c> keeps the strip whether the rows overflow or not, so the overlay's margin can count
    /// it; a screen whose scrollbars float over the content (a touch screen) reserves none either way.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null)]
    public UIResponsive<UIThickness>? Padding { get; set; }

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
