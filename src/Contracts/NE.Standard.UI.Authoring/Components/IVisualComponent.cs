using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents the base contract for visual UI components.
/// </summary>
public interface IVisualComponent : IBindableComponent
{
    /// <summary>
    /// Gets whether the component's id was written by the author rather than generated for it; only an
    /// authored id can be used to find this component again later, such as across a navigation or in a test.
    /// </summary>
    bool HasAuthoredId { get; }

    /// <summary>
    /// Gets the registered property key for <see cref="Visibility"/>.
    /// </summary>
    static UIProperty VisibilityProperty { get; } = new(nameof(Visibility));

    /// <summary>
    /// Gets the registered property key for <see cref="Enabled"/>.
    /// </summary>
    static UIProperty EnabledProperty { get; } = new(nameof(Enabled));

    /// <summary>
    /// Gets the registered property key for <see cref="Theme"/>.
    /// </summary>
    static UIProperty ThemeProperty { get; } = new(nameof(Theme));

    /// <summary>
    /// Gets the registered property key for <see cref="HorizontalAlignment"/>.
    /// </summary>
    static UIProperty HorizontalAlignmentProperty { get; } = new(nameof(HorizontalAlignment));

    /// <summary>
    /// Gets the registered property key for <see cref="VerticalAlignment"/>.
    /// </summary>
    static UIProperty VerticalAlignmentProperty { get; } = new(nameof(VerticalAlignment));

    /// <summary>
    /// Gets the registered property key for <see cref="Width"/>.
    /// </summary>
    static UIProperty WidthProperty { get; } = new(nameof(Width));

    /// <summary>
    /// Gets the registered property key for <see cref="MinWidth"/>.
    /// </summary>
    static UIProperty MinWidthProperty { get; } = new(nameof(MinWidth));

    /// <summary>
    /// Gets the registered property key for <see cref="MaxWidth"/>.
    /// </summary>
    static UIProperty MaxWidthProperty { get; } = new(nameof(MaxWidth));

    /// <summary>
    /// Gets the registered property key for <see cref="Height"/>.
    /// </summary>
    static UIProperty HeightProperty { get; } = new(nameof(Height));

    /// <summary>
    /// Gets the registered property key for <see cref="MinHeight"/>.
    /// </summary>
    static UIProperty MinHeightProperty { get; } = new(nameof(MinHeight));

    /// <summary>
    /// Gets the registered property key for <see cref="MaxHeight"/>.
    /// </summary>
    static UIProperty MaxHeightProperty { get; } = new(nameof(MaxHeight));

    /// <summary>
    /// Gets the registered property key for <see cref="ZIndex"/>.
    /// </summary>
    static UIProperty ZIndexProperty { get; } = new(nameof(ZIndex));

    /// <summary>
    /// Gets the registered property key for <see cref="Margin"/>.
    /// </summary>
    static UIProperty MarginProperty { get; } = new(nameof(Margin));

    /// <summary>
    /// Gets the registered property key for <see cref="Placement"/>.
    /// </summary>
    static UIProperty PlacementProperty { get; } = new(nameof(Placement));

    /// <summary>
    /// Gets the registered property key for <see cref="Loading"/>.
    /// </summary>
    static UIProperty LoadingProperty { get; } = new(nameof(Loading));

    /// <summary>
    /// Gets what the component does with the room it was given, optionally overridden per breakpoint (e.g.
    /// collapsed from a given width up).
    /// </summary>
    UIResponsive<UIVisibility>? Visibility { get; }

    /// <summary>
    /// Gets whether the component responds to input; false dims it and marks it, and its subtree, inert.
    /// </summary>
    bool? Enabled { get; }

    /// <summary>
    /// Gets the theme mode forced on this component's subtree, or <see langword="null"/> to inherit
    /// the ambient theme.
    /// </summary>
    UIThemeMode? Theme { get; }

    /// <summary>
    /// Gets where the component sits within its grid cell along the horizontal axis.
    /// </summary>
    UIAlignment? HorizontalAlignment { get; }

    /// <summary>
    /// Gets where the component sits within its grid cell along the vertical axis.
    /// </summary>
    UIAlignment? VerticalAlignment { get; }

    /// <summary>
    /// Gets the component width, optionally overridden per breakpoint.
    /// </summary>
    UIResponsive<UILayoutLength>? Width { get; }

    /// <summary>
    /// Gets the component minimum width, optionally overridden per breakpoint.
    /// </summary>
    UIResponsive<UILayoutLength>? MinWidth { get; }

    /// <summary>
    /// Gets the component maximum width, optionally overridden per breakpoint.
    /// </summary>
    UIResponsive<UILayoutLength>? MaxWidth { get; }

    /// <summary>
    /// Gets the component height, optionally overridden per breakpoint.
    /// </summary>
    UIResponsive<UILayoutLength>? Height { get; }

    /// <summary>
    /// Gets the component minimum height, optionally overridden per breakpoint.
    /// </summary>
    UIResponsive<UILayoutLength>? MinHeight { get; }

    /// <summary>
    /// Gets the component maximum height, optionally overridden per breakpoint.
    /// </summary>
    UIResponsive<UILayoutLength>? MaxHeight { get; }

    /// <summary>
    /// Gets the stacking order within the visual tree.
    /// </summary>
    int? ZIndex { get; }

    /// <summary>
    /// Gets the outer spacing around the component, optionally overridden per breakpoint.
    /// </summary>
    UIResponsive<UIThickness>? Margin { get; }

    /// <summary>
    /// Gets the grid placement, optionally overridden per breakpoint.
    /// </summary>
    UIResponsive<UIGridPlacement>? Placement { get; }

    /// <summary>
    /// Gets whether the component is in loading state — a live state a controller turns on and off.
    /// </summary>
    bool? Loading { get; }

    /// <summary>
    /// Gets the property bindings declared on the component.
    /// </summary>
    IReadOnlyList<UIBinding> Bindings { get; }

    /// <summary>
    /// Gets the client-side interactions declared on the component.
    /// </summary>
    IReadOnlyList<UIInteraction> Interactions { get; }

    /// <summary>
    /// Gets the event handlers declared on the component.
    /// </summary>
    IReadOnlyList<UIEvent> Events { get; }

    /// <summary>
    /// Registers a command for one of the component's events, with UI action arguments.
    /// </summary>
    IVisualComponent On(string eventName, string command, params KeyValuePair<string, UIActionArgument>[] arguments);

    /// <summary>
    /// Gets the component shown when this one is right-clicked, normally a <c>MenuComponent</c>.
    /// </summary>
    /// <remarks>
    /// Inside an item template, the menu's own entries introduce a new item scope: <c>ArgCurrentItemKey</c>
    /// inside one resolves to the entry, not the row — reach the row with a <c>Parent</c>-scoped argument.
    /// </remarks>
    IVisualComponent? ContextMenu { get; }

    /// <summary>
    /// Gets the registered property key for <see cref="ShowContextMenu"/>.
    /// </summary>
    static UIProperty ShowContextMenuProperty { get; } = new(nameof(ShowContextMenu));

    /// <summary>
    /// Gets whether a right-click opens the <see cref="ContextMenu"/>; on a host with rows, whether it opens any row's. Off, the menu
    /// stays in the tree and nothing opens it.
    /// </summary>
    bool? ShowContextMenu { get; }
}
