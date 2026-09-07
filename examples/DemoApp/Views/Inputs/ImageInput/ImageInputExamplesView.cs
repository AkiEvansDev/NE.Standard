using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.ImageInput;

/// <summary>
/// The three shapes in the places they are made for, and the states each of them can be in.
/// </summary>
/// <remarks>Nothing here reads an upload back; that needs a controller and lives on the Main page.</remarks>
internal sealed class ImageInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.image-input.examples";

    protected override string ComponentRoute => "/inputs/image-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.image-input.header";
    protected override string HeaderDescription => "demo.inputs.image-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateProfileGroup(), CreateInlineGroup(), CreateShelfGroup()],
            [CreateCoverGroup(), CreateStateGroup()]
        ));
    }

    /// <summary>
    /// An avatar beside the name it belongs to: the picture is the whole control, the pencil appears over it.
    /// </summary>
    private static ContainerComponent CreateProfileGroup()
    {
        return DemoUI.CreateGroup(null, "A profile card",
            content => content.AddChild(DemoUI.CreateRow(16)
                .SetVerticalAlignment(UIAlignment.Center)
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Avatar)
                    .SetValue(DemoImages.Avatar)
                    .SetTooltip("Change the photo")
                )
                .AddChild(DemoUI.CreateStack(2)
                    .AddChild(new ParagraphComponent()
                        .SetDescription("Aki Evans")
                        .SetDescriptionType(UITextAppearance.Subtitle)
                    )
                    .AddChild(new ParagraphComponent()
                        .SetDescription("Platform team · owner")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
            ),
            contentMinHeight: 160
        );
    }

    /// <summary>
    /// A cover picture over the width of its column: a drop area while empty, the picture itself once it has one.
    /// </summary>
    private static ContainerComponent CreateCoverGroup()
    {
        return DemoUI.CreateGroup(null, "A cover picture",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new ImageInputComponent()
                    .SetTitle("Cover")
                    .SetValue(DemoImages.HarbourSky)
                    .SetFit(UIImageFit.Cover)
                )
                .AddChild(new ImageInputComponent()
                    .SetTitle("Nothing chosen yet")
                    .SetPlaceholder("Drop a picture here")
                    .SetBadgeText("optional")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
            ),
            contentMinHeight: 500
        );
    }

    /// <summary>
    /// The row shape, for a form where a picture is one field among others.
    /// </summary>
    private static ContainerComponent CreateInlineGroup()
    {
        return DemoUI.CreateGroup(null, "One field among others",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new TextInputComponent()
                    .SetTitle("Product name")
                    .SetValue("Harbour lamp")
                )
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Inline)
                    .SetTitle("Product picture")
                    .SetPlaceholder("PNG or JPEG")
                    .SetAccept("image/png,image/jpeg")
                )
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Inline)
                    .SetTitle("Already chosen")
                    .SetValue(DemoImages.NightStreet)
                    .SetPlaceholder("The thumbnail is the value")
                )
            ),
            contentMinHeight: 280
        );
    }

    /// <summary>
    /// Several pictures at once: a square per file chosen, each with a cross under the pointer, and a square that picks more. The
    /// handles arrive on <c>SelectionIds</c>, one upload per picture, in the order they were chosen.
    /// </summary>
    private static ContainerComponent CreateShelfGroup()
    {
        return DemoUI.CreateGroup(null, "Several at once",
            content => content.AddChild(new ImageInputComponent()
                .SetMultiple(true)
                .SetTitle("Gallery")
                .SetPlaceholder("Drop pictures here, or pick them")
            ),
            contentMinHeight: 200,
            note: "SetMultiple(true) turns the picture shape into a shelf; bind SelectionIds to read the pictures back, and clear it to empty the shelf."
        );
    }

    /// <summary>The stand-in glyphs and the states: read-only keeps the picture and takes away the pencil, disabled greys it.</summary>
    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "Placeholders and states",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(DemoUI.CreateRow(16)
                    .AddChild(new ImageInputComponent()
                        .SetShape(UIImageInputShape.Avatar)
                        .SetTitle("Own glyph")
                    )
                    .AddChild(new ImageInputComponent()
                        .SetShape(UIImageInputShape.Avatar)
                        .SetTitle("Named icon")
                        .SetPlaceholderIcon(DemoIcons.Outline(DemoIcons.Groups))
                    )
                    .AddChild(new ImageInputComponent()
                        .SetShape(UIImageInputShape.Avatar)
                        .SetTitle("Read-only")
                        .SetValue(DemoImages.Avatar)
                        .SetIsReadOnly(true)
                    )
                    .AddChild(new ImageInputComponent()
                        .SetShape(UIImageInputShape.Avatar)
                        .SetTitle("Disabled")
                        .SetValue(DemoImages.Avatar)
                        .SetEnabled(false)
                    )
                )
                .AddChild(new ImageInputComponent()
                    .SetTitle("Contained rather than covered")
                    .SetValue(DemoImages.NightStreet)
                    .SetFit(UIImageFit.Contain)
                    .SetHeight(UILayoutLength.Absolute(200))
                )
            ),
            contentMinHeight: 400
        );
    }
}
