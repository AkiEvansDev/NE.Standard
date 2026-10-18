using System.Collections.Generic;
using DemoApp.Views.Base;

namespace DemoApp.Views;

internal sealed class HomeView : DemoView, IUIViewDefinition
{
    public static string ViewKey => "demo.home";

    protected override string ComponentRoute => "/";
    protected override string Header => "demo.home.header";
    protected override string HeaderDescription => "demo.home.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        foreach (DemoUI.NavSection[] band in DemoUI.NavBands)
        {
            foreach (DemoUI.NavSection section in band)
                _ = container.AddChild(CreateLinksGroup(section.Title, section.Links));
        }
    }

    private static ContainerComponent CreateLinksGroup(string sectionTitle, IEnumerable<(string Route, string Label)> links)
    {
        return DemoUI.CreateGroup(null, sectionTitle,
            content =>
            {
                StackPanelComponent list = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetSpacing(12)
                    .SetWrap(true);

                foreach ((var route, var label) in links)
                {
                    _ = list.AddChild(new LinkComponent()
                        .SetTitle(label)
                        .SetUrl(route)
                    );
                }

                _ = content.AddChild(list);
            });
    }
}
