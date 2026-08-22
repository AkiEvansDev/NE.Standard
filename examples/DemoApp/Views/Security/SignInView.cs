using DemoApp.Controllers.Security;
using DemoApp.Security;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Security;

/// <summary>
/// The anonymous half of the security demo: the page a refused request is redirected to, and the only place
/// the session gains an identity.
/// </summary>
internal sealed class SignInView : DemoView, IUIViewDefinition
{
    public static string ViewKey => "demo.security.sign-in";

    protected override string ComponentRoute => SecurityRoutes.SignIn;
    protected override DemoViewKind ViewKind => DemoViewKind.Example;
    protected override DemoViewKind[] AvailableKinds => [];
    protected override string Header => "demo.security.sign-in.header";
    protected override string HeaderDescription => "demo.security.sign-in.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateFormGroup())
            .AddChild(CreateAccountsGroup());
    }

    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateGroup(nameof(SignInController.SignInGroup), "Sign in",
            content =>
            {
                _ = content.AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new TextInputComponent()
                        .SetTitle("User name")
                        .BindValue(nameof(SignInGroupContext.UserName), UIBindingScope.Relative)
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle("Password")
                        .SetType(UITextInputType.Password)
                        .BindValue(nameof(SignInGroupContext.Password), UIBindingScope.Relative)
                    )
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(SignInController.SignInAsync))
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .ConfigureDefaultContent(c => _ = c.SetTitle("Sign in"))
                    )
                    .SetPlacement(1, 1, 24, 1)
                );
            },
            static _ => { },
            contentMinHeight: 220
        );
    }

    /// <summary>
    /// The two accounts differ by one permission, which is what makes the same button on the account page
    /// succeed for one of them and be refused for the other.
    /// </summary>
    private static ContainerComponent CreateAccountsGroup()
    {
        return DemoUI.CreateGroup(null, "Demo accounts",
            content =>
            {
                _ = content.AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(CreateAccountLine("admin / admin", "roles: admin, member — permissions: reports.view, reports.export", nameof(SignInController.UseAdminAccount)))
                    .AddChild(CreateAccountLine("member / member", "roles: member — permissions: reports.view", nameof(SignInController.UseMemberAccount)))
                    .SetPlacement(1, 1, 24, 1)
                );
            },
            static _ => { },
            contentMinHeight: 220
        );
    }

    private static StackPanelComponent CreateAccountLine(string title, string description, string fillCommand)
    {
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(4)
            .AddChild(new TextComponent()
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Subtitle)
                .SetDescription(description)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            )
            .AddChild(new ButtonComponent()
                .OnClick(fillCommand)
                .SetType(UIButtonType.Ghost)
                .SetHorizontalAlignment(UIAlignment.Start)
                .ConfigureDefaultContent(c => _ = c.SetTitle("Fill in").SetTitleType(UITextAppearance.Caption))
            );
    }
}
