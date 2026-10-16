using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.StackPanel;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.StackPanel;

/// <summary>
/// One line of things, and every property that can be bound to it; then a panel's head whose icon buttons stand on the words' edge,
/// a toolbar that wraps in reading order, and a list whose rows are stacks the other way.
/// </summary>
/// <remarks>
/// The panel packs along the axis it runs on, so a child has nothing to align against across it; <c>Wrap</c> is read against the
/// frame's width. <c>GlyphEdge</c> is not bindable, so it is an example rather than a row.
/// </remarks>
internal sealed class StackPanelView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string StackGroup = nameof(StackPanelController.StackGroup);

    public static string ViewKey => "demo.layouts.stack-panel";

    protected override string ComponentRoute => "/layouts/stack-panel";
    protected override string Header => "demo.layouts.stack-panel.header";
    protected override string HeaderDescription => "demo.layouts.stack-panel.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/article", "demo.nav.screens.article");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new StackPanelComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindOrientation($"{StackGroup}.{nameof(StackPanelGroupContext.Orientation)}")
            .BindSpacing($"{StackGroup}.{nameof(StackPanelGroupContext.Spacing)}")
            .BindWrap($"{StackGroup}.{nameof(StackPanelGroupContext.Wrap)}")
            .AddChildren(DemoUI.CreateTiles(5))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(StackGroup, "Stack panel", nameof(StackPanelController.CycleStackGroupOption))
        );

    // The card head beside the toolbar, both read at half the page, where the toolbar wraps; the list of checks across it.
    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateGlyphEdgeGroup()], [CreateToolbarGroup()]), CreateChecksGroup()];

    /// <summary>
    /// <c>GlyphEdge</c>: an icon-only ghost button last on a panel hangs its box past the content's edge by its glyph's inset, so a
    /// small × and a medium pencil stand on the line the rule and the price end on.
    /// </summary>
    private static ContainerComponent CreateGlyphEdgeGroup()
    {
        return DemoUI.CreateExample("Icons on the words' edge",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetPadding(UIThickness.Uniform(16))
                .SetWidth(UILayoutLength.Absolute(360))
                .SetContent(UILayout.Stack(12)
                    .AddChild(new ContainerComponent()
                        .SetColumn(24, UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .SetTitle("api-eu-west-1")
                            .SetTitleType(UITextAppearance.Subtitle)
                            .SetDescription("Pro · eu-west · Running")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(new StackPanelComponent()
                            .SetOrientation(UIOrientation.Horizontal)
                            .SetGlyphEdge(UIAlignment.End)
                            .SetVerticalAlignment(UIAlignment.Start)
                            .AddChild(UIIconButtons.Close().SetSize(UIButtonSize.Small))
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(new ContainerComponent()
                        .SetColumn(24, UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .SetTitle("Firewall")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("4 rules · SSH from the office only")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(new StackPanelComponent()
                            .SetOrientation(UIOrientation.Horizontal)
                            .SetGlyphEdge(UIAlignment.End)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .AddChild(UIIconButtons.Edit())
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("€64 a month")
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Muted)
                        .SetHorizontalAlignment(UIAlignment.End)
                    )
                ),
            note: "SetGlyphEdge(End) on the panel each button is last on: a ghost icon button shows only its glyph until it is pointed at, so it hangs its box past the content's edge by its glyph's inset — 6 px small, 11 medium — and the small × and the medium pencil stand where the rule and the price end. The wash runs into the card's padding. Start does the same for a leading Back; UILayout.Ends and the page headers set it themselves."
        );
    }

    /// <summary>
    /// <c>Wrap</c> on a row of commands: what does not fit goes to the next line in reading order, each command at its own width.
    /// </summary>
    private static ContainerComponent CreateToolbarGroup()
    {
        return DemoUI.CreateExample("A toolbar that wraps in reading order",
            new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetWrap(true)
                .SetSpacing(8)
                .AddChild(new ButtonComponent().SetType(UIButtonType.Primary).SetSize(UIButtonSize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Add)).SetTitle("New server"))
                .AddChild(new ButtonComponent().SetType(UIButtonType.Outline).SetSize(UIButtonSize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Refresh)).SetTitle("Restart"))
                .AddChild(new ButtonComponent().SetType(UIButtonType.Outline).SetSize(UIButtonSize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Sliders)).SetTitle("Resize"))
                .AddChild(new ButtonComponent().SetType(UIButtonType.Outline).SetSize(UIButtonSize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Download)).SetTitle("Take a snapshot"))
                .AddChild(new ButtonComponent().SetType(UIButtonType.Outline).SetSize(UIButtonSize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Region)).SetTitle("Move to another region"))
                .AddChild(new ButtonComponent().SetType(UIButtonType.Danger).SetSize(UIButtonSize.Small).SetIcon(DemoIcons.Outline(DemoIcons.Remove)).SetTitle("Delete")),
            note: "A row told to wrap: a command that does not fit starts the next line, and every command keeps its own width, so the toolbar still reads left to right. A set of like controls wants even columns instead — the wrap panel's ItemMinWidth."
        );
    }

    /// <summary>
    /// Stacks inside a stack, each with the air of its level: a heading over the list, the checks apart, a check's parts close.
    /// </summary>
    private static ContainerComponent CreateChecksGroup()
    {
        return DemoUI.CreateExample("Rows that are stacks the other way",
            UILayout.Stack(16)
                .AddChild(new TextComponent()
                    .SetTitle("Health checks")
                    .SetTitleType(UITextAppearance.Subtitle)
                    .SetDescription("The last run of each service's probe")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(UILayout.Stack(12)
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new IconComponent().SetIcon(DemoIcons.Outline(DemoIcons.Check)).SetColor(UIThemeColor.FromStyle(UIColorStyle.Success)))
                        .AddChild(new TextComponent().SetTitle("billing").SetTitleType(UITextAppearance.Body))
                        .AddChild(new BadgeComponent().SetType(UIBadgeType.Surface).SetText("eu-west"))
                        .AddChild(new TextComponent().SetTitle("12 of 12 replicas passed · 2 minutes ago").SetTitleType(UITextAppearance.Caption).SetTitleColor(UIThemeColor.Muted))
                    )
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new IconComponent().SetIcon(DemoIcons.Outline(DemoIcons.Alert)).SetColor(UIThemeColor.FromStyle(UIColorStyle.Warning)))
                        .AddChild(new TextComponent().SetTitle("metrics").SetTitleType(UITextAppearance.Body))
                        .AddChild(new BadgeComponent().SetType(UIBadgeType.Surface).SetText("us-east"))
                        .AddChild(new TextComponent().SetTitle("2 of 3 replicas passed · 4 minutes ago").SetTitleType(UITextAppearance.Caption).SetTitleColor(UIThemeColor.Muted))
                    )
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new IconComponent().SetIcon(DemoIcons.Outline(DemoIcons.Check)).SetColor(UIThemeColor.FromStyle(UIColorStyle.Success)))
                        .AddChild(new TextComponent().SetTitle("dns").SetTitleType(UITextAppearance.Body))
                        .AddChild(new BadgeComponent().SetType(UIBadgeType.Surface).SetText("eu-west"))
                        .AddChild(new TextComponent().SetTitle("2 of 2 replicas passed · 5 minutes ago").SetTitleType(UITextAppearance.Caption).SetTitleColor(UIThemeColor.Muted))
                    )
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new IconComponent().SetIcon(DemoIcons.Outline(DemoIcons.Check)).SetColor(UIThemeColor.FromStyle(UIColorStyle.Success)))
                        .AddChild(new TextComponent().SetTitle("scheduler").SetTitleType(UITextAppearance.Body))
                        .AddChild(new BadgeComponent().SetType(UIBadgeType.Surface).SetText("ap-south"))
                        .AddChild(new TextComponent().SetTitle("1 of 1 replica passed · 9 minutes ago").SetTitleType(UITextAppearance.Caption).SetTitleColor(UIThemeColor.Muted))
                    )
                ),
            columns: 24,
            note: "Three levels, three airs: 16 under the heading, 12 between the checks, 8 between a check's parts. Each check is a row that packs its parts from the start at their own widths, so a longer name moves the rest along rather than into columns — a list that should line its parts up is a table."
        );
    }
}
