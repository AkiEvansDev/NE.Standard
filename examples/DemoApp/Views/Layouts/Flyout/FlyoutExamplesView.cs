using DemoApp.Views.Base;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Flyout;

/// <summary>
/// What hangs off a control, and what the component leaves entirely to whoever opens it.
/// </summary>
/// <remarks>A flyout has no opinion about its content, and three shipped controls are already a flyout with it filled in.</remarks>
internal sealed class FlyoutExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.flyout.examples";

    protected override string ComponentRoute => "/layouts/flyout";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.layouts.flyout.header";
    protected override string HeaderDescription => "demo.layouts.flyout.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateFilterGroup(), CreateAgainstBuiltInGroup()],
            [CreateDetailGroup(), CreateDismissGroup()]
        ));
    }

    /// <summary>
    /// A handful of controls belonging to one button; the flyout decides only where the panel hangs and when it goes.
    /// </summary>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateGroup(null, "A panel that belongs to one button",
            content => content.AddChild(new FlyoutComponent()
                .SetFlyoutPlacement(UIPopupPlacement.BottomStart)
                // The wrapper leaves the anchor the box it would have had, so the flyout says where it sits.
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetAnchor(new ButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Sliders))
                    .SetTitle("Filters")
                )
                .SetContent(CreatePanel(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(10)
                    .AddChild(DemoUI.CreateCaption("Narrow the list"))
                    .AddChild(CreateRow(DemoIcons.Filter, "All environments"))
                    .AddChild(CreateRow(DemoIcons.Clock, "Last seven days"))
                    .AddChild(CreateRow(DemoIcons.Check, "Successful only"))
                    .AddChild(new SeparatorComponent())
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetSize(UIButtonSize.Small)
                        .SetTitle("Apply")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                ))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A detail hanging off a row in a list, placed to the side because under is where the next row is.
    /// </summary>
    private static ContainerComponent CreateDetailGroup()
    {
        return DemoUI.CreateGroup(null, "A detail beside a row",
            content => content.AddChild(new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(320))
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(4)
                    .AddChild(CreateEntry("payments-api", "Deployed 4 minutes ago", withDetail: true))
                    .AddChild(CreateEntry("search-index", "Rolled back", withDetail: false))
                    .AddChild(CreateEntry("web-portal", "Waiting on review", withDetail: false))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static IVisualComponent CreateEntry(string title, string state, bool withDetail)
    {
        ActionComponent row = new ActionComponent()
            .SetType(UIButtonType.Ghost)
            .SetSize(UIButtonSize.Small)
            .SetShowChevron(false)
            .SetTitle(title)
            .SetDescription(state)
            .SetTrailingText(withDetail ? "Details" : null);

        if (!withDetail)
            return row;

        return new FlyoutComponent()
            // To the side: below is where the next row is.
            .SetFlyoutPlacement(UIPopupPlacement.RightStart)
            .SetAnchor(row)
            .SetContent(CreatePanel(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .AddChild(DemoUI.CreateCaption("payments-api"))
                .AddChild(CreateFact("Commit", "a079856"))
                .AddChild(CreateFact("Duration", "4 m 12 s"))
                .AddChild(CreateFact("Replicas", "8 of 8"))
            ));
    }

    private static TextComponent CreateFact(string name, string value)
        => new TextComponent()
            .SetTitle(name)
            .SetTitleType(UITextAppearance.Caption)
            .SetTitleColor(UIThemeColor.Muted)
            .SetDescription(value)
            .SetDescriptionType(UITextAppearance.Body);

    /// <summary>
    /// The two dismissals, and the one case for turning both off: a drawer that closes from its own control alone.
    /// </summary>
    private static ContainerComponent CreateDismissGroup()
    {
        return DemoUI.CreateGroup(null, "When it goes away",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(14)
                .AddChild(DemoUI.CreateCaption("Both — a press outside, or Escape"))
                .AddChild(new FlyoutComponent()
                    .SetFlyoutPlacement(UIPopupPlacement.BottomStart)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetAnchor(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .SetSize(UIButtonSize.Small)
                        .SetTitle("Ordinary")
                    )
                    .SetContent(CreatePanel(new TextComponent()
                        .SetTitle("Press anywhere else, or hit Escape.")
                        .SetTitleType(UITextAppearance.Body)
                    ))
                )
                .AddChild(DemoUI.CreateCaption("Neither — only its own control"))
                .AddChild(new FlyoutComponent()
                    .SetFlyoutPlacement(UIPopupPlacement.BottomStart)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetCloseOnBackdrop(false)
                    .SetCloseOnEscape(false)
                    .SetAnchor(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .SetSize(UIButtonSize.Small)
                        .SetTitle("Stays open")
                    )
                    .SetContent(CreatePanel(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetSpacing(10)
                        .AddChild(new ParagraphComponent()
                            .SetDescription("Nothing outside this panel closes it — press the anchor again.")
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                    ))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// The case against reaching for it: a dropdown, a context menu and a colour picker are each a filled-in flyout.
    /// </summary>
    private static ContainerComponent CreateAgainstBuiltInGroup()
    {
        return DemoUI.CreateGroup(null, "Against the ones that already are one",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(14)
                .AddChild(DemoUI.CreateCaption("Select — a list of options, and a value bound to the chosen one"))
                .AddChild(new SelectComponent()
                    .SetPlaceholder("Pick a region")
                    .SetValue("eu-west-1")
                    .SetOptions(
                    [
                        new OptionItem { Id = "eu-west-1", Title = "Ireland" },
                        new OptionItem { Id = "us-east-1", Title = "N. Virginia" },
                        new OptionItem { Id = "ap-south-1", Title = "Mumbai" }
                    ])
                    .SetWidth(UILayoutLength.Absolute(280))
                    .SetHorizontalAlignment(UIAlignment.Start)
                )
                .AddChild(DemoUI.CreateCaption("ContextMenu — the same panel, opened by a right-click instead"))
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(280))
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetContextMenu(new MenuComponent().SetItems(
                    [
                        new MenuItem { Id = "menu-build", Kind = UIMenuItemKind.Header, Title = "Build 481" },
                        new MenuItem { Id = "menu-rerun", Title = "Run again", Icon = DemoIcons.Outline(DemoIcons.Refresh) },
                        new MenuItem { Id = "menu-logs", Title = "Open the logs", Icon = DemoIcons.Outline(DemoIcons.Download) }
                    ]))
                    .SetContent(new TextComponent()
                        .SetTitle("Right-click this panel")
                        .SetTitleType(UITextAppearance.Body)
                    )
                )
                .AddChild(DemoUI.CreateCaption("ColorInput — a picker and a palette, and a colour bound to both"))
                .AddChild(new ColorInputComponent()
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AstralTeal))
                    .SetWidth(UILayoutLength.Absolute(280))
                    .SetHorizontalAlignment(UIAlignment.Start)
                )
                .AddChild(DemoUI.CreateCaption("Flyout — anything else, and nothing decided for you"))
                .AddChild(new FlyoutComponent()
                    .SetFlyoutPlacement(UIPopupPlacement.BottomStart)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetAnchor(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .SetTitle("Open a panel")
                    )
                    .SetContent(CreatePanel(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetSpacing(8)
                        .AddChild(new ParagraphComponent()
                            .SetDescription("Whatever the page needs. No value, no keyboard model, no list — those are what the three above already brought with them.")
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                    ))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A width and nothing else: the panel already is a surface, so a Surface inside it would be a second frame.
    /// </summary>
    private static ContainerComponent CreatePanel(IVisualComponent content)
        => new ContainerComponent()
            .SetWidth(UILayoutLength.Absolute(230))
            .AddChild(content);

    private static TextComponent CreateRow(string icon, string title)
        => new TextComponent()
            .SetIcon(DemoIcons.Outline(icon))
            .SetTitle(title)
            .SetTitleType(UITextAppearance.Body);
}
