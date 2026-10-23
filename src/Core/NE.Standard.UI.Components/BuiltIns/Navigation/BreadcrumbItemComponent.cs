using NE.Standard.UI.Authoring.BuiltIns;
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
/// A <see cref="ButtonComponent{T}"/> rendered as an anchor, so a step has a real URL to middle-click or copy; a step may carry an
/// address and a command both (<see cref="IEntryLinkComponent"/>).
/// </remarks>
[UIComponentPropertyBlock(typeof(ILinkableComponent))]
public abstract partial class BreadcrumbItemComponent<T> : ButtonComponent<T>, IEntryLinkComponent
    where T : BreadcrumbItemComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes the step as untinted text that shrinks to its content.
    /// </summary>
    protected BreadcrumbItemComponent(string? id = null) : base(id)
    {
        Type = UIButtonType.Ghost;

        TextAlignment = UITextAlignment.Start;
    }
}

/// <summary>
/// One step of a <see cref="BreadcrumbsComponent"/>.
/// </summary>
public sealed class BreadcrumbItemComponent(string? id = null) : BreadcrumbItemComponent<BreadcrumbItemComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.breadcrumb.item";
}
