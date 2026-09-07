using System.Collections.Generic;
using System.Globalization;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

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
    public partial UIBadgeType? StatusStyle { get; set; }

    [RecursiveMember]
    public partial string? Icon { get; set; }

    public static DemoDeploymentRow Create(string id, string service, string region, int replicas, string status, UIBadgeType statusStyle, string icon)
        => new()
        {
            Id = id,
            Service = service,
            Region = region,
            Replicas = replicas.ToString(CultureInfo.InvariantCulture),
            Status = status,
            StatusStyle = statusStyle,
            Icon = icon
        };

    /// <summary>The eight deployments every table page starts from.</summary>
    public static List<DemoDeploymentRow> CreateDeployments()
        =>
        [
            Create("payments-api", "Payments API", "eu-west-1", 12, "Healthy", UIBadgeType.Success, DemoIcons.Shield),
            Create("web-portal", "Web Portal", "eu-west-1", 4, "Healthy", UIBadgeType.Success, DemoIcons.LayoutDashboard),
            Create("search-indexer", "Search Indexer", "eu-central-1", 2, "Degraded", UIBadgeType.Warning, DemoIcons.Search),
            Create("mail-relay", "Mail Relay", "us-east-1", 1, "Paused", UIBadgeType.Surface, DemoIcons.Mail),
            Create("report-builder", "Report Builder", "us-east-1", 3, "Healthy", UIBadgeType.Success, DemoIcons.FileText),
            Create("notifier", "Notifier", "us-east-1", 2, "Healthy", UIBadgeType.Success, DemoIcons.Bell),
            Create("scheduler", "Scheduler", "ap-south-1", 1, "Healthy", UIBadgeType.Success, DemoIcons.Clock),
            Create("audit-log", "Audit Log", "ap-south-1", 2, "Failing", UIBadgeType.Danger, DemoIcons.History),
        ];
}

/// <summary>
/// The properties that answer for the whole table: its chrome, how it scrolls, and which rows are chosen.
/// </summary>
internal sealed partial class TableGroupContext : DemoGroupContext
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

    [RecursiveMember]
    public partial bool ResizableColumns { get; set; } = true;

    [RecursiveMember]
    public partial UIScrollMode? VerticalScroll { get; set; }

    [RecursiveMember]
    public partial UISelectionMode? SelectionMode { get; set; }

    [RecursiveMember]
    public partial string? SelectedKey { get; set; }

    [RecursiveMember]
    public partial IReadOnlyList<string>? SelectedKeys { get; set; }

    [RecursiveMember]
    public partial UISelectionStyle? SelectionStyle { get; set; }

    public TableGroupContext()
    {
        AddOption(nameof(Surface), CycleSurface, () => Surface);
        AddOption(nameof(ShowHeader), ToggleShowHeader, () => ShowHeader);
        AddOption(nameof(Striped), ToggleStriped, () => Striped);
        AddOption(nameof(ShowColumnSeparators), ToggleShowColumnSeparators, () => ShowColumnSeparators);
        AddOption(nameof(ShowRowSeparators), ToggleShowRowSeparators, () => ShowRowSeparators);
        AddOption(nameof(RowHoverable), ToggleRowHoverable, () => RowHoverable);
        AddOption(nameof(ResizableColumns), ToggleResizableColumns, () => ResizableColumns);
        AddOption(nameof(VerticalScroll), CycleVerticalScroll, () => VerticalScroll);
        AddOption(nameof(SelectionMode), CycleSelectionMode, () => SelectionMode);
        AddOption(nameof(SelectedKey), CycleSelectedKey, () => SelectedKey);
        AddOption(nameof(SelectedKeys), CycleSelectedKeys, () => SelectedKeys is null ? null : string.Join(", ", SelectedKeys));
        AddOption(nameof(SelectionStyle), CycleSelectionStyle, () => SelectionStyle);
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

    // The widths a viewer drags are kept in the browser under the table's name, not here.
    public void ToggleResizableColumns()
        => SetLastChange(nameof(ResizableColumns), ResizableColumns = !ResizableColumns);

    // Read against the preview's height cap: with Auto the rows scroll under the header, which stays put.
    public void CycleVerticalScroll()
        => SetLastChange(nameof(VerticalScroll), VerticalScroll = CycleEnum(VerticalScroll));

    // The mode picks which of the two key rows the table reads; the other shows a value nothing looks at.
    public void CycleSelectionMode()
        => SetLastChange(nameof(SelectionMode), SelectionMode = CycleEnum(SelectionMode));

    public void CycleSelectedKey()
        => SetLastChange(nameof(SelectedKey), SelectedKey = CycleValue(SelectedKey, null, "payments-api", "search-indexer"));

    public void CycleSelectedKeys()
        => SetLastChange(nameof(SelectedKeys), SelectedKeys = CycleValue(SelectedKeys, null, ["web-portal", "mail-relay"], ["scheduler"]));

    public void CycleSelectionStyle()
        => SetLastChange(nameof(SelectionStyle), SelectionStyle = CycleValue(SelectionStyle, null,
            UISelectionStyle.Marked(UISelectionMark.Left),
            UISelectionStyle.Ground(UIThemeColor.Accent),
            new UISelectionStyle(UIThemeColor.Primary, UIThemeColor.OnPrimary, UISelectionMark.None, null)
        ));
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

        Items.Add(DemoDeploymentRow.Create(id, string.Create(CultureInfo.InvariantCulture, $"Service {_added}"), "added", 1, "New", UIBadgeType.Info, DemoIcons.Star));
    }

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

        row.Service = row.Service.EndsWith('*') ? row.Service.TrimEnd('*') : $"{row.Service}*";
    }
}

internal sealed partial class TableMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial TableGroupContext TableGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableRowsGroupContext ItemsGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleTableOption(string id)
        => TableGroup.CycleOption(id);

    [UICommand]
    public void CycleItemsOption(string id)
        => ItemsGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
