using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A text in a role, in one call: its words written, or left out for words bound after (<c>UIText.Note().BindDescription(path)</c>);
/// and the texts made of more than one part — a quote, a person, a title over its badges.
/// </summary>
public static class UIText
{
    /// <summary>The largest role, with an optional line under it.</summary>
    public static TextComponent Display(UIPhrase? title = null, UIPhrase? description = null)
        => Create(title, description).AsDisplay();

    /// <summary>A section's heading, with an optional line under it.</summary>
    public static TextComponent Title(UIPhrase? title = null, UIPhrase? description = null)
        => Create(title, description).AsTitle();

    /// <summary>A heading inside a section, with an optional line under it.</summary>
    public static TextComponent Subtitle(UIPhrase? title = null, UIPhrase? description = null)
        => Create(title, description).AsSubtitle();

    /// <summary>Running text as a single line; a paragraph that wraps is <see cref="Paragraph"/>.</summary>
    public static TextComponent Body(UIPhrase? title = null, UIPhrase? description = null)
        => Create(title, description).AsBody();

    /// <summary>The small line, and a line under it as small in the muted ink: never larger than what it explains.</summary>
    public static TextComponent Caption(UIPhrase? title = null, UIPhrase? description = null)
        => Create(title, description).AsCaption().SetDescriptionType(UITextAppearance.Caption).SetDescriptionColor(UIThemeColor.Muted);

    /// <summary>The small capitals a thing is labelled by, in the muted ink.</summary>
    public static TextComponent Label(UIPhrase? label = null)
        => Create(label, null).AsOverline().Muted();

    /// <summary>Prose that wraps.</summary>
    public static ParagraphComponent Paragraph(UIPhrase? text = null)
    {
        PresetWords.RequireIfGiven(text);

        ParagraphComponent paragraph = new();

        return text is null ? paragraph : paragraph.SetDescription(text);
    }

    /// <summary>A muted caption that wraps: the line under a title or a group that explains rather than names.</summary>
    public static ParagraphComponent Note(UIPhrase? text = null)
        => Paragraph(text).SetDescriptionType(UITextAppearance.Caption).Muted();

    /// <summary>
    /// A quote, as a messenger draws a reply or an edit: a stroke on the left in <paramref name="accent"/> (the brand where none is
    /// given), the title a caption in that colour — who, or "Editing" — and one muted line under it, the start of the words. Both are
    /// content, a person's name and words shown as written; a <see cref="UIPhrase.Of"/> key still translates.
    /// <paramref name="clickCommand"/> makes the whole quote pressable (a jump to what it quotes), <paramref name="closeCommand"/> ends it
    /// in an × (the reply dropped), its glyph on the quote's end, which hides the quote at once and runs the command beside the hide.
    /// </summary>
    public static SurfaceComponent Quote(UIPhrase title, UIPhrase line, UIThemeColor? accent = null, string? clickCommand = null, string? closeCommand = null)
    {
        PresetWords.Require(title);
        PresetWords.Require(line);

        UIThemeColor color = accent ?? UIThemeColor.Primary;

        return Quote(QuoteWords(new TextComponent().SetTitle(title).SetDescription(line).SetTitleColor(color)), clickCommand, closeCommand).SetBorderColor(color);
    }

    /// <summary>
    /// A quote round content of the author's — a paragraph, a picture and its caption, a whole message — with the same stroke, its colour
    /// <paramref name="accent"/> or, where none is given, the neutral border colour a quotation inside text is drawn in (a reply's words
    /// take the brand: <see cref="Quote(UIPhrase, UIPhrase, UIThemeColor?, string?, string?)"/>); pressable and closed as that one.
    /// </summary>
    public static SurfaceComponent Quote(IVisualComponent content, UIThemeColor? accent = null, string? clickCommand = null, string? closeCommand = null)
    {
        ArgumentNullException.ThrowIfNull(content);

        StackPanelComponent cell = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChild(content);

        return Quote(cell, clickCommand, closeCommand).SetBorderColor(accent ?? UIThemeColor.Border);
    }

    // The stylesheet's @ui-quote-stroke, a paragraph's quote line's and a Markdown blockquote's width (QuoteStrokeSyncTests).
    private const double QuoteStroke = 3;

    // A small icon's hang past a glyph edge (ui-button.less: half a small button's 28 px less its 16 px glyph), kept inside the quote as
    // its end's padding where it ends in an ×: past the quote's box, the wash ran out of it (PresetMeasureSyncTests).
    private const double CloseHang = 6;

