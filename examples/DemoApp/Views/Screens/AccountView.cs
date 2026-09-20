using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Extensions;

namespace DemoApp.Views.Screens;

/// <summary>
/// Who is signed in and what they may do, with the three kinds of press: one every account may make, one only a permission
/// allows, and one that leads to a page only a role may open. The audit trail under them is what the command filter wrote.
/// </summary>
internal sealed class AccountView : DemoScreenView, IUIViewDefinition
{
    public static string ViewKey => "demo.screens.account";

    protected override string ComponentRoute => "/screens/account";
    protected override string Header => "demo.screens.account.header";
    protected override string HeaderDescription => "demo.screens.account.description";

    protected override IVisualComponent CreateScreen()
        => UILayout.Stack(16,
            UILayout.Columns(16,
                UIPage.Card("This session", "What SignInAsync was handed, read back from the session.", UILayout.Stack(12,
                    CreateLine("User", nameof(AccountController.UserLine)),
                    CreateLine("Roles", nameof(AccountController.RolesLine)),
                    CreateLine("Permissions", nameof(AccountController.PermissionsLine)),
                    UIButtons.Toolbar(
                        UIButtons.Secondary("Sign out", DemoIcons.Outline(DemoIcons.Close)).OnClick(nameof(AccountController.SignOutAsync))
                    )
                ), DemoIcons.Outline(DemoIcons.User)),
                UIPage.Card("Reports", "Every account may view; only reports.export may export; only an admin opens the console.", UILayout.Stack(12,
                    UIText.Note(string.Empty).BindDescription(nameof(AccountController.ReportLine)),
                    UIButtons.Toolbar(
                        UIButtons.Primary("View the weekly report").OnClick(nameof(AccountController.ViewReport)),
                        UIButtons.Secondary("Export it", DemoIcons.Outline(DemoIcons.Download)).OnClick(nameof(AccountController.ExportReport)),
                        UIButtons.Ghost("Open the admin console", DemoIcons.Outline(DemoIcons.Shield)).OnClick(nameof(AccountController.OpenAdmin))
                    )
                ), DemoIcons.Outline(DemoIcons.FileText))
            ),
            UIPage.Card("Audit trail", "Written by [AuditCommand] on this controller: who ran what, how it ended, how long it took. The filter writes after the command has answered, so a press shows up on the next read; a refused press never reaches it.", UILayout.Stack(12,
                UIText.Paragraph(string.Empty).BindDescription(nameof(AccountController.AuditLines)),
                UIButtons.Toolbar(UIButtons.Ghost("Refresh", DemoIcons.Outline(DemoIcons.Refresh)).OnClick(nameof(AccountController.RefreshAudit)))
            ), DemoIcons.Outline(DemoIcons.History))
        ).SetPlacement(1, 1, 24, 1);

    /// <summary>A caption over the value: the label small and muted, the session's word under it in body type.</summary>
    private static TextComponent CreateLine(string label, string path)
        => new TextComponent()
            .SetTitle(label)
            .SetTitleType(UITextAppearance.Caption)
            .SetTitleColor(UIThemeColor.Muted)
            .SetDescriptionType(UITextAppearance.Body)
            .SetDescriptionColor(UIThemeColor.OnBackground)
            .BindDescription(path);
}
