using DemoApp.Security;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Security;

/// <summary>
/// A role-restricted page with no controller at all — the attribute sits on the view, which is enough for the
/// route check. Signed in as <c>member</c> this page is refused and the request lands back on sign-in.
/// </summary>
[UIAuthorize(DemoAccounts.AdminRole)]
internal sealed class ReportsView : DemoView, IUIViewDefinition
{
    public static string ViewKey => "demo.security.reports";

    protected override string ComponentRoute => SecurityRoutes.Reports;
    protected override DemoViewKind ViewKind => DemoViewKind.Example;
    protected override DemoViewKind[] AvailableKinds => [];
    protected override string Header => "demo.security.reports.header";
    protected override string HeaderDescription => "demo.security.reports.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(DemoUI.CreateGroup(null, "Admin only",
            content => content.AddChild(new TextComponent()
                .SetTitle("You are signed in with the 'admin' role.")
                .SetTitleType(UITextAppearance.Subtitle)
                .SetDescription("Signed in as 'member' this route is refused before the view is ever built, and the request is redirected to the sign-in page with the route it wanted as returnUrl.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 160
        ));
    }
}
