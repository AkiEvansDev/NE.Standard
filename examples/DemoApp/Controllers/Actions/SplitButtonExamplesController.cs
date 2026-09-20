using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

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

internal sealed partial class SplitButtonExamplesController : DemoController
{
    [RecursiveMember]
    public partial SplitButtonTargetsGroupContext TargetsGroup { get; set; } = new();

    [UICommand]
    public void Deploy()
        => TargetsGroup.Deploy();

    [UICommand]
    public void DeployTo(string id)
        => TargetsGroup.DeployTo(id);

    [UICommand]
    public void AddTarget()
        => TargetsGroup.AddTarget();
}
