using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Contents.Image;

/// <summary>
/// The jobs a picture is given, and the one decision every one of them turns on.
/// </summary>
/// <remarks>A picture is never alone: the box is decided by the layout, and the picture has to answer to it.</remarks>
internal sealed class ImageExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.image.examples";

    protected override string ComponentRoute => "/contents/image";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.image.header";
    protected override string HeaderDescription => "demo.contents.image.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateBannerGroup(), CreateGridGroup()],
            [CreateAgainstIconGroup(), CreateAvatarGroup()]
        ));
    }

    /// <summary>
    /// A banner: a box the layout decided, filled by a picture that was never that shape, so <c>Cover</c>.
    /// </summary>
    private static ContainerComponent CreateBannerGroup()
    {
        return DemoUI.CreateGroup(null, "A band across the top of something",
            content => content.AddChild(new CardComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetPadding(UIThickness.Uniform(0))
                .SetWidth(UILayoutLength.Absolute(340))
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .AddChild(new ImageComponent()
                        .SetSource(DemoImages.SunsetRuins)
                        .SetAltText("The ruins at sunset")
                        // The card's own radius, on the two corners the picture actually touches.
                        .SetCornerRadius(UICornerRadius.Top(8))
                        .SetFit(UIImageFit.Cover)
                        .SetHeight(UILayoutLength.Absolute(140))
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                    )
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Site 12 — the west wall")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Surveyed in April. The wall is stable; the arch above it is not.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.Uniform(16))
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A face in a row: small, square and cropped rather than fitted, with a full radius for the circle.
    /// </summary>
    private static ContainerComponent CreateAvatarGroup()
    {
        return DemoUI.CreateGroup(null, "A face at the start of a row",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetWidth(UILayoutLength.Absolute(340))
                .AddChild(CreatePersonRow(DemoImages.Avatar, "Robin Hale", "Client runtime"))
                // A portrait photograph in a square box: Cover takes the middle of it.
                .AddChild(CreatePersonRow(DemoImages.NightStreet, "Alex Warren", "Rendering"))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static StackPanelComponent CreatePersonRow(string source, string name, string role)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(12)
            .AddChild(new ImageComponent()
                .SetSource(source)
                .SetAltText(name)
                .SetFit(UIImageFit.Cover)
                .SetCornerRadius(UICornerRadius.Uniform(999))
                .SetWidth(UILayoutLength.Absolute(40))
                .SetHeight(UILayoutLength.Absolute(40))
            )
            .AddChild(new TextComponent()
                .SetTitle(name)
                .SetDescription(role)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.Muted)
                .SetVerticalAlignment(UIAlignment.Center)
            );

    /// <summary>
    /// Four pictures of four shapes in four identical boxes, where only <c>Cover</c> keeps the grid a grid.
    /// </summary>
    private static ContainerComponent CreateGridGroup()
    {
        // A wrapping stack, not a WrapPanel: the panel sizes by column span, which would make the tiles a
        // fraction of the page rather than the same square.
        return DemoUI.CreateGroup(null, "Four shapes, one box",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetWrap(true)
                .SetSpacing(8)
                .AddChild(CreateTile(DemoImages.SunsetRuins))
                .AddChild(CreateTile(DemoImages.NightStreet))
                .AddChild(CreateTile(DemoImages.HarbourSky))
                .AddChild(CreateTile(DemoImages.MeteorShore))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static ImageComponent CreateTile(string source)
        => new ImageComponent()
            .SetSource(source)
            .SetFit(UIImageFit.Cover)
            .SetCornerRadius(UICornerRadius.Uniform(6))
            .SetWidth(UILayoutLength.Absolute(96))
            .SetHeight(UILayoutLength.Absolute(96));

    /// <summary>
    /// A picture as a mark, sized by the text beside it, against a picture as content, with a box of its own.
    /// </summary>
    private static ContainerComponent CreateAgainstIconGroup()
    {
        return DemoUI.CreateGroup(null, "Against an icon carrying a picture",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(DemoUI.CreateCaption("As a mark on a text body"))
                    .AddChild(new TextComponent()
                        .SetIcon(DemoImages.Logo)
                        .SetTitle("Web Portal")
                        .SetDescription("The mark takes the height of the two lines beside it")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(DemoUI.CreateCaption("As content"))
                    .AddChild(new ImageComponent()
                        .SetSource(DemoImages.Logo)
                        .SetAltText("The Web Portal mark")
                        .SetWidth(UILayoutLength.Absolute(96))
                        .SetHeight(UILayoutLength.Absolute(96))
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
