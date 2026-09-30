using System;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Temporal;

/// <summary>
/// A moment rather than a day or a time of day: one popup, and one value that carries an offset.
/// </summary>
internal sealed class DateTimeInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    private static readonly DateTimeOffset Cutover = new(2026, 8, 12, 2, 30, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset WindowOpens = new(2026, 8, 12, 1, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset WindowCloses = new(2026, 8, 12, 5, 0, 0, TimeSpan.Zero);

    public static string ViewKey => "demo.inputs.date-time-input.examples";

    protected override string ComponentRoute => "/inputs/date-time-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.date-time-input.header";
    protected override string HeaderDescription => "demo.inputs.date-time-input.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateUsesGroup(), CreateBoundsGroup(), CreateLanguageGroup()], [CreateFormatGroup(), CreateAgainstNarrowerGroup()]));

    /// <summary>
    /// The jobs it is given: a scheduled moment, and the two ends of a window that may cross midnight.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(16)
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Cutover starts")
                    .SetIcon(DemoIcons.Clock)
                    .SetValue(Cutover)
                    .SetStepMinutes(15)
                )
                // One period: the calendar takes both ends, the clock the end being set, and the two fields cannot cross.
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Deploy freeze")
                    .SetIsRange()
                    .SetValue(WindowOpens)
                    .SetEndValue(WindowCloses)
                    .SetStepMinutes(30)
                    .SetBadgeText("UTC")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Snapshot taken at")
                    .SetPrefixIcon(DemoIcons.History)
                    .SetDisplayFormat("yyyy-MM-dd HH:mm")
                    .SetValue(Cutover)
                    .SetIsReadOnly(true)
                )
        );
    }

    /// <summary>
    /// The format carries both halves at once; unset, the framework's own <c>yyyy-MM-dd HH:mm</c>.
    /// </summary>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateExample("How it is written down",
            UILayout.Stack(16)
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Unset — yyyy-MM-dd HH:mm")
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("dd.MM.yyyy HH:mm")
                    .SetDisplayFormat("dd.MM.yyyy HH:mm")
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("dd MMM yyyy, HH:mm:ss")
                    .SetDisplayFormat("dd MMM yyyy, HH:mm:ss")
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("ddd d MMM, h:mm tt")
                    .SetDisplayFormat("ddd d MMM, h:mm tt")
                    .SetValue(Cutover)
                )
        );
    }

    /// <summary>
    /// Bounded at both ends, which greys out the calendar as well as refusing what is typed.
    /// </summary>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateExample("Bounds, and the calendar it opens",
            UILayout.Stack(16)
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Inside the maintenance window")
                    .SetDisplayFormat("yyyy-MM-dd HH:mm")
                    .SetValue(Cutover)
                    .SetRange(WindowOpens, WindowCloses)
                    .SetStepMinutes(15)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Weeks starting Monday")
                    .SetFirstDayOfWeek(UIDayOfWeek.Monday)
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Weeks starting Sunday")
                    .SetFirstDayOfWeek(UIDayOfWeek.Sunday)
                    .SetValue(Cutover)
                )
        );
    }

    /// <summary>
    /// The same moment expressed three ways; two narrow fields fail as soon as the time can belong to the next day.
    /// </summary>
    private static ContainerComponent CreateAgainstNarrowerGroup()
    {
        return DemoUI.CreateExample("Against a date and a time",
            UILayout.Stack(16)
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("One field")
                    .SetDisplayFormat("yyyy-MM-dd HH:mm")
                    .SetValue(Cutover)
                    .SetStepMinutes(15)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Two fields — the day")
                    .SetDisplayFormat("yyyy-MM-dd")
                    .SetValue(new DateOnly(2026, 8, 12))
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("and the time of day")
                    .SetDisplayFormat("HH:mm")
                    .SetValue(new TimeOnly(2, 30))
                    .SetStepMinutes(15)
                )
                .AddChild(UIText.Note("**Split them** while the two answers are independent — a birthday and a reminder time. **Keep them together** when one is meaningless without the other, or when the window runs past midnight."))
        );
    }

    /// <summary>
    /// With no <c>DisplayFormat</c> the field writes the framework's own pattern in the page's letters and names, drawn again when the
    /// language changes; a <c>Culture</c> pins a culture, and its pattern with it.
    /// </summary>
    private static ContainerComponent CreateLanguageGroup()
    {
        return DemoUI.CreateExample("In the page's language",
            UILayout.Stack(16)
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Unset — yyyy-MM-dd HH:mm in the page's words")
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Culture en-US — its own M/d/yyyy h:mm tt")
                    .SetCulture("en-US")
                    .SetValue(Cutover)
                ),
            note: "Switch the language in the header: the first field keeps the framework's `yyyy-MM-dd HH:mm` on a 24-hour clock and is drawn again with its placeholder in the new language's letters (`дд.ММ.гггг чч:мм` in Russian) and its picker's names in its words; the second names `en-US`, so it shows that culture's `M/d/yyyy h:mm tt` whatever the page speaks. `ConfigureTemporal(o => o.FollowCulture = true)` would give every field its language's own pattern, and `HourCycle` one clock for all; this demo leaves both unset."
        );
    }
}
