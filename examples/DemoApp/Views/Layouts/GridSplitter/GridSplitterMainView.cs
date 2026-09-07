using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.GridSplitter;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.GridSplitter;

/// <summary>
/// One splitter between two panes, and every property that can be bound to it.
/// </summary>
/// <remarks>Two panes because <c>Orientation</c> is not bindable; the containers are unnamed, so a drag here is forgotten on navigation.</remarks>
internal sealed class GridSplitterMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SplitterGroup = nameof(GridSplitterMainController.SplitterGroup);

    public static string ViewKey => "demo.layouts.grid-splitter.main";

    protected override string ComponentRoute => "/layouts/grid-splitter";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.layouts.grid-splitter.header";
    protected override string HeaderDescription => "demo.layouts.grid-splitter.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(520,
            ("Vertical: the columns either side", frame => frame.AddChild(CreateColumnsPane())),
            ("Horizontal: the rows either side", frame => frame.AddChild(CreateRowsPane()))
        );

    /// <summary>
    /// Two star runs with the bar in a content-sized column of its own: a drag re-weights the stars.
    /// </summary>
    private static ContainerComponent CreateColumnsPane()
        => new ContainerComponent()
            .SetColumn(12, UIGridUnit.Auto())
            .SetOverflow(UIOverflow.Hidden)
            .AddChild(Pane("Left", "Drag the bar, or focus it and use the arrow keys; double-click puts the authored split back.").SetPlacement(1, 1, 11, 1))
            .AddChild(Bind(new GridSplitterComponent(), UIOrientation.Vertical).SetPlacement(12, 1, 1, 1))
            .AddChild(Pane("Right", "Both sides are star tracks, so the window can be resized and the proportion holds.").SetPlacement(13, 1, 12, 1))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// The same bar across the rows, in a container tall enough for a star row to mean something.
    /// </summary>
    private static ContainerComponent CreateRowsPane()
        => new ContainerComponent()
            .SetRow(1, UIGridUnit.Star())
            .AddRow(UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetHeight(UILayoutLength.Absolute(200))
            .SetOverflow(UIOverflow.Hidden)
            .AddChild(Pane("Top", "The bar runs across and moves the rows.").SetPlacement(1, 1, 24, 1))
            .AddChild(Bind(new GridSplitterComponent(), UIOrientation.Horizontal).SetPlacement(1, 2, 24, 1))
            .AddChild(Pane("Bottom", "Up and Down move it from the keyboard.").SetPlacement(1, 3, 24, 1))
            .SetPlacement(1, 1, 24, 1);

    private static GridSplitterComponent Bind(GridSplitterComponent splitter, UIOrientation orientation)
        => splitter
            .SetOrientation(orientation)
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindStep($"{SplitterGroup}.{nameof(GridSplitterGroupContext.Step)}")
            .BindColor($"{SplitterGroup}.{nameof(GridSplitterGroupContext.Color)}");

    /// <summary>On the page's own ground, with no edge of its own: the bar is the border between the two panes.</summary>
    private static SurfaceComponent Pane(string title, string description)
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Background)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetPadding(UIThickness.Uniform(12))
            .SetContent(new ParagraphComponent()
                .SetTitle(title)
                .SetDescription(description)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetWrapMode(UITextWrapMode.Wrap)
            );

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SplitterGroup, "Splitter", nameof(GridSplitterMainController.CycleSplitterOption))
        );
}
