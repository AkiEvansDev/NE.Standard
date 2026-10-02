using System;
using System.Globalization;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Mechanisms;

/// <summary>
/// The gap between a press and the server's answer, which exists only while a command is in flight.
/// </summary>
/// <remarks>A pair of interactions fills it from the view; <see cref="Busy"/> fills it from the server.</remarks>
internal sealed partial class ButtonLatencyGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Busy { get; set; }
}

/// <summary>
/// What a button that says nothing about itself costs: the client refuses a duplicate command, but the reader
/// cannot tell a refused press from an unseen one.
/// </summary>
internal sealed partial class ButtonGuardGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool GuardedEnabled { get; set; } = true;

    [RecursiveMember]
    public partial string GuardedCount { get; set; } = "0";

    [RecursiveMember]
    public partial string PlainCount { get; set; } = "0";

    public void CountGuarded()
        => GuardedCount = Next(GuardedCount);

    public void CountPlain()
        => PlainCount = Next(PlainCount);

    private static string Next(string current)
        => (int.Parse(current, CultureInfo.InvariantCulture) + 1).ToString(CultureInfo.InvariantCulture);
}

/// <summary>One command, four stages: what it writes between awaits is on screen before it returns.</summary>
internal sealed partial class ButtonProgressGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Busy { get; set; }

    [RecursiveMember]
    public partial UIPhrase? Stage { get; set; } = UIPhrase.Of("demo.mechanisms.commands.progress.not-started");

    [RecursiveMember]
    public partial UIBadgeType StageStyle { get; set; } = UIBadgeType.Surface;

    public void Enter(UIPhrase stage, UIBadgeType style)
    {
        Stage = stage;
        StageStyle = style;
    }
}

/// <summary>
/// A job that runs in the background: its tab stays free, so a note typed meanwhile lands and a Cancel reaches it.
/// </summary>
internal sealed partial class ButtonBackgroundGroupContext : DemoGroupContext
{
    private readonly Lock _sync = new();
    private CancellationTokenSource? _running;

    [RecursiveMember]
    public partial string Note { get; set; } = string.Empty;

    /// <summary>Starts a run the connection's closing or <see cref="Cancel"/> ends, whichever comes first.</summary>
    public CancellationTokenSource Begin(CancellationToken connection)
    {
        CancellationTokenSource running = CancellationTokenSource.CreateLinkedTokenSource(connection);

        lock (_sync)
            _running = running;

        return running;
    }

    /// <summary>Taken out under the lock and cancelled outside it: the run it wakes may end, and let go of it, on this thread.</summary>
    public void Cancel()
    {
        CancellationTokenSource? running;

        lock (_sync)
            running = _running;

        try
        {
            running?.Cancel();
        }
        catch (ObjectDisposedException)
        {
            // The run ended between the two lines; there is nothing left to cancel.
        }
    }

    public void End(CancellationTokenSource running)
    {
        lock (_sync)
        {
            if (ReferenceEquals(_running, running))
                _running = null;
        }
    }
}

/// <summary>
/// The case the client's guard does not cover: two buttons, two commands, only one of which may run.
/// </summary>
internal sealed partial class ButtonDecisionGroupContext : DemoGroupContext
{
    private const string Waiting = "demo.mechanisms.commands.decision.waiting";

    [RecursiveMember]
    public partial bool Open { get; set; } = true;

    [RecursiveMember]
    public partial UIPhrase? Outcome { get; set; } = UIPhrase.Of(Waiting);

    [RecursiveMember]
    public partial UIBadgeType OutcomeStyle { get; set; } = UIBadgeType.Surface;

    public void Decide(UIPhrase outcome, UIBadgeType style)
    {
        Open = false;
        Outcome = outcome;
        OutcomeStyle = style;
    }

    public void Reopen()
    {
        Open = true;
        Outcome = UIPhrase.Of(Waiting);
        OutcomeStyle = UIBadgeType.Surface;
    }
}

/// <summary>
/// What a button does that a property cannot describe: waits, repeat presses, progress, failure and effects.
/// </summary>
internal sealed partial class CommandsController() : DemoController
{
    private const string Words = "demo.mechanisms.commands.";

