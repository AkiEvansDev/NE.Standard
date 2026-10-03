using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Mechanisms;

/// <summary>The wait said by the controller: <see cref="Busy"/> is on while the command runs.</summary>
internal sealed partial class BusyGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Busy { get; set; }
}

/// <summary>How many presses reached the controller, in a badge.</summary>
internal sealed partial class CountGroupContext : DemoGroupContext
{
    private int _count;

    /// <summary>On while the button may be pressed; the view turns it off at the press, the command back on.</summary>
    [RecursiveMember]
    public partial bool Enabled { get; set; } = true;

    [RecursiveMember]
    public partial string Count { get; set; } = "0";

    public void Add()
        => Count = (++_count).ToString(CultureInfo.InvariantCulture);
}

/// <summary>One command, four stages: what it writes between awaits is on screen before it returns.</summary>
internal sealed partial class ProgressGroupContext : DemoGroupContext
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
internal sealed partial class BackgroundGroupContext : DemoGroupContext
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
internal sealed partial class DecisionGroupContext : DemoGroupContext
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
/// The page's state in its address: a plan written with <c>ReplaceAddressEffect</c>, a step with <c>PushAddressEffect</c>, both read
/// back in <c>OnNavigatedAsync</c> — on a reload, a copied link, or Back and Forward on the same runtime.
/// </summary>
internal sealed partial class AddressGroupContext : DemoGroupContext
{
    public const string Starter = "starter";
    public const string Standard = "standard";
    public const string Pro = "pro";

    [RecursiveMember]
    public partial string? Plan { get; set; } = Standard;

    [RecursiveMember]
    public partial UIPhrase? StepLine { get; set; } = StepPhrase(1);

    public int Step { get; private set; } = 1;

    /// <summary>The query the state is written as: what differs from the defaults alone, so a fresh page's address stays bare.</summary>
    public Dictionary<string, object?> Parameters()
    {
        Dictionary<string, object?> parameters = new(StringComparer.Ordinal);

        if (Plan is not null and not Standard)
            parameters["plan"] = Plan;

        if (Step > 1)
            parameters["step"] = Step;

        return parameters;
    }

    public void NextStep()
        => SetStep(Step + 1);

    /// <summary>Takes the state from an address: a value this page does not know reads as its default.</summary>
    public void Read(UINavigationRequest navigation)
    {
        Plan = navigation.TryGetParameter("plan", out var plan) && plan is Starter or Pro ? plan : Standard;
        SetStep(navigation.TryGetParameter("step", out int step) && step is > 1 and < 100 ? step : 1);
    }

    private void SetStep(int step)
    {
        Step = step;
        StepLine = StepPhrase(step);
    }

    private static UIPhrase StepPhrase(int step)
        => UIPhrase.Of("demo.mechanisms.commands.address.step", ("step", step));
}

/// <summary>
/// What a button does that a property cannot describe: waits, repeat presses, progress, failure, effects and the address.
/// </summary>
internal sealed partial class CommandsController() : DemoController
{
    private static readonly (string Stage, UIBadgeType Style)[] ProvisioningStages =
    [
        ("demo.mechanisms.commands.progress.disk", UIBadgeType.Info),
        ("demo.mechanisms.commands.progress.image", UIBadgeType.Info),
        ("demo.mechanisms.commands.progress.checks", UIBadgeType.Warning),
        ("demo.mechanisms.commands.progress.firewall", UIBadgeType.Primary)
    ];

    [RecursiveMember]
    public partial DemoGroupContext WaitGroup { get; set; } = new();

    [RecursiveMember]
    public partial BusyGroupContext BusyGroup { get; set; } = new();

    [RecursiveMember]
    public partial CountGroupContext RepeatGroup { get; set; } = new();

    [RecursiveMember]
    public partial CountGroupContext SelfOffGroup { get; set; } = new();

    [RecursiveMember]
    public partial DecisionGroupContext DecisionGroup { get; set; } = new();

    [RecursiveMember]
    public partial ProgressGroupContext ProgressGroup { get; set; } = new();

    [RecursiveMember]
    public partial BackgroundGroupContext BackgroundGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext ThrowGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext RefuseGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext NavigateGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext DownloadGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext AnnounceGroup { get; set; } = new();

    [RecursiveMember]
    public partial AddressGroupContext AddressGroup { get; set; } = new();

    /// <summary>The address the page arrived at, or went back or forward to: the state is read from it, whichever it was.</summary>
    protected override Task OnNavigatedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(navigation);

        AddressGroup.Read(navigation);
        AddressGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.address-read", ("query", Query(AddressGroup.Parameters()))));

