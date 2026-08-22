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
    /// Gets whether the component's id was written by the author rather than generated for it.
    /// </summary>
    /// <remarks>
    /// A generated id is a process-wide counter and means nothing between two runs, so anything that has to
    /// name this component again later — client state kept across a navigation, a test reading the DOM — may
    /// only do so when this is <see langword="true"/>.
    /// </remarks>
    bool HasAuthoredId { get; }

    /// <summary>
    /// Gets the registered property key for <see cref="Visible"/>.
    /// </summary>
    static UIProperty VisibleProperty { get; } = new(nameof(Visible));

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
    /// Gets the registered property key for <see cref="LoadingPreview"/>.
    /// </summary>
    static UIProperty LoadingPreviewProperty { get; } = new(nameof(LoadingPreview));

    /// <summary>
    /// Gets whether the component is visible, optionally overridden per breakpoint (e.g. hidden below a
    /// given width).
    /// </summary>
    UIResponsive<bool>? Visible { get; }

    /// <summary>
    /// Gets whether the component is enabled.
    /// </summary>
    bool? Enabled { get; }

    /// <summary>
    /// Gets the theme mode forced on this component's subtree, or <see langword="null"/> to inherit
    /// the ambient theme.
    /// </summary>
    UIThemeMode? Theme { get; }

    /// <summary>
    /// Gets the horizontal alignment.
    /// </summary>
    UIAlignment? HorizontalAlignment { get; }

    /// <summary>
    /// Gets the vertical alignment.
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
    /// Gets whether the component is in loading state.
    /// </summary>
    bool? Loading { get; }

    /// <summary>
    /// Gets the loading placeholder variant.
    /// </summary>
    UISkeletonVariant? LoadingPreview { get; }

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
    /// Gets the component shown when this one is right-clicked, normally a <c>MenuComponent</c>.
    /// </summary>
    /// <remarks>
    /// Here rather than on a component of its own, so any component can carry one with a single setter and
    /// nothing has to be placed in the tree. Typed as a plain component rather than as a menu because the
    /// contract has no reason to care: it is a subtree the client shows at the pointer.
    /// <para>
    /// Inside an item template it compiles <em>once</em>, with the template, and is cloned per item like any
    /// other template content — so a per-row menu costs one compile and still opens against the row that was
    /// right-clicked.
    /// </para>
    /// <para>
    /// <b>A menu introduces an item scope of its own</b>, though: its entries are a collection, so
    /// <c>ArgCurrentItemKey</c> inside one resolves to the <em>entry</em>, not to the row. Reach the row with
    /// a <c>Parent</c>-scoped argument (<c>UIAction.ArgParent</c>) — which is what <c>docs/PROJECT.md</c> §4
    /// means by "the context one level up from the one this component belongs to".
    /// </para>
    /// </remarks>
    IVisualComponent? ContextMenu { get; }
}
