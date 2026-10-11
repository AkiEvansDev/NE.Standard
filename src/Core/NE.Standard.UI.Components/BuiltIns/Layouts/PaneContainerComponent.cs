using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A container whose panes the viewer moves between their places by a grip at each pane's top: a pane dropped on another's place
/// trades places with it. The places are the cells the panes were added at; a splitter between them sizes the places, not the panes.
/// </summary>
/// <remarks>
/// <see cref="Layout"/> names the panes in the order of their places, as <c>chat,tasks,tree</c>. Bound, it comes back from the page
/// for the application to keep per viewer, and a value the controller sets moves the panes; unbound, the browser keeps it under the
/// container's authored id. A pane the value leaves out or does not know takes the first place left, in the order the panes were
/// added. Columns, rows, spacing and splitters are a container's own.
/// </remarks>
public abstract partial class PaneContainerComponent<T>(string? id = null) : ContainerComponent<T>(id), IRegionContainerComponent
    where T : PaneContainerComponent<T>, IUIComponentDefinition
{
    private readonly Dictionary<string, IVisualComponent> _panes = new(StringComparer.Ordinal);
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
    /// <remarks>A name is letters, digits, <c>-</c> and <c>_</c>, as a layout separates names by commas.</remarks>
    public T AddPane(string name, UIResponsive<UIGridPlacement> place, IVisualComponent content)
    {
        ValidateName(name);
        ArgumentNullException.ThrowIfNull(content);

        if (ReferenceEquals(content, this))
            throw new InvalidOperationException("A component cannot be a pane of itself.");

        if (_panes.ContainsKey(name))
            throw new ArgumentException($"Pane container '{Id}' already has a pane named '{name}'.", nameof(name));

        ValidatePlace(place);

        _panes.Add(name, content);
        _places.Add(new UIPanePlace(name, place));
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
