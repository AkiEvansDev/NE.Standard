using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Layouts.Card;

/// <summary>
/// What the card is made of and how much room it leaves inside.
/// </summary>
internal sealed partial class CardSurfaceGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UISurfaceStyle? Surface { get; set; } = UISurfaceStyle.Background;

    [RecursiveMember]
    public partial bool Clickable { get; set; }

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    [RecursiveMember]
    public partial string? BackgroundImage { get; set; }

    [RecursiveMember]
    public partial UIImageFit? BackgroundImageFit { get; set; }

    [RecursiveMember]
    public partial UIOverflow? Overflow { get; set; } = UIOverflow.Hidden;

    public CardSurfaceGroupContext()
    {
        AddOption(nameof(Surface), CycleSurface, () => Surface);
        AddOption(nameof(Clickable), ToggleClickable, () => Clickable);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(Background), CycleBackground, () => Background);
        AddOption(nameof(BackgroundImage), CycleBackgroundImage, () => BackgroundImage);
        AddOption(nameof(BackgroundImageFit), CycleBackgroundImageFit, () => BackgroundImageFit);
        AddOption(nameof(Overflow), CycleOverflow, () => Overflow);
    }

    public void CycleSurface()
        => SetLastChange(nameof(Surface), Surface = CycleEnum(Surface));

    public void ToggleClickable()
        => SetLastChange(nameof(Clickable), Clickable = !Clickable);

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(4), UIThickness.Uniform(24), null));

    // Background says which colour, Surface says what is done with it; the null step shows the fallback.
    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background, UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));

    // A picture over the fill: the fit says how much of it the surface shows.
    public void CycleBackgroundImage()
        => SetLastChange(nameof(BackgroundImage), BackgroundImage = CycleValue(BackgroundImage, DemoImages.HarbourSky, DemoImages.Mark, null));

    public void CycleBackgroundImageFit()
        => SetLastChange(nameof(BackgroundImageFit), BackgroundImageFit = CycleEnum(BackgroundImageFit));

    public void CycleOverflow()
        => SetLastChange(nameof(Overflow), Overflow = CycleEnum(Overflow));
}

/// <summary>
/// Where a press on a clickable card lands: the pipeline stops at the innermost component that handles it; and a clickable card
/// that can be locked, which disabled is no press target, for the pointer or the keyboard.
/// </summary>
internal sealed partial class CardPressGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Open { get; set; }

    public void ReportCard()
        => LogEvent("the card — nothing inside it handled the press");

    public void ReportButton()
        => LogEvent("the button inside it, and the card did not fire");

    public void ReportMenu()
        => LogEvent("the card's own context menu, on a card that is also clickable");

    public void ToggleLock()
    {
        Open = !Open;
        LogEvent(Open ? "unlocked: the card takes Tab and a press" : "locked: Tab passes it by");
    }

    public void ReportUnlocked()
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

internal sealed partial class CardController() : DemoStandardController
{
    private int _reads;

    [RecursiveMember]
    public partial CardSurfaceGroupContext CardGroup { get; set; } = new();

    // The header is a TextComponent, so it takes the same three contexts a field's label does.
    [RecursiveMember]
    public partial TextContentGroupContext HeaderTextGroup { get; set; } = new("Change request · CHG-482", "Resize db-us-east-2 to Dedicated");

    [RecursiveMember]
    public partial SelectableTextLayoutGroupContext HeaderGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext HeaderBadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [RecursiveMember]
    public partial CardPressGroupContext PressGroup { get; set; } = new();

    // No state of its own: the client decides what shows, the server only hears the press.
    [RecursiveMember]
    public partial DemoGroupContext HoverGroup { get; set; } = new();

    [RecursiveMember]
    public partial CardRefreshGroupContext RefreshGroup { get; set; } = new();

    [UICommand]
    public void CycleCardOption(string id)
        => CardGroup.CycleOption(id);

    [UICommand]
    public void CycleHeaderOption(string id)
        => HeaderGroup.CycleOption(id);

    [UICommand]
    public void CycleHeaderTextOption(string id)
        => HeaderTextGroup.CycleOption(id);

    [UICommand]
    public void CycleHeaderBadgeOption(string id)
        => HeaderBadgeGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);

    [UICommand]
    public void RecordCardClick()
        => PressGroup.ReportCard();

    [UICommand]
    public void RecordMenuClick()
        => PressGroup.ReportMenu();

    [UICommand]
    public void RecordButtonClick()
        => PressGroup.ReportButton();

    [UICommand]
    public void PressLocked()
        => PressGroup.ReportUnlocked();

    [UICommand]
    public void ToggleLock()
        => PressGroup.ToggleLock();

    [UICommand]
    public async Task RefreshAsync(CancellationToken cancellationToken)
    {
        RefreshGroup.Busy = true;

        await Task.Delay(1400, cancellationToken).ConfigureAwait(false);

        _reads++;

        RefreshGroup.Fill(47 + (_reads * 3), 12 + _reads, DateTime.Now);
        RefreshGroup.Busy = false;
    }

    [UICommand]
    public void ViewPlan()
        => HoverGroup.LogEvent("Opened the plan");

    [UICommand]
    public void ApproveChange()
        => HoverGroup.LogEvent("Approved — and the pointer never left the card to do it");
}
