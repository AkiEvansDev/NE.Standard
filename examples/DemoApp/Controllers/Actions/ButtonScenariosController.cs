using System;
using System.Globalization;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// The gap between a press and the server's answer, which exists only while a command is in flight.
/// </summary>
/// <remarks>A pair of interactions fills it from the view; <see cref="Busy"/> fills it from the server.</remarks>
internal sealed partial class ButtonLatencyGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Busy { get; set; }

    public void Report(string message)
        => LogEvent(message);
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

    public void Report(string message)
        => LogEvent(message);
}

/// <summary>One command, four stages: what it writes between awaits is on screen before it returns.</summary>
internal sealed partial class ButtonProgressGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Busy { get; set; }

    [RecursiveMember]
    public partial string Stage { get; set; } = "Not started";

    [RecursiveMember]
    public partial UIBadgeType StageStyle { get; set; } = UIBadgeType.Surface;

    public void Enter(string stage, UIBadgeType style)
    {
        Stage = stage;
        StageStyle = style;
    }
}

/// <summary>
/// The case the client's guard does not cover: two buttons, two commands, only one of which may run.
/// </summary>
internal sealed partial class ButtonDecisionGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Open { get; set; } = true;

    [RecursiveMember]
    public partial string Outcome { get; set; } = "Waiting for a decision";

    [RecursiveMember]
    public partial UIBadgeType OutcomeStyle { get; set; } = UIBadgeType.Surface;

    public void Decide(string outcome, UIBadgeType style)
    {
        Open = false;
        Outcome = outcome;
        OutcomeStyle = style;
    }

    public void Reopen()
    {
        Open = true;
        Outcome = "Waiting for a decision";
        OutcomeStyle = UIBadgeType.Surface;
    }

    public void Report(string message)
        => LogEvent(message);
}

internal sealed partial class ButtonConfirmGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string Workspace { get; set; } = "payments-staging";

    [RecursiveMember]
    public partial bool Present { get; set; } = true;

    public void Report(string message)
        => LogEvent(message);
}

internal sealed partial class ButtonReportGroupContext : DemoGroupContext
{
    public void Report(string message)
        => LogEvent(message);
}

/// <summary>
/// What a button does that a property cannot describe: waits, repeat presses, progress, confirmation, failure and effects.
/// </summary>
internal sealed partial class ButtonScenariosController() : DemoController
{
    /// <summary>The key the view declares its dialog under.</summary>
    internal const string ConfirmKey = "button-confirm-delete";

