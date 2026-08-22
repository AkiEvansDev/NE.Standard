using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Image;

internal sealed class ImageExampleView : DemoExampleView, IUIViewDefinition
{
    private const string SampleSource = "https://picsum.photos/id/1015/320/240";

    public static string ViewKey => "demo.contents.image.example";

    protected override string ComponentRoute => "/contents/image";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.image.header";
    protected override string HeaderDescription => "demo.contents.image.description";

    protected override void DrawContent(WrapPanelComponent container)
        => container.AddChild(CreateFitGallery());

    private static ContainerComponent CreateFitGallery()
    {
        return DemoUI.CreateGroup(null, "Every fit mode",
            content =>
            {
                StackPanelComponent row = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(16)
                    .SetWrap(true);

                foreach (UIImageFit fit in Enum.GetValues<UIImageFit>())
                {
                    _ = row.AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetSpacing(4)
                        .AddChild(new ImageComponent()
                            .SetSource(SampleSource)
                            .SetAltText("Mountain river landscape")
                            .SetWidth(UILayoutLength.Absolute(160))
                            .SetHeight(UILayoutLength.Absolute(100))
                            .SetFit(fit)
                            .SetCornerRadius(UICornerRadius.Uniform(8))
                        )
                        .AddChild(new TextComponent().SetTitle(fit.ToString()).SetTitleType(UITextAppearance.Caption))
                    );
                }

                _ = content.AddChild(row.SetPlacement(1, 1, 24, 1));
            },
            static _ => { },
            contentMinHeight: 160
        );
    }
}
