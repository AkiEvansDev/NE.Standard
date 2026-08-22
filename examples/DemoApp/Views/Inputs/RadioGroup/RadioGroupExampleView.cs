using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.RadioGroup;

internal sealed class RadioGroupExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.radio-group.example";

    protected override string ComponentRoute => "/inputs/radio-group";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.radio-group.header";
    protected override string HeaderDescription => "demo.inputs.radio-group.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateStrategyGroup())
            .AddChild(CreateOrientationGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>
    /// Each option renders its full item template — icon, title and description — which is what a radio
    /// group is for when the choice needs explaining rather than just naming.
    /// </summary>
    private static ContainerComponent CreateStrategyGroup()
    {
        return DemoUI.CreateGroup(null, "Deploy strategy",
            content => content.AddChild(new RadioGroupComponent()
                .SetValue("rolling")
                .SetOptions(CreateStrategies())
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 220
        );
    }

    private static ContainerComponent CreateOrientationGroup()
    {
        return DemoUI.CreateGroup(null, "Horizontal",
            content => content.AddChild(new RadioGroupComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetValue("eu")
                .SetOptions(
                [
                    new OptionItem { Id = "us", Title = "us-east-1" },
                    new OptionItem { Id = "eu", Title = "eu-west-1" },
                    new OptionItem { Id = "ap", Title = "ap-south-1" },
                ])
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(20)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Read-only")
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetIsReadOnly(true)
                    .SetValue("eu")
                    .SetOptions(
                    [
                        new OptionItem { Id = "us", Title = "us-east-1" },
                        new OptionItem { Id = "eu", Title = "eu-west-1 (read-only)" },
                    ])
                )
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Required")
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetOptions(
                    [
                        new OptionItem { Id = "yes", Title = "Yes" },
                        new OptionItem { Id = "no", Title = "No" },
                    ])
                    .Required("Pick one to continue.")
                )
            ),
            static _ => { },
            contentMinHeight: 200
        );
    }

    private static OptionItem[] CreateStrategies()
        =>
        [
            new OptionItem { Id = "rolling", Title = "Rolling", Description = "Replace instances in batches", Icon = LucideIcons.History },
            new OptionItem { Id = "blue-green", Title = "Blue / green", Description = "Switch traffic once the new set is healthy", Icon = LucideIcons.Upload },
            new OptionItem { Id = "recreate", Title = "Recreate", Description = "Stop everything, then start the new version", Icon = LucideIcons.Wrench },
        ];
}
