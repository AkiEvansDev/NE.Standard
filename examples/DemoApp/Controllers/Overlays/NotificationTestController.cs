using System;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Overlays;

/// <summary>
/// Two targets and what each of them last did: the toast says how a deploy went, the line under it stays.
/// </summary>
internal sealed partial class DeployGroupContext : DemoGroupContext
{
    private int _release = 481;

    [RecursiveMember]
    public partial string Staging { get; set; } = "Staging: nothing deployed yet.";

    [RecursiveMember]
    public partial string Production { get; set; } = "Production: nothing deployed yet.";

    public int NextRelease()
        => ++_release;
}

/// <summary>
/// A job that takes a moment: the toast comes when the work is done, and the line says when.
/// </summary>
internal sealed partial class JobGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string LastRun { get; set; } = "The migration has not run yet.";
}

/// <summary>
/// One command with three things to say, and a counter for the ones pushed one at a time.
/// </summary>
internal sealed partial class StackGroupContext : DemoGroupContext
{
    private int _pushed;

    [RecursiveMember]
    public partial string Pushed { get; set; } = "Nothing pushed yet.";

    public int Push()
    {
        _pushed++;
        Pushed = $"{_pushed} pushed so far; each keeps its own timer.";

        return _pushed;
    }
}

internal sealed partial class NotificationTestController() : DemoController
{
    [RecursiveMember]
    public partial DeployGroupContext DeployGroup { get; set; } = new();

    [RecursiveMember]
    public partial JobGroupContext JobGroup { get; set; } = new();

    [RecursiveMember]
    public partial StackGroupContext StackGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext WrapGroup { get; set; } = new();

    [UICommand]
    public UICommandResult DeployStaging()
    {
        var release = DeployGroup.NextRelease();

        DeployGroup.Staging = $"Staging: release #{release}, deployed {DateTime.Now:HH:mm:ss}.";
        DeployGroup.LogEvent($"ShowNotification (Success) for #{release}");

        return UICommandResult.Ok([new ShowNotificationEffect($"Release #{release} deployed to staging.", UIColorStyle.Success)]);
    }

    /// <summary>
    /// Production takes every other release: a warning while it is checked, and the failure named when the check comes back.
    /// </summary>
    [UICommand]
    public UICommandResult DeployProduction()
    {
        var release = DeployGroup.NextRelease();

        if (release % 2 == 0)
        {
            DeployGroup.Production = $"Production: release #{release}, deployed {DateTime.Now:HH:mm:ss}.";
            DeployGroup.LogEvent($"ShowNotification (Success) for #{release}");

            return UICommandResult.Ok([new ShowNotificationEffect($"Release #{release} is live in production.", UIColorStyle.Success)]);
        }

        DeployGroup.Production = $"Production: release #{release} rolled back {DateTime.Now:HH:mm:ss} — the health check never went green.";
        DeployGroup.LogEvent($"ShowNotification (Warning, Danger) for #{release}");

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect($"Release #{release} is being health-checked.", UIColorStyle.Warning),
            new ShowNotificationEffect($"Release #{release} rolled back: the health check never went green.", UIColorStyle.Danger)
        ]);
    }

    [UICommand]
    public async Task<UICommandResult> RunMigrationAsync(CancellationToken cancellationToken)
    {
        JobGroup.LogEvent("running — nothing shows until the work is done");

        await Task.Delay(1800, cancellationToken).ConfigureAwait(false);

        JobGroup.LastRun = $"Last run {DateTime.Now:HH:mm:ss}: 12 tables migrated, nothing to roll back.";
        JobGroup.LogEvent("ShowNotification (Success) once the work was done");

        return UICommandResult.Ok([new ShowNotificationEffect("The migration finished: 12 tables.", UIColorStyle.Success)]);
    }

    /// <summary>
    /// Three at once, which is the case the host exists for: it stacks them and each keeps its own timer.
    /// </summary>
    [UICommand]
    public UICommandResult NotifyThree()
    {
        StackGroup.LogEvent("three effects in one result");

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect("Queued.", UIColorStyle.Info),
            new ShowNotificationEffect("Health-checked.", UIColorStyle.Primary),
            new ShowNotificationEffect("Deployed.", UIColorStyle.Success)
        ]);
    }

    [UICommand]
    public UICommandResult NotifyOneMore()
    {
        var pushed = StackGroup.Push();

        StackGroup.LogEvent($"pushed #{pushed}");

        return UICommandResult.Ok([new ShowNotificationEffect($"Pushed notification #{pushed}.", UIColorStyle.Accent)]);
    }

    [UICommand]
    public UICommandResult NotifyLong()
    {
        WrapGroup.LogEvent("a message that has to wrap");

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect("The staging deploy was rolled back because the health check at https://staging.orvane.example/healthz answered 503 for ninety seconds, which is longer than the window the release gate allows.", UIColorStyle.Danger)
        ]);
    }
}
