using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Flyout;
using DemoApp.Views.Base;
using NE.Colors;

namespace DemoApp.Views.Layouts.Flyout;

/// <summary>
/// One hanging panel and every property that can be bound to it; then what hangs off a control, and what the component leaves
/// entirely to whoever opens it.
/// </summary>
/// <remarks>
/// <c>IsOpen</c> is two-way; the preview reserves a tall box, or the runtime flips a panel placed above its anchor. A flyout has
/// no opinion about its content, and three shipped controls are already a flyout with it filled in.
/// </remarks>
internal sealed class FlyoutView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string FlyoutGroup = nameof(FlyoutController.FlyoutGroup);

    public static string ViewKey => "demo.layouts.flyout";

    protected override string ComponentRoute => "/layouts/flyout";
    protected override string Header => "demo.layouts.flyout.header";
    protected override string HeaderDescription => "demo.layouts.flyout.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new FlyoutComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindIsOpen($"{FlyoutGroup}.{nameof(FlyoutGroupContext.IsOpen)}")
            .BindFlyoutPlacement($"{FlyoutGroup}.{nameof(FlyoutGroupContext.FlyoutPlacement)}")
            .BindCloseOnBackdrop($"{FlyoutGroup}.{nameof(FlyoutGroupContext.CloseOnBackdrop)}")
            .BindCloseOnEscape($"{FlyoutGroup}.{nameof(FlyoutGroupContext.CloseOnEscape)}")
            .SetAnchor(new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .SetIcon(DemoIcons.Outline(DemoIcons.Sliders))
                .SetTitle("Filters")
            )
            // A width and nothing else: the panel already is a surface.
            .SetContent(new ContainerComponent()
                .SetWidth(UILayoutLength.Absolute(220))
                .AddChild(UILayout.Stack(8)
                    .AddChild(UIText.Label("Narrow the list"))
                    .AddChild(new TextComponent()
                        .SetTitle("All environments")
                        .SetTitleType(UITextAppearance.Body)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Last seven days")
                        .SetTitleType(UITextAppearance.Body)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Successful only")
                        .SetTitleType(UITextAppearance.Body)
                    )
                )
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 360);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(FlyoutGroup, "Flyout", nameof(FlyoutController.CycleFlyoutGroupOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // Three short groups down one half, beside the comparison as tall as they are: in pairs, each short one left a hole beside it.
        => [DemoUI.CreateHalf(CreateFilterGroup(), CreateDismissGroup(), CreateDetailGroup()), CreateAgainstBuiltInGroup()];

    /// <summary>
    /// A handful of controls belonging to one button; the flyout decides only where the panel hangs and when it goes.
    /// </summary>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateExample("A panel that belongs to one button",
            new FlyoutComponent()
                .SetFlyoutPlacement(UIPopupPlacement.BottomStart)
                // The wrapper leaves the anchor the box it would have had, so the flyout says where it sits.
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetAnchor(new ButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Sliders))
                    .SetTitle("Filters")
                )
                // A width and nothing else: the panel already is a surface, so a Surface inside it would be a second frame.
                .SetContent(new ContainerComponent()
                    .SetWidth(UILayoutLength.Absolute(230))
                    .AddChild(UILayout.Stack(10)
                        .AddChild(UIText.Label("Narrow the list"))
                        .AddChild(new TextComponent().SetIcon(DemoIcons.Outline(DemoIcons.Filter)).SetTitle("All environments").SetTitleType(UITextAppearance.Body))
                        .AddChild(new TextComponent().SetIcon(DemoIcons.Outline(DemoIcons.Clock)).SetTitle("Last seven days").SetTitleType(UITextAppearance.Body))
                        .AddChild(new TextComponent().SetIcon(DemoIcons.Outline(DemoIcons.Check)).SetTitle("Successful only").SetTitleType(UITextAppearance.Body))
                        .AddChild(new SeparatorComponent())
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Primary)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("Apply")
                            .SetHorizontalAlignment(UIAlignment.Start)
                        )
                    )
                )
        );
    }

    /// <summary>
    /// A detail hanging off a row in a list, placed to the side because under is where the next row is.
    /// </summary>
    private static ContainerComponent CreateDetailGroup()
    {
        return DemoUI.CreateExample("A detail beside a row",
            new SurfaceComponent()
                .SetWidth(UILayoutLength.Absolute(320))
                .SetContent(UILayout.Stack(4)
                    .AddChild(new FlyoutComponent()
                        // To the side: below is where the next row is.
                        .SetFlyoutPlacement(UIPopupPlacement.RightStart)
                        .SetAnchor(new ActionComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetSize(UIButtonSize.Small)
                            .SetShowChevron(false)
                            .SetTitle("billing")
                            .SetDescription("Deployed 4 minutes ago")
                            .SetTrailingText("Details")
                        )
                        // A width and nothing else: the panel already is a surface, so a Surface inside it would be a second frame.
                        .SetContent(new ContainerComponent()
                            .SetWidth(UILayoutLength.Absolute(230))
                            .AddChild(UILayout.Stack(8)
                                .AddChild(UIText.Label("billing"))
                                .AddChild(new TextComponent().SetTitle("Release").SetTitleType(UITextAppearance.Caption).SetTitleColor(UIThemeColor.Muted).SetDescription("#483").SetDescriptionType(UITextAppearance.Body))
                                .AddChild(new TextComponent().SetTitle("Duration").SetTitleType(UITextAppearance.Caption).SetTitleColor(UIThemeColor.Muted).SetDescription("4 m 12 s").SetDescriptionType(UITextAppearance.Body))
                                .AddChild(new TextComponent().SetTitle("Replicas").SetTitleType(UITextAppearance.Caption).SetTitleColor(UIThemeColor.Muted).SetDescription("8 of 8").SetDescriptionType(UITextAppearance.Body))
                            )
                        )
                    )
                    .AddChild(new ActionComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetShowChevron(false)
                        .SetTitle("dns")
                        .SetDescription("Rolled back")
                    )
                    .AddChild(new ActionComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetShowChevron(false)
                        .SetTitle("panel")
                        .SetDescription("Waiting on approval")
                    )
                )
        );
    }

    /// <summary>
    /// The two dismissals, and the one case for turning both off: a drawer that closes from its own control alone.
    /// </summary>
    private static ContainerComponent CreateDismissGroup()
    {
        return DemoUI.CreateExample("When it goes away",
            UILayout.Stack(14)
                .AddChild(UIText.Label("Both — a press outside, or Escape"))
                .AddChild(new FlyoutComponent()
                    .SetFlyoutPlacement(UIPopupPlacement.BottomStart)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetAnchor(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .SetSize(UIButtonSize.Small)
                        .SetTitle("Ordinary")
                    )
                    // A width and nothing else: the panel already is a surface, so a Surface inside it would be a second frame.
                    .SetContent(new ContainerComponent()
                        .SetWidth(UILayoutLength.Absolute(230))
                        .AddChild(new TextComponent()
                            .SetTitle("Press anywhere else, or hit Escape.")
                            .SetTitleType(UITextAppearance.Body)
                        )
                    )
                )
                .AddChild(UIText.Label("Neither — only its own control"))
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
                    .SetContent(new ContainerComponent()
                        .SetWidth(UILayoutLength.Absolute(230))
                        .AddChild(UILayout.Stack(10)
                            .AddChild(new ParagraphComponent()
                                .SetDescription("Nothing outside this panel closes it — press the anchor again.")
                                .SetDescriptionType(UITextAppearance.Body)
                            )
                        )
                    )
                )
        );
    }

    /// <summary>
    /// The case against reaching for it: a dropdown, a context menu and a colour picker are each a filled-in flyout.
    /// </summary>
    private static ContainerComponent CreateAgainstBuiltInGroup()
    {
        return DemoUI.CreateExample("Against the ones that already are one",
            UILayout.Stack(14)
                .AddChild(UIText.Label("Select — a list of options, and a value bound to the chosen one"))
                .AddChild(new SelectComponent()
                    .SetPlaceholder("Pick a region")
                    .SetValue("eu-west")
                    .SetOptions(
                    [
                        new OptionItem { Id = "eu-west", Title = "Amsterdam" },
                        new OptionItem { Id = "us-east", Title = "Ashburn" },
                        new OptionItem { Id = "ap-south", Title = "Singapore" }
                    ])
                    .SetWidth(UILayoutLength.Absolute(280))
                    .SetHorizontalAlignment(UIAlignment.Start)
                )
                .AddChild(UIText.Label("ContextMenu — the same panel, opened by a right-click instead"))
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(280))
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetContextMenu(new MenuComponent().SetItems(
                    [
                        new MenuItem { Id = "menu-release", Kind = UIMenuItemKind.Header, Title = "Release 481" },
                        new MenuItem { Id = "menu-rerun", Title = "Roll out again", Icon = DemoIcons.Outline(DemoIcons.Refresh) },
                        new MenuItem { Id = "menu-logs", Title = "Open the logs", Icon = DemoIcons.Outline(DemoIcons.Download) }
                        ])
                    )
                    .SetContent(new TextComponent()
                        .SetTitle("Right-click this panel")
                        .SetTitleType(UITextAppearance.Body)
                    )
                )
                .AddChild(UIText.Label("ColorInput — a picker and a palette, and a colour bound to both"))
                .AddChild(new ColorInputComponent()
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AstralTeal))
                    .SetWidth(UILayoutLength.Absolute(280))
                    .SetHorizontalAlignment(UIAlignment.Start)
                )
                .AddChild(UIText.Label("Flyout — anything else, and nothing decided for you"))
                .AddChild(new FlyoutComponent()
                    .SetFlyoutPlacement(UIPopupPlacement.BottomStart)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetAnchor(UIButtons.Secondary("Open a panel"))
                    // A width and nothing else: the panel already is a surface, so a Surface inside it would be a second frame.
                    .SetContent(new ContainerComponent()
                        .SetWidth(UILayoutLength.Absolute(230))
                        .AddChild(UILayout.Stack(8)
                            .AddChild(new ParagraphComponent()
                                .SetDescription("Whatever the page needs. No value, no keyboard model, no list — those are what the three above already brought with them.")
                                .SetDescriptionType(UITextAppearance.Body)
                            )
                        )
                    )
                )
        );
    }
}
