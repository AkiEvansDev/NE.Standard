using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>
/// Settings the way they are actually edited: no submit button anywhere. Filled fields save as the viewer leaves them,
/// switches on the flip, the security rows in place, and the danger zone is unlocked by typing the account's name.
/// </summary>
internal sealed class WorkspaceSettingsView : DemoScreenView, IUIViewDefinition
{
    private const string QuietHoursId = "settings-quiet-hours";
    private const string DeleteConfirmationId = "settings-delete-confirmation";

    // Real forms to the browser, apart: the security card's password is no login of the display name's.
    private const string ProfileFormId = "settings-profile";
    private const string SecurityFormId = "settings-security";

    public static string ViewKey => "demo.screens.settings";

    protected override string ComponentRoute => "/screens/settings";
    protected override string Header => "demo.screens.settings.header";
    protected override string HeaderDescription => "demo.screens.settings.description";

    protected override IVisualComponent CreateScreen()
        => UILayout.Stack(24, CreateProfile(), CreateNotifications(), CreateSecurity(), CreateDangerZone())
            .SetMaxWidth(UILayoutLength.Absolute(760))
            .SetPadding(UIThickness.All(0, 8, 0, 0))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>Filled fields, each committing on blur through the same command; the note under the card names the save.</summary>
    /// <remarks>Filled, as a long form whose fields stack is; the danger zone's one field beside its button is Tonal.</remarks>
    private static CardComponent CreateProfile()
        => UIPage.Card("Profile", "How you appear to the rest of the staff.", UILayout.Stack(16,
            new ImageInputComponent()
                .SetTitle("Picture")
                .SetShape(UIImageInputShape.Avatar)
                .SetPlaceholderIcon(DemoIcons.Outline(DemoIcons.UserRound))
                .SetFormId(ProfileFormId),
            new TextInputComponent()
                .SetTitle("Display name")
                .SetFormId(ProfileFormId)
                .BindValue(nameof(WorkspaceSettingsController.DisplayName))
                .OnChange(nameof(WorkspaceSettingsController.SaveProfile)),
            UIForm.Field(new TextAreaComponent()
                .SetTitle("About you")
                .SetRows(2)
                .SetMaxLength(160)
                .SetFormId(ProfileFormId)
                .BindValue(nameof(WorkspaceSettingsController.Bio))
                .OnChange(nameof(WorkspaceSettingsController.SaveProfile)),
                "A line under your name, a hundred and sixty characters at most."),
            UIForm.Row(
                new SelectComponent()
                    .SetTitle("Time zone")
                    .SetFormId(ProfileFormId)
                    .SetOptions(
                    [
                        new OptionItem { Id = "europe-amsterdam", Title = "Amsterdam (UTC+2)" },
                        new OptionItem { Id = "europe-stockholm", Title = "Stockholm (UTC+2)" },
                        new OptionItem { Id = "america-ashburn", Title = "Ashburn (UTC−4)" },
                        new OptionItem { Id = "asia-singapore", Title = "Singapore (UTC+8)" }
                    ])
                    .BindValue(nameof(WorkspaceSettingsController.TimeZone))
                    .OnChange(nameof(WorkspaceSettingsController.SaveProfile)),
                new SelectComponent()
                    .SetTitle("Language")
                    .SetFormId(ProfileFormId)
                    .SetOptions(
                    [
                        new OptionItem { Id = "en", Title = "English" },
                        new OptionItem { Id = "pt", Title = "Português" },
                        new OptionItem { Id = "de", Title = "Deutsch" }
                    ])
                    .BindValue(nameof(WorkspaceSettingsController.Language))
                    .OnChange(nameof(WorkspaceSettingsController.SaveProfile))
            ),
            UIText.Note(string.Empty).BindDescription(nameof(WorkspaceSettingsController.ProfileNote))
        ), DemoIcons.Outline(DemoIcons.UserRound));

