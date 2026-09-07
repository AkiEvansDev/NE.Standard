using System;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

/// <summary>
/// A list of places to go: which way it runs, how much air is between the entries, whether it is folded to
/// its icons — and the four things one entry may say about itself.
/// </summary>
/// <remarks>The entries live here because the last rows step them rather than the menu.</remarks>
internal sealed partial class MenuGroupContext : DemoGroupContext
{
    private const string OverviewId = "overview";
    private const string DeploysId = "deploys";
    private const string LogsId = "logs";
    private const string SettingsId = "settings";
    private const string SampleShortcut = "Ctrl+L";

    [RecursiveMember]
    public partial UIOrientation? Orientation { get; set; }

    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    [RecursiveMember]
    public partial bool Expanded { get; set; } = true;

    [RecursiveMember]
    public partial UISelectionStyle? SelectionStyle { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Entries { get; } =
    [
        new() { Id = "workspace", Kind = UIMenuItemKind.Header, Title = "Workspace" },
        new() { Id = OverviewId, Title = "Overview", Icon = DemoIcons.Outline(DemoIcons.LayoutDashboard), Selected = true },
        new() { Id = DeploysId, Title = "Deploys", Icon = DemoIcons.Outline(DemoIcons.Upload), BadgeText = "3" },
        new() { Id = LogsId, Title = "Logs", Icon = DemoIcons.Outline(DemoIcons.FileText), Shortcut = SampleShortcut },
        new() { Id = "rule", Kind = UIMenuItemKind.Separator },
        new() { Id = SettingsId, Title = "Settings", Icon = DemoIcons.Outline(DemoIcons.Settings) }
    ];

    public MenuGroupContext()
    {
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
        AddOption(nameof(Expanded), ToggleExpanded, () => Expanded);
        AddOption(nameof(SelectionStyle), CycleSelectionStyle, () => SelectionStyle);
        AddOption("Deploys selected", ToggleDeploysSelected, () => Entry(DeploysId).Selected);
        AddOption("Deploys badge", CycleDeploysBadge, () => Entry(DeploysId).BadgeText);
        AddOption("Logs enabled", ToggleLogsEnabled, () => Entry(LogsId).Enabled);
        AddOption("Logs shortcut", ToggleLogsShortcut, () => Entry(LogsId).Shortcut);
        AddOption("Settings visible", ToggleSettingsVisible, () => Entry(SettingsId).Visibility?.Base);
    }

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, null, 0d, 8d, 16d));

    // The author's answer for how the menu opens; the viewer's own choice is kept in the browser and may differ.
    public void ToggleExpanded()
        => SetLastChange(nameof(Expanded), Expanded = !Expanded);

    // The mark moved to the other edge, taken away, and a ground with its own ink in place of the wash.
    public void CycleSelectionStyle()
        => SetLastChange(nameof(SelectionStyle), SelectionStyle = CycleValue(SelectionStyle, null,
            UISelectionStyle.Marked(UISelectionMark.Right, UIThemeColor.Accent),
            UISelectionStyle.Marked(UISelectionMark.None),
            new UISelectionStyle(UIThemeColor.Primary, UIThemeColor.OnPrimary, UISelectionMark.None, null),
            new UISelectionStyle(null, null, null, null, Bold: true)
        ));

    // Marking one clears the other: the menu enforces nothing, the current page is the controller's fact.
    public void ToggleDeploysSelected()
    {
        MenuItem deploys = Entry(DeploysId);
        var selected = deploys.Selected != true;

        deploys.Selected = selected;
        Entry(OverviewId).Selected = !selected;
    }

    public void CycleDeploysBadge()
    {
        MenuItem deploys = Entry(DeploysId);

        deploys.BadgeText = CycleValue(deploys.BadgeText, null, "3", "12");
    }

    public void ToggleLogsEnabled()
    {
        MenuItem logs = Entry(LogsId);

        logs.Enabled = logs.Enabled == false;
    }

    public void ToggleLogsShortcut()
    {
        MenuItem logs = Entry(LogsId);

        logs.Shortcut = CycleValue(logs.Shortcut, null, SampleShortcut);
    }

    public void ToggleSettingsVisible()
    {
        MenuItem settings = Entry(SettingsId);
        var visible = settings.Visibility?.Base != UIVisibility.Collapsed;

        settings.Visibility = visible ? UIVisibility.Collapsed : UIVisibility.Visible;
    }

    public void Report(string message)
        => LogEvent(message);

    private MenuItem Entry(string id)
    {
        foreach (MenuItem entry in Entries)
        {
            if (entry.Id == id)
                return entry;
        }

        throw new InvalidOperationException($"Entry '{id}' is not in the menu.");
    }
}

