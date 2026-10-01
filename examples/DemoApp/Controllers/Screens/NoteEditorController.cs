using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;

namespace DemoApp.Controllers.Screens;

/// <summary>
/// A note as a notes page keeps one: the text on the page is a draft, Save keeps it, and while the draft differs from what is kept
/// the page holds unsaved work — a press in the sidebar, a link or a command that navigates asks first, and closing, reloading or
/// going back asks the browser's own question. Who asks is the reader's switch: the note's own Save / Don't save / Cancel, or the
/// framework's Leave / Stay.
/// </summary>
internal sealed partial class NoteEditorController : UIControllerBase
{
    public const string LeaveDialogKey = "note-leave";
    private const string FirstTitle = "Release 482, the notes";
    private const string FirstBody = "Rolled out region by region, the rollout pausing itself when the error rate doubled.\n\nStill to write: the numbers from the second day, and who pressed the button.";

    private static readonly PathSegment TitleSegment = PathSegment.ForProperty(nameof(Title));
    private static readonly PathSegment BodySegment = PathSegment.ForProperty(nameof(Body));

    private string _keptTitle = FirstTitle;
    private string _keptBody = FirstBody;

    // Where the reader was going when the dialog asked; the dialog's two leaving answers go there.
    private string? _leaveTarget;

    /// <summary>Weighed as the value lands, so a leave asked behind the first keystrokes' value meets the flag they set.</summary>
    [RecursiveMember(false)]
    public string? Title
    {
        get;
        set
        {
            if (SetRecursiveProperty(ref field, value, TitleSegment))
                Weigh();
        }
    } = FirstTitle;

    [RecursiveMember(false)]
    public string? Body
    {
        get;
        set
        {
            if (SetRecursiveProperty(ref field, value, BodySegment))
                Weigh();
        }
    } = FirstBody;

    [RecursiveMember]
    public partial string Status { get; set; } = "Saved. Type in the note, then leave the page any way you like.";

    /// <summary>On, a leave asks in the note's own dialog; off, the framework asks in its place.</summary>
    [RecursiveMember]
    public partial bool OwnDialog { get; set; } = true;

    [RecursiveMember]
    public partial string LeaveQuestion { get; set; } = string.Empty;

    [UICommand]
    public void Save()
        => Keep();

    [UICommand]
    public void Revert()
    {
        Discard();
        Status = "Back to what was saved.";
    }

    /// <summary>The page holds unsaved work while the draft differs from what is kept, and says so.</summary>
    private void Weigh()
    {
        HoldsUnsavedWork = !string.Equals(Title ?? string.Empty, _keptTitle, StringComparison.Ordinal) || !string.Equals(Body ?? string.Empty, _keptBody, StringComparison.Ordinal);
        Status = HoldsUnsavedWork ? "Unsaved changes: every way off the page asks now." : "Saved.";
    }

    /// <summary>A command that navigates: while the note holds unsaved work, its NavigateEffect asks as a link does.</summary>
    [UICommand]
    public static UICommandResult OpenInbox()
        => UICommandResult.Ok([new NavigateEffect("/screens/inbox")]);

    /// <summary>Keeps the draft: the page holds nothing unsaved any more.</summary>
    private void Keep()
    {
        _keptTitle = Title ?? string.Empty;
        _keptBody = Body ?? string.Empty;
        HoldsUnsavedWork = false;
        Status = $"Saved at {DateTime.Now.ToString("HH:mm:ss", CultureInfo.InvariantCulture)}.";
    }

    /// <summary>Lets the draft go: the fields show what is kept again.</summary>
    private void Discard()
    {
        Title = _keptTitle;
        Body = _keptBody;
        Status = "The changes were let go.";
    }

    /// <summary>
    /// With the switch off, the base's answer: the framework's own Leave / Stay. With it on, the note's dialog, which remembers where
    /// the reader was going.
    /// </summary>
    protected override Task<UICommandResult> OnLeaveRequestedAsync(string target, CancellationToken cancellationToken)
    {
        if (!OwnDialog)
            return base.OnLeaveRequestedAsync(target, cancellationToken);

        _leaveTarget = target;
        LeaveQuestion = $"“{Title}” has changes that are not saved. Save them before going to {target}?";

        return Task.FromResult(UICommandResult.Ok([new OpenDialogEffect(LeaveDialogKey)]));
    }

    /// <summary>Keeps the draft, then leaves: the flag is off by the time the navigation runs, so nothing asks again.</summary>
    [UICommand]
    public UICommandResult SaveAndLeave()
    {
        Keep();

        return Leave();
    }

    [UICommand]
    public UICommandResult DiscardAndLeave()
    {
        Discard();

        return Leave();
    }

    [UICommand]
    public UICommandResult StayOnNote()
    {
        _leaveTarget = null;

        return UICommandResult.Ok([new CloseDialogEffect(LeaveDialogKey)]);
    }

    private UICommandResult Leave()
    {
        var target = _leaveTarget;

        _leaveTarget = null;

        return target is null
            ? UICommandResult.Ok([new CloseDialogEffect(LeaveDialogKey)])
            : UICommandResult.Ok([new CloseDialogEffect(LeaveDialogKey), new NavigateEffect(target)]);
    }
}
