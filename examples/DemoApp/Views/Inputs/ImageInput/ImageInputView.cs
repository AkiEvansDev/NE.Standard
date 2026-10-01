using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.ImageInput;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.ImageInput;

/// <summary>
/// The three shapes side by side, every one bound to the same rows; then each shape in the place it is made for, and a shelf of
/// several.
/// </summary>
/// <remarks>Choosing a file on any pane runs the controller's command, which reads the upload back and shows it on all three. The chat
/// screen's composer carries a shelf that takes any file.</remarks>
internal sealed class ImageInputView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(ImageInputController.ValueGroup);
    private const string ImageGroup = nameof(ImageInputController.ImageGroup);
    private const string ContentGroup = nameof(ImageInputController.ContentGroup);
    private const string BadgeGroup = nameof(ImageInputController.BadgeGroup);
    private const string BorderGroup = nameof(ImageInputController.BorderGroup);

    public static string ViewKey => "demo.inputs.image-input";

    protected override string ComponentRoute => "/inputs/image-input";
    protected override string Header => "demo.inputs.image-input.header";
    protected override string HeaderDescription => "demo.inputs.image-input.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

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
            .BindSize($"{ValueGroup}.{nameof(ImageValueGroupContext.Size)}")
            .OnChange(nameof(ImageInputController.TakePictureAsync))
            .SetMaxFileSize(DemoImages.MaxInlinePictureBytes)
            .BindAccept($"{ImageGroup}.{nameof(ImagePictureGroupContext.Accept)}")
            .BindPlaceholderIcon($"{ImageGroup}.{nameof(ImagePictureGroupContext.PlaceholderIcon)}")
            .BindPlaceholder($"{ImageGroup}.{nameof(ImagePictureGroupContext.Placeholder)}")
            .BindFit($"{ImageGroup}.{nameof(ImagePictureGroupContext.Fit)}")
            .BindAppearance($"{ImageGroup}.{nameof(ImagePictureGroupContext.Appearance)}")
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
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(ImageInputController.CycleValueOption), "Value is the picture the controller shows; SelectionId is the handle the client writes once a chosen file is uploaded."),
            DemoUI.CreateOptionSection(ImageGroup, "Image", nameof(ImageInputController.CycleImageOption), "Appearance dresses the inline row as it does a file input's; the picture and the avatar keep one look, whatever it says."),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(ImageInputController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(ImageInputController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ImageInputController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // The four appearances are the options' Image section, on the preview's inline row; here each field wears its place's own.
        // The crop and the shelf as two halves of a row: across the page each left most of its row empty.
        => [CreateCoverGroup(), .. DemoUI.CreateColumns([CreateProfileGroup()], [CreateInlineGroup()]), DemoUI.CreateHalf(CreateCropGroup()), DemoUI.CreateHalf(CreateShelfGroup())];

    /// <summary>
    /// A cover picture over the width of its column: a drop area while empty, the picture itself once it has one.
    /// </summary>
    private static ContainerComponent CreateCoverGroup()
    {
        return DemoUI.CreateExample("The status page's banner",
            UILayout.Row(24)
                // Two to a row at the page's width: at 520 each the second wrapped under the first.
                .AddChild(new ImageInputComponent()
                    .SetTitle("Chosen")
                    .SetWidth(UILayoutLength.Absolute(480))
                    .SetHeight(UILayoutLength.Absolute(180))
                    .SetValue(DemoImages.HarbourSky)
                    .SetFit(UIImageFit.Cover)
                )
                .AddChild(new ImageInputComponent()
                    .SetTitle("Nothing chosen yet")
                    .SetWidth(UILayoutLength.Absolute(480))
                    .SetHeight(UILayoutLength.Absolute(180))
                    .SetPlaceholder("Drop a picture here")
                    .SetBadgeText("optional")
                    .SetBadgeStyle(UIBadgeType.Info)
                ),
            columns: 24,
            note: "The same control either way: empty it is the drop area, filled it is the picture — nothing appears or disappears when a file is chosen."
        );
    }

    /// <summary>
    /// An avatar beside the name it belongs to: the picture is the whole control, the pencil appears over it.
    /// </summary>
    private static ContainerComponent CreateProfileGroup()
    {
        return DemoUI.CreateExample("A profile card",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(16)
                    .AddChild(UILayout.Row(16)
                        .AddChild(new ImageInputComponent()
                            .SetShape(UIImageInputShape.Avatar)
                            .SetTooltip("Change the photo")
                            .SetValue(DemoImages.Avatar)
                        )
                        .AddChild(UILayout.Stack(2)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .AddChild(new ParagraphComponent()
                                .SetDescription("Sam Ortega")
                                .SetDescriptionType(UITextAppearance.Subtitle)
                            )
                            .AddChild(new ParagraphComponent()
                                .SetDescription("Owner")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                        )
                    )
                    .AddChild(UIText.Label("The rest of the team, the same control at the same size"))
                    .AddChild(UILayout.Row(16)
                        .AddChild(new ImageInputComponent()
                            .SetShape(UIImageInputShape.Avatar)
                            .SetTooltip("Change the photo")
                        )
                        .AddChild(UILayout.Stack(2)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .AddChild(new ParagraphComponent()
                                .SetDescription("Robin Hale")
                                .SetDescriptionType(UITextAppearance.Subtitle)
                            )
                            .AddChild(new ParagraphComponent()
                                .SetDescription("Admin · no photo yet")
                                .SetDescriptionType(UITextAppearance.Caption)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                        )
                    )
                ),
            note: "Avatar is the shape for a picture replaced where it is read: no drop area, no filename — the pencil appears over the photo itself."
        );
    }

    /// <summary>
    /// The row shape, for a form where a picture is one field among others — an invoice's settings, outlined throughout.
    /// </summary>
    private static ContainerComponent CreateInlineGroup()
    {
        return DemoUI.CreateExample("One field among others",
            UILayout.Stack(16)
                .AddChild(new TextInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Customer")
                    .SetValue("Saltmarsh Media")
                )
                .AddChild(new ImageInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetShape(UIImageInputShape.Inline)
                    .SetTitle("Logo on invoices")
                    .SetPlaceholder("PNG or JPEG, two megabytes at most")
                    .SetAccept("image/png,image/jpeg")
                    // Refused in the browser before the upload; the endpoint's own limit still holds behind it.
                    .SetMaxFileSize(2 * 1024 * 1024)
                )
                .AddChild(new ImageInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetShape(UIImageInputShape.Inline)
                    .SetTitle("Already chosen")
                    .SetValue(DemoImages.NightStreet)
                    .SetPlaceholder("The thumbnail is the value")
                )
        );
    }

    /// <summary>
    /// A picture framed before it is sent: a profile photo under a circle, an album cover under a square — the crop dialog opens on
    /// the picture chosen, and the square under the frame is what uploads.
    /// </summary>
    private static ContainerComponent CreateCropGroup()
    {
        return DemoUI.CreateExample("Cropped before it uploads",
            UILayout.Row(32)
                .AddChild(UILayout.Row(16)
                    .AddChild(new ImageInputComponent()
                        .SetShape(UIImageInputShape.Avatar)
                        .SetCrop(UIImageCrop.Circle)
                        // An avatar is never drawn larger than this; a quarter of the default keeps the upload small.
                        .SetCropSize(256)
                        .SetTooltip("Change the photo")
                        .SetValue(DemoImages.Avatar)
                    )
                    .AddChild(UILayout.Stack(2)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new ParagraphComponent()
                            .SetDescription("Sam Ortega")
                            .SetDescriptionType(UITextAppearance.Subtitle)
                        )
                        .AddChild(new ParagraphComponent()
                            .SetDescription("Circle, 256 px")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                    )
                )
                .AddChild(new ImageInputComponent()
                    .SetTitle("Album cover")
                    .SetCrop(UIImageCrop.Square)
                    .SetWidth(UILayoutLength.Absolute(200))
                    .SetHeight(UILayoutLength.Absolute(200))
                    .SetPlaceholder("Drop a picture here")
                    .SetValue(DemoImages.SunsetRuins)
                ),
            columns: 24,
            note: "SetCrop opens a dialog on the chosen picture — drag, wheel, pinch or the slider to frame it — and uploads the square under the frame; Cancel keeps the picture as it was. The circle is a frame for an avatar: the file sent is still square."
        );
    }

    /// <summary>
    /// Several pictures at once: a square per file chosen, each with a cross under the pointer, and a square that picks more. The
    /// handles arrive on <c>SelectionIds</c>, one upload per picture, in the order they were chosen.
    /// </summary>
    private static ContainerComponent CreateShelfGroup()
    {
        return DemoUI.CreateExample("Several at once",
            new ImageInputComponent()
                .SetMultiple(true)
                .SetTitle("Incident screenshots")
                .SetPlaceholder("Drop screenshots here, or pick them"),
            columns: 24,
            note: "SetMultiple(true) turns the picture shape into a shelf; bind SelectionIds to read the pictures back, and clear it to empty the shelf."
        );
    }
}
