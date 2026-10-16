using System.Globalization;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Container;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.Container;

/// <summary>
/// The grid everything else is placed in, and every property that can be bound to it; then the pieces of a screen a grid is: a list
/// beside what it opens, a page of parts in columns, a mark over a picture's corner, and a panel whose middle scrolls.
/// </summary>
/// <remarks><c>Columns</c> and <c>Rows</c> are not bindable, so the preview is drawn once per arrangement, all moved together.</remarks>
internal sealed class ContainerView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ContainerGroup = nameof(ContainerController.ContainerGroup);
    private const string BorderGroup = nameof(ContainerController.BorderGroup);

    public static string ViewKey => "demo.layouts.container";

    protected override string ComponentRoute => "/layouts/container";
    protected override string Header => "demo.layouts.container.header";
    protected override string HeaderDescription => "demo.layouts.container.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/inbox", "demo.nav.screens.inbox");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(560,
            ("Spans of twenty-four, and one child wider than its columns", frame => frame.AddChild(CreateSpansPane())),
            ("A fixed column beside what is left", frame => frame.AddChild(CreateColumnsPane())),
            ("Rows: a fixed one, one sized by its content, one with a floor", frame => frame.AddChild(CreateRowsPane())),
            ("Placed twice: full width below xl, two across from xl up", frame => frame.AddChild(CreateBreakpointPane()))
        );

    /// <summary>
    /// Every column the same star, with a last tile wider than its four — the one case <c>Overflow</c> answers.
    /// </summary>
    private static ContainerComponent CreateSpansPane()
        => Bind(new ContainerComponent()
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Auto())
            .AddRow(UIGridUnit.Auto())
            .AddChild(Tile(1).SetPlacement(1, 1, 8, 1))
            .AddChild(Tile(2).SetPlacement(9, 1, 8, 1))
            .AddChild(Tile(3).SetPlacement(17, 1, 8, 1))
            .AddChild(Tile(4).SetPlacement(1, 2, 12, 1))
            .AddChild(Tile(5).SetPlacement(13, 2, 12, 1))
            .AddChild(Tile(6).SetPlacement(1, 3, 20, 1))
            .AddChild(Tile(7, width: 160).SetPlacement(21, 3, 4, 1))
        );

    /// <summary>
    /// The sidebar shape: a fixed first column, and the other twenty-three sharing the rest.
    /// </summary>
    private static ContainerComponent CreateColumnsPane()
        => Bind(new ContainerComponent()
            .SetColumn(1, UIGridUnit.Absolute(120))
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Auto())
            .AddChild(Tile(1, height: 112).SetPlacement(1, 1, 1, 2))
            .AddChild(Tile(2).SetPlacement(2, 1, 23, 1))
            .AddChild(Tile(3).SetPlacement(2, 2, 23, 1))
        );

    /// <summary>
    /// Three answers to how tall: a number, whatever is in it, and whatever is in it above a floor.
    /// </summary>
    private static ContainerComponent CreateRowsPane()
        => Bind(new ContainerComponent()
            .SetRow(1, UIGridUnit.Absolute(56))
            .AddRow(UIGridUnit.Auto())
            .AddRow(UIGridUnit.Auto(min: 80))
            .AddChild(Tile(1).SetPlacement(1, 1, 24, 1))
            .AddChild(Tile(2, height: 88).SetPlacement(1, 2, 24, 1))
            .AddChild(Tile(3).SetPlacement(1, 3, 24, 1))
        );

    /// <summary>
    /// A placement per breakpoint: the same three tiles are a column below <c>xl</c> and two-then-one from it up.
    /// </summary>
    private static ContainerComponent CreateBreakpointPane()
        => Bind(new ContainerComponent()
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Auto())
            .AddRow(UIGridUnit.Auto())
            .AddChild(Tile(1).SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, 12, 1)))
            .AddChild(Tile(2).SetPlacement(1, 2, 24, 1, xl: UIGridPlacement.At(13, 1, 12, 1)))
            .AddChild(Tile(3).SetPlacement(1, 3, 24, 1, xl: UIGridPlacement.At(1, 2, 24, 1)))
        );

    private static ContainerComponent Bind(ContainerComponent container)
        => container
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSpacing($"{ContainerGroup}.{nameof(ContainerGroupContext.Spacing)}")
            .BindPadding($"{ContainerGroup}.{nameof(ContainerGroupContext.Padding)}")
            .BindBackground($"{ContainerGroup}.{nameof(ContainerGroupContext.Background)}")
            .BindBackgroundImage($"{ContainerGroup}.{nameof(ContainerGroupContext.BackgroundImage)}")
            .BindBackgroundImageFit($"{ContainerGroup}.{nameof(ContainerGroupContext.BackgroundImageFit)}")
            .BindOverflow($"{ContainerGroup}.{nameof(ContainerGroupContext.Overflow)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// The tile numbered <paramref name="number"/>, sized by its cell unless a width is given.
    /// </summary>
    private static SurfaceComponent Tile(int number, double? width = null, double height = 56)
    {
        // The shared set numbers its tiles from one, so the tile numbered n is the last of a set of n.
        SurfaceComponent tile = (SurfaceComponent)DemoUI.CreateTiles(number, height: height)[^1];

        if (width is not double fixedWidth)
            return tile.SetWidth(UILayoutLength.Auto());

        // It says its own width, or a tile clipped at the container's edge reads as the grid failing.
        return tile
            .SetWidth(UILayoutLength.Absolute(fixedWidth))
            .SetContent(new TextComponent()
                .SetTitle(string.Create(CultureInfo.InvariantCulture, $"{number} · {fixedWidth:0} px"))
                .SetTitleType(UITextAppearance.Caption)
                .SetTextAlignment(UITextAlignment.Center)
                .SetVerticalAlignment(UIAlignment.Center)
            );
    }

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ContainerGroup, "Container", nameof(ContainerController.CycleContainerGroupOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ContainerController.CycleBorderGroupOption))
        );

    // The two screen parts across the page; the corner badges beside the panel with a scrolling middle.
    protected override IVisualComponent[] CreateExamples()
        => [CreateListPaneGroup(), CreateOverviewGroup(), .. DemoUI.CreateColumns([CreateCornerGroup()], [CreateHeadAndFootGroup()])];

    /// <summary>
    /// <c>ScrollbarAir</c>: the list's cell has air before the detail, and lends it to the list's scroller for its overlay bar, so the
    /// rows end where the search field over them does.
    /// </summary>
    private static ContainerComponent CreateListPaneGroup()
    {
        return DemoUI.CreateExample("A list beside what it opens",
            new ContainerComponent()
                .SetColumn(1, UIGridUnit.Absolute(280))
                .SetRow(1, UIGridUnit.Auto())
                .AddChild(new ContainerComponent()
                    // The 16 px before the detail, from the medium width, where the two stand side by side.
                    .SetScrollbarAir(UIResponsive<double>.Create(0, md: 16))
                    .SetSpacing(8)
                    .SetRow(1, UIGridUnit.Auto())
                    .AddRow(UIGridUnit.Auto())
                    .AddChild(new TextInputComponent()
                        .SetPlaceholder("Find a server")
                        .SetPlacement(1, 1, 24, 1)
                    )
                    .AddChild(new ScrollContainerComponent()
                        .VerticalScrollOnly()
                        .SetHeight(UILayoutLength.Absolute(260))
                        .AddChild(UILayout.Stack(2)
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Server)).SetTitle("api-eu-west-1").SetDescription("Pro · Running").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Server)).SetTitle("api-eu-west-2").SetDescription("Pro · Running").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Server)).SetTitle("web-eu-west-1").SetDescription("Standard · Degraded").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Server)).SetTitle("db-eu-central-1").SetDescription("Dedicated · Running").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Server)).SetTitle("cache-eu-north-1").SetDescription("Pro · Provisioning").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Server)).SetTitle("db-us-east-2").SetDescription("Dedicated · Maintenance").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Server)).SetTitle("queue-us-east-1").SetDescription("Standard · Running").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Server)).SetTitle("storage-ap-south-1").SetDescription("Dedicated · Stopped").SetShowChevron(false))
                        )
                        .SetPlacement(1, 2, 24, 1)
                    )
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 1, 1))
                )
                .AddChild(new SurfaceComponent()
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(0, 16, 0, 0), md: UIThickness.All(16, 0, 0, 0)))
                    .SetContent(UILayout.Stack(12)
                        .AddChild(new TextComponent()
                            .SetTitle("api-eu-west-1")
                            .SetTitleType(UITextAppearance.Subtitle)
                            .SetDescription("The public API in Amsterdam, one of two replicas")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                        .AddChild(UIDetails.List(("Plan", "Pro · 4 vCPU · 16 GB"), ("Region", "eu-west"), ("CPU", "42%"), ("Uptime", "31 days")))
                    )
                    .SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(2, 1, 23, 1))
                ),
            columns: 24,
            note: "SetScrollbarAir(16) on the list's cell, which leaves 16 px before the detail: the scroller in it hangs its overlay bar's room into that air, so its rows end where the search field does rather than 12 px short of it. On a phone the two stand one under the other and there is no air to lend; UILayout.Panes sets it for you."
        );
    }

    /// <summary>
    /// A page of parts in one grid: placed by column span from the medium width, each across the whole width on a phone.
    /// </summary>
    private static ContainerComponent CreateOverviewGroup()
    {
        return DemoUI.CreateExample("A server at a glance",
            new ContainerComponent()
                .SetSpacing(16)
                .SetRow(1, UIGridUnit.Auto())
                .AddChild(new SurfaceComponent()
                    .SetContent(UILayout.Stack(8)
                        .AddChild(new TextComponent()
                            .SetTitle("42%")
                            .SetTitleType(UITextAppearance.Display)
                            .SetDescription("CPU, the last five minutes")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ProgressComponent().SetValue(42))
                    )
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 8, 1))
                )
                .AddChild(new SurfaceComponent()
                    .SetContent(UILayout.Stack(8)
                        .AddChild(new TextComponent()
                            .SetTitle("61%")
                            .SetTitleType(UITextAppearance.Display)
                            .SetDescription("Memory, 9.8 of 16 GB")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ProgressComponent().SetValue(61))
                    )
                    .SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(9, 1, 8, 1))
                )
                .AddChild(new SurfaceComponent()
                    .SetContent(UILayout.Stack(8)
                        .AddChild(new TextComponent()
                            .SetTitle("78%")
                            .SetTitleType(UITextAppearance.Display)
                            .SetDescription("Disk, 187 of 240 GB")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ProgressComponent().SetValue(78).SetColor(UIThemeColor.FromStyle(UIColorStyle.Warning)))
                    )
                    .SetPlacement(1, 3, 24, 1, md: UIGridPlacement.At(17, 1, 8, 1))
                )
                .AddChild(new SurfaceComponent()
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetContent(UILayout.Stack(12)
                        .AddChild(UIText.Label("Recent events"))
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                            .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                            .SetTitle("Health check passed")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("12:08 · 12 of 12 probes")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                            .SetTitle("Nightly snapshot taken")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("02:00 · 14.2 GB, kept for 30 days")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Bolt))
                            .SetTitle("Resized to Pro")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("Yesterday · change request CHG-471, approved by Grace Kim")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                    )
                    .SetPlacement(1, 4, 24, 1, md: UIGridPlacement.At(1, 2, 16, 1))
                )
                .AddChild(new SurfaceComponent()
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetContent(UILayout.Stack(12)
                        .AddChild(UIText.Label("Details"))
                        .AddChild(UIDetails.List(("Plan", "Pro"), ("Region", "eu-west"), ("Image", "ubuntu-24.04"), ("Uptime", "31 days")))
                    )
                    .SetPlacement(1, 5, 24, 1, md: UIGridPlacement.At(17, 2, 8, 1))
                ),
            columns: 24,
            note: "One grid of twenty-four columns with a Spacing of 16. From the medium width the readings take eight columns each, and the events sixteen beside the details' eight, the two stretched to one height; on a phone every part takes all twenty-four, one under another. Only the first row is declared: the rows past it are added as the placements reach them, five on a phone and two above it."
        );
    }

    /// <summary>
    /// Two children placed in one cell share it, the later standing over the earlier: a status badge on a picture's corner.
    /// </summary>
    private static ContainerComponent CreateCornerGroup()
    {
        return DemoUI.CreateExample("A badge over a picture's corner",
            UILayout.Columns(16,
                new ContainerComponent()
                    .SetRow(1, UIGridUnit.Auto())
                    .AddRow(UIGridUnit.Auto())
                    .AddChild(new ImageComponent()
                        .SetSource(DemoImages.HarbourSky)
                        .SetAltText("The harbour in Amsterdam")
                        .SetFit(UIImageFit.Cover)
                        .SetBorderRadius(UICornerRadius.Uniform(8))
                        .SetHeight(UILayoutLength.Absolute(110))
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                        .SetPlacement(1, 1, 24, 1)
                    )
                    // The same cell as the picture, laid after it, so it stands over it.
                    .AddChild(new BadgeComponent()
                        .SetType(UIBadgeType.Success)
                        .SetText("Healthy")
                        .SetHorizontalAlignment(UIAlignment.End)
                        .SetVerticalAlignment(UIAlignment.Start)
                        .SetMargin(UIThickness.Uniform(8))
                        .SetPlacement(1, 1, 24, 1)
                    )
                    .AddChild(UIText.Body("Europe West", "Amsterdam · eu-west").SetMargin(UIThickness.All(0, 8, 0, 0)).SetPlacement(1, 2, 24, 1)),
                new ContainerComponent()
                    .SetRow(1, UIGridUnit.Auto())
                    .AddRow(UIGridUnit.Auto())
                    .AddChild(new ImageComponent()
                        .SetSource(DemoImages.SunsetRuins)
                        .SetAltText("Evening light over Stockholm")
                        .SetFit(UIImageFit.Cover)
                        .SetBorderRadius(UICornerRadius.Uniform(8))
                        .SetHeight(UILayoutLength.Absolute(110))
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                        .SetPlacement(1, 1, 24, 1)
                    )
                    .AddChild(new BadgeComponent()
                        .SetType(UIBadgeType.Info)
                        .SetText("New disks")
                        .SetHorizontalAlignment(UIAlignment.End)
                        .SetVerticalAlignment(UIAlignment.Start)
                        .SetMargin(UIThickness.Uniform(8))
                        .SetPlacement(1, 1, 24, 1)
                    )
                    .AddChild(UIText.Body("Europe North", "Stockholm · eu-north").SetMargin(UIThickness.All(0, 8, 0, 0)).SetPlacement(1, 2, 24, 1)),
                new ContainerComponent()
                    .SetRow(1, UIGridUnit.Auto())
                    .AddRow(UIGridUnit.Auto())
                    .AddChild(new ImageComponent()
                        .SetSource(DemoImages.NightStreet)
                        .SetAltText("A street in Ashburn at night")
                        .SetFit(UIImageFit.Cover)
                        .SetBorderRadius(UICornerRadius.Uniform(8))
                        .SetHeight(UILayoutLength.Absolute(110))
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                        .SetPlacement(1, 1, 24, 1)
                    )
                    .AddChild(new BadgeComponent()
                        .SetType(UIBadgeType.Warning)
                        .SetText("Degraded")
                        .SetHorizontalAlignment(UIAlignment.End)
                        .SetVerticalAlignment(UIAlignment.Start)
                        .SetMargin(UIThickness.Uniform(8))
                        .SetPlacement(1, 1, 24, 1)
                    )
                    .AddChild(UIText.Body("US East", "Ashburn · us-east").SetMargin(UIThickness.All(0, 8, 0, 0)).SetPlacement(1, 2, 24, 1))
            ),
            note: "The badge is placed in the picture's own cell and added after it, so it stands over it, held to the corner by its alignment and a margin; nothing is positioned. Added first, it would stand under the picture."
        );
    }

    /// <summary>
    /// Rows of a fixed-height panel: the head and the foot as tall as they are, the middle a star row that takes the rest and scrolls.
    /// </summary>
    private static ContainerComponent CreateHeadAndFootGroup()
    {
        return DemoUI.CreateExample("A head and a foot that stay",
            new SurfaceComponent()
                .SetPadding(UIThickness.Uniform(0))
                .SetHeight(UILayoutLength.Absolute(300))
                // Rows, not a stack: only the middle scrolls, under a head and over a foot that stay in sight.
                .SetContent(new ContainerComponent()
                    .SetRow(1, UIGridUnit.Auto())
                    .AddRow(UIGridUnit.Star())
                    .AddRow(UIGridUnit.Auto())
                    .AddChild(new TextComponent()
                        .SetTitle("Open alerts")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Five across three regions")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.All(16, 12, 16, 12))
                        .SetPlacement(1, 1, 24, 1)
                    )
                    .AddChild(new ScrollContainerComponent()
                        .VerticalScrollOnly()
                        .SetPadding(UIThickness.All(8, 0, 8, 0))
                        .AddChild(UILayout.Stack(2)
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Alert)).SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Warning)).SetTitle("Disk at 78% on api-eu-west-1").SetDescription("eu-west · 12 minutes ago").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Alert)).SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger)).SetTitle("web-eu-west-1 failing health checks").SetDescription("eu-west · 20 minutes ago").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Alert)).SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Warning)).SetTitle("Slow replication to db-us-east-2").SetDescription("us-east · an hour ago").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Alert)).SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Warning)).SetTitle("Certificate for bramble.example expires in 9 days").SetDescription("edge-router · today").SetShowChevron(false))
                            .AddChild(new ActionComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Outline(DemoIcons.Alert)).SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Warning)).SetTitle("Queue depth above 10 000 on queue-us-east-1").SetDescription("us-east · yesterday").SetShowChevron(false))
                        )
                        .SetPlacement(1, 2, 24, 1)
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Link)
                        .SetTitle("All alerts")
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .SetMargin(UIThickness.All(16, 10, 16, 12))
                        .SetPlacement(1, 3, 24, 1)
                    )
                ),
            note: "Three rows in a panel 300 px tall: the head and the foot are Auto, as tall as they are, and the middle is a Star row that takes what is left, its scroller scrolling inside it."
        );
    }
}
