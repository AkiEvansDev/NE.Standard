using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// An address the platform opens: a name — icon, title, badge — that navigates to a URL when activated.
/// </summary>
/// <remarks>Glyph and title default to <see cref="UIColorStyle.Default"/>, which renders as <c>inherit</c> and follows the link's colour.</remarks>
[UIComponentPropertyDefault(nameof(IVisualComponent.HorizontalAlignment), nameof(DefaultHorizontalAlignment))]
[UIComponentPropertyDefault(nameof(IVisualComponent.VerticalAlignment), nameof(DefaultVerticalAlignment))]
[UIComponentPropertyBlock(typeof(ITextBaseComponent))]
[UIComponentPropertyDefault(nameof(ITextBaseComponent.TitleType), nameof(DefaultTitleType))]
[UIComponentPropertyBlock(typeof(ILinkableComponent))]
public abstract partial class LinkComponent<T>(string? id = null) : VisualComponentBase<T>(id), ITextBaseComponent, ILinkableComponent
    where T : LinkComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIAlignment> DefaultHorizontalAlignment = UIAlignment.Start;
    private static readonly UIResponsive<UIAlignment> DefaultVerticalAlignment = UIAlignment.Center;
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Body;
}

/// <summary>
/// An address the platform opens: a name that navigates to a URL when activated.
/// </summary>
public sealed class LinkComponent(string? id = null) : LinkComponent<LinkComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.link";
}
