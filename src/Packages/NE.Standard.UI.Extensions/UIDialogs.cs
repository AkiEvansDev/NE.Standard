using System;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
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
/// the server but the dialog's own <c>OnClose</c>. A confirmation and a form are the other kind: a question, or fields, answered by the
/// buttons at their foot, with no ×. Every one is named for a screen reader by the title it shows (<see cref="UIDialog.TitleId"/>), so
/// a bound title names it as it changes; a <c>Bound*</c> twin takes the words the controller holds, as its own words.
/// </summary>
public static class UIDialogs
{
    /// <summary>
    /// A dialog with its header over <paramref name="content"/>, named by its title; a <paramref name="width"/> keeps its content to a
    /// column — the screen's width on a phone — and the rest of the dialog keeps its defaults, changed with
    /// <c>with { CloseOnBackdrop = false }</c>.
    /// </summary>
    public static UIDialog Create(string key, UIPhrase title, IVisualComponent content, string? icon = null, UIColumnWidth? width = null)
        => Dialog(key, Content(key, title, content, icon), width);

    /// <summary>The same with a title the controller holds at <paramref name="titlePath"/> — the thing's name, Add or Edit — as its own words.</summary>
    public static UIDialog BoundCreate(string key, string titlePath, IVisualComponent content, string? icon = null, UIColumnWidth? width = null)
        => Dialog(key, BoundContent(key, titlePath, content, icon), width);

    /// <summary>The dialog around its content, named by its header's title, its content in a column where one is named.</summary>
    private static UIDialog Dialog(string key, StackPanelComponent content, UIColumnWidth? width)
    {
        if (width is not UIColumnWidth column)
            return new UIDialog { Key = key, TitleId = TitleId(key), Content = content };

        return new UIDialog
        {
            Key = key,
            TitleId = TitleId(key),
            // The column is the dialog's size, so it is held to the screen alone, not to the cap of a dialog sized to its content.
            MaxWidth = UILayoutLength.Fill(),
            Content = content.SetMinWidth(ColumnMinWidth(column))
        };
    }

