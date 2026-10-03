using System;
using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.Message;

/// <summary>
/// What a message says: its title, its body, and whether it carries an action. The severity is the preset's own choice, so the
/// preview draws all four.
/// </summary>
internal sealed partial class MessageGroupContext : DemoGroupContext
{
    private const string SampleTitle = "Your trial ends in 3 days";
    private const string SampleBody = "The servers keep running; billing starts on the 14th unless the plan is cancelled.";

    [RecursiveMember]
    public partial string? Title { get; set; } = SampleTitle;

    [RecursiveMember]
    public partial string? Body { get; set; } = SampleBody;

    [RecursiveMember]
    public partial UIVisibility ActionVisibility { get; set; } = UIVisibility.Visible;

    public MessageGroupContext()
    {
        AddOption(nameof(Title), CycleTitle, () => Title);
        AddOption(nameof(Body), CycleBody, () => Body);
        AddOption("Action", ToggleAction, () => ActionVisibility == UIVisibility.Visible);
    }

    // A long title shows the wrap, and none leaves the body alone beside the mark.
    public void CycleTitle()
        => SetLastChange(nameof(Title), Title = CycleValue(Title, SampleTitle, "This workspace is read-only while the database moves to a larger server", null));

    public void CycleBody()
        => SetLastChange(nameof(Body), Body = CycleValue(Body, SampleBody, "Saved drafts are kept for 30 days.", null));

    public void ToggleAction()
        => SetLastChange("Action", (ActionVisibility = ActionVisibility == UIVisibility.Visible ? UIVisibility.Collapsed : UIVisibility.Visible) == UIVisibility.Visible);
}

/// <summary>
/// A message whose words the server rewrites: a status, read out by a screen reader as they change.
/// </summary>
internal sealed partial class SyncGroupContext : DemoGroupContext
{
    private int _runs;

    [RecursiveMember]
    public partial string SyncLine { get; set; } = "Nothing synced since the page opened.";

    public void Sync()
    {
        _runs++;
        SyncLine = $"Synced {_runs.ToString(CultureInfo.InvariantCulture)} {(_runs == 1 ? "time" : "times")}, last at {DateTime.Now.ToString("HH:mm:ss", CultureInfo.InvariantCulture)}: 214 files, nothing changed.";
        LogEvent("synced");
    }
}

/// <summary>
/// One message preset drawn in each severity, and every property that can be bound to it.
/// </summary>
internal sealed partial class MessageController() : DemoStandardController
{
    [RecursiveMember]
    public partial MessageGroupContext MessageGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext ActionGroup { get; set; } = new();

    [RecursiveMember]
    public partial SyncGroupContext SyncGroup { get; set; } = new();

    [UICommand]
    public void CycleMessageOption(string id)
        => MessageGroup.CycleOption(id);

    [UICommand]
    public void Upgrade()
        => ActionGroup.LogEvent("upgrade asked for");

    [UICommand]
    public void Sync()
        => SyncGroup.Sync();
}
