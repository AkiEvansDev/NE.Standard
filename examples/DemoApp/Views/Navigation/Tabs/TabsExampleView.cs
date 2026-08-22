using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.Tabs;

internal sealed class TabsExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.tabs.example";

    protected override string ComponentRoute => "/navigation/tabs";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.navigation.tabs.header";
    protected override string HeaderDescription => "demo.navigation.tabs.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreatePlainGroup())
            .AddChild(CreateRichGroup());
    }

    /// <summary>
    /// Pages are ordinary components — a container of whatever the page needs — which is what "fixed pages"
    /// means here.
    /// </summary>
    private static ContainerComponent CreatePlainGroup()
    {
        return DemoUI.CreateGroup(null, "Fixed pages",
            content => content.AddChild(new TabsComponent()
                .SetPlacement(1, 1, 24, 1)
                .AddTab("overview", "Overview", CreatePage("Overview", "Deployments, health and recent activity."))
                .AddTab("members", "Members", CreatePage("Members", "Who can reach this project, and with which role."))
                .AddTab("settings", "Settings", CreatePage("Settings", "Name, visibility and the keys the project uses."))
            ),
            static _ => { },
            contentMinHeight: 220
        );
    }

    /// <summary>
    /// A caption is a component, so it takes an icon and a badge like any other button content.
    /// </summary>
    private static ContainerComponent CreateRichGroup()
    {
        return DemoUI.CreateGroup(null, "Captions with icons and badges",
            content => content.AddChild(new TabsComponent()
                .SetPlacement(1, 1, 24, 1)
                .AddTab("services",
                    new TabHeaderComponent().ConfigureDefaultContent(c => _ = c.SetIcon(LucideIcons.Server).SetTitle("Services")),
                    CreatePage("Services", "Every service the project deploys."))
                .AddTab("alerts",
                    new TabHeaderComponent().ConfigureDefaultContent(c => _ = c.SetTitle("Alerts").SetBadgeText("2").SetBadgeStyle(UIBadgeType.Danger)),
                    CreatePage("Alerts", "Two checks are failing."))
                .AddTab("audit",
                    new TabHeaderComponent().ConfigureDefaultContent(c => _ = c.SetIcon(LucideIcons.History).SetTitle("Audit")),
                    CreatePage("Audit", "Who did what, and when."))
            ),
            static _ => { },
            contentMinHeight: 220
        );
    }

    private static ContainerComponent CreatePage(string title, string description)
        => new ContainerComponent()
            .SetPadding(UIThickness.All(0, 16, 0, 0))
            .AddChild(new TextComponent()
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Subtitle)
                .SetDescription(description)
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.Muted)
                .SetPlacement(1, 1, 24, 1)
            );
}
