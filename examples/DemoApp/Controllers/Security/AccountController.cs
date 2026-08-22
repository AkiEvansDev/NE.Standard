using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using DemoApp.Security;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Sessions;

namespace DemoApp.Controllers.Security;

internal sealed partial class AccountGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string SessionId { get; set; } = "---";

    [RecursiveMember]
    public partial string Roles { get; set; } = "---";

    [RecursiveMember]
    public partial string Permissions { get; set; } = "---";

    [RecursiveMember]
    public partial string Audit { get; set; } = "(nothing yet)";

    public void Show(UserSessionState? session)
    {
        SessionId = session?.SessionId ?? "(no live session)";
        Roles = Join(session?.Roles);
        Permissions = Join(session?.Permissions);
        Audit = DemoAuditLog.Read();
    }

    private static string Join(IReadOnlySet<string>? values)
        => values is null || values.Count == 0 ? "(none)" : string.Join(", ", values);

    public void ReportCommand(string command)
        => LogEvent($"'{command}' ran — the session carried the permission it requires.");
}

/// <summary>
/// The protected page. <c>[UIAuthorize]</c> without arguments closes the route to anyone not signed in; the
/// commands below add their own requirements on top of that.
/// </summary>
/// <remarks>
/// <c>[AuditCommand]</c> on the class wraps <em>every</em> command here, which is the point of a command
/// filter — the audit is not repeated in any of them.
/// </remarks>
[UIAuthorize]
[AuditCommand]
internal sealed partial class AccountController() : DemoController
{
    [RecursiveMember]
    public partial AccountGroupContext AccountGroup { get; set; } = new();

    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
        => RefreshAsync(cancellationToken);

    /// <summary>
    /// Reads the session from the store rather than from the handle, so what the page shows is what the access
    /// checks actually see — the handle's copy was taken when this connection attached and does not move.
    /// </summary>
    private async Task RefreshAsync(CancellationToken cancellationToken)
    {
        UserSessionState? session = await Context.GetSessionAsync(cancellationToken).ConfigureAwait(false);

        AccountGroup.Show(session);
    }

    [UICommand]
    public Task RefreshSessionAsync(CancellationToken cancellationToken)
        => RefreshAsync(cancellationToken);

    [UICommand]
    [UIAuthorize(Permissions = DemoAccounts.ViewReportsPermission)]
    public void ViewReports()
        => AccountGroup.ReportCommand(nameof(ViewReports));

    /// <summary>
    /// Only the admin account carries this permission, so the same button is a working command for one account
    /// and a refusal for the other — without either page being built differently.
    /// </summary>
    [UICommand]
    [UIAuthorize(Permissions = DemoAccounts.ExportReportsPermission)]
    public void ExportReports()
        => AccountGroup.ReportCommand(nameof(ExportReports));

    /// <summary>
    /// Revokes the export permission on this live session. <see cref="ExportReports"/> starts failing on the
    /// next click without a reload, because the command check reads the store and not the attached snapshot.
    /// </summary>
    [UICommand]
    public async Task RevokeExportPermissionAsync(CancellationToken cancellationToken)
    {
        await Context.UpdateSessionAsync(
            session => session with { Permissions = Remove(session.Permissions, DemoAccounts.ExportReportsPermission) },
            cancellationToken
        ).ConfigureAwait(false);

        await RefreshAsync(cancellationToken).ConfigureAwait(false);

        AccountGroup.Message = $"'{DemoAccounts.ExportReportsPermission}' revoked. Export now fails; the page itself stays as it is.";
    }

    private static FrozenSet<string> Remove(IReadOnlySet<string> values, string value)
    {
        HashSet<string> remaining = new(values, StringComparer.Ordinal);

        _ = remaining.Remove(value);

        return FrozenSet.ToFrozenSet(remaining, StringComparer.Ordinal);
    }

    /// <summary>
    /// Drops the session and navigates away. The navigation is what moves the user off the page — nothing
    /// pushes it for us, so a sign-out that only removed the session would leave the page sitting there with
    /// every command on it refused.
    /// </summary>
    [UICommand]
    public async Task<UICommandResult> SignOutAsync(CancellationToken cancellationToken)
    {
        await Context.SignOutAsync(cancellationToken).ConfigureAwait(false);

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = SecurityRoutes.SignIn })]);
    }
}
