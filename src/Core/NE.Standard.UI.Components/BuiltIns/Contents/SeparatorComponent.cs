using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A thin dividing line, optionally with a centered label, used to separate content groups.
/// </summary>
[UIComponentPropertyBlock(typeof(IOrientationComponent))]
[UIComponentPropertyDefault(nameof(IOrientationComponent.Orientation), nameof(DefaultOrientation))]
public abstract partial class SeparatorComponent<T>(string? id = null) : VisualComponentBase<T>(id), IOrientationComponent
    where T : SeparatorComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIOrientation> DefaultOrientation = UIOrientation.Horizontal;

    /// <summary>
    /// Gets or sets the label text shown on the separator.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public UIPhrase? Label { get; set; }

    /// <summary>
    /// Gets or sets the line's colour; unset leaves the stylesheet's own line colour.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIThemeColor? Color { get; set; }
}

/// <summary>
/// A thin dividing line, optionally with a centered label, used to separate content groups.
/// </summary>
public sealed class SeparatorComponent(string? id = null) : SeparatorComponent<SeparatorComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.separator";
}
