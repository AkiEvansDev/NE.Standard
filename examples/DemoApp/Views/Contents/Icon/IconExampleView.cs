using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Icon;

internal sealed class IconExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.icon.example";

    protected override string ComponentRoute => "/contents/icon";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.icon.header";
    protected override string HeaderDescription => "demo.contents.icon.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateStatusGroup())
            .AddChild(CreateSizeReferenceGroup());
    }

    private static ContainerComponent CreateStatusGroup()
    {
        return DemoUI.CreateGroup(null, "Status colors in context",
            content =>
            {
                StackPanelComponent list = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetWidth(UILayoutLength.Absolute(320))
                    .SetPlacement(1, 1, 24, 1);

                (string Icon, UIColorStyle Style, string Label)[] rows =
                [
                    (LucideIcons.Check, UIColorStyle.Success, "All 421 tests passing"),
                    (LucideIcons.Warning, UIColorStyle.Warning, "Render cache almost full"),
                    (LucideIcons.Error, UIColorStyle.Danger, "1 deploy failed on staging"),
                    (LucideIcons.Info, UIColorStyle.Info, "3 clients on an older build"),
                    (LucideIcons.Lock, UIColorStyle.Primary, "Two-factor auth enabled"),
                ];

                foreach ((var icon, UIColorStyle style, var label) in rows)
                {
                    _ = list.AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetSpacing(10)
                        .AddChild(new IconComponent()
                            .SetIcon(icon)
                            .SetSize(UIIconSize.Medium)
                            .SetColor(UIThemeColor.FromStyle(style))
                        )
                        .AddChild(new TextComponent().SetTitle(label).SetTitleType(UITextAppearance.Body))
                    );
                }

                _ = content.AddChild(list);
            },
            static _ => { },
            contentMinHeight: 200
        );
    }

    private static ContainerComponent CreateSizeReferenceGroup()
    {
        return DemoUI.CreateGroup(null, "Size reference",
            content =>
            {
                StackPanelComponent row = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(20)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetPlacement(1, 1, 24, 1);

                foreach (UIIconSize size in Enum.GetValues<UIIconSize>())
                {
                    _ = row.AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetHorizontalAlignment(UIAlignment.Center)
                        .SetSpacing(4)
                        .AddChild(new IconComponent()
                            .SetIcon(LucideIcons.Bell)
                            .SetSize(size)
                            .SetHorizontalAlignment(UIAlignment.Center)
                        )
                        .AddChild(new TextComponent()
                            .SetTitle(size.ToString())
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                        )
                    );
                }

                _ = content.AddChild(row);
            },
            static _ => { },
            contentMinHeight: 100
        );
    }
}
