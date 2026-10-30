using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A button in each of its types, in one call — with words of its own or a standard action's — and the two rows buttons are put in:
/// the pair at a form's foot and the toolbar of icon-only buttons.
/// </summary>
public static class UIButtons
{
    /// <summary>The one filled button of a group: what pressing means "go".</summary>
    public static ButtonComponent Primary(UIPhrase title, string? icon = null)
        => Create(UIButtonVariant.Primary, title, icon);

    /// <summary>
    /// The filled button naming a standard action in the framework's words — Save, Done — its glyph before them where
    /// <paramref name="glyph"/>; a destructive one (Delete) fills in the danger colour.
    /// </summary>
    public static ButtonComponent Primary(UIStandardAction action, bool glyph = false)
        => Create(UIButtonVariant.Primary, action, glyph);

    /// <summary>The filled button in the accent colour, for the one action a page is about.</summary>
    public static ButtonComponent Accent(UIPhrase title, string? icon = null)
        => Create(UIButtonVariant.Accent, title, icon);

    /// <summary>The accent button naming a standard action; a destructive one fills in the danger colour.</summary>
    public static ButtonComponent Accent(UIStandardAction action, bool glyph = false)
        => Create(UIButtonVariant.Accent, action, glyph);

    /// <summary>
    /// An outlined button, where a bare one would not read as a button: an action on a message's colour, an alternative stretched under
    /// a stretched primary, a choice drawn as a card. Beside a filled button the other way is a <see cref="Ghost(UIPhrase, string?)"/>.
    /// </summary>
    public static ButtonComponent Outline(UIPhrase title, string? icon = null)
        => Create(UIButtonVariant.Outline, title, icon);

    /// <summary>The outlined button naming a standard action — Copy, Download; a destructive one's words and glyph in the danger colour.</summary>
    public static ButtonComponent Outline(UIStandardAction action, bool glyph = false)
        => Create(UIButtonVariant.Outline, action, glyph);

    /// <summary>A bare button: the safe answer, the cancel, the thing that costs nothing.</summary>
    public static ButtonComponent Ghost(UIPhrase title, string? icon = null)
        => Create(UIButtonVariant.Ghost, title, icon);

    /// <summary>
    /// The bare button naming a standard action; a destructive one's words and glyph in the danger colour. A dialog's own Cancel, Close or
    /// Done, which closes it as the viewer does, is <see cref="UIDialogs.CloseButton"/>.
    /// </summary>
    public static ButtonComponent Ghost(UIStandardAction action, bool glyph = false)
        => Create(UIButtonVariant.Ghost, action, glyph);

    /// <summary>The filled button in the danger colour, for the thing that cannot be undone.</summary>
    public static ButtonComponent Danger(UIPhrase title, string? icon = null)
        => Create(UIButtonVariant.Danger, title, icon);

    /// <summary>The danger button naming a standard action: Delete.</summary>
    public static ButtonComponent Danger(UIStandardAction action, bool glyph = false)
        => Create(UIButtonVariant.Danger, action, glyph);

    /// <summary>A button that reads as a link, for a way out that sits in prose or beside a pair.</summary>
    public static ButtonComponent Link(UIPhrase title, string? icon = null)
        => Create(UIButtonVariant.Link, title, icon);

    /// <summary>The link button naming a standard action; a destructive one's words in the danger colour.</summary>
    public static ButtonComponent Link(UIStandardAction action, bool glyph = false)
        => Create(UIButtonVariant.Link, action, glyph);

    /// <summary>An icon-only bare button; the tooltip is the only name it has, so it is required.</summary>
    /// <remarks>
    /// The button is returned, so a glyph and a name the controller holds — Send that turns into Stop — are bound on it:
    /// <c>Icon(send, word).BindIcon(path).BindTooltip(path)</c>, the written ones the bindings' fallback while their paths hold nothing.
    /// </remarks>
    public static ButtonComponent Icon(string icon, UIPhrase tooltip)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(icon);
        PresetWords.Require(tooltip);

        return new ButtonComponent().SetVariant(UIButtonVariant.Ghost).SetIcon(icon).SetTooltip(tooltip);
    }

    /// <summary>
    /// The pair at a form's foot: the safe answer first, the committing one last, both pushed to the far edge.
    /// </summary>
    public static StackPanelComponent Pair(ButtonComponent safe, ButtonComponent primary)
    {
        ArgumentNullException.ThrowIfNull(safe);
        ArgumentNullException.ThrowIfNull(primary);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetHorizontalAlignment(UIAlignment.End)
            .SetSpacing(8)
            // On a phone the two may not fit on one line: the primary goes under, still at the far edge, rather than past it.
            .SetWrap(true)
            .AddChild(safe)
            .AddChild(primary);
    }

    /// <summary>
    /// A row of buttons with a toolbar's tight air, starting at the near edge, the first one's glyph or quiet words on it — under a
    /// message, over an editor — its box hanging past it; a menu button (<c>UIIconButtons.More(items)</c>) among them.
    /// </summary>
    public static StackPanelComponent Toolbar(params IButtonComponent[] buttons)
    {
        ArgumentNullException.ThrowIfNull(buttons);

        // The words above and below the row start on the content's edge, so its first glyph does too, not its box (#214's rule).
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetGlyphEdge(UIAlignment.Start)
            .SetHorizontalAlignment(UIAlignment.Start)
            .SetSpacing(4)
            .SetWrap(true)
            .AddChildren([.. buttons]);
    }

    private static ButtonComponent Create(UIButtonVariant variant, UIPhrase title, string? icon)
    {
        PresetWords.Require(title);

        ButtonComponent button = new ButtonComponent().SetVariant(variant).SetTitle(title);

        return icon is null ? button : button.SetIcon(icon);
    }

    /// <summary>
    /// A standard action's words, its glyph where asked, and its danger as the action draws it on a button of <paramref name="variant"/>
    /// (<see cref="UIStandardAction.ButtonVariant"/>, <see cref="UIStandardAction.ButtonInk"/>).
    /// </summary>
    internal static ButtonComponent Create(UIButtonVariant variant, UIStandardAction action, bool glyph)
    {
        ButtonComponent button = Create(action.ButtonVariant(variant), new UIPhrase(action.Title), glyph ? action.Icon : null);

        return action.ButtonInk(variant) is UIThemeColor ink ? button.SetTitleColor(ink).SetIconColor(ink) : button;
    }
}