    /// <summary>What it quotes beside the stroke, the × after it where there is one, the whole pressable where it jumps.</summary>
    private static SurfaceComponent Quote<T>(T content, string? clickCommand, string? closeCommand)
        where T : VisualComponentBase<T>, IUIComponentDefinition
    {
        ContainerComponent layout = new ContainerComponent()
            .AddChild(content.SetPlacement(1, 1, closeCommand is null ? 24 : 23, 1));

        ButtonComponent? close = null;

        if (closeCommand is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(closeCommand);

            close = UIIconButtons.Close().SetSize(UIButtonSize.Small).OnClick(closeCommand);

            // A quote is a band: its × stands its glyph on the quote's end, as every end icon of a band does, its box hanging into the
            // end's padding.
            _ = layout
                .SetColumn(24, UIGridUnit.Auto())
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetGlyphEdge(UIAlignment.End)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetMargin(UIThickness.All(8, 0, 0, 0))
                    .AddChild(close)
                    .SetPlacement(24, 1, 1, 1)
                );
        }

        // The stroke is the surface's left edge, the rest of its edge and its fill none: the quote stands on whatever holds it, a
        // message's tint included, and a press's wash stays inside the stroke. A stroke on one side alone keeps its corners square and
        // rounds the far ones as a list's entry (ui-surface.less), so the wash follows the theme's corner.
        SurfaceComponent quote = new SurfaceComponent()
            .SetBackground(UIThemeColor.Transparent)
            .SetBorderThickness(UIThickness.All(QuoteStroke, 0, 0, 0))
            .SetPadding(UIThickness.All(10, 2, close is null ? 0 : CloseHang, 2))
            .SetContent(layout);

        // The quote leaves as its command leaves, not a round trip later, as a message's × does: a click running a command raises only
        // its before and after, so the hide is the before.
        if (close is not null)
            quote = quote.InteractBefore(close.Id, EventNames.Click, IVisualComponent.VisibilityProperty, UIVisibility.Collapsed);

        if (clickCommand is null)
            return quote;

        ArgumentException.ThrowIfNullOrWhiteSpace(clickCommand);

