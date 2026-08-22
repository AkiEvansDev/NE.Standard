using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Indicators.Progress;

internal sealed class ProgressExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.indicators.progress.example";

    protected override string ComponentRoute => "/indicators/progress";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.indicators.progress.header";
    protected override string HeaderDescription => "demo.indicators.progress.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateSystemMonitorGroup())
            .AddChild(CreateDownloadGroup())
            .AddChild(CreateCircularGroup());
    }

    private static ContainerComponent CreateSystemMonitorGroup()
    {
        return DemoUI.CreateGroup(null, "System monitor",
            content =>
            {
                StackPanelComponent stack = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(14)
                    .SetWidth(UILayoutLength.Absolute(300))
                    .SetPlacement(1, 1, 24, 1);

                (string Label, int Value, UIColorStyle Style)[] metrics =
                [
                    ("CPU", 34, UIColorStyle.Primary),
                    ("Memory", 61, UIColorStyle.Accent),
                    ("Disk", 82, UIColorStyle.Warning),
                    ("Render cache", 96, UIColorStyle.Danger),
                ];

                foreach ((var label, var value, UIColorStyle style) in metrics)
                {
                    _ = stack.AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetSpacing(4)
                        .AddChild(new TextComponent()
                            .SetTitle(label)
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ProgressComponent()
                            .SetValue(value)
                            .SetShowValue(true)
                            .SetColor(UIThemeColor.FromStyle(style))
                        )
                    );
                }

                _ = content.AddChild(stack);
            },
            static _ => { },
            contentMinHeight: 240
        );
    }

    private static ContainerComponent CreateDownloadGroup()
    {
        return DemoUI.CreateGroup(null, "Download row",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(6)
                .SetWidth(UILayoutLength.Absolute(300))
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextComponent()
                    .SetIcon(LucideIcons.Download)
                    .SetTitle("ne-standard-2.4.108.zip")
                    .SetTitleType(UITextAppearance.Body)
                    .SetDescription("18.4 of 42.1 MB · 3.1 MB/s")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(new ProgressComponent().SetValue(44))
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }

    private static ContainerComponent CreateCircularGroup()
    {
        return DemoUI.CreateGroup(null, "Circular",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetSpacing(32)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateRing("Sprint", 65, UIColorStyle.Primary))
                .AddChild(CreateRing("Coverage", 88, UIColorStyle.Success))
                .AddChild(CreateRing("Quota", 97, UIColorStyle.Danger))
            ),
            static _ => { },
            contentMinHeight: 140
        );
    }

    private static StackPanelComponent CreateRing(string label, int value, UIColorStyle style)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetHorizontalAlignment(UIAlignment.Center)
            .SetSpacing(6)
            .AddChild(new ProgressComponent()
                .SetVariant(UIProgressVariant.Circular)
                .SetValue(value)
                .SetShowValue(true)
                .SetColor(UIThemeColor.FromStyle(style))
                .SetWidth(UILayoutLength.Absolute(72))
                .SetHeight(UILayoutLength.Absolute(72))
                .SetHorizontalAlignment(UIAlignment.Center)
            )
            .AddChild(new TextComponent()
                .SetTitle(label)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.Muted)
                .SetHorizontalAlignment(UIAlignment.Center)
            );
}
