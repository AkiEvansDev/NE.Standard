using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A visual component that renders a bitmap image from a source URL.
/// </summary>
[UIComponentPropertyBlock(typeof(ITooltipComponent))]
public abstract partial class ImageComponent<T> : VisualComponentBase<T>, ITooltipComponent
    where T : ImageComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the picture's source — a URL or a data URI.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Source { get; set; }

    /// <summary>
    /// Gets or sets the source URL used when <see cref="Source"/> fails to load.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = null)]
    public string? FallbackSource { get; set; }

    /// <summary>
    /// Gets or sets the alternate text describing the image.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? AltText { get; set; }

    /// <summary>
    /// Gets or sets how the image content is fit within its bounds.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIImageFit? Fit { get; set; }

    /// <summary>
    /// Gets or sets the corner radius applied to the image.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UICornerRadius? CornerRadius { get; set; }

    /// <summary>
    /// Initializes the image with a centered alignment.
    /// </summary>
    protected ImageComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Center;
        VerticalAlignment = UIAlignment.Center;
    }
}

/// <summary>
/// A visual component that renders a bitmap image from a source URL.
/// </summary>
public sealed class ImageComponent(string? id = null) : ImageComponent<ImageComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.image";
}
