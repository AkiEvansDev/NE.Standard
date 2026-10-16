using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.TextArea;

/// <summary>
/// The multi-line field's own surface: its starting height, how far it grows, whether it may be resized, and its empty hint.
/// </summary>
internal sealed partial class TextAreaFieldGroupContext : FieldChromeGroupContext
{
    [RecursiveMember]
    public partial int? Rows { get; set; } = 3;

    [RecursiveMember]
    public partial int? MaxRows { get; set; }

    [RecursiveMember]
    public partial UITextAreaResizeMode? Resize { get; set; } = UITextAreaResizeMode.Vertical;

    public TextAreaFieldGroupContext() : base("What changed, and why")
    {
        AddAppearanceOption();
        AddPlaceholderOption();
        AddOption(nameof(Rows), CycleRows, () => Rows);
        AddOption(nameof(MaxRows), CycleMaxRows, () => MaxRows);
        AddOption(nameof(Resize), CycleResize, () => Resize);
    }

    public void CycleRows()
        => SetLastChange(nameof(Rows), Rows = CycleValue(Rows, 3, 6, 1, null));

    // Never below the most Rows steps to, so a bound pair stays one the setters would take; while it grows, Resize is off.
    public void CycleMaxRows()
        => SetLastChange(nameof(MaxRows), MaxRows = CycleValue(MaxRows, null, 6, 10));

    public void CycleResize()
        => SetLastChange(nameof(Resize), Resize = CycleEnum(Resize));
}

/// <summary>
/// A comment of the incident's thread: its author, its words, and whether the reader may edit it — only their own.
/// </summary>
internal sealed partial class DemoCommentItem : TextItem
{
    [RecursiveMember]
    public partial string Body { get; set; } = string.Empty;

    [RecursiveMember]
    public partial UIVisibility EditVisibility { get; set; } = UIVisibility.Collapsed;
}

/// <summary>
/// An incident's thread and the box under it. Enter posts what the box holds; the pencil on the reader's own comment puts it in the
/// box to be edited, Enter saves the edit, and Escape drops it — the only time Escape is the box's cancel, so a comment half written
/// survives an Escape.
/// </summary>
internal sealed partial class CommentsGroupContext : DemoGroupContext
{
    private int _posted;
    // The comment being edited, and what the box held before the edit, which the edit's end gives back.
    private DemoCommentItem? _editing;
    private string? _draftBefore;

    [RecursiveMember]
    public partial string? Draft { get; set; }

    /// <summary>Whether an edit is under way; the box's <c>CancelOnEscape</c> is bound to it.</summary>
    [RecursiveMember]
    public partial bool Editing { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<DemoCommentItem> Comments { get; } =
    [
        new() { Id = "c1", IsContent = true, Title = "Grace Kim", Body = "eu-west's lease outlived the failover by ninety seconds. The stale reads all came from there." },
        new() { Id = "c2", IsContent = true, Title = "You", Body = "Lease timeout is 120 s on eu-west, 30 s everywhere else.", EditVisibility = UIVisibility.Visible }
    ];

    /// <summary>Enter in the box: saves the edit under way, or posts the box's words as a new comment of the reader's.</summary>
    public void Post()
    {
        var words = Draft?.Trim();

        // Enter on an empty box still runs the command; there is nothing to post then.
        if (string.IsNullOrEmpty(words))
            return;

        if (_editing is not null)
        {
            _editing.Body = words;
            LogEvent($"{_editing.Id} edited");
            EndEdit();
            return;
        }

        _posted++;
        Comments.Add(new DemoCommentItem { Id = string.Create(CultureInfo.InvariantCulture, $"posted-{_posted}"), IsContent = true, Title = "You", Body = words, EditVisibility = UIVisibility.Visible });
        Draft = null;
        LogEvent($"posted-{_posted} posted");
    }

    private void EndEdit()
    {
        Draft = _draftBefore;
        _draftBefore = null;
        _editing = null;
        Editing = false;
    }

    /// <summary>Puts the comment keyed <paramref name="id"/> in the box to be edited, keeping what the box held for the edit's end.</summary>
    public void Edit(string id)
    {
        foreach (DemoCommentItem comment in Comments)
        {
            if (comment.Id != id || comment.EditVisibility != UIVisibility.Visible)
                continue;

            if (_editing is null)
                _draftBefore = Draft;

            _editing = comment;
            Draft = comment.Body;
            Editing = true;
            LogEvent($"editing {id}");
            return;
        }
    }

    // Escape has already put the comment's words back in the box and sent nothing: the edit ends, and the draft before it returns.
    public void DropEdit()
    {
        LogEvent($"the edit of {_editing?.Id} was dropped");
        EndEdit();
    }
}

/// <summary>
/// One command per options section, each dispatching to the row its key names; and the comment box's Enter and Escape.
/// </summary>
internal sealed partial class TextAreaController() : DemoStandardController
{
    [RecursiveMember]
    public partial TextAreaValueGroupContext ValueGroup { get; set; } = new("Rolls the new plan-upgrade flow out behind a flag.", "Reverts the timeout change from 2.3.");

    [RecursiveMember]
    public partial TextAreaFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Release notes");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [RecursiveMember]
    public partial CommentsGroupContext CommentsGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleFieldOption(string id)
        => FieldGroup.CycleOption(id);

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);

    [UICommand]
    public void PostComment()
        => CommentsGroup.Post();

    [UICommand]
    public void EditComment(string id)
        => CommentsGroup.Edit(id);

    [UICommand]
    public void DropCommentEdit()
        => CommentsGroup.DropEdit();
}
