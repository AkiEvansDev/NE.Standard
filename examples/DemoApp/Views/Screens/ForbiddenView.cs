using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>The forbidden page: the application's own, registered as such, so a role refusal has somewhere to go.</summary>
internal sealed class ForbiddenView : DemoScreenView, IUIViewDefinition
{
    public static string ViewKey => "demo.screens.forbidden";

    protected override string ComponentRoute => "/screens/forbidden";
    protected override string Header => "demo.screens.forbidden.header";
    protected override string HeaderDescription => "demo.screens.forbidden.description";

    protected override IVisualComponent CreateScreen()
        => UICard.Centered(CreateOutcome()).SetPlacement(1, 1, 24, 1);

    private static SurfaceComponent CreateOutcome()
        => UIPage.Outcome(
            DemoIcons.Outline(DemoIcons.Lock),
            UIMessageSeverity.Warning,
            "Not for this account",
            new ParagraphComponent().BindDescription(nameof(ForbiddenController.DeniedLine)),
            UIButtons.Ghost("Back to the account").OnClick(nameof(ForbiddenController.BackToAccount)),
            UIButtons.Primary("Sign in as someone else").OnClick(nameof(ForbiddenController.SwitchAccountAsync))
        );
}
