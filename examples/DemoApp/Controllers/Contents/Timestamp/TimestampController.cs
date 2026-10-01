using System;
using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.Timestamp;

/// <summary>
/// The moment itself and how it is written: its value, its text style and colour, and the tooltip over it.
/// </summary>
internal sealed partial class TimestampGroupContext : TooltipGroupContext
{
    private const string SampleTooltip = "Taken when **db-us-east-2** finished its resize.";

    private int _step;

    [RecursiveMember]
    public partial DateTimeOffset? Value { get; set; } = DateTimeOffset.UtcNow.AddMinutes(-5);

    [RecursiveMember]
    public partial UITextAppearance? TextType { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    public TimestampGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value?.ToString("yyyy-MM-dd HH:mm 'UTC'", CultureInfo.InvariantCulture));
        AddOption(nameof(TextType), CycleTextType, () => TextType);
        AddOption(nameof(Color), CycleColor, () => Color);
        AddTooltipOptions(SampleTooltip);
    }

    // Read against the clock at the press, so "5 minutes ago" is five minutes before the press, not before the page opened.
    public void CycleValue()
    {
        _step = (_step + 1) % 6;

        DateTimeOffset now = DateTimeOffset.UtcNow;

        Value = _step switch
        {
            0 => now.AddMinutes(-5),
            1 => now,
            2 => now.AddDays(-1),
            3 => now.AddHours(2),
            4 => new DateTimeOffset(2026, 8, 12, 9, 14, 0, TimeSpan.Zero),
            _ => null
        };

        SetLastChange(nameof(Value), Value?.ToString("yyyy-MM-dd HH:mm 'UTC'", CultureInfo.InvariantCulture));
    }

    public void CycleTextType()
        => SetLastChange(nameof(TextType), TextType = CycleAppearance(TextType));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, null, UIThemeColor.Muted, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Danger)));
}

/// <summary>
/// One event of the panel's activity feed, and the moment it happened.
/// </summary>
internal sealed partial class DemoActivityItem : TextItem
{
    [RecursiveMember]
    public partial DateTimeOffset At { get; set; }
}

/// <summary>
/// The moment the five formats share, and the press that stamps it again.
/// </summary>
internal sealed partial class StampGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial DateTimeOffset? Moment { get; set; } = DateTimeOffset.UtcNow.AddMinutes(-5);

    public void Stamp()
    {
        Moment = DateTimeOffset.UtcNow;
        LogEvent("stamped now");
    }
}

/// <summary>
/// The feed, its moments read off the clock when the page opens, so "5 minutes ago" is five minutes before the reader came.
/// </summary>
internal sealed partial class ActivityGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoActivityItem> Entries { get; } = Create(DateTimeOffset.UtcNow);

    private static RecursiveCollection<DemoActivityItem> Create(DateTimeOffset now)
        =>
        [
            new() { Id = "a1", IsContent = true, Icon = DemoIcons.Server, Title = "Robin Hale resized db-us-east-2", Description = "Pro to Dedicated, after CHG-482 was approved.", At = now.AddMinutes(-5) },
            new() { Id = "a2", IsContent = true, Icon = DemoIcons.Refresh, Title = "Provisioning run for api-eu-west-3 finished", Description = "Health check green in four minutes.", At = now.AddMinutes(-42) },
            new() { Id = "a3", IsContent = true, Icon = DemoIcons.FileText, Title = "The invoice for SUB-000007 was paid", Description = "Mosswood Games, €870.", At = now.AddDays(-1) },
            new() { Id = "a4", IsContent = true, Icon = DemoIcons.Lock, Title = "The certificate for bramble.example expires", Description = "Issued by Orvane Trust CA.", At = now.AddDays(3) }
        ];
}

/// <summary>
/// One timestamp, drawn once per format, and every property that can be bound to it; then a moment stamped at a press, and a feed
/// read off the clock.
/// </summary>
internal sealed partial class TimestampController() : DemoStandardController
{
    [RecursiveMember]
    public partial TimestampGroupContext TimestampGroup { get; set; } = new();

    [RecursiveMember]
    public partial StampGroupContext StampGroup { get; set; } = new();

    [RecursiveMember]
    public partial ActivityGroupContext ActivityGroup { get; set; } = new();

    [UICommand]
    public void CycleTimestampOption(string id)
        => TimestampGroup.CycleOption(id);

    [UICommand]
    public void StampNow()
        => StampGroup.Stamp();
}
