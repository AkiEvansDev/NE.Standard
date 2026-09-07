using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Image;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Contents.Image;

/// <summary>
/// One picture, and every property that can be bound to it.
/// </summary>
/// <remarks>The preview is given a box of its own, since every question an image answers is about a box that is not its shape.</remarks>
internal sealed class ImageMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ImageGroup = nameof(ImageMainController.ImageGroup);

    public static string ViewKey => "demo.contents.image.main";

    protected override string ComponentRoute => "/contents/image";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.image.header";
    protected override string HeaderDescription => "demo.contents.image.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ImageComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSource($"{ImageGroup}.{nameof(ImageGroupContext.Source)}")
            .BindFit($"{ImageGroup}.{nameof(ImageGroupContext.Fit)}")
            .BindCornerRadius($"{ImageGroup}.{nameof(ImageGroupContext.CornerRadius)}")
            .BindAltText($"{ImageGroup}.{nameof(ImageGroupContext.AltText)}")
            .BindTooltip($"{ImageGroup}.{nameof(ImageGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ImageGroup}.{nameof(ImageGroupContext.TooltipPlacement)}")
            // The preview's own box, not a row; Width and Height stay the standard rows and work inside it.
            .SetMaxWidth(UILayoutLength.Absolute(320))
            .SetMaxHeight(UILayoutLength.Absolute(180))
            // Not bindable: a source that does not resolve draws this instead of a broken picture.
            .SetFallbackSource(DemoImages.Logo)
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ImageGroup, "Image", nameof(ImageMainController.CycleImageOption))
        );
}
