using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A full-width row that invokes a command: the button's own content on the left, a trailing chevron — and
/// optionally a value in front of it — on the right.
/// </summary>
public abstract partial class ActionComponent<T> : ButtonComponent<T>
    where T : ActionComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the text shown in front of the trailing chevron.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? TrailingText { get; set; }

    /// <summary>
    /// Gets or sets the icon replacing the trailing chevron; unset draws the chevron itself.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? TrailingIcon { get; set; }

    /// <summary>
    /// Whether the trailing chevron is drawn when no <see cref="TrailingIcon"/> replaces it.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowChevron { get; set; }

    /// <summary>
    /// Initializes the row stretched, left-aligned and on a raised surface.
    /// </summary>
    protected ActionComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Stretch;
        Type = UIButtonType.Surface;

        TextAlignment = UITextAlignment.Start;
        // Pinned to the content, not the title: a two-line row would hang the badge at the top of the box.
        BadgeAlignment = UITextBadgeAlignment.Content;
    }

    /// <summary>
    /// Sets the row's title, description and leading icon in one call.
    /// </summary>
    public T SetAction(string title, string? description = null, string? icon = null)
    {
        _ = SetTitle(title);

        if (description is not null)
            _ = SetDescription(description);

        if (icon is not null)
            _ = SetIcon(icon);

        return Self;
    }
}

/// <summary>
/// A full-width row that invokes a command: content on the left, a trailing chevron on the right.
/// </summary>
public sealed class ActionComponent(string? id = null) : ActionComponent<ActionComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.action";
}
