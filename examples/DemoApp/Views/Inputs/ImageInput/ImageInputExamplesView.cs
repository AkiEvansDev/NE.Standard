using DemoApp.Controllers.Inputs.ImageInput;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.ImageInput;

/// <summary>
/// The three shapes in the places they are made for, and the states each of them can be in.
/// </summary>
/// <remarks>Two groups read an upload back: the sticker the controller keeps and clears, and the composer's shelf Send empties.</remarks>
internal sealed class ImageInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string StickerGroup = nameof(ImageInputExamplesController.StickerGroup);
    private const string ComposerGroup = nameof(ImageInputExamplesController.ComposerGroup);

    /// <summary>The shelf's id, which the clip opens the chooser of.</summary>
    private const string AttachmentsId = "demo-image-input-attachments";

    /// <summary>The composer's panel, where dropped and pasted pictures land on the shelf.</summary>
    private const string ComposerPanelId = "demo-image-input-composer-panel";

    public static string ViewKey => "demo.inputs.image-input.examples";

    protected override string ComponentRoute => "/inputs/image-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.image-input.header";
    protected override string HeaderDescription => "demo.inputs.image-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(CreateCoverGroup());

        _ = container.AddChildren(DemoUI.CreateColumns([CreateProfileGroup()], [CreateInlineGroup()]));

        _ = container.AddChild(CreateAppearanceGroup());
        _ = container.AddChild(CreateShelfGroup());

        _ = container.AddChildren(DemoUI.CreateColumns([CreateStickerGroup()], [CreateComposerGroup()]));
    }

    /// <summary>
    /// A cover picture over the width of its column: a drop area while empty, the picture itself once it has one.
    /// </summary>
    private static ContainerComponent CreateCoverGroup()
    {
        return DemoUI.CreateExample("The status page's banner",
            UILayout.Row(24)
                .AddChild(new ImageInputComponent()
                    .SetTitle("Chosen")
                    .SetWidth(UILayoutLength.Absolute(520))
                    .SetHeight(UILayoutLength.Absolute(180))
                    .SetValue(DemoImages.HarbourSky)
                    .SetFit(UIImageFit.Cover)
                )
                .AddChild(new ImageInputComponent()
                    .SetTitle("Nothing chosen yet")
                    .SetWidth(UILayoutLength.Absolute(520))
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
    /// The row shape, for a form where a picture is one field among others.
    /// </summary>
    private static ContainerComponent CreateInlineGroup()
    {
        return DemoUI.CreateExample("One field among others",
            UILayout.Stack(16)
                .AddChild(new TextInputComponent()
                    .SetTitle("Customer")
                    .SetValue("Saltmarsh Media")
                )
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Inline)
                    .SetTitle("Logo on invoices")
                    .SetPlaceholder("PNG or JPEG, two megabytes at most")
                    .SetAccept("image/png,image/jpeg")
                    // Refused in the browser before the upload; the endpoint's own limit still holds behind it.
                    .SetMaxFileSize(2 * 1024 * 1024)
                )
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Inline)
                    .SetTitle("Already chosen")
                    .SetValue(DemoImages.NightStreet)
                    .SetPlaceholder("The thumbnail is the value")
                )
        );
    }

    /// <summary>
    /// The row shape in every appearance: only Inline reads as a field among others, so it is the one shape Filled, Outline,
    /// Underline and Ghost are worth comparing on — Avatar and Picture keep their drop-area border whatever Appearance says.
    /// </summary>
    private static ContainerComponent CreateAppearanceGroup()
    {
        return DemoUI.CreateExample("Appearances",
            UILayout.Stack(16)
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Inline)
                    .SetAppearance(UIInputAppearance.Filled)
                    .SetTitle("Filled")
                    .SetPlaceholder("PNG or JPEG")
                    .SetValue(DemoImages.NightStreet)
                )
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Inline)
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Outline")
                    .SetPlaceholder("PNG or JPEG")
                )
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Inline)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitle("Underline")
                    .SetPlaceholder("PNG or JPEG")
                )
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Inline)
                    .SetAppearance(UIInputAppearance.Ghost)
                    .SetTitle("Ghost")
                    .SetPlaceholder("PNG or JPEG")
                ),
            note: "Appearance dresses the inline row as it does a file input's; the picture and the avatar have one look, whatever the appearance."
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

    /// <summary>
    /// Adding a sticker: one picture of 1 MB at most, which the controller stores and then empties the input of by writing its handle
    /// back to null.
    /// </summary>
    private static ContainerComponent CreateStickerGroup()
    {
        return DemoUI.CreateExample("Add a sticker",
            UILayout.Stack(12)
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Inline)
                    .SetTitle("Sticker")
                    .SetPlaceholder("PNG, JPEG or WebP, 1 MB at most")
                    .SetAccept("image/png,image/jpeg,image/webp")
                    .SetMaxFileSize(1024 * 1024)
                    .BindSelectionId(nameof(StickerGroupContext.PickedId), UIBindingScope.Relative)
                    .OnChange(nameof(ImageInputExamplesController.TakeStickerAsync))
                )
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(StickerGroupContext.Stickers), UIBindingScope.Relative)
                    .SetLayoutType(UIItemsLayoutType.Wrap)
                    .SetSpacing(8)
                    .SetTemplate(new ImageComponent()
                        .BindSource(nameof(DemoStickerItem.Source), UIBindingScope.Relative)
                        .SetAltText("Sticker")
                        .SetFit(UIImageFit.Contain)
                        .SetWidth(UILayoutLength.Absolute(72))
                        .SetHeight(UILayoutLength.Absolute(72))
                    )
                ),
            note: "Pick a picture: the controller keeps it on the shelf below and writes `SelectionId = null`, which empties the input — preview, name and handle. A file over 1 MB is refused on the field's validation line, in the page's language, and nothing is sent.",
            context: StickerGroup
        );
    }

    /// <summary>
    /// A messenger's way of attaching: the clip opens the chooser at once, the files wait above the text — a picture as its thumbnail,
    /// anything else as its kind's glyph — and Send takes them with it.
    /// </summary>
    private static ContainerComponent CreateComposerGroup()
    {
        return DemoUI.CreateExample("Attach like a messenger",
            UILayout.Stack(8)
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(ComposerGroupContext.Messages), UIBindingScope.Relative)
                    .SetSpacing(8)
                    .SetScrollAnchor(UIScrollAnchor.End)
                    .SetMaxHeight(UILayoutLength.Absolute(200))
                    .SetTemplate(new TextComponent()
                        .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Muted)
                        .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                        .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                    )
                )
                .AddChild(new ImageInputComponent(AttachmentsId)
                    .SetShape(UIImageInputShape.Shelf)
                    .SetAccept(string.Empty)
                    .SetMaxFileSize(5 * 1024 * 1024)
                    .SetDropTargetId(ComposerPanelId)
                    .BindSelectionIds(nameof(ComposerGroupContext.AttachmentIds), UIBindingScope.Relative)
                )
                .AddChild(new ContainerComponent(ComposerPanelId)
                    .AddChild(new TextAreaComponent()
                        .SetPlaceholder("Write a message, or drop files here")
                        .SetRows(1)
                        .SetAutoGrow(6)
                        .BindValue(nameof(ComposerGroupContext.Draft), UIBindingScope.Relative)
                        // In the press itself, not from a command: a browser opens a chooser only inside the reader's own gesture.
                        .AddLeadingAction(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Attach))
                            .SetTooltip("Attach pictures or files")
                            .InteractOn(EventNames.Click, new OpenPickerEffect(AttachmentsId))
                        )
                        .AddTrailingAction(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                            .SetTooltip("Send")
                            .OnClick(nameof(ImageInputExamplesController.SendAsync))
                        )
                    )
                ),
            note: "The clip opens the system's chooser at once (`OpenPickerEffect` in the press); what is picked waits above the text, a picture as its thumbnail and any other file as its kind's glyph over its name (an empty `Accept` takes any file), each with its remove and its upload's progress — the shelf is not on the page until something is attached. "
                + "Drop files on the composer, or paste a screenshot into it, and they join the shelf (`SetDropTargetId`); a paste of plain text stays the field's. Send reads `SelectionIds` and writes it back empty.",
            context: ComposerGroup
        );
    }
}
