using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Extensions;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Screens;

/// <summary>
/// The sign-in form: two fields, the refusal on the password field, and the two accounts a press fills in. The page is the
/// application's sign-in view, so a route that refuses an anonymous session lands here with the way back.
/// </summary>
internal sealed class SignInView : DemoScreenView, IUIViewDefinition
{
    private const string FormId = "sign-in";

    public static string ViewKey => "demo.screens.sign-in";

    protected override string ComponentRoute => "/screens/sign-in";
    protected override string Header => "demo.screens.sign-in.header";
    protected override string HeaderDescription => "demo.screens.sign-in.description";

    protected override IVisualComponent CreateScreen()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(0, 24, 0, 0))
            .AddChild(UIPage.Card("Sign in", null, UILayout.Stack(16,
                    UIText.Note(string.Empty).BindDescription(nameof(SignInController.ReasonLine)),
                    new TextInputComponent()
                        .SetTitle("User name")
                        .SetAppearance(UIInputAppearance.Outline)
                        .SetAutocomplete(UIAutocomplete.Username)
                        .SetFormId(FormId)
                        .BindValue(nameof(SignInController.UserName))
                        .Required("A user name is required.", UIValidationTrigger.Submit),
                    new TextInputComponent()
                        .SetTitle("Password")
                        .SetType(UITextInputType.Password)
                        .SetAppearance(UIInputAppearance.Outline)
                        .SetAutocomplete(UIAutocomplete.CurrentPassword)
                        .SetFormId(FormId)
                        .BindValue(nameof(SignInController.Password))
                        .BindValidation(nameof(SignInController.Notice))
                        .Required("A password is required.", UIValidationTrigger.Submit),
                    UIButtons.Toolbar(
                        UIButtons.Ghost("Use admin", DemoIcons.Outline(DemoIcons.Shield)).OnClick(nameof(SignInController.UseAdmin)),
                        UIButtons.Ghost("Use member", DemoIcons.Outline(DemoIcons.User)).OnClick(nameof(SignInController.UseMember))
                    ),
                    UIButtons.Primary("Sign in")
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                        .OnSubmit(FormId, nameof(SignInController.SignInAsync))
                ), DemoIcons.Outline(DemoIcons.Lock))
                .SetWidth(UILayoutLength.Absolute(420))
                .SetHorizontalAlignment(UIAlignment.Center)
            )
            .SetPlacement(1, 1, 24, 1);
}
