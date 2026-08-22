using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// A non-virtualized items view that lays out its bound items, supporting grouping, scrolling and configurable orientation/spacing.
/// </summary>
public abstract partial class ItemsViewComponent<T> : GroupedItemsComponentBase<T, object>, ISourceItemsComponent, IVirtualizedItemsComponent
    where T : ItemsViewComponent<T>, IUIComponentDefinition
{
    private const int DefaultWindowSize = 50;

    private static readonly UIResponsive<double> DefaultSpacing = 0d;

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ISourceItemsComponent), DefaultValue = false, GenerateSetter = false, GenerateBinder = false, IsBindable = false)]
    public bool IsWindowed { get; private set; }

    /// <summary>
    /// Gets or sets how many items one window holds. Not bindable: the client reads it once, when it works out
    /// what to ask for.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ISourceItemsComponent), DefaultValue = DefaultWindowSize, GenerateBinder = false, IsBindable = false)]
    public int WindowSize { get; set; } = DefaultWindowSize;

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ISourceItemsComponent), DefaultValue = null, GenerateSetter = false, GenerateBinder = false)]
    public int? WindowOffset { get; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ISourceItemsComponent), DefaultValue = null, GenerateSetter = false, GenerateBinder = false)]
    public int? WindowTotalCount { get; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ISourceItemsComponent), DefaultValue = false, GenerateSetter = false, GenerateBinder = false)]
    public bool WindowHasMoreBefore { get; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ISourceItemsComponent), DefaultValue = false, GenerateSetter = false, GenerateBinder = false)]
    public bool WindowHasMoreAfter { get; }

    /// <summary>
    /// Gets or sets whether only the rows in view are laid out. For a collection the client already holds
    /// whole — a windowed source needs no flag, it is windowed by construction.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IVirtualizedItemsComponent), DefaultValue = false)]
    public bool? Virtualize { get; set; }

    /// <summary>
    /// Lays out only the rows in view.
    /// </summary>
    public T Virtualized()
    {
        Virtualize = true;
        return Self;
    }

    /// <summary>
    /// Binds the view's items to a windowed source on the controller, which is what makes a collection too
    /// large to send whole renderable — a chat, a long log, a grid over a million rows.
    /// </summary>
    /// <remarks>
    /// The path names the <em>source</em>; the compiler appends the property holding its realized window, so
    /// an author never writes it and the two cannot drift apart.
    /// </remarks>
    public T BindSource(string path, UIBindingScope scope = UIBindingScope.Root)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);

        IsWindowed = true;

        return BindItems(path, scope);
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
    /// Gets or sets the horizontal scroll behavior.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIScrollMode.Disabled)]
    public UIScrollMode? HorizontalScroll { get; set; }

    /// <summary>
    /// Gets or sets the vertical scroll behavior.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIScrollMode.Auto)]
    public UIScrollMode? VerticalScroll { get; set; }

    /// <summary>
    /// Gets or sets the scroll snap behavior.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIScrollSnapMode.Disabled)]
    public UIScrollSnapMode? ScrollSnap { get; set; }

    /// <summary>
    /// Gets or sets how the items host reacts when its content grows.
    /// </summary>
    /// <remarks>
    /// The items host is the element that scrolls, so a chat pinned to its newest message says so here rather
    /// than through a <c>ScrollContainerComponent</c> wrapped around it — which cannot work for a windowed
    /// host, since the scrolling element is the host itself.
    /// </remarks>
    [UIComponentProperty(DefaultValue = UIScrollAnchor.None)]
    public UIScrollAnchor? ScrollAnchor { get; set; }

    /// <summary>
    /// Follows content appended at the end while the viewer is already at the end.
    /// </summary>
    public T AnchorToEnd()
    {
        ScrollAnchor = UIScrollAnchor.End;
        return Self;
    }

    /// <summary>
    /// Gets the template used to render each item.
    /// </summary>
    public virtual IVisualComponent? ItemTemplate => Template;

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
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (Template is not DefaultTextTemplate template)
            throw new InvalidOperationException($"Only {nameof(DefaultTextTemplate)} template is supported.");

        configure(template);
        return Self;
    }

    /// <summary>
    /// Configures the built-in default empty template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultEmptyTemplate(Action<DefaultEmptyTemplate> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (EmptyTemplate is not DefaultEmptyTemplate template)
            throw new InvalidOperationException($"Only {nameof(DefaultEmptyTemplate)} template is supported.");

        configure(template);
        return Self;
    }

    /// <summary>
    /// Configures the built-in default group template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultGroupTemplate(Action<DefaultGroupTemplate> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (GroupTemplate is not DefaultGroupTemplate template)
            throw new InvalidOperationException($"Only {nameof(DefaultGroupTemplate)} template is supported.");

        configure(template);
        return Self;
    }

    /// <summary>
    /// Sets the template used to render each item.
    /// </summary>
    public virtual T SetItemTemplate(IVisualComponent visualTemplate)
        => SetTemplate(visualTemplate);

    /// <summary>
    /// Disables both horizontal and vertical scrolling.
    /// </summary>
    public T DisableScroll()
        => SetScroll(UIScrollMode.Disabled, UIScrollMode.Disabled);

    /// <summary>
    /// Enables vertical scrolling only.
    /// </summary>
    public T VerticalScrollOnly()
        => SetScroll(UIScrollMode.Disabled, UIScrollMode.Auto);

    /// <summary>
    /// Enables horizontal scrolling only.
    /// </summary>
    public T HorizontalScrollOnly()
        => SetScroll(UIScrollMode.Auto, UIScrollMode.Disabled);

    /// <summary>
    /// Enables both horizontal and vertical scrolling.
    /// </summary>
    public T BothScroll()
        => SetScroll(UIScrollMode.Auto, UIScrollMode.Auto);

    /// <summary>
    /// Sets the horizontal and vertical scroll behaviors.
    /// </summary>
    public T SetScroll(UIScrollMode horizontalScroll, UIScrollMode verticalScroll)
    {
        HorizontalScroll = horizontalScroll;
        VerticalScroll = verticalScroll;
        return Self;
    }
}

/// <summary>
/// A non-virtualized items view that lays out its bound items, supporting grouping, scrolling and configurable orientation/spacing.
/// </summary>
public sealed class ItemsViewComponent(string? id = null) : ItemsViewComponent<ItemsViewComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.items-view";
}
