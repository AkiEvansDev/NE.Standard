using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

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

/// <summary>
/// The hover group has no state of its own: the client decides what shows, the server only hears the press.
/// </summary>
internal sealed partial class CardHoverGroupContext : DemoGroupContext
{
    public void Report(string message) => LogEvent(message);
}

internal sealed partial class CardScenariosController() : DemoController
{
    private int _reads;

    [RecursiveMember]
    public partial CardClickGroupContext ClickGroup { get; set; } = new();

    [RecursiveMember]
    public partial CardHoverGroupContext HoverGroup { get; set; } = new();

    [RecursiveMember]
    public partial CardSelectionGroupContext SelectionGroup { get; set; } = new();

    [RecursiveMember]
    public partial CardRefreshGroupContext RefreshGroup { get; set; } = new();

    [UICommand]
    public void RecordCardClick()
        => ClickGroup.ReportCard();

    [UICommand]
    public void MergeRequest()
        => HoverGroup.Report("Merged — and the pointer never left the card to do it");

    [UICommand]
    public void ViewDiff()
        => HoverGroup.Report("Opened the diff");

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
