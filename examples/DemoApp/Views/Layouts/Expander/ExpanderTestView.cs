using System.Collections.Generic;
using DemoApp.Controllers.Layouts.Expander;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.Expander;

internal sealed class ExpanderTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.expander.test";

    protected override string ComponentRoute => "/layouts/expander";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.expander.header";
    protected override string HeaderDescription => "demo.layouts.expander.description";

    protected override void DrawContent(WrapPanelComponent container)
        => container.AddChild(CreateInteractionGroup());

    private static ContainerComponent CreateInteractionGroup()
    {
        return DemoUI.CreateGroup(nameof(ExpanderTestController.InteractionGroup), "Interaction",
            content => content.AddChild(new ExpanderComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .BindExpanded(nameof(ExpanderInteractionGroupContext.Expanded), UIBindingScope.Relative)
                .OnToggle(nameof(ExpanderTestController.RecordToggle))
                .ConfigureDefaultHeader(h => h.SetTitle("Toggle me"))
                .SetContent(new TextComponent().SetDescription("Every open/close is tracked server-side."))
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Expanded"] = nameof(ExpanderTestController.ToggleExpanded),
            })
        );
    }
}
