using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Screens;

/// <summary>
/// A workspace's settings as they are kept: each field saves as the viewer leaves it, the switches save on the flip, the
/// security rows edit in place, and the danger zone only pretends.
/// </summary>
internal sealed partial class WorkspaceSettingsController : UIControllerBase
{
    public const string WorkspaceName = "northwind";
    public const string PasswordRowId = "password";
    public const string RecoveryRowId = "recovery";
    public const string TwoFactorRowId = "two-factor";

    private const string PasswordMask = "••••••••••";

    private readonly KeyValueActionItem _password = Row(PasswordRowId, "Password", PasswordMask, "password");
    private readonly KeyValueActionItem _recovery = Row(RecoveryRowId, "Recovery email", "robin.h@example.org", null);
    private readonly KeyValueActionItem _twoFactor = Row(TwoFactorRowId, "Two-factor authentication", "On", "two-factor");

    [RecursiveMember]
    public partial string? DisplayName { get; set; } = "Robin Hale";

    [RecursiveMember]
    public partial string? Bio { get; set; } = "Keeps the deploy calendar and the coffee machine running.";

    [RecursiveMember]
    public partial string? TimeZone { get; set; } = "europe-lisbon";

    [RecursiveMember]
    public partial string? Language { get; set; } = "en";

    [RecursiveMember]
    public partial string ProfileNote { get; set; } = "Every field saves as you leave it.";

    [RecursiveMember]
    public partial bool? MentionMail { get; set; } = true;

    [RecursiveMember]
    public partial bool? DigestMail { get; set; } = true;

    [RecursiveMember]
    public partial bool? DeployMail { get; set; } = false;

    [RecursiveMember]
    public partial string? Digest { get; set; } = "daily";

    [RecursiveMember]
    public partial bool? QuietHours { get; set; } = false;

    [RecursiveMember]
    public partial TimeOnly? QuietFrom { get; set; } = new(22, 0);

    [RecursiveMember]
    public partial TimeOnly? QuietUntil { get; set; } = new(8, 0);

    [RecursiveMember]
    public partial string NotificationsNote { get; set; } = "Saved on the flip.";

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> SecurityRows { get; } = [];

    [RecursiveMember]
    public partial string DevicesLine { get; set; } = "3 devices, the newest a phone in Lisbon.";

    [RecursiveMember]
    public partial string? DeleteConfirmation { get; set; }

    public WorkspaceSettingsController()
    {
        SecurityRows.Add(_password);
        SecurityRows.Add(_recovery);
        SecurityRows.Add(_twoFactor);
    }

    /// <summary>A profile field committed: the note under the section says so, with the time, so a save is seen to happen.</summary>
    [UICommand]
    public void SaveProfile()
        => ProfileNote = $"Saved at {Now()}.";

    [UICommand]
    public void SaveNotifications()
        => NotificationsNote = $"Saved at {Now()}.";

    /// <summary>The pencil: the draft is seeded from what the row keeps, which for the password is nothing.</summary>
    [UICommand]
    public void OpenRow(string id)
    {
        KeyValueActionItem? row = Find(id);

        if (row is null)
            return;

        row.EditValue = id == PasswordRowId ? string.Empty : Text(row).Title;
        row.ShowInput = true;
    }

    /// <summary>Save on a row: a short password is refused and the row stays open; the rest is kept and the row closes.</summary>
    [UICommand]
    public UICommandResult SaveRow(string id)
    {
        KeyValueActionItem? row = Find(id);

        if (row is null)
            return UICommandResult.Ok();

        var draft = Convert.ToString(row.EditValue, CultureInfo.InvariantCulture)?.Trim() ?? string.Empty;

        if (id == PasswordRowId && draft.Length < 8)
            return Notify("Eight characters at least; the password was not changed.", UIColorStyle.Danger);

        Text(row).Title = id == PasswordRowId ? PasswordMask : draft;
        row.ShowInput = false;
        row.EditValue = null;

        return id == PasswordRowId ? Notify("Your password is changed.", UIColorStyle.Success) : UICommandResult.Ok();
    }

    [UICommand]
    public UICommandResult SignOutOthers()
    {
        DevicesLine = "This device only.";
        return Notify("Every other device is signed out.", UIColorStyle.Success);
    }

    /// <summary>The danger zone's press: the demo has nothing to delete, and says so.</summary>
    [UICommand]
    public UICommandResult DeleteWorkspace()
    {
        DeleteConfirmation = null;
        return Notify("This is a demo: the workspace stays. Anywhere else, it would be gone.", UIColorStyle.Warning);
    }

    private KeyValueActionItem? Find(string id)
    {
        foreach (KeyValueActionItem row in SecurityRows)
        {
            if (row.Id == id)
                return row;
        }

        return null;
    }

    private static string Now()
        => DateTime.Now.ToString("HH:mm:ss", CultureInfo.InvariantCulture);

    private static UICommandResult Notify(string message, UIColorStyle severity)
        => UICommandResult.Ok([new ShowNotificationEffect(message, severity)]);

    private static TextItem Text(KeyValueActionItem row)
        => (TextItem)row.Value;

    private static KeyValueActionItem Row(string id, string key, string value, string? inputTemplate)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = value },
            InputTemplate = inputTemplate
        };
}
