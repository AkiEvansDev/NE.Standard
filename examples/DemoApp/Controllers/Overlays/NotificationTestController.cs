using System;
using System.Globalization;
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
    public partial UIPhrase? Staging { get; set; } = UIPhrase.Of("demo.overlays.notification.deploy.staging.none");

    [RecursiveMember]
    public partial UIPhrase? Production { get; set; } = UIPhrase.Of("demo.overlays.notification.deploy.production.none");

    public int NextRelease()
        => ++_release;
}

/// <summary>
/// A job that takes a moment: the toast comes when the work is done, and the line says when.
/// </summary>
internal sealed partial class JobGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIPhrase? LastRun { get; set; } = UIPhrase.Of("demo.overlays.notification.job.none");
}

/// <summary>
/// One command with three things to say, and a counter for every toast pushed, the three included.
/// </summary>
internal sealed partial class StackGroupContext : DemoGroupContext
{
    private int _pushed;

    [RecursiveMember]
    public partial UIPhrase? Pushed { get; set; } = UIPhrase.Of("demo.overlays.notification.stack.none");

    public int Push(int count)
    {
        _pushed += count;
        Pushed = UIPhrase.Of("demo.overlays.notification.stack.pushed", ("count", _pushed));

        return _pushed;
    }
}

internal sealed partial class NotificationTestController() : DemoController
{
    private const string Words = "demo.overlays.notification.";

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

        DeployGroup.Staging = UIPhrase.Of(Words + "deploy.staging.done", ("release", release), ("time", Now()));
        DeployGroup.LogEvent(UIPhrase.Of(Words + "log.success", ("release", release)));

        return UICommandResult.Ok([new ShowNotificationEffect(UIPhrase.Of(Words + "toast.staging", ("release", release)), UIColorStyle.Success)]);
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
            DeployGroup.Production = UIPhrase.Of(Words + "deploy.production.done", ("release", release), ("time", Now()));
            DeployGroup.LogEvent(UIPhrase.Of(Words + "log.success", ("release", release)));

            return UICommandResult.Ok([new ShowNotificationEffect(UIPhrase.Of(Words + "toast.production", ("release", release)), UIColorStyle.Success)]);
        }

        DeployGroup.Production = UIPhrase.Of(Words + "deploy.production.failed", ("release", release), ("time", Now()));
        DeployGroup.LogEvent(UIPhrase.Of(Words + "log.warning-danger", ("release", release)));

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect(UIPhrase.Of(Words + "toast.checking", ("release", release)), UIColorStyle.Warning),
            new ShowNotificationEffect(UIPhrase.Of(Words + "toast.rolled-back", ("release", release)), UIColorStyle.Danger)
        ]);
    }

    [UICommand]
    public async Task<UICommandResult> RunMigrationAsync(CancellationToken cancellationToken)
    {
        JobGroup.LogEvent(UIPhrase.Of(Words + "log.running"));

        await Task.Delay(1800, cancellationToken).ConfigureAwait(false);

        JobGroup.LastRun = UIPhrase.Of(Words + "job.done", ("time", Now()));
        JobGroup.LogEvent(UIPhrase.Of(Words + "log.finished"));

        return UICommandResult.Ok([new ShowNotificationEffect(UIPhrase.Of(Words + "toast.migrated"), UIColorStyle.Success)]);
    }

    /// <summary>
    /// Three at once, which is the case the host exists for: it stacks them and each keeps its own timer.
    /// </summary>
    [UICommand]
    public UICommandResult NotifyThree()
    {
        _ = StackGroup.Push(3);
        StackGroup.LogEvent(UIPhrase.Of(Words + "log.three"));

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect(UIPhrase.Of(Words + "toast.queued"), UIColorStyle.Info),
            new ShowNotificationEffect(UIPhrase.Of(Words + "toast.checked"), UIColorStyle.Primary),
            new ShowNotificationEffect(UIPhrase.Of(Words + "toast.deployed"), UIColorStyle.Success)
        ]);
    }

    [UICommand]
    public UICommandResult NotifyOneMore()
    {
        var pushed = StackGroup.Push(1);

        StackGroup.LogEvent(UIPhrase.Of(Words + "log.pushed", ("count", pushed)));

        return UICommandResult.Ok([new ShowNotificationEffect(UIPhrase.Of(Words + "toast.pushed", ("count", pushed)), UIColorStyle.Accent)]);
    }

    [UICommand]
    public UICommandResult NotifyLong()
    {
        WrapGroup.LogEvent(UIPhrase.Of(Words + "log.long"));

        return UICommandResult.Ok([new ShowNotificationEffect(UIPhrase.Of(Words + "toast.long"), UIColorStyle.Danger)]);
    }

    // The server's clock as written, the same in every language.
    private static string Now()
        => DateTime.Now.ToString("HH:mm:ss", CultureInfo.InvariantCulture);
}
