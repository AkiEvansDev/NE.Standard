using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A <see cref="SurfaceComponent{T}"/> with bands on it: an optional header — which may carry a control of
/// its own at its far edge — and an optional footer. The fill, the edge and the click are the surface's.
/// </summary>
/// <remarks>No header region until one is asked for, or the card draws an empty band above its content.</remarks>
public abstract partial class CardComponent<T>(string? id = null) : SurfaceComponent<T>(id)
    where T : CardComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the header region.
    /// </summary>
    public virtual IVisualComponent? Header => GetRegionOrDefault(RegionNames.Header);

    /// <summary>
    /// Gets the control the header carries at its far edge; with none, nothing reserves room for one.
    /// </summary>
    public virtual IVisualComponent? HeaderAction => GetRegionOrDefault(RegionNames.HeaderAction);

    /// <summary>
    /// Gets the footer region.
    /// </summary>
    public virtual IVisualComponent? Footer => GetRegionOrDefault(RegionNames.Footer);

    /// <summary>
    /// Configures the built-in default header region, creating it on first use.
    /// </summary>
    public T ConfigureDefaultHeader(Action<CardHeaderRegion> configure)
    {
        if (Header is null)
            SetRegion(RegionNames.Header, new CardHeaderRegion());

        ArgumentNullException.ThrowIfNull(configure);

        if (Header is not CardHeaderRegion header)
            throw new InvalidOperationException($"Only {nameof(CardHeaderRegion)} header is supported.");

        configure(header);
        return Self;
    }

    /// <summary>
    /// Sets the control the header carries at its far edge.
    /// </summary>
    public virtual T SetHeaderAction(IVisualComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);

        SetRegion(RegionNames.HeaderAction, action);
        return Self;
    }

    /// <summary>
    /// Sets the footer region.
    /// </summary>
    public virtual T SetFooter(IVisualComponent footer)
    {
        SetRegion(RegionNames.Footer, footer);
        return Self;
    }
}

/// <summary>
/// A bordered surface with an optional header and footer region, optionally clickable as a whole.
/// </summary>
public sealed class CardComponent(string? id = null) : CardComponent<CardComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.card";
}
