using System.Collections.Generic;
using DemoApp.Controllers.Layouts.ScrollContainer;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.ScrollContainer;

/// <summary>
/// Covers what only a running browser proves about scrolling: that a command can move a container rather than
/// bring a component into view, and that an end-anchored container follows new content while the viewer is at
/// the end and lets go the moment they scroll up. Neither is visible to a green build.
/// </summary>
internal sealed class ScrollContainerTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.scroll-container.test";

    protected override string ComponentRoute => "/layouts/scroll-container";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.scroll-container.header";
    protected override string HeaderDescription => "demo.layouts.scroll-container.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateCommandGroup())
            .AddChild(CreateAnchorGroup());
    }

    private static ContainerComponent CreateCommandGroup()
    {
        return DemoUI.CreateGroup(nameof(ScrollContainerTestController.CommandGroup), "Scroll a container",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .AddChild(new ScrollContainerComponent(ScrollContainerTestController.ScrollTargetId)
                    .VerticalScrollOnly()
                    .SetHeight(UILayoutLength.Absolute(220))
                    .SetBorderColor(UIThemeColor.Border)
                    .SetBorderThickness(UIThickness.Uniform(1))
                    .AddChild(CreateRows(40))
                )
                // No command behind it: the click runs the effect on the client, so the container moves with
                // nothing sent to the server. The log above stays on whatever the last command wrote.
                .AddChild(new ButtonComponent()
                    .InteractOn(EventNames.Click, new ScrollEffect(ScrollContainerTestController.ScrollTargetId, ScrollPosition.Start) { Behavior = ScrollToBehavior.Auto })
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .ConfigureDefaultContent(c => _ = c.SetTitle("Back to top (no round trip)"))
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Top"] = nameof(ScrollContainerTestController.ScrollToStart),
                ["Bottom"] = nameof(ScrollContainerTestController.ScrollToEnd),
                ["Page back"] = nameof(ScrollContainerTestController.ScrollPageBack),
                ["Page forward"] = nameof(ScrollContainerTestController.ScrollPageForward),
                ["Offset 400"] = nameof(ScrollContainerTestController.ScrollToOffset),
            }),
            contentMinHeight: 300
        );
    }

    private static ContainerComponent CreateAnchorGroup()
    {
        return DemoUI.CreateGroup(nameof(ScrollContainerTestController.AnchorGroup), "Follow new content",
            content => content.AddChild(new ScrollContainerComponent()
                .VerticalScrollOnly()
                .AnchorToEnd()
                .SetHeight(UILayoutLength.Absolute(220))
                .SetBorderColor(UIThemeColor.Border)
                .SetBorderThickness(UIThickness.Uniform(1))
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(ScrollAnchorGroupContext.Messages), UIBindingScope.Relative)
                    .SetSpacing(4)
                    .SetItemTemplate(new TextComponent()
                        .BindTitle(nameof(DemoScrollMessage.Text), UIBindingScope.Relative)
                        .SetMargin(UIThickness.All(8, 4, 8, 4))
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Append message"] = nameof(ScrollContainerTestController.AppendMessage),
            }),
            contentMinHeight: 260
        );
    }

    private static StackPanelComponent CreateRows(int count)
    {
        StackPanelComponent stack = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(4);

        for (var i = 1; i <= count; i++)
        {
            _ = stack.AddChild(new TextComponent()
                .SetTitle($"Row {i}")
                .SetMargin(UIThickness.All(8, 4, 8, 4))
            );
        }

        return stack;
    }
}
