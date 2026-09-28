using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Icon;

/// <summary>
/// When a glyph is a component of its own rather than a property of something else.
/// </summary>
/// <remarks>Nearly every glyph is a property of something else, so what is shown here is when it is not.</remarks>
internal sealed class IconExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.icon.examples";

    protected override string ComponentRoute => "/contents/icon";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.icon.header";
    protected override string HeaderDescription => "demo.contents.icon.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateAgainstPropertyGroup(), CreateScaleGroup()], [CreateMarkGroup(), CreateLegendGroup()]));

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
    /// One string, three readings: a glyph from the pack, a picture in its own colours, and that picture masked.
    /// </summary>
    private static ContainerComponent CreateMarkGroup()
    {
        return DemoUI.CreateExample("What the one string may hold",
            UILayout.Stack(12)
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
