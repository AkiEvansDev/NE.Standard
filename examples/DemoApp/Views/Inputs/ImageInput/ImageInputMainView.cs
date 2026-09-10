using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.ImageInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.ImageInput;

/// <summary>
/// The three shapes side by side, every one bound to the same rows.
/// </summary>
/// <remarks>Choosing a file on any pane runs the controller's command, which reads the upload back and shows it on all three.</remarks>
internal sealed class ImageInputMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(ImageInputMainController.ValueGroup);
    private const string ImageGroup = nameof(ImageInputMainController.ImageGroup);
    private const string ContentGroup = nameof(ImageInputMainController.ContentGroup);
    private const string BadgeGroup = nameof(ImageInputMainController.BadgeGroup);
    private const string BorderGroup = nameof(ImageInputMainController.BorderGroup);

    public static string ViewKey => "demo.inputs.image-input.main";

    protected override string ComponentRoute => "/inputs/image-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.image-input.header";
    protected override string HeaderDescription => "demo.inputs.image-input.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(360,
            ("Avatar", frame => frame.AddChild(Bind(new ImageInputComponent().SetShape(UIImageInputShape.Avatar)))),
            ("Picture", frame => frame.AddChild(Bind(new ImageInputComponent().SetShape(UIImageInputShape.Picture)))),
            ("Inline", frame => frame.AddChild(Bind(new ImageInputComponent().SetShape(UIImageInputShape.Inline))))
        );

    /// <summary>The same rows on every pane: <c>Shape</c> is authoring-only, so each shape is its own instance.</summary>
    private static ImageInputComponent Bind(ImageInputComponent input)
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
            .BindValue($"{ValueGroup}.{nameof(ImageValueGroupContext.Value)}")
            .BindSelectionId($"{ValueGroup}.{nameof(ImageValueGroupContext.SelectionId)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(ImageValueGroupContext.IsReadOnly)}")
            .OnChange(nameof(ImageInputMainController.TakePictureAsync))
            .BindAccept($"{ImageGroup}.{nameof(ImagePictureGroupContext.Accept)}")
            .BindPlaceholderIcon($"{ImageGroup}.{nameof(ImagePictureGroupContext.PlaceholderIcon)}")
            .BindPlaceholder($"{ImageGroup}.{nameof(ImagePictureGroupContext.Placeholder)}")
            .BindFit($"{ImageGroup}.{nameof(ImagePictureGroupContext.Fit)}")
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
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(ImageInputMainController.CycleValueOption), "Value is the picture the controller shows; SelectionId is the handle the client writes once a chosen file is uploaded."),
            DemoUI.CreateOptionSection(ImageGroup, "Image", nameof(ImageInputMainController.CycleImageOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(ImageInputMainController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(ImageInputMainController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ImageInputMainController.CycleBorderOption))
        );
}
