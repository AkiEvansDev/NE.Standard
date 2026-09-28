using DemoApp.Views.Base;

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
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateBannerGroup(), CreateGridGroup()], [CreateAgainstIconGroup(), CreateAvatarGroup()]));

    /// <summary>
    /// A banner: a box the layout decided, filled by a picture that was never that shape, so <c>Cover</c>.
    /// </summary>
    private static ContainerComponent CreateBannerGroup()
    {
        return DemoUI.CreateExample("A band across the top of something",
            new CardComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetPadding(UIThickness.Uniform(0))
                .SetWidth(UILayoutLength.Absolute(340))
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .AddChild(new ImageComponent()
                        .SetSource(DemoImages.SunsetRuins)
                        .SetAltText("Europe North's banner")
                        // The card's own radius, on the two corners the picture actually touches.
                        .SetCornerRadius(UICornerRadius.Top(8))
                        .SetFit(UIImageFit.Cover)
                        .SetHeight(UILayoutLength.Absolute(140))
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                    )
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Europe North — Stockholm")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Opened in 2023. Every plan from Starter to Dedicated is sold here.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.Uniform(16))
                    )
                )
        );
    }

    /// <summary>
    /// Four pictures of four shapes in four identical boxes, where only <c>Cover</c> keeps the grid a grid.
    /// </summary>
    private static ContainerComponent CreateGridGroup()
    {
        // A wrapping stack, not a WrapPanel: the panel sizes by column span, which would make the tiles a
        // fraction of the page rather than the same square.
        return DemoUI.CreateExample("Four shapes, one box",
            new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetWrap(true)
                .SetSpacing(8)
                .AddChild(new ImageComponent()
                    .SetSource(DemoImages.SunsetRuins)
                    .SetFit(UIImageFit.Cover)
                    .SetCornerRadius(UICornerRadius.Uniform(6))
                    .SetWidth(UILayoutLength.Absolute(96))
                    .SetHeight(UILayoutLength.Absolute(96))
                )
                .AddChild(new ImageComponent()
                    .SetSource(DemoImages.NightStreet)
                    .SetFit(UIImageFit.Cover)
                    .SetCornerRadius(UICornerRadius.Uniform(6))
                    .SetWidth(UILayoutLength.Absolute(96))
                    .SetHeight(UILayoutLength.Absolute(96))
                )
                .AddChild(new ImageComponent()
                    .SetSource(DemoImages.HarbourSky)
                    .SetFit(UIImageFit.Cover)
                    .SetCornerRadius(UICornerRadius.Uniform(6))
                    .SetWidth(UILayoutLength.Absolute(96))
                    .SetHeight(UILayoutLength.Absolute(96))
                )
                .AddChild(new ImageComponent()
                    .SetSource(DemoImages.MeteorShore)
                    .SetFit(UIImageFit.Cover)
                    .SetCornerRadius(UICornerRadius.Uniform(6))
                    .SetWidth(UILayoutLength.Absolute(96))
                    .SetHeight(UILayoutLength.Absolute(96))
                )
        );
    }

    /// <summary>
    /// A picture as a mark, sized by the text beside it, against a picture as content, with a box of its own.
    /// </summary>
    private static ContainerComponent CreateAgainstIconGroup()
    {
        return DemoUI.CreateExample("Against an icon carrying a picture",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(12)
                    .AddChild(UIText.Label("As a mark on a text body"))
                    .AddChild(new TextComponent()
                        .SetIcon(DemoImages.Logo)
                        .SetTitle("Orvane Cloud")
                        .SetDescription("The mark takes the height of the two lines beside it")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(UIText.Label("As content"))
                    .AddChild(new ImageComponent()
                        .SetSource(DemoImages.Logo)
                        .SetAltText("The Orvane Cloud mark")
                        .SetWidth(UILayoutLength.Absolute(96))
                        .SetHeight(UILayoutLength.Absolute(96))
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
        );
    }

    /// <summary>
    /// A face in a row: small, square and cropped rather than fitted, with a full radius for the circle.
    /// </summary>
    private static ContainerComponent CreateAvatarGroup()
    {
        return DemoUI.CreateExample("A face at the start of a row",
            UILayout.Stack(12)
                .SetWidth(UILayoutLength.Absolute(340))
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(12)
                    .AddChild(new ImageComponent()
                        .SetSource(DemoImages.Avatar)
                        .SetAltText("Robin Hale")
                        .SetFit(UIImageFit.Cover)
                        .SetCornerRadius(UICornerRadius.Uniform(999))
                        .SetWidth(UILayoutLength.Absolute(40))
                        .SetHeight(UILayoutLength.Absolute(40))
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Robin Hale")
                        .SetDescription("Admin")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetVerticalAlignment(UIAlignment.Center)
                    )
                )
                // A portrait photograph in a square box: Cover takes the middle of it.
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(12)
                    .AddChild(new ImageComponent()
                        .SetSource(DemoImages.NightStreet)
                        .SetAltText("Alex Warren")
                        .SetFit(UIImageFit.Cover)
                        .SetCornerRadius(UICornerRadius.Uniform(999))
                        .SetWidth(UILayoutLength.Absolute(40))
                        .SetHeight(UILayoutLength.Absolute(40))
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Alex Warren")
                        .SetDescription("Admin")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetVerticalAlignment(UIAlignment.Center)
                    )
                )
        );
    }
}
