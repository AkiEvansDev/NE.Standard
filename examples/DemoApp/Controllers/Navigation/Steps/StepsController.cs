using System;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Navigation.Steps;

/// <summary>
/// A rollout whose later steps cannot be chosen until the earlier ones have been reached: <c>CanSelect</c> opens each step as the
/// rollout advances, and every visited step stays selectable so the operator can look back.
/// </summary>
internal sealed partial class LockedStepsContext : DemoGroupContext
{
    private int _furthest;

    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = "snapshot";

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Steps { get; } =
    [
        new() { Id = "snapshot", Title = "Snapshot", Description = "db-eu-west-1 · 184 GB", CanSelect = true },
        new() { Id = "replica", Title = "Replica", Description = "Promote standby in eu-north", CanSelect = false },
        new() { Id = "traffic", Title = "Traffic", Description = "Move read/write pool", CanSelect = false }
    ];

    public void Advance()
    {
        var current = CurrentIndex();
        var next = Math.Min(current + 1, Steps.Count - 1);

        _furthest = Math.Max(_furthest, next);
        Steps[_furthest].CanSelect = true;
        SelectedKey = Steps[next].Id;
        LogEvent($"Step → {Steps[next].Title}");
    }

    private int CurrentIndex()
    {
        for (var i = 0; i < Steps.Count; i++)
        {
            if (string.Equals(Steps[i].Id, SelectedKey, StringComparison.Ordinal))
                return i;
        }

        return 0;
    }

    public void Reset()
    {
        _furthest = 0;
        Steps[1].CanSelect = false;
        Steps[2].CanSelect = false;
        SelectedKey = Steps[0].Id;
        LogEvent("Reset rollout to Snapshot");
    }
}

/// <summary>
/// A sequence of steps where pressing a step also runs a command naming the step's key.
/// </summary>
internal sealed partial class CommandStepsContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = "build";

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Steps { get; } =
    [
        new() { Id = "build", Title = "Build", Description = "2m 14s · linux-x64" },
        new() { Id = "verify", Title = "Verify", Description = "1 420 checks passed" },
        new() { Id = "release", Title = "Release", Description = "eu-west, eu-north" }
    ];

    public void Inspect(string key)
        => LogEvent($"Inspected '{key}'");
}

/// <summary>
/// A sequence of wizard steps and the two ways an application drives it: by <c>SelectedKey</c> rules on the page, or by unlocking steps
/// from the controller as each one is completed.
/// </summary>
internal sealed partial class StepsController() : DemoStandardController
{
    [RecursiveMember]
    public partial StepsGroupContext StepsGroup { get; set; } = new();

    [RecursiveMember]
    public partial LockedStepsContext Locked { get; set; } = new();

    [RecursiveMember]
    public partial CommandStepsContext Command { get; set; } = new();

    [UICommand]
    public void AdvanceLocked()
        => Locked.Advance();

    [UICommand]
    public void ResetLocked()
        => Locked.Reset();

    [UICommand]
    public void InspectStep(string id)
        => Command.Inspect(id);
}