    /// <summary>
    /// The least width a dialog's content takes in a named column: the screen's below the tier the column fits at, the column from it —
    /// a form's and a text's from the medium breakpoint, the wide one, more than a tablet holds, from the extra-large.
    /// </summary>
    private static UIResponsive<UILayoutLength> ColumnMinWidth(UIColumnWidth width)
    {
        UILayoutLength column = UILayoutLength.Absolute(UIPage.Pixels(width));

        return width == UIColumnWidth.Wide
            ? UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), xl: column)
            : UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), md: column);
    }

    /// <summary>
    /// The header over <paramref name="content"/>, for a dialog laid out or set otherwise — a sheet, a height:
    /// <c>new UIDialog { Key = key, TitleId = UIDialogs.TitleId(key), Content = UIDialogs.Content(key, title, body), … }</c>.
    /// </summary>
    public static StackPanelComponent Content(string key, UIPhrase title, IVisualComponent content, string? icon = null)
        => Body(Header(key, title, icon), content);

    /// <summary>The same with a title the controller holds at <paramref name="titlePath"/>, as its own words.</summary>
    public static StackPanelComponent BoundContent(string key, string titlePath, IVisualComponent content, string? icon = null)
        => Body(BoundHeader(key, titlePath, icon), content);

    private static StackPanelComponent Body(ContainerComponent header, IVisualComponent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        return UILayout.Stack(16, header, content);
    }

    /// <summary>
    /// The header alone: the mark where one is given, the title, and the × at the far end, on one line, the ×'s glyph on the content's
    /// edge. The title carries <see cref="TitleId"/>, so a dialog built around the header is named by it.
    /// </summary>
    public static ContainerComponent Header(string key, UIPhrase title, string? icon = null)
        => Header(key, Title(key, title, null), icon);

    /// <summary>The header with a title the controller holds at <paramref name="titlePath"/>, as its own words.</summary>
    public static ContainerComponent BoundHeader(string key, string titlePath, string? icon = null)
        => Header(key, Title(key, null, titlePath), icon);

    private static ContainerComponent Header(string key, TextComponent title, string? icon)
    {
        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        // The mark is the title's own, on its line: one line of words needs no column of its own for it. The × stands its glyph on the
        // content's edge, as a band's end icon does (GlyphEdge), not its box.
        return new ContainerComponent()
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(title.AsTitle().SetIcon(icon).SetVerticalAlignment(UIAlignment.Center).SetPlacement(1, 1, 23, 1))
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetGlyphEdge(UIAlignment.End)
                .SetMargin(UIThickness.All(8, 0, 0, 0))
                .SetVerticalAlignment(UIAlignment.Center)
                .AddChild(ClosesAsViewer(UIIconButtons.Close().SetSize(UIButtonSize.Small), key))
                .SetPlacement(24, 1, 1, 1)
            );
    }

    /// <summary>
    /// The viewer's own close of the dialog: the form's held edits put back first, so a form opened again shows what the server holds,
    /// then the close <c>OnClose</c> hears, as Escape's.
    /// </summary>
    private static ButtonComponent ClosesAsViewer(ButtonComponent button, string key)
        => button
            .InteractOn(EventNames.Click, new DiscardFormEffect(key))
            .InteractOn(EventNames.Click, new CloseDialogEffect(key) { RaisesClose = true });

    /// <summary>
    /// A dialog's title, carrying the id that names the dialog: <paramref name="title"/> written, or bound at
    /// <paramref name="titlePath"/> as the controller's words (a path to a key still translates).
    /// </summary>
    private static TextComponent Title(string key, UIPhrase? title, string? titlePath)
    {
        TextComponent text = new(TitleId(key));

        if (titlePath is null)
        {
            PresetWords.Require(title);

            return text.SetTitle(title);
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        return text.BindTitle(titlePath).AsContent(TextComponent.TitleProperty);
    }

    /// <summary>
    /// The id the title of a preset's dialog carries — its header's, a form's, a confirmation's question — which names the dialog
    /// (<see cref="UIDialog.TitleId"/>).
    /// </summary>
    public static string TitleId(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return key + "-title";
    }

    /// <summary>
    /// The dialog's own answer that closes it as the viewer does — Cancel, or <paramref name="action"/> (Close, Done) — in
    /// <paramref name="type"/>: the held edits of the dialog's form (<see cref="DiscardFormEffect"/>) are put back and the dialog closes
    /// on the page, raising its <c>OnClose</c> as Escape does, with nothing asked of the server.
    /// </summary>
    public static ButtonComponent CloseButton(string key, UIStandardAction? action = null, UIButtonType type = UIButtonType.Ghost)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return ClosesAsViewer(UIButtons.Create(type, action ?? UIStandardAction.Cancel, glyph: false), key);
    }

    /// <summary>
    /// A form in a dialog — rename it, invite someone, change a password: its title in the title role and an optional muted line under
    /// it, <paramref name="content"/>, and at its foot the standard Cancel (<see cref="CloseButton"/>) and <paramref name="primary"/>. A
    /// form's column wide from the medium breakpoint (<see cref="UIColumnWidth.Form"/>), the dialog's whole width on a phone. No ×, since
    /// Cancel says it, and a press beside it loses nothing typed: the backdrop does not close it, Escape does.
    /// </summary>
    /// <remarks>
    /// The dialog is a form, its key the form's id: each field of the content with no form of its own joins it, so Enter in a one-line
    /// field presses <paramref name="primary"/>, whose press — its command given with <c>OnClick</c> or <c>OnClickShowingLoading</c> —
    /// first judges the fields' Submit rules and stops on an error, waits for their uploads, and sends the values a field bound
    /// <c>OnSubmit</c> held; a field bound two-way still writes as it changes. Cancel puts the held values back.
    /// </remarks>
    public static UIDialog Form(string key, UIPhrase title, UIPhrase? description, IVisualComponent content, ButtonComponent primary)
        => Form(key, title, description, content, CloseButton(key), primary);

    /// <summary>The same with a safe answer of the author's own in Cancel's place.</summary>
    public static UIDialog Form(string key, UIPhrase title, UIPhrase? description, IVisualComponent content, ButtonComponent safe, ButtonComponent primary)
    {
        PresetWords.RequireIfGiven(description);

        return Form(key, Title(key, title, null), description is null ? null : new ParagraphComponent().SetDescription(description), content, safe, primary);
    }

    /// <summary>The form around its words: the heading, the content joined to the dialog's form, and the pair, in a form's column.</summary>
    private static UIDialog Form(string key, TextComponent title, ParagraphComponent? line, IVisualComponent content, ButtonComponent safe, ButtonComponent primary)
    {
        ArgumentNullException.ThrowIfNull(content);
        ArgumentNullException.ThrowIfNull(safe);
        ArgumentNullException.ThrowIfNull(primary);

        StackPanelComponent heading = UILayout.Stack(4, title.AsTitle().SetTitleWrap(true));

        // A note, as UIText.Note draws one.
        if (line is not null)
            _ = heading.AddChild(line.SetDescriptionType(UITextAppearance.Caption).Muted());

        JoinForm(content, key);

        // The primary's own command, given with OnClick, becomes the form's submit; one already submitting another form keeps it.
        primary.SubmitFormId ??= key;

        return Dialog(key, UILayout.Stack(16, heading, content, UIButtons.Pair(safe, primary)), UIColumnWidth.Form) with { CloseOnBackdrop = false };
    }

    /// <summary>
    /// Joins every field under <paramref name="component"/> with no form of its own, written or bound, to the dialog's; a context menu's
    /// fields are no part of the form.
    /// </summary>
    private static void JoinForm(IVisualComponent component, string formId)
    {
        if (component is IInputComponent { FormId: null } input && !PresetBindings.Binds(input, IInputComponent.FormIdProperty))
            input.FormId = formId;

        foreach (UIComponentTreeSlot slot in UIComponentTree.EnumerateSlots(component))
        {
            if (slot.Kind != UIComponentSlotKind.ContextMenu)
                JoinForm(slot.Root, formId);
        }
    }

    /// <summary>
    /// The same with words the controller holds — the title at <paramref name="titlePath"/> (Add or Edit), the line at
    /// <paramref name="descriptionPath"/> where there is one (the folder it imports into) — as its own words, drawn plain; a path to a
    /// key still translates. Dialogs stand at the view's root, so the paths are the controller's.
    /// </summary>
    public static UIDialog BoundForm(string key, string titlePath, string? descriptionPath, IVisualComponent content, ButtonComponent primary)
        => BoundForm(key, titlePath, descriptionPath, content, CloseButton(key), primary);

    /// <summary>The bound form with a safe answer of the author's own in Cancel's place.</summary>
    public static UIDialog BoundForm(string key, string titlePath, string? descriptionPath, IVisualComponent content, ButtonComponent safe, ButtonComponent primary)
        => Form(key, Title(key, null, titlePath), BoundLine(descriptionPath), content, safe, primary);

    /// <summary>A dialog's line bound at <paramref name="path"/> where one is given: the controller's words, content and plain.</summary>
    private static ParagraphComponent? BoundLine(string? path)
    {
        if (path is null)
            return null;

        ArgumentException.ThrowIfNullOrWhiteSpace(path);

        // Bound words are data, never markup: a name with an asterisk in it is shown as typed.
        return new ParagraphComponent().BindDescription(path).AsContent(ParagraphComponent.DescriptionProperty).SetDescriptionPlain(true);
    }

    /// <summary>The question alone — "Sign out?" — with no words under it.</summary>
    public static UIDialog Confirm(string key, UIPhrase question, UIPhrase confirmWord, string confirmCommand, UIButtonType confirmType = UIButtonType.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
        => Confirm(key, question, (ParagraphComponent?)null, confirmWord, confirmCommand, confirmType, cancelCommand, middle);

    /// <summary>
    /// A question asked before something is done — "Delete this note?" — over its words, answered by Cancel and one committing button,
    /// <paramref name="middle"/> (a "Don't save") between them where given. No ×, since Cancel says it; the backdrop does not close it,
    /// and Escape is Cancel. Cancel closes it on the page and raises its <c>OnClose</c>, which runs <paramref name="cancelCommand"/>
    /// where there is one; the committing button runs <paramref name="confirmCommand"/>, which closes the dialog itself. The question
    /// names the dialog.
    /// </summary>
    public static UIDialog Confirm(string key, UIPhrase question, UIPhrase? body, UIPhrase confirmWord, string confirmCommand, UIButtonType confirmType = UIButtonType.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
    {
        PresetWords.RequireIfGiven(body);

        return Confirm(key, question, body is null ? null : new ParagraphComponent().SetDescription(body), confirmWord, confirmCommand, confirmType, cancelCommand, middle);
    }

    /// <summary>
    /// The same with words of the author's own beyond words alone — a link to what goes, an emphasis — given the dialog's text role
    /// here; words the controller holds are <see cref="BoundConfirm"/>.
    /// </summary>
    public static UIDialog Confirm(string key, UIPhrase question, ParagraphComponent? body, UIPhrase confirmWord, string confirmCommand, UIButtonType confirmType = UIButtonType.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
        => Confirm(key, Title(key, question, null), body, confirmWord, confirmCommand, confirmType, cancelCommand, middle);

    /// <summary>The confirmation around its question and words, given the dialog's text roles here.</summary>
    private static UIDialog Confirm(string key, TextComponent question, ParagraphComponent? body, UIPhrase confirmWord, string confirmCommand, UIButtonType confirmType, string? cancelCommand, ButtonComponent? middle)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(confirmCommand);

        if (confirmType is not (UIButtonType.Primary or UIButtonType.Danger))
            throw new ArgumentException("A confirmation commits with a primary or a danger button.", nameof(confirmType));

        if (cancelCommand is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(cancelCommand);

        // A close the viewer makes, as Escape's: OnClose hears both, so a controller cancelling on one cancels on the other.
        ButtonComponent cancel = CloseButton(key);
        ButtonComponent confirm = (confirmType == UIButtonType.Danger ? UIButtons.Danger(confirmWord) : UIButtons.Primary(confirmWord)).OnClick(confirmCommand);

        // The safe answer first, where the focus lands as the dialog opens, and the committing one last.
        StackPanelComponent answers = middle is null ? UIButtons.Pair(cancel, confirm) : UIButtons.Pair(cancel, middle).AddChild(confirm);

        // The framework's own leave dialog's measures: the question a subtitle, its words a body line 8 px under it, the answers 16 px
        // under those. The question is prose, so it wraps.
        StackPanelComponent words = UILayout.Stack(8, question.AsSubtitle().SetTitleWrap(true));

        if (body is not null)
            _ = words.AddChild(body.SetDescriptionType(UITextAppearance.Body).SetDescriptionColor(UIThemeColor.Default));

        UIDialog dialog = new()
        {
            Key = key,
            TitleId = TitleId(key),
            // A press beside a question is no answer to it; Escape is, as Cancel's key.
            CloseOnBackdrop = false,
            Content = UILayout.Stack(16, words, answers).SetMinWidth(UILayoutLength.Absolute(320))
        };

        return cancelCommand is null ? dialog : dialog.OnClose(cancelCommand);
    }

    /// <summary>
    /// The question with words the controller holds at <paramref name="bodyPath"/> — "Delete «Groceries» and its 12 notes?" — as its own
    /// words, drawn plain (a name in them is the thing's own, never a key that happens to match it, nor markup; a path to a key still
    /// translates); otherwise <see cref="Confirm(string, UIPhrase, UIPhrase, UIPhrase, string, UIButtonType, string?, ButtonComponent?)"/>.
    /// </summary>
    public static UIDialog BoundConfirm(string key, UIPhrase question, string bodyPath, UIPhrase confirmWord, string confirmCommand, UIButtonType confirmType = UIButtonType.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(bodyPath);

        // The question stays written: a path in its place would turn every written question into one naming nothing.
        return Confirm(key, Title(key, question, null), BoundLine(bodyPath), confirmWord, confirmCommand, confirmType, cancelCommand, middle);
    }
}
