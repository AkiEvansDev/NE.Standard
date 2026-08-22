using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Badge;

internal sealed class BadgeExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.badge.example";

    protected override string ComponentRoute => "/contents/badge";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.badge.header";
    protected override string HeaderDescription => "demo.contents.badge.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateOrderStatusGroup())
            .AddChild(CreateStyleReferenceGroup());
    }

    private static ContainerComponent CreateOrderStatusGroup()
    {
        return DemoUI.CreateGroup(null, "Statuses in context",
            content =>
            {
                StackPanelComponent list = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(10)
                    .SetWidth(UILayoutLength.Absolute(340))
                    .SetPlacement(1, 1, 24, 1);

                (string Order, string Detail, string Status, UIBadgeType Style)[] orders =
                [
                    ("Build 2.4.108", "main · 4 min", "Passing", UIBadgeType.Success),
                    ("Build 2.4.107", "release/2.4 · 18 min", "Queued", UIBadgeType.Surface),
                    ("Build 2.4.106", "main · 1 h", "Flaky", UIBadgeType.Warning),
                    ("Build 2.4.105", "feature/theme · 2 h", "Failed", UIBadgeType.Danger),
                ];

                foreach ((var order, var detail, var status, UIBadgeType style) in orders)
                {
                    _ = list.AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetSpacing(8)
                        .AddChild(new TextComponent()
                            .SetTitle(order)
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription(detail)
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetHorizontalAlignment(UIAlignment.Stretch)
                        )
                        .AddChild(new BadgeComponent().SetStyle(style).SetText(status))
                    );
                }

                _ = content.AddChild(list);
            },
            static _ => { },
            contentMinHeight: 200
        );
    }

    private static ContainerComponent CreateStyleReferenceGroup()
    {
        return DemoUI.CreateGroup(null, "Style reference",
            content =>
            {
                StackPanelComponent row = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetSpacing(12)
                    .SetWrap(true);

                foreach (UIBadgeType style in Enum.GetValues<UIBadgeType>())
                    _ = row.AddChild(new BadgeComponent().SetStyle(style).SetText(style.ToString()));

                _ = content.AddChild(row.SetPlacement(1, 1, 24, 1));
            },
            static _ => { },
            contentMinHeight: 80
        );
    }
}
