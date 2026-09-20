using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Extensions;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Screens;

/// <summary>
/// Settings the way they are actually edited: no submit button anywhere. Underlined fields save as the viewer leaves them,
/// switches on the flip, the security rows in place, and the danger zone is unlocked by typing the workspace's name.
/// </summary>
internal sealed class WorkspaceSettingsView : DemoScreenView, IUIViewDefinition
{
    private const string QuietHoursId = "settings-quiet-hours";
    private const string DeleteConfirmationId = "settings-delete-confirmation";

    public static string ViewKey => "demo.screens.settings";

    protected override string ComponentRoute => "/screens/settings";
    protected override string Header => "demo.screens.settings.header";
    protected override string HeaderDescription => "demo.screens.settings.description";

    protected override IVisualComponent CreateScreen()
        => UILayout.Stack(24, CreateProfile(), CreateNotifications(), CreateSecurity(), CreateDangerZone())
            .SetMaxWidth(UILayoutLength.Absolute(760))
            .SetPadding(UIThickness.All(0, 8, 0, 0))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>Underlined fields, each committing on blur through the same command; the note under the card names the save.</summary>
    private static CardComponent CreateProfile()
        => UIPage.Card("Profile", "How you appear to the rest of the room.", UILayout.Stack(16,
            new ImageInputComponent()
                .SetTitle("Picture")
                .SetShape(UIImageInputShape.Avatar)
                .SetPlaceholderIcon(DemoIcons.Outline(DemoIcons.UserRound)),
            new TextInputComponent()
                .SetTitle("Display name")
                .SetAppearance(UIInputAppearance.Underline)
                .BindValue(nameof(WorkspaceSettingsController.DisplayName))
                .OnChange(nameof(WorkspaceSettingsController.SaveProfile)),
            UIForm.Field(new TextAreaComponent()
                .SetTitle("About you")
                .SetAppearance(UIInputAppearance.Underline)
                .SetRows(2)
                .SetMaxLength(160)
                .BindValue(nameof(WorkspaceSettingsController.Bio))
                .OnChange(nameof(WorkspaceSettingsController.SaveProfile)),
                "A line under your name, a hundred and sixty characters at most."),
            UIForm.Row(
                new SelectComponent()
                    .SetTitle("Time zone")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetOptions(
                    [
                        new OptionItem { Id = "europe-lisbon", Title = "Lisbon (UTC+1)" },
                        new OptionItem { Id = "europe-berlin", Title = "Berlin (UTC+2)" },
                        new OptionItem { Id = "america-new-york", Title = "New York (UTC−4)" },
                        new OptionItem { Id = "asia-tokyo", Title = "Tokyo (UTC+9)" }
                    ])
                    .BindValue(nameof(WorkspaceSettingsController.TimeZone))
                    .OnChange(nameof(WorkspaceSettingsController.SaveProfile)),
                new SelectComponent()
                    .SetTitle("Language")
                    .SetAppearance(UIInputAppearance.Underline)
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
            CreateSwitch("Deploys", "When a release goes out, or comes back.", nameof(WorkspaceSettingsController.DeployMail)),
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
                    .SetAppearance(UIInputAppearance.Underline)
                    .BindValue(nameof(WorkspaceSettingsController.QuietFrom))
                    .OnChange(nameof(WorkspaceSettingsController.SaveNotifications)),
                new TimeInputComponent()
                    .SetTitle("Until")
                    .SetAppearance(UIInputAppearance.Underline)
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
                    .SetPlaceholder("A new password")
                )
                .AddValueInputTemplate("two-factor", new SelectComponent()
                    .SetOptions([new OptionItem { Id = "On", Title = "On" }, new OptionItem { Id = "Off", Title = "Off" }])
                )
                .EnableEditing(nameof(WorkspaceSettingsController.SaveRow), nameof(WorkspaceSettingsController.OpenRow)),
            new SeparatorComponent(),
            UILayout.Columns(16,
                UIText.Body("Signed-in devices").BindDescription(nameof(WorkspaceSettingsController.DevicesLine)).SetDescriptionColor(UIThemeColor.Muted),
                UIButtons.Toolbar(UIButtons.Secondary("Sign out the others").OnClick(nameof(WorkspaceSettingsController.SignOutOthers)))
                    .SetHorizontalAlignment(UIAlignment.End)
            )
        ), DemoIcons.Outline(DemoIcons.Lock));

    /// <summary>The button is disabled until the typed name matches — compared in the browser, so nothing is sent until it does.</summary>
    private static CardComponent CreateDangerZone()
        => UIPage.Card("Danger zone", "The one thing on this page that cannot be undone.", UILayout.Stack(16,
            UIText.Paragraph($"Deleting **{WorkspaceSettingsController.WorkspaceName}** removes every room, file and message in it. Type the workspace's name to unlock the button."),
            UIForm.Row(
                new TextInputComponent(DeleteConfirmationId)
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetPlaceholder(WorkspaceSettingsController.WorkspaceName)
                    .SetTrimInput()
                    .SetDebounceMilliseconds(150)
                    .BindValue(nameof(WorkspaceSettingsController.DeleteConfirmation)),
                UIButtons.Danger("Delete workspace", DemoIcons.Outline(DemoIcons.Alert))
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .EnabledWhen(DeleteConfirmationId, WorkspaceSettingsController.WorkspaceName)
                    .OnClick(nameof(WorkspaceSettingsController.DeleteWorkspace))
            )
        ), DemoIcons.Outline(DemoIcons.Alert));
}
