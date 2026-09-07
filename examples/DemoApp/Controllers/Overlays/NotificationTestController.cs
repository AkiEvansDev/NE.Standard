using System;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Overlays;

/// <summary>
/// Two targets and what each of them last did: the toast says how a deploy went, the line under it stays.
/// </summary>
internal sealed partial class DeployGroupContext : DemoGroupContext
{
    private int _build = 481;

    [RecursiveMember]
    public partial string Staging { get; set; } = "Staging: nothing deployed yet.";

    [RecursiveMember]
    public partial string Production { get; set; } = "Production: nothing deployed yet.";

    public int NextBuild()
        => ++_build;

    public void Report(string message)
        => LogEvent(message);
}

/// <summary>
/// A job that takes a moment: the toast comes when the work is done, and the line says when.
/// </summary>
internal sealed partial class JobGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string LastRun { get; set; } = "The migration has not run yet.";

    public void Report(string message)
        => LogEvent(message);
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

    public void Report(string message)
        => LogEvent(message);
}

internal sealed partial class WrapGroupContext : DemoGroupContext
{
    public void Report(string message)
        => LogEvent(message);
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
    public partial WrapGroupContext WrapGroup { get; set; } = new();

    [UICommand]
    public UICommandResult DeployStaging()
    {
        var build = DeployGroup.NextBuild();

        DeployGroup.Staging = $"Staging: build #{build}, deployed {DateTime.Now:HH:mm:ss}.";
        DeployGroup.Report($"ShowNotification (Success) for #{build}");

        return UICommandResult.Ok([new ShowNotificationEffect($"Build #{build} deployed to staging.", UIColorStyle.Success)]);
    }

    /// <summary>
    /// Production takes every other build: a warning while it is checked, and the failure named when the check comes back.
    /// </summary>
    [UICommand]
    public UICommandResult DeployProduction()
    {
        var build = DeployGroup.NextBuild();

        if (build % 2 == 0)
        {
            DeployGroup.Production = $"Production: build #{build}, deployed {DateTime.Now:HH:mm:ss}.";
            DeployGroup.Report($"ShowNotification (Success) for #{build}");

            return UICommandResult.Ok([new ShowNotificationEffect($"Build #{build} is live in production.", UIColorStyle.Success)]);
        }

        DeployGroup.Production = $"Production: build #{build} rolled back {DateTime.Now:HH:mm:ss} — the health check never went green.";
        DeployGroup.Report($"ShowNotification (Warning, Danger) for #{build}");

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect($"Build #{build} is being health-checked.", UIColorStyle.Warning),
            new ShowNotificationEffect($"Build #{build} rolled back: the health check never went green.", UIColorStyle.Danger)
        ]);
    }

    [UICommand]
    public async Task<UICommandResult> RunMigrationAsync(CancellationToken cancellationToken)
    {
        JobGroup.Report("running — nothing shows until the work is done");

        await Task.Delay(1800, cancellationToken).ConfigureAwait(false);

        JobGroup.LastRun = $"Last run {DateTime.Now:HH:mm:ss}: 12 tables migrated, nothing to roll back.";
        JobGroup.Report("ShowNotification (Success) once the work was done");

        return UICommandResult.Ok([new ShowNotificationEffect("The migration finished: 12 tables.", UIColorStyle.Success)]);
    }

    /// <summary>
    /// Three at once, which is the case the host exists for: it stacks them and each keeps its own timer.
    /// </summary>
    [UICommand]
    public UICommandResult NotifyThree()
    {
        StackGroup.Report("three effects in one result");

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect("Queued.", UIColorStyle.Info),
            new ShowNotificationEffect("Built.", UIColorStyle.Primary),
            new ShowNotificationEffect("Deployed.", UIColorStyle.Success)
        ]);
    }

    [UICommand]
    public UICommandResult NotifyOneMore()
    {
        var pushed = StackGroup.Push();

        StackGroup.Report($"pushed #{pushed}");

        return UICommandResult.Ok([new ShowNotificationEffect($"Pushed notification #{pushed}.", UIColorStyle.Accent)]);
    }

    [UICommand]
    public UICommandResult NotifyLong()
    {
        WrapGroup.Report("a message that has to wrap");

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect(
                "The staging deploy was rolled back because the health check at https://staging.example.com/healthz answered 503 for ninety seconds, which is longer than the window the release gate allows.",
                UIColorStyle.Danger
            )
        ]);
    }
}
