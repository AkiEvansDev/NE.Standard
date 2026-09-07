using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

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
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateAgainstPropertyGroup(), CreateScaleGroup()],
            [CreateMarkGroup(), CreateLegendGroup()]
        ));
    }

    /// <summary>
    /// The case for the component beside the case against it: a mark in a cell of its own, versus a property.
    /// </summary>
    private static ContainerComponent CreateAgainstPropertyGroup()
    {
        return DemoUI.CreateGroup(null, "A property, and a component",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetWidth(UILayoutLength.Absolute(360))
                .AddChild(DemoUI.CreateCaption("As a text body's property"))
                .AddChild(new TextComponent()
                    .SetIcon(DemoIcons.Outline(DemoIcons.Check))
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                    .SetTitle("Every check passed")
                    .SetDescription("The glyph belongs to the sentence and moves with it")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(new SeparatorComponent())
                .AddChild(DemoUI.CreateCaption("As a component"))
                // Column 1 is the glyph's own, so a column of marks lines up whatever the names beside them are.
                .AddChild(new ContainerComponent()
                    .SetColumn(1, UIGridUnit.Auto())
                    .SetRow(1, UIGridUnit.Auto())
                    .AddRow(UIGridUnit.Auto())
                    .AddChild(CreateStatusMark(DemoIcons.Check, UIColorStyle.Success, 1))
                    .AddChild(CreateStatusText("payments-api", "Deployed 4 minutes ago", 1))
                    .AddChild(CreateStatusMark(DemoIcons.Alert, UIColorStyle.Danger, 2))
                    .AddChild(CreateStatusText("search-index", "Rolled back", 2))
                    .SetPlacement(1, 1, 24, 1)
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static IconComponent CreateStatusMark(string icon, UIColorStyle style, int row)
        => new IconComponent()
            .SetIcon(DemoIcons.Outline(icon))
            .SetColor(UIThemeColor.FromStyle(style))
            .SetMargin(UIThickness.All(0, 0, 10, 8))
            .SetPlacement(1, row, 1, 1);

    private static TextComponent CreateStatusText(string title, string description, int row)
        => new TextComponent()
            .SetTitle(title)
            .SetTitleType(UITextAppearance.Body)
            .SetDescription(description)
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted)
            .SetMargin(UIThickness.All(0, 0, 0, 8))
            .SetPlacement(2, row, 23, 1);

    /// <summary>
    /// The two ways of saying how big: <c>Size</c> is the ladder that goes with text, <c>Width</c> drives the drawing.
    /// </summary>
    private static ContainerComponent CreateScaleGroup()
    {
        return DemoUI.CreateGroup(null, "Beside text, and on its own",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .AddChild(DemoUI.CreateCaption("Size — the ladder that goes with text"))
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(16)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .AddChild(new IconComponent().SetIcon(DemoIcons.Outline(DemoIcons.Star)).SetSize(UIIconSize.Small))
                    .AddChild(new IconComponent().SetIcon(DemoIcons.Outline(DemoIcons.Star)).SetSize(UIIconSize.Medium))
                    .AddChild(new IconComponent().SetIcon(DemoIcons.Outline(DemoIcons.Star)).SetSize(UIIconSize.Large))
                )
                .AddChild(new SeparatorComponent())
                .AddChild(DemoUI.CreateCaption("Width — a mark standing on its own"))
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(16)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .AddChild(CreateScaledMark(32))
                    .AddChild(CreateScaledMark(48))
                    .AddChild(CreateScaledMark(72))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static IconComponent CreateScaledMark(double width)
        => new IconComponent()
            .SetIcon(DemoIcons.Outline(DemoIcons.Star))
            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
            .SetWidth(UILayoutLength.Absolute(width));

    /// <summary>
    /// One string, three readings: a glyph from the pack, a picture in its own colours, and that picture masked.
    /// </summary>
    private static ContainerComponent CreateMarkGroup()
    {
        return DemoUI.CreateGroup(null, "What the one string may hold",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .AddChild(CreateReading("A glyph from the pack", DemoIcons.Outline(DemoIcons.Star), UIColorStyle.Default))
                .AddChild(CreateReading("A picture, in its own colours", DemoImages.Logo, null))
                .AddChild(CreateReading("The same picture, masked", DemoImages.Mask(DemoImages.Mark), UIColorStyle.Accent))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    // null is an unset colour, which the setter takes: a picture in its own colours asks for nothing.
    private static StackPanelComponent CreateReading(string label, string icon, UIColorStyle? color)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(12)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChild(new IconComponent()
                .SetIcon(icon)
                .SetColor(color is UIColorStyle style ? UIThemeColor.FromStyle(style) : null)
                .SetWidth(UILayoutLength.Absolute(32))
            )
            .AddChild(new TextComponent()
                .SetTitle(label)
                .SetTitleType(UITextAppearance.Body)
                .SetVerticalAlignment(UIAlignment.Center)
            );

    /// <summary>
    /// A legend under a chart or a table, where neither the mark nor the words are the other's property.
    /// </summary>
    private static ContainerComponent CreateLegendGroup()
    {
        return DemoUI.CreateGroup(null, "A key to something else",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(8)
                    .AddChild(CreateLegendRow(DemoIcons.Check, UIColorStyle.Success, "Passed", "every gate answered"))
                    .AddChild(CreateLegendRow(DemoIcons.Clock, UIColorStyle.Warning, "Waiting", "a gate has not answered yet"))
                    .AddChild(CreateLegendRow(DemoIcons.Alert, UIColorStyle.Danger, "Refused", "a gate answered no"))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static StackPanelComponent CreateLegendRow(string icon, UIColorStyle style, string term, string definition)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(10)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChild(new IconComponent()
                .SetIcon(DemoIcons.Outline(icon))
                .SetColor(UIThemeColor.FromStyle(style))
                .SetSize(UIIconSize.Small)
            )
            .AddChild(new TextComponent()
                .SetTitle(term)
                .SetTitleType(UITextAppearance.Caption)
                .SetVerticalAlignment(UIAlignment.Center)
            )
            .AddChild(new TextComponent()
                .SetTitle("— " + definition)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.Muted)
                .SetVerticalAlignment(UIAlignment.Center)
            );
}
