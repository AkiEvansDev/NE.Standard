using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.TabsView;

internal sealed class TabsViewExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.tabs-view.example";

    protected override string ComponentRoute => "/navigation/tabs-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.navigation.tabs-view.header";
    protected override string HeaderDescription => "demo.navigation.tabs-view.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreatePlainGroup())
            .AddChild(CreateRichGroup());
    }

    /// <summary>
    /// One template over a fixed list: every tab renders the same page, filled from its own item. Nothing is
    /// bound here — a tabs view over a static list is still a tabs view. No tab closes, because closing is a
    /// command against a collection and this page has neither; the Binding and Test pages show that half.
    /// </summary>
    private static ContainerComponent CreatePlainGroup()
    {
        return DemoUI.CreateGroup(null, "Tabs from a list",
            content => content.AddChild(new TabsViewComponent()
                .SetItems(
                [
                    new TabItem { Id = "overview", Title = "Overview", Order = 1, Closable = false },
                    new TabItem { Id = "members", Title = "Members", Order = 2, Closable = false },
                    new TabItem { Id = "settings", Title = "Settings", Order = 3, Closable = false }
                ])
                .SetPageTemplate(CreatePageTemplate())
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 220
        );
    }

    /// <summary>
    /// A caption is the same icon/title/badge content a button carries.
    /// </summary>
    private static ContainerComponent CreateRichGroup()
    {
        return DemoUI.CreateGroup(null, "Captions with icons and badges",
            content => content.AddChild(new TabsViewComponent()
                .SetItems(
                [
                    new TabItem { Id = "readme", Title = "README.md", Icon = LucideIcons.FileText, Order = 1, Closable = false },
                    new TabItem { Id = "services", Title = "Services", Icon = LucideIcons.Server, Order = 2, Closable = false },
                    new TabItem { Id = "alerts", Title = "Alerts", Icon = LucideIcons.History, Order = 3, Closable = false, BadgeText = "2", BadgeStyle = UIBadgeType.Danger }
                ])
                .SetPageTemplate(CreatePageTemplate())
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 220
        );
    }

    private static ContainerComponent CreatePageTemplate()
        => new ContainerComponent()
            .AddChild(new TextComponent()
                .BindTitle(nameof(TabItem.Title), UIBindingScope.Relative)
                .SetTitleType(UITextAppearance.Subtitle)
                .SetDescription("The page is one template, rendered once per tab and filled from that tab's own item.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.Muted)
                .SetPlacement(1, 1, 24, 1)
            );
}
