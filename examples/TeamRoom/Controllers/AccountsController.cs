using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;
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
/// The administrators' page: who is in, with which role, and the four things done to an account — a new one, a role, a block, a fresh password.
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
        if (appEvent is AccountChanged)
            Push(LoadRows);
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

    [UICommand]
    public UICommandResult ToggleRole(string id)
    {
        AccountRecord? account = AccountStore.Find(id);

        if (account is null)
            return UICommandResult.Ok();

        if (account.Id == AccountId)
            return Refuse("Your own role is another administrator's to change.");

        var error = AccountStore.SetRole(id, account.IsAdmin ? AccountRoles.User : AccountRoles.Admin);

        if (error is not null)
            return Refuse(error);

        LoadRows();

        return UICommandResult.Ok();
    }

    [UICommand]
    public UICommandResult ToggleBlocked(string id)
    {
        AccountRecord? account = AccountStore.Find(id);

        if (account is null)
            return UICommandResult.Ok();

        if (account.Id == AccountId)
            return Refuse("You cannot block yourself.");

        var error = AccountStore.SetBlocked(id, !account.IsBlocked);

        if (error is not null)
            return Refuse(error);

        LoadRows();

        return account.IsBlocked ? Notify($"{account.Nickname} can sign in again.", UIColorStyle.Success) : Notify($"{account.Nickname} is blocked; open pages close on their next move.", UIColorStyle.Warning);
    }

    /// <summary>A fresh password, shown once in a dialog: the administrator passes it on, the application never shows it again.</summary>
    [UICommand]
    public UICommandResult ResetPassword(string id)
    {
        AccountRecord? account = AccountStore.Find(id);

        if (account is null)
            return UICommandResult.Ok();

        var password = AccountStore.ResetPassword(id);

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
    public UICommandResult Delete()
    {
        if (_pendingDeleteId is null)
            return UICommandResult.Ok([new CloseDialogEffect(DeleteDialogKey)]);

        var error = AccountStore.Delete(_pendingDeleteId);
        _pendingDeleteId = null;

        if (error is not null)
            return UICommandResult.Ok([new CloseDialogEffect(DeleteDialogKey), new ShowNotificationEffect(error, UIColorStyle.Danger)]);

        LoadRows();

        return UICommandResult.Ok([new CloseDialogEffect(DeleteDialogKey)]);
    }

    [UICommand]
    public static UICommandResult CloseDialogs()
        => UICommandResult.Ok([new CloseDialogEffect(NewDialogKey), new CloseDialogEffect(PasswordDialogKey), new CloseDialogEffect(DeleteDialogKey)]);
}
