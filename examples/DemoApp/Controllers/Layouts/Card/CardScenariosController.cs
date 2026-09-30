using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Layouts.Card;

/// <summary>
/// Where a click on a clickable card lands: the pipeline stops at the innermost component that handles it.
/// </summary>
internal sealed partial class CardClickGroupContext : DemoGroupContext
{
    public void ReportCard()
        => LogEvent("the card — nothing inside it handled the press");

    public void ReportButton()
        => LogEvent("the button inside it, and the card did not fire");

    public void ReportMenu()
        => LogEvent("the card's own context menu, on a card that is also clickable");
}

/// <summary>
/// Choosing one card of several: the chosen one is raised and edged, the rest are the page's own ground.
/// </summary>
internal sealed partial class CardSelectionGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string Selected { get; set; } = ScheduleId;

    [RecursiveMember]
    public partial UISurfaceStyle? NowSurface { get; set; } = UISurfaceStyle.Background;

    [RecursiveMember]
    public partial UISurfaceStyle? ScheduleSurface { get; set; } = UISurfaceStyle.Raised;

    [RecursiveMember]
    public partial UISurfaceStyle? StageSurface { get; set; } = UISurfaceStyle.Background;

    internal const string NowId = "now";
    internal const string ScheduleId = "schedule";
    internal const string StageId = "stage";

    /// <summary>
    /// One property per card, not one derived from <see cref="Selected"/>: only an assigned member notifies.
    /// </summary>
    public void Select(string id)
    {
        Selected = id;
        NowSurface = SurfaceFor(id, NowId);
        ScheduleSurface = SurfaceFor(id, ScheduleId);
        StageSurface = SurfaceFor(id, StageId);

        LogEvent($"chose {id}");
    }

    private static UISurfaceStyle SurfaceFor(string selected, string id)
        => string.Equals(selected, id, StringComparison.Ordinal) ? UISurfaceStyle.Raised : UISurfaceStyle.Background;
}

/// <summary>
/// A list whose rows are clickable cards: a press is the card's, so it runs the card's command and does not choose the row.
/// </summary>
internal sealed partial class CardListGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Incidents { get; } =
    [
        new() { Id = "inc-311", IsContent = true, Icon = DemoIcons.Server, Title = "INC-311 · api-eu-west-3", Description = "Health check failing on two of eight replicas." },
        new() { Id = "inc-310", IsContent = true, Icon = DemoIcons.Lock, Title = "INC-310 · identity", Description = "Sign-ins slow for users behind the old proxy." },
        new() { Id = "inc-309", IsContent = true, Icon = DemoIcons.Link, Title = "INC-309 · dns", Description = "Zone rebuild held back from the deploy path." }
    ];

    /// <summary>The row the list has chosen, which a press on a card leaves as it was.</summary>
    [RecursiveMember]
    public partial string? SelectedKey { get; set; }

    public void Open(string id)
        => LogEvent($"opened {id}; the chosen row is still {SelectedKey ?? "none"}");
}

/// <summary>
/// A clickable card that can be locked: disabled, it is no press target, for the pointer or the keyboard.
/// </summary>
internal sealed partial class CardLockGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Open { get; set; }

    public void Toggle()
    {
        Open = !Open;
        LogEvent(Open ? "unlocked: the card takes Tab and a press" : "locked: Tab passes it by");
    }

    public void Report()
        => LogEvent("the unlocked card was pressed");
}

/// <summary>
/// <c>Loading</c> on something that is not a control: a card covers its whole self, header and footer with it.
/// </summary>
internal sealed partial class CardRefreshGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Busy { get; set; }

    [RecursiveMember]
    public partial string Deploys { get; set; } = "47";

    [RecursiveMember]
    public partial string Split { get; set; } = "12 to production, 35 to staging";

    [RecursiveMember]
    public partial string ReadAt { get; set; } = "Read a moment ago";

    public void Fill(int deploys, int production, DateTime at)
    {
        Deploys = deploys.ToString(CultureInfo.InvariantCulture);
        Split = $"{production} to production, {deploys - production} to staging";
        ReadAt = $"Read at {at:HH:mm:ss}";
    }
}

internal sealed partial class CardScenariosController() : DemoController
{
    private int _reads;

    [RecursiveMember]
    public partial CardClickGroupContext ClickGroup { get; set; } = new();

    // No state of its own: the client decides what shows, the server only hears the press.
    [RecursiveMember]
    public partial DemoGroupContext HoverGroup { get; set; } = new();

    [RecursiveMember]
    public partial CardSelectionGroupContext SelectionGroup { get; set; } = new();

    [RecursiveMember]
    public partial CardRefreshGroupContext RefreshGroup { get; set; } = new();

    [RecursiveMember]
    public partial CardListGroupContext ListGroup { get; set; } = new();

    [RecursiveMember]
    public partial CardLockGroupContext LockGroup { get; set; } = new();

    [UICommand]
    public void OpenIncident(string id)
        => ListGroup.Open(id);

    [UICommand]
    public void ToggleLock()
        => LockGroup.Toggle();

    [UICommand]
    public void PressLocked()
        => LockGroup.Report();

    [UICommand]
    public void RecordCardClick()
        => ClickGroup.ReportCard();

    [UICommand]
    public void ApproveChange()
        => HoverGroup.LogEvent("Approved — and the pointer never left the card to do it");

    [UICommand]
    public void ViewPlan()
        => HoverGroup.LogEvent("Opened the plan");

    [UICommand]
    public void RecordButtonClick()
        => ClickGroup.ReportButton();

    [UICommand]
    public void RecordMenuClick()
        => ClickGroup.ReportMenu();

    /// <summary>One command for the three cards, told apart by the literal each one carries.</summary>
    [UICommand]
    public void SelectPlan(string plan)
        => SelectionGroup.Select(plan);

    [UICommand]
    public async Task RefreshAsync(CancellationToken cancellationToken)
    {
        RefreshGroup.Busy = true;

        await Task.Delay(1400, cancellationToken).ConfigureAwait(false);

        _reads++;

        RefreshGroup.Fill(47 + (_reads * 3), 12 + _reads, DateTime.Now);
        RefreshGroup.Busy = false;
    }
}
