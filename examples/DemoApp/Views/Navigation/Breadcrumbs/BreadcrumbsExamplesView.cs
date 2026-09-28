using DemoApp.Controllers.Navigation.Breadcrumbs;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.Foundation;

namespace DemoApp.Views.Navigation.Breadcrumbs;

/// <summary>
/// What a trail is for, and the one thing it is confused with.
/// </summary>
/// <remarks>The steps are in order, the last one is the page, and each of the others leads somewhere above it.</remarks>
internal sealed class BreadcrumbsExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.breadcrumbs.examples";

    protected override string ComponentRoute => "/navigation/breadcrumbs";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.navigation.breadcrumbs.header";
    protected override string HeaderDescription => "demo.navigation.breadcrumbs.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateBrowserGroup(), CreatePageHeaderGroup()], [CreateAgainstLinksGroup(), CreateRecordGroup()]));

    /// <summary>
    /// A folder browser where the trail and the list are one state, so a step carries a command, not an address.
    /// </summary>
    private static ContainerComponent CreateBrowserGroup()
    {
        return DemoUI.CreateExample("A folder browser",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(360))
                .SetContent(UILayout.Stack(8)
                    .AddChild(new BreadcrumbsComponent()
                        .BindItems(nameof(FolderBrowserContext.Path), UIBindingScope.Relative)
                        .OnItemClickWithItemKey(nameof(BreadcrumbsExamplesController.Open))
                    )
                    .AddChild(new SeparatorComponent())
                    // Wrapped, one full-width row per entry, not stacked: a stack's rows carry an inset for a wash the action wears itself.
                    .AddChild(new ItemsViewComponent()
                        .BindItems(nameof(FolderBrowserContext.Entries), UIBindingScope.Relative)
                        .SetLayoutType(UIItemsLayoutType.Wrap)
                        .SetSpacing(0)
                        .SetTemplate(new ActionComponent()
                            .SetSize(UIButtonSize.Small)
                            .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .OnClick(nameof(BreadcrumbsExamplesController.Open), UIAction.ArgCurrentItemKey("id"))
                            .SetPlacement(1, 1, 24, 1)
                        )
                    )
                ),
            context: nameof(BreadcrumbsExamplesController.Browser)
        );
    }

    /// <summary>
    /// A trail longer than its column, which wraps rather than collapsing the middle.
    /// </summary>
    private static ContainerComponent CreatePageHeaderGroup()
    {
        return DemoUI.CreateExample("A page header",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(300))
                .SetContent(UILayout.Stack(12)
                    .AddChild(new BreadcrumbsComponent().SetItems(
                    [
                        new BreadcrumbItem { Id = "settings", Title = "Settings", Icon = DemoIcons.Outline(DemoIcons.Settings), Url = "https://orvane.example/settings" },
                        new BreadcrumbItem { Id = "accounts", Title = "Accounts", Url = "https://orvane.example/settings/accounts" },
                        new BreadcrumbItem { Id = "copperline", Title = "Copperline Retail", Url = "https://orvane.example/settings/accounts/copperline" },
                        new BreadcrumbItem { Id = "members", Title = "Members", Url = "https://orvane.example/settings/accounts/copperline/members" },
                        new BreadcrumbItem { Id = "invitations", Title = "Invitations" }
                        ])
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Invitations")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("Three pending, one expired last week.")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
        );
    }

    /// <summary>
    /// The pair that look the same: a row of links says nothing about nesting or where you are, and a trail says both.
    /// </summary>
    private static ContainerComponent CreateAgainstLinksGroup()
    {
        return DemoUI.CreateExample("Against a row of links",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(340))
                .SetContent(UILayout.Stack(12)
                    .AddChild(UIText.Label("Three links — three places"))
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(16)
                        .AddChild(new LinkComponent()
                            .SetTitle("Services")
                            .SetUrl("https://orvane.example/services")
                            .SetTitleType(UITextAppearance.Body)
                            .SetHorizontalAlignment(UIAlignment.Start)
                        )
                        .AddChild(new LinkComponent()
                            .SetTitle("Panel")
                            .SetUrl("https://orvane.example/services/panel")
                            .SetTitleType(UITextAppearance.Body)
                            .SetHorizontalAlignment(UIAlignment.Start)
                        )
                        .AddChild(new LinkComponent()
                            .SetTitle("Deploys")
                            .SetUrl("https://orvane.example/services/panel/deploys")
                            .SetTitleType(UITextAppearance.Body)
                            .SetHorizontalAlignment(UIAlignment.Start)
                        )
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(UIText.Label("A trail — one place, and the way back"))
                    .AddChild(new BreadcrumbsComponent().SetItems(
                    [
                        new BreadcrumbItem { Id = "services", Title = "Services", Url = "https://orvane.example/services" },
                        new BreadcrumbItem { Id = "panel", Title = "Panel", Url = "https://orvane.example/services/panel" },
                        new BreadcrumbItem { Id = "deploys", Title = "Deploys" }
                        ])
                    )
                )
        );
    }

    /// <summary>
    /// A record's page, where the trail is the way back through what owns it and the last step carries its state.
    /// </summary>
    private static ContainerComponent CreateRecordGroup()
    {
        return DemoUI.CreateExample("A record and what owns it",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(360))
                .SetContent(UILayout.Stack(12)
                    .AddChild(new BreadcrumbsComponent().SetItems(
                    [
                        new BreadcrumbItem { Id = "customers", Title = "Customers", Icon = DemoIcons.Outline(DemoIcons.Groups), Url = "https://orvane.example/customers" },
                        new BreadcrumbItem { Id = "copperline", Title = "Copperline Retail", Url = "https://orvane.example/customers/copperline" },
                        new BreadcrumbItem { Id = "invoice", Title = "Invoice #4812", BadgeText = "Overdue", BadgeStyle = UIBadgeType.Danger }
                        ])
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Invoice #4812")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("Due 12 August · 30 days late · 1 160,00 €")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
        );
    }
}
