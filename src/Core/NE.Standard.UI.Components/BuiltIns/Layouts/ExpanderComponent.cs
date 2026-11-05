using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A collapsible bordered region with a header that toggles the visibility of its content.
/// </summary>
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
public abstract partial class ExpanderComponent<T> : BorderedRegionComponentBase<T>, ISurfaceStyleComponent, IPressablePartsComponent, IExpandableComponent
    where T : ExpanderComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Whether the section is open; two-way, so clicking the summary syncs back.
    /// </summary>
    [UIComponentProperty(DefaultValue = true, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public bool? Expanded { get; set; }

    /// <summary>
    /// Whether the trailing disclosure chevron is drawn.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowChevron { get; set; }

    /// <summary>
    /// How the expander is drawn: a bordered card, or a quiet fold of a line of muted words for a quiet part of a page.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIExpanderVariant.Card)]
    public UIExpanderVariant? Variant { get; set; }

    /// <summary>
    /// Gets the header region — any visual component, not only the built-in text one.
    /// </summary>
    /// <remarks>The header renders into a native <c>summary</c>, which swallows clicks: interactive controls belong in <see cref="HeaderAction"/>.</remarks>
    public virtual IVisualComponent? Header => GetRegionOrDefault(RegionNames.Header);

    /// <summary>
    /// Gets the control the header row carries at its far edge while expanded; with none, nothing reserves room for one.
    /// </summary>
    public virtual IVisualComponent? HeaderAction => GetRegionOrDefault(RegionNames.HeaderAction);

    /// <summary>
    /// Initializes a new expander with the built-in header region.
    /// </summary>
    protected ExpanderComponent(string? id = null) : base(id)
    {
        SetRegion(RegionNames.Header, new ExpanderHeaderRegion());
    }

    /// <summary>
    /// Configures the built-in default header region, throwing if a different header has been set.
    /// </summary>
    public T ConfigureDefaultHeader(Action<ExpanderHeaderRegion> configure)
        => Self.ConfigureTemplate(Header as ExpanderHeaderRegion, configure, "header");

    /// <summary>
    /// Sets the control the header row carries at its far edge while expanded, outside the <c>summary</c> so interactive controls do not toggle the fold.
    /// </summary>
    public virtual T SetHeaderAction(IVisualComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);

        SetRegion(RegionNames.HeaderAction, action);
        return Self;
    }

    /// <summary>
    /// Sets the controls the header row carries at its far edge while expanded (one as it is, more in a horizontal row 4 px apart).
    /// </summary>
    public virtual T SetHeaderActions(params IVisualComponent[] actions)
    {
        ArgumentNullException.ThrowIfNull(actions);

        if (actions.Length == 0)
            return Self;

        foreach (IVisualComponent action in actions)
            ArgumentNullException.ThrowIfNull(action);

        return SetHeaderAction(actions.Length == 1 ? actions[0] : new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(4)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChildren(actions)
        );
    }
}

/// <summary>
/// A collapsible bordered region with a header that toggles the visibility of its content.
/// </summary>
public sealed class ExpanderComponent(string? id = null) : ExpanderComponent<ExpanderComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.expander";
}
