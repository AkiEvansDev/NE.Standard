using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Screens;

/// <summary>Where a signed-in session lands when a route's rules refuse it; the refused route arrives as <c>deniedUrl</c>.</summary>
[UIAllowAnonymous]
internal sealed partial class ForbiddenController : UIControllerBase
{
    [RecursiveMember]
    public partial string DeniedLine { get; set; } = "The page you asked for needs a role this session does not have.";

    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        if (Context.Handle.Instance.Navigation.TryGetParameter("deniedUrl", out var route))
            DeniedLine = $"{route} needs a role this session does not have. You are signed in as {Context.Handle.Session.UserId ?? "nobody"}.";

        return Task.CompletedTask;
    }

    [UICommand]
    public async Task<UICommandResult> SwitchAccountAsync(CancellationToken cancellationToken)
    {
        await Context.SignOutAsync(cancellationToken).ConfigureAwait(false);

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = "/screens/sign-in" })]);
    }

    [UICommand]
    public UICommandResult BackToAccount()
    {
        DeniedLine = string.Empty;
        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = "/screens/account" })]);
    }
}
