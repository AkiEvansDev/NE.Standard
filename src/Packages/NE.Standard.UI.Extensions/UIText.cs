using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A text in a role, in one call: what a page writes when it has a line to say and nothing to bind.
/// </summary>
public static class UIText
{
    /// <summary>The largest role, with an optional line under it.</summary>
    public static TextComponent Display(string title, string? description = null)
        => Create(title, description).AsDisplay();

    /// <summary>A section's heading, with an optional line under it.</summary>
    public static TextComponent Title(string title, string? description = null)
        => Create(title, description).AsTitle();

    /// <summary>A heading inside a section, with an optional line under it.</summary>
    public static TextComponent Subtitle(string title, string? description = null)
        => Create(title, description).AsSubtitle();

    /// <summary>Running text as a single line; a paragraph that wraps is <see cref="Paragraph"/>.</summary>
    public static TextComponent Body(string title, string? description = null)
        => Create(title, description).AsBody();

    /// <summary>The small line.</summary>
    public static TextComponent Caption(string title, string? description = null)
        => Create(title, description).AsCaption();

    /// <summary>The small capitals a thing is labelled by, in the muted ink.</summary>
    public static TextComponent Label(string label)
        => Create(label, null).AsOverline().Muted();

    /// <summary>Prose that wraps.</summary>
    public static ParagraphComponent Paragraph(string text)
        => new ParagraphComponent().SetDescription(text);

    /// <summary>A muted caption that wraps: the line under a title or a group that explains rather than names.</summary>
    public static ParagraphComponent Note(string text)
        => Paragraph(text).SetDescriptionType(UITextAppearance.Caption).Muted();

    /// <summary>
    /// A title with a row of badges under it in place of a description — a release's environment and replicas, a contact's labels —
    /// an optional mark before both, the title in the body's role; the badges wrap onto further lines.
    /// </summary>
    public static ContainerComponent WithBadges(string title, IEnumerable<BadgeItem> badges, string? icon = null)
    {
        ArgumentNullException.ThrowIfNull(badges);

        WrapPanelComponent row = new WrapPanelComponent().SetSpacing(BadgeSpacing);

        foreach (BadgeItem badge in badges)
            _ = row.AddChild(Badge(badge));

        // The body's role, a list row's: a heading over its badges would outweigh what it labels.
        return WithBadges(Create(title, null).AsBody(), row, icon);
    }

    /// <summary>
    /// The same with a title of the author's — bound, in a list's row — and the badges a collection of <see cref="BadgeItem"/> holds at
    /// <paramref name="badgesPath"/>, kept in step as it changes.
    /// </summary>
    public static ContainerComponent WithBadges(TextComponent title, string badgesPath, UIBindingScope scope = UIBindingScope.Root, string? icon = null)
    {
        ArgumentNullException.ThrowIfNull(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(badgesPath);

        ItemsViewComponent row = new ItemsViewComponent()
            .BindItems(badgesPath, scope)
            .SetOrientation(UIOrientation.Horizontal)
            .SetLayoutType(UIItemsLayoutType.Wrap)
            .SetSpacing(BadgeSpacing)
            .SetTemplate(BoundBadge());

        return WithBadges(title, row, icon);
    }

    private const double BadgeSpacing = 4;

    /// <summary>The words over the badges, the mark before both, centred across them as a text's mark is across its two lines.</summary>
    private static ContainerComponent WithBadges(TextComponent title, IVisualComponent badges, string? icon)
    {
        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        StackPanelComponent words = UILayout.Stack(4, title, badges);
        ContainerComponent text = new();

        if (icon is null)
            return text.AddChild(words.SetPlacement(1, 1, 24, 1));

        return text
            .SetColumn(1, UIGridUnit.Auto())
            .AddChild(new IconComponent()
                .SetIcon(icon)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetMargin(UIThickness.All(0, 0, 12, 0))
                .SetPlacement(1, 1, 1, 1)
            )
            .AddChild(words.SetPlacement(2, 1, 23, 1));
    }

    private static BadgeComponent Badge(BadgeItem badge)
    {
        BadgeComponent component = new BadgeComponent()
            .SetType(badge.BadgeStyle)
            .SetColor(badge.BadgeColor)
            .SetFill(badge.BadgeFill)
            .SetIcon(badge.BadgeIcon)
            .SetIconColor(badge.BadgeIconColor)
            .SetIconSize(badge.BadgeIconSize)
            .SetText(badge.BadgeText)
            .SetTextType(badge.BadgeTextType);

        // An item that says its words are content keeps them as written, as the bound row does.
        if (badge.IsContent)
            _ = component.AsContent(BadgeComponent.TextProperty, ITooltipComponent.TooltipProperty);

        return badge.BadgeTooltip is null ? component : component.SetTooltip(badge.BadgeTooltip).SetTooltipPlacement(badge.BadgeTooltipPlacement);
    }

    private static BadgeComponent BoundBadge()
        => new BadgeComponent()
            .BindType(nameof(BadgeItem.BadgeStyle), UIBindingScope.Relative)
            .BindColor(nameof(BadgeItem.BadgeColor), UIBindingScope.Relative)
            .BindFill(nameof(BadgeItem.BadgeFill), UIBindingScope.Relative)
            .BindIcon(nameof(BadgeItem.BadgeIcon), UIBindingScope.Relative)
            .BindIconColor(nameof(BadgeItem.BadgeIconColor), UIBindingScope.Relative)
            .BindIconSize(nameof(BadgeItem.BadgeIconSize), UIBindingScope.Relative)
            .BindText(nameof(BadgeItem.BadgeText), UIBindingScope.Relative)
            .BindTextType(nameof(BadgeItem.BadgeTextType), UIBindingScope.Relative)
            .BindTooltip(nameof(BadgeItem.BadgeTooltip), UIBindingScope.Relative)
            .BindTooltipPlacement(nameof(BadgeItem.BadgeTooltipPlacement), UIBindingScope.Relative);

    private static TextComponent Create(string title, string? description)
    {
        TextComponent text = new TextComponent().SetTitle(title);

        return description is null ? text : text.SetDescription(description);
    }
}
