using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Screens;

/// <summary>
/// The account form's state and the one thing only the server can say about it: whether the address is already taken.
/// </summary>
/// <remarks>The switch, the reveal and every client rule cost no round trip; this is what is left.</remarks>
internal sealed partial class SignUpController : UIControllerBase
{
    private static readonly string[] TakenEmails = ["robin@example.com", "sam@example.com"];

    [RecursiveMember]
    public partial string? FullName { get; set; }

    [RecursiveMember]
    public partial string? Email { get; set; }

    [RecursiveMember]
    public partial UIValidationMessage? EmailNotice { get; set; }

    [RecursiveMember]
    public partial string? Password { get; set; }

    [RecursiveMember]
    public partial bool? ForTeam { get; set; }

    [RecursiveMember]
    public partial string? TeamName { get; set; }

    [RecursiveMember]
    public partial string? TeamSize { get; set; }

    [RecursiveMember]
    public partial bool? AcceptsTerms { get; set; }

    [RecursiveMember]
    public partial UIVisibility FormVisibility { get; set; } = UIVisibility.Visible;

    [RecursiveMember]
    public partial UIVisibility DoneVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial string DoneLine { get; set; } = string.Empty;

    /// <summary>The submit: a moment of work, then either the refusal on the email field or the form swapped for the confirmation.</summary>
    [UICommand]
    public async Task CreateAccountAsync(CancellationToken cancellationToken)
    {
        await Task.Delay(700, cancellationToken).ConfigureAwait(false);

        var email = Email?.Trim() ?? string.Empty;

        if (Array.Exists(TakenEmails, taken => string.Equals(taken, email, StringComparison.OrdinalIgnoreCase)))
        {
            EmailNotice = UIValidationMessage.Error("There is already an account with that address. Sign in instead?");
            return;
        }

        EmailNotice = null;
        DoneLine = ForTeam == true && !string.IsNullOrWhiteSpace(TeamName)
            ? $"We sent a link to {email}. Your team's room, {TeamName.Trim()}, is ready once you open it."
            : $"We sent a link to {email}. Open it and you are in.";
        FormVisibility = UIVisibility.Collapsed;
        DoneVisibility = UIVisibility.Visible;
    }

    /// <summary>
    /// The way on from the confirmation: the form is cleared so a return starts fresh, and the navigation is answered by the
    /// command — an effect a command returns, not one an interaction may run.
    /// </summary>
    [UICommand]
    public UICommandResult OpenInbox()
    {
        StartOver();
        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = "/screens/inbox" })]);
    }

    [UICommand]
    public void StartOver()
    {
        FullName = null;
        Email = null;
        EmailNotice = null;
        Password = null;
        ForTeam = false;
        TeamName = null;
        TeamSize = null;
        AcceptsTerms = false;
        DoneVisibility = UIVisibility.Collapsed;
        FormVisibility = UIVisibility.Visible;
    }
}
