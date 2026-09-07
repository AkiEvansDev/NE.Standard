using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for single-region components with border/background/padding styling (Button, Card, Expander).
/// </summary>
[UIComponentPropertyBlock(typeof(ISurfaceComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(IOverflowComponent))]
public abstract partial class BorderedRegionComponentBase<TComponent>(string? id = null) : RegionContainerComponentBase<TComponent>(id), ISurfaceComponent, IBorderedComponent, IOverflowComponent
    where TComponent : BorderedRegionComponentBase<TComponent>, IUIComponentDefinition
{
    private static readonly UIThickness DefaultBorderThickness = UIThickness.Uniform(1);

    /// <summary>
    /// Gets or sets the border thickness; a bordered region draws an edge by default.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IBorderedComponent), DefaultValueMember = nameof(DefaultBorderThickness))]
    public UIThickness? BorderThickness { get; set; }

    /// <summary>
    /// Gets the content region.
    /// </summary>
    public virtual IVisualComponent? Content => GetRegionOrDefault(RegionNames.Content);

    /// <summary>
    /// Sets the content region.
    /// </summary>
    public virtual TComponent SetContent(IVisualComponent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        SetRegion(RegionNames.Content, content);
        return Self;
    }
}