/// <summary>
/// A row of things to press: which way it runs, whether it wraps when the row is longer than the room, how
/// much air is between the buttons — and what one button may say about itself.
/// </summary>
/// <remarks><c>Wrap</c> is read against the frame's own width, so the Standard section's <c>Width</c> row is its other half.</remarks>
internal sealed partial class CommandBarGroupContext : DemoGroupContext
{
    private const string SaveId = "save";
    private const string DeleteId = "delete";
    private const string ExportId = "export";

    [RecursiveMember]
    public partial UIOrientation? Orientation { get; set; }

    [RecursiveMember]
    public partial bool Wrap { get; set; }

    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    [RecursiveMember]
    public partial UIGroupSeparator? GroupSeparator { get; set; }

    // Three groups, so the separator row has boundaries to draw; one primary, one danger, ghosts between, as a toolbar reads.
    [RecursiveMember(false)]
    public RecursiveCollection<ButtonItem> Commands { get; } =
    [
        new() { Id = SaveId, Title = "Save", Icon = DemoIcons.Outline(DemoIcons.Check), Type = UIButtonType.Primary, Group = "draft" },
        new() { Id = "discard", Title = "Discard", Icon = DemoIcons.Outline(DemoIcons.Undo), Type = UIButtonType.Ghost, Group = "draft" },
        new() { Id = "duplicate", Title = "Duplicate", Icon = DemoIcons.Outline(DemoIcons.Copy), Type = UIButtonType.Ghost, Group = "copy" },
        new() { Id = ExportId, Title = "Export", Icon = DemoIcons.Outline(DemoIcons.Download), Type = UIButtonType.Ghost, Enabled = false, Group = "copy" },
        new() { Id = DeleteId, Title = "Delete", Icon = DemoIcons.Outline(DemoIcons.Close), Type = UIButtonType.Danger, Group = "danger" }
    ];

    public CommandBarGroupContext()
    {
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Wrap), ToggleWrap, () => Wrap);
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
        AddOption(nameof(GroupSeparator), CycleGroupSeparator, () => GroupSeparator);
        AddOption("Save type", CycleSaveType, () => Command(SaveId).Type);
        AddOption("Save size", CycleSaveSize, () => Command(SaveId).Size);
        AddOption("Export enabled", ToggleExportEnabled, () => Command(ExportId).Enabled);
        AddOption("Delete visible", ToggleDeleteVisible, () => Command(DeleteId).Visibility?.Base);
    }

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void ToggleWrap()
        => SetLastChange(nameof(Wrap), Wrap = !Wrap);

    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, null, 4d, 12d, 24d));

    public void CycleGroupSeparator()
        => SetLastChange(nameof(GroupSeparator), GroupSeparator = CycleEnum(GroupSeparator));

    // Stepped on one button rather than on the bar: the bar has no type of its own.
    public void CycleSaveType()
    {
        ButtonItem save = Command(SaveId);

        save.Type = CycleEnum(save.Type);
    }

    public void CycleSaveSize()
    {
        ButtonItem save = Command(SaveId);

        save.Size = CycleEnum(save.Size);
    }

    public void ToggleExportEnabled()
    {
        ButtonItem export = Command(ExportId);

        export.Enabled = export.Enabled == false;
    }

    public void ToggleDeleteVisible()
    {
        ButtonItem delete = Command(DeleteId);
        var visible = delete.Visibility?.Base != UIVisibility.Collapsed;

        delete.Visibility = visible ? UIVisibility.Collapsed : UIVisibility.Visible;
    }

    public void Report(string message)
        => LogEvent(message);

    private ButtonItem Command(string id)
    {
        foreach (ButtonItem command in Commands)
        {
            if (command.Id == id)
                return command;
        }

        throw new InvalidOperationException($"Command '{id}' is not on the bar.");
    }
}
