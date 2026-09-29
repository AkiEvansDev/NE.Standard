using DemoApp.Controllers.Base;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Templates;

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
        _ = container.AddChildren(DemoUI.CreateColumns([CreateBrowserGroup()], [CreateCardGroup()]));

        _ = container.AddChild(CreateEmptyGroup());
    }

    /// <summary>
    /// A page per tab, an icon on each caption, and the page showing where it came from.
    /// </summary>
    private static ContainerComponent CreateBrowserGroup()
    {
        DemoDocumentItem[] pages =
        [
            CreateDocument("docs", DemoIcons.FileText, "Getting started", 1, "docs.orvane.example/start", "Create a server, pick a plan and a region, and point your domain at it."),
            CreateDocument("api", DemoIcons.Link, "API reference", 2, "docs.orvane.example/api", "Every call the public API takes, and the key each one needs."),
            CreateDocument("status", DemoIcons.Alert, "Status", 3, "status.orvane.example", "All systems operational. Last incident 12 days ago.")
        ];

        return DemoUI.CreateExample("A browser",
            new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsViewComponent()
                    .SetItems(pages)
                    .SetPageTemplate(UILayout.Stack(8)
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
    /// A card whose faces come from data: one incident, and a page per section the runbook has — the postmortem's off until it is written.
    /// </summary>
    private static ContainerComponent CreateCardGroup()
    {
        DemoDocumentItem postmortem = CreateDocument("postmortem", DemoIcons.Edit, "Postmortem", 4, string.Empty, "Written once the incident is closed.");

        // Off: dimmed, skipped by the arrows, and offered by the "…" list as a disabled entry.
        postmortem.Enabled = false;

        DemoDocumentItem[] sections =
        [
            CreateDocument("summary", DemoIcons.FileText, "Summary", 1, string.Empty, "Error rate doubled in eu-west at 11:52. The scheduler paused the rollout on its own."),
            CreateDocument("timeline", DemoIcons.History, "Timeline", 2, string.Empty, "11:52 alert fired · 11:54 rollout paused · 12:10 root cause found · 12:31 fixed forward"),
            CreateDocument("runbook", DemoIcons.List, "Runbook", 3, string.Empty, "1. Confirm the region.\n2. Pause the rollout.\n3. Compare the two releases' configuration."),
            postmortem
        ];

        return DemoUI.CreateExample("Inside a card",
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Alert)
                    .SetTitle("INC-4812 · Elevated errors in eu-west")
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
        );
    }

    /// <summary>
    /// A strip with nothing in it is a list's empty state, drawn where the first tab will go.
    /// </summary>
    private static ContainerComponent CreateEmptyGroup()
    {
        return DemoUI.CreateExample("Starts empty",
            new SurfaceComponent()
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
                ),
            columns: 24,
            note: "With no tabs there is no strip either: the empty template is the whole control, and the first tab added brings the strip with it."
        );
    }
}
