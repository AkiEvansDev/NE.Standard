using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Screens;

/// <summary>
/// What a page that is read still asks of a server: the vote at its foot, and the subscription box.
/// </summary>
internal sealed partial class ArticleController : UIControllerBase
{
    [RecursiveMember]
    public partial string? SubscriberEmail { get; set; }

    [RecursiveMember]
    public partial UIValidationMessage? SubscriberNotice { get; set; }

    [RecursiveMember]
    public partial string VoteLine { get; set; } = "Was this useful?";

    [UICommand]
    public void Vote(string answer)
        => VoteLine = answer == "yes" ? "Glad it helped. Thank you." : "Thanks for saying so; the next one will be better.";

    [UICommand]
    public UICommandResult Subscribe()
    {
        var email = SubscriberEmail?.Trim() ?? string.Empty;

        if (email.EndsWith("@example.com", System.StringComparison.OrdinalIgnoreCase))
        {
            SubscriberNotice = UIValidationMessage.Error("That address is already on the list.");
            return UICommandResult.Ok();
        }

        SubscriberNotice = null;
        SubscriberEmail = null;

        return UICommandResult.Ok([new ShowNotificationEffect($"The next note goes to {email}.", UIColorStyle.Success)]);
    }
}