        return Task.CompletedTask;
    }

    /// <summary>A choice that is not a place to go back to: the current entry's query is rewritten.</summary>
    [UICommand]
    public UICommandResult ChoosePlan()
    {
        Dictionary<string, object?> parameters = AddressGroup.Parameters();

        AddressGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.address-replace", ("query", Query(parameters))));

        return UICommandResult.Ok([new ReplaceAddressEffect(parameters)]);
    }

    /// <summary>A step forward is an entry of its own, so Back undoes it.</summary>
    [UICommand]
    public UICommandResult NextStep()
    {
        AddressGroup.NextStep();

        Dictionary<string, object?> parameters = AddressGroup.Parameters();

        AddressGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.address-push", ("query", Query(parameters))));

        return UICommandResult.Ok([new PushAddressEffect(parameters)]);
    }

    private static string Query(Dictionary<string, object?> parameters)
        => parameters.Count == 0
            ? "—"
            : "?" + string.Join("&", parameters.Select(static parameter => string.Create(CultureInfo.InvariantCulture, $"{parameter.Key}={parameter.Value}")));

    /// <summary>Waits two seconds and says nothing of it: the spinner is the view's own.</summary>
    [UICommand]
    public async Task DeployAsync(CancellationToken cancellationToken)
    {
        WaitGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.heard"));

        await Task.Delay(2000, cancellationToken).ConfigureAwait(false);

        WaitGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.finished"));
    }

    /// <summary>The same two seconds, said by the controller through the bound <see cref="BusyGroupContext.Busy"/>.</summary>
    [UICommand]
    public async Task DeployBoundAsync(CancellationToken cancellationToken)
    {
        BusyGroup.Busy = true;
        BusyGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.busy-on"));

        await Task.Delay(2000, cancellationToken).ConfigureAwait(false);

        BusyGroup.Busy = false;
        BusyGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.busy-off"));
    }

    /// <summary>A second and a half of work; a press while it runs never reaches here.</summary>
    [UICommand]
    public async Task ChargeAsync(CancellationToken cancellationToken)
    {
        RepeatGroup.Add();
        RepeatGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.charged"));

        await Task.Delay(1500, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Puts the button back on through its own <c>Enabled</c>, so a lost press leaves it off rather than repeatable.</summary>
    [UICommand]
    public async Task ChargeGuardedAsync(CancellationToken cancellationToken)
    {
        SelfOffGroup.Add();
        SelfOffGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.guarded"));

        await Task.Delay(1500, cancellationToken).ConfigureAwait(false);

        SelfOffGroup.Enabled = true;
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

        DecisionGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.approving"));

        await Task.Delay(1200, cancellationToken).ConfigureAwait(false);

        DecisionGroup.Decide(UIPhrase.Of("demo.mechanisms.commands.decision.approved"), UIBadgeType.Success);
    }

    [UICommand]
    public async Task RejectAsync(CancellationToken cancellationToken)
    {
        if (!DecisionGroup.Open)
            return;

        DecisionGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.rejecting"));

        await Task.Delay(1200, cancellationToken).ConfigureAwait(false);

        DecisionGroup.Decide(UIPhrase.Of("demo.mechanisms.commands.decision.rejected"), UIBadgeType.Danger);
    }

    [UICommand]
    public void ReopenRequest()
    {
        DecisionGroup.Reopen();
        DecisionGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.reopened"));
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

            ProgressGroup.Enter(UIPhrase.Of("demo.mechanisms.commands.progress.running"), UIBadgeType.Success);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            // The tab that pressed it went away mid-way (a reload): the page that comes back finds it not started, not stuck half done.
            ProgressGroup.Enter(UIPhrase.Of("demo.mechanisms.commands.progress.not-started"), UIBadgeType.Surface);
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

        BackgroundGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.backing-up"));

        try
        {
            await Task.Delay(6000, running.Token).ConfigureAwait(false);

            BackgroundGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.backed-up"));
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            BackgroundGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.backup-cancelled"));
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
        ThrowGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.throwing"));

        // The exception's text is the developer's: the page shows the framework's own words unless IncludeExceptionDetail is on.
        throw new InvalidOperationException("The release gate refused: staging has been unhealthy for 90 seconds.");
    }

    /// <summary>The same refusal owned by the command, which returns effects to report it itself.</summary>
    [UICommand]
    public UICommandResult FailReported()
    {
        RefuseGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.refused"));

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect(UIPhrase.Of("demo.mechanisms.commands.toast.refused"), UIColorStyle.Warning)
        ]);
    }

    [UICommand]
    public UICommandResult GoToButton()
    {
        NavigateGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.navigate"));

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = "/actions/button" })]);
    }

    /// <summary>Says the save to a screen reader alone: a sighted reader is shown nothing but the log's line.</summary>
    [UICommand]
    public UICommandResult SaveQuietly()
    {
        AnnounceGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.announce"));

        return UICommandResult.Ok([new AnnounceEffect(UIPhrase.Of("demo.mechanisms.commands.effect.announced"))]);
    }

    /// <summary>
    /// Uses the download service, which stages the bytes and pushes the path so the browser fetches over HTTP.
    /// </summary>
    [UICommand]
    public async Task DownloadReportAsync(CancellationToken cancellationToken)
    {
        DownloadGroup.LogEvent(UIPhrase.Of("demo.mechanisms.commands.log.download"));

        var content = Encoding.UTF8.GetBytes("stage,seconds\nallocate,0.8\ninstall,0.8\ncheck,0.8\nfirewall,0.8\n");

        _ = await Context.Downloads
            .DownloadAsync(Context.Handle, "provisioning-report.csv", "text/csv", content, cancellationToken)
            .ConfigureAwait(false);
    }
}
