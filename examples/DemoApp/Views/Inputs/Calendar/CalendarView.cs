using System;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.Calendar;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Calendar;

/// <summary>
/// One month's calendar and every property that can be bound to it; then the grid a date input opens, drawn in place: a day or a
/// period, a window with the week from Sunday, marked days, and a press that is the command.
/// </summary>
/// <remarks><c>IsRange</c> and <c>FirstDayOfWeek</c> are read once at render and have no rows; the period is a second pane. Read-only
/// (a Days row) keeps the months turning and the day still, disabled (a Standard row) keeps everything still. The chat screen's
/// "go to a day" is a dialog that is nothing but a calendar.</remarks>
internal sealed class CalendarView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string DaysGroup = nameof(CalendarController.DaysGroup);
    private const string ContentGroup = nameof(CalendarController.ContentGroup);
    private const string PickGroup = nameof(CalendarController.PickGroup);
    private static readonly DateOnly Release = new(2026, 8, 12);
    private static readonly DateOnly QuarterStart = new(2026, 7, 1);
    private static readonly DateOnly QuarterEnd = new(2026, 9, 30);

    /// <summary>The paydays of August: a marked day of the kind an application offers.</summary>
    private static readonly DateOnly[] Paydays = [new(2026, 8, 3), new(2026, 8, 12), new(2026, 8, 17), new(2026, 8, 31)];

    public static string ViewKey => "demo.inputs.calendar";

    protected override string ComponentRoute => "/inputs/calendar";
    protected override string Header => "demo.inputs.calendar.header";
    protected override string HeaderDescription => "demo.inputs.calendar.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(720,
            ("One day", frame => frame.AddChild(Bind(new CalendarComponent()))),
            ("A period: Value is the start, EndValue the end", frame => frame.AddChild(Bind(new CalendarComponent()).SetIsRange()))
        );

    /// <summary>The same rows on both panes: <c>IsRange</c> is authoring-only, so the period is a second instance.</summary>
    private static CalendarComponent Bind(CalendarComponent calendar)
        => calendar
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{DaysGroup}.{nameof(CalendarDaysGroupContext.Value)}")
            .BindEndValue($"{DaysGroup}.{nameof(CalendarDaysGroupContext.EndValue)}")
            .BindMin($"{DaysGroup}.{nameof(CalendarDaysGroupContext.Min)}")
            .BindMax($"{DaysGroup}.{nameof(CalendarDaysGroupContext.Max)}")
            .BindMarkedDays($"{DaysGroup}.{nameof(CalendarDaysGroupContext.MarkedDays)}")
            .BindMarkedDaysOnly($"{DaysGroup}.{nameof(CalendarDaysGroupContext.MarkedDaysOnly)}")
            .BindIsReadOnly($"{DaysGroup}.{nameof(CalendarDaysGroupContext.IsReadOnly)}")
            .BindIcon($"{ContentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{ContentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{ContentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{ContentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{ContentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{ContentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{ContentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ContentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(DaysGroup, "Days", nameof(CalendarController.CycleDaysOption), note: "Turning MarkedDaysOnly on, or moving a bound, moves the day and the period's end onto a day still on offer."),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(CalendarController.CycleContentOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // The two single calendars down one half, beside the two marked ones as tall as they are: paired, the command stood alone.
        => [CreatePeriodGroup(), DemoUI.CreateHalf(CreateBoundsGroup(), CreateChangeGroup()), CreateMarkedGroup()];

    /// <summary>One day, and a period chosen with two presses on one grid.</summary>
    private static ContainerComponent CreatePeriodGroup()
    {
        return DemoUI.CreateExample("A day, and a period",
            UILayout.Row(32)
                .AddChild(DemoUI.CreateLabelled("One day", new CalendarComponent()
                    .SetTitle("Release date")
                    .SetValue(Release)
                    )
                )
                .AddChild(DemoUI.CreateLabelled("A period: the first press is its start, the second its end", new CalendarComponent()
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
                .AddChild(DemoUI.CreateLabelled("Marked: a dot under the paydays, every day still on offer", new CalendarComponent()
                    .SetMarkedDays(Paydays)
                    .SetValue(new DateOnly(2026, 8, 20))
                    )
                )
                .AddChild(DemoUI.CreateLabelled("Only the marked days on offer", new CalendarComponent()
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
                .OnChange(nameof(CalendarController.Picked)),
            note: "`OnChange` runs on every press on a day, the day already on the bound value; the line under the calendar is the command's.",
            context: PickGroup
        );
    }
}
