using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// An address the platform opens: a name — icon, title, badge — that navigates to a URL when activated.
/// </summary>
/// <remarks>Glyph and title default to <see cref="UIColorStyle.Default"/>, which renders as <c>inherit</c> and follows the link's colour.</remarks>
[UIComponentPropertyBlock(typeof(ITextBaseComponent))]
[UIComponentPropertyDefault(nameof(ITextBaseComponent.TitleType), nameof(DefaultTitleType))]
public abstract partial class LinkComponent<T> : VisualComponentBase<T>, ITextBaseComponent
    where T : LinkComponent<T>, IUIComponentDefinition
{
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Body;

    /// <summary>
    /// Gets or sets the address opened on activation, written verbatim into the anchor's <c>href</c>.
    /// </summary>
    [SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "The value is only ever written verbatim into an href attribute; a Uri type would require additional rendering/converter plumbing with no benefit here.")]
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Url { get; set; }

    /// <summary>
    /// Initializes the link at the start of its line, as text stands, centred on it.
    /// </summary>
    protected LinkComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Start;
        VerticalAlignment = UIAlignment.Center;
    }
}

/// <summary>
/// An address the platform opens: a name that navigates to a URL when activated.
/// </summary>
public sealed class LinkComponent(string? id = null) : LinkComponent<LinkComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.link";
}
