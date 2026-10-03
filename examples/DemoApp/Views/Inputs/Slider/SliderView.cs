using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.Slider;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Slider;

/// <summary>
/// One slider and every property that can be bound to it, as one value and as a band of two; then a value whose place in a range matters
/// more than its digits, which is where it stops being a number input.
/// </summary>
/// <remarks>A slider has no field of its own; Min, Max and Step are validated with the value, so the rows bring it back inside.
/// <c>IsRange</c> is read once at render and has no row; the band is a second pane.</remarks>
internal sealed class SliderView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(SliderController.ValueGroup);
    private const string TrackGroup = nameof(SliderController.TrackGroup);
    private const string ContentGroup = nameof(SliderController.ContentGroup);
    private const string BadgeGroup = nameof(SliderController.BadgeGroup);

    public static string ViewKey => "demo.inputs.slider";

    protected override string ComponentRoute => "/inputs/slider";
    protected override string Header => "demo.inputs.slider.header";
    protected override string HeaderDescription => "demo.inputs.slider.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/catalogue", "demo.nav.screens.catalogue");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(220,
            ("One value", frame => frame.AddChild(Bind(new SliderComponent()))),
            ("A band: Value is the start, EndValue the end", frame => frame.AddChild(Bind(new SliderComponent()).SetIsRange()))
        );

    /// <summary>The same rows on both panes: <c>IsRange</c> is authoring-only, so the band is a second instance.</summary>
    private static SliderComponent Bind(SliderComponent slider)
        => slider
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{ValueGroup}.{nameof(SliderValueGroupContext.Value)}")
            .BindEndValue($"{ValueGroup}.{nameof(SliderValueGroupContext.EndValue)}")
            .BindMinDistance($"{ValueGroup}.{nameof(SliderValueGroupContext.MinDistance)}")
            .BindMin($"{ValueGroup}.{nameof(SliderValueGroupContext.Min)}")
            .BindMax($"{ValueGroup}.{nameof(SliderValueGroupContext.Max)}")
            .BindStep($"{ValueGroup}.{nameof(SliderValueGroupContext.Step)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(SliderValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(SliderValueGroupContext.Size)}")
            .BindOrientation($"{TrackGroup}.{nameof(SliderTrackGroupContext.Orientation)}")
            .BindShowValue($"{TrackGroup}.{nameof(SliderTrackGroupContext.ShowValue)}")
            .BindShowRange($"{TrackGroup}.{nameof(SliderTrackGroupContext.ShowRange)}")
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
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(SliderController.CycleValueOption), note: "EndValue and MinDistance are the band's: moving one end past the other moves the other out of its way."),
            DemoUI.CreateOptionSection(TrackGroup, "Track", nameof(SliderController.CycleTrackOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(SliderController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(SliderController.CycleBadgeOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // The uses beside the readings and the steps stacked, as tall together: paired, the steps stood alone in a row of their own.
        => [CreateUsesGroup(), DemoUI.CreateHalf(CreateReadoutGroup(), CreateStepGroup()), CreateBandGroup(), CreateAgainstNumberGroup()];

    /// <summary>The jobs it is given: a share, a threshold, a limit with a unit at the end of its label, and a pair of levels upright.</summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(16)
                .AddChild(new SliderComponent()
                    .SetTitle("Traffic to the new release")
                    .SetIcon(DemoIcons.Navigation)
                    .SetRange(0, 100)
                    .SetStep(5)
                    .SetValue(25)
                    .SetShowValue()
                    .SetShowRange()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Alert when the error rate passes")
                    .SetIcon(DemoIcons.Alert)
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    .SetRange(0, 10)
                    .SetStep(0.1m)
                    .SetValue(2.5m)
                    .SetShowValue()
                    .SetBadgeText("per cent")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Concurrent jobs")
                    .SetRange(1, 32)
                    .SetStep(1)
                    .SetValue(8)
                    .SetShowValue()
                    .SetShowRange()
                )
                .AddChild(UILayout.Row(32)
                    .AddChild(new SliderComponent()
                        .SetTitle("Reads")
                        .SetOrientation(UIOrientation.Vertical)
                        .SetHeight(UILayoutLength.Absolute(160))
                        .SetRange(0, 100)
                        .SetValue(70)
                        .SetShowValue()
                    )
                    .AddChild(new SliderComponent()
                        .SetTitle("Writes")
                        .SetOrientation(UIOrientation.Vertical)
                        .SetHeight(UILayoutLength.Absolute(160))
                        .SetRange(0, 100)
                        .SetValue(30)
                        .SetShowValue()
                        .SetShowRange()
                    )
                ),
            note: "Upright, a slider takes a height rather than a width, which is the shape a level is read in."
        );
    }

    /// <summary>
    /// A band of two on one track: a price filter, a window of hours with a least length, and a size range read over the handles.
    /// </summary>
    private static ContainerComponent CreateBandGroup()
    {
        return DemoUI.CreateExample("A band",
            UILayout.Stack(16)
                .AddChild(new SliderComponent()
                    .SetTitle("Price, € a month")
                    .SetIsRange()
                    .SetRange(0, 300)
                    .SetStep(10)
                    .SetValue(20)
                    .SetEndValue(80)
                    .SetShowValue()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Maintenance window, hours of the day — at least two")
                    .SetIsRange()
                    .SetRange(0, 24)
                    .SetStep(1)
                    .SetMinDistance(2)
                    .SetValue(1)
                    .SetEndValue(5)
                    .SetShowValue()
                    .SetShowRange()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Servers")
                    .SetIsRange()
                    .SetRange(1, 16)
                    .SetStep(1)
                    .SetValue(2)
                    .SetEndValue(8)
                    .SetShowRange()
                ),
            note: "`SetIsRange()`: two handles on one track, `Value` the start and `EndValue` the end, both bound two-way. A press on the track takes the nearer handle; neither passes the other, and `SetMinDistance` keeps them that far apart. The arrows, Page Up/Down, Home and End move the focused handle, and the server refuses an end written below the start as it refuses one outside `Min`/`Max`."
        );
    }

    /// <summary>
    /// The two readouts are independent; with the bounds printed, the value moves over the handle instead.
    /// </summary>
    private static ContainerComponent CreateReadoutGroup()
    {
        return DemoUI.CreateExample("What it writes down",
            UILayout.Stack(16)
                .AddChild(new SliderComponent()
                    .SetTitle("Neither — a bare track")
                    .SetRange(0, 100)
                    .SetValue(40)
                )
                .AddChild(new SliderComponent()
                    .SetTitle("ShowRange — the ends of the track")
                    .SetRange(0, 100)
                    .SetValue(40)
                    .SetShowRange()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("ShowValue — the reading, beside the track")
                    .SetRange(0, 100)
                    .SetValue(40)
                    .SetShowValue()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Both — the reading rides over the handle")
                    .SetRange(0, 100)
                    .SetValue(40)
                    .SetShowValue()
                    .SetShowRange()
                )
        );
    }

    /// <summary>
    /// <c>Step</c> is what the handle may land on; a coarse step is what makes a slider usable at all.
    /// </summary>
    private static ContainerComponent CreateStepGroup()
    {
        return DemoUI.CreateExample("Step",
            UILayout.Stack(16)
                .AddChild(new SliderComponent()
                    .SetTitle("Step = 1")
                    .SetRange(0, 100)
                    .SetStep(1)
                    .SetValue(50)
                    .SetShowValue()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Step = 25 — quarters, and nothing between them")
                    .SetRange(0, 100)
                    .SetStep(25)
                    .SetValue(50)
                    .SetShowValue()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Step = 0.1 over a range of ten")
                    .SetRange(0, 10)
                    .SetStep(0.1m)
                    .SetValue(2.5m)
                    .SetShowValue()
                )
        );
    }

    /// <summary>
    /// The control this one is not: the same reading, put beside the field that spells it out.
    /// </summary>
    /// <remarks>Full width, because the point is only made when the two are read side by side rather than stacked.</remarks>
    private static ContainerComponent CreateAgainstNumberGroup()
    {
        return DemoUI.CreateExample("Against a number input",
            UILayout.Row(32)
                .AddChild(DemoUI.CreateLabelled("Slider — the share of traffic", new SliderComponent()
                    .SetTitle("Traffic to the new release")
                    .SetWidth(UILayoutLength.Absolute(320))
                    .SetRange(0, 100)
                    .SetStep(5)
                    .SetValue(25)
                    .SetShowValue()
                    .SetShowRange()
                    )
                )
                .AddChild(DemoUI.CreateLabelled("Number input — the exact percentage", new NumberInputComponent()
                    .SetTitle("Traffic to the new release")
                    .SetWidth(UILayoutLength.Absolute(320))
                    .SetRange(0, 100)
                    .SetStep(5)
                    .SetValue(25)
                    .SetSuffixText("%")
                    .SetShowStepper()
                    )
                ),
            columns: 24,
            note: "Reach for the slider when **the position in the range** is the answer, and for the number input when **the digits** are."
        );
    }
}