    private static readonly (string Stage, UIBadgeType Style)[] PipelineStages =
    [
        ("Resolving dependencies", UIBadgeType.Info),
        ("Compiling", UIBadgeType.Info),
        ("Running tests", UIBadgeType.Warning),
        ("Publishing", UIBadgeType.Primary)
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
    public partial ButtonConfirmGroupContext ConfirmGroup { get; set; } = new();

    [RecursiveMember]
    public partial ButtonReportGroupContext ReportGroup { get; set; } = new();

    [RecursiveMember]
    public partial ButtonReportGroupContext EffectGroup { get; set; } = new();

    /// <summary>
    /// Waits two seconds and says nothing; the difference between its two callers is in the view.
    /// </summary>
    [UICommand]
    public async Task DeployAsync(CancellationToken cancellationToken)
    {
        LatencyGroup.Report("the server heard the press");

        await Task.Delay(2000, cancellationToken).ConfigureAwait(false);

        LatencyGroup.Report("finished two seconds later");
    }

    /// <summary>
    /// The same two seconds, said by the controller through the bound <see cref="ButtonLatencyGroupContext.Busy"/>.
    /// </summary>
    [UICommand]
    public async Task DeployBoundAsync(CancellationToken cancellationToken)
    {
        LatencyGroup.Busy = true;
        LatencyGroup.Report("Busy = true, on its way to the browser");

        await Task.Delay(2000, cancellationToken).ConfigureAwait(false);

        LatencyGroup.Busy = false;
        LatencyGroup.Report("Busy = false, two seconds later");
    }

    /// <summary>
    /// Puts the button back on through its own <c>Enabled</c>, so a lost press leaves it off rather than repeatable.
    /// </summary>
    [UICommand]
    public async Task ChargeGuardedAsync(CancellationToken cancellationToken)
    {
        GuardGroup.CountGuarded();
        GuardGroup.Report("guarded — the button was off before the press left the browser");

        await Task.Delay(1500, cancellationToken).ConfigureAwait(false);

        GuardGroup.GuardedEnabled = true;
    }

    [UICommand]
    public async Task ChargePlainAsync(CancellationToken cancellationToken)
    {
        GuardGroup.CountPlain();
        GuardGroup.Report("bare — this press got through; a repeat would be dropped without a word");

        await Task.Delay(1500, cancellationToken).ConfigureAwait(false);
    }

    [UICommand]
    public void ResetCounts()
    {
        GuardGroup.GuardedCount = "0";
        GuardGroup.PlainCount = "0";
        GuardGroup.GuardedEnabled = true;
        GuardGroup.Report("both counters back to zero");
    }

    /// <summary>
    /// The slow half of the pair; only the view's interaction can turn both buttons off in time.
    /// </summary>
    [UICommand]
    public async Task ApproveAsync(CancellationToken cancellationToken)
    {
        DecisionGroup.Report("approving — the other button went off before this left the browser");

        await Task.Delay(1200, cancellationToken).ConfigureAwait(false);

        DecisionGroup.Decide("Approved", UIBadgeType.Success);
    }

    [UICommand]
    public async Task RejectAsync(CancellationToken cancellationToken)
    {
        DecisionGroup.Report("rejecting — the other button went off before this left the browser");

        await Task.Delay(1200, cancellationToken).ConfigureAwait(false);

        DecisionGroup.Decide("Rejected", UIBadgeType.Danger);
    }

    [UICommand]
    public void ReopenRequest()
    {
        DecisionGroup.Reopen();
        DecisionGroup.Report("open again");
    }

    /// <summary>
    /// Four writes inside one command, each shipped over the push channel as it happens.
    /// </summary>
    [UICommand]
    public async Task RunPipelineAsync(CancellationToken cancellationToken)
    {
        ProgressGroup.Busy = true;

        foreach ((var stage, UIBadgeType style) in PipelineStages)
        {
            ProgressGroup.Enter(stage, style);

            await Task.Delay(800, cancellationToken).ConfigureAwait(false);
        }

        ProgressGroup.Enter("Deployed", UIBadgeType.Success);
        ProgressGroup.Busy = false;
    }

    [UICommand]
    public static UICommandResult AskToDelete()
        => UICommandResult.Ok([new OpenDialogEffect(ConfirmKey)]);

    [UICommand]
    public UICommandResult CancelDelete()
    {
        ConfirmGroup.Report("cancelled — nothing was deleted");

        return UICommandResult.Ok([new CloseDialogEffect(ConfirmKey)]);
    }

    /// <summary>Closes the dialog and says so in one result; effects run in order.</summary>
    [UICommand]
    public UICommandResult ConfirmDelete()
    {
        ConfirmGroup.Present = false;
        ConfirmGroup.Report($"deleted {ConfirmGroup.Workspace}");

        return UICommandResult.Ok(
        [
            new CloseDialogEffect(ConfirmKey),
            new ShowNotificationEffect($"{ConfirmGroup.Workspace} was deleted.", UIColorStyle.Danger)
        ]);
    }

    [UICommand]
    public UICommandResult RestoreWorkspace()
    {
        ConfirmGroup.Present = true;
        ConfirmGroup.Report("restored, so the story can be told again");

        return UICommandResult.Ok([new ShowNotificationEffect($"{ConfirmGroup.Workspace} is back.", UIColorStyle.Success)]);
    }

    /// <summary>
    /// Throws and returns nothing, leaving the framework to report the failure.
    /// </summary>
    [UICommand]
    public void FailUnhandled()
    {
        ReportGroup.Report("about to throw — nothing in the command reports it");

        throw new InvalidOperationException("The release gate refused: staging has been unhealthy for 90 seconds.");
    }

    /// <summary>The same refusal owned by the command, which returns effects to report it itself.</summary>
    [UICommand]
    public UICommandResult FailReported()
    {
        ReportGroup.Report("refused, and said so in its own words");

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect("Staging has been unhealthy for 90 seconds — the release gate refused.", UIColorStyle.Warning)
        ]);
    }

    [UICommand]
    public UICommandResult GoToExamples()
    {
        EffectGroup.Report("NavigateEffect — the client changes page");

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = "/actions/button/examples" })]);
    }

    /// <summary>
    /// Uses the download service, which stages the bytes and pushes the path so the browser fetches over HTTP.
    /// </summary>
    [UICommand]
    public async Task DownloadReportAsync(CancellationToken cancellationToken)
    {
        EffectGroup.Report("staged, and handed over as a single-use path");

        var content = Encoding.UTF8.GetBytes("stage,seconds\nresolve,0.8\ncompile,0.8\ntest,0.8\npublish,0.8\n");

        _ = await Context.Downloads
            .DownloadAsync(Context.Handle, "deploy-report.csv", "text/csv", content, cancellationToken)
            .ConfigureAwait(false);
    }
}
