using DemoApp.Controllers.Navigation.Breadcrumbs;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

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
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateBrowserGroup(), CreatePageHeaderGroup()],
            [CreateAgainstLinksGroup(), CreateRecordGroup()]
        ));
    }

    /// <summary>
    /// A folder browser where the trail and the list are one state, so a step carries a command, not an address.
    /// </summary>
    private static ContainerComponent CreateBrowserGroup()
    {
        return DemoUI.CreateGroup(nameof(BreadcrumbsExamplesController.Browser), "A folder browser",
            content => content.AddChild(CreateSurface(360)
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(8)
                    .AddChild(new BreadcrumbsComponent()
                        .BindItems(nameof(FolderBrowserContext.Path), UIBindingScope.Relative)
                        .OnItemClickWithItemKey(nameof(BreadcrumbsExamplesController.Open))
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(new ItemsViewComponent()
                        .BindItems(nameof(FolderBrowserContext.Entries), UIBindingScope.Relative)
                        .SetSpacing(0)
                        .SetTemplate(new ActionComponent()
                            .SetSize(UIButtonSize.Small)
                            .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .OnClick(nameof(BreadcrumbsExamplesController.Open), UIAction.ArgCurrentItemKey("id"))
                        )
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A record's page, where the trail is the way back through what owns it and the last step carries its state.
    /// </summary>
    private static ContainerComponent CreateRecordGroup()
    {
        return DemoUI.CreateGroup(null, "A record and what owns it",
            content => content.AddChild(CreateSurface(360)
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new BreadcrumbsComponent().SetItems(
                    [
                        new BreadcrumbItem { Id = "customers", Title = "Customers", Icon = DemoIcons.Outline(DemoIcons.Groups), Url = "https://example.com/customers" },
                        new BreadcrumbItem { Id = "acme", Title = "Acme Ltd", Url = "https://example.com/customers/acme" },
                        new BreadcrumbItem { Id = "invoice", Title = "Invoice #4812", BadgeText = "Overdue", BadgeStyle = UIBadgeType.Danger }
                    ]))
                    .AddChild(new TextComponent()
                        .SetTitle("Invoice #4812")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("Due 12 August · 30 days late · 4 812,00 €")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A trail longer than its column, which wraps rather than collapsing the middle.
    /// </summary>
    private static ContainerComponent CreatePageHeaderGroup()
    {
        return DemoUI.CreateGroup(null, "A page header",
            content => content.AddChild(CreateSurface(300)
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new BreadcrumbsComponent().SetItems(
                    [
                        new BreadcrumbItem { Id = "settings", Title = "Settings", Icon = DemoIcons.Outline(DemoIcons.Settings), Url = "https://example.com/settings" },
                        new BreadcrumbItem { Id = "organisation", Title = "Organisation", Url = "https://example.com/settings/organisation" },
                        new BreadcrumbItem { Id = "acme", Title = "Acme Ltd", Url = "https://example.com/settings/organisation/acme" },
                        new BreadcrumbItem { Id = "members", Title = "Members", Url = "https://example.com/settings/organisation/acme/members" },
                        new BreadcrumbItem { Id = "invitations", Title = "Invitations" }
                    ]))
                    .AddChild(new TextComponent()
                        .SetTitle("Invitations")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("Three pending, one expired last week.")
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// The pair that look the same: a row of links says nothing about nesting or where you are, and a trail says both.
    /// </summary>
    private static ContainerComponent CreateAgainstLinksGroup()
    {
        return DemoUI.CreateGroup(null, "Against a row of links",
            content => content.AddChild(CreateSurface(340)
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(DemoUI.CreateCaption("Three links — three places"))
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(16)
                        .AddChild(CreateLink("Projects", "https://example.com/projects"))
                        .AddChild(CreateLink("Web Portal", "https://example.com/projects/web-portal"))
                        .AddChild(CreateLink("Deploys", "https://example.com/projects/web-portal/deploys"))
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(DemoUI.CreateCaption("A trail — one place, and the way back"))
                    .AddChild(new BreadcrumbsComponent().SetItems(
                    [
                        new BreadcrumbItem { Id = "projects", Title = "Projects", Url = "https://example.com/projects" },
                        new BreadcrumbItem { Id = "web-portal", Title = "Web Portal", Url = "https://example.com/projects/web-portal" },
                        new BreadcrumbItem { Id = "deploys", Title = "Deploys" }
                    ]))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static SurfaceComponent CreateSurface(double width)
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetWidth(UILayoutLength.Absolute(width));

    private static LinkComponent CreateLink(string text, string url)
        => new LinkComponent()
            .SetTitle(text)
            .SetUrl(url)
            .SetTitleType(UITextAppearance.Body)
            .SetHorizontalAlignment(UIAlignment.Start);
}
