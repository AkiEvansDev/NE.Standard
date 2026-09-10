using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Contents.Separator;

/// <summary>
/// What a rule is for, and the far more common case of not needing one.
/// </summary>
/// <remarks>A rule states that two things belong to different groups, which the space between them usually already says.</remarks>
internal sealed class SeparatorExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.separator.examples";

    protected override string ComponentRoute => "/contents/separator";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.separator.header";
    protected override string HeaderDescription => "demo.contents.separator.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateSectionsGroup(), CreateRowGroup()],
            [CreateAgainstSpaceGroup(), CreateLabelledGroup()]
        ));
    }

    /// <summary>
    /// Down a column, which is what it is for: a menu, a settings panel, a form of several parts.
    /// </summary>
    private static ContainerComponent CreateSectionsGroup()
    {
        return DemoUI.CreateGroup(null, "Between two parts of a column",
            content => content.AddChild(new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(260))
                .SetPadding(UIThickness.Uniform(6))
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(2)
                    .AddChild(CreateRow(DemoIcons.Edit, "Rename"))
                    .AddChild(CreateRow(DemoIcons.Copy, "Duplicate"))
                    .AddChild(new SeparatorComponent())
                    .AddChild(CreateRow(DemoIcons.Download, "Export"))
                    .AddChild(new SeparatorComponent())
                    .AddChild(CreateRow(DemoIcons.Alert, "Delete")
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static ActionComponent CreateRow(string icon, string title)
        => new ActionComponent()
            .SetType(UIButtonType.Ghost)
            .SetSize(UIButtonSize.Small)
            .SetShowChevron(false)
            .SetIcon(DemoIcons.Outline(icon))
            .SetTitle(title);

    /// <summary>
    /// Across a row: a strip of readings, with a hairline saying each number is its own.
    /// </summary>
    private static ContainerComponent CreateRowGroup()
    {
        return DemoUI.CreateGroup(null, "Between two things on a row",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(16)
                    .AddChild(CreateReading("47", "Deploys"))
                    // A vertical rule has no content to take a height from, so it is given one.
                    .AddChild(new SeparatorComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetHeight(UILayoutLength.Absolute(38))
                    )
                    .AddChild(CreateReading("2", "Rolled back"))
                    .AddChild(new SeparatorComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetHeight(UILayoutLength.Absolute(38))
                    )
                    .AddChild(CreateReading("99.94%", "Availability"))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static TextComponent CreateReading(string value, string label)
        => new TextComponent()
            .SetTitle(value)
            .SetTitleType(UITextAppearance.Subtitle)
            .SetDescription(label)
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted);

    /// <summary>
    /// The rule carrying a word, which makes it a heading: the line runs to both edges and the caption sits in the break.
    /// </summary>
    private static ContainerComponent CreateLabelledGroup()
    {
        return DemoUI.CreateGroup(null, "A rule with a word in it",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetWidth(UILayoutLength.Absolute(320))
                    .AddChild(new TextComponent()
                        .SetTitle("Payments API")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("Two environments, eight replicas")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new SeparatorComponent()
                        .SetLabel("Danger zone")
                        .SetColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Danger)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Alert))
                        .SetTitle("Delete this service")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// The case against: space already groups, so a rule earns its ink only where there is no room to spend on space.
    /// </summary>
    private static ContainerComponent CreateAgainstSpaceGroup()
    {
        return DemoUI.CreateGroup(null, "Against the space that would do it",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(16)
                .SetWrap(true)
                .AddChild(CreateGrouping("With rules", ruled: true))
                .AddChild(CreateGrouping("With space", ruled: false))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static StackPanelComponent CreateGrouping(string caption, bool ruled)
    {
        StackPanelComponent stack = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(ruled ? 8 : 6)
            .SetWidth(UILayoutLength.Absolute(230))
            .SetVerticalAlignment(UIAlignment.Start)
            .AddChild(new TextComponent()
                .SetTitle(caption)
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
                .SetMargin(UIThickness.All(0, 0, 0, 4))
            )
            .AddChild(CreateSetting("Require review", "Before every deploy"))
            .AddChild(CreateSetting("Notify on failure", "To #releases"));

        _ = ruled
            ? stack.AddChild(new SeparatorComponent())
            : stack.AddChild(new ContainerComponent().SetHeight(UILayoutLength.Absolute(18)));

        return stack
            .AddChild(CreateSetting("Retention", "Thirty days"))
            .AddChild(CreateSetting("Replicas", "One per zone"));
    }

    private static TextComponent CreateSetting(string title, string description)
        => new TextComponent()
            .SetTitle(title)
            .SetTitleType(UITextAppearance.Body)
            .SetDescription(description)
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted);
}
