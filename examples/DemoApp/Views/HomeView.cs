using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views;

internal sealed class HomeView : DemoView, IUIViewDefinition
{
    public static string ViewKey => "demo.home";

    protected override string ComponentRoute => "/";
    protected override DemoViewKind ViewKind => DemoViewKind.Example;
    protected override DemoViewKind[] AvailableKinds => [];
    protected override string Header => "demo.home.header";
    protected override string HeaderDescription => "demo.home.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        foreach ((var sectionTitle, _, (string ComponentRoute, string Label)[] links) in DemoUI.NavSections)
            _ = container.AddChild(CreateLinksGroup(sectionTitle, links));

        _ = container.AddChild(CreateSecurityGroup());
    }

    /// <summary>
    /// Built apart from the component sections: those link to a <c>/binding</c> tab, these are whole routes.
    /// </summary>
    private static ContainerComponent CreateSecurityGroup()
    {
        return DemoUI.CreateGroup(null, "demo.nav.section.security",
            content =>
            {
                StackPanelComponent list = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetSpacing(12)
                    .SetWrap(true);

                foreach ((var route, var label) in DemoUI.SecurityLinks)
                {
                    _ = list.AddChild(new LinkComponent()
                        .SetText(label)
                        .SetUrl(route)
                    );
                }

                _ = content.AddChild(list);
            },
            static _ => { },
            contentMinHeight: 80
        );
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
                        .SetText(label)
                        .SetUrl($"{componentRoute}/{DemoViewKind.Binding.ToString().ToLowerInvariant()}")
                    );
                }

                _ = content.AddChild(list);
            },
            static _ => { },
            contentMinHeight: 80
        );
    }
}
