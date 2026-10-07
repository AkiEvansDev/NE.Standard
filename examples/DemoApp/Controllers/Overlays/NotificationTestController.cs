using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
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

/// <summary>
/// The deploys scheduled next; cancelling one is done at once, and the toast's Undo puts it back.
/// </summary>
internal sealed partial class UndoGroupContext : DemoGroupContext
{
    private const int FirstRelease = 483;

    private readonly SortedSet<int> _cancelled = [];

    [RecursiveMember]
    public partial UIPhrase? Scheduled { get; set; } = Describe([]);

    /// <summary>Cancels the next deploy still scheduled, answering its release.</summary>
    public int CancelNext()
    {
        var release = Upcoming(_cancelled).First();

        _ = _cancelled.Add(release);
        Scheduled = Describe(_cancelled);

        return release;
    }

    /// <summary>Schedules a cancelled release again; false where it is scheduled already.</summary>
    public bool Restore(int release)
    {
        if (!_cancelled.Remove(release))
            return false;

        Scheduled = Describe(_cancelled);

        return true;
    }

    private static IEnumerable<int> Upcoming(SortedSet<int> cancelled)
        => Enumerable.Range(FirstRelease, int.MaxValue - FirstRelease).Where(release => !cancelled.Contains(release)).Take(3);

    private static UIPhrase Describe(SortedSet<int> cancelled)
    {
        int[] next = [.. Upcoming(cancelled)];

        return UIPhrase.Of("demo.overlays.notification.undo.scheduled", ("first", next[0]), ("second", next[1]), ("third", next[2]));
    }
}

/// <summary>
/// What this browser lets the page show off it, and the button that asks, shown only while there is something to ask.
/// </summary>
internal sealed partial class SystemGroupContext : DemoGroupContext
{
    private const string Words = "demo.overlays.notification.system.";

    private int _release = 600;

    [RecursiveMember]
    public partial UIPhrase? Permission { get; set; } = UIPhrase.Of(Words + "permission.Unsupported");

    [RecursiveMember]
    public partial UIVisibility AskVisibility { get; set; } = UIVisibility.Collapsed;

    /// <summary>Says what the browser answered, and offers the question only while it is still to be asked.</summary>
    public void Read(UINotificationPermission permission)
    {
        Permission = UIPhrase.Of(Words + "permission." + permission);
        AskVisibility = permission == UINotificationPermission.Default ? UIVisibility.Visible : UIVisibility.Collapsed;
    }

    public int NextRelease()
        => ++_release;
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

    [RecursiveMember]
    public partial UndoGroupContext UndoGroup { get; set; } = new();

    [RecursiveMember]
    public partial SystemGroupContext SystemGroup { get; set; } = new();

    /// <summary>The permission a page attaches with is read here; a change after it reaches the hook below.</summary>
    protected override Task OnAttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        SystemGroup.Read(Context.NotificationPermission);

        return Task.CompletedTask;
    }

    protected override Task OnNotificationPermissionChangedAsync(UINotificationPermission previous, CancellationToken cancellationToken)
    {
        SystemGroup.Read(Context.NotificationPermission);
        SystemGroup.LogEvent(UIPhrase.Of(Words + "system.log.permission." + Context.NotificationPermission));

        return Task.CompletedTask;
    }

    /// <summary>
    /// Five seconds to switch to another tab, then the release goes live: the system's notification where the page is off screen, the
    /// toast where it is on screen; a click on either opens the release.
    /// </summary>
    /// <remarks>In the background, so the page goes on answering while it waits.</remarks>
    [UICommand(ConcurrencyMode = UICommandConcurrencyMode.Background)]
    public async Task<UICommandResult> NotifyLaterAsync(CancellationToken cancellationToken)
    {
        var release = SystemGroup.NextRelease();

        await Task.Delay(TimeSpan.FromSeconds(5), cancellationToken).ConfigureAwait(false);

        SystemGroup.LogEvent(UIPhrase.Of(Words + (HasVisibleViewers ? "system.log.sent-shown" : "system.log.sent-hidden"), ("release", release)));

        return UICommandResult.Ok(
        [
            new ShowSystemNotificationEffect(UIPhrase.Of(Words + "system.live", ("release", release)), UIPhrase.Of(Words + "system.live.body"))
            {
                Tag = "release",
                Action = new UINotificationAction(UIPhrase.Of(Words + "system.open"), nameof(OpenRelease), release)
            }
        ]);
    }

    /// <summary>The same notification at once, as the system's whether or not the page is on screen (<c>When = Always</c>).</summary>
    [UICommand]
    public UICommandResult NotifyNow()
    {
        var release = SystemGroup.NextRelease();

        SystemGroup.LogEvent(UIPhrase.Of(Words + "system.log.sent-always", ("release", release)));

        return UICommandResult.Ok(
        [
            new ShowSystemNotificationEffect(UIPhrase.Of(Words + "system.live", ("release", release)), UIPhrase.Of(Words + "system.live.body"))
            {
                Tag = "release",
                When = UINotificationWhen.Always,
                Action = new UINotificationAction(UIPhrase.Of(Words + "system.open"), nameof(OpenRelease), release)
            }
        ]);
    }

    /// <summary>A click on the notification, or on its toast's button: the release it was offered for, through the filters a press takes.</summary>
    [UICommand]
    public void OpenRelease(int release)
        => SystemGroup.LogEvent(UIPhrase.Of(Words + "system.log.opened", ("release", release)));

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

    /// <summary>
    /// Done at once, with no question first; the toast's one button offers the way back for as long as it stands, which is twelve
    /// seconds here rather than the eight a toast with an action stands by default.
    /// </summary>
    [UICommand]
    public UICommandResult CancelNextDeploy()
    {
        var release = UndoGroup.CancelNext();

        UndoGroup.LogEvent(UIPhrase.Of(Words + "log.cancelled", ("release", release)));

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect(UIPhrase.Of(Words + "toast.cancelled", ("release", release)))
            {
                Action = new UINotificationAction(UIPhrase.Of(Words + "toast.undo"), nameof(RestoreDeploy), release),
                Duration = TimeSpan.FromSeconds(12)
            }
        ]);
    }

    /// <summary>The toast's Undo, on no button: the release it was offered for is its argument, through the same filters a press takes.</summary>
    [UICommand]
    public void RestoreDeploy(int release)
    {
        if (UndoGroup.Restore(release))
            UndoGroup.LogEvent(UIPhrase.Of(Words + "log.restored", ("release", release)));
    }

    // The server's clock as written, the same in every language.
    private static string Now()
        => DateTime.Now.ToString("HH:mm:ss", CultureInfo.InvariantCulture);
}
