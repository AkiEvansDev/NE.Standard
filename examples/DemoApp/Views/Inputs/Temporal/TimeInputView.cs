using System;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.Temporal;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Temporal;

/// <summary>
/// One time field and every property that can be bound to it; then the one temporal control with no popup: a segmented editor, one
/// span per clock unit, built from the <c>DisplayFormat</c> tokens.
/// </summary>
/// <remarks>
/// <c>Format</c>, <c>Culture</c>, <c>FormatMessage</c>, <c>Step</c> and <c>FirstDayOfWeek</c> are unbindable and have no rows. The page's
/// language is shown for the whole family on the date input's page.
/// </remarks>
internal sealed class TimeInputView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(TimeInputController.ValueGroup);
    private const string FieldGroup = nameof(TimeInputController.FieldGroup);
    private const string ContentGroup = nameof(TimeInputController.ContentGroup);
    private const string BadgeGroup = nameof(TimeInputController.BadgeGroup);
    private const string BorderGroup = nameof(TimeInputController.BorderGroup);
    private static readonly TimeOnly Standup = new(9, 30);
    private static readonly TimeOnly Window = new(2, 15, 30);

    public static string ViewKey => "demo.inputs.time-input";

    protected override string ComponentRoute => "/inputs/time-input";
    protected override string Header => "demo.inputs.time-input.header";
    protected override string HeaderDescription => "demo.inputs.time-input.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/settings", "demo.nav.screens.settings");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(360,
            ("One time", frame => frame.AddChild(Bind(new TimeInputComponent()))),
            ("A period: two clocks, one stepper", frame => frame.AddChild(Bind(new TimeInputComponent()).SetIsRange()))
        );

    /// <summary>The same rows on both panes: <c>IsRange</c> is authoring-only, so the period is a second instance.</summary>
    private static TimeInputComponent Bind(TimeInputComponent input)
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
            .BindValue($"{ValueGroup}.{nameof(TimeValueGroupContext.Value)}")
            .BindMin($"{ValueGroup}.{nameof(TimeValueGroupContext.Min)}")
            .BindMax($"{ValueGroup}.{nameof(TimeValueGroupContext.Max)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(TimeValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(TimeValueGroupContext.Size)}")
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
            .BindBadgeFill($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeFill)}")
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
            .BindEndValue($"{ValueGroup}.{nameof(TimeValueGroupContext.EndValue)}")
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(TimeInputController.CycleValueOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(TimeInputController.CycleFieldOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(TimeInputController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(TimeInputController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(TimeInputController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // Paired by height: the compact settings list beside the bounds, the segments beside the steps.
        => DemoUI.CreateColumns([CreateUsesGroup(), CreateSegmentsGroup()], [CreateBoundsGroup(), CreateStepGroup()]);

    /// <summary>The jobs it is given, and the pair that is a window rather than a moment.</summary>
    /// <remarks>
    /// A settings list, so each row reads as one: the caption inside an underlined row and the time at its far end, as a settings
    /// screen draws its values.
    /// </remarks>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(8)
                .AddChild(new TimeInputComponent()
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("Daily digest is sent at")
                    .SetIcon(DemoIcons.Clock)
                    .SetValue(Standup)
                    .SetStepMinutes(15)
                )
                // One period: two clocks in the row, one stepper, and an end stepped past the start swaps with it.
                .AddChild(new TimeInputComponent()
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("Maintenance window")
                    .SetIsRange()
                    .SetValue(new TimeOnly(2, 0))
                    .SetEndValue(new TimeOnly(4, 0))
                    .SetStepMinutes(30)
                    .SetBadgeText("UTC")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(new TimeInputComponent()
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("Quiet hours end at")
                    .SetPrefixIcon(DemoIcons.Clock)
                    .SetDisplayFormat("HH:mm")
                    .SetValue(new TimeOnly(7, 0))
                    .SetStepMinutes(30)
                )
        );
    }

    /// <summary>
    /// The format decides which segments the editor has; one with no seconds has no seconds segment to tab into.
    /// </summary>
    private static ContainerComponent CreateSegmentsGroup()
    {
        return DemoUI.CreateExample("Which segments it has",
            UILayout.Stack(16)
                .AddChild(new TimeInputComponent()
                    .SetTitle("Unset — HH:mm, two segments, 24 hours")
                    .SetValue(Standup)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("h:mm tt — a third for AM or PM")
                    .SetDisplayFormat("h:mm tt")
                    .SetValue(Standup)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("HH:mm:ss — three")
                    .SetDisplayFormat("HH:mm:ss")
                    .SetValue(Window)
                )
        );
    }

    /// <summary>
    /// <c>Step</c> is what the arrows and the wheel move by, read once while the editor is built.
    /// </summary>
    private static ContainerComponent CreateStepGroup()
    {
        return DemoUI.CreateExample("What the arrows move by",
            UILayout.Stack(16)
                .AddChild(new TimeInputComponent()
                    .SetTitle("A minute at a time")
                    .SetDisplayFormat("HH:mm")
                    .SetStepMinutes(1)
                    .SetValue(Standup)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("A quarter of an hour")
                    .SetDisplayFormat("HH:mm")
                    .SetStepMinutes(15)
                    .SetValue(Standup)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("Five seconds")
                    .SetDisplayFormat("HH:mm:ss")
                    .SetStepSeconds(5)
                    .SetValue(Window)
                )
        );
    }

    /// <summary>
    /// <c>Min</c>/<c>Max</c> on a bounded line rather than a wrapping dial: past midnight needs two fields and a date.
    /// </summary>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateExample("Bounds",
            UILayout.Stack(16)
                .AddChild(new TimeInputComponent()
                    .SetTitle("Working hours")
                    .SetDisplayFormat("HH:mm")
                    .SetValue(Standup)
                    .SetRange(new TimeOnly(8, 0), new TimeOnly(18, 0))
                    .SetStepMinutes(30)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("Not before 08:00")
                    .SetDisplayFormat("HH:mm")
                    .SetValue(Standup)
                    .SetMin(new TimeOnly(8, 0))
                )
                .AddChild(UIText.Note("The editor is **segments only** — free text is gone for this control, so nothing it produces can fail to parse and `FormatMessage` is never reached from it."))
        );
    }
}
