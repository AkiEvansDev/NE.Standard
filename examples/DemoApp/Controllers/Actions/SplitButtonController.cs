using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// The targets a deploy can go to, kept by the controller: the last one chosen is ticked and is where the main part deploys, and
/// a new target joins the list while the page is open.
/// </summary>
internal sealed partial class SplitButtonTargetsGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Targets { get; } =
    [
        Target("production", "Production", true),
        Target("staging", "Staging", false),
        Target("preview", "Preview", false)
    ];

    /// <summary>The main part: the ticked target, which is the one chosen last.</summary>
    public void Deploy()
    {
        foreach (MenuItem target in Targets)
        {
            if (target.Checked == true)
            {
                LogEvent($"Deployed to {target.Title}");
                return;
            }
        }
    }

    /// <summary>An entry: deploys there, and the tick moves to it so the main part deploys there next.</summary>
    public void DeployTo(string id)
    {
        foreach (MenuItem target in Targets)
            target.Checked = target.Id == id;

        Deploy();
    }

    public void AddTarget()
    {
        _added++;

        MenuItem target = Target($"preview-{_added}", $"Preview {_added}", false);

        Targets.Add(target);
        LogEvent($"Added {target.Title}");
    }

    // A check entry: the mark at its end is the tick, and exactly one target wears it.
    private static MenuItem Target(string id, string title, bool current)
        => new() { Id = id, Title = title, Kind = UIMenuItemKind.Check, Checked = current, Icon = DemoIcons.Outline(DemoIcons.Cloud) };
}

/// <summary>
/// One split button, and every property that can be bound to it — the button's own, since the menu adds no property; then the
/// deploy targets the examples keep.
/// </summary>
internal sealed partial class SplitButtonController() : DemoStandardController
{
    [RecursiveMember]
    public partial ButtonGroupContext ButtonGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Restart", "Graceful restart of api-eu-west-1");

    [RecursiveMember]
    public partial TextLayoutGroupContext LayoutGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [RecursiveMember]
    public partial SplitButtonTargetsGroupContext TargetsGroup { get; set; } = new();

    /// <summary>What was pressed last — the main part, or which entry — shown under the preview.</summary>
    [RecursiveMember]
    public partial string LastPress { get; set; } = "Nothing pressed yet.";

    [UICommand]
    public void Restart()
        => LastPress = "The main part: Restart.";

    [UICommand]
    public void RestartAs(string id)
        => LastPress = $"The menu: {id}.";

    [UICommand]
    public void Deploy()
        => TargetsGroup.Deploy();

    [UICommand]
    public void DeployTo(string id)
        => TargetsGroup.DeployTo(id);

    [UICommand]
    public void AddTarget()
        => TargetsGroup.AddTarget();

    [UICommand]
    public void CycleButtonOption(string id)
        => ButtonGroup.CycleOption(id);

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleLayoutOption(string id)
        => LayoutGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
