using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A hyperlink combining an optional icon and text, navigating to a URL when activated.
/// </summary>
public abstract partial class LinkComponent<T> : VisualComponentBase<T>
    where T : LinkComponent<T>, IUIComponentDefinition
{
    private static readonly UITextAppearance DefaultTextType = UITextAppearance.Body;

    /// <summary>
    /// Gets or sets the icon name to render.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Icon { get; set; }

    /// <summary>
    /// Gets or sets the icon's color. Left unset the glyph follows the link's own color — which
    /// <see cref="TextColor"/> sets — so a recolored link never ends up with a mismatched icon; set this
    /// only to deliberately break that pairing.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIThemeColor? IconColor { get; set; }

    /// <summary>
    /// Gets or sets the icon's size.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIIconSize.Medium)]
    public UIIconSize? IconSize { get; set; }

    /// <summary>
    /// Gets or sets the link text.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Text { get; set; }

    /// <summary>
    /// Gets or sets the text style used to render <see cref="Text"/>.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultTextType))]
    public UITextAppearance? TextType { get; set; }

    /// <summary>
    /// Gets or sets the text color.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIThemeColor? TextColor { get; set; }

    /// <summary>
    /// Gets or sets the target URL.
    /// </summary>
    [SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "The value is only ever written verbatim into an href attribute; a Uri type would require additional rendering/converter plumbing with no benefit here.")]
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Url { get; set; }

    /// <summary>
    /// Initializes the link with a centered alignment.
    /// </summary>
    protected LinkComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Center;
        VerticalAlignment = UIAlignment.Center;
    }
}

/// <summary>
/// A hyperlink combining an optional icon and text, navigating to a URL when activated.
/// </summary>
public sealed class LinkComponent(string? id = null) : LinkComponent<LinkComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.link";
}
