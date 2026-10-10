using System.Collections.Generic;
using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>
/// A note being edited, and every way off its page: the sidebar, a link, a command that navigates, the browser's back and reload.
/// While the note holds unsaved changes the first three ask before the page goes, and the browser asks its own question for the rest.
/// A switch picks who asks: the note's own dialog, or the framework's.
/// </summary>
internal sealed class NoteEditorView : DemoScreenView, IUIViewDefinition
{
    public static string ViewKey => "demo.screens.notes";

    protected override string ComponentRoute => "/screens/notes";
    protected override string Header => "demo.screens.notes.header";
    protected override string HeaderDescription => "demo.screens.notes.description";

    protected override IVisualComponent CreateScreen()
        => UILayout.Stack(24, CreateNote(), CreateWaysOff())
            .SetMaxWidth(UILayoutLength.Absolute(760))
            .SetPadding(UIThickness.All(0, 8, 0, 24))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// The note's two fields, each sending its value as the typing pauses — the controller weighs the flag as the value lands, so a
    /// leave pressed within the first pause is asked of the controller behind that value; the line under them says whether it is saved.
    /// </summary>
    /// <remarks>Both Tonal: the card already frames them.</remarks>
    private static CardComponent CreateNote()
        => UIPage.Card("The note", "Saved only by Save: the controller holds unsaved work while the text differs from what it kept.", UILayout.Stack(16,
            new TextInputComponent()
                .SetTitle("Title")
                .SetAppearance(UIInputAppearance.Tonal)
                .SetDebounceMilliseconds(300)
                .BindValue(nameof(NoteEditorController.Title)),
            new TextAreaComponent()
                .SetTitle("Text")
                .SetAppearance(UIInputAppearance.Tonal)
                .SetRows(6)
                .SetDebounceMilliseconds(300)
                .BindValue(nameof(NoteEditorController.Body)),
            UIText.Note(string.Empty).BindDescription(nameof(NoteEditorController.Status)),
            UIButtons.Pair(
                UIButtons.Ghost("Revert").OnClick(nameof(NoteEditorController.Revert)),
                // Ctrl+S from anywhere on the page, the fields included: the browser's own save of the page never opens.
                UIButtons.Primary("Save").OnClick(nameof(NoteEditorController.Save)).SetShortcut("Ctrl+S")
            )
        ), DemoIcons.Outline(DemoIcons.FileText));

    /// <summary>
    /// One of each way off the page, what each does while the note holds unsaved changes, and the switch between the two questions —
    /// a controller that overrides <c>OnLeaveRequestedAsync</c> and one that leaves it to the framework.
    /// </summary>
    private static CardComponent CreateWaysOff()
        => UIPage.Card("Ways off the page", "Who asks: the note's own dialog — Save, Don't save, Cancel — or, with the switch off, the framework's Leave or Stay.", UILayout.Stack(12,
            UILayout.Stack(2,
                new SwitchComponent()
                    .SetTitle("Ask in the note's own dialog")
                    .BindValue(nameof(NoteEditorController.OwnDialog)),
                // Under the switch rather than its description, which keeps one line: the sentence reads whole on a phone.
                UIText.Note("Off, OnLeaveRequestedAsync hands the leave to the base.").SetMargin(UIThickness.All(44, 0, 0, 0))
            ),
            UIText.Paragraph("A press on any page in the sidebar, or on the link below, asks first. So does a command that answers with a NavigateEffect. The browser's back button, a reload or closing the tab ask the browser's own question instead — the only one a browser allows there."),
            new LinkComponent().SetIcon(DemoIcons.Outline(DemoIcons.ArrowRight)).SetTitle("The inbox, by a link").SetUrl("/screens/inbox").SetHorizontalAlignment(UIAlignment.Start),
            UIButtons.Secondary("The inbox, by a command", DemoIcons.Outline(DemoIcons.Mail))
                .OnClick(nameof(NoteEditorController.OpenInbox))
                .SetHorizontalAlignment(UIAlignment.Start),
            UIText.Note("A link opened in a new tab, or with Ctrl or Shift held, is not a leave of this page: nothing asks.")
        ), DemoIcons.Outline(DemoIcons.Navigation));

    // Only its three buttons answer it: the backdrop and Escape would drop the leave without saying which way.
    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => [
            new UIDialog
            {
                Key = NoteEditorController.LeaveDialogKey,
                Label = "Unsaved changes",
                CloseOnBackdrop = false,
                CloseOnEscape = false,
                // The framework's own leave dialog's measures: a Subtitle, a Body line 8 px under it, the answers 16 px under that.
                Content = UILayout.Stack(16,
                    UILayout.Stack(8,
                        UIText.Subtitle("Save your changes?").SetTitleWrap(true),
                        UIText.Paragraph(string.Empty)
                            .BindDescription(nameof(NoteEditorController.LeaveQuestion))
                            .SetDescriptionType(UITextAppearance.Body)
                            .SetDescriptionColor(UIThemeColor.Default)
                    ),
                    UILayout.Row(8,
                        UIButtons.Ghost("Cancel").OnClick(nameof(NoteEditorController.StayOnNote)),
                        UIButtons.Secondary("Don't save").OnClick(nameof(NoteEditorController.DiscardAndLeave)),
                        UIButtons.Primary("Save").OnClick(nameof(NoteEditorController.SaveAndLeave))
                    )
                    .SetHorizontalAlignment(UIAlignment.End)
                )
                .AsContentTree()
                .SetMinWidth(UILayoutLength.Absolute(320))
            }
        ];
}
