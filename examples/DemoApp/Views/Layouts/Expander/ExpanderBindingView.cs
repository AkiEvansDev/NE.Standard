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

internal sealed class ExpanderBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.expander.binding";

    protected override string ComponentRoute => "/layouts/expander";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.expander.header";
    protected override string HeaderDescription => "demo.layouts.expander.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateContentGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new ExpanderComponent()
            .ConfigureDefaultHeader(h => h.SetTitle("Section title"))
            .SetContent(new TextComponent().SetTitle("Expander content."))
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(ExpanderBindingController.ContentGroup), "Content",
            content => content.AddChild(new ExpanderComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .BindExpanded(nameof(ExpanderContentGroupContext.Expanded), UIBindingScope.Relative)
                .ConfigureDefaultHeader(h => h
                    .SetTitle("Section title")
                    .SetDescription("Supporting description")
                    .BindIcon(nameof(ExpanderContentGroupContext.HeaderIcon), UIBindingScope.Relative)
                    .BindBadgeText(nameof(ExpanderContentGroupContext.HeaderBadge), UIBindingScope.Relative)
                    .BindShowChevron(nameof(ExpanderContentGroupContext.ShowChevron), UIBindingScope.Relative)
                )
                .SetContent(new TextComponent().SetTitle("Expander content."))
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Header icon"] = nameof(ExpanderBindingController.ToggleHeaderIcon),
                ["Header badge"] = nameof(ExpanderBindingController.ToggleHeaderBadge),
                ["Show chevron"] = nameof(ExpanderBindingController.ToggleShowChevron),
                ["Expanded"] = nameof(ExpanderBindingController.ToggleExpanded),
            })
        );
    }
}
