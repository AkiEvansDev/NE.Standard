using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.NumberInput;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.NumberInput;

/// <summary>
/// One numeric field and every property that can be bound to it; then money, a count, a percentage or a limit: what the value may be, and how it is written down.
/// </summary>
/// <remarks>The Format rows can leave the value in a state the component refuses, so the controller brings it back with them. A bound the server holds is on the Values page.</remarks>
internal sealed class NumberInputView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(NumberInputController.ValueGroup);
    private const string FieldGroup = nameof(NumberInputController.FieldGroup);
    private const string FormatGroup = nameof(NumberInputController.FormatGroup);
    private const string ContentGroup = nameof(NumberInputController.ContentGroup);
    private const string BadgeGroup = nameof(NumberInputController.BadgeGroup);
    private const string BorderGroup = nameof(NumberInputController.BorderGroup);

    public static string ViewKey => "demo.inputs.number-input";

    protected override string ComponentRoute => "/inputs/number-input";
    protected override string Header => "demo.inputs.number-input.header";
    protected override string HeaderDescription => "demo.inputs.number-input.description";
    protected override (string Route, string Label)? ComposedIn => ("/mechanisms/values", "demo.nav.mechanisms.values");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new NumberInputComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{ValueGroup}.{nameof(NumberValueGroupContext.Value)}")
            .BindMin($"{ValueGroup}.{nameof(NumberValueGroupContext.Min)}")
            .BindMax($"{ValueGroup}.{nameof(NumberValueGroupContext.Max)}")
            .BindStep($"{ValueGroup}.{nameof(NumberValueGroupContext.Step)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(NumberValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(NumberValueGroupContext.Size)}")
            .BindAppearance($"{FieldGroup}.{nameof(NumberFieldGroupContext.Appearance)}")
            .BindPlaceholder($"{FieldGroup}.{nameof(NumberFieldGroupContext.Placeholder)}")
            .BindPrefixText($"{FieldGroup}.{nameof(NumberFieldGroupContext.PrefixText)}")
            .BindSuffixText($"{FieldGroup}.{nameof(NumberFieldGroupContext.SuffixText)}")
            .BindPrefixIcon($"{FieldGroup}.{nameof(NumberFieldGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FieldGroup}.{nameof(NumberFieldGroupContext.SuffixIcon)}")
            .BindShowStepper($"{FieldGroup}.{nameof(NumberFieldGroupContext.ShowStepper)}")
            .BindDisplayFormat($"{FormatGroup}.{nameof(NumberFormatGroupContext.DisplayFormat)}")
            .BindAllowDecimals($"{FormatGroup}.{nameof(NumberFormatGroupContext.AllowDecimals)}")
            .BindAllowNegative($"{FormatGroup}.{nameof(NumberFormatGroupContext.AllowNegative)}")
            .BindAllowThousandsSeparator($"{FormatGroup}.{nameof(NumberFormatGroupContext.AllowThousandsSeparator)}")
            .BindTrimTrailingZeros($"{FormatGroup}.{nameof(NumberFormatGroupContext.TrimTrailingZeros)}")
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
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(NumberInputController.CycleValueOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(NumberInputController.CycleFieldOption)),
            DemoUI.CreateOptionSection(FormatGroup, "Format", nameof(NumberInputController.CycleFormatOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(NumberInputController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(NumberInputController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(NumberInputController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateQuantityGroup()], [CreateFormatGroup()]), CreateBoundsGroup()];

    /// <summary>
    /// What the affixes are for: a unit belongs beside the number rather than in it — a service's settings, outlined throughout.
    /// </summary>
    private static ContainerComponent CreateQuantityGroup()
    {
        return DemoUI.CreateExample("A number with a unit",
            UILayout.Stack(12)
                .AddChild(new NumberInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Replicas")
                    .SetValue(12)
                    .SetRange(1, 64)
                    .SetStep(1)
                    .SetShowStepper()
                )
                .AddChild(new NumberInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Request timeout")
                    .SetValue(30)
                    .SetSuffixText("seconds")
                    .SetStep(5)
                    .SetShowStepper()
                )
                .AddChild(new NumberInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Monthly spend")
                    .SetValue(2400)
                    .SetPrefixText("€")
                    .SetAllowThousandsSeparator()
                    .SetStep(100)
                )
                .AddChild(new NumberInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Error budget spent")
                    .SetIcon(DemoIcons.Alert)
                    .SetValue(41.5m)
                    .SetSuffixText("%")
                    .SetRange(0, 100)
                    .SetAllowDecimals()
                    .SetStep(0.5m)
                )
        );
    }

    /// <summary>
    /// What may be typed follows from the thing being measured, so each row is named by the thing rather than by the flag.
    /// </summary>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateExample("What may be typed",
            UILayout.Stack(12)
                .AddChild(new NumberInputComponent()
                    .SetTitle("Replicas — a count, so no decimals and no minus")
                    .SetValue(12)
                    .SetAllowDecimals(false)
                    .SetAllowNegative(false)
                    .SetShowStepper()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Latency budget — decimals, no trailing zeros")
                    .SetValue(1.500m)
                    .SetSuffixText("ms")
                    .SetAllowDecimals()
                    .SetTrimTrailingZeros()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Price per seat — money, always two places")
                    .SetValue(6m)
                    .SetPrefixText("€")
                    .SetAllowDecimals()
                    .SetDisplayFormat("N2")
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Time zone offset — the one field that may go below zero")
                    .SetValue(-5)
                    .SetSuffixText("hours")
                    .SetAllowNegative()
                    .SetAllowDecimals()
                ),
            note: "Every rule here is a property; what the page is for is which rule the measured thing asks for."
        );
    }

    /// <summary>
    /// What the field says about a value: the ends it refuses outright, the answer it insists on, and two rules on one field of
    /// which only the stronger ever speaks.
    /// </summary>
    /// <remarks>Full width, three across: the three are read against each other, not down a column.</remarks>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateExample("What it says about a value",
            UILayout.Row(24)
                .AddChild(DemoUI.CreateLabelled("Both ends — the stepper stops at them, a number typed past one is refused", new NumberInputComponent()
                    .SetTitle("Replicas")
                    .SetValue(8)
                    .SetRange(1, 64)
                    .SetShowStepper()
                    .SetWidth(UILayoutLength.Absolute(300))
                    )
                )
                .AddChild(DemoUI.CreateLabelled("Empty is not an answer", new NumberInputComponent()
                    .SetTitle("Replicas")
                    .SetPlaceholder("How many?")
                    .SetShowStepper()
                    .Required("A replica count is required.")
                    .SetWidth(UILayoutLength.Absolute(300))
                    )
                )
                .AddChild(DemoUI.CreateLabelled("Two rules, and the field says the graver one", new NumberInputComponent()
                    .SetTitle("Monthly spend")
                    .SetPrefixText("€")
                    .SetValue(50)
                    .SetStep(10)
                    .SetShowStepper()
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.GreaterOrEqual, 10, "Under €10 the plan cannot be billed at all.", UIValidationSeverity.Error)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.GreaterOrEqual, 100, "Under €100 the plan costs more to run than it takes.", UIValidationSeverity.Warning)
                    .SetWidth(UILayoutLength.Absolute(300))
                    )
                ),
            columns: 24,
            note: "`Min` and `Max` are validated with the value rather than only guarding the stepper: type 100 and the field keeps it and says \"At most 64.\" rather than pulling it back to 64; bound, it would not be sent. "
                + "The spend carries two `Validate` rules on the `Change` trigger, so both are answered on every keystroke — type 5 and the error speaks, 50 and the warning does, 150 and neither."
        );
    }
}
