using System.Collections.Generic;
using DemoApp.Controllers.Layouts.Flyout;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.Flyout;

internal sealed class FlyoutTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.flyout.test";

    protected override string ComponentRoute => "/layouts/flyout";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.flyout.header";
    protected override string HeaderDescription => "demo.layouts.flyout.description";

    protected override void DrawContent(WrapPanelComponent container) => container.AddChild(CreateInteractionGroup());

    private static ContainerComponent CreateInteractionGroup()
    {
        ContainerComponent group = DemoUI.CreateGroup(nameof(FlyoutTestController.InteractionGroup), "Interaction",
            content => content
                .AddChild(new FlyoutComponent()
                    .BindIsOpen(nameof(FlyoutInteractionGroupContext.IsOpen), UIBindingScope.Relative)
                    .OnClose(nameof(FlyoutTestController.RecordClose))
                    .SetPlacement(1, 1, 24, 1)
                    .SetAnchor(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .ConfigureDefaultContent(c => c.SetTitle("Toggle"))
                    )
                    .SetContent(new ContainerComponent()
                        .AddRow(UIGridUnit.Star())
                        .AddChild(new TextComponent()
                            .SetTitle("Flyout content")
                            .SetDescription("Closing (anchor click, Escape or backdrop) reports back through OnClose.")
                            .SetPlacement(1, 1, 24, 1)
                        )
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetHorizontalAlignment(UIAlignment.End)
                            .OnClick(nameof(FlyoutTestController.RecordClose))
                            .ConfigureDefaultContent(c => c.SetTitle("Close"))
                            .SetPlacement(1, 2, 24, 1)
                        )
                    )
                ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Open"] = nameof(FlyoutTestController.Open),
            })
        );

        return group;
    }
}
