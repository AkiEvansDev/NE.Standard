using System;
using System.Collections.Generic;
using DemoApp.Controllers.Inputs.Calendar;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Calendar;

/// <summary>
/// The month grid a date input opens, drawn in place: a day or a period, a window with the week from Sunday, marked days, a press that
/// is the command, and a dialog that is nothing but a calendar.
/// </summary>
internal sealed class CalendarExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string PickGroup = nameof(CalendarExamplesController.PickGroup);
    private const string DayGroup = nameof(CalendarExamplesController.DayGroup);

    private static readonly DateOnly Release = new(2026, 8, 12);
    private static readonly DateOnly QuarterStart = new(2026, 7, 1);
    private static readonly DateOnly QuarterEnd = new(2026, 9, 30);

    /// <summary>The paydays of August: a marked day of the kind an application offers.</summary>
    private static readonly DateOnly[] Paydays = [new(2026, 8, 3), new(2026, 8, 12), new(2026, 8, 17), new(2026, 8, 31)];

    public static string ViewKey => "demo.inputs.calendar.examples";

    protected override string ComponentRoute => "/inputs/calendar";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.calendar.header";
    protected override string HeaderDescription => "demo.inputs.calendar.description";

    /// <summary>
    /// "Go to a day": the dialog is the calendar, its days from the conversation's first message to today, the days with messages the
    /// only ones on offer, and a press on one the whole of it.
    /// </summary>
    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => [
            new UIDialog
            {
                Key = CalendarExamplesController.DayKey,
                Label = "Go to a day",
                // A dialog is a sample as a whole, its copy shown as written: content for the unkeyed report.
                Content = UILayout.Stack(12)
                    .AsContentTree()
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Go to a day")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("The days with messages are marked; a press on one goes there.")
                    )
                    .AddChild(new CalendarComponent()
                        .BindValue($"{DayGroup}.{nameof(CalendarDayGroupContext.JumpDay)}")
                        .BindMin($"{DayGroup}.{nameof(CalendarDayGroupContext.FirstDay)}")
                        .BindMax($"{DayGroup}.{nameof(CalendarDayGroupContext.LastDay)}")
                        .BindMarkedDays($"{DayGroup}.{nameof(CalendarDayGroupContext.MessageDays)}")
                        .SetMarkedDaysOnly()
                        .OnChange(nameof(CalendarExamplesController.GoToDay))
                    )
            }
        ];

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(CreatePeriodGroup());

        _ = container.AddChildren(DemoUI.CreateColumns([CreateBoundsGroup(), CreateChangeGroup()], [CreateMarkedGroup(), CreateDialogGroup()]));

        _ = container.AddChild(CreateStatesGroup());
    }

    /// <summary>One day, and a period chosen with two presses on one grid.</summary>
    private static ContainerComponent CreatePeriodGroup()
    {
        return DemoUI.CreateExample("A day, and a period",
            UILayout.Row(32)
                .AddChild(UIPage.Labelled("One day", new CalendarComponent()
                    .SetTitle("Release date")
                    .SetValue(Release)
                    )
                )
                .AddChild(UIPage.Labelled("A period: the first press is its start, the second its end", new CalendarComponent()
                    .SetTitle("Freeze")
                    .SetIsRange()
                    .SetValue(Release.AddDays(-5))
                    .SetEndValue(Release)
                    )
                ),
            columns: 24,
            note: "The grid the date input opens in its popup, placed in the page: arrows move the day, PageUp and PageDown the month, Enter or Space choose it. A period's third press starts a new one."
        );
    }

    /// <summary>A window of one quarter, and the week drawn from Sunday.</summary>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateExample("One quarter, weeks from Sunday",
            new CalendarComponent()
                .SetTitle("Inside the third quarter")
                .SetFirstDayOfWeek(UIDayOfWeek.Sunday)
                .SetRange(QuarterStart, QuarterEnd)
                .SetValue(Release),
            note: "`SetRange(Min, Max)`: the days outside are drawn disabled, the month arrows stop at the bounds, and a day sent from outside them is refused by the server. `FirstDayOfWeek` is read once at render."
        );
    }

    /// <summary>Marked days as a hint, and as the only days on offer.</summary>
    private static ContainerComponent CreateMarkedGroup()
    {
        return DemoUI.CreateExample("Marked days",
            UILayout.Stack(16)
                .AddChild(UIPage.Labelled("Marked: a dot under the paydays, every day still on offer", new CalendarComponent()
                    .SetMarkedDays(Paydays)
                    .SetValue(new DateOnly(2026, 8, 20))
                    )
                )
                .AddChild(UIPage.Labelled("Only the marked days on offer", new CalendarComponent()
                    .SetMarkedDays(Paydays)
                    .SetMarkedDaysOnly()
                    .SetValue(Release)
                    )
                ),
            note: "With `MarkedDaysOnly` every other day is disabled, the arrows skip them, and the server refuses one sent anyway."
        );
    }

    /// <summary>A press on a day raises the change event, so <c>OnChange</c> is what the day does.</summary>
    private static ContainerComponent CreateChangeGroup()
    {
        return DemoUI.CreateExample("A press is the command",
            new CalendarComponent()
                .SetTitle("Show the deploys of")
                .BindValue(nameof(CalendarPickGroupContext.Day), UIBindingScope.Relative)
                .OnChange(nameof(CalendarExamplesController.Picked)),
            note: "`OnChange` runs on every press on a day, the day already on the bound value; the line above the calendar is the command's.",
            context: PickGroup
        );
    }

    /// <summary>The issue's case: a press opens a dialog that is a calendar, and a day's press goes there.</summary>
    private static ContainerComponent CreateDialogGroup()
    {
        return DemoUI.CreateExample("A dialog that is a calendar",
            new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetIcon(DemoIcons.Outline(DemoIcons.Calendar))
                .SetTitle("Go to a day")
                .OnClick(nameof(CalendarExamplesController.OpenDayPicker)),
            note: "The feed's day mark opens it: the days from the first message to today, the ones with messages the only days on offer. One press on a day runs the command, which goes there and closes the dialog — no field, no Done, no Go.",
            context: DayGroup
        );
    }

    /// <summary>Read-only keeps the months turning and the days still; disabled keeps everything still.</summary>
    private static ContainerComponent CreateStatesGroup()
    {
        return DemoUI.CreateExample("Read-only and disabled",
            UILayout.Row(32)
                .AddChild(UIPage.Labelled("Read-only: the months turn, the day stays", new CalendarComponent()
                    .SetTitle("Release date")
                    .SetValue(Release)
                    .SetIsReadOnly(true)
                    )
                )
                .AddChild(UIPage.Labelled("Disabled", new CalendarComponent()
                    .SetTitle("Release date")
                    .SetValue(Release)
                    .SetEnabled(false)
                    )
                ),
            columns: 24
        );
    }
}
