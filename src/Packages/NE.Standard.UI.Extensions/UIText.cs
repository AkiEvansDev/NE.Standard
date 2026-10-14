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
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A text in a role, in one call: what a page writes when it has a line to say and nothing to bind; and the texts made of more than
/// one part — a quote, a title over its badges.
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
    /// A quote, as a messenger draws a reply or an edit: a stroke at the start in <paramref name="accent"/> (the brand where none is
    /// given), the title a caption in that colour — who, or "Editing" — and one muted line under it, the start of the words. Both are
    /// content, a person's name and words shown as written; a <see cref="UIPhrase.Of"/> key still translates.
    /// <paramref name="clickCommand"/> makes the whole quote pressable (a jump to what it quotes), <paramref name="closeCommand"/> ends it
    /// in an × (the reply dropped).
    /// </summary>
    public static SurfaceComponent Quote(UIPhrase title, UIPhrase line, UIThemeColor? accent = null, string? clickCommand = null, string? closeCommand = null)
    {
        ArgumentNullException.ThrowIfNull(title);
        ArgumentNullException.ThrowIfNull(line);

        UIThemeColor color = accent ?? UIThemeColor.Primary;

        return Quote(new TextComponent().SetTitle(title).SetDescription(line).SetTitleColor(color), clickCommand, closeCommand).SetBorderColor(color);
    }

    /// <summary>
    /// The same bound to what the controller holds at <paramref name="titlePath"/> and <paramref name="linePath"/> — a reply line over a
    /// composer, a quote in a message's row — the colour at <paramref name="accentPath"/> where given, the brand while it is null. A jump
    /// that names what it quotes takes its argument on the result: <c>.SetClickable(true).OnClick(command, arguments)</c>.
    /// </summary>
    public static SurfaceComponent Quote(string titlePath, string linePath, UIBindingScope scope, string? accentPath = null, string? clickCommand = null, string? closeCommand = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);
        ArgumentException.ThrowIfNullOrWhiteSpace(linePath);

        TextComponent words = new TextComponent()
            .BindTitle(titlePath, scope)
            .BindDescription(linePath, scope)
            .SetTitleColor(UIThemeColor.Primary);

        SurfaceComponent quote = Quote(words, clickCommand, closeCommand).SetBorderColor(UIThemeColor.Primary);

        if (accentPath is null)
            return quote;

        ArgumentException.ThrowIfNullOrWhiteSpace(accentPath);

        _ = words.BindTitleColor(accentPath, scope);

        return quote.BindBorderColor(accentPath, scope);
    }

    // The stylesheet's @ui-quote-stroke, a paragraph's quote line's and a Markdown blockquote's width (QuoteStrokeSyncTests).
    private const double QuoteStroke = 3;

    /// <summary>The words beside the stroke, the × after them where there is one, the whole pressable where it jumps.</summary>
    private static SurfaceComponent Quote(TextComponent words, string? clickCommand, string? closeCommand)
    {
        _ = words
            .AsCaption()
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted)
            .SetVerticalAlignment(UIAlignment.Center)
            .AsContent(TextComponent.TitleProperty, TextComponent.DescriptionProperty);

        ContainerComponent layout = new ContainerComponent()
            .AddChild(words.SetPlacement(1, 1, closeCommand is null ? 24 : 23, 1));

        if (closeCommand is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(closeCommand);

            _ = layout
                .SetColumn(24, UIGridUnit.Auto())
                .AddChild(UIIconButtons.Close()
                    .SetSize(UIButtonSize.Small)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetMargin(UIThickness.All(8, 0, 0, 0))
                    .OnClick(closeCommand)
                    .SetPlacement(24, 1, 1, 1)
                );
        }

        // The stroke is the surface's own start edge, the rest of its edge and its fill none: the quote stands on whatever holds it, a
        // message's tint included, and a press's wash stays inside the stroke.
        SurfaceComponent quote = new SurfaceComponent()
            .SetBackground(UIThemeColor.Transparent)
            .SetBorderThickness(UIThickness.All(QuoteStroke, 0, 0, 0))
            .SetBorderRadius(UICornerRadius.Uniform(0))
            .SetPadding(UIThickness.All(10, 2, 0, 2))
            .SetContent(layout);

        if (clickCommand is null)
            return quote;

        ArgumentException.ThrowIfNullOrWhiteSpace(clickCommand);

        return quote.SetClickable(true).OnClick(clickCommand);
    }

    /// <summary>
    /// A person as a list's row or a byline shows one: the round picture at <paramref name="avatar"/> (the person glyph where there is
    /// none), and beside it on its middle the name in the body's role over a muted caption — a role, how long ago, the last words.
    /// Both are content, a person's name and words as written; a <see cref="UIPhrase.Of"/> key still translates.
    /// </summary>
    public static ContainerComponent Person(string? avatar, UIPhrase name, UIPhrase? line = null, UIPersonSize size = UIPersonSize.Medium)
    {
        ArgumentNullException.ThrowIfNull(name);

        TextComponent words = new TextComponent().SetTitle(name);
        ImageComponent picture = new();

        return Person(avatar is null ? picture : picture.SetSource(avatar), line is null ? words : words.SetDescription(line), size);
    }

    /// <summary>
    /// The same bound to what the controller holds at <paramref name="avatarPath"/>, <paramref name="namePath"/> and
    /// <paramref name="linePath"/> — a chat's row, a conversation's person.
    /// </summary>
    public static ContainerComponent Person(string avatarPath, string namePath, string? linePath, UIBindingScope scope, UIPersonSize size = UIPersonSize.Medium)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(avatarPath);
        ArgumentException.ThrowIfNullOrWhiteSpace(namePath);

        TextComponent words = new TextComponent().BindTitle(namePath, scope);

        if (linePath is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(linePath);

            _ = words.BindDescription(linePath, scope);
        }

        return Person(new ImageComponent().BindSource(avatarPath, scope), words, size);
    }

    /// <summary>The picture in its circle, the words 12 px after it.</summary>
    private static ContainerComponent Person(ImageComponent picture, TextComponent words, UIPersonSize size)
    {
        // Two sizes, not one a page picks: a row's and a dense row's.
        double side = size switch
        {
            UIPersonSize.Medium => 40,
            UIPersonSize.Small => 32,
            _ => throw new ArgumentOutOfRangeException(nameof(size), size, "A person is Medium or Small.")
        };

        // No words of its own for a screen reader: the name stands beside it, and read twice it would be noise.
        _ = picture
            .SetShape(UIImageShape.Circle)
            .SetWidth(UILayoutLength.Absolute(side))
            .SetHeight(UILayoutLength.Absolute(side))
            .SetVerticalAlignment(UIAlignment.Center)
            .SetPlacement(1, 1, 1, 1);

        _ = words
            .AsBody()
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted)
            .SetVerticalAlignment(UIAlignment.Center)
            .SetMargin(UIThickness.All(12, 0, 0, 0))
            .AsContent(TextComponent.TitleProperty, TextComponent.DescriptionProperty)
            .SetPlacement(2, 1, 23, 1);

        return new ContainerComponent()
            .SetColumn(1, UIGridUnit.Auto())
            .AddChild(picture)
            .AddChild(words);
    }

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
