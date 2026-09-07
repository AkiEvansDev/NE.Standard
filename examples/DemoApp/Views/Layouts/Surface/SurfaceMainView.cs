using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Card;
using DemoApp.Controllers.Layouts.Surface;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Surface;

/// <summary>
/// One surface, and every property that can be bound to it.
/// </summary>
/// <remarks>Everything here is also on a card, which is one of these with bands added.</remarks>
internal sealed class SurfaceMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SurfaceGroup = nameof(SurfaceMainController.SurfaceGroup);
    private const string BorderGroup = nameof(SurfaceMainController.BorderGroup);

    public static string ViewKey => "demo.layouts.surface.main";

    protected override string ComponentRoute => "/layouts/surface";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.layouts.surface.header";
    protected override string HeaderDescription => "demo.layouts.surface.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new SurfaceComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSurface($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.Surface)}")
            .BindClickable($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.Clickable)}")
            .BindPadding($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.Padding)}")
            .BindBackground($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.Background)}")
            .BindBackgroundImage($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.BackgroundImage)}")
            .BindBackgroundImageFit($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.BackgroundImageFit)}")
            .BindOverflow($"{SurfaceGroup}.{nameof(CardSurfaceGroupContext.Overflow)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            // Set rather than bound: it is what the surface holds rather than something about the surface.
            .SetContent(new ParagraphComponent()
                .SetTitle("A surface")
                .SetDescription("One region and nothing around it: a fill, an edge, a radius, and a click where it is asked for.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 260);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SurfaceGroup, "Surface", nameof(SurfaceMainController.CycleSurfaceOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(SurfaceMainController.CycleBorderOption))
        );
}
