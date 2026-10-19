using System;
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

/// <summary>How much a message matters: its colour, its mark, and whether a screen reader is told at once.</summary>
public enum UIMessageSeverity
{
    /// <summary>Worth knowing: the palette's info colour, read when the reader is free.</summary>
    Info,

    /// <summary>Done, or all right: the success colour, read when the reader is free.</summary>
    Success,

    /// <summary>Needs care: the warning colour, read at once.</summary>
    Warning,

    /// <summary>Went wrong, or cannot be undone: the danger colour, read at once.</summary>
    Danger
}

/// <summary>
/// A message that stays in the page's flow until it is no longer true — "Your trial ends in 3 days", "This workspace is read-only
/// during maintenance" — unlike a toast, which leaves on its own: a Tinted surface in the severity's colour holding its mark, a title,
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
    public static SurfaceComponent Info(UIPhrase? title, UIPhrase? body = null, ButtonComponent? action = null, bool dismissible = false, string? dismissCommand = null)
        => Create(UIMessageSeverity.Info, title, body, action, dismissible, dismissCommand: dismissCommand);

    /// <summary>A message saying something is done or all right.</summary>
    public static SurfaceComponent Success(UIPhrase? title, UIPhrase? body = null, ButtonComponent? action = null, bool dismissible = false, string? dismissCommand = null)
        => Create(UIMessageSeverity.Success, title, body, action, dismissible, dismissCommand: dismissCommand);

    /// <summary>A message asking for care.</summary>
    public static SurfaceComponent Warning(UIPhrase? title, UIPhrase? body = null, ButtonComponent? action = null, bool dismissible = false, string? dismissCommand = null)
        => Create(UIMessageSeverity.Warning, title, body, action, dismissible, dismissCommand: dismissCommand);

    /// <summary>A message saying something went wrong or cannot be undone.</summary>
    public static SurfaceComponent Danger(UIPhrase? title, UIPhrase? body = null, ButtonComponent? action = null, bool dismissible = false, string? dismissCommand = null)
        => Create(UIMessageSeverity.Danger, title, body, action, dismissible, dismissCommand: dismissCommand);

    /// <summary>
    /// A message whose words the controller holds at <paramref name="titlePath"/> and <paramref name="bodyPath"/>, either or both — a
    /// promo code's verdict, a sync's state — bound as the controller's words, drawn plain (a path to a key still translates), and
    /// read out as they change; otherwise <see cref="Create(UIMessageSeverity, UIPhrase?, UIPhrase?, ButtonComponent?, bool, string?, string?)"/>.
    /// </summary>
    public static SurfaceComponent BoundCreate(UIMessageSeverity severity, string? titlePath, string? bodyPath, UIBindingScope scope = UIBindingScope.Root, ButtonComponent? action = null, bool dismissible = false, string? icon = null, string? dismissCommand = null)
    {
        if (titlePath is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        if (bodyPath is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(bodyPath);

        TextComponent? title = titlePath is null ? null : new TextComponent().BindTitle(titlePath, scope).AsContent(TextComponent.TitleProperty);

        // Bound words are data, never markup: a name with an asterisk in it is shown as typed.
        ParagraphComponent? body = bodyPath is null ? null : new ParagraphComponent().BindDescription(bodyPath, scope).AsContent(ParagraphComponent.DescriptionProperty).SetDescriptionPlain(true);

        return Create(severity, title, body, action, dismissible, icon, dismissCommand);
    }

    /// <summary>
    /// A message with a title, a body or both, an optional action (a button carrying its command) and an optional ×;
    /// <paramref name="icon"/> stands in for the severity's own mark. A <paramref name="dismissCommand"/> gives it the × even where
    /// <paramref name="dismissible"/> is false, and runs as the × hides it.
    /// </summary>
    public static SurfaceComponent Create(UIMessageSeverity severity, UIPhrase? title, UIPhrase? body, ButtonComponent? action = null, bool dismissible = false, string? icon = null, string? dismissCommand = null)
    {
        PresetWords.RequireIfGiven(title);
        PresetWords.RequireIfGiven(body);

        return Create(severity, title is null ? null : new TextComponent().SetTitle(title), body is null ? null : new ParagraphComponent().SetDescription(body), action, dismissible, icon, dismissCommand);
    }

    /// <summary>
    /// The same with a title or a body of the author's own beyond words alone — a body with a link or an emphasis — given the message's
    /// text roles here; words the controller holds are <see cref="BoundCreate"/>.
    /// </summary>
    public static SurfaceComponent Create(UIMessageSeverity severity, TextComponent? title, ParagraphComponent? body, ButtonComponent? action = null, bool dismissible = false, string? icon = null, string? dismissCommand = null)
    {
        if (title is null && body is null)
            throw new ArgumentException("A message says something: give it a title, a body or both.", nameof(body));

        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        if (dismissCommand is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(dismissCommand);
            dismissible = true;
        }

        UIThemeColor color = UIThemeColor.FromStyle(ColorOf(severity));
        var trailing = (action is null ? 0 : 1) + (dismissible ? 1 : 0);
        StackPanelComponent words = Words(title, body);

        // The × stands on the first line's middle, the title's or else the body's: the stylesheet sets that line on a small button's
        // middle whatever line the theme gives it, rather than a margin worked out here from the lines' default heights.
        if (dismissible)
            _ = words.SetFirstLineOnControl(UIButtonSize.Small);

        // The mark, the words and the trailing auto columns on one row. The mark stands on the words' middle; the action at the
        // message's end on the words' last line, as a toast's does, the × at the top: under the words on a phone, where beside them it
        // would leave a few letters a line. At the top of a message taller than its words (stretched in a row of taller ones):
        // stretched, the room would go to the rows and stand the action below the words' last line.
        ContainerComponent layout = new ContainerComponent()
            .SetVerticalAlignment(UIAlignment.Start)
            .SetColumn(1, UIGridUnit.Auto())
            .SetRow(1, UIGridUnit.Auto())
            .AddChild(new IconComponent()
                .SetIcon(icon ?? GlyphOf(severity))
                .SetColor(color)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetMargin(UIThickness.All(0, 0, 12, 0))
                .SetPlacement(1, 1, 1, 1)
            )
            .AddChild(words.SetPlacement(2, 1, 23 - trailing, 1));

        if (action is not null)
        {
            _ = layout
                .SetColumn(24 - (dismissible ? 1 : 0), UIGridUnit.Auto())
                .AddRow(UIGridUnit.Auto())
                .AddChild(action
                    .SetVerticalAlignment(UIAlignment.End)
                    .SetHorizontalAlignment(UIAlignment.End)
                    .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(0, 8, 0, 0), md: UIThickness.All(16, 0, 0, 0)))
                    .SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.At(2, 2, dismissible ? 22 : 23, 1), md: UIGridPlacement.At(24 - (dismissible ? 1 : 0), 1, 1, 1)))
                );
        }

        SurfaceComponent message = new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Tinted)
            .SetBackground(color)
            .SetLiveRegion(severity is UIMessageSeverity.Warning or UIMessageSeverity.Danger ? UILiveRegion.Alert : UILiveRegion.Status)
            .SetPadding(UIThickness.All(16, 12, 16, 12))
            .SetContent(layout);

        if (!dismissible)
            return message;

        // The framework's word for its name, spelt as the key: the presets reach no shell.
        ButtonComponent dismiss = UIButtons.Icon(UIGlyphs.Close, new UIPhrase("ui.message.dismiss")).SetSize(UIButtonSize.Small);

        // A message is a band: its × stands its glyph on the content's edge, the mark's 16 px on the other side, its box hanging past.
        _ = layout
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetGlyphEdge(UIAlignment.End)
                .SetVerticalAlignment(UIAlignment.Start)
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
    private static StackPanelComponent Words(TextComponent? title, ParagraphComponent? body)
    {
        StackPanelComponent words = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetSpacing(2);

        if (title is not null)
        {
            _ = words.AddChild(title
                .SetTitleType(UITextAppearance.Subtitle)
                .SetTitleColor(UIThemeColor.Default)
                .SetTitleWrap(true)
            );
        }

        if (body is not null)
        {
            _ = words.AddChild(body
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.Default)
            );
        }

        return words;
    }

    internal static UIColorStyle ColorOf(UIMessageSeverity severity) => severity switch
    {
        UIMessageSeverity.Success => UIColorStyle.Success,
        UIMessageSeverity.Warning => UIColorStyle.Warning,
        UIMessageSeverity.Danger => UIColorStyle.Danger,
        _ => UIColorStyle.Info
    };

    internal static string GlyphOf(UIMessageSeverity severity) => severity switch
    {
        UIMessageSeverity.Success => UIGlyphs.CheckCircle,
        UIMessageSeverity.Warning => UIGlyphs.Warning,
        UIMessageSeverity.Danger => UIGlyphs.Error,
        _ => UIGlyphs.Info
    };
}
