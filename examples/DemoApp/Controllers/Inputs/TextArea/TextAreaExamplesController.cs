using System;
using System.Collections.Generic;
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
    /// <summary>The composer's id, which the emoji tiles and a quick reply's answer insert into.</summary>
    public const string ComposerId = "demo-text-area-composer";

    private static readonly Dictionary<string, string> QuickReplyWords = new(StringComparer.Ordinal)
    {
        ["on-it"] = "On it, looking now.",
        ["runbook"] = "Runbook: https://docs.orvane.example/runbooks/failover",
        ["resolved"] = "Resolved; writing the summary next."
    };

    [RecursiveMember]
    public partial ChatGroupContext ChatGroup { get; set; } = new();

    /// <summary>The bolt's entries, keyed as <see cref="InsertQuickReply"/> reads them.</summary>
    public static MenuItem[] QuickReplies()
        =>
        [
            new MenuItem { Id = "on-it", Title = "On it", IsContent = true },
            new MenuItem { Id = "runbook", Title = "Link the runbook", IsContent = true },
            new MenuItem { Id = "resolved", Title = "Resolved", IsContent = true }
        ];

    [UICommand]
    public void Send()
        => ChatGroup.Send();

    /// <summary>Answers with the reply's words at the composer's caret; the draft itself is the page's until Send.</summary>
    [UICommand]
    public UICommandResult InsertQuickReply(string id)
    {
        if (!QuickReplyWords.TryGetValue(id, out var words))
            return UICommandResult.Ok();

        ChatGroup.LogEvent($"quick reply '{id}' inserted");

        return UICommandResult.Ok([InsertTextEffect.Literal(ComposerId, words)]);
    }
}
