using System;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Security;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Screens;

/// <summary>
/// A page for the admin role alone: a member who reaches for it is sent to the forbidden page with the route named, and an
/// anonymous session to the sign-in page. The commands are audited like the account's.
/// </summary>
[UIAuthorize(DemoAccounts.AdminRole)]
[AuditCommand]
internal sealed partial class AdminController : UIControllerBase
{
    [RecursiveMember]
    public partial string KeyLine { get; set; } = "The signing key was issued when the workspace was created.";

    [RecursiveMember]
    public partial string AuditLines { get; set; } = string.Empty;

    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        AuditLines = DemoAuditLog.Read();
        return Task.CompletedTask;
    }

    [UICommand]
    public async Task RotateKeyAsync(CancellationToken cancellationToken)
    {
        await Task.Delay(400, cancellationToken).ConfigureAwait(false);

        KeyLine = $"The signing key was rotated at {DateTime.Now:HH:mm:ss}; sessions signed with the old one end at their next request.";
        AuditLines = DemoAuditLog.Read();
    }

    /// <summary>A command that fails: the filter records the failure, and the runtime says the command failed.</summary>
    [UICommand]
    public UICommandResult PurgeAudit()
    {
        AuditLines = DemoAuditLog.Read();
        return UICommandResult.Fail("The audit trail cannot be purged from the console.", [new ShowNotificationEffect("Refused by the command itself, not by the authorization check.", UIColorStyle.Warning)]);
    }

    [UICommand]
    public UICommandResult BackToAccount()
    {
        AuditLines = DemoAuditLog.Read();
        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = "/screens/account" })]);
    }
}
