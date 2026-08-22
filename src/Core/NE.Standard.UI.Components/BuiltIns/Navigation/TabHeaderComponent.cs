using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// One caption in a <see cref="TabsComponent"/>'s strip.
/// </summary>
/// <remarks>
/// A component rather than a string on the tabs component, because a caption has to carry a bindable
/// <c>Visible</c> — hiding a page is hiding its header — as well as an icon and a badge. Being a
/// <see cref="ButtonComponent{T}"/> is what gives it all three plus the click, exactly as it does for
/// <c>ActionComponent</c> and <c>MenuItemComponent</c>.
/// </remarks>
public abstract partial class TabHeaderComponent<T> : ButtonComponent<T>
    where T : TabHeaderComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the key of the page this caption selects.
    /// </summary>
    /// <remarks>
    /// Render-time only: the key is what ties a caption to its page in the compiled graph, so it is authored
    /// once by <c>TabsComponent.AddTab</c> and never patched — a caption that changed which page it opens
    /// would be a different tab.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = null)]
    public string? TabKey { get; set; }

    /// <summary>
    /// Initializes the caption as an untinted, content-sized label — the strip's underline is what marks the
    /// current one, not a fill.
    /// </summary>
    protected TabHeaderComponent(string? id = null) : base(id)
    {
        Type = UIButtonType.Ghost;
    }
}

/// <summary>
/// One caption in a <see cref="TabsComponent"/>'s strip.
/// </summary>
public sealed class TabHeaderComponent(string? id = null) : TabHeaderComponent<TabHeaderComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.tab-header";
}
