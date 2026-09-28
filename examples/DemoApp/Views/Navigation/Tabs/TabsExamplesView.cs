using DemoApp.Controllers.Base;
using DemoApp.Views.Base;

namespace DemoApp.Views.Navigation.Tabs;

/// <summary>
/// Where a strip of fixed pages is written: a settings page, a card that has more than one face, and an inbox
/// whose caption counts.
/// </summary>
/// <remarks>Nothing is re-rendered on a switch, so a page keeps what was typed while another is showing.</remarks>
internal sealed class TabsExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.tabs.examples";

    protected override string ComponentRoute => "/navigation/tabs";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.navigation.tabs.header";
    protected override string HeaderDescription => "demo.navigation.tabs.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateSettingsGroup(), CreateCountGroup()], [CreateCardGroup(), CreateAgainstViewGroup()]));

    /// <summary>
    /// A settings page too long for a column, cut into the three questions it asks.
    /// </summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateExample("A settings page",
            new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsComponent()
                    .AddTab("profile", "Profile", UILayout.Stack(10)
                        .AddChild(new TextInputComponent().SetTitle("Display name").SetValue("Robin Hale"))
                        .AddChild(new TextInputComponent().SetTitle("Email").SetValue("robin@orvane.example"))
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
    /// A caption that carries a number, saying what is behind the page before it is opened.
    /// </summary>
    private static ContainerComponent CreateCountGroup()
    {
        return DemoUI.CreateExample("A count on a caption",
            new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsComponent()
                    .AddTab("inbox",
                        new TabHeaderComponent().SetTitle("Inbox").SetBadgeText("3").SetBadgeStyle(UIBadgeType.Danger),
                        UILayout.Stack(10)
                            .AddChild(new TextComponent()
                                .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                                .SetTitle("The rollout plan for release 483")
                                .SetDescription("Grace Kim — Two changes since the last review — see the plan.")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                            .AddChild(new TextComponent()
                                .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                                .SetTitle("billing #482 failed")
                                .SetDescription("Health check — 1 of 12 replicas did not answer.")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                            .AddChild(new TextComponent()
                                .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                                .SetTitle("Re: on-call next week")
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
    /// A card with more than one face: the strip sits in the content band, under the header that names the whole.
    /// </summary>
    private static ContainerComponent CreateCardGroup()
    {
        return DemoUI.CreateExample("Inside a card",
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Upload)
                    .SetTitle("billing · #481")
                    .SetDescription("production · eu-west")
                    .SetBadgeText("Healthy")
                    .SetBadgeStyle(UIBadgeType.Success)
                )
                .SetContent(new TabsComponent()
                    .AddTab("log", "Log", UILayout.Stack(10)
                        .AddChild(new ParagraphComponent()
                            .SetDescription("12:04:11  pull     ok\n12:04:12  migrate  ok\n12:04:19  start    ok in 7.1s\n12:04:26  health   12 of 12 passed")
                            .SetDescriptionType(UITextAppearance.Caption)
                        )
                    )
                    .AddTab("snapshots", "Snapshots", UILayout.Stack(10)
                        .AddChild(new LinkComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                            .SetTitle("billing-db-before-481.snap · 14.2 GB")
                            .SetUrl("https://orvane.example/snapshots/billing-db-before-481.snap")
                            .SetHorizontalAlignment(UIAlignment.Start)
                        )
                        .AddChild(new LinkComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                            .SetTitle("billing-481.config.json · 212 KB")
                            .SetUrl("https://orvane.example/snapshots/billing-481.config.json")
                            .SetHorizontalAlignment(UIAlignment.Start)
                        )
                    )
                    .AddTab("timing", "Timing", UILayout.Stack(10)
                        .AddChild(new ProgressComponent().SetValue(100).SetColor(UIThemeColor.FromStyle(UIColorStyle.Success)))
                        .AddChild(new TextComponent()
                            .SetTitle("41 s end to end")
                            .SetDescription("pull 1 s · migrate 7 s · start 12 s · health check 21 s")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
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
            UILayout.Stack(12)
                .SetWidth(UILayoutLength.Absolute(460))
                .AddChild(UIText.Label("Tabs — pages are regions the view wrote"))
                .AddChild(new TabsComponent()
                    .AddTab("incident", "incident-report.md", UILayout.Stack(10).AddChild(new ParagraphComponent().SetDescription("A paragraph, written for this page.")))
                    .AddTab("health", "health-check.cs", UILayout.Stack(10).AddChild(new TextComponent().SetIcon(DemoIcons.Outline(DemoIcons.File)).SetTitle("A text row, written for this one.")))
                    .AddTab("server", "server.json", UILayout.Stack(10).AddChild(new SwitchComponent().SetTitle("And a switch for the third.")))
                )
                .AddChild(new SeparatorComponent())
                .AddChild(UIText.Label("TabsView — pages are one template over a collection"))
                .AddChild(new TabsViewComponent()
                    .SetItems(documents)
                    .SetPageTemplate(new ParagraphComponent()
                        .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                        .SetMargin(UIThickness.All(0, 4, 0, 0))
                    )
                )
        );
    }
}
