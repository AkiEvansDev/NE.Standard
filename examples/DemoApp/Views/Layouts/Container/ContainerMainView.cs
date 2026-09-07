using System.Globalization;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Container;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Container;

/// <summary>
/// The grid everything else is placed in, and every property that can be bound to it.
/// </summary>
/// <remarks><c>Columns</c> and <c>Rows</c> are not bindable, so the preview is drawn once per arrangement, all moved together.</remarks>
internal sealed class ContainerMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ContainerGroup = nameof(ContainerMainController.ContainerGroup);
    private const string BorderGroup = nameof(ContainerMainController.BorderGroup);

    public static string ViewKey => "demo.layouts.container.main";

    protected override string ComponentRoute => "/layouts/container";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main];
    protected override string Header => "demo.layouts.container.header";
    protected override string HeaderDescription => "demo.layouts.container.description";

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
            DemoUI.CreateOptionSection(ContainerGroup, "Container", nameof(ContainerMainController.CycleContainerGroupOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ContainerMainController.CycleBorderGroupOption))
        );
}
