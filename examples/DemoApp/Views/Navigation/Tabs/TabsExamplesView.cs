using DemoApp.Controllers.Base;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

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
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateSettingsGroup(), CreateCountGroup()],
            [CreateCardGroup(), CreateAgainstViewGroup()]
        ));
    }

    /// <summary>
    /// A settings page too long for a column, cut into the three questions it asks.
    /// </summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateGroup(null, "A settings page",
            content => content.AddChild(new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsComponent()
                    .AddTab("profile", "Profile", TabsDemo.CreatePage()
                        .AddChild(new TextInputComponent().SetTitle("Display name").SetValue("Robin Hale"))
                        .AddChild(new TextInputComponent().SetTitle("Email").SetValue("robin@example.com"))
                    )
                    .AddTab("notifications", "Notifications", TabsDemo.CreatePage()
                        .AddChild(new SwitchComponent().SetTitle("A deploy finishes").SetValue(true))
                        .AddChild(new SwitchComponent().SetTitle("A deploy fails").SetValue(true))
                        .AddChild(new SwitchComponent().SetTitle("Someone mentions me"))
                    )
                    .AddTab("security", "Security", TabsDemo.CreatePage()
                        .AddChild(new SwitchComponent().SetTitle("Require a second factor").SetValue(true))
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Lock))
                            .SetTitle("Last signed in today at 09:12")
                            .SetDescription("Chrome on Windows · 10.0.0.12")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A caption that carries a number, saying what is behind the page before it is opened.
    /// </summary>
    private static ContainerComponent CreateCountGroup()
    {
        return DemoUI.CreateGroup(null, "A count on a caption",
            content => content.AddChild(new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .SetContent(new TabsComponent()
                    .AddTab("inbox",
                        new TabHeaderComponent().SetTitle("Inbox").SetBadgeText("3").SetBadgeStyle(UIBadgeType.Danger),
                        TabsDemo.CreatePage()
                            .AddChild(CreateMessage("Grace Kim", "The rollout plan for 2.14", "Two changes since the last review — see the diff."))
                            .AddChild(CreateMessage("Build", "payments-api #482 failed", "12 tests, 1 failed: PaymentsRoundTrip."))
                            .AddChild(CreateMessage("Ada Lin", "Re: on-call next week", "I can take Tuesday if you take Thursday."))
                    )
                    .AddTab("archived", "Archived", TabsDemo.CreatePage()
                        .AddChild(CreateMessage("Grace Kim", "Retro notes", "Three things to keep, one to stop."))
                    )
                    .AddTab("spam", "Spam", TabsDemo.CreatePage()
                        .AddChild(new TextComponent()
                            .SetTitle("Nothing here")
                            .SetTitleColor(UIThemeColor.Muted)
                        )
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static TextComponent CreateMessage(string from, string subject, string preview)
        => new TextComponent()
            .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
            .SetTitle(subject)
            .SetDescription($"{from} — {preview}")
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted);

    /// <summary>
    /// A card with more than one face: the strip sits in the content band, under the header that names the whole.
    /// </summary>
    private static ContainerComponent CreateCardGroup()
    {
        return DemoUI.CreateGroup(null, "Inside a card",
            content => content.AddChild(new CardComponent()
                .SetWidth(UILayoutLength.Absolute(460))
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Upload)
                    .SetTitle("payments-api · #481")
                    .SetDescription("production · eu-west-1")
                    .SetBadgeText("Healthy")
                    .SetBadgeStyle(UIBadgeType.Success)
                )
                .SetContent(new TabsComponent()
                    .AddTab("log", "Log", TabsDemo.CreatePage()
                        .AddChild(new ParagraphComponent()
                            .SetDescription("12:04:11  resolve  ok\n12:04:12  restore  ok\n12:04:19  build    ok in 7.1s\n12:04:26  test     452 passed")
                            .SetDescriptionType(UITextAppearance.Caption)
                        )
                    )
                    .AddTab("artifacts", "Artifacts", TabsDemo.CreatePage()
                        .AddChild(CreateArtifact("payments-481.zip", "14.2 MB"))
                        .AddChild(CreateArtifact("payments-481.sbom.json", "212 KB"))
                    )
                    .AddTab("timing", "Timing", TabsDemo.CreatePage()
                        .AddChild(new ProgressComponent().SetValue(100).SetColor(UIThemeColor.FromStyle(UIColorStyle.Success)))
                        .AddChild(new TextComponent()
                            .SetTitle("41 s end to end")
                            .SetDescription("restore 1 s · build 7 s · test 12 s · publish 21 s")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static LinkComponent CreateArtifact(string name, string size)
        => new LinkComponent()
            .SetIcon(DemoIcons.Outline(DemoIcons.Download))
            .SetTitle($"{name} · {size}")
            .SetUrl($"https://example.com/artifacts/{name}")
            .SetHorizontalAlignment(UIAlignment.Start);

    /// <summary>
    /// The pair that look the same: regions the view wrote, against one template over a collection.
    /// </summary>
    private static ContainerComponent CreateAgainstViewGroup()
    {
        DemoDocumentItem[] documents =
        [
            new() { Id = "readme", Title = "README.md", Order = 1, CanRemove = false, Body = "One template, rendered once per document." },
            new() { Id = "program", Title = "Program.cs", Order = 2, CanRemove = false, Body = "The same paragraph, bound to a different item." },
            new() { Id = "settings", Title = "appsettings.json", Order = 3, CanRemove = false, Body = "Add a document to the collection and a tab appears." }
        ];

        return DemoUI.CreateGroup(null, "Against TabsView",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetWidth(UILayoutLength.Absolute(460))
                .AddChild(DemoUI.CreateCaption("Tabs — pages are regions the view wrote"))
                .AddChild(new TabsComponent()
                    .AddTab("readme", "README.md", TabsDemo.CreatePage().AddChild(new ParagraphComponent().SetDescription("A paragraph, written for this page.")))
                    .AddTab("program", "Program.cs", TabsDemo.CreatePage().AddChild(new TextComponent().SetIcon(DemoIcons.Outline(DemoIcons.File)).SetTitle("A text row, written for this one.")))
                    .AddTab("settings", "appsettings.json", TabsDemo.CreatePage().AddChild(new SwitchComponent().SetTitle("And a switch for the third.")))
                )
                .AddChild(new SeparatorComponent())
                .AddChild(DemoUI.CreateCaption("TabsView — pages are one template over a collection"))
                .AddChild(new TabsViewComponent()
                    .SetItems(documents)
                    .SetPageTemplate(new ParagraphComponent()
                        .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                        .SetMargin(UIThickness.All(0, 4, 0, 0))
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
