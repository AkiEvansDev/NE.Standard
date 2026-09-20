using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
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
        _ = container.AddChild(CreateCoverGroup());

        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateProfileGroup()],
            [CreateInlineGroup()]
        ));

        _ = container.AddChild(CreateAppearanceGroup());
        _ = container.AddChild(CreateShelfGroup());
    }

    /// <summary>
    /// An avatar beside the name it belongs to: the picture is the whole control, the pencil appears over it.
    /// </summary>
    private static ContainerComponent CreateProfileGroup()
    {
        return DemoUI.CreateGroup(null, "A profile card",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(DemoUI.CreateStack(16)
                    .AddChild(CreatePerson(DemoImages.Avatar, "Aki Evans", "Platform team · owner"))
                    .AddChild(DemoUI.CreateCaption("The rest of the team, the same control at the same size"))
                    .AddChild(CreatePerson(null, "Robin Hale", "Platform · no photo yet"))
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Avatar is the shape for a picture replaced where it is read: no drop area, no filename — the pencil appears over the photo itself."
        );
    }

    private static StackPanelComponent CreatePerson(string? photo, string name, string role)
    {
        ImageInputComponent picture = new ImageInputComponent()
            .SetShape(UIImageInputShape.Avatar)
            .SetTooltip("Change the photo");

        return DemoUI.CreateRow(16)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChild(photo is null ? picture : picture.SetValue(photo))
            .AddChild(DemoUI.CreateStack(2)
                .AddChild(new ParagraphComponent()
                    .SetDescription(name)
                    .SetDescriptionType(UITextAppearance.Subtitle)
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription(role)
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            );
    }

    /// <summary>
    /// A cover picture over the width of its column: a drop area while empty, the picture itself once it has one.
    /// </summary>
    private static ContainerComponent CreateCoverGroup()
    {
        return DemoUI.CreateGroup(null, "A cover picture",
            content => content.AddChild(DemoUI.CreateRow(24)
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
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "The same control either way: empty it is the drop area, filled it is the picture — nothing appears or disappears when a file is chosen."
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
            )
        );
    }

    /// <summary>
    /// The row shape in every appearance: only Inline reads as a field among others, so it is the one shape Filled, Outline,
    /// Underline and Ghost are worth comparing on — Avatar and Picture keep their drop-area border whatever Appearance says.
    /// </summary>
    private static ContainerComponent CreateAppearanceGroup()
    {
        return DemoUI.CreateGroup(null, "Appearances",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(CreateAppearanceSample(UIInputAppearance.Filled, DemoImages.NightStreet))
                .AddChild(CreateAppearanceSample(UIInputAppearance.Outline, null))
                .AddChild(CreateAppearanceSample(UIInputAppearance.Underline, null))
                .AddChild(CreateAppearanceSample(UIInputAppearance.Ghost, null))
            ),
            note: "Appearance dresses the inline row as it does a file input's; the picture and the avatar have one look, whatever the appearance."
        );
    }

    private static ImageInputComponent CreateAppearanceSample(UIInputAppearance appearance, string? photo)
    {
        ImageInputComponent field = new ImageInputComponent()
            .SetShape(UIImageInputShape.Inline)
            .SetAppearance(appearance)
            .SetTitle(appearance.ToString())
            .SetPlaceholder("PNG or JPEG");

        return photo is null ? field : field.SetValue(photo);
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
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "SetMultiple(true) turns the picture shape into a shelf; bind SelectionIds to read the pictures back, and clear it to empty the shelf."
        );
    }
}
