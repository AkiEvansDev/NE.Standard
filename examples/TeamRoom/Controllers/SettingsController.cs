using System;
using System.Globalization;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Files;
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
/// The account's own page as a list of rows, each edited in place: the picture, the name, the password, the chat's background and its fit.
/// </summary>
public sealed partial class SettingsController : TeamRoomController
{
    public const string PictureRowId = "picture";
    public const string NameRowId = "name";
    public const string PasswordRowId = "password";
    public const string BackgroundRowId = "background";
    public const string FitRowId = "fit";

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
    private readonly KeyValueActionItem _password = Row<KeyValueActionItem>(PasswordRowId, "Password", "password");
    private readonly PictureRow _background = Row<PictureRow>(BackgroundRowId, "Chat background", "picture");
    private readonly KeyValueActionItem _fit = Row<KeyValueActionItem>(FitRowId, "Background fit", "fit");

    /// <summary>The login and the role, under the card's title.</summary>
    [RecursiveMember]
    public partial string AccountLine { get; set; } = string.Empty;

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Rows { get; } = [];

    [RecursiveMember]
    public partial string? BackgroundSource { get; set; }

    [RecursiveMember]
    public partial UIImageFit PreviewFit { get; set; } = UIImageFit.Cover;

    /// <summary>The line in the empty preview; a picture speaks for itself.</summary>
    [RecursiveMember]
    public partial UIVisibility PreviewCaptionVisibility { get; set; } = UIVisibility.Visible;

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

    /// <summary>The pencil: the draft is seeded from what the row shows, and the row turns into its editor.</summary>
    [UICommand]
    public void OpenRow(string id)
    {
        KeyValueActionItem? row = Find(id);

        if (row is null)
            return;

        row.EditValue = id switch
        {
            NameRowId => Account.Nickname,
            PasswordRowId => string.Empty,
            FitRowId => Account.BackgroundFit ?? nameof(UIImageFit.Cover),
            PictureRowId => AvatarSource,
            BackgroundRowId => BackgroundSource,
            _ => null
        };
        row.ShowInput = true;
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
            PasswordRowId => AccountStore.SetOwnPassword(AccountId, draft),
            FitRowId => ChooseFit(draft),
            PictureRowId => await TakePictureAsync(_picture, MediaPurposes.Avatar, cancellationToken).ConfigureAwait(false),
            BackgroundRowId => await TakePictureAsync(_background, MediaPurposes.Background, cancellationToken).ConfigureAwait(false),
            _ => "No such row."
        };

        if (error is not null)
            return Refuse(error);

        row.ShowInput = false;
        row.EditValue = null;

        if (id == PasswordRowId)
            return Notify("Your password is changed.", UIColorStyle.Success);

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
        {
            using MemoryStream buffer = new();
            await upload.Content.CopyToAsync(buffer, cancellationToken).ConfigureAwait(false);

            mediaId = MediaStore.Store(AccountId, purpose, file.ContentType!, buffer.ToArray(), file.FileName);
        }

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
