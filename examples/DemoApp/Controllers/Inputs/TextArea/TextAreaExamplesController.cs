using System;
using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.TextArea;

/// <summary>
/// One line of the on-call channel: who wrote it, what, and when.
/// </summary>
internal sealed partial class DemoChatMessage : TextItem
{
    [RecursiveMember]
    public partial DateTimeOffset At { get; set; }
}

/// <summary>
/// The channel and the draft under it; a send appends the draft as the reader's line and empties the box.
/// </summary>
internal sealed partial class ChatGroupContext : DemoGroupContext
{
    private int _sent;

    [RecursiveMember]
    public partial string? Draft { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<DemoChatMessage> Messages { get; } = Create(DateTimeOffset.UtcNow);

    private static RecursiveCollection<DemoChatMessage> Create(DateTimeOffset now)
        =>
        [
            new() { Id = "m1", IsContent = true, Icon = DemoIcons.UserRound, Title = "Alex Warren", Description = "api-eu-west-1 answers again; the queue drained in two minutes.", At = now.AddMinutes(-12) },
            new() { Id = "m2", IsContent = true, Icon = DemoIcons.UserRound, Title = "Grace Kim", Description = "I'll watch the disk on db-eu-west-2 until the resize lands.", At = now.AddMinutes(-9) }
        ];

    public void Send()
    {
        var text = Draft?.Trim();

        // Enter on an empty box still presses Send; nothing to post then, and the box stays as it is.
        if (string.IsNullOrEmpty(text))
            return;

        _sent++;

        Messages.Add(new DemoChatMessage
        {
            Id = string.Create(CultureInfo.InvariantCulture, $"sent-{_sent}"),
            IsContent = true,
            Icon = DemoIcons.User,
            Title = "You",
            Description = text,
            At = DateTimeOffset.UtcNow
        });

        Draft = null;
        LogEvent($"sent line {_sent}");
    }
}

/// <summary>
/// The one text area on the Examples page with state: a composer whose Send appends to the channel above it.
/// </summary>
internal sealed partial class TextAreaExamplesController() : DemoController
{
    [RecursiveMember]
    public partial ChatGroupContext ChatGroup { get; set; } = new();

    [UICommand]
    public void Send()
        => ChatGroup.Send();
}
