using System;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.Timestamp;

/// <summary>
/// One event of the panel's activity feed, and the moment it happened.
/// </summary>
internal sealed partial class DemoActivityItem : TextItem
{
    [RecursiveMember]
    public partial DateTimeOffset At { get; set; }
}

/// <summary>
/// The moment the four formats share, and the press that stamps it again.
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
/// Moments standing in words: a message sent a few minutes before the page opened, which the page keeps current, and a fixed start.
/// </summary>
internal sealed partial class MomentWordsGroupContext : DemoGroupContext
{
    private static readonly DateTimeOffset WindowStart = new(2026, 10, 3, 22, 0, 0, TimeSpan.Zero);

    [RecursiveMember]
    public partial UIPhrase? Sent { get; set; } = UIPhrase.Of("demo.timestamp.sent", ("at", new UIMoment(DateTimeOffset.UtcNow.AddMinutes(-3), UITimestampFormat.Relative)));

    [RecursiveMember]
    public partial UIPhrase? Starts { get; set; } = UIPhrase.Of("demo.timestamp.starts", ("at", new UIMoment(WindowStart)));
}

/// <summary>
/// What the examples need a controller for: a moment stamped at a press, a feed read off the clock, and moments in words.
/// </summary>
internal sealed partial class TimestampExamplesController() : DemoController
{
    [RecursiveMember]
    public partial StampGroupContext StampGroup { get; set; } = new();

    [RecursiveMember]
    public partial ActivityGroupContext ActivityGroup { get; set; } = new();

    [RecursiveMember]
    public partial MomentWordsGroupContext WordsGroup { get; set; } = new();

    [UICommand]
    public void StampNow()
        => StampGroup.Stamp();

    /// <summary>A toast whose message is a phrase with a moment: the page writes the time in the reader's zone and language.</summary>
    [UICommand]
    public UICommandResult BackUpNow()
    {
        WordsGroup.LogEvent("ShowNotification with a moment in its phrase");

        return UICommandResult.Ok([new ShowNotificationEffect(UIPhrase.Of("demo.timestamp.backed-up", ("at", new UIMoment(DateTimeOffset.UtcNow, UITimestampFormat.Time))), UIColorStyle.Success)]);
    }
}
