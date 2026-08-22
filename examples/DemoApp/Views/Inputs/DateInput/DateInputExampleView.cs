using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.DateInput;

internal sealed class DateInputExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.date-input.example";

    protected override string ComponentRoute => "/inputs/date-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.date-input.header";
    protected override string HeaderDescription => "demo.inputs.date-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateReleaseGroup())
            .AddChild(CreateFormatGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>The ordinary case: a planning window whose two ends constrain each other.</summary>
    private static ContainerComponent CreateReleaseGroup()
    {
        return DemoUI.CreateGroup(null, "Release window",
            content => content.AddChild(CreateStack()
                .AddChild(new DateInputComponent()
                    .SetTitle("Code freeze")
                    .SetIcon(LucideIcons.Calendar)
                    .SetRange(new DateOnly(2026, 4, 1), new DateOnly(2026, 4, 30))
                    .SetValue(new DateOnly(2026, 4, 10))
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Ships on")
                    .SetRange(new DateOnly(2026, 4, 10), new DateOnly(2026, 6, 30))
                    .SetValue(new DateOnly(2026, 4, 24))
                    .SetBadgeText("nova-api")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Milestone opened")
                    .SetValue(new DateOnly(2026, 3, 2))
                    .SetIsReadOnly(true)
                )
            ),
            static _ => { },
            contentMinHeight: 460
        );
    }

    /// <summary>
    /// What owning the picker bought: the field text, the month and weekday names, and the week's first day
    /// all follow <c>DisplayFormat</c>/<c>Culture</c>/<c>FirstDayOfWeek</c> — none of which a native
    /// <c>&lt;input type="date"&gt;</c> exposes at all.
    /// </summary>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateGroup(null, "Display and culture",
            content => content.AddChild(CreateStack()
                .AddChild(new DateInputComponent()
                    .SetTitle("Default")
                    .SetValue(new DateOnly(2026, 4, 24))
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Long form")
                    .SetDisplayFormat("dddd, d MMMM yyyy")
                    .SetValue(new DateOnly(2026, 4, 24))
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Russian, typed as dd.MM.yyyy")
                    .SetCulture("ru-RU")
                    .SetFormat("dd.MM.yyyy")
                    .SetDisplayFormat("d MMMM yyyy")
                    .SetValue(new DateOnly(2026, 4, 24))
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Weeks start on Sunday")
                    .SetFirstDayOfWeek(UIDayOfWeek.Sunday)
                    .SetDisplayFormat("MM/dd/yyyy")
                    .SetValue(new DateOnly(2026, 4, 24))
                )
            ),
            static _ => { },
            contentMinHeight: 540
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(CreateStack()
                .AddChild(new DateInputComponent()
                    .SetTitle("Read-only")
                    .SetValue(new DateOnly(2026, 4, 24))
                    .SetIsReadOnly(true)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Disabled")
                    .SetValue(new DateOnly(2026, 4, 24))
                    .SetEnabled(false)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Required")
                    .Required("A ship date is required.")
                )
            ),
            static _ => { },
            contentMinHeight: 460
        );
    }

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetPlacement(1, 1, 24, 1);
}
