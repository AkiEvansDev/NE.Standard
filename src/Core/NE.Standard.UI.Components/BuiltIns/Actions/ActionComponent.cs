using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
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
    /// Sets the row's title, description and leading icon in one call; a string is the author's text, a key with arguments a phrase.
    /// </summary>
    public T SetAction(UIPhrase title, UIPhrase? description = null, string? icon = null)
    {
        ArgumentNullException.ThrowIfNull(title);

        if (!UIPhrase.HasWords(title))
            throw new ArgumentException("An action needs words.", nameof(title));

        if (description is not null && !UIPhrase.HasWords(description))
            throw new ArgumentException("A description given needs words; leave it out for none.", nameof(description));

        _ = SetTitle(title);

        if (description is not null)
            _ = SetDescription(description);

        if (icon is not null)
            _ = SetIcon(icon);

        return Self;
    }
}

/// <summary>
/// A full-width row that invokes a command: content on the left, a trailing chevron on the right — or, given a <c>Url</c>, the row's
/// look on a link to that address.
/// </summary>
[UIComponentPropertyBlock(typeof(ILinkableComponent))]
public sealed partial class ActionComponent(string? id = null) : ActionComponent<ActionComponent>(id), IUIComponentDefinition, ILinkableComponent
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.action";
}
