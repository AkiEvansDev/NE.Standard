using System;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A dialog headed by its mark, its title and an × that closes it: the × closes it on the page as Escape does, with nothing asked of
/// the server but the dialog's own <c>OnClose</c>, and the title names the dialog for a screen reader. A confirmation is the other
/// kind: a question answered by its buttons, with no header.
/// </summary>
public static class UIDialogs
{
    /// <summary>A dialog with its header over <paramref name="content"/>, named by its title; the rest of the dialog keeps its defaults.</summary>
    public static UIDialog Create(string key, string title, IVisualComponent content, string? icon = null)
        => new() { Key = key, Label = title, Content = Content(key, title, content, icon) };

    /// <summary>
    /// The header over <paramref name="content"/>, for a dialog that sets more of its own (a width, a sheet, no backdrop close):
    /// <c>new UIDialog { Key = key, Label = title, Content = UIDialogs.Content(key, title, body), Width = … }</c>.
    /// </summary>
    public static StackPanelComponent Content(string key, string title, IVisualComponent content, string? icon = null)
    {
        ArgumentNullException.ThrowIfNull(content);

        return UILayout.Stack(16, Header(key, title, icon), content);
    }

    /// <summary>The header alone: the mark where one is given, the title, and the × at the far end, on one line.</summary>
    public static ContainerComponent Header(string key, string title, string? icon = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentException.ThrowIfNullOrWhiteSpace(title);

        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        ButtonComponent close = UIIconButtons.Close()
            .SetSize(UIButtonSize.Small)
            .SetMargin(UIThickness.All(8, 0, 0, 0))
            .SetPlacement(24, 1, 1, 1);

        // A close the viewer makes, as Escape's: the dialog's OnClose hears it.
        _ = close.InteractOn(EventNames.Click, new CloseDialogEffect(key) { RaisesClose = true });

        // The mark is the title's own, on its line: one line of words needs no column of its own for it.
        return new ContainerComponent()
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(UIText.Title(title).SetIcon(icon).SetVerticalAlignment(UIAlignment.Center).SetPlacement(1, 1, 23, 1))
            .AddChild(close);
    }

    /// <summary>
    /// A question asked before something is done — "Delete this note?" — over its words, answered by Cancel and one committing button,
    /// <paramref name="middle"/> (a "Don't save") between them where given. No ×, since Cancel says it; the backdrop does not close it,
    /// and Escape is Cancel. Cancel closes it on the page and raises its <c>OnClose</c>, which runs <paramref name="cancelCommand"/>
    /// where there is one; the committing button runs <paramref name="confirmCommand"/>, which closes the dialog itself.
    /// </summary>
    public static UIDialog Confirm(string key, string question, UIPhrase? body, string confirmWord, string confirmCommand, UIButtonType confirmType = UIButtonType.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
        => Confirm(key, question, body is null ? null : new ParagraphComponent().SetDescription(body), confirmWord, confirmCommand, confirmType, cancelCommand, middle);

    /// <summary>
    /// The same with words of the author's own — bound to what the controller says, for a question naming the thing it is about — given
    /// the dialog's text role here.
    /// </summary>
    public static UIDialog Confirm(string key, string question, ParagraphComponent? body, string confirmWord, string confirmCommand, UIButtonType confirmType = UIButtonType.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentException.ThrowIfNullOrWhiteSpace(question);
        ArgumentException.ThrowIfNullOrWhiteSpace(confirmCommand);

        if (confirmType is not (UIButtonType.Primary or UIButtonType.Danger))
            throw new ArgumentException("A confirmation commits with a primary or a danger button.", nameof(confirmType));

        if (cancelCommand is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(cancelCommand);

        ButtonComponent cancel = UIButtons.Ghost(UIStandardAction.Cancel.Word);

        // A close the viewer makes, as Escape's: OnClose hears both, so a controller cancelling on one cancels on the other.
        _ = cancel.InteractOn(EventNames.Click, new CloseDialogEffect(key) { RaisesClose = true });

        ButtonComponent confirm = (confirmType == UIButtonType.Danger ? UIButtons.Danger(confirmWord) : UIButtons.Primary(confirmWord)).OnClick(confirmCommand);

        // The safe answer first, where the focus lands as the dialog opens, and the committing one last.
        StackPanelComponent answers = middle is null ? UIButtons.Pair(cancel, confirm) : UIButtons.Pair(cancel, middle).AddChild(confirm);

        // The framework's own leave dialog's measures: the question a subtitle, its words a body line 8 px under it, the answers 16 px
        // under those. The question is prose, so it wraps.
        StackPanelComponent words = UILayout.Stack(8, UIText.Subtitle(question).SetTitleWrap(true));

        if (body is not null)
            _ = words.AddChild(body.SetDescriptionType(UITextAppearance.Body).SetDescriptionColor(UIThemeColor.Default));

        UIDialog dialog = new()
        {
            Key = key,
            Label = question,
            // A press beside a question is no answer to it; Escape is, as Cancel's key.
            CloseOnBackdrop = false,
            Content = UILayout.Stack(16, words, answers).SetMinWidth(UILayoutLength.Absolute(320))
        };

        return cancelCommand is null ? dialog : dialog.OnClose(cancelCommand);
    }
}
