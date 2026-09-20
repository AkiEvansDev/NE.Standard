using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Extensions;

namespace DemoApp.Views.Screens;

/// <summary>The console only the admin role opens: a slow command, a failing one, and the audit trail they write.</summary>
internal sealed class AdminView : DemoScreenView, IUIViewDefinition
{
    public static string ViewKey => "demo.screens.admin";

    protected override string ComponentRoute => "/screens/admin";
    protected override string Header => "demo.screens.admin.header";
    protected override string HeaderDescription => "demo.screens.admin.description";

    protected override IVisualComponent CreateScreen()
        => UILayout.Columns(16,
            UIPage.Card("Signing key", null, UILayout.Stack(12,
                UIText.Note(string.Empty).BindDescription(nameof(AdminController.KeyLine)),
                UIButtons.Toolbar(
                    UIButtons.Primary("Rotate the key", DemoIcons.Outline(DemoIcons.Refresh))
                        .OnClick(nameof(AdminController.RotateKeyAsync))
                        .InteractBeforeClick(IVisualComponent.LoadingProperty, true)
                        .InteractAfterClick(IVisualComponent.LoadingProperty, false),
                    UIButtons.Danger("Purge the audit trail").OnClick(nameof(AdminController.PurgeAudit)),
                    UIButtons.Ghost("Back to the account").OnClick(nameof(AdminController.BackToAccount))
                )
            ), DemoIcons.Outline(DemoIcons.Shield)),
            UIPage.Card("Audit trail", "The same trail the account page shows; the console's own presses join it.", UILayout.Stack(12,
                UIText.Paragraph(string.Empty).BindDescription(nameof(AdminController.AuditLines))
            ), DemoIcons.Outline(DemoIcons.History))
        ).SetPlacement(1, 1, 24, 1);
}
