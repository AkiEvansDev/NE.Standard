using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.TabsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Templates;

namespace DemoApp.Views.Navigation.TabsView;

/// <summary>
/// One strip over a collection of documents and every property that can be bound to it; then where such a strip is written: a
/// browser, a card whose faces come from data, a strip that has nothing open yet, and one the controller walks.
/// </summary>
/// <remarks>
/// Two sections: the strip's own properties, and one document's, which the second section acts on alone. Every example strip but the
/// last is over a static list, so none of its tabs closes; the editor that answers every gesture on a tab is the Files screen.
/// </remarks>
internal sealed class TabsViewView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TabsViewGroup = nameof(TabsViewController.TabsViewGroup);
    private const string FirstTabGroup = nameof(TabsViewController.FirstTabGroup);
    private const string EmptyGroup = nameof(TabsViewController.EmptyGroup);
    private const string DriveGroup = nameof(TabsViewController.DriveGroup);

    public static string ViewKey => "demo.navigation.tabs-view";

    protected override string ComponentRoute => "/navigation/tabs-view";
    protected override string Header => "demo.navigation.tabs-view.header";
    protected override string HeaderDescription => "demo.navigation.tabs-view.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/files", "demo.nav.screens.files");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TabsViewComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSelectedKey($"{TabsViewGroup}.{nameof(TabsViewGroupContext.SelectedKey)}")
            .BindRenamable($"{TabsViewGroup}.{nameof(TabsViewGroupContext.Renamable)}")
            .BindDraggable($"{TabsViewGroup}.{nameof(TabsViewGroupContext.Draggable)}")
            .BindTabMenuEntries($"{TabsViewGroup}.{nameof(TabsViewGroupContext.TabMenuEntries)}")
            .BindRemovable($"{TabsViewGroup}.{nameof(TabsViewGroupContext.Removable)}")
            .BindShowOverflow($"{TabsViewGroup}.{nameof(TabsViewGroupContext.ShowOverflow)}")
            .BindItems(nameof(TabsViewController.Documents))
            .OnItemRemove(nameof(TabsViewController.RemoveDocument))
            // The page is a template over the item, bound to whichever document the tab stands for.
            .SetPageTemplate(new ParagraphComponent()
                .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                .SetDescriptionType(UITextAppearance.Body)
                .SetMargin(UIThickness.All(0, 4, 0, 0))
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(TabsViewGroup, "Tabs view", nameof(TabsViewController.CycleTabsViewGroupOption)),
            DemoUI.CreateOptionSection(FirstTabGroup, "First tab", nameof(TabsViewController.CycleFirstTabGroupOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateBrowserGroup()], [CreateCardGroup()]), CreateEmptyGroup(), CreateDriveGroup()];

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
                    .BindItems(nameof(EmptyStripGroupContext.Documents), UIBindingScope.Relative)
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
            note: "With no tabs there is no strip either: the empty template is the whole control, and the first tab added brings the strip with it.",
            context: EmptyGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Open or close a document"] = nameof(TabsViewController.ToggleEmptyDocument)
            })
        );
    }

    /// <summary>
    /// The strip driven from the other side: a command walks <c>SelectedKey</c> as readily as a click does.
    /// </summary>
    private static ContainerComponent CreateDriveGroup()
    {
        return DemoUI.CreateGroup(DriveGroup, "The controller drives the strip",
            content => content.AddChild(new TabsViewComponent()
                .BindItems(nameof(DriveGroupContext.Steps), UIBindingScope.Relative)
                .BindSelectedKey(nameof(DriveGroupContext.SelectedKey), UIBindingScope.Relative)
                .SetPageTemplate(new ParagraphComponent()
                    .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                    .SetDescriptionType(UITextAppearance.Body)
                    .SetMargin(UIThickness.All(0, 4, 0, 0))
                )
                .SetVerticalAlignment(UIAlignment.Start)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Previous step"] = nameof(TabsViewController.PreviousStep),
                ["Next step"] = nameof(TabsViewController.NextStep),
            }),
            columns: 24,
            note: "SelectedKey is a property, so a command walks the tabs as readily as a click does — and a click moves the same property back."
        );
    }
}
