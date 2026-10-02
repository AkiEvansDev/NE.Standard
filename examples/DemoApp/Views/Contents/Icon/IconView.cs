using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Icon;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Icon;

/// <summary>
/// One glyph and every property that can be bound to it; then when a glyph is a component of its own rather than a property
/// of something else, and what the one string may hold.
/// </summary>
/// <remarks><c>Size</c> is the ladder a glyph climbs beside text; the standard <c>Width</c> row drives the drawing itself. Nearly every glyph is a property of something else, so what is shown here is when it is not — and the picture as an icon, for every control that carries one.</remarks>
internal sealed class IconView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string IconGroup = nameof(IconController.IconGroup);

    public static string ViewKey => "demo.contents.icon";

    protected override string ComponentRoute => "/contents/icon";
    protected override string Header => "demo.contents.icon.header";
    protected override string HeaderDescription => "demo.contents.icon.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new IconComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindIcon($"{IconGroup}.{nameof(IconGroupContext.Icon)}")
            .BindColor($"{IconGroup}.{nameof(IconGroupContext.Color)}")
            .BindSize($"{IconGroup}.{nameof(IconGroupContext.Size)}")
            .BindTooltip($"{IconGroup}.{nameof(IconGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{IconGroup}.{nameof(IconGroupContext.TooltipPlacement)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(IconGroup, "Icon", nameof(IconController.CycleIconOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // The three short groups down one half, beside the pictures as tall as they are: in pairs, a hole stood under each short one.
        => [DemoUI.CreateHalf(CreateAgainstPropertyGroup(), CreateScaleGroup(), CreateLegendGroup()), CreatePictureGroup()];

    /// <summary>
    /// The case for the component beside the case against it: a mark in a cell of its own, versus a property.
    /// </summary>
    private static ContainerComponent CreateAgainstPropertyGroup()
    {
        return DemoUI.CreateExample("A property, and a component",
            UILayout.Stack(12)
                .SetWidth(UILayoutLength.Absolute(360))
                .AddChild(UIText.Label("As a text body's property"))
                .AddChild(new TextComponent()
                    .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                    .SetTitle("Every check passed")
                    .SetDescription("The glyph belongs to the sentence and moves with it")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(new SeparatorComponent())
                .AddChild(UIText.Label("As a component"))
                // Column 1 is the glyph's own, so a column of marks lines up whatever the names beside them are.
                .AddChild(new ContainerComponent()
                    .SetColumn(1, UIGridUnit.Auto())
                    .SetRow(1, UIGridUnit.Auto())
                    .AddRow(UIGridUnit.Auto())
                    .AddChild(new IconComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                        .SetColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                        .SetMargin(UIThickness.All(0, 0, 10, 8))
                        .SetPlacement(1, 1, 1, 1)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("billing")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("Deployed 4 minutes ago")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.All(0, 0, 0, 8))
                        .SetPlacement(2, 1, 23, 1)
                    )
                    .AddChild(new IconComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Alert))
                        .SetColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetMargin(UIThickness.All(0, 0, 10, 8))
                        .SetPlacement(1, 2, 1, 1)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("dns")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("Rolled back")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.All(0, 0, 0, 8))
                        .SetPlacement(2, 2, 23, 1)
                    )
                    .SetPlacement(1, 1, 24, 1)
                )
        );
    }

    /// <summary>
    /// A picture as an icon: one string, three readings on the component — a glyph from the pack, a picture in its own colours, that
    /// picture masked — and the same string carried by a text body's <c>Icon</c> property; a person's picture drawn round by its shape.
    /// </summary>
    /// <remarks>With no size given, text content draws the picture as a square the height of the block, or a circle as tall.</remarks>
    private static ContainerComponent CreatePictureGroup()
    {
        return DemoUI.CreateExample("A picture as an icon",
            UILayout.Stack(12)
                .AddChild(UIText.Label("On the component"))
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(12)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .AddChild(new IconComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Star))
                        .SetColor(UIThemeColor.FromStyle(UIColorStyle.Default))
                        .SetWidth(UILayoutLength.Absolute(32))
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("A glyph from the pack")
                        .SetTitleType(UITextAppearance.Body)
                        .SetVerticalAlignment(UIAlignment.Center)
                    )
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(12)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .AddChild(new IconComponent()
                        .SetIcon(DemoImages.Logo)
                        // null is an unset colour, which the setter takes: a picture in its own colours asks for nothing.
                        .SetColor(null)
                        .SetWidth(UILayoutLength.Absolute(32))
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("A picture, in its own colours")
                        .SetTitleType(UITextAppearance.Body)
                        .SetVerticalAlignment(UIAlignment.Center)
                    )
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(12)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .AddChild(new IconComponent()
                        .SetIcon(DemoImages.Mask(DemoImages.Mark))
                        .SetColor(UIThemeColor.FromStyle(UIColorStyle.Accent))
                        .SetWidth(UILayoutLength.Absolute(32))
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("The same picture, masked")
                        .SetTitleType(UITextAppearance.Body)
                        .SetVerticalAlignment(UIAlignment.Center)
                    )
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(12)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .AddChild(new IconComponent()
                        .SetIcon(DemoImages.Avatar)
                        .SetShape(UIIconShape.Circle)
                        .SetColor(null)
                        .SetWidth(UILayoutLength.Absolute(32))
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("A person's picture, round")
                        .SetTitleType(UITextAppearance.Body)
                        .SetVerticalAlignment(UIAlignment.Center)
                    )
                )
                .AddChild(new SeparatorComponent())
                .AddChild(UIText.Label("On a text body — the same string in its Icon"))
                .AddChild(new TextComponent()
                    .SetIcon(DemoImages.Avatar)
                    .SetTitle("Robin Hale")
                    .SetDescription("A square photograph, no size given: a tile the block's height.")
                    .SetWrapMode(UITextWrapMode.Wrap)
                )
                .AddChild(new TextComponent()
                    .SetIcon(DemoImages.SunsetRuins)
                    .SetTitle("A landscape")
                    .SetDescription("Wider than it is tall, in the same square tile.")
                )
                // A person: the shape cuts the picture round, and a portrait fills the circle rather than hanging in it.
                .AddChild(new TextComponent()
                    .SetIcon(DemoImages.NightStreet)
                    .SetIconShape(UIIconShape.Circle)
                    .SetTitle("Alex Warren")
                    .SetDescription("IconShape Circle: a portrait, round and filling the circle.")
                    .SetWrapMode(UITextWrapMode.Wrap)
                )
                .AddChild(new TextComponent()
                    .SetIcon(DemoImages.Logo)
                    .SetTitle("A size given")
                    .SetDescription("The picture obeys it, like a glyph — no tile, no square.")
                    .SetWrapMode(UITextWrapMode.Wrap)
                    .SetIconSize(UIIconSize.Medium)
                )
                // A line that is already coloured does not get muted on top: it would fall below contrast.
                .AddChild(new TextComponent()
                    .SetIcon(DemoImages.Mask(DemoImages.Mark))
                    .SetTitle("Tinted picture")
                    .SetDescription("A monochrome SVG written as `mask:` follows the text's colour.")
                    .SetWrapMode(UITextWrapMode.Wrap)
                    .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
                ),
            note: "A picture that is content, with a box of its own rather than the height of the words beside it, is the Image component."
        );
    }

    /// <summary>
    /// The two ways of saying how big: <c>Size</c> is the ladder that goes with text, <c>Width</c> drives the drawing.
    /// </summary>
    private static ContainerComponent CreateScaleGroup()
    {
        return DemoUI.CreateExample("Beside text, and on its own",
            UILayout.Stack(12)
                .AddChild(UIText.Label("Size — the ladder that goes with text"))
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(16)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .AddChild(new IconComponent().SetIcon(DemoIcons.Outline(DemoIcons.Star)).SetSize(UIIconSize.Small))
                    .AddChild(new IconComponent().SetIcon(DemoIcons.Outline(DemoIcons.Star)).SetSize(UIIconSize.Medium))
                    .AddChild(new IconComponent().SetIcon(DemoIcons.Outline(DemoIcons.Star)).SetSize(UIIconSize.Large))
                )
                .AddChild(new SeparatorComponent())
                .AddChild(UIText.Label("Width — a mark standing on its own"))
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(16)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .AddChild(new IconComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Star))
                        .SetColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                        .SetWidth(UILayoutLength.Absolute(32))
                    )
                    .AddChild(new IconComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Star))
                        .SetColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                        .SetWidth(UILayoutLength.Absolute(48))
                    )
                    .AddChild(new IconComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Star))
                        .SetColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                        .SetWidth(UILayoutLength.Absolute(72))
                    )
                )
        );
    }

    /// <summary>
    /// A legend under a chart or a table, where neither the mark nor the words are the other's property.
    /// </summary>
    private static ContainerComponent CreateLegendGroup()
    {
        return DemoUI.CreateExample("A key to something else",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(8)
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetWrap(true)
                        .SetSpacing(10)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new IconComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                            .SetSize(UIIconSize.Small)
                        )
                        .AddChild(new TextComponent()
                            .SetTitle("Passed")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetVerticalAlignment(UIAlignment.Center)
                        )
                        .AddChild(new TextComponent()
                            .SetTitle("— every gate answered")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                            .SetVerticalAlignment(UIAlignment.Center)
                        )
                    )
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetWrap(true)
                        .SetSpacing(10)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new IconComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Clock))
                            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Warning))
                            .SetSize(UIIconSize.Small)
                        )
                        .AddChild(new TextComponent()
                            .SetTitle("Waiting")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetVerticalAlignment(UIAlignment.Center)
                        )
                        .AddChild(new TextComponent()
                            .SetTitle("— a gate has not answered yet")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                            .SetVerticalAlignment(UIAlignment.Center)
                        )
                    )
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(10)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new IconComponent()
                            .SetIcon(DemoIcons.Outline(DemoIcons.Alert))
                            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                            .SetSize(UIIconSize.Small)
                        )
                        .AddChild(new TextComponent()
                            .SetTitle("Refused")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetVerticalAlignment(UIAlignment.Center)
                        )
                        .AddChild(new TextComponent()
                            .SetTitle("— a gate answered no")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                            .SetVerticalAlignment(UIAlignment.Center)
                        )
                    )
                )
        );
    }
}