    private static readonly (string Stage, UIBadgeType Style)[] ProvisioningStages =
    [
        (Words + "progress.disk", UIBadgeType.Info),
        (Words + "progress.image", UIBadgeType.Info),
        (Words + "progress.checks", UIBadgeType.Warning),
        (Words + "progress.firewall", UIBadgeType.Primary)
    ];

    [RecursiveMember]
    public partial ButtonLatencyGroupContext LatencyGroup { get; set; } = new();

    [RecursiveMember]
    public partial ButtonGuardGroupContext GuardGroup { get; set; } = new();

    [RecursiveMember]
    public partial ButtonDecisionGroupContext DecisionGroup { get; set; } = new();

    [RecursiveMember]
    public partial ButtonProgressGroupContext ProgressGroup { get; set; } = new();

    [RecursiveMember]
    public partial ButtonBackgroundGroupContext BackgroundGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext ReportGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext EffectGroup { get; set; } = new();

    /// <summary>
    /// Waits two seconds and says nothing; the difference between its two callers is in the view.
    /// </summary>
    [UICommand]
    public async Task DeployAsync(CancellationToken cancellationToken)
    {
        LatencyGroup.LogEvent(UIPhrase.Of(Words + "log.heard"));

        await Task.Delay(2000, cancellationToken).ConfigureAwait(false);

        LatencyGroup.LogEvent(UIPhrase.Of(Words + "log.finished"));
    }

    /// <summary>
    /// The same two seconds, said by the controller through the bound <see cref="ButtonLatencyGroupContext.Busy"/>.
    /// </summary>
    [UICommand]
    public async Task DeployBoundAsync(CancellationToken cancellationToken)
    {
        LatencyGroup.Busy = true;
        LatencyGroup.LogEvent(UIPhrase.Of(Words + "log.busy-on"));

        await Task.Delay(2000, cancellationToken).ConfigureAwait(false);

        LatencyGroup.Busy = false;
        LatencyGroup.LogEvent(UIPhrase.Of(Words + "log.busy-off"));
    }

    /// <summary>
    /// Puts the button back on through its own <c>Enabled</c>, so a lost press leaves it off rather than repeatable.
    /// </summary>
    [UICommand]
    public async Task ChargeGuardedAsync(CancellationToken cancellationToken)
    {
        GuardGroup.CountGuarded();
        GuardGroup.LogEvent(UIPhrase.Of(Words + "log.guarded"));

        await Task.Delay(1500, cancellationToken).ConfigureAwait(false);

        GuardGroup.GuardedEnabled = true;
    }

    [UICommand]
    public async Task ChargePlainAsync(CancellationToken cancellationToken)
    {
        GuardGroup.CountPlain();
        GuardGroup.LogEvent(UIPhrase.Of(Words + "log.plain"));

        await Task.Delay(1500, cancellationToken).ConfigureAwait(false);
    }

    [UICommand]
    public void ResetCounts()
    {
        GuardGroup.GuardedCount = "0";
        GuardGroup.PlainCount = "0";
        GuardGroup.GuardedEnabled = true;
        GuardGroup.LogEvent(UIPhrase.Of(Words + "log.reset"));
    }

    /// <summary>
    /// The slow half of the pair; only the view's interaction can turn both buttons off in time.
    /// </summary>
    [UICommand]
    public async Task ApproveAsync(CancellationToken cancellationToken)
    {
        // The buttons going off is the feedback; this is the rule, since a second press can still reach the server.
        if (!DecisionGroup.Open)
            return;

        DecisionGroup.LogEvent(UIPhrase.Of(Words + "log.approving"));

        await Task.Delay(1200, cancellationToken).ConfigureAwait(false);

        DecisionGroup.Decide(UIPhrase.Of(Words + "decision.approved"), UIBadgeType.Success);
    }

