using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Actions.Action;

internal sealed class ActionExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.action.example";

    protected override string ComponentRoute => "/actions/action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.actions.action.header";
    protected override string HeaderDescription => "demo.actions.action.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateSettingsGroup())
            .AddChild(CreateTrailingValueGroup())
            .AddChild(CreateVariantGroup());
    }

    /// <summary>
    /// The shape the component exists for: a column of destinations, each one control, not a list component.
    /// </summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateGroup(null, "Settings list",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new ActionComponent()
                    .SetAction("Display", "Monitors, brightness, night light", LucideIcons.Monitor)
                )
                .AddChild(new ActionComponent()
                    .SetAction("Notifications", "Alerts from apps and system, do not disturb", LucideIcons.Bell)
                )
                .AddChild(new ActionComponent()
                    .SetAction("Storage", "Storage space, drives, configuration rules", LucideIcons.Database)
                )
            ),
            static _ => { },
            contentMinHeight: 180
        );
    }

    /// <summary>
    /// The trailing text carries the current value, so a row reads as a setting rather than as a link.
    /// </summary>
    private static ContainerComponent CreateTrailingValueGroup()
    {
        return DemoUI.CreateGroup(null, "Trailing value",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new ActionComponent()
                    .SetAction("Language", icon: LucideIcons.Languages)
                    .SetTrailingText("English (UK)")
                )
                .AddChild(new ActionComponent()
                    .SetAction("Theme", icon: LucideIcons.Palette)
                    .SetTrailingText("Dark")
                )
                .AddChild(new ActionComponent()
                    .SetAction("Time zone", icon: LucideIcons.Clock)
                    .SetTrailingText("UTC+2")
                )
            ),
            static _ => { },
            contentMinHeight: 180
        );
    }

    private static ContainerComponent CreateVariantGroup()
    {
        return DemoUI.CreateGroup(null, "Variants",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new ActionComponent()
                    .SetAction("Open in a new tab", "The chevron is replaced by any icon", LucideIcons.ExternalLink)
                    .SetTrailingIcon(LucideIcons.ExternalLink)
                )
                .AddChild(new ActionComponent()
                    .SetType(UIButtonType.Danger)
                    .SetAction("Delete workspace", "A row can still carry a type", LucideIcons.Delete)
                )
                .AddChild(new ActionComponent()
                    .SetEnabled(false)
                    .SetAction("Managed by your organization", "Disabled", LucideIcons.Lock)
                )
            ),
            static _ => { },
            contentMinHeight: 180
        );
    }
}
