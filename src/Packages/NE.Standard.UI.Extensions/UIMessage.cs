using System;
using System.Linq.Expressions;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>Builds persistent in-flow status and alert messages with an icon, title, body, optional action and dismiss button.</summary>
/// <remarks>
/// Announces as a status live region for <c>Info</c> and <c>Success</c> and an alert for <c>Warning</c> and <c>Danger</c>. The dismiss
/// button hides the message on the page immediately, optionally running <c>dismissCommand</c> beside the hide.
/// </remarks>
public static class UIMessage
{
    /// <summary>A message worth knowing.</summary>
    public static SurfaceComponent Info(UIPhrase? title, UIPhrase? description = null, ButtonComponent? action = null, bool dismissible = false, string? dismissCommand = null)
        => Create(UIColorStyle.Info, title, description, action, dismissible, dismissCommand: dismissCommand);

    /// <summary>A message saying something is done or all right.</summary>
    public static SurfaceComponent Success(UIPhrase? title, UIPhrase? description = null, ButtonComponent? action = null, bool dismissible = false, string? dismissCommand = null)
        => Create(UIColorStyle.Success, title, description, action, dismissible, dismissCommand: dismissCommand);

    /// <summary>A message asking for care.</summary>
    public static SurfaceComponent Warning(UIPhrase? title, UIPhrase? description = null, ButtonComponent? action = null, bool dismissible = false, string? dismissCommand = null)
        => Create(UIColorStyle.Warning, title, description, action, dismissible, dismissCommand: dismissCommand);

    /// <summary>A message saying something went wrong or cannot be undone.</summary>
    public static SurfaceComponent Danger(UIPhrase? title, UIPhrase? description = null, ButtonComponent? action = null, bool dismissible = false, string? dismissCommand = null)
        => Create(UIColorStyle.Danger, title, description, action, dismissible, dismissCommand: dismissCommand);

    /// <summary>Builds an in-flow message whose title and optional description are bound as plain content at <paramref name="titlePath"/> and <paramref name="descriptionPath"/>.</summary>
    public static SurfaceComponent BoundCreate<TSource>(UIColorStyle tone, Expression<Func<TSource, object?>>? titlePath, Expression<Func<TSource, object?>>? descriptionPath, UIBindingScope scope = UIBindingScope.Root, ButtonComponent? action = null, bool dismissible = false, string? icon = null, string? dismissCommand = null)
        => BoundCreate(tone, PresetBindings.PathOrNull(titlePath), PresetBindings.PathOrNull(descriptionPath), scope, action, dismissible, icon, dismissCommand);

