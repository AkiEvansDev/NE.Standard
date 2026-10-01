using DemoApp.Controllers.Actions.ButtonGroup;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;

namespace DemoApp.Views.Actions.ButtonGroup;

/// <summary>
/// One strip of three views, and every property that can be bound to it; then the places a strip of segments is written: a view
/// switched by icons in a toolbar, a period chosen by word, and a strip standing beside a field.
/// </summary>
/// <remarks>
/// <c>SelectedKey</c> is two-way; the segments themselves are items, so their look is the template's and not a row here. The
/// examples are not bound: they show the shapes, and each strip keeps its own current segment.
/// </remarks>
internal sealed class ButtonGroupView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SegmentGroup = nameof(ButtonGroupController.SegmentGroup);
    private const string BorderGroup = nameof(ButtonGroupController.BorderGroup);

    public static string ViewKey => "demo.actions.button-group";

    protected override string ComponentRoute => "/actions/button-group";
    protected override string Header => "demo.actions.button-group.header";
    protected override string HeaderDescription => "demo.actions.button-group.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ButtonGroupComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSelectedKey($"{SegmentGroup}.{nameof(SegmentGroupContext.SelectedKey)}")
            .BindSize($"{SegmentGroup}.{nameof(SegmentGroupContext.Size)}")
            .BindSelectionStyle($"{SegmentGroup}.{nameof(SegmentGroupContext.SelectionStyle)}")
            .BindPadding($"{SegmentGroup}.{nameof(SegmentGroupContext.Padding)}")
            .BindBackground($"{SegmentGroup}.{nameof(SegmentGroupContext.Background)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetItems([
                new ButtonItem { Id = SegmentGroupContext.ListKey, Icon = DemoIcons.Outline(DemoIcons.List), Title = "List" },
                new ButtonItem { Id = SegmentGroupContext.BoardKey, Icon = DemoIcons.Outline(DemoIcons.LayoutDashboard), Title = "Board" },
                new ButtonItem { Id = SegmentGroupContext.TimelineKey, Icon = DemoIcons.Outline(DemoIcons.History), Title = "Timeline" }
            ])
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SegmentGroup, "Group", nameof(ButtonGroupController.CycleSegmentOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ButtonGroupController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateToolbarGroup()], [CreatePeriodGroup()]), CreateFieldGroup()];

    /// <summary>
    /// The shape the control exists for: how a list is shown, chosen by glyph at the end of a toolbar.
    /// </summary>
    private static ContainerComponent CreateToolbarGroup()
    {
        return DemoUI.CreateExample("A view switched from a toolbar",
            new SurfaceComponent()
                .SetPadding(UIThickness.All(12, 8, 12, 8))
                .SetContent(new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    .AddChild(new TextComponent()
                        .SetTitle("Deploys")
                        .SetDescription("48 in the last day")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(1, 1, 23, 1)
                    )
                    .AddChild(new ButtonGroupComponent()
                        .SetSize(UIButtonSize.Small)
                        .SetSelectedKey("list")
                        .SetItems([
                            new ButtonItem { Id = "list", Icon = DemoIcons.Outline(DemoIcons.List), Tooltip = "List" },
                            new ButtonItem { Id = "board", Icon = DemoIcons.Outline(DemoIcons.LayoutDashboard), Tooltip = "Board" },
                            new ButtonItem { Id = "timeline", Icon = DemoIcons.Outline(DemoIcons.History), Tooltip = "Timeline" }
                        ])
                        .SetPlacement(24, 1, 1, 1)
                    )
                ),
            note: "Glyphs alone, with the word in the tooltip: a strip at a toolbar's end is read by its pictures."
        );
    }

    /// <summary>
    /// Words rather than glyphs, one of them unavailable: a segment that cannot be chosen stays in the strip and takes no press.
    /// </summary>
    private static ContainerComponent CreatePeriodGroup()
    {
        return DemoUI.CreateExample("A period chosen by word",
            UILayout.Stack(12)
                .AddChild(new ButtonGroupComponent()
                    .SetSelectedKey("week")
                    .SetItems([
                        new ButtonItem { Id = "day", Title = "Day" },
                        new ButtonItem { Id = "week", Title = "Week" },
                        new ButtonItem { Id = "month", Title = "Month" },
                        new ButtonItem { Id = "year", Title = "Year", Enabled = false, Tooltip = "Not enough history yet" }
                    ])
                )
                .AddChild(new ButtonGroupComponent()
                    .SetSize(UIButtonSize.Large)
                    .SetSelectedKey("staging")
                    .SetSelectionStyle(UISelectionStyle.Ground(UIThemeColor.Accent))
                    .SetItems([
                        new ButtonItem { Id = "dev", Icon = DemoIcons.Outline(DemoIcons.Edit), Title = "Development" },
                        new ButtonItem { Id = "staging", Icon = DemoIcons.Outline(DemoIcons.Cloud), Title = "Staging" },
                        new ButtonItem { Id = "prod", Icon = DemoIcons.Outline(DemoIcons.Shield), Title = "Production" }
                    ])
                ),
            note: "The first at the ordinary size with a disabled year; the second large, with the accent as the chosen ground."
        );
    }

    /// <summary>
    /// A strip beside a field, on the field's own ground, so the two read as one row.
    /// </summary>
    private static ContainerComponent CreateFieldGroup()
    {
        return DemoUI.CreateExample("Beside a field",
            new ContainerComponent()
                .SetColumn(24, UIGridUnit.Auto())
                .AddChild(new TextInputComponent()
                    .SetTitle("Search deploys")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetPlaceholder("Service, version or region")
                    .SetPlacement(1, 1, 23, 1)
                )
                .AddChild(new ButtonGroupComponent()
                    .SetVerticalAlignment(UIAlignment.End)
                    .SetMargin(UIThickness.All(8, 0, 0, 0))
                    .SetSelectedKey("all")
                    .SetItems([
                        new ButtonItem { Id = "all", Title = "All" },
                        new ButtonItem { Id = "failed", Title = "Failed" }
                    ])
                    .SetPlacement(24, 1, 1, 1)
                ),
            columns: 24,
            note: "The group sits at the far end of the row the field fills, which is only a row once it has the page's width."
        );
    }
}
