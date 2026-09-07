using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using TeamRoom.Controllers;

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
                    .AddChild(new TextInputComponent()
                        .SetTitle("Login")
                        .SetFormId(FormId)
                        .BindValue(nameof(SignInController.Login))
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle("Password")
                        .SetType(UITextInputType.Password)
                        .SetFormId(FormId)
                        .BindValue(nameof(SignInController.Password))
                        .BindValidation(nameof(SignInController.Notice))
                    )
                    .AddChild(new ButtonComponent()
                        .SetTitle("Sign in")
                        .SetTextAlignment(UITextAlignment.Center)
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                        .OnSubmit(FormId, nameof(SignInController.SignInAsync))
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            );
}
