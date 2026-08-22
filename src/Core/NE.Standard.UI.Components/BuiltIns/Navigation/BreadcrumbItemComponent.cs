using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// One step of a <see cref="BreadcrumbsComponent"/>: the button's own content, a destination, and the mark
/// that separates it from the step before.
/// </summary>
/// <remarks>
/// A <see cref="ButtonComponent{T}"/> rendered as an anchor, for the same reason a menu entry is one — a step
/// usually navigates, and an anchor is what gives it a real URL to middle-click or copy. Its own component
/// rather than a reused menu entry: a step has no kind, no shortcut and no nested list, and it reads as text
/// with a rule under it rather than as a row with a surface.
/// </remarks>
public abstract partial class BreadcrumbItemComponent<T> : ButtonComponent<T>
    where T : BreadcrumbItemComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the destination this step leads back to.
    /// </summary>
    [SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "The value is only ever written verbatim into an href attribute; a Uri type would require additional rendering/converter plumbing with no benefit here.")]
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Url { get; set; }

    /// <summary>
    /// Initializes the step as untinted text that shrinks to its content.
    /// </summary>
    protected BreadcrumbItemComponent(string? id = null) : base(id)
    {
        Type = UIButtonType.Ghost;

        _ = ConfigureDefaultContent(content => _ = content.SetTextAlignment(UITextAlignment.Start));
    }
}

/// <summary>
/// One step of a <see cref="BreadcrumbsComponent"/>.
/// </summary>
public sealed class BreadcrumbItemComponent(string? id = null) : BreadcrumbItemComponent<BreadcrumbItemComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.breadcrumb.item";
}
