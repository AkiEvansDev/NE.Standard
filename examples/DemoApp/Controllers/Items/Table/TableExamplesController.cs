using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.ItemsView;

namespace DemoApp.Controllers.Items.Table;

/// <summary>
/// The row a click or a cell's button named, written where the group's header shows it.
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
/// The rows in the order a release reaches them, which a drag or Alt+Up and Alt+Down changes.
/// </summary>
internal sealed partial class TableRolloutGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDeploymentRow> Rows { get; } = [.. DemoDeploymentRow.CreateDeployments().GetRange(0, 5)];

    /// <summary>Moves the row keyed <paramref name="id"/> to <paramref name="index"/>; the table moved nothing by itself.</summary>
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
/// What the examples need a controller for: a row that answers a click, rows put in order by a drag, and a source too large to send
/// whole.
/// </summary>
internal sealed partial class TableExamplesController : DemoController
{
    [RecursiveMember]
    public partial TableOpenGroupContext OpenGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableOpenGroupContext ActionGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableOpenGroupContext ChosenGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableRolloutGroupContext RolloutGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableRolloutGroupContext GripGroup { get; set; } = new();

    /// <summary>A hundred thousand generated rows, read a window at a time — the same source the items view's scenarios use.</summary>
    [RecursiveMember(false)]
    public DemoRowsSource Source { get; } = new();

    [UICommand]
    public void OpenRow(string id)
        => OpenGroup.Open(id);

    [UICommand]
    public void RestartRow(string id)
        => ActionGroup.Restart(id);

    [UICommand]
    public void OpenChosenRow(string id)
        => ChosenGroup.Open(id);

    [UICommand]
    public void MoveRolloutRow(string id, int index)
        => RolloutGroup.Move(id, index);

    [UICommand]
    public void MoveGripRow(string id, int index)
        => GripGroup.Move(id, index);
}
