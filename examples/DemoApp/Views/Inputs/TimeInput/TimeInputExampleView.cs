using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.TimeInput;

internal sealed class TimeInputExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.time-input.example";

    protected override string ComponentRoute => "/inputs/time-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.inputs.time-input.header";
    protected override string HeaderDescription => "demo.inputs.time-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateWindowGroup())
            .AddChild(CreateStepGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>A deploy window, where the two ends bound each other the same way a date range does.</summary>
    private static ContainerComponent CreateWindowGroup()
    {
        return DemoUI.CreateGroup(null, "Deploy window",
            content => content.AddChild(CreateStack()
                .AddChild(new TimeInputComponent()
                    .SetTitle("Opens at")
                    .SetIcon(LucideIcons.Clock)
                    .SetRange(new TimeOnly(0, 0), new TimeOnly(23, 59))
                    .SetStepMinutes(30)
                    .SetValue(new TimeOnly(22, 0))
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("Closes at")
                    .SetRange(new TimeOnly(22, 0), new TimeOnly(23, 59))
                    .SetStepMinutes(30)
                    .SetValue(new TimeOnly(23, 30))
                    .SetBadgeText("UTC")
                    .SetBadgeStyle(UIBadgeType.Surface)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("Last run started")
                    .SetValue(new TimeOnly(22, 14))
                    .SetIsReadOnly(true)
                )
            ),
            static _ => { },
            contentMinHeight: 400
        );
    }

    /// <summary>
    /// <c>Step</c> decides both the granularity of each column and which columns exist at all — an hourly
    /// picker has no minutes to offer, and seconds only appear once the step actually reaches them.
    /// </summary>
    private static ContainerComponent CreateStepGroup()
    {
        return DemoUI.CreateGroup(null, "Granularity",
            content => content.AddChild(CreateStack()
                .AddChild(new TimeInputComponent()
                    .SetTitle("Hourly")
                    .SetStepHours(1)
                    .SetValue(new TimeOnly(9, 0))
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("Every 15 minutes")
                    .SetStepMinutes(15)
                    .SetValue(new TimeOnly(9, 45))
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("To the second")
                    .SetStepSeconds(30)
                    .SetValue(new TimeOnly(9, 45, 30))
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("12-hour display")
                    .SetDisplayFormat("h:mm tt")
                    .SetStepMinutes(15)
                    .SetValue(new TimeOnly(14, 30))
                )
            ),
            static _ => { },
            contentMinHeight: 480
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(CreateStack()
                .AddChild(new TimeInputComponent()
                    .SetTitle("Read-only")
                    .SetValue(new TimeOnly(22, 0))
                    .SetIsReadOnly(true)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("Disabled")
                    .SetValue(new TimeOnly(22, 0))
                    .SetEnabled(false)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("Required")
                    .Required("A deploy time is required.")
                )
            ),
            static _ => { },
            contentMinHeight: 400
        );
    }

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetPlacement(1, 1, 24, 1);
}
