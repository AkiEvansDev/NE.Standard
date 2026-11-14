using System;
using System.Collections.Generic;
using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Items.Table;

/// <summary>
/// One row of the tables on the table pages: a deployment, in the words its columns show.
/// </summary>
internal sealed partial class DemoDeploymentRow : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public string Id { get; init; } = string.Empty;

    [RecursiveMember]
    public partial string Service { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Region { get; set; } = string.Empty;

    // Text rather than a number: a cell shows the row's own words, and a count is formatted by whoever owns the row.
    [RecursiveMember]
    public partial string Replicas { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Status { get; set; } = string.Empty;

    [RecursiveMember]
    public partial UIBadgeVariant? StatusVariant { get; set; }

    [RecursiveMember]
    public partial string? Icon { get; set; }

    public static DemoDeploymentRow Create(string id, string service, string region, int replicas, string status, UIBadgeVariant statusVariant, string icon)
        => new()
        {
            Id = id,
            Service = service,
            Region = region,
            Replicas = replicas.ToString(CultureInfo.InvariantCulture),
            Status = status,
            StatusVariant = statusVariant,
            Icon = icon
        };

    /// <summary>The eight deployments every table page starts from.</summary>
    public static List<DemoDeploymentRow> CreateDeployments()
        =>
        [
            Create("billing", "Billing", "eu-west", 12, "Healthy", UIBadgeVariant.Success, DemoIcons.Shield),
            Create("panel", "Panel", "eu-west", 4, "Healthy", UIBadgeVariant.Success, DemoIcons.LayoutDashboard),
            Create("dns", "DNS", "eu-west", 2, "Degraded", UIBadgeVariant.Warning, DemoIcons.Link),
            Create("mail-relay", "Mail Relay", "us-east", 1, "Paused", UIBadgeVariant.Surface, DemoIcons.Mail),
            Create("metrics", "Metrics", "us-east", 3, "Healthy", UIBadgeVariant.Success, DemoIcons.FileText),
            Create("status-page", "Status Page", "us-east", 2, "Healthy", UIBadgeVariant.Success, DemoIcons.Bell),
            Create("scheduler", "Scheduler", "ap-south", 1, "Healthy", UIBadgeVariant.Success, DemoIcons.Clock),
            Create("audit-log", "Audit Log", "ap-south", 2, "Failing", UIBadgeVariant.Danger, DemoIcons.History),
        ];
}

/// <summary>
/// Table surface, header, striping, separators, and row hover wash.
/// </summary>
internal sealed partial class TableAppearanceGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UISurfaceStyle? Surface { get; set; } = UISurfaceStyle.Background;

    [RecursiveMember]
    public partial bool ShowHeader { get; set; } = true;

    [RecursiveMember]
    public partial bool Striped { get; set; }

    [RecursiveMember]
    public partial bool ShowColumnSeparators { get; set; }

    [RecursiveMember]
    public partial bool ShowRowSeparators { get; set; } = true;

    [RecursiveMember]
    public partial bool RowHoverable { get; set; }

    public TableAppearanceGroupContext()
    {
        AddOption(nameof(Surface), CycleSurface, () => Surface);
        AddOption(nameof(ShowHeader), ToggleShowHeader, () => ShowHeader);
        AddOption(nameof(Striped), ToggleStriped, () => Striped);
        AddOption(nameof(ShowColumnSeparators), ToggleShowColumnSeparators, () => ShowColumnSeparators);
        AddOption(nameof(ShowRowSeparators), ToggleShowRowSeparators, () => ShowRowSeparators);
        AddOption(nameof(RowHoverable), ToggleRowHoverable, () => RowHoverable);
    }

    public void CycleSurface()
        => SetLastChange(nameof(Surface), Surface = CycleEnum(Surface));

    public void ToggleShowHeader()
        => SetLastChange(nameof(ShowHeader), ShowHeader = !ShowHeader);

    public void ToggleStriped()
        => SetLastChange(nameof(Striped), Striped = !Striped);

    public void ToggleShowColumnSeparators()
        => SetLastChange(nameof(ShowColumnSeparators), ShowColumnSeparators = !ShowColumnSeparators);

    public void ToggleShowRowSeparators()
        => SetLastChange(nameof(ShowRowSeparators), ShowRowSeparators = !ShowRowSeparators);

    public void ToggleRowHoverable()
        => SetLastChange(nameof(RowHoverable), RowHoverable = !RowHoverable);
}

