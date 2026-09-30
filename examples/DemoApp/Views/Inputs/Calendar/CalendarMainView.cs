using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.Calendar;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Calendar;

/// <summary>
/// One calendar drawn in place, and every property that can be bound to it.
/// </summary>
/// <remarks><c>IsRange</c> and <c>FirstDayOfWeek</c> are read once at render and have no rows; the period is a second pane.</remarks>
internal sealed class CalendarMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string DaysGroup = nameof(CalendarMainController.DaysGroup);
    private const string ContentGroup = nameof(CalendarMainController.ContentGroup);

    public static string ViewKey => "demo.inputs.calendar.main";

    protected override string ComponentRoute => "/inputs/calendar";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.calendar.header";
    protected override string HeaderDescription => "demo.inputs.calendar.description";

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
            DemoUI.CreateOptionSection(DaysGroup, "Days", nameof(CalendarMainController.CycleDaysOption), note: "Turning MarkedDaysOnly on, or moving a bound, moves the day and the period's end onto a day still on offer."),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(CalendarMainController.CycleContentOption))
        );
}
