using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Switch;

/// <summary>
/// A switch is a <c>CheckboxComponent</c> with a different skin — same properties, same renderer body
/// (<c>CheckboxComponentRenderer.RenderCheckable</c>), so the pages here deliberately mirror the checkbox
/// ones rather than inventing a separate vocabulary for it.
/// </summary>
internal sealed class SwitchExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.switch.example";

    protected override string ComponentRoute => "/inputs/switch";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.inputs.switch.header";
    protected override string HeaderDescription => "demo.inputs.switch.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateNotificationsGroup())
            .AddChild(CreateContentGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>The switch's natural home: settings that take effect as soon as they are flipped.</summary>
    private static ContainerComponent CreateNotificationsGroup()
    {
        return DemoUI.CreateGroup(null, "Notifications",
            content => content.AddChild(CreateStack()
                .AddChild(Toggle("Build failures", value: true))
                .AddChild(Toggle("Deploy finished", value: true))
                .AddChild(Toggle("New member joined", value: false))
                .AddChild(Toggle("Weekly digest", value: false))
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(null, "Labelled toggles",
            content => content.AddChild(CreateStack()
                .AddChild(new SwitchComponent()
                    .SetTitle("Auto-deploy on merge")
                    .SetIcon(LucideIcons.Upload)
                    .SetValue(true)
                )
                .AddChild(new SwitchComponent()
                    .SetTitle("Maintenance mode")
                    .SetIcon(LucideIcons.Wrench)
                    .SetBadgeText("affects users")
                    .SetBadgeStyle(UIBadgeType.Warning)
                )
                .AddChild(new SwitchComponent()
                    .SetTitle("Verbose build log")
                    .SetIcon(LucideIcons.History)
                    .SetBadgeText("beta")
                    .SetBadgeStyle(UIBadgeType.Accent)
                )
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(CreateStack()
                .AddChild(Toggle("Off", value: false))
                .AddChild(Toggle("On", value: true))
                .AddChild(Toggle("Read-only", value: true).SetIsReadOnly(true))
                .AddChild(Toggle("Disabled", value: false).SetEnabled(false))
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(10)
            .SetPlacement(1, 1, 24, 1);

    private static SwitchComponent Toggle(string title, bool value)
        => new SwitchComponent()
            .SetTitle(title)
            .SetValue(value);
}
