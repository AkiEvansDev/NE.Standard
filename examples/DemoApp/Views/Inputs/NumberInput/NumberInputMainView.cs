using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.NumberInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Inputs.NumberInput;

/// <summary>
/// One numeric field, and every property that can be bound to it.
/// </summary>
/// <remarks>The Format rows can leave the value in a state the component refuses, so the controller brings it back with them.</remarks>
internal sealed class NumberInputMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(NumberInputMainController.ValueGroup);
    private const string FieldGroup = nameof(NumberInputMainController.FieldGroup);
    private const string FormatGroup = nameof(NumberInputMainController.FormatGroup);
    private const string ContentGroup = nameof(NumberInputMainController.ContentGroup);
    private const string BadgeGroup = nameof(NumberInputMainController.BadgeGroup);
    private const string BorderGroup = nameof(NumberInputMainController.BorderGroup);

    public static string ViewKey => "demo.inputs.number-input.main";

    protected override string ComponentRoute => "/inputs/number-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.number-input.header";
    protected override string HeaderDescription => "demo.inputs.number-input.description";

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
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(NumberInputMainController.CycleValueOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(NumberInputMainController.CycleFieldOption)),
            DemoUI.CreateOptionSection(FormatGroup, "Format", nameof(NumberInputMainController.CycleFormatOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(NumberInputMainController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(NumberInputMainController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(NumberInputMainController.CycleBorderOption))
        );
}
