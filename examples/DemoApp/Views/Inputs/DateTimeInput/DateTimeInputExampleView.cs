using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.DateTimeInput;

internal sealed class DateTimeInputExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.date-time-input.example";

    protected override string ComponentRoute => "/inputs/date-time-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.inputs.date-time-input.header";
    protected override string HeaderDescription => "demo.inputs.date-time-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateScheduleGroup())
            .AddChild(CreateFormatGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>Scheduling a deploy: one popup carrying both surfaces, committed as one value.</summary>
    private static ContainerComponent CreateScheduleGroup()
    {
        return DemoUI.CreateGroup(null, "Scheduled deploy",
            content => content.AddChild(CreateStack()
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Runs at")
                    .SetIcon(LucideIcons.Calendar)
                    .SetRange(Moment(2026, 4, 20, 0, 0), Moment(2026, 5, 20, 23, 59))
                    .SetStepMinutes(15)
                    .SetValue(Moment(2026, 4, 24, 22, 30))
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Rollback deadline")
                    .SetRange(Moment(2026, 4, 24, 22, 30), Moment(2026, 4, 25, 6, 0))
                    .SetStepMinutes(30)
                    .SetValue(Moment(2026, 4, 25, 2, 0))
                    .SetBadgeText("on-call")
                    .SetBadgeStyle(UIBadgeType.Warning)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Requested")
                    .SetValue(Moment(2026, 4, 18, 11, 5))
                    .SetIsReadOnly(true)
                )
            ),
            static _ => { },
            contentMinHeight: 460
        );
    }

    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateGroup(null, "Display and culture",
            content => content.AddChild(CreateStack()
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Default")
                    .SetValue(Moment(2026, 4, 24, 22, 30))
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Long form, 12-hour")
                    .SetDisplayFormat("ddd d MMM yyyy, h:mm tt")
                    .SetValue(Moment(2026, 4, 24, 22, 30))
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("German, typed as dd.MM.yyyy HH:mm")
                    .SetCulture("de-DE")
                    .SetFormat("dd.MM.yyyy HH:mm")
                    .SetDisplayFormat("dd. MMMM yyyy, HH:mm")
                    .SetValue(Moment(2026, 4, 24, 22, 30))
                )
            ),
            static _ => { },
            contentMinHeight: 460
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(CreateStack()
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Read-only")
                    .SetValue(Moment(2026, 4, 24, 22, 30))
                    .SetIsReadOnly(true)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Disabled")
                    .SetValue(Moment(2026, 4, 24, 22, 30))
                    .SetEnabled(false)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Required")
                    .Required("A deploy slot is required.")
                )
            ),
            static _ => { },
            contentMinHeight: 460
        );
    }

    /// <summary>
    /// The renderer carries only the wall-clock reading (see <c>DateTimeInputComponentRenderer</c>), so these
    /// are authored with a zero offset — anything else would silently not survive the round trip.
    /// </summary>
    private static DateTimeOffset Moment(int year, int month, int day, int hour, int minute)
        => new(year, month, day, hour, minute, 0, TimeSpan.Zero);

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetPlacement(1, 1, 24, 1);
}
