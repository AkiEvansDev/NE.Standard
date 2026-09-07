using DemoApp.Controllers.Base;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Navigation.TabsView;

/// <summary>
/// Where a strip over a collection is written: a browser, a card whose faces come from data, and a strip
/// that has nothing open yet.
/// </summary>
/// <remarks>Every strip here is over a static list, so none of its tabs closes; the gestures are on the Scenarios page.</remarks>
internal sealed class TabsViewExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.tabs-view.examples";

    protected override string ComponentRoute => "/navigation/tabs-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.navigation.tabs-view.header";
    protected override string HeaderDescription => "demo.navigation.tabs-view.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateBrowserGroup()],
            [CreateCardGroup(), CreateEmptyGroup()]
        ));
    }

    /// <summary>
    /// A page per tab, an icon on each caption, and the page showing where it came from.
    /// </summary>
    private static ContainerComponent CreateBrowserGroup()
    {
        DemoDocumentItem[] pages =
        [
            CreateDocument("docs", DemoIcons.FileText, "Getting started", 1, "docs.example.com/start", "Install the package, write a view and a controller, and route the pair."),
            CreateDocument("repo", DemoIcons.Link, "NE.Standard", 2, "github.com/example/ne-standard", "The repository, 4 open pull requests and a green main."),
            CreateDocument("status", DemoIcons.Alert, "Status", 3, "status.example.com", "All systems operational. Last incident 12 days ago.")
        ];

        return DemoUI.CreateGroup(null, "A browser",
            content => content.AddChild(new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsViewComponent()
                    .SetItems(pages)
                    .SetPageTemplate(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetSpacing(8)
                        .SetMargin(UIThickness.All(0, 4, 0, 0))
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Lock))
                            .BindTitle(nameof(DemoDocumentItem.Address), UIBindingScope.Relative)
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ParagraphComponent()
                            .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static DemoDocumentItem CreateDocument(string id, string icon, string title, double order, string address, string body)
        => new()
        {
            Id = id,
            Icon = DemoIcons.Outline(icon),
            Title = title,
            Address = address,
            Order = order,
            CanRemove = false,
            Body = body
        };

    /// <summary>
    /// A card whose faces come from data: one incident, and a page per section the runbook has.
    /// </summary>
    private static ContainerComponent CreateCardGroup()
    {
        DemoDocumentItem[] sections =
        [
            CreateDocument("summary", DemoIcons.FileText, "Summary", 1, string.Empty, "Error rate doubled in eu-west-1 at 11:52. The scheduler paused the rollout on its own."),
            CreateDocument("timeline", DemoIcons.History, "Timeline", 2, string.Empty, "11:52 alert fired · 11:54 rollout paused · 12:10 root cause found · 12:31 fixed forward"),
            CreateDocument("runbook", DemoIcons.List, "Runbook", 3, string.Empty, "1. Confirm the region.\n2. Pause the rollout.\n3. Compare the two builds' configuration.")
        ];

        return DemoUI.CreateGroup(null, "Inside a card",
            content => content.AddChild(new CardComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Alert)
                    .SetTitle("INC-4812 · Elevated errors in eu-west-1")
                    .SetDescription("Resolved · 39 minutes")
                    .SetBadgeText("Sev 2")
                    .SetBadgeStyle(UIBadgeType.Warning)
                )
                .SetContent(new TabsViewComponent()
                    .SetItems(sections)
                    .SetPageTemplate(new ParagraphComponent()
                        .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetMargin(UIThickness.All(0, 4, 0, 0))
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A strip with nothing in it is a list's empty state, drawn where the first tab will go.
    /// </summary>
    private static ContainerComponent CreateEmptyGroup()
    {
        return DemoUI.CreateGroup(null, "Starts empty",
            content => content.AddChild(new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsViewComponent()
                    .SetItems([])
                    .SetEmptyTemplate(new DefaultEmptyTemplate()
                        .SetIcon(DemoIcons.Outline(DemoIcons.File))
                        .SetTitle("No documents open")
                        .SetDescription("Open one from the tree, or press Ctrl+N.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .SetPageTemplate(new ParagraphComponent().BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
