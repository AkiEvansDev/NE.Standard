using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.TabsView;
using DemoApp.Views.Base;

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
    private const string BrowserGroup = nameof(TabsViewController.BrowserGroup);
    private const string EmptyGroup = nameof(TabsViewController.EmptyGroup);
    private const string DriveGroup = nameof(TabsViewController.DriveGroup);

    public static string ViewKey => "demo.navigation.tabs-view";

    protected override string ComponentRoute => "/navigation/tabs-view";
    protected override string Header => "demo.navigation.tabs-view.header";
    protected override string HeaderDescription => "demo.navigation.tabs-view.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/files", "demo.nav.screens.files");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TabsViewComponent()
            .BindStandard()
            .BindSelectedKey<TabsViewController>(static x => x.TabsViewGroup.SelectedKey)
            .BindSelectionStyle<TabsViewController>(static x => x.TabsViewGroup.SelectionStyle)
            .BindRenamable<TabsViewController>(static x => x.TabsViewGroup.Renamable)
            .BindDraggable<TabsViewController>(static x => x.TabsViewGroup.Draggable)
            .BindTabMenuEntries<TabsViewController>(static x => x.TabsViewGroup.TabMenuEntries)
            .BindRemovable<TabsViewController>(static x => x.TabsViewGroup.Removable)
            .BindShowOverflow<TabsViewController>(static x => x.TabsViewGroup.ShowOverflow)
            .BindItems<TabsViewController>(static x => x.Documents)
            .OnItemRemoveWithItemKey(nameof(TabsViewController.RemoveDocument))
            // The page is a template over the item, bound to whichever document the tab stands for.
            .SetPageTemplate(new ParagraphComponent()
                .BindDescription<DemoDocumentItem>(static x => x.Body, UIBindingScope.Relative)
                .SetDescriptionType(UITextAppearance.Body)
                .SetMargin(UIThickness.All(0, 4, 0, 0))
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(TabsViewGroup, "Tabs view"),
            DemoUI.CreateOptionSection(FirstTabGroup, "First tab")
        );

    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateBrowserGroup()], [CreateCardGroup()]), CreateEmptyGroup(), CreateDriveGroup()];

    /// <summary>
    /// A page per tab, an icon on each caption, and the page showing where it came from.
    /// </summary>
    private static ContainerComponent CreateBrowserGroup()
    {
        return DemoUI.CreateExample("Dynamic closable & reorderable tabs",
            new SurfaceComponent()
                .SetMaxWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsViewComponent()
                    .BindItems<BrowserTabsGroupContext>(static x => x.Pages, UIBindingScope.Relative)
                    .SetDraggable(true)
                    .SetRemovable(true)
                    .OnItemRemoveWithItemKey(nameof(TabsViewController.CloseBrowserPage))
                    .SetPageTemplate(UILayout.Stack(8)
                        .SetMargin(UIThickness.All(0, 4, 0, 0))
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Lock))
                            .BindTitle<DemoDocumentItem>(static x => x.Address, UIBindingScope.Relative)
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ParagraphComponent()
                            .BindDescription<DemoDocumentItem>(static x => x.Body, UIBindingScope.Relative)
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                    )
                ),
            note: "Drag captions to reorder them (`Order` writes back automatically), or press `×` to close a tab and reopen all closed tabs below.",
            context: BrowserGroup,
            controlsBelow: true,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Restore closed tabs"] = nameof(TabsViewController.ReopenBrowserPages)
            })
        );
    }

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
                .SetMaxWidth(UILayoutLength.Absolute(460))
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Alert)
                    .SetTitle("INC-4812 · Elevated errors in eu-west")
                    .SetDescription("Resolved · 39 minutes")
                    .SetBadgeTitle("Sev 2")
                    .SetBadgeVariant(UIBadgeVariant.Warning)
                )
                .SetContent(new TabsViewComponent()
                    .SetItems(sections)
                    .SetPageTemplate(new ParagraphComponent()
                        .BindDescription<DemoDocumentItem>(static x => x.Body, UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetMargin(UIThickness.All(0, 4, 0, 0))
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
    /// A strip with nothing in it is a list's empty state, drawn where the first tab will go.
    /// </summary>
    private static ContainerComponent CreateEmptyGroup()
    {
        return DemoUI.CreateExample("Empty state with add button",
            new SurfaceComponent()
                .SetContent(new TabsViewComponent()
                    .BindItems<EmptyStripGroupContext>(static x => x.Documents, UIBindingScope.Relative)
                    .SetRemovable(true)
                    .OnItemRemoveWithItemKey(nameof(TabsViewController.CloseEmptyDocument))
                    .SetEmptyTemplate(UILayout.Stack(12)
                        .SetPadding(UIThickness.Uniform(20))
                        .SetHorizontalAlignment(UIAlignment.Center)
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.File))
                            .SetTitle("No documents open")
                            .SetDescription("Open one below or from the side button.")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetTextAlignment(UITextAlignment.Center)
                        )
                        .AddChild(new ButtonComponent()
                            .SetVariant(UIButtonVariant.Outline)
                            .SetSize(UISize.Small)
                            .SetHorizontalAlignment(UIAlignment.Center)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Add))
                            .SetTitle("Open notes.md")
                            .OnClick(nameof(TabsViewController.ToggleEmptyDocument))
                        )
                    )
                    .SetPageTemplate(new ParagraphComponent().BindDescription<DemoDocumentItem>(static x => x.Body, UIBindingScope.Relative))
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
                .BindItems<DriveGroupContext>(static x => x.Steps, UIBindingScope.Relative)
                .BindSelectedKey<DriveGroupContext>(static x => x.SelectedKey, UIBindingScope.Relative)
                .SetPageTemplate(new ParagraphComponent()
                    .BindDescription<DemoDocumentItem>(static x => x.Body, UIBindingScope.Relative)
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
