using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.ItemsView;
using NE.Standard.UI.Primitives.Annotations;

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
/// What the examples need a controller for: a row that answers a click, and a source too large to send whole.
/// </summary>
internal sealed partial class TableExamplesController : DemoController
{
    [RecursiveMember]
    public partial TableOpenGroupContext OpenGroup { get; set; } = new();

    [RecursiveMember]
    public partial TableOpenGroupContext ActionGroup { get; set; } = new();

    /// <summary>A hundred thousand generated rows, read a window at a time — the same source the items view's scenarios use.</summary>
    [RecursiveMember(false)]
    public DemoRowsSource Source { get; } = new();

    [UICommand]
    public void OpenRow(string id)
        => OpenGroup.Open(id);

    [UICommand]
    public void RestartRow(string id)
        => ActionGroup.Restart(id);
}
