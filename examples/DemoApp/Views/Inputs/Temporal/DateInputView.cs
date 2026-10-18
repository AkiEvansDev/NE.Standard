using System;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.Temporal;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Temporal;

/// <summary>
/// One date field and every property that can be bound to it; then how a date is written down, which dates may be chosen, which day
/// the week starts on, and the language the family writes in.
/// </summary>
/// <remarks>
/// <c>Format</c>, <c>Culture</c>, <c>FormatMessage</c>, <c>Step</c> and <c>FirstDayOfWeek</c> are unbindable and have no rows. The
/// language group speaks for the time and the date-time fields too; a bound the server holds is on the Values page.
/// </remarks>
internal sealed class DateInputView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(DateInputController.ValueGroup);
    private const string FieldGroup = nameof(DateInputController.FieldGroup);
    private const string ContentGroup = nameof(DateInputController.ContentGroup);
    private const string BadgeGroup = nameof(DateInputController.BadgeGroup);
    private const string BorderGroup = nameof(DateInputController.BorderGroup);
    private static readonly DateOnly Release = new(2026, 8, 12);
    private static readonly DateOnly QuarterStart = new(2026, 7, 1);
    private static readonly DateOnly QuarterEnd = new(2026, 9, 30);

    public static string ViewKey => "demo.inputs.date-input";

    protected override string ComponentRoute => "/inputs/date-input";
    protected override string Header => "demo.inputs.date-input.header";
    protected override string HeaderDescription => "demo.inputs.date-input.description";
    protected override (string Route, string Label)? ComposedIn => ("/mechanisms/values", "demo.nav.mechanisms.values");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(360,
            ("One date", frame => frame.AddChild(Bind(new DateInputComponent()))),
            ("A period: Value is the start, EndValue the end", frame => frame.AddChild(Bind(new DateInputComponent()).SetIsRange()))
        );

    /// <summary>The same rows on both panes: <c>IsRange</c> is authoring-only, so the period is a second instance.</summary>
    private static DateInputComponent Bind(DateInputComponent input)
        => input
            .BindStandard()
            .BindValue($"{ValueGroup}.{nameof(DateValueGroupContext.Value)}")
            .BindMin($"{ValueGroup}.{nameof(DateValueGroupContext.Min)}")
            .BindMax($"{ValueGroup}.{nameof(DateValueGroupContext.Max)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(DateValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(DateValueGroupContext.Size)}")
            .BindDisplayFormat($"{FieldGroup}.{nameof(TemporalFieldGroupContext.DisplayFormat)}")
            .BindAppearance($"{FieldGroup}.{nameof(TemporalFieldGroupContext.Appearance)}")
            .BindPrefixIcon($"{FieldGroup}.{nameof(TemporalFieldGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FieldGroup}.{nameof(TemporalFieldGroupContext.SuffixIcon)}")
            .BindTextContent(ContentGroup)
            .BindBadge(BadgeGroup)
            .BindBorder(BorderGroup)
            .BindEndValue($"{ValueGroup}.{nameof(DateValueGroupContext.EndValue)}")
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ValueGroup, "Value"),
            DemoUI.CreateOptionSection(FieldGroup, "Field"),
            DemoUI.CreateOptionSection(ContentGroup, "Content"),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateUsesGroup()], [CreateFormatGroup()]), CreateCalendarGroup(), CreateLanguageGroup()];

    /// <summary>
    /// A period is one field with two ends, chosen on one calendar, rather than two fields kept in step by hand.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(16)
                .AddChild(new DateInputComponent()
                    .SetTitle("Reporting period")
                    .SetIcon(DemoIcons.History)
                    .SetIsRange()
                    .SetValue(QuarterStart)
                    .SetEndValue(Release)
                    .SetMin(QuarterStart)
                    .SetMax(QuarterEnd)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Release date")
                    .SetValue(Release)
                    .SetBadgeText("frozen")
                    .SetBadgeStyle(UIBadgeType.Warning)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Snapshots are kept until")
                    .SetIcon(DemoIcons.History)
                    .SetValue(QuarterEnd)
                    .SetMin(Release)
                )
        );
    }

    /// <summary>
    /// <c>DisplayFormat</c> is what the field reads as; unset, the framework's own <c>yyyy-MM-dd</c>.
    /// </summary>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateExample("How it is written down",
            UILayout.Stack(16)
                .AddChild(new DateInputComponent()
                    .SetTitle("Unset — yyyy-MM-dd")
                    .SetValue(Release)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("dd.MM.yyyy")
                    .SetDisplayFormat("dd.MM.yyyy")
                    .SetValue(Release)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("dd MMM yyyy")
                    .SetDisplayFormat("dd MMM yyyy")
                    .SetValue(Release)
                )
        );
    }

    /// <summary>
    /// <c>Min</c>/<c>Max</c> grey out the calendar as well as refusing what is typed; <c>FirstDayOfWeek</c> and <c>Step</c> are read once
    /// while the picker is built, so the options cannot show them.
    /// </summary>
    private static ContainerComponent CreateCalendarGroup()
    {
        return DemoUI.CreateExample("The calendar it opens",
            // Three to a row at the page's width, as the language group's columns are.
            UILayout.Row(24)
                .AddChild(new DateInputComponent()
                    .SetTitle("Inside one quarter, weeks from Monday")
                    .SetFirstDayOfWeek(UIDayOfWeek.Monday)
                    .SetRange(QuarterStart, QuarterEnd)
                    .SetValue(Release)
                    .SetWidth(UILayoutLength.Absolute(300))
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Not before the release, weeks from Sunday")
                    .SetFirstDayOfWeek(UIDayOfWeek.Sunday)
                    .SetMin(Release)
                    .SetValue(Release)
                    .SetWidth(UILayoutLength.Absolute(300))
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Not after it, the arrows a week at a time")
                    .SetMax(Release)
                    .SetStepDays(7)
                    .SetValue(Release)
                    .SetWidth(UILayoutLength.Absolute(300))
                ),
            columns: 24,
            note: "The picker opens aligned to **the toggle button** rather than to the left edge of the field: one anchor cannot both clear the row vertically *and* line up with a button centred inside it."
        );
    }

    /// <summary>
    /// With no <c>DisplayFormat</c> a field writes the framework's own pattern in the page's letters and names, drawn again when the
    /// language changes; a <c>Culture</c> pins a culture, and its pattern with it. The time and the date-time fields do the same, so the
    /// family is shown here once.
    /// </summary>
    private static ContainerComponent CreateLanguageGroup()
    {
        return DemoUI.CreateExample("In the page's language",
            // Three to a row at the page's width: at 320 a column each, the third wrapped onto a row alone.
            UILayout.Row(24)
                .AddChild(UILayout.Stack(16)
                    .SetWidth(UILayoutLength.Absolute(300))
                    .AddChild(new DateInputComponent()
                        .SetTitle("Unset — yyyy-MM-dd in the page's words")
                        .SetValue(Release)
                    )
                    .AddChild(new DateInputComponent()
                        .SetTitle("Culture en-US — its own M/d/yyyy")
                        .SetCulture("en-US")
                        .SetValue(Release)
                    )
                )
                .AddChild(UILayout.Stack(16)
                    .SetWidth(UILayoutLength.Absolute(300))
                    .AddChild(new TimeInputComponent()
                        .SetTitle("Unset — HH:mm in every language")
                        .SetValue(new TimeOnly(9, 30))
                    )
                    .AddChild(new TimeInputComponent()
                        .SetTitle("Culture en-US — its own h:mm tt")
                        .SetCulture("en-US")
                        .SetValue(new TimeOnly(9, 30))
                    )
                )
                .AddChild(UILayout.Stack(16)
                    .SetWidth(UILayoutLength.Absolute(300))
                    .AddChild(new DateTimeInputComponent()
                        .SetTitle("Unset — yyyy-MM-dd HH:mm in the page's words")
                        .SetValue(new DateTimeOffset(2026, 8, 12, 2, 30, 0, TimeSpan.Zero))
                    )
                    .AddChild(new DateTimeInputComponent()
                        .SetTitle("Culture en-US — its own M/d/yyyy h:mm tt")
                        .SetCulture("en-US")
                        .SetValue(new DateTimeOffset(2026, 8, 12, 2, 30, 0, TimeSpan.Zero))
                    )
                ),
            columns: 24,
            note: "Switch the language in the header: the unset fields keep the framework's `yyyy-MM-dd`, `HH:mm` and `yyyy-MM-dd HH:mm` on a 24-hour clock and are drawn again with their placeholders in the new language's letters (`дд.ММ.гггг` in Russian) and their pickers' names in its words; the fields that name `en-US` show that culture's `M/d/yyyy`, `h:mm tt` and `M/d/yyyy h:mm tt` and its English names whatever the page speaks. `ConfigureTemporal(o => o.FollowCulture = true)` would give every field its language's own pattern, and `HourCycle` one clock for all; this demo leaves both unset."
        );
    }
}