    [UICommand]
    public async Task RejectAsync(CancellationToken cancellationToken)
    {
        if (!DecisionGroup.Open)
            return;

        DecisionGroup.LogEvent(UIPhrase.Of(Words + "log.rejecting"));

        await Task.Delay(1200, cancellationToken).ConfigureAwait(false);

        DecisionGroup.Decide(UIPhrase.Of(Words + "decision.rejected"), UIBadgeType.Danger);
    }

    [UICommand]
    public void ReopenRequest()
    {
        DecisionGroup.Reopen();
        DecisionGroup.LogEvent(UIPhrase.Of(Words + "log.reopened"));
    }

    /// <summary>
    /// Four writes inside one command, each shipped over the push channel as it happens.
    /// </summary>
    [UICommand]
    public async Task ProvisionAsync(CancellationToken cancellationToken)
    {
        ProgressGroup.Busy = true;

        try
        {
            foreach ((var stage, UIBadgeType style) in ProvisioningStages)
            {
                ProgressGroup.Enter(UIPhrase.Of(stage), style);

                await Task.Delay(800, cancellationToken).ConfigureAwait(false);
            }

            ProgressGroup.Enter(UIPhrase.Of(Words + "progress.running"), UIBadgeType.Success);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            // The tab that pressed it went away mid-way (a reload): the page that comes back finds it not started, not stuck half done.
            ProgressGroup.Enter(UIPhrase.Of(Words + "progress.not-started"), UIBadgeType.Surface);
            throw;
        }
        finally
        {
            ProgressGroup.Busy = false;
        }
    }

    /// <summary>
    /// Six seconds of waiting on the storage. Background, so the invoke is answered at once and the result follows: the tab's
    /// connection is free for the note and the Cancel meanwhile. It writes only its own group's report.
    /// </summary>
    [UICommand(ConcurrencyMode = UICommandConcurrencyMode.Background)]
    public async Task BackUpAsync(CancellationToken cancellationToken)
    {
        using CancellationTokenSource running = BackgroundGroup.Begin(cancellationToken);

        BackgroundGroup.LogEvent(UIPhrase.Of(Words + "log.backing-up"));

        try
        {
            await Task.Delay(6000, running.Token).ConfigureAwait(false);

            BackgroundGroup.LogEvent(UIPhrase.Of(Words + "log.backed-up"));
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            BackgroundGroup.LogEvent(UIPhrase.Of(Words + "log.backup-cancelled"));
        }
        finally
        {
            BackgroundGroup.End(running);
        }
    }

    [UICommand]
    public void CancelBackup()
        => BackgroundGroup.Cancel();

    /// <summary>
    /// Throws and returns nothing, leaving the framework to report the failure.
    /// </summary>
    [UICommand]
    public void FailUnhandled()
    {
        ReportGroup.LogEvent(UIPhrase.Of(Words + "log.throwing"));

        // The exception's text is the developer's: the page shows the framework's own words unless IncludeExceptionDetail is on.
        throw new InvalidOperationException("The release gate refused: staging has been unhealthy for 90 seconds.");
    }

    /// <summary>The same refusal owned by the command, which returns effects to report it itself.</summary>
    [UICommand]
    public UICommandResult FailReported()
    {
        ReportGroup.LogEvent(UIPhrase.Of(Words + "log.refused"));

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect(UIPhrase.Of(Words + "toast.refused"), UIColorStyle.Warning)
        ]);
    }

    [UICommand]
    public UICommandResult GoToButton()
    {
        EffectGroup.LogEvent(UIPhrase.Of(Words + "log.navigate"));

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = "/actions/button" })]);
    }

    /// <summary>
    /// Uses the download service, which stages the bytes and pushes the path so the browser fetches over HTTP.
    /// </summary>
    [UICommand]
    public async Task DownloadReportAsync(CancellationToken cancellationToken)
    {
        EffectGroup.LogEvent(UIPhrase.Of(Words + "log.download"));

        var content = Encoding.UTF8.GetBytes("stage,seconds\nallocate,0.8\ninstall,0.8\ncheck,0.8\nfirewall,0.8\n");

        _ = await Context.Downloads
            .DownloadAsync(Context.Handle, "provisioning-report.csv", "text/csv", content, cancellationToken)
            .ConfigureAwait(false);
    }
}
