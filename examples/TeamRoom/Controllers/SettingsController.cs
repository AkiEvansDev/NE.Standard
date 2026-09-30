using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using TeamRoom.Data;
using TeamRoom.Services;

namespace TeamRoom.Controllers;

/// <summary>A settings row whose editor is a picture picker: the upload's handle comes back on the row itself.</summary>
public sealed partial class PictureRow : KeyValueActionItem
{
    [RecursiveMember]
    public partial string? SelectionId { get; set; }
}

/// <summary>
/// The account's own page as a list of rows, each edited in place — the picture, the name, the chat's background and its fit — and
/// the password, changed in a dialog that asks for the current one first.
/// </summary>
public sealed partial class SettingsController : TeamRoomController
{
    public const string PictureRowId = "picture";
    public const string NameRowId = "name";
    public const string PasswordRowId = "password";
    public const string BackgroundRowId = "background";
    public const string FitRowId = "fit";
    public const string PasswordDialogKey = "settings-password";

    private const long MaxPictureBytes = 8 * 1024 * 1024;
    private const string PasswordMask = "••••••••";

    private static readonly (string Id, string Title)[] Fits =
    [
        (nameof(UIImageFit.Cover), "Cover"),
        (nameof(UIImageFit.Contain), "Contain"),
        (nameof(UIImageFit.Fill), "Stretch"),
        (nameof(UIImageFit.None), "As is")
    ];

    private readonly PictureRow _picture = Row<PictureRow>(PictureRowId, "Picture", "avatar");
    private readonly KeyValueActionItem _name = Row<KeyValueActionItem>(NameRowId, "Name", inputTemplate: null);
    private readonly KeyValueActionItem _password = Row<KeyValueActionItem>(PasswordRowId, "Password", inputTemplate: null);
    private readonly PictureRow _background = Row<PictureRow>(BackgroundRowId, "Chat background", "picture");
    private readonly KeyValueActionItem _fit = Row<KeyValueActionItem>(FitRowId, "Background fit", "fit");

    /// <summary>The login and the role, under the card's title.</summary>
    [RecursiveMember]
    public partial string AccountLine { get; set; } = string.Empty;

    /// <summary>The login, read-only in the password dialog so the browser knows whose password changes.</summary>
    [RecursiveMember]
    public partial string Login { get; set; } = string.Empty;

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Rows { get; } = [];

    [RecursiveMember]
    public partial string? BackgroundSource { get; set; }

    [RecursiveMember]
    public partial UIImageFit PreviewFit { get; set; } = UIImageFit.Cover;

    /// <summary>The line in the empty preview; a picture speaks for itself.</summary>
    [RecursiveMember]
    public partial UIVisibility PreviewCaptionVisibility { get; set; } = UIVisibility.Visible;

    [RecursiveMember]
    public partial string CurrentPassword { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string NewPassword { get; set; } = string.Empty;

    private static TRow Row<TRow>(string id, string key, string? inputTemplate)
        where TRow : KeyValueActionItem, new()
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem(),
            InputTemplate = inputTemplate
        };

    protected override Task OnAccountReadyAsync(CancellationToken cancellationToken)
    {
        Rows.Add(_picture);
        Rows.Add(_name);
        Rows.Add(_password);
        Rows.Add(_background);
        Rows.Add(_fit);

        Text(_password).Title = PasswordMask;

        ShowAccount();
        ShowBackground();

        return Task.CompletedTask;
    }

    /// <summary>The rows that read from the account: the picture, the name, the line under the title.</summary>
    private void ShowAccount()
    {
        Login = Account.Login;
        AccountLine = $"{Account.Login} · {RoleLabel}";
        Text(_name).Title = Account.Nickname;
        Text(_picture).Icon = AvatarSource ?? AppImages.DefaultAvatar;
        Text(_picture).Title = Account.AvatarMediaId is null ? "No picture yet" : MediaStore.NameOf(Account.AvatarMediaId) ?? "Your picture";
    }

    private void ShowBackground()
    {
        var mediaId = Account.BackgroundMediaId;
        var fit = Account.BackgroundFit ?? nameof(UIImageFit.Cover);

        BackgroundSource = mediaId is null ? null : MediaStore.AddressOf(mediaId);
        PreviewFit = Enum.TryParse(fit, out UIImageFit parsed) ? parsed : UIImageFit.Cover;
        PreviewCaptionVisibility = mediaId is null ? UIVisibility.Visible : UIVisibility.Collapsed;

        Text(_background).Title = mediaId is null ? "None" : MediaStore.NameOf(mediaId) ?? "A picture";
        Text(_background).Icon = BackgroundSource;
        Text(_fit).Title = FitTitle(fit);
    }

    private static string FitTitle(string id)
    {
        foreach ((var fitId, var title) in Fits)
        {
            if (fitId == id)
                return title;
        }

        return Fits[0].Title;
    }

    private static TextItem Text(KeyValueActionItem row)
        => (TextItem)row.Value;

