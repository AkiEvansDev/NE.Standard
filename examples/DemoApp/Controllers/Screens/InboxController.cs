using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Screens;

/// <summary>A message as the list draws it: the sender is the title, the subject the description, the day the group.</summary>
internal sealed partial class DemoMessageItem : TextItem, IBindableGroup
{
    [RecursiveMember]
    public partial string? Group { get; set; }

    [RecursiveMember]
    public partial string Label { get; set; } = string.Empty;

    [RecursiveMember]
    public partial bool Unread { get; set; }

    /// <summary>What the search box reads: the sender and the subject in one string, since a rule reads one property.</summary>
    [RecursiveMember]
    public partial string SearchText { get; set; } = string.Empty;

    [RecursiveMember(false)]
    public string Time { get; init; } = string.Empty;

    [RecursiveMember(false)]
    public string Body { get; init; } = string.Empty;

    [RecursiveMember(false)]
    public string? Quote { get; init; }

    [RecursiveMember(false)]
    public string[] Attachments { get; init; } = [];
}

/// <summary>
/// The messages, whole, and the one open: the list is narrowed in the browser, and a click hands the key back so the
/// reading pane can be filled and the row marked read.
/// </summary>
internal sealed partial class InboxController : UIControllerBase
{
    public const string Deploys = "Deploys";
    public const string Reviews = "Reviews";
    public const string Billing = "Billing";
    public const string People = "People";

    private DemoMessageItem? _open;

    [RecursiveMember(false)]
    public RecursiveCollection<DemoMessageItem> Messages { get; } =
    [
        Message("m1", "Today", "09:41", "Sam Ortega", "Release 482 is live", Deploys, true,
            "The health gate held for the full ten minutes and the error rate never moved. **Payments** took the new retry path from the first request. Nothing is pending for the afternoon.",
            "The rollout pauses itself if the error rate doubles in any region — the thresholds are in [the rollout plan](https://example.com/docs/rollout).",
            ["release-482.log", "health-gate.png"]),
        Message("m2", "Today", "08:15", "Priya Nair", "Review: retries with jitter", Reviews, true,
            "Two comments, neither blocking. The backoff cap reads as a magic number — a named constant would say why it is *thirty seconds* and not sixty. The tests are thorough.",
            null, []),
        Message("m3", "Today", "07:02", "Northwind Billing", "Your September invoice is ready", Billing, false,
            "The invoice for September is attached. It covers twelve seats and the two add-on packages; the total is unchanged from August.",
            null, ["invoice-2026-09.pdf"]),
        Message("m4", "Yesterday", "17:30", "Mika Laine", "Can we move the deploy calendar?", People, true,
            "Half the team is in the Lisbon office next week and the Tuesday slot lands in their lunch. Wednesday morning is free on both calendars — would that work for you?",
            null, []),
        Message("m5", "Yesterday", "11:12", "Sam Ortega", "Release 481: rolled back", Deploys, false,
            "The index rebuild pushed the p99 over the gate and the rollout stepped itself back. Nobody was paged. The rebuild moves off the deploy path before we try again.",
            "Index rebuild moved off the deploy path. — release notes, 481", []),
        Message("m6", "Earlier this week", "Mon", "Priya Nair", "Review: search indexer on the new tokenizer", Reviews, false,
            "Approved. One thing to watch: the tokenizer lowercases before it splits, so a hyphenated term is now two terms. That is the behaviour we wanted, but the docs still say otherwise.",
            null, ["tokenizer-diff.txt"]),
        Message("m7", "Earlier this week", "Mon", "Northwind Billing", "A card on the account expires next month", Billing, false,
            "The card ending in 4411 expires in October. Nothing changes until then; after it, invoices are held until a card is on file.",
            null, [])
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Attachments { get; } = [];

    [RecursiveMember]
    public partial string? SelectedKey { get; set; }

    [RecursiveMember]
    public partial UIVisibility EmptyVisibility { get; set; } = UIVisibility.Visible;

    [RecursiveMember]
    public partial UIVisibility ReadingVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial string Subject { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string FromLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Body { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Quote { get; set; } = string.Empty;

    [RecursiveMember]
    public partial UIVisibility QuoteVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIVisibility AttachmentsVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial string ReplyPlaceholder { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string? Reply { get; set; }

    /// <summary>A row's click: the pane fills from the message, and the row stops being unread.</summary>
    [UICommand]
    public void OpenMessage(string id)
    {
        foreach (DemoMessageItem message in Messages)
        {
            if (message.Id != id)
                continue;

            _open = message;
            SelectedKey = id;
            message.Unread = false;
            message.BadgeStyle = UIBadgeType.Surface;
            Subject = message.Description ?? string.Empty;
            FromLine = $"{message.Title} · {message.Group?.ToLowerInvariant()}, {message.Time}";
            Body = message.Body;
            Quote = message.Quote ?? string.Empty;
            QuoteVisibility = message.Quote is null ? UIVisibility.Collapsed : UIVisibility.Visible;
            ReplyPlaceholder = $"Reply to {message.Title}";
            Reply = null;

            Attachments.Clear();

            foreach (var attachment in message.Attachments)
                Attachments.Add(new TextItem { Id = attachment, Icon = DemoIcons.Outline(DemoIcons.File), Title = attachment });

            AttachmentsVisibility = message.Attachments.Length == 0 ? UIVisibility.Collapsed : UIVisibility.Visible;
            EmptyVisibility = UIVisibility.Collapsed;
            ReadingVisibility = UIVisibility.Visible;
            return;
        }
    }

    [UICommand]
    public UICommandResult Archive()
    {
        if (_open is null)
            return UICommandResult.Ok();

        var sender = _open.Title;
        _ = Messages.Remove(_open);
        Close();

        return Notify($"The message from {sender} is archived.", UIColorStyle.Success);
    }

    [UICommand]
    public UICommandResult MarkUnread()
    {
        if (_open is null)
            return UICommandResult.Ok();

        _open.Unread = true;
        _open.BadgeStyle = UIBadgeType.Primary;
        Close();

        return UICommandResult.Ok();
    }

    [UICommand]
    public UICommandResult Send()
    {
        if (_open is null || string.IsNullOrWhiteSpace(Reply))
            return Notify("Write something first.", UIColorStyle.Info);

        var sender = _open.Title;
        Reply = null;

        return Notify($"Your reply went to {sender}.", UIColorStyle.Success);
    }

    private void Close()
    {
        _open = null;
        SelectedKey = null;
        ReadingVisibility = UIVisibility.Collapsed;
        EmptyVisibility = UIVisibility.Visible;
    }

    private static UICommandResult Notify(string message, UIColorStyle severity)
        => UICommandResult.Ok([new ShowNotificationEffect(message, severity)]);

    private static DemoMessageItem Message(string id, string day, string time, string sender, string subject, string label, bool unread, string body, string? quote, string[] attachments)
        => new()
        {
            Id = id,
            Group = day,
            Time = time,
            Title = sender,
            Description = subject,
            Label = label,
            Unread = unread,
            SearchText = $"{sender} {subject}",
            Icon = DemoIcons.Outline(LabelIcon(label)),
            BadgeText = time,
            BadgeStyle = unread ? UIBadgeType.Primary : UIBadgeType.Surface,
            Body = body,
            Quote = quote,
            Attachments = attachments
        };

    private static string LabelIcon(string label) => label switch
    {
        Deploys => DemoIcons.Upload,
        Reviews => DemoIcons.BadgeCheck,
        Billing => DemoIcons.FileText,
        _ => DemoIcons.UserRound
    };
}
