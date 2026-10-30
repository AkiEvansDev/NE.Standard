using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// One caption in a <see cref="TabsComponent"/>'s strip.
/// </summary>
/// <remarks>A component rather than a string, so a caption can carry a bindable <c>Visible</c>, an icon and a badge.</remarks>
[UIComponentPropertyDefault(nameof(IButtonComponent.Variant), nameof(DefaultVariant))]
public abstract partial class TabCaptionComponent<T>(string? id = null) : ButtonComponent<T>(id)
    where T : TabCaptionComponent<T>, IUIComponentDefinition
{
    private const UIButtonVariant DefaultVariant = UIButtonVariant.Ghost;

    /// <summary>
    /// Gets or sets the key of the page this caption selects.
    /// </summary>
    /// <remarks>Render-time only: authored once by <c>TabsComponent.AddTab</c> and never patched.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public string? TabKey { get; set; }
}

/// <summary>
/// One caption in a <see cref="TabsComponent"/>'s strip.
/// </summary>
public sealed class TabCaptionComponent(string? id = null) : TabCaptionComponent<TabCaptionComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.tab-caption";
}
