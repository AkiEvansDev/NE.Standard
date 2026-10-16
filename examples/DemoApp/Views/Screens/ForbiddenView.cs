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

    // Drawn as the framework's own not-found and error pages are, a step down the content under the page's header.
    protected override IVisualComponent CreateScreen()
    {
        StatusComponent status = UIPage.Status(
            DemoIcons.Outline(DemoIcons.Lock),
            UIMessageSeverity.Warning,
            "Not for this account",
            null,
            UIButtons.Ghost("Back to the account").OnClick(nameof(ForbiddenController.BackToAccount)),
            UIButtons.Primary("Sign in as someone else").OnClick(nameof(ForbiddenController.SwitchAccountAsync))
        );

        _ = status.Words.BindDescription(nameof(ForbiddenController.DeniedLine));

        return new ContainerComponent()
            .SetPadding(UIThickness.All(0, 64, 0, 24))
            .AddChild(status.SetPlacement(1, 1, 24, 1))
            .SetPlacement(1, 1, 24, 1);
    }
}
