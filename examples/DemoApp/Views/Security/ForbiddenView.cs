using DemoApp.Security;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Security;

/// <summary>
/// Where an authenticated session that lacks the rights lands. Distinct from the sign-in page on purpose:
/// telling someone already signed in to sign in is the wrong answer, and re-authenticating will not help.
/// </summary>
internal sealed class ForbiddenView : DemoView, IUIViewDefinition
{
    public static string ViewKey => "demo.security.forbidden";

    protected override string ComponentRoute => SecurityRoutes.Forbidden;
    protected override DemoViewKind ViewKind => DemoViewKind.Example;
    protected override DemoViewKind[] AvailableKinds => [];
    protected override string Header => "demo.security.forbidden.header";
    protected override string HeaderDescription => "demo.security.forbidden.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(DemoUI.CreateGroup(null, "Not for this account",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .AddChild(new TextComponent()
                    .SetTitle("Your session is signed in, but it does not carry the role this page requires.")
                    .SetTitleType(UITextAppearance.Subtitle)
                    .SetDescription("Sign in as 'admin' to reach it. The redirect carries the refused route as a deniedUrl parameter.")
                    .SetDescriptionType(UITextAppearance.Body)
                    .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                )
                .AddChild(new LinkComponent()
                    .SetText("Back to the account page")
                    .SetUrl(SecurityRoutes.Account)
                    .SetHorizontalAlignment(UIAlignment.Start)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 160
        ));
    }
}
