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

    // A note is opened from somewhere, so its header leads with Back: the browser's own, or the inbox where the tab has nothing of
    // the site behind it.
    protected override IVisualComponent? CreateHeader()
        => DemoUI.CreateHeader(Header, HeaderDescription, UIIconButtons.Back().InteractOn(EventNames.Click, new NavigateBackEffect("/screens/inbox")));

    protected override IVisualComponent CreateScreen()
        => UIPage.Column(UIColumnWidth.Reading, UILayout.Stack(24, CreateNote(), CreateWaysOff()))
            .SetPadding(UIThickness.All(0, 8, 0, 24))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// The note's two fields, each sending its value as the typing pauses — the controller weighs the flag as the value lands, so a
    /// leave pressed within the first pause is asked of the controller behind that value; the line under them says whether it is saved.
    /// </summary>
    /// <remarks>Both Tonal: the card already frames them.</remarks>
    private static CardComponent CreateNote()
        => UICard.Create("The note", "Saved only by Save: the controller holds unsaved work while the text differs from what it kept.", UILayout.Stack(16,
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
            UIText.Note().BindDescription(nameof(NoteEditorController.Status)),
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
        => UICard.Create("Ways off the page", "Who asks: the note's own dialog — Save, Don't save, Cancel — or, with the switch off, the framework's Leave or Stay.", UILayout.Stack(12,
            // Under the switch rather than its description, which keeps one line: the sentence reads whole on a phone.
            UIForm.Field(new SwitchComponent()
                .SetTitle("Ask in the note's own dialog")
                .BindValue(nameof(NoteEditorController.OwnDialog)),
                "Off, OnLeaveRequestedAsync hands the leave to the base."
            ),
            UIText.Paragraph("A press on any page in the sidebar, or on the link below, asks first. So does a command that answers with a NavigateEffect. The browser's back button, a reload or closing the tab ask the browser's own question instead — the only one a browser allows there. The arrow before the page's title is the browser's Back too, and asks as it does; with nothing of this site behind the tab, it goes to the inbox, asking first as a link does."),
            new LinkComponent().SetIcon(DemoIcons.Outline(DemoIcons.ArrowRight)).SetTitle("The inbox, by a link").SetUrl("/screens/inbox").SetHorizontalAlignment(UIAlignment.Start),
            UIButtons.Ghost("The inbox, by a command", DemoIcons.Outline(DemoIcons.Mail))
                .OnClick(nameof(NoteEditorController.OpenInbox))
                .SetHorizontalAlignment(UIAlignment.Start),
            UIText.Note("A link opened in a new tab, or with Ctrl or Shift held, is not a leave of this page: nothing asks.")
        ), DemoIcons.Outline(DemoIcons.Navigation));

    /// <summary>
    /// The preset's question with a middle answer: Cancel, Don't save, Save. A press beside it does not drop the leave, and Escape is
    /// Cancel — the note stays, as Cancel keeps it.
    /// </summary>
    protected override IReadOnlyList<UIDialog> CreateDialogs()
    {
        UIDialog leave = UIDialogs.BoundConfirm(
            NoteEditorController.LeaveDialogKey,
            "Save your changes?",
            nameof(NoteEditorController.LeaveQuestion),
            "Save",
            nameof(NoteEditorController.SaveAndLeave),
            UIButtonType.Primary,
            cancelCommand: nameof(NoteEditorController.StayOnNote),
            middle: UIButtons.Ghost("Don't save").OnClick(nameof(NoteEditorController.DiscardAndLeave))
        );

        // The screen's words are its content, the dialog's too.
        _ = ((StackPanelComponent)leave.Content).AsContentTree();

        return [leave];
    }
}
