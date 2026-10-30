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
    /// <remarks>The header renders into a native <c>summary</c>, which swallows clicks: nothing interactive works there.</remarks>
    public virtual IVisualComponent? Header => GetRegionOrDefault(RegionNames.Header);

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
}

/// <summary>
/// A collapsible bordered region with a header that toggles the visibility of its content.
/// </summary>
public sealed class ExpanderComponent(string? id = null) : ExpanderComponent<ExpanderComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.expander";
}
