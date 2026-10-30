using System.Collections.Generic;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// A bar whose buttons are the controller's, and the record of which was pressed.
/// </summary>
/// <remarks>One class for every bar on the page; only the buttons differ.</remarks>
internal sealed partial class CommandListGroupContext(IEnumerable<ButtonItem> commands) : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<ButtonItem> Commands { get; } = [.. commands];
}

/// <summary>
/// The actions a deploy offers, which depend on the state it is in.
/// </summary>
internal sealed partial class DeployActionsGroupContext : DemoGroupContext
{
    private const string PromoteId = "promote";
    private const string RetryId = "retry";

    [RecursiveMember]
    public partial string State { get; set; } = "Succeeded";

    [RecursiveMember]
    public partial UIBadgeVariant StateVariant { get; set; } = UIBadgeVariant.Success;

    [RecursiveMember(false)]
    public RecursiveCollection<ButtonItem> Actions { get; } =
    [
        new() { Id = PromoteId, Title = "Promote", Icon = DemoIcons.Outline(DemoIcons.Upload), Variant = UIButtonVariant.Primary },
        new() { Id = "rollback", Title = "Roll back", Icon = DemoIcons.Outline(DemoIcons.Undo), Variant = UIButtonVariant.Ghost },
        new() { Id = "logs", Title = "Logs", Icon = DemoIcons.Outline(DemoIcons.FileText), Variant = UIButtonVariant.Ghost }
    ];

    /// <summary>
    /// Swaps promote for retry when a deploy fails; the bar draws whatever the collection holds.
    /// </summary>
    public void Fail()
    {
        State = "Failed";
        StateVariant = UIBadgeVariant.Danger;

        RemoveAction(PromoteId);

        if (!HasAction(RetryId))
            Actions.Insert(0, new ButtonItem { Id = RetryId, Title = "Retry", Icon = DemoIcons.Outline(DemoIcons.Refresh), Variant = UIButtonVariant.Primary });

        LogEvent("Deploy failed — Promote is gone and Retry is there");
    }

    public void Succeed()
    {
        State = "Succeeded";
        StateVariant = UIBadgeVariant.Success;

        RemoveAction(RetryId);

        if (!HasAction(PromoteId))
            Actions.Insert(0, new ButtonItem { Id = PromoteId, Title = "Promote", Icon = DemoIcons.Outline(DemoIcons.Upload), Variant = UIButtonVariant.Primary });

        LogEvent("Deploy succeeded — Promote is back");
    }

    private bool HasAction(string id)
    {
        foreach (ButtonItem action in Actions)
        {
            if (action.Id == id)
                return true;
        }

        return false;
    }

    private void RemoveAction(string id)
    {
        foreach (ButtonItem action in Actions)
        {
            if (action.Id == id)
            {
                _ = Actions.Remove(action);
                return;
            }
        }
    }
}

/// <summary>
/// One command bar, and every property that can be bound to it or to its buttons; then the example bars, and the one command each
/// reports through.
/// </summary>
internal sealed partial class CommandBarController() : DemoStandardController
{
    [RecursiveMember]
    public partial CommandBarGroupContext BarGroup { get; set; } = new();

    [RecursiveMember]
    public partial CommandListGroupContext ToolbarGroup { get; set; } = new(
    [
        new ButtonItem { Id = "undo", Icon = DemoIcons.Outline(DemoIcons.Undo), Tooltip = "Undo", Variant = UIButtonVariant.Ghost, Size = UISize.Small, Group = "edit" },
        new ButtonItem { Id = "copy", Icon = DemoIcons.Outline(DemoIcons.Copy), Tooltip = "Copy", Variant = UIButtonVariant.Ghost, Size = UISize.Small, Group = "edit" },
        new ButtonItem { Id = "edit", Icon = DemoIcons.Outline(DemoIcons.Edit), Tooltip = "Edit", Variant = UIButtonVariant.Ghost, Size = UISize.Small, Group = "edit" },
        new ButtonItem { Id = "star", Icon = DemoIcons.Outline(DemoIcons.Star), Tooltip = "Star", Variant = UIButtonVariant.Ghost, Size = UISize.Small, Group = "mark" },
        new ButtonItem { Id = "share", Icon = DemoIcons.Outline(DemoIcons.Send), Tooltip = "Share", Variant = UIButtonVariant.Ghost, Size = UISize.Small, Group = "out" },
        new ButtonItem { Id = "download", Icon = DemoIcons.Outline(DemoIcons.Download), Tooltip = "Download", Variant = UIButtonVariant.Ghost, Size = UISize.Small, Group = "out" },
        // A group of its own: the rule sets the destructive tool apart, so it is hard to reach by accident.
        new ButtonItem { Id = "delete", Icon = DemoIcons.Outline(DemoIcons.Alert), Tooltip = "Delete", Variant = UIButtonVariant.Danger, Size = UISize.Small, Group = "danger" }
    ]);

    [RecursiveMember]
    public partial CommandListGroupContext RailGroup { get; set; } = new(
    [
        new ButtonItem { Id = "reply", Icon = DemoIcons.Outline(DemoIcons.Send), Tooltip = "Reply", Variant = UIButtonVariant.Ghost },
        new ButtonItem { Id = "star", Icon = DemoIcons.Outline(DemoIcons.Star), Tooltip = "Star", Variant = UIButtonVariant.Ghost },
        new ButtonItem { Id = "archive", Icon = DemoIcons.Outline(DemoIcons.History), Tooltip = "Archive", Variant = UIButtonVariant.Ghost },
        new ButtonItem { Id = "delete", Icon = DemoIcons.Outline(DemoIcons.Close), Tooltip = "Delete", Variant = UIButtonVariant.Ghost }
    ]);

    [RecursiveMember]
    public partial DeployActionsGroupContext DeployGroup { get; set; } = new();

    /// <summary>
    /// One command for the whole bar, told which button by its key.
    /// </summary>
    [UICommand]
    public void Press(string id)
        => BarGroup.LogEvent($"'{id}' pressed");

    [UICommand]
    public void PressToolbar(string id)
        => ToolbarGroup.LogEvent($"'{id}' pressed");

    [UICommand]
    public void PressRail(string id)
        => RailGroup.LogEvent($"'{id}' pressed");

    [UICommand]
    public void PressDeployAction(string id)
        => DeployGroup.LogEvent($"'{id}' pressed");

    [UICommand]
    public void FailDeploy()
        => DeployGroup.Fail();

    [UICommand]
    public void SucceedDeploy()
        => DeployGroup.Succeed();
}
