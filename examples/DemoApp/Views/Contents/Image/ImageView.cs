using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Image;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Image;

/// <summary>
/// One picture and every property that can be bound to it; then the jobs a picture is given, and the one decision every one
/// of them turns on.
/// </summary>
/// <remarks>The preview is given a box of its own, since every question an image answers is about a box that is not its shape: a picture is never alone, the box is decided by the layout, and the picture has to answer to it. A picture as a text's mark is the Icon page's.</remarks>
internal sealed class ImageView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ImageGroup = nameof(ImageController.ImageGroup);

    public static string ViewKey => "demo.contents.image";

    protected override string ComponentRoute => "/contents/image";
    protected override string Header => "demo.contents.image.header";
    protected override string HeaderDescription => "demo.contents.image.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/catalogue", "demo.nav.screens.catalogue");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ImageComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSource($"{ImageGroup}.{nameof(ImageGroupContext.Source)}")
            .BindFit($"{ImageGroup}.{nameof(ImageGroupContext.Fit)}")
            .BindCornerRadius($"{ImageGroup}.{nameof(ImageGroupContext.CornerRadius)}")
            .BindAltText($"{ImageGroup}.{nameof(ImageGroupContext.AltText)}")
            .BindTooltip($"{ImageGroup}.{nameof(ImageGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ImageGroup}.{nameof(ImageGroupContext.TooltipPlacement)}")
            // The preview's own box, not a row; Width and Height stay the standard rows and work inside it.
            .SetMaxWidth(UILayoutLength.Absolute(320))
            .SetMaxHeight(UILayoutLength.Absolute(180))
            // Not bindable: a source that does not resolve draws this instead of a broken picture.
            .SetFallbackSource(DemoImages.Logo)
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ImageGroup, "Image", nameof(ImageController.CycleImageOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // The banner beside the two short groups stacked, as tall together: paired, the faces stood alone in a row of their own.
        => [CreateBannerGroup(), DemoUI.CreateHalf(CreateGridGroup(), CreateAvatarGroup())];

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