        // A surface with a click of its own is pressable unless its author says otherwise.
        return quote.OnClick(clickCommand);
    }

    /// <summary>A quote's title in the caption role over its muted line, both content.</summary>
    private static TextComponent QuoteWords(TextComponent words)
        => words
            .AsCaption()
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted)
            .SetVerticalAlignment(UIAlignment.Center)
            .AsContent(TextComponent.TitleProperty, TextComponent.DescriptionProperty);

    /// <summary>
    /// The words quote bound to what the controller holds at <paramref name="titlePath"/> and <paramref name="linePath"/> — a reply line
    /// over a composer, a quote in a message's row — the colour at <paramref name="accentPath"/> where given, the brand while it is null.
    /// A jump that names what it quotes takes its argument on the result: <c>.OnClick(command, arguments)</c>. The words are drawn as
    /// written, data rather than markup.
    /// </summary>
    public static SurfaceComponent BoundQuote(string titlePath, string linePath, UIBindingScope scope = UIBindingScope.Root, string? accentPath = null, string? clickCommand = null, string? closeCommand = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);
        ArgumentException.ThrowIfNullOrWhiteSpace(linePath);

        TextComponent words = QuoteWords(new TextComponent()
            .BindTitle(titlePath, scope)
            .BindDescription(linePath, scope)
            .SetDescriptionPlain(true)
            .SetTitleColor(UIThemeColor.Primary)
        );

        SurfaceComponent quote = Quote(words, clickCommand, closeCommand).SetBorderColor(UIThemeColor.Primary);

        if (accentPath is null)
            return quote;

        ArgumentException.ThrowIfNullOrWhiteSpace(accentPath);

        _ = words.BindTitleColor(accentPath, scope);

        return quote.BindBorderColor(accentPath, scope);
    }

    /// <summary>
    /// A person as a list's row or a byline shows one: the round picture at <paramref name="avatar"/> (the person glyph where there is
    /// none), and beside it on its middle the name in the body's role over a muted caption — a role, how long ago, the last words.
    /// Both are content, a person's name and words as written; a <see cref="UIPhrase.Of"/> key still translates.
    /// </summary>
    public static ContainerComponent Person(string? avatar, UIPhrase name, UIPhrase? line = null, UIPersonSize size = UIPersonSize.Medium)
    {
        PresetWords.Require(name);
        PresetWords.RequireIfGiven(line);

        TextComponent words = new TextComponent().SetTitle(name);

        return Person(Picture(avatar), PersonWords(line is null ? words : words.SetDescription(line)), size);
    }

    /// <summary>
    /// The same beside words of the author's — a name with a badge, a line with a timestamp — standing where the name would, on the
    /// picture's middle.
    /// </summary>
    public static ContainerComponent Person(string? avatar, IVisualComponent words, UIPersonSize size = UIPersonSize.Medium)
    {
        ArgumentNullException.ThrowIfNull(words);

        return Person(Picture(avatar), new StackPanelComponent().SetOrientation(UIOrientation.Vertical).AddChild(words), size);
    }

    /// <summary>The picture in its circle, the words 12 px after it on its middle.</summary>
    private static ContainerComponent Person<T>(ImageComponent picture, T words, UIPersonSize size)
        where T : VisualComponentBase<T>, IUIComponentDefinition
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
            .SetVerticalAlignment(UIAlignment.Center)
            .SetMargin(UIThickness.All(12, 0, 0, 0))
            .SetPlacement(2, 1, 1, 1);

        ContainerComponent person = new ContainerComponent()
            .SetColumn(1, UIGridUnit.Auto())
            .AddChild(picture)
            .AddChild(words);

        // The words in one star column, the rest none: sized to its words in a row, a person shared them out over 23 star columns,
        // each rounded down to the layout's sub-pixel, and the name ended in an ellipsis a fraction of a pixel short.
        for (var column = 3; column <= UIGridPlacement.GridColumns; column++)
            _ = person.SetColumn(column, UIGridUnit.Absolute(0));

        return person;
    }

    private static ImageComponent Picture(string? avatar)
        => avatar is null ? new ImageComponent() : new ImageComponent().SetSource(avatar);

    /// <summary>The name in the body's role over the muted caption, both the person's own words.</summary>
    private static TextComponent PersonWords(TextComponent words)
        => words
            .AsBody()
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted)
            .AsContent(TextComponent.TitleProperty, TextComponent.DescriptionProperty);

    /// <summary>
    /// The same bound to what the controller holds at <paramref name="avatarPath"/> (the person glyph where none is given or it holds
    /// nothing), <paramref name="namePath"/> and <paramref name="linePath"/> — a chat's row, a conversation's person.
    /// </summary>
    public static ContainerComponent BoundPerson(string? avatarPath, string namePath, string? linePath = null, UIBindingScope scope = UIBindingScope.Root, UIPersonSize size = UIPersonSize.Medium)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(namePath);

        TextComponent words = new TextComponent().BindTitle(namePath, scope);

        if (linePath is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(linePath);

            // The person's words as written: data, not markup.
            _ = words.BindDescription(linePath, scope).SetDescriptionPlain(true);
        }

        ImageComponent picture = new();

        if (avatarPath is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(avatarPath);

            _ = picture.BindSource(avatarPath, scope);
        }

        return Person(picture, PersonWords(words), size);
    }

    /// <summary>
    /// A title with a row of badges under it in place of a description — a release's environment and replicas, a contact's labels —
    /// an optional mark before both, the title in the body's role; the badges wrap onto further lines.
    /// </summary>
    public static ContainerComponent WithBadges(UIPhrase title, IEnumerable<BadgeItem> badges, string? icon = null)
    {
        PresetWords.Require(title);
        ArgumentNullException.ThrowIfNull(badges);

        WrapPanelComponent row = new WrapPanelComponent().SetSpacing(BadgeSpacing);

        foreach (BadgeItem badge in badges)
            _ = row.AddChild(Badge(badge));

        // The body's role, a list row's: a heading over its badges would outweigh what it labels.
        return WithBadges(Create(title, null).AsBody(), row, icon);
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

    /// <summary>
    /// The same with the title the controller holds at <paramref name="titlePath"/>, as content — in a list's row — and the badges a
    /// collection of <see cref="BadgeItem"/> holds at <paramref name="badgesPath"/>, kept in step as it changes.
    /// </summary>
    public static ContainerComponent BoundWithBadges(string titlePath, string badgesPath, UIBindingScope scope = UIBindingScope.Root, string? icon = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);
        ArgumentException.ThrowIfNullOrWhiteSpace(badgesPath);

        TextComponent title = new TextComponent()
            .AsBody()
            .BindTitle(titlePath, scope)
            .AsContent(TextComponent.TitleProperty);

        ItemsViewComponent row = new ItemsViewComponent()
            .BindItems(badgesPath, scope)
            .SetOrientation(UIOrientation.Horizontal)
            .SetLayoutType(UIItemsLayoutType.Wrap)
            .SetSpacing(BadgeSpacing)
            .SetTemplate(BoundBadge());

        return WithBadges(title, row, icon);
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

    // Words left out are bound after; null is the one spelling of that, so blank words are refused.
    private static TextComponent Create(UIPhrase? title, UIPhrase? description)
    {
        PresetWords.RequireIfGiven(title);
        PresetWords.RequireIfGiven(description);

        TextComponent text = new();

        if (title is not null)
            text = text.SetTitle(title);

        return description is null ? text : text.SetDescription(description);
    }
}
