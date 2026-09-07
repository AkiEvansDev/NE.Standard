using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Icon;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Contents.Icon;

/// <summary>
/// One glyph on its own, and every property that can be bound to it.
/// </summary>
/// <remarks><c>Size</c> is the ladder a glyph climbs beside text; the standard <c>Width</c> row drives the drawing itself.</remarks>
internal sealed class IconMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string IconGroup = nameof(IconMainController.IconGroup);

    public static string ViewKey => "demo.contents.icon.main";

    protected override string ComponentRoute => "/contents/icon";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.icon.header";
    protected override string HeaderDescription => "demo.contents.icon.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new IconComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindIcon($"{IconGroup}.{nameof(IconGroupContext.Icon)}")
            .BindColor($"{IconGroup}.{nameof(IconGroupContext.Color)}")
            .BindSize($"{IconGroup}.{nameof(IconGroupContext.Size)}")
            .BindTooltip($"{IconGroup}.{nameof(IconGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{IconGroup}.{nameof(IconGroupContext.TooltipPlacement)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(IconGroup, "Icon", nameof(IconMainController.CycleIconOption))
        );
}
