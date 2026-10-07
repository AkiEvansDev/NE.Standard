using System;
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