    /// <summary>
    /// The pencil: the draft is seeded from what the row shows, and the row turns into its editor. The password's pencil opens
    /// its dialog instead, since a change needs the current password beside the new one.
    /// </summary>
    [UICommand]
    public UICommandResult OpenRow(string id)
    {
        if (id == PasswordRowId)
        {
            CurrentPassword = string.Empty;
            NewPassword = string.Empty;

            return UICommandResult.Ok([new OpenDialogEffect(PasswordDialogKey)]);
        }

        KeyValueActionItem? row = Find(id);

        if (row is null)
            return UICommandResult.Ok();

        row.EditValue = id switch
        {
            NameRowId => Account.Nickname,
            FitRowId => Account.BackgroundFit ?? nameof(UIImageFit.Cover),
            PictureRowId => AvatarSource,
            BackgroundRowId => BackgroundSource,
            _ => null
        };
        row.ShowInput = true;

        return UICommandResult.Ok();
    }

    private KeyValueActionItem? Find(string id)
    {
        foreach (KeyValueActionItem row in Rows)
        {
            if (row.Id == id)
                return row;
        }

        return null;
    }

    /// <summary>Save on a row: the draft goes to the account the way that row's setting is kept; a refusal leaves the row open.</summary>
    [UICommand]
    public async Task<UICommandResult> SaveRowAsync(string id, CancellationToken cancellationToken)
    {
        KeyValueActionItem? row = Find(id);

        if (row is null)
            return Refuse("No such row.");

        var draft = Convert.ToString(row.EditValue, CultureInfo.InvariantCulture) ?? string.Empty;

        var error = id switch
        {
            NameRowId => AccountStore.Rename(AccountId, draft),
            FitRowId => ChooseFit(draft),
            PictureRowId => await TakePictureAsync(_picture, MediaPurposes.Avatar, cancellationToken).ConfigureAwait(false),
            BackgroundRowId => await TakePictureAsync(_background, MediaPurposes.Background, cancellationToken).ConfigureAwait(false),
            _ => "No such row."
        };

        if (error is not null)
            return Refuse(error);

        row.ShowInput = false;
        row.EditValue = null;

        // The account changed under the base's hands: it re-reads on the event, this page re-reads the rows now.
        if (AccountStore.Find(AccountId) is { } account)
            Apply(account);

        ShowAccount();
        ShowBackground();

        return Notify("Saved.", UIColorStyle.Success);
    }

    private string? ChooseFit(string id)
    {
        if (!Enum.TryParse(id, out UIImageFit _))
            return "Unknown fit.";

        // The fit is kept with the picture; without one it waits for the next picture.
        AccountStore.SetBackground(AccountId, Account.BackgroundMediaId, id);

        return null;
    }

    /// <summary>Reads the picked file out of the upload store into the application's own and makes it the account's; says why when it will not do.</summary>
    private async Task<string?> TakePictureAsync(PictureRow row, string purpose, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(row.SelectionId))
            return "Nothing was picked.";

        UIUploadSelection selection = await Context.Uploads.GetSelectionAsync(Context.Handle, row.SelectionId, cancellationToken).ConfigureAwait(false);

        row.SelectionId = null;

        if (selection.Files.Length == 0)
            return "Nothing was picked.";

        UIUploadFile file = selection.Files[0];

        if (!MediaService.IsImage(file.ContentType))
            return "That is not a picture.";

        if (file.Size > MaxPictureBytes)
            return "A picture is at most 8 MB.";

        UIUploadedFile upload = await Context.Uploads.OpenAsync(Context.Handle, file.FileId, cancellationToken: cancellationToken).ConfigureAwait(false);
        string mediaId;

        await using (upload.ConfigureAwait(false))
            mediaId = await MediaStore.StoreAsync(AccountId, purpose, file.ContentType!, upload.Content, file.Size, file.FileName, cancellationToken).ConfigureAwait(false);

        if (purpose == MediaPurposes.Avatar)
        {
            var previous = Account.AvatarMediaId;

            AccountStore.SetAvatar(AccountId, mediaId);

            if (previous is not null)
                MediaStore.Delete(previous);
        }
        else
        {
            ReplaceBackground(mediaId);
        }

        return null;
    }

    private void ReplaceBackground(string? mediaId)
    {
        var previous = Account.BackgroundMediaId;

        AccountStore.SetBackground(AccountId, mediaId, Account.BackgroundFit ?? nameof(UIImageFit.Cover));

        if (previous is not null && previous != mediaId)
            MediaStore.Delete(previous);
    }

    /// <summary>The dialog's Save: the current password first, then the new one; every other session of the account is signed out.</summary>
    [UICommand]
    public async Task<UICommandResult> ChangePasswordAsync(CancellationToken cancellationToken)
    {
        var error = await AccountStore.ChangePasswordAsync(AccountId, CurrentPassword, NewPassword, Context.Handle.Session.SessionId, cancellationToken).ConfigureAwait(false);

        CurrentPassword = string.Empty;
        NewPassword = string.Empty;

        if (error is not null)
            return Refuse(error);

        return UICommandResult.Ok([
            new CloseDialogEffect(PasswordDialogKey),
            new ShowNotificationEffect("Your password is changed; your other sessions are signed out.", UIColorStyle.Success)
        ]);
    }

    [UICommand]
    public UICommandResult ClosePasswordDialog()
    {
        CurrentPassword = string.Empty;
        NewPassword = string.Empty;

        return UICommandResult.Ok([new CloseDialogEffect(PasswordDialogKey)]);
    }

    [UICommand]
    public UICommandResult RemoveBackground()
    {
        ReplaceBackground(null);

        if (AccountStore.Find(AccountId) is { } account)
            Apply(account);

        ShowBackground();

        return Notify("The chat is back on the plain ground.");
    }
}
