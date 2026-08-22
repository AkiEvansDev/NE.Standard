using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.ScrollContainer;

internal sealed class ScrollContainerExampleView : DemoExampleView, IUIViewDefinition
{
    private static readonly int[] PhotoIds = [1015, 1025, 1039, 1043, 1050, 1062];

    public static string ViewKey => "demo.layouts.scroll-container.example";

    protected override string ComponentRoute => "/layouts/scroll-container";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.scroll-container.header";
    protected override string HeaderDescription => "demo.layouts.scroll-container.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreatePhotoStripGroup())
            .AddChild(CreateEventLogGroup());
    }

    private static ContainerComponent CreatePhotoStripGroup()
    {
        return DemoUI.CreateGroup(null, "Photo strip (horizontal)",
            content =>
            {
                StackPanelComponent strip = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(8);

                foreach (var id in PhotoIds)
                {
                    _ = strip.AddChild(new ImageComponent()
                        .SetSource($"https://picsum.photos/id/{id}/200/130")
                        .SetAltText("Gallery photo")
                        .SetWidth(UILayoutLength.Absolute(200))
                        .SetHeight(UILayoutLength.Absolute(130))
                        .SetFit(UIImageFit.Cover)
                        .SetCornerRadius(UICornerRadius.Uniform(6))
                    );
                }

                _ = content.AddChild(new ScrollContainerComponent()
                    .SetHorizontalScroll(UIScrollMode.Auto)
                    .SetVerticalScroll(UIScrollMode.Disabled)
                    .SetWidth(UILayoutLength.Absolute(460))
                    .SetHeight(UILayoutLength.Absolute(150))
                    .SetPlacement(1, 1, 24, 1)
                    .AddChild(strip)
                );
            },
            static _ => { },
            contentMinHeight: 170
        );
    }

    private static ContainerComponent CreateEventLogGroup()
    {
        return DemoUI.CreateGroup(null, "Event log (vertical)",
            content =>
            {
                StackPanelComponent log = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(6);

                (string Icon, UIColorStyle Style, string Message)[] events =
                [
                    (LucideIcons.Check, UIColorStyle.Success, "12:01:14  build 2.4.108 succeeded"),
                    (LucideIcons.Upload, UIColorStyle.Primary, "12:01:30  deployed to staging"),
                    (LucideIcons.Info, UIColorStyle.Info, "12:02:02  47 clients reconnected"),
                    (LucideIcons.Warning, UIColorStyle.Warning, "12:04:11  render cache 92% full"),
                    (LucideIcons.Check, UIColorStyle.Success, "12:05:00  nightly tests 421/421"),
                    (LucideIcons.Info, UIColorStyle.Info, "12:06:24  session pool scaled to 8"),
                    (LucideIcons.Check, UIColorStyle.Success, "12:08:47  docs published"),
                    (LucideIcons.Error, UIColorStyle.Danger, "12:09:03  1 flaky screenshot retry"),
                ];

                foreach ((var icon, UIColorStyle style, var message) in events)
                {
                    _ = log.AddChild(new TextComponent()
                        .SetIcon(icon)
                        .SetIconColor(UIThemeColor.FromStyle(style))
                        .SetTitle(message)
                        .SetTitleType(UITextAppearance.Caption)
                    );
                }

                _ = content.AddChild(new ScrollContainerComponent()
                    .SetHorizontalScroll(UIScrollMode.Disabled)
                    .SetVerticalScroll(UIScrollMode.Auto)
                    .SetWidth(UILayoutLength.Absolute(340))
                    .SetHeight(UILayoutLength.Absolute(140))
                    .SetPlacement(1, 1, 24, 1)
                    .AddChild(log)
                );
            },
            static _ => { },
            contentMinHeight: 170
        );
    }
}