/// <summary>
/// Table column sizing, column reordering, and scroll modes.
/// </summary>
internal sealed partial class TableColumnsGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool ResizableColumns { get; set; } = true;

    [RecursiveMember]
    public partial bool ReorderableColumns { get; set; }

    [RecursiveMember]
    public partial UIScrollMode? HorizontalScroll { get; set; } = UIScrollMode.Auto;

    [RecursiveMember]
    public partial UIScrollMode? VerticalScroll { get; set; }

    public TableColumnsGroupContext()
    {
        AddOption(nameof(ResizableColumns), ToggleResizableColumns, () => ResizableColumns);
        AddOption(nameof(ReorderableColumns), ToggleReorderableColumns, () => ReorderableColumns);
        AddOption(nameof(HorizontalScroll), CycleHorizontalScroll, () => HorizontalScroll);
        AddOption(nameof(VerticalScroll), CycleVerticalScroll, () => VerticalScroll);
    }

    // The widths a viewer drags are kept in the browser under the table's name, not here.
    public void ToggleResizableColumns()
        => SetLastChange(nameof(ResizableColumns), ResizableColumns = !ResizableColumns);

    public void ToggleReorderableColumns()
        => SetLastChange(nameof(ReorderableColumns), ReorderableColumns = !ReorderableColumns);

    public void CycleHorizontalScroll()
        => SetLastChange(nameof(HorizontalScroll), HorizontalScroll = CycleEnum(HorizontalScroll));

    // Read against the preview's height cap: with Auto the rows scroll under the header, which stays put.
    public void CycleVerticalScroll()
        => SetLastChange(nameof(VerticalScroll), VerticalScroll = CycleEnum(VerticalScroll));
}

/// <summary>
/// The rows themselves: each option prints the collection's state, and pressing it moves the collection.
/// </summary>
internal sealed partial class TableRowsGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<DemoDeploymentRow> Items { get; } = [.. DemoDeploymentRow.CreateDeployments()];

    public TableRowsGroupContext()
    {
        AddOption("Add", AddRow, () => Items.Count);
        AddOption("Remove", RemoveRow, () => Items.Count);
        AddOption("Rename last", RenameLast, () => Items.Count == 0 ? null : Items[^1].Service);
    }

    public void AddRow()
    {
        var id = string.Create(CultureInfo.InvariantCulture, $"service-{++_added}");

        Items.Add(DemoDeploymentRow.Create(id, string.Create(CultureInfo.InvariantCulture, $"Service {_added}"), "added", 1, "New", UIBadgeVariant.Info, DemoIcons.Star));
    }

    public void MoveRow(string id, int index)
        => MoveByKey(Items, id, index);

    public void RemoveRow()
    {
        if (Items.Count > 0)
            _ = Items.Remove(Items[^1]);
    }

    /// <summary>
    /// Mutates the last row's first cell in place, which shows a cell's binding is live.
    /// </summary>
    public void RenameLast()
    {
        if (Items.Count == 0)
            return;

        DemoDeploymentRow row = Items[^1];

        row.Service = row.Service.EndsWith('*', StringComparison.Ordinal) ? row.Service.TrimEnd('*') : $"{row.Service}*";
    }
}

/// <summary>
/// The row a click or a cell's button named, written in the line under the group.
/// </summary>
internal sealed partial class TableOpenGroupContext : DemoGroupContext
{
    public void Open(string id)
        => LogEvent($"Opened {id}");

    public void Restart(string id)
        => LogEvent($"Restart requested for {id}");
}

/// <summary>
/// A service and the servers it runs on: a row whose cell lists a collection of its own.
/// </summary>
internal sealed partial class DemoServiceServers : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public string Id { get; init; } = string.Empty;

    [RecursiveMember]
    public partial string Service { get; set; } = string.Empty;

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Servers { get; } = [];
}

/// <summary>
/// The rows in the order a release reaches them, which the grip or Alt+Up and Alt+Down changes.
/// </summary>
internal sealed partial class TableRolloutGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDeploymentRow> Rows { get; } = [.. DemoDeploymentRow.CreateDeployments().GetRange(0, 5)];

    /// <summary>Moves the row keyed <paramref name="id"/> to <paramref name="index"/>, as the drop asked.</summary>
    public void Move(string id, int index)
    {
        for (var i = 0; i < Rows.Count; i++)
        {
            if (Rows[i].Id != id)
                continue;

            Rows.Move(i, index);
            LogEvent($"{Rows[index].Service} -> place {index + 1}");
            return;
        }
    }
}

/// <summary>
/// One table and every property that can be bound to it, and what the examples need a controller for: a cell's button and a row
/// that opens, and rows put in order by a grip.
/// </summary>
internal sealed partial class TableController() : DemoStandardController
{
    [RecursiveMember]
    public partial TableAppearanceGroupContext AppearanceGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableColumnsGroupContext ColumnsGroup { get; set; } = new();

    [RecursiveMember]
    public partial SelectionGroupContext SelectionGroup { get; set; } = new(["billing", "dns"], [["panel", "mail-relay"], ["scheduler"]]);

    [RecursiveMember]
    public partial ReorderGroupContext ReorderGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableRowsGroupContext ItemsGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableOpenGroupContext ActionGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableOpenGroupContext ChosenGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableOpenGroupContext PressedGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableRolloutGroupContext GripGroup { get; set; } = new();

    [UICommand]
    public void MoveRow(string id, int index)
        => ItemsGroup.MoveRow(id, index);

    [UICommand]
    public void RestartRow(string id)
        => ActionGroup.Restart(id);

    [UICommand]
    public void OpenChosenRow(string id)
        => ChosenGroup.Open(id);

    [UICommand]
    public void OpenPressedRow(string id)
        => PressedGroup.Open(id);

    [UICommand]
    public void MoveGripRow(string id, int index)
        => GripGroup.Move(id, index);
}
