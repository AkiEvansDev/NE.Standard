using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.FileInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Inputs.FileInput;

/// <summary>
/// One file field, and every property that can be bound to it.
/// </summary>
/// <remarks>The client writes the uploaded files' handle into the two-way <c>SelectionId</c>, which the server reads back.</remarks>
internal sealed class FileInputMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(FileInputMainController.ValueGroup);
    private const string FileGroup = nameof(FileInputMainController.FileGroup);
    private const string UploadGroup = nameof(FileInputMainController.UploadGroup);
    private const string ContentGroup = nameof(FileInputMainController.ContentGroup);
    private const string BadgeGroup = nameof(FileInputMainController.BadgeGroup);
    private const string BorderGroup = nameof(FileInputMainController.BorderGroup);

    public static string ViewKey => "demo.inputs.file-input.main";

    protected override string ComponentRoute => "/inputs/file-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.file-input.header";
    protected override string HeaderDescription => "demo.inputs.file-input.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new FileInputComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{ValueGroup}.{nameof(FileInputValueGroupContext.Value)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(FileInputValueGroupContext.IsReadOnly)}")
            .BindSelectionId($"{ValueGroup}.{nameof(FileInputValueGroupContext.SelectionId)}")
            .BindAccept($"{FileGroup}.{nameof(FileInputFileGroupContext.Accept)}")
            .BindMaxFileSize($"{FileGroup}.{nameof(FileInputFileGroupContext.MaxFileSize)}")
            .BindMultiple($"{FileGroup}.{nameof(FileInputFileGroupContext.Multiple)}")
            .BindAppearance($"{FileGroup}.{nameof(FileInputFileGroupContext.Appearance)}")
            .BindPlaceholder($"{FileGroup}.{nameof(FileInputFileGroupContext.Placeholder)}")
            .BindPrefixIcon($"{FileGroup}.{nameof(FileInputFileGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FileGroup}.{nameof(FileInputFileGroupContext.SuffixIcon)}")
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
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(FileInputMainController.CycleValueOption)),
            DemoUI.CreateOptionSection(FileGroup, "File", nameof(FileInputMainController.CycleFileOption)),
            DemoUI.CreateOptionSection(UploadGroup, "Upload", nameof(FileInputMainController.CycleUploadOption), "A server round trip, not a property: what the last upload reported."),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(FileInputMainController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(FileInputMainController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(FileInputMainController.CycleBorderOption))
        );
}
