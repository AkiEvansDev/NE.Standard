using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.Text;

/// <summary>
/// A reply line over a composer, in the controller's words, which its × drops and a button puts back; and a press on a message's
/// quote, which would take the feed to the message it quotes.
/// </summary>
internal sealed partial class QuoteGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string ReplyTitle { get; set; } = "Replying to Mira Okafor";

    [RecursiveMember]
    public partial string ReplyLine { get; set; } = "Can we move the review to Thursday? The build is still red on the payments branch.";

    [RecursiveMember]
    public partial UIVisibility ReplyVisibility { get; set; } = UIVisibility.Visible;

    public void CancelReply()
    {
        ReplyVisibility = UIVisibility.Collapsed;
        LogEvent("reply dropped");
    }

    public void Reply()
    {
        ReplyVisibility = UIVisibility.Visible;
        LogEvent("replying to Mira again");
    }

    public void Jump()
        => LogEvent("gone to Mira's message");
}

/// <summary>
/// One text component, and every property that can be bound to it.
/// </summary>
internal sealed partial class TextController() : DemoStandardController
{
    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Two-factor authentication", "Adds a second step when signing in from a new device.");

    [RecursiveMember]
    public partial SelectableTextLayoutGroupContext LayoutGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial QuoteGroupContext QuoteGroup { get; set; } = new();

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleLayoutOption(string id)
        => LayoutGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);

    [UICommand]
    public void CancelReply()
        => QuoteGroup.CancelReply();

    [UICommand]
    public void ReplyAgain()
        => QuoteGroup.Reply();

    [UICommand]
    public void JumpToQuote()
        => QuoteGroup.Jump();
}
