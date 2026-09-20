using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Extensions;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Screens;

/// <summary>The forbidden page: the application's own, registered as such, so a role refusal has somewhere to go.</summary>
internal sealed class ForbiddenView : DemoScreenView, IUIViewDefinition
{
    public static string ViewKey => "demo.screens.forbidden";

    protected override string ComponentRoute => "/screens/forbidden";
    protected override string Header => "demo.screens.forbidden.header";
    protected override string HeaderDescription => "demo.screens.forbidden.description";

    protected override IVisualComponent CreateScreen()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(0, 24, 0, 0))
            .AddChild(UIPage.Card("Not for this account", null, UILayout.Stack(16,
                    UIText.Note(string.Empty).BindDescription(nameof(ForbiddenController.DeniedLine)),
                    UIButtons.Pair(
                        UIButtons.Ghost("Back to the account").OnClick(nameof(ForbiddenController.BackToAccount)),
                        UIButtons.Primary("Sign in as someone else").OnClick(nameof(ForbiddenController.SwitchAccountAsync))
                    )
                ), DemoIcons.Outline(DemoIcons.Lock))
                .SetWidth(UILayoutLength.Absolute(460))
                .SetHorizontalAlignment(UIAlignment.Center)
            )
            .SetPlacement(1, 1, 24, 1);
}
