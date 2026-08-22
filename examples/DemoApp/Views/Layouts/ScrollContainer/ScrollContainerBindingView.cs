using System.Collections.Generic;
using DemoApp.Controllers.Layouts.ScrollContainer;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.ScrollContainer;

internal sealed class ScrollContainerBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.scroll-container.binding";

    protected override string ComponentRoute => "/layouts/scroll-container";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.scroll-container.header";
    protected override string HeaderDescription => "demo.layouts.scroll-container.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateScrollGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new ScrollContainerComponent()
            .BothScroll()
            .SetHeight(UILayoutLength.Absolute(150))
            .AddChild(CreateContentStack())
        );
    }

    private static ContainerComponent CreateScrollGroup()
    {
        return DemoUI.CreateGroup(nameof(ScrollContainerBindingController.ScrollGroup), "Scroll container",
            content => content.AddChild(new ScrollContainerComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHeight(UILayoutLength.Absolute(150))
                .SetHorizontalAlignment(UIAlignment.Center)
                .BindHorizontalScroll(nameof(ScrollContainerGroupContext.HorizontalScroll), UIBindingScope.Relative)
                .BindVerticalScroll(nameof(ScrollContainerGroupContext.VerticalScroll), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateContentStack())
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Horizontal scroll"] = nameof(ScrollContainerBindingController.CycleHorizontalScroll),
                ["Vertical scroll"] = nameof(ScrollContainerBindingController.CycleVerticalScroll),
            })
        );
    }

    private static StackPanelComponent CreateContentStack()
    {
        StackPanelComponent stack = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(8);

        for (var i = 1; i <= 6; i++)
        {
            _ = stack.AddChild(new ContainerComponent()
                .SetBackground(UIThemeColor.Accent)
                .SetMinWidth(UILayoutLength.Absolute(100))
                .SetMinHeight(UILayoutLength.Absolute(200))
            );
        }

        return stack;
    }
}
