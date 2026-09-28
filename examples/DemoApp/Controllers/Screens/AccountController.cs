using System;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Security;

namespace DemoApp.Controllers.Screens;

/// <summary>
/// Any signed-in session may open this page; the commands on it are not all alike. Every command is audited by the filter on
/// the class, and the refusal of one is the framework's, before any filter runs.
/// </summary>
[UIAuthorize]
[AuditCommand]
internal sealed partial class AccountController : UIControllerBase
{
    [RecursiveMember]
    public partial string UserLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string RolesLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string PermissionsLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string AuditLines { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string ReportLine { get; set; } = "No report has been produced in this session.";

    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        IUserSessionContext session = Context.Handle.Session;

        UserLine = session.UserId ?? "(no user id)";
        RolesLine = string.Join(", ", session.Roles);
        PermissionsLine = string.Join(", ", session.Permissions);
        AuditLines = DemoAuditLog.Read();

        return Task.CompletedTask;
    }

    /// <summary>Open to every signed-in session: the permission every account carries.</summary>
    [UICommand]
    [UIAuthorize(Permissions = DemoAccounts.ViewReportsPermission)]
    public void ViewReport()
    {
        ReportLine = $"The monthly revenue report was opened at {DateTime.Now:HH:mm:ss}.";
        AuditLines = DemoAuditLog.Read();
    }

    /// <summary>Refused for the viewer: the runtime says so in a notification, and the audit log never sees the press.</summary>
    [UICommand]
    [UIAuthorize(Permissions = DemoAccounts.ExportReportsPermission)]
    public void ExportReport()
    {
        ReportLine = $"The monthly revenue report was exported at {DateTime.Now:HH:mm:ss}.";
        AuditLines = DemoAuditLog.Read();
    }

    [UICommand]
    public void RefreshAudit()
        => AuditLines = DemoAuditLog.Read();

    /// <summary>A page a viewer may not open: the refusal is a forbidden page, not a sign-in.</summary>
    [UICommand]
    public UICommandResult OpenAdmin()
    {
        AuditLines = DemoAuditLog.Read();
        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = "/screens/admin" })]);
    }

    [UICommand]
    public async Task<UICommandResult> SignOutAsync(CancellationToken cancellationToken)
    {
        await Context.SignOutAsync(cancellationToken).ConfigureAwait(false);

        return UICommandResult.Ok([
            new ShowNotificationEffect("Signed out.", UIColorStyle.Info),
            new NavigateEffect(new UINavigationRequest { Route = "/screens/sign-in" })
        ]);
    }
}
