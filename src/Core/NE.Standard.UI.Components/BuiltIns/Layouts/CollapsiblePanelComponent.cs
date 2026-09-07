using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A panel that folds away toward one edge and back — a sidebar, a properties pane, a log at the bottom —
/// with a switch of its own. Collapsed, it shows nothing but the switch.
/// </summary>
/// <remarks>Place it in a track that can give the room back (<c>UIGridUnit.Auto</c>); in a fixed track the panel folds and the track does not.</remarks>
[UIComponentPropertyBlock(typeof(ISurfaceComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ICollapsibleComponent))]
public abstract partial class CollapsiblePanelComponent<T>(string? id = null) : RegionContainerComponentBase<T>(id), ISurfaceComponent, IBorderedComponent, ICollapsibleComponent
    where T : CollapsiblePanelComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets whether the panel draws its own switch; off means the panel is driven from the controller.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ICollapsibleComponent), IsBindable = false, GenerateBinder = false, DefaultValue = true)]
    public bool? ShowCollapseToggle { get; set; }

    /// <summary>
    /// Gets the content region.
    /// </summary>
    public virtual IVisualComponent? Content => GetRegionOrDefault(RegionNames.Content);

    /// <summary>
    /// Sets the content region.
    /// </summary>
    public virtual T SetContent(IVisualComponent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        SetRegion(RegionNames.Content, content);
        return Self;
    }
}

/// <summary>
/// A panel that folds away toward one edge and back, with a switch of its own.
/// </summary>
public sealed class CollapsiblePanelComponent(string? id = null) : CollapsiblePanelComponent<CollapsiblePanelComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.collapsible-panel";
}
