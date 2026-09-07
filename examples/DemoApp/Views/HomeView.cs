using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views;

internal sealed class HomeView : DemoView, IUIViewDefinition
{
    public static string ViewKey => "demo.home";

    protected override string ComponentRoute => "/";
    protected override DemoViewKind ViewKind => DemoViewKind.Main;
    protected override DemoViewKind[] AvailableKinds => [];
    protected override string Header => "demo.home.header";
    protected override string HeaderDescription => "demo.home.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        foreach ((var sectionTitle, _, (string ComponentRoute, string Label)[] links) in DemoUI.NavSections)
            _ = container.AddChild(CreateLinksGroup(sectionTitle, links));
    }

    private static ContainerComponent CreateLinksGroup(string sectionTitle, (string ComponentRoute, string Label)[] links)
    {
        return DemoUI.CreateGroup(null, sectionTitle,
            content =>
            {
                StackPanelComponent list = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetSpacing(12)
                    .SetWrap(true);

                foreach ((var componentRoute, var label) in links)
                {
                    _ = list.AddChild(new LinkComponent()
                        .SetTitle(label)
                        .SetUrl(DemoUI.RouteFor(componentRoute, DemoUI.LandingKinds[componentRoute]))
                    );
                }

                _ = content.AddChild(list);
            },
            contentMinHeight: 80
        );
    }
}