    /// <summary>A list of switches, a choice made across, and a pair of times a switch reveals.</summary>
    private static CardComponent CreateNotifications()
        => UIPage.Card("Notifications", "What reaches your mail, and when it stays quiet.", UILayout.Stack(16,
            CreateSwitch("Mentions", "Every time someone writes your name.", nameof(WorkspaceSettingsController.MentionMail)),
            CreateSwitch("The daily digest", "One mail with everything you missed.", nameof(WorkspaceSettingsController.DigestMail)),
            CreateSwitch("Deploys", "A release out, or rolled back.", nameof(WorkspaceSettingsController.DeployMail)),
            new RadioGroupComponent()
                .SetTitle("Send the digest")
                .SetOrientation(UIOrientation.Horizontal)
                .SetOptions(
                [
                    new OptionItem { Id = "instantly", Title = "As it happens" },
                    new OptionItem { Id = "hourly", Title = "Hourly" },
                    new OptionItem { Id = "daily", Title = "Once a day" }
                ])
                .BindValue(nameof(WorkspaceSettingsController.Digest))
                .OnChange(nameof(WorkspaceSettingsController.SaveNotifications)),
            CreateSwitch("Quiet hours", "Nothing is sent between the two times.", nameof(WorkspaceSettingsController.QuietHours), QuietHoursId),
            UIForm.Row(
                new TimeInputComponent()
                    .SetTitle("From")
                    .BindValue(nameof(WorkspaceSettingsController.QuietFrom))
                    .OnChange(nameof(WorkspaceSettingsController.SaveNotifications)),
                new TimeInputComponent()
                    .SetTitle("Until")
                    .BindValue(nameof(WorkspaceSettingsController.QuietUntil))
                    .OnChange(nameof(WorkspaceSettingsController.SaveNotifications))
            )
            .ShownWhen(QuietHoursId),
            UIText.Note(string.Empty).BindDescription(nameof(WorkspaceSettingsController.NotificationsNote))
        ), DemoIcons.Outline(DemoIcons.Bell));

    private static SwitchComponent CreateSwitch(string title, string description, string path, string? id = null)
        => new SwitchComponent(id)
            .SetTitle(title)
            .SetDescription(description)
            .SetDescriptionColor(UIThemeColor.Muted)
            .BindValue(path)
            .OnChange(nameof(WorkspaceSettingsController.SaveNotifications));

    /// <summary>Rows edited in place — the pencil opens one, Save hands the draft back by the row's id — and one line with a press.</summary>
    private static CardComponent CreateSecurity()
        => UIPage.Card("Security", "What you sign in with, and where you are signed in.", UILayout.Stack(12,
            new KeyValueActionComponent()
                .SetRowHoverable(true)
                .SetBorderThickness(UIThickness.Uniform(0))
                .BindItems(nameof(WorkspaceSettingsController.SecurityRows))
                .AddValueInputTemplate("password", new TextInputComponent()
                    .SetType(UITextInputType.Password)
                    .SetAutocomplete(UIAutocomplete.NewPassword)
                    .SetFormId(SecurityFormId)
                    .SetPlaceholder("A new password")
                )
                .AddValueInputTemplate("two-factor", new SelectComponent()
                    .SetOptions([new OptionItem { Id = "On", Title = "On" }, new OptionItem { Id = "Off", Title = "Off" }])
                )
                .EnableEditing(nameof(WorkspaceSettingsController.SaveRow), nameof(WorkspaceSettingsController.OpenRow)),
            new SeparatorComponent(),
            UILayout.Columns(16,
                UIText.Body("Signed-in devices").BindDescription(nameof(WorkspaceSettingsController.DevicesLine)).SetDescriptionColor(UIThemeColor.Muted).SetWrapMode(UITextWrapMode.Wrap),
                UIButtons.Toolbar(UIButtons.Secondary("Sign out the others").OnClick(nameof(WorkspaceSettingsController.SignOutOthers)))
                    .SetHorizontalAlignment(UIAlignment.End)
            )
        ), DemoIcons.Outline(DemoIcons.Lock));

    /// <summary>The button is disabled until the typed name matches — compared in the browser, so nothing is sent until it does.</summary>
    private static CardComponent CreateDangerZone()
        => UIPage.Card("Danger zone", "The one thing on this page that cannot be undone.", UILayout.Stack(16,
            UIMessage.Warning(null, $"Deleting **{WorkspaceSettingsController.AccountName}** removes every server, bucket and invoice in it, for good."),
            UIText.Paragraph("Type the account's name to unlock the button."),
            UIForm.Row(
                new TextInputComponent(DeleteConfirmationId)
                    .SetAppearance(UIInputAppearance.Tonal)
                    .SetPlaceholder(WorkspaceSettingsController.AccountName)
                    .SetTrimInput()
                    .SetDebounceMilliseconds(150)
                    .BindValue(nameof(WorkspaceSettingsController.DeleteConfirmation)),
                UIButtons.Danger("Delete account", DemoIcons.Outline(DemoIcons.Alert))
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .EnabledWhen(DeleteConfirmationId, WorkspaceSettingsController.AccountName)
                    .OnClick(nameof(WorkspaceSettingsController.DeleteAccount))
            )
        ), DemoIcons.Outline(DemoIcons.Alert));
}
