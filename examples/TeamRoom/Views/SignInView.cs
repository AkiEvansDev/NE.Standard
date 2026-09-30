using System.Collections.Generic;
using TeamRoom.Controllers;
using TeamRoom.Services;

namespace TeamRoom.Views;

/// <summary>
/// A card in the middle of an empty page: login, password, one button. Enter in either field is the button; a refusal is the
/// password field's own message.
/// </summary>
public sealed class SignInView : UIViewBase, IUIViewDefinition
{
    private const string FormId = "sign-in";

    public static string ViewKey => "teamroom.sign-in";

    public override string Title => "Sign in · TeamRoom";

    protected override IVisualComponent CreateContent()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(24, 96, 24, 24))
            .AddChild(new CardComponent()
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetWidth(UILayoutLength.Absolute(380))
                .ConfigureDefaultHeader(static header => header
                    .SetIcon(AppIcons.Outline(AppIcons.Shield))
                    .SetTitle("TeamRoom")
                    .SetDescription("Sign in to your team's room.")
                )
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    // The pair a password manager reads: without these two words it remembers a password with no name against it.
                    .AddChild(new TextInputComponent()
                        .SetTitle("Login")
                        .SetFormId(FormId)
                        .SetAutocomplete(UIAutocomplete.Username)
                        .BindValue(nameof(SignInController.Login))
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle("Password")
                        .SetType(UITextInputType.Password)
                        .SetFormId(FormId)
                        .SetAutocomplete(UIAutocomplete.CurrentPassword)
                        .BindValue(nameof(SignInController.Password))
                        .BindValidation(nameof(SignInController.Notice))
                    )
                    .AddChild(new ButtonComponent()
                        .SetTitle("Sign in")
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                        .OnSubmit(FormId, nameof(SignInController.SignInAsync))
                    )
                    // The demo's test accounts, a press each, shown only where the host turned the shortcut on (Development).
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetSpacing(8)
                        .BindVisibility(nameof(SignInController.QuickSignInVisibility))
                        .AddChild(new TextComponent()
                            .SetTitle("Demo accounts")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                        )
                        .AddChild(new StackPanelComponent()
                            .SetOrientation(UIOrientation.Horizontal)
                            .SetSpacing(8)
                            .AddChildren(QuickButtons())
                        )
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            );

    /// <summary>A button a test account, named as the account is.</summary>
    private static IEnumerable<IVisualComponent> QuickButtons()
    {
        foreach ((var login, var nickname, _) in QuickSignIn.Accounts)
        {
            yield return new ButtonComponent()
                .SetTitle(nickname)
                .SetType(UIButtonType.Outline)
                .SetSize(UIButtonSize.Small)
                .OnClick(nameof(SignInController.QuickSignInAsync), UIAction.Arg("login", login));
        }
    }
}
