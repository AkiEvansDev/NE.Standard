using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.MultiSelect;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.MultiSelect;

/// <summary>
/// One multi-select, and every property that can be bound to it.
/// </summary>
/// <remarks>The value is bound both ways, so the Value row follows every chip the preview takes or lets go.</remarks>
internal sealed class MultiSelectMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(MultiSelectMainController.ValueGroup);
    private const string FieldGroup = nameof(MultiSelectMainController.FieldGroup);
    private const string OptionsGroup = nameof(MultiSelectMainController.OptionsGroup);
    private const string ContentGroup = nameof(MultiSelectMainController.ContentGroup);
    private const string BadgeGroup = nameof(MultiSelectMainController.BadgeGroup);
    private const string BorderGroup = nameof(MultiSelectMainController.BorderGroup);

    public static string ViewKey => "demo.inputs.multi-select.main";

    protected override string ComponentRoute => "/inputs/multi-select";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.multi-select.header";
    protected override string HeaderDescription => "demo.inputs.multi-select.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new MultiSelectComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindItems($"{OptionsGroup}.{nameof(OptionListGroupContext.Options)}")
            .BindValue($"{ValueGroup}.{nameof(OptionKeysValueGroupContext.Value)}")
            .BindMaxSelected($"{ValueGroup}.{nameof(OptionKeysValueGroupContext.MaxSelected)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(OptionKeysValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(OptionKeysValueGroupContext.Size)}")
            .BindAppearance($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.Appearance)}")
            .BindPlaceholder($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.Placeholder)}")
            .BindPrefixIcon($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.SuffixIcon)}")
            .BindShowClearButton($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.ShowClearButton)}")
            .BindShowChevron($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.ShowChevron)}")
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
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(MultiSelectMainController.CycleValueOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(MultiSelectMainController.CycleFieldOption)),
            DemoUI.CreateOptionSection(OptionsGroup, "Options", nameof(MultiSelectMainController.CycleOptionsOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(MultiSelectMainController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(MultiSelectMainController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(MultiSelectMainController.CycleBorderOption))
        );
}
