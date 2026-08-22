using DemoApp.Controllers.Security;
using DemoApp.Security;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Security;

/// <summary>
/// The closed half of the security demo. Reaching it at all proves the route check; the buttons on it prove
/// the command check, which reads the session as it is now rather than as it was at attach.
/// </summary>
internal sealed class AccountView : DemoView, IUIViewDefinition
{
    public static string ViewKey => "demo.security.account";

    protected override string ComponentRoute => SecurityRoutes.Account;
    protected override DemoViewKind ViewKind => DemoViewKind.Example;
    protected override DemoViewKind[] AvailableKinds => [];
    protected override string Header => "demo.security.account.header";
    protected override string HeaderDescription => "demo.security.account.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateSessionGroup())
            .AddChild(CreateCommandsGroup());
    }

    private static ContainerComponent CreateSessionGroup()
    {
        return DemoUI.CreateGroup(nameof(AccountController.AccountGroup), "Live session",
            content =>
            {
                _ = content.AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(8)
                    .AddChild(CreateSessionField("Session id", nameof(AccountGroupContext.SessionId)))
                    .AddChild(CreateSessionField("Roles", nameof(AccountGroupContext.Roles)))
                    .AddChild(CreateSessionField("Permissions", nameof(AccountGroupContext.Permissions)))
                    .AddChild(CreateSessionField("Audit ([AuditCommand] filter)", nameof(AccountGroupContext.Audit)))
                    .SetPlacement(1, 1, 24, 1)
                );
            },
            controls => DemoUI.InitControls(controls, new()
            {
                ["Refresh"] = nameof(AccountController.RefreshSessionAsync),
                ["Sign out"] = nameof(AccountController.SignOutAsync)
            }),
            contentMinHeight: 300
        );
    }

    private static TextComponent CreateSessionField(string title, string valueProperty)
        => new TextComponent()
            .SetTitle(title)
            .SetTitleType(UITextAppearance.Overline)
            .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            .SetDescriptionType(UITextAppearance.Body)
            .BindDescription(valueProperty, UIBindingScope.Relative);

    /// <summary>
    /// Export is the interesting one: the member account is refused it, and revoking it from the admin account
    /// refuses it there too on the very next click, with no reload in between.
    /// </summary>
    private static ContainerComponent CreateCommandsGroup()
    {
        return DemoUI.CreateGroup(nameof(AccountController.AccountGroup), "Permission-checked commands",
            content =>
            {
                _ = content.AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(CreateCommandButton("View reports", DemoAccounts.ViewReportsPermission, nameof(AccountController.ViewReports)))
                    .AddChild(CreateCommandButton("Export reports", DemoAccounts.ExportReportsPermission, nameof(AccountController.ExportReports)))
                    .AddChild(CreateCommandButton("Revoke export permission", "no requirement", nameof(AccountController.RevokeExportPermissionAsync)))
                    .SetPlacement(1, 1, 24, 1)
                );
            },
            static _ => { },
            contentMinHeight: 200
        );
    }

    private static StackPanelComponent CreateCommandButton(string title, string requirement, string command)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(2)
            .AddChild(new ButtonComponent()
                .OnClick(command)
                .SetHorizontalAlignment(UIAlignment.Start)
                .ConfigureDefaultContent(c => _ = c.SetTitle(title))
            )
            .AddChild(new TextComponent()
                .SetTitle($"requires: {requirement}")
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            );
}
