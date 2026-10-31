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

/// <summary>
/// A message that stays in the page's flow until it is no longer true — "Your trial ends in 3 days", "This workspace is read-only
/// during maintenance" — unlike a toast, which leaves on its own: a Tinted surface in its tone's colour holding its mark, a title,
/// a body, an action and a ×. A status to a screen reader for Info and Success, an alert for Warning and Danger, so a message shown
/// later or whose bound words change is read out.
/// </summary>
/// <remarks>
/// The × hides the message on the page at once, with no round trip, so a reload shows it again; a message the server should stop
/// showing for good gives the × a <c>dismissCommand</c>, which runs as the message goes, and binds its Visibility.
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

    /// <summary>
    /// A message whose words the controller holds at <paramref name="titlePath"/> and <paramref name="descriptionPath"/>, either or both — a
    /// promo code's verdict, a sync's state — bound as the controller's words, drawn plain (a path to a key still translates), and
    /// read out as they change; otherwise <see cref="Create(UIColorStyle, UIPhrase?, UIPhrase?, ButtonComponent?, bool, string?, string?)"/>.
    /// </summary>
    public static SurfaceComponent BoundCreate<TSource>(UIColorStyle tone, Expression<Func<TSource, object?>>? titlePath, Expression<Func<TSource, object?>>? descriptionPath, UIBindingScope scope = UIBindingScope.Root, ButtonComponent? action = null, bool dismissible = false, string? icon = null, string? dismissCommand = null)
        => BoundCreate(tone, PresetBindings.PathOrNull(titlePath), PresetBindings.PathOrNull(descriptionPath), scope, action, dismissible, icon, dismissCommand);

    /// <summary>A message whose words are bound at <paramref name="titlePath"/> and <paramref name="descriptionPath"/>.</summary>
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

    /// <summary>
    /// A message with a title, a body or both, an optional action (a button carrying its command) and an optional ×;
    /// <paramref name="icon"/> stands in for the tone's own mark. A <paramref name="dismissCommand"/> gives it the × even where
    /// <paramref name="dismissible"/> is false, and runs as the × hides it. The tone is Info, Success, Warning or Danger.
    /// </summary>
    public static SurfaceComponent Create(UIColorStyle tone, UIPhrase? title, UIPhrase? description, ButtonComponent? action = null, bool dismissible = false, string? icon = null, string? dismissCommand = null)
    {
        PresetWords.RequireIfGiven(title);
        PresetWords.RequireIfGiven(description);

        return Create(tone, title is null ? null : new TextComponent().SetTitle(title), description is null ? null : new ParagraphComponent().SetDescription(description), action, dismissible, icon, dismissCommand);
    }

    /// <summary>
    /// The same with a title or a body of the author's own beyond words alone — a body with a link or an emphasis — given the message's
    /// text roles here; words the controller holds are <see cref="BoundCreate"/>.
    /// </summary>
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
            action.Size ??= UISize.Small;

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
            _ = words.AddChild(title
                .SetTitleType(UITextAppearance.Subtitle)
                .SetTitleColor(UIThemeColor.Default)
                .SetTitleWrap(true)
            );
        }

        if (description is not null)
        {
            _ = words.AddChild(description
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.Default)
            );
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
