using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using TeamRoom.Data;
using TeamRoom.Services;

namespace TeamRoom.Controllers;

/// <summary>One account as the table shows it.</summary>
public sealed partial class AccountRow : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public required string Id { get; init; }

    [RecursiveMember]
    public partial string Login { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Nickname { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Role { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Status { get; set; } = string.Empty;

    [RecursiveMember]
    public partial UIBadgeType StatusStyle { get; set; } = UIBadgeType.Success;

    [RecursiveMember]
    public partial string Created { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string BlockTitle { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string RoleTitle { get; set; } = string.Empty;
}

/// <summary>
/// The administrators' page: who is in, with which role, and the five things done to an account — a new one, a role, a block, a fresh password, a deletion.
/// </summary>
[UIAuthorize(AccountRoles.Admin)]
public sealed partial class AccountsController : TeamRoomController
{
    public const string NewDialogKey = "accounts-new";
    public const string PasswordDialogKey = "accounts-password";
    public const string DeleteDialogKey = "accounts-delete";

    private string? _pendingDeleteId;

    [RecursiveMember(false)]
    public RecursiveCollection<AccountRow> Rows { get; } = [];

    [RecursiveMember]
    public partial string NewLogin { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string NewNickname { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string NewPassword { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string NewRole { get; set; } = AccountRoles.User;

    [RecursiveMember]
    public partial string PasswordNotice { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string DeleteQuestion { get; set; } = string.Empty;

    protected override Task OnAccountReadyAsync(CancellationToken cancellationToken)
    {
        LoadRows();

        return Task.CompletedTask;
    }

    private void LoadRows()
    {
        Rows.Clear();

        foreach (AccountRecord account in AccountStore.List())
        {
            Rows.Add(new AccountRow
            {
                Id = account.Id,
                Login = account.Login,
                Nickname = account.Nickname,
                Role = account.IsAdmin ? "Administrator" : "Member",
                Status = account.IsBlocked ? "Blocked" : "Active",
                StatusStyle = account.IsBlocked ? UIBadgeType.Danger : UIBadgeType.Success,
                Created = account.CreatedUtc.ToLocalTime().ToString("d MMM yyyy", CultureInfo.InvariantCulture),
                BlockTitle = account.IsBlocked ? "Unblock" : "Block",
                RoleTitle = account.IsAdmin ? "Make member" : "Make administrator"
            });
        }
    }

    protected override void OnAppEvent(AppEvent appEvent)
    {
        if (appEvent is not AccountChanged changed)
            return;

        // Queued behind the base's own re-read of the account, so a demotion of this administrator is already applied here: its
        // commands on this page are refused from now on, and the page does not stay to say so.
        Push(() =>
        {
            if (changed.AccountId == AccountId && !IsAdmin)
            {
                ClearAdministration();
                Go(AppRoutes.Files);
            }
            else
            {
                LoadRows();
            }
        });
    }

    /// <summary>What only an administrator may see goes with the role.</summary>
    private void ClearAdministration()
    {
        Rows.Clear();
        PasswordNotice = string.Empty;
        DeleteQuestion = string.Empty;
        _pendingDeleteId = null;
    }

    [UICommand]
    public UICommandResult OpenNew()
    {
        NewLogin = string.Empty;
        NewNickname = string.Empty;
        NewPassword = string.Empty;
        NewRole = AccountRoles.User;

        return UICommandResult.Ok([new OpenDialogEffect(NewDialogKey)]);
    }

    [UICommand]
    public UICommandResult Create()
    {
        var error = AccountStore.Create(NewLogin, NewNickname, NewPassword, NewRole, out _);

        if (error is not null)
            return Refuse(error);

        LoadRows();

        return UICommandResult.Ok([new CloseDialogEffect(NewDialogKey), new ShowNotificationEffect($"'{NewLogin.Trim()}' can sign in now.", UIColorStyle.Success)]);
    }

    /// <summary>The account's sessions take the new role at once: its open pages are checked against it from their next command.</summary>
    [UICommand]
    public async Task<UICommandResult> ToggleRoleAsync(string id, CancellationToken cancellationToken)
    {
        AccountRecord? account = AccountStore.Find(id);

        if (account is null)
            return UICommandResult.Ok();

        if (account.Id == AccountId)
            return Refuse("Your own role is another administrator's to change.");

        var error = await AccountStore.SetRoleAsync(id, account.IsAdmin ? AccountRoles.User : AccountRoles.Admin, cancellationToken).ConfigureAwait(false);

        if (error is not null)
            return Refuse(error);

        LoadRows();

        return UICommandResult.Ok();
    }

    [UICommand]
    public async Task<UICommandResult> ToggleBlockedAsync(string id, CancellationToken cancellationToken)
    {
        AccountRecord? account = AccountStore.Find(id);

        if (account is null)
            return UICommandResult.Ok();

        if (account.Id == AccountId)
            return Refuse("You cannot block yourself.");

        var error = await AccountStore.SetBlockedAsync(id, !account.IsBlocked, cancellationToken).ConfigureAwait(false);

        if (error is not null)
            return Refuse(error);

        LoadRows();

        return account.IsBlocked ? Notify($"{account.Nickname} can sign in again.", UIColorStyle.Success) : Notify($"{account.Nickname} is blocked and signed out everywhere.", UIColorStyle.Warning);
    }

    /// <summary>A fresh password, shown once in a dialog: the administrator passes it on, the application never shows it again.</summary>
    [UICommand]
    public async Task<UICommandResult> ResetPasswordAsync(string id, CancellationToken cancellationToken)
    {
        AccountRecord? account = AccountStore.Find(id);

        if (account is null)
            return UICommandResult.Ok();

        // A reset ends every session of the account, the asking page's among them, and the new password would never be seen.
        if (account.Id == AccountId)
            return Refuse("Change your own password in Settings.");

        var password = await AccountStore.ResetPasswordAsync(id, cancellationToken).ConfigureAwait(false);

        PasswordNotice = $"{account.Nickname} ({account.Login}) signs in with: {password}";

        return UICommandResult.Ok([new OpenDialogEffect(PasswordDialogKey)]);
    }

    [UICommand]
    public UICommandResult AskDelete(string id)
    {
        AccountRecord? account = AccountStore.Find(id);

        if (account is null)
            return UICommandResult.Ok();

        if (account.Id == AccountId)
            return Refuse("You cannot delete yourself.");

        _pendingDeleteId = id;
        DeleteQuestion = $"Delete {account.Nickname} ({account.Login})? Their messages stay; the account is gone.";

        return UICommandResult.Ok([new OpenDialogEffect(DeleteDialogKey)]);
    }

    [UICommand]
    public async Task<UICommandResult> DeleteAsync(CancellationToken cancellationToken)
    {
        if (_pendingDeleteId is null)
            return UICommandResult.Ok([new CloseDialogEffect(DeleteDialogKey)]);

        var pendingDeleteId = _pendingDeleteId;
        _pendingDeleteId = null;

        var error = await AccountStore.DeleteAsync(pendingDeleteId, cancellationToken).ConfigureAwait(false);

        if (error is not null)
            return UICommandResult.Ok([new CloseDialogEffect(DeleteDialogKey), new ShowNotificationEffect(error, UIColorStyle.Danger)]);

        LoadRows();

        return UICommandResult.Ok([new CloseDialogEffect(DeleteDialogKey)]);
    }

    /// <summary>Closes whichever dialog is up; a password that was shown once is not kept to be shown again on the next load.</summary>
    [UICommand]
    public UICommandResult CloseDialogs()
    {
        PasswordNotice = string.Empty;
        NewPassword = string.Empty;

        return UICommandResult.Ok([new CloseDialogEffect(NewDialogKey), new CloseDialogEffect(PasswordDialogKey), new CloseDialogEffect(DeleteDialogKey)]);
    }
}
