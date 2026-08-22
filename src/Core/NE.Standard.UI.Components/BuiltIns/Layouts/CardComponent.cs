using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A bordered content surface with an optional header and footer region, optionally clickable as a whole.
/// </summary>
public abstract partial class CardComponent<T> : BorderedRegionComponentBase<T>
    where T : CardComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the header region.
    /// </summary>
    public virtual ITextComponent? Header => GetRegionOrDefault(RegionNames.Header) as ITextComponent;

    /// <summary>
    /// Gets the footer region.
    /// </summary>
    public virtual IVisualComponent? Footer => GetRegionOrDefault(RegionNames.Footer);

    /// <summary>
    /// Whether the whole card is an actionable surface: renders with a pointer cursor, a hover/active
    /// affordance, and — when <see langword="false"/> — blocks the card (and any content/footer children)
    /// from receiving pointer input at all, so <see cref="OnClick(string)"/> never fires.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Clickable { get; set; }

    /// <summary>
    /// Initializes a new card with the built-in header region.
    /// </summary>
    protected CardComponent(string? id = null) : base(id)
    {
        SetRegion(RegionNames.Header, new CardHeaderRegion());
    }

    /// <summary>
    /// Configures the built-in default header region, throwing if a different header has been set.
    /// </summary>
    public T ConfigureDefaultHeader(Action<CardHeaderRegion> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (Header is not CardHeaderRegion header)
            throw new InvalidOperationException($"Only {nameof(CardHeaderRegion)} header is supported.");

        configure(header);
        return Self;
    }

    /// <summary>
    /// Sets the header region.
    /// </summary>
    public virtual T SetHeader(ITextComponent header)
    {
        SetRegion(RegionNames.Header, header);
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

    /// <summary>
    /// Registers a command to invoke when the card is clicked.
    /// </summary>
    public T OnClick(string command)
        => On(EventNames.Click, command);
    /// <summary>
    /// Registers a command with bound arguments to invoke when the card is clicked.
    /// </summary>
    public T OnClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Click, command, arguments);
    /// <summary>
    /// Registers a command with literal arguments to invoke when the card is clicked.
    /// </summary>
    public T OnClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Click, command, arguments);
}

/// <summary>
/// A bordered content surface with an optional header and footer region, optionally clickable as a whole.
/// </summary>
public sealed class CardComponent(string? id = null) : CardComponent<CardComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.card";
}
