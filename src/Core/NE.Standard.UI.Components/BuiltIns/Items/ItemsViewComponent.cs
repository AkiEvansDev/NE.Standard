using System;
using System.Linq.Expressions;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Items;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
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
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
public abstract partial class ItemsViewComponent<T> : GroupedItemsComponentBase<T, object, IVisualComponent>, IOrientationComponent, ISpacingComponent, IItemsHostComponent, IScrollableComponent, ISelectableItemsComponent, ISelectionStyleComponent, IRowHoverableComponent, IDraggableRowsComponent, IDragSourceComponent, IEmptyStateComponent, IItemClickComponent, IItemOpenComponent, IItemMoveComponent, IItemRemoveComponent, IAccessibleNameComponent
    where T : ItemsViewComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIItemsLayoutType> DefaultLayoutType = UIItemsLayoutType.Stack;

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
    /// Binds the view's items to a windowed source on the controller.
    /// </summary>
    /// <remarks>The path names the source; the compiler appends the property holding its realized window.</remarks>
    public T BindSource<TSource>(Expression<Func<TSource, object?>> path, UIBindingScope scope = UIBindingScope.Root)
    {
        HostMode = ItemsHostModes.Window(HostMode);

        return BindItems(RecursivePath.FromExpression(path), scope);
    }

    /// <summary>
    /// Writes a click registration on the item template, now and on every one set later.
    /// </summary>
    public void OnClickableItemTemplates(Action<IVisualComponent> register)
        => _ = OnItemTemplate(register);

    /// <summary>
    /// Writes an open registration on the item template — Enter on the keyboard's item, or a double click —, now and on every one set later.
    /// </summary>
    public void OnOpenableItemTemplates(Action<IVisualComponent> register)
        => _ = OnItemTemplate(register);

    /// <summary>
    /// Writes a move registration on the item template, now and on every one set later: a row dropped at another place among the rows
    /// by a drag with <c>Draggable</c> on, or Alt+Up and Alt+Down.
    /// </summary>
    /// <remarks>
    /// The row stands there at once; the controller's Move of it keeps it there or puts it where the controller did, and an answer
    /// without one puts it back. The index is where <c>RecursiveCollection.Move</c> puts it; in a windowed host, its place in the
    /// source's whole query.
    /// </remarks>
    public void OnMovableItemTemplates(Action<IVisualComponent> register)
        => _ = OnItemTemplate(register);

    /// <summary>
    /// Writes a remove registration on the item template — the Delete key on an item that may be removed —, now and on every one set later.
    /// </summary>
    public void OnRemovableItemTemplates(Action<IVisualComponent> register)
        => _ = OnItemTemplate(register);

    /// <summary>
    /// Gets or sets what a windowed view shows while it reads rows it does not have yet: grey bars in the rows' shape, the default,
    /// or a small ring at the edge the rows come in at, for rows unlike each other — a conversation's messages.
    /// </summary>
    /// <remarks>Decided at render: it is how the view draws the rows it stands for, not a state.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIItemsLoadingLook.Skeleton)]
    public UIItemsLoadingLook? LoadingLook { get; set; }

    /// <summary>
    /// Gets or sets the layout algorithm used to arrange items, optionally per breakpoint: a stack on a phone, a wrap of tiles wider up.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultLayoutType))]
    public UIResponsive<UIItemsLayoutType>? LayoutType { get; set; }

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
        SetDefaultTemplate(new DefaultTextTemplate(binds: true));
        SetDefaultEmptyTemplate(new DefaultEmptyTemplate());
        SetDefaultGroupTemplate(new DefaultGroupTemplate(binds: true));
    }

    /// <summary>
    /// Configures the built-in default text template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultTemplate(Action<DefaultTextTemplate> configure)
    {
        T result = Self.ConfigureTemplate(Template as DefaultTextTemplate, configure, "template");
        MarkTemplateAuthored();
        return result;
    }

    /// <summary>
    /// Configures the built-in default group template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultGroupTemplate(Action<DefaultGroupTemplate> configure)
    {
        T result = Self.ConfigureTemplate(GroupTemplate as DefaultGroupTemplate, configure, "template");
        MarkGroupTemplateAuthored();
        return result;
    }
}

/// <summary>
/// An items view that lays out a collection, held whole, virtualized or windowed from a source.
/// </summary>
public sealed class ItemsViewComponent(string? id = null) : ItemsViewComponent<ItemsViewComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.items-view";
}
