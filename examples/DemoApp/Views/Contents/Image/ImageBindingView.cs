using System.Collections.Generic;
using DemoApp.Controllers.Contents.Image;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Image;

internal sealed class ImageBindingView : DemoBindingView, IUIViewDefinition
{
    private const string SampleSource = "https://picsum.photos/id/1015/640/400";
    private const string FallbackSource = "https://picsum.photos/id/237/640/400";

    public static string ViewKey => "demo.contents.image.binding";

    protected override string ComponentRoute => "/contents/image";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.image.header";
    protected override string HeaderDescription => "demo.contents.image.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateFitGroup())
            .AddChild(CreateSourceGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new ImageComponent()
            .SetSource(SampleSource)
            .SetAltText("Mountain river landscape")
            .SetWidth(UILayoutLength.Absolute(240))
            .SetHeight(UILayoutLength.Absolute(160))
            .SetFit(UIImageFit.Cover)
        );
    }

    private static ContainerComponent CreateFitGroup()
    {
        return DemoUI.CreateGroup(nameof(ImageBindingController.FitGroup), "Fit",
            content => content.AddChild(new ImageComponent()
                .SetSource(SampleSource)
                .SetAltText("Mountain river landscape")
                .SetWidth(UILayoutLength.Absolute(240))
                .SetHeight(UILayoutLength.Absolute(160))
                .BindFit(nameof(ImageFitGroupContext.Fit), UIBindingScope.Relative)
                .BindCornerRadius(nameof(ImageFitGroupContext.CornerRadius), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Fit"] = nameof(ImageBindingController.CycleFit),
                ["Corner radius"] = nameof(ImageBindingController.CycleCornerRadius),
            })
        );
    }

    private static ContainerComponent CreateSourceGroup()
    {
        return DemoUI.CreateGroup(nameof(ImageBindingController.SourceGroup), "Source",
            content => content.AddChild(new ImageComponent()
                .SetFallbackSource(FallbackSource)
                .SetWidth(UILayoutLength.Absolute(240))
                .SetHeight(UILayoutLength.Absolute(160))
                .SetFit(UIImageFit.Cover)
                .BindSource(nameof(ImageSourceGroupContext.Source), UIBindingScope.Relative)
                .BindAltText(nameof(ImageSourceGroupContext.AltText), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Source"] = nameof(ImageBindingController.ToggleSource),
                ["Alt text"] = nameof(ImageBindingController.ToggleAltText),
            })
        );
    }
}
