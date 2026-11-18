using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>A grid container whose named panes the viewer can drag between slots by their header grips.</summary>
/// <remarks>
/// Dropping a pane onto another slot swaps their places; splitters resize slots, while panes marked to keep their size carry their own
/// tracks across adjacent runs (<see cref="UIPaneLayout.Arrange"/>). <see cref="Layout"/> holds the comma-separated pane order (two-way
/// bound to the controller, or stored locally under the container's authored id when unbound).
/// </remarks>
public abstract partial class PaneContainerComponent<T>(string? id = null) : ContainerComponent<T>(id), IRegionContainerComponent
    where T : PaneContainerComponent<T>, IUIComponentDefinition
{
    private readonly Dictionary<string, IVisualComponent> _panes = [with(StringComparer.Ordinal)];
    private readonly List<UIPanePlace> _places = [];

    /// <summary>
    /// Gets or sets the panes' names in the order of their places, joined by commas; unset, each pane at the place it was added at.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public string? Layout { get; set; }

    /// <summary>
    /// Gets the panes in the order they were added, each with the place it was added at.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public IReadOnlyList<UIPanePlace> Places => _places;

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _panes;

    /// <inheritdoc/>
    public bool HasRegions => _panes.Count > 0;

    /// <summary>
    /// Adds a pane, named for the layout, at the cells of a place of its own; the order panes are added in is the order of their places.
    /// </summary>
    /// <remarks>
    /// A name is letters, digits, <c>-</c> and <c>_</c>, as a layout separates names by commas. With <paramref name="keepsSize"/>,
    /// the pane keeps its size where it trades with a place lined up beside its own, with no splitter on that axis: a 280 px column
    /// moved to the other side of a wide one stays 280 px, the wide one taking what is left; elsewhere it takes the place's size.
    /// </remarks>
    public T AddPane(string name, UIResponsive<UIGridPlacement> place, IVisualComponent content, bool keepsSize = false)
    {
        ValidateName(name);
        ArgumentNullException.ThrowIfNull(content);

        if (ReferenceEquals(content, this))
            throw new InvalidOperationException("A component cannot be a pane of itself.");

        if (_panes.ContainsKey(name))
            throw new ArgumentException($"Pane container '{Id}' already has a pane named '{name}'.", nameof(name));

        ValidatePlace(place);

        _panes.Add(name, content);
        _places.Add(new UIPanePlace(name, place, keepsSize));
        return Self;
    }

    private static void ValidateName(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        foreach (var symbol in name)
        {
            if (!char.IsAsciiLetterOrDigit(symbol) && symbol is not ('-' or '_'))
                throw new ArgumentException($"A pane's name is letters, digits, '-' and '_'; '{name}' is not.", nameof(name));
        }
    }

    private static void ValidatePlace(UIResponsive<UIGridPlacement> place)
    {
        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
            place.Get(tier)?.Validate();
    }
}

/// <summary>
/// A container whose panes the viewer moves between their places.
/// </summary>
public sealed class PaneContainerComponent(string? id = null) : PaneContainerComponent<PaneContainerComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.pane-container";
}