    /// <summary>Builds an in-flow message whose title and optional description are bound as plain content at <paramref name="titlePath"/> and <paramref name="descriptionPath"/>.</summary>
    public static SurfaceComponent BoundCreate(UIColorStyle tone, string? titlePath, string? descriptionPath, UIBindingScope scope = UIBindingScope.Root, ButtonComponent? action = null, bool dismissible = false, string? icon = null, string? dismissCommand = null)
    {
        if (titlePath is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        if (descriptionPath is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(descriptionPath);

        TextComponent? title = titlePath is null ? null : new TextComponent().BindTitle(titlePath, scope).AsContent(TextComponent.TitleProperty);

        // Bound words are data, never markup: a name with an asterisk in it is shown as typed.
        ParagraphComponent? description = descriptionPath is null ? null : new ParagraphComponent().BindDescription(descriptionPath, scope).AsContent(ParagraphComponent.DescriptionProperty).SetDescriptionPlain(true);

        return Create(tone, title, description, action, dismissible, icon, dismissCommand);
    }

    /// <summary>Builds an in-flow message in <paramref name="tone"/> with a title, description or both, an optional action button and an optional dismiss button.</summary>
    /// <remarks>Supplying <paramref name="dismissCommand"/> enables the dismiss button even when <paramref name="dismissible"/> is <see langword="false"/>.</remarks>
    public static SurfaceComponent Create(UIColorStyle tone, UIPhrase? title, UIPhrase? description, ButtonComponent? action = null, bool dismissible = false, string? icon = null, string? dismissCommand = null)
    {
        PresetWords.RequireIfGiven(title);
        PresetWords.RequireIfGiven(description);

        return Create(tone, title is null ? null : new TextComponent().SetTitle(title), description is null ? null : new ParagraphComponent().SetDescription(description), action, dismissible, icon, dismissCommand);
    }

    /// <summary>Builds an in-flow message in <paramref name="tone"/> from custom <paramref name="title"/> and <paramref name="description"/> components.</summary>
    public static SurfaceComponent Create(UIColorStyle tone, TextComponent? title, ParagraphComponent? description, ButtonComponent? action = null, bool dismissible = false, string? icon = null, string? dismissCommand = null)
    {
        RequireTone(tone);

        if (title is null && description is null)
            throw new ArgumentException("A message says something: give it a title, a description or both.", nameof(description));

        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        if (dismissCommand is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(dismissCommand);
            dismissible = true;
        }

        UIThemeColor color = UIThemeColor.FromStyle(tone);
        var trailing = (action is null ? 0 : 1) + (dismissible ? 1 : 0);
        StackPanelComponent words = Words(title, description);

        // The mark, the words, the action and the × share the row's middle on md+, so an action and a × stand level side by side rather
        // than stair-stepped across opposite corners; on a phone the action drops under the words.
        ContainerComponent layout = new ContainerComponent()
            .SetVerticalAlignment(UIAlignment.Start)
            .SetColumn(1, UIGridUnit.Auto())
            .SetRow(1, UIGridUnit.Auto())
            .AddChild(new IconComponent()
                .SetIcon(icon ?? GlyphOf(tone))
                .SetColor(color)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetMargin(UIThickness.All(0, 0, 12, 0))
                .SetPlacement(1, 1, 1, 1)
            )
            .AddChild(words.SetPlacement(2, 1, 23 - trailing, 1));

        if (action is not null)
        {
            if (action.Size is null && !PresetBindings.Binds(action, ButtonComponent.SizeProperty))
                action.Size = UISize.Small;

            _ = layout
                .SetColumn(24 - (dismissible ? 1 : 0), UIGridUnit.Auto())
                .AddRow(UIGridUnit.Auto())
                .AddChild(action
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetHorizontalAlignment(UIAlignment.End)
                    .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(0, 8, 0, 0), md: UIThickness.All(16, 0, 0, 0)))
                    .SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.At(2, 2, dismissible ? 22 : 23, 1), md: UIGridPlacement.At(24 - (dismissible ? 1 : 0), 1, 1, 1)))
                );
        }

        SurfaceComponent message = new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Tinted)
            .SetBackground(color)
            .SetLiveRegion(tone.IsUrgent() ? UILiveRegion.Alert : UILiveRegion.Status)
            .SetPadding(UIThickness.All(16, 12, 16, 12))
            .SetContent(layout);

        if (!dismissible)
            return message;

        // The framework's word for its name, spelt as the key: the presets reach no shell.
        ButtonComponent dismiss = UIButtons.Icon(UIGlyphs.Close, new UIPhrase("ui.message.dismiss")).SetSize(UISize.Small);

        // A message is a band: its × stands its glyph on the content's edge, the mark's 16 px on the other side, its box hanging past.
        _ = layout
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetGlyphEdge(UIAlignment.End)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetMargin(UIThickness.All(8, 0, 0, 0))
                .AddChild(dismiss)
                .SetPlacement(24, 1, 1, 1)
            );

        // On the page at once: without a command the message is gone until the page is drawn again, with nothing asked of the server.
        if (dismissCommand is null)
            return message.InteractOn(dismiss.Id, EventNames.Click, IVisualComponent.VisibilityProperty, UIVisibility.Collapsed);

        // The command goes beside the hide, never instead of it: the message leaves as the command leaves, not a round trip later. A
        // click running a command raises only its before and after, so the hide is the before.
        _ = dismiss.OnClick(dismissCommand);

        return message.InteractBefore(dismiss.Id, EventNames.Click, IVisualComponent.VisibilityProperty, UIVisibility.Collapsed);
    }

    /// <summary>The title over the body, each in its role and the page's own ink, both wrapping.</summary>
    private static StackPanelComponent Words(TextComponent? title, ParagraphComponent? description)
    {
        StackPanelComponent words = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Center)
            .SetSpacing(2);

        if (title is not null)
        {
            if (title.TitleType is null && !PresetBindings.Binds(title, TextComponent.TitleTypeProperty))
                _ = title.SetTitleType(UITextAppearance.Subtitle);

            if (title.TitleColor is null && !PresetBindings.Binds(title, TextComponent.TitleColorProperty))
                _ = title.SetTitleColor(UIThemeColor.Default);

            if (title.TitleWrap is null && !PresetBindings.Binds(title, TextComponent.TitleWrapProperty))
                _ = title.SetTitleWrap(true);

            _ = words.AddChild(title);
        }

        if (description is not null)
        {
            if (description.DescriptionType is null && !PresetBindings.Binds(description, ParagraphComponent.DescriptionTypeProperty))
                _ = description.SetDescriptionType(UITextAppearance.Body);

            if (description.DescriptionColor is null && !PresetBindings.Binds(description, ParagraphComponent.DescriptionColorProperty))
                _ = description.SetDescriptionColor(UIThemeColor.Default);

            _ = words.AddChild(description);
        }

        return words;
    }

    /// <summary>
    /// Refuses a tone a message, an outcome or a status has no look for: their glyph and their screen reader's urgency cover Info,
    /// Success, Warning and Danger, and a brand's or a surface's colour would draw one of them under the Info mark.
    /// </summary>
    internal static void RequireTone(UIColorStyle tone)
    {
        if (tone is not (UIColorStyle.Info or UIColorStyle.Success or UIColorStyle.Warning or UIColorStyle.Danger))
            throw new ArgumentOutOfRangeException(nameof(tone), tone, "A message's tone is Info, Success, Warning or Danger.");
    }

    internal static string GlyphOf(UIColorStyle tone) => tone switch
    {
        UIColorStyle.Success => UIGlyphs.CheckCircle,
        UIColorStyle.Warning => UIGlyphs.Warning,
        UIColorStyle.Danger => UIGlyphs.Error,
        _ => UIGlyphs.Info
    };
}
