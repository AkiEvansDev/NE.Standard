using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.Flyout;

internal sealed class FlyoutExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.flyout.example";

    protected override string ComponentRoute => "/layouts/flyout";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.flyout.header";
    protected override string HeaderDescription => "demo.layouts.flyout.description";

    protected override void DrawContent(WrapPanelComponent container) => container.AddChild(CreatePlacementGroup());

    private static ContainerComponent CreatePlacementGroup()
    {

        // No Overflow.Show workaround on the ancestors: the flyout is placed by anchored-popup.ts and
        // escapes the panels' clipping on its own, so the page is correct with the default containers.
        ContainerComponent group = DemoUI.CreateGroup(null, "Every placement (client-side only)",
            content => content
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(24)
                    .SetHorizontalAlignment(UIAlignment.Center)
                    .SetMargin(UIThickness.All(64, 24, 0, 0))
                    .SetPlacement(1, 1, 24, 1)
                    .AddChild(CreatePlacementRow("Top", UIFlyoutPlacement.TopStart, UIFlyoutPlacement.Top, UIFlyoutPlacement.TopEnd))
                    .AddChild(CreatePlacementRow("Bottom", UIFlyoutPlacement.BottomStart, UIFlyoutPlacement.Bottom, UIFlyoutPlacement.BottomEnd))
                    .AddChild(CreatePlacementRow("Left", UIFlyoutPlacement.LeftStart, UIFlyoutPlacement.Left, UIFlyoutPlacement.LeftEnd))
                    .AddChild(CreatePlacementRow("Right", UIFlyoutPlacement.RightStart, UIFlyoutPlacement.Right, UIFlyoutPlacement.RightEnd))
                ),
            static _ => { }
        );

        return group;
    }

    private static StackPanelComponent CreatePlacementRow(string side, UIFlyoutPlacement start, UIFlyoutPlacement mid, UIFlyoutPlacement end)
    {
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(24)
            .SetHorizontalAlignment(UIAlignment.Center)
            .AddChild(CreatePlacementFlyout($"{side} start", start))
            .AddChild(CreatePlacementFlyout(side, mid))
            .AddChild(CreatePlacementFlyout($"{side} end", end));
    }

    private static FlyoutComponent CreatePlacementFlyout(string label, UIFlyoutPlacement placement)
    {
        return new FlyoutComponent()
            .SetFlyoutPlacement(placement)
            .SetAnchor(new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .ConfigureDefaultContent(c => c.SetTitle(label))
            )
            .SetContent(new TextComponent()
                .SetTitle(label)
                .SetDescription("Opens and closes purely client-side.")
            );
    }
}
