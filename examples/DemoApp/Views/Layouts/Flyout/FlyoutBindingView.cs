using DemoApp.Controllers.Layouts.Flyout;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.Flyout;

internal sealed class FlyoutBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.flyout.binding";

    protected override string ComponentRoute => "/layouts/flyout";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.flyout.header";
    protected override string HeaderDescription => "demo.layouts.flyout.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateFlyoutGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new FlyoutComponent()
            .SetAnchor(new ButtonComponent().SetType(UIButtonType.Outline).ConfigureDefaultContent(c => c.SetTitle("Open")))
            .SetContent(new TextComponent().SetTitle("Flyout content."))
        );
    }

    private static ContainerComponent CreateFlyoutGroup()
    {
        ContainerComponent group = DemoUI.CreateGroup(nameof(FlyoutBindingController.FlyoutGroup), "Flyout",
            content => content
                .AddChild(new FlyoutComponent()
                    .BindIsOpen(nameof(FlyoutGroupContext.IsOpen), UIBindingScope.Relative)
                    .SetPlacement(1, 1, 24, 1)
                    .SetAnchor(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .ConfigureDefaultContent(c => c.SetTitle("Toggle"))
                    )
                    .SetContent(new TextComponent()
                        .SetTitle("Flyout content")
                        .SetDescription("Bound to the same IsOpen property as the toggle button.")
                    )
                ),
            static _ => { }
        );

        return group;
    }
}
