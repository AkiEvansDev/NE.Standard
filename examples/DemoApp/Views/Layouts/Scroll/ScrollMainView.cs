using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Scroll;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Scroll;

/// <summary>
/// One viewport, and every property that can be bound to it.
/// </summary>
/// <remarks>
/// The preview holds a grid bigger than its box, since a viewport is only one once its content overflows.
/// <c>Disabled</c> cuts the content rather than shrinking it, and <c>ScrollAnchor</c> is on the Scenarios page.
/// </remarks>
internal sealed class ScrollMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ScrollGroup = nameof(ScrollMainController.ScrollGroup);

    public static string ViewKey => "demo.layouts.scroll.main";

    protected override string ComponentRoute => "/layouts/scroll";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.layouts.scroll.header";
    protected override string HeaderDescription => "demo.layouts.scroll.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ScrollContainerComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindHorizontalScroll($"{ScrollGroup}.{nameof(ScrollGroupContext.HorizontalScroll)}")
            .BindVerticalScroll($"{ScrollGroup}.{nameof(ScrollGroupContext.VerticalScroll)}")
            .BindScrollSnap($"{ScrollGroup}.{nameof(ScrollGroupContext.ScrollSnap)}")
            // MaxHeight rather than Height: the bound Height row would render its unset state as `auto`.
            .SetMaxHeight(UILayoutLength.Absolute(200))
            // Bigger than the box on both axes, or neither scroll row would say anything.
            .AddChildren(CreateTileRows(rows: 6, columns: 12))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    /// <summary>
    /// The rows as children of the viewport itself: a scroll comes to rest on a child, so a wrapper would leave one stop.
    /// </summary>
    private static IVisualComponent[] CreateTileRows(int rows, int columns)
    {
        IVisualComponent[] tiles = DemoUI.CreateTiles(rows * columns);
        IVisualComponent[] result = new IVisualComponent[rows];

        for (var row = 0; row < rows; row++)
        {
            result[row] = new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .SetMargin(UIThickness.All(0, 0, 0, 8))
                .AddChildren(tiles[(row * columns)..((row + 1) * columns)]);
        }

        return result;
    }

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ScrollGroup, "Scroll", nameof(ScrollMainController.CycleScrollGroupOption))
        );
}
