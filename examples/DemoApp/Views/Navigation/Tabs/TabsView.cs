using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.Tabs;
using DemoApp.Views.Base;

namespace DemoApp.Views.Navigation.Tabs;

/// <summary>
/// One strip over three fixed pages and every property that can be bound to it; then where a strip of fixed pages is written: a
/// settings page, and an inbox whose caption counts.
/// </summary>
/// <remarks>
/// <c>SelectedKey</c> is two-way; <c>SelectionStyle</c> is the strip's other row, and everything past those two belongs to a caption.
/// Nothing is re-rendered on a switch, so a page keeps what was typed while another is showing. A strip inside a card is on the
/// card's page.
/// </remarks>
internal sealed class TabsView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TabsGroup = nameof(TabsController.TabsGroup);

    public static string ViewKey => "demo.navigation.tabs";

    protected override string ComponentRoute => "/navigation/tabs";
    protected override string Header => "demo.navigation.tabs.header";
    protected override string HeaderDescription => "demo.navigation.tabs.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TabsComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSelectedKey($"{TabsGroup}.{nameof(TabsGroupContext.SelectedKey)}")
            .BindSelectionStyle($"{TabsGroup}.{nameof(TabsGroupContext.SelectionStyle)}")
            .BindShowOverflow($"{TabsGroup}.{nameof(TabsGroupContext.ShowOverflow)}")
            .AddTab(TabsGroupContext.OverviewKey,
                new TabCaptionComponent()
                    .SetTitle("Overview")
                    .BindIcon($"{TabsGroup}.{nameof(TabsGroupContext.OverviewIcon)}"),
                CreateOverviewPage()
            )
            .AddTab(TabsGroupContext.ActivityKey,
                new TabCaptionComponent()
                    .SetTitle("Activity")
                    .BindBadgeText($"{TabsGroup}.{nameof(TabsGroupContext.ActivityBadge)}"),
                CreateActivityPage()
            )
            .AddTab(TabsGroupContext.SettingsKey,
                new TabCaptionComponent()
                    .SetTitle("Settings")
                    .BindVisibility($"{TabsGroup}.{nameof(TabsGroupContext.SettingsVisible)}"),
                CreateSettingsPage()
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    /// <summary>The facts of a deploy: what went out, where, and when.</summary>
    private static StackPanelComponent CreateOverviewPage()
        => TabsDemo.CreatePage()
            .AddChild(CreateReading("Environment", "production · eu-west"))
            .AddChild(CreateReading("Release", "#481 of billing"))
            .AddChild(CreateReading("Started", "Today at 12:04 by Robin Hale"))
            .AddChild(CreateReading("State", "Healthy — 12 of 12 replicas ready"));

    private static TextComponent CreateReading(string name, string value)
        => new TextComponent()
            .SetTitle(value)
            .SetDescription(name)
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted);

    /// <summary>What happened, newest first; the page the badge counts for.</summary>
    private static StackPanelComponent CreateActivityPage()
        => TabsDemo.CreatePage()
            .AddChild(CreateEvent("12:31", "Replica 7 restarted after a failed readiness probe."))
            .AddChild(CreateEvent("12:19", "Traffic shifted to 100 %."))
            .AddChild(CreateEvent("12:04", "Rollout started from release #481."));

    private static TextComponent CreateEvent(string time, string text)
        => new TextComponent()
            .SetIcon(DemoIcons.Outline(DemoIcons.Clock))
            .SetTitle(text)
            .SetDescription(time)
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted);

    /// <summary>The knobs a deploy has: inputs, so the page holds state of its own across a switch.</summary>
    private static StackPanelComponent CreateSettingsPage()
        => TabsDemo.CreatePage()
            .AddChild(new SwitchComponent().SetTitle("Roll back on a failed probe").SetValue(true))
            .AddChild(new SwitchComponent().SetTitle("Notify the admin on call"))
            .AddChild(new TextInputComponent().SetTitle("Probe path").SetValue("/healthz"));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(TabsGroup, "Tabs", nameof(TabsController.CycleTabsGroupOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // The comparison across the page, its two strips side by side, where at half the page it stood alone in its row.
        => [.. DemoUI.CreateColumns([CreateSettingsGroup(), CreateActionsGroup()], [CreateCountGroup()]), CreateAgainstViewGroup()];

    /// <summary>
    /// A settings page too long for a column, cut into the three questions it asks.
    /// </summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateExample("A settings page",
            new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsComponent()
                    // A profile's fields, outlined as a settings form's are.
                    .AddTab("profile", "Profile", UILayout.Stack(10)
                        .AddChild(new TextInputComponent().SetAppearance(UIInputAppearance.Outline).SetTitle("Display name").SetValue("Robin Hale"))
                        .AddChild(new TextInputComponent().SetAppearance(UIInputAppearance.Outline).SetTitle("Email").SetValue("robin@orvane.example"))
                    )
                    .AddTab("notifications", "Notifications", UILayout.Stack(10)
                        .AddChild(new SwitchComponent().SetTitle("A deploy finishes").SetValue(true))
                        .AddChild(new SwitchComponent().SetTitle("A deploy fails").SetValue(true))
                        .AddChild(new SwitchComponent().SetTitle("Someone mentions me"))
                    )
                    .AddTab("security", "Security", UILayout.Stack(10)
                        .AddChild(new SwitchComponent().SetTitle("Require a second factor").SetValue(true))
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Lock))
                            .SetTitle("Last signed in today at 09:12")
                            .SetDescription("A browser on a laptop · Amsterdam")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                    )
                )
        );
    }

    /// <summary>
    /// Actions at the strip's end: a filter over every page (<c>AddAction</c>), a panel of its own opening from its button, and a new
    /// release that only the releases page offers (<c>AddTabAction</c>), shown with it on the page alone — sized to the captions, the
    /// captions keeping the room they leave.
    /// </summary>
    private static ContainerComponent CreateActionsGroup()
    {
        return DemoUI.CreateExample("Actions at the strip's end",
            new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsComponent()
                    .AddTab("deploys", "Deploys", UILayout.Stack(10)
                        .AddChild(new TextComponent().SetIcon(DemoIcons.Outline(DemoIcons.Upload)).SetTitle("billing #482 to production").SetDescription("Today at 09:41 · Sam Ortega").SetDescriptionType(UITextAppearance.Caption).SetDescriptionColor(UIThemeColor.Muted))
                        .AddChild(new TextComponent().SetIcon(DemoIcons.Outline(DemoIcons.Upload)).SetTitle("search #120 to staging").SetDescription("Yesterday at 17:05 · Priya Nair").SetDescriptionType(UITextAppearance.Caption).SetDescriptionColor(UIThemeColor.Muted))
                    )
                    .AddTab("releases", "Releases", UILayout.Stack(10)
                        .AddChild(new TextComponent().SetTitle("Release 483").SetDescription("Planned for Thursday").SetDescriptionType(UITextAppearance.Caption).SetDescriptionColor(UIThemeColor.Muted))
                    )
                    .AddTabAction("releases", UIIconButtons.New().SetTooltip("New release"))
                    .AddAction(new FlyoutComponent()
                        .SetPopupPlacement(UIPopupPlacement.BottomEnd)
                        .SetAnchor(UIIconButtons.Filter())
                        // A width and nothing else: the panel already is a surface.
                        .SetContent(UILayout.Stack(10)
                            .SetWidth(UILayoutLength.Absolute(220))
                            .AddChild(UIText.Label("Show"))
                            .AddChild(new SwitchComponent().SetTitle("Production only").SetValue(true))
                            .AddChild(new SwitchComponent().SetTitle("Mine only"))
                            .AddChild(new SelectComponent()
                                .SetTitle("Region")
                                .SetPlaceholder("Any region")
                                .SetShowClearButton()
                                .SetOptions(
                                [
                                    new OptionItem { Id = "eu-west", Title = "Europe West" },
                                    new OptionItem { Id = "us-east", Title = "US East" },
                                    new OptionItem { Id = "ap-south", Title = "Asia South" }
                                ])
                            )
                        )
                    )
                ),
            note: "The filter is a flyout (`AddAction(FlyoutComponent)`): its panel opens from the button at the strip's end, whichever page is in front. The + is the releases page's own (`AddTabAction`), there only while that page is; a flyout may be a page's own as well."
        );
    }

    /// <summary>
    /// A caption that carries a number, saying what is behind the page before it is opened.
    /// </summary>
    private static ContainerComponent CreateCountGroup()
    {
        return DemoUI.CreateExample("A count on a caption",
            new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsComponent()
                    .AddTab("inbox",
                        new TabCaptionComponent().SetTitle("Inbox").SetBadgeText("3").SetBadgeStyle(UIBadgeType.Danger),
                        UILayout.Stack(10)
                            .AddChild(new TextComponent()
                                .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                                .SetTitle("The rollout plan for release 483")
                                .SetTitleType(UITextAppearance.Body)
                                .SetDescription("Grace Kim — Two changes since the last review — see the plan.")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                            .AddChild(new TextComponent()
                                .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                                .SetTitle("billing #482 failed")
                                .SetTitleType(UITextAppearance.Body)
                                .SetDescription("Health check — 1 of 12 replicas did not answer.")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                            .AddChild(new TextComponent()
                                .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                                .SetTitle("Re: on-call next week")
                                .SetTitleType(UITextAppearance.Body)
                                .SetDescription("Ada Lin — I can take Tuesday if you take Thursday.")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                    )
                    .AddTab("archived", "Archived", UILayout.Stack(10)
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                            .SetTitle("Retro notes")
                            .SetDescription("Grace Kim — Three things to keep, one to stop.")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                    )
                    .AddTab("spam", "Spam", UILayout.Stack(10)
                        .AddChild(new TextComponent()
                            .SetTitle("Nothing here")
                            .SetTitleColor(UIThemeColor.Muted)
                        )
                    )
                )
        );
    }

    /// <summary>
    /// The pair that look the same: regions the view wrote, against one template over a collection.
    /// </summary>
    private static ContainerComponent CreateAgainstViewGroup()
    {
        DemoDocumentItem[] documents =
        [
            new() { Id = "incident", Title = "incident-report.md", Order = 1, CanRemove = false, Body = "One template, rendered once per document." },
            new() { Id = "health", Title = "health-check.cs", Order = 2, CanRemove = false, Body = "The same paragraph, bound to a different item." },
            new() { Id = "server", Title = "server.json", Order = 3, CanRemove = false, Body = "Add a document to the collection and a tab appears." }
        ];

        return DemoUI.CreateExample("Against TabsView",
            UILayout.Columns(32,
                DemoUI.CreateLabelled("Tabs — pages are regions the view wrote", new TabsComponent()
                    .AddTab("incident", "incident-report.md", UILayout.Stack(10).AddChild(new ParagraphComponent().SetDescription("A paragraph, written for this page.")))
                    .AddTab("health", "health-check.cs", UILayout.Stack(10).AddChild(new TextComponent().SetIcon(DemoIcons.Outline(DemoIcons.File)).SetTitle("A text row, written for this one.")))
                    .AddTab("server", "server.json", UILayout.Stack(10).AddChild(new SwitchComponent().SetTitle("And a switch for the third.")))
                ),
                DemoUI.CreateLabelled("TabsView — pages are one template over a collection", new TabsViewComponent()
                    .SetItems(documents)
                    .SetPageTemplate(new ParagraphComponent()
                        .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                        .SetMargin(UIThickness.All(0, 4, 0, 0))
                    )
                )
            ),
            columns: 24
        );
    }
}
