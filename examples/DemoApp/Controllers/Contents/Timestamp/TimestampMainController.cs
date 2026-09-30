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
/// One timestamp, drawn once per format, and every property that can be bound to it.
/// </summary>
internal sealed partial class TimestampMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial TimestampGroupContext TimestampGroup { get; set; } = new();

    [UICommand]
    public void CycleTimestampOption(string id)
        => TimestampGroup.CycleOption(id);
}
