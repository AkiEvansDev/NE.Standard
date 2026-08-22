using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.Breadcrumbs;

internal sealed class BreadcrumbsExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.breadcrumbs.example";

    protected override string ComponentRoute => "/navigation/breadcrumbs";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.navigation.breadcrumbs.header";
    protected override string HeaderDescription => "demo.navigation.breadcrumbs.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreatePlainGroup())
            .AddChild(CreateRichGroup())
            .AddChild(CreateSeparatorGroup())
            .AddChild(CreateLongGroup());
    }

    /// <summary>
    /// A trail is a list, and the last step is the page you are on — no flag says so, its position does.
    /// </summary>
    private static ContainerComponent CreatePlainGroup()
    {
        return DemoUI.CreateGroup(null, "A trail from a list",
            content => content.AddChild(new BreadcrumbsComponent()
                .SetItems(
                [
                    new BreadcrumbItem { Id = "home", Title = "Home", Url = "/" },
                    new BreadcrumbItem { Id = "navigation", Title = "Navigation" },
                    new BreadcrumbItem { Id = "breadcrumbs", Title = "Breadcrumbs" }
                ])
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }

    /// <summary>
    /// A step carries the same icon/title/badge content a button does.
    /// </summary>
    private static ContainerComponent CreateRichGroup()
    {
        return DemoUI.CreateGroup(null, "Steps with icons",
            content => content.AddChild(new BreadcrumbsComponent()
                .SetItems(
                [
                    new BreadcrumbItem { Id = "workspace", Title = "Workspace", Icon = LucideIcons.LayoutDashboard, Url = "/" },
                    new BreadcrumbItem { Id = "services", Title = "Services", Icon = LucideIcons.Server },
                    new BreadcrumbItem { Id = "billing", Title = "Billing", Icon = LucideIcons.FileText }
                ])
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }

    /// <summary>
    /// The mark between steps is the trail's, not the step's, and it is drawn rather than placed.
    /// </summary>
    private static ContainerComponent CreateSeparatorGroup()
    {
        return DemoUI.CreateGroup(null, "Another separator",
            content => content.AddChild(new BreadcrumbsComponent()
                .SetSeparator("/")
                .SetItems(
                [
                    new BreadcrumbItem { Id = "src", Title = "src", Url = "/" },
                    new BreadcrumbItem { Id = "core", Title = "Core" },
                    new BreadcrumbItem { Id = "navigation", Title = "Navigation" },
                    new BreadcrumbItem { Id = "file", Title = "BreadcrumbsComponent.cs" }
                ])
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }

    /// <summary>
    /// A trail too long for its width wraps: nothing is hidden and nothing scrolls sideways.
    /// </summary>
    private static ContainerComponent CreateLongGroup()
    {
        return DemoUI.CreateGroup(null, "A trail that does not fit",
            content => content.AddChild(new BreadcrumbsComponent()
                .SetItems(
                [
                    new BreadcrumbItem { Id = "home", Title = "Home", Url = "/" },
                    new BreadcrumbItem { Id = "customers", Title = "Customers" },
                    new BreadcrumbItem { Id = "northwind", Title = "Northwind Traders" },
                    new BreadcrumbItem { Id = "invoices", Title = "Invoices" },
                    new BreadcrumbItem { Id = "2026", Title = "2026" },
                    new BreadcrumbItem { Id = "march", Title = "March" },
                    new BreadcrumbItem { Id = "invoice", Title = "INV-2026-0342" }
                ])
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }
}
