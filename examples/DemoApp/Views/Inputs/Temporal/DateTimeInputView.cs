using System;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.Temporal;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Temporal;

/// <summary>
/// One moment field — a date, a time and the offset they are read in — and every property that can be bound to it; then a moment
/// rather than a day or a time of day: one popup, and one value that carries an offset.
/// </summary>
/// <remarks>
/// <c>Format</c>, <c>Culture</c>, <c>FormatMessage</c>, <c>Step</c> and <c>FirstDayOfWeek</c> are unbindable and have no rows. The page's
/// language is shown for the whole family on the date input's page.
/// </remarks>
internal sealed class DateTimeInputView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(DateTimeInputController.ValueGroup);
    private const string FieldGroup = nameof(DateTimeInputController.FieldGroup);
    private const string ContentGroup = nameof(DateTimeInputController.ContentGroup);
    private const string BadgeGroup = nameof(DateTimeInputController.BadgeGroup);
    private const string BorderGroup = nameof(DateTimeInputController.BorderGroup);
    private static readonly DateTimeOffset Cutover = new(2026, 8, 12, 2, 30, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset WindowOpens = new(2026, 8, 12, 1, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset WindowCloses = new(2026, 8, 12, 5, 0, 0, TimeSpan.Zero);

    public static string ViewKey => "demo.inputs.date-time-input";

    protected override string ComponentRoute => "/inputs/date-time-input";
    protected override string Header => "demo.inputs.date-time-input.header";
    protected override string HeaderDescription => "demo.inputs.date-time-input.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(360,
            ("One moment", frame => frame.AddChild(Bind(new DateTimeInputComponent()))),
            ("A period: both ends on one calendar, the clock for the end being set", frame => frame.AddChild(Bind(new DateTimeInputComponent()).SetIsRange()))
        );

    /// <summary>The same rows on both panes: <c>IsRange</c> is authoring-only, so the period is a second instance.</summary>
    private static DateTimeInputComponent Bind(DateTimeInputComponent input)
        => input
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{ValueGroup}.{nameof(DateTimeValueGroupContext.Value)}")
            .BindMin($"{ValueGroup}.{nameof(DateTimeValueGroupContext.Min)}")
            .BindMax($"{ValueGroup}.{nameof(DateTimeValueGroupContext.Max)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(DateTimeValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(DateTimeValueGroupContext.Size)}")
            .BindDisplayFormat($"{FieldGroup}.{nameof(TemporalFieldGroupContext.DisplayFormat)}")
            .BindAppearance($"{FieldGroup}.{nameof(TemporalFieldGroupContext.Appearance)}")
            .BindPrefixIcon($"{FieldGroup}.{nameof(TemporalFieldGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FieldGroup}.{nameof(TemporalFieldGroupContext.SuffixIcon)}")
            .BindIcon($"{ContentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{ContentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{ContentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{ContentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{ContentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{ContentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{ContentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ContentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindBadgePlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .BindEndValue($"{ValueGroup}.{nameof(DateTimeValueGroupContext.EndValue)}")
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(DateTimeInputController.CycleValueOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(DateTimeInputController.CycleFieldOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(DateTimeInputController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(DateTimeInputController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(DateTimeInputController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateUsesGroup(), CreateBoundsGroup()], [CreateFormatGroup(), CreateAgainstNarrowerGroup()]);

    /// <summary>
    /// The jobs it is given: a scheduled moment, and the two ends of a window that may cross midnight — a change request's form,
    /// outlined throughout.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(16)
                .AddChild(new DateTimeInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Cutover starts")
                    .SetIcon(DemoIcons.Clock)
                    .SetValue(Cutover)
                    .SetStepMinutes(15)
                )
                // One period: the calendar takes both ends, the clock the end being set, and the two fields cannot cross.
                .AddChild(new DateTimeInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Deploy freeze")
                    .SetIsRange()
                    .SetValue(WindowOpens)
                    .SetEndValue(WindowCloses)
                    .SetStepMinutes(30)
                    .SetBadgeText("UTC")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
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
}
