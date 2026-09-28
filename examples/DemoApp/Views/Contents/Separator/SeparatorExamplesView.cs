using DemoApp.Views.Base;

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
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateSectionsGroup(), CreateRowGroup()], [CreateAgainstSpaceGroup(), CreateLabelledGroup()]));

    /// <summary>
    /// Down a column, which is what it is for: a menu, a settings panel, a form of several parts.
    /// </summary>
    private static ContainerComponent CreateSectionsGroup()
    {
        return DemoUI.CreateExample("Between two parts of a column",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(260))
                .SetPadding(UIThickness.Uniform(6))
                .SetContent(UILayout.Stack(2)
                    .AddChild(new ActionComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetShowChevron(false)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Edit))
                        .SetTitle("Rename")
                    )
                    .AddChild(new ActionComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetShowChevron(false)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                        .SetTitle("Duplicate")
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(new ActionComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetShowChevron(false)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                        .SetTitle("Export")
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(new ActionComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetShowChevron(false)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Alert))
                        .SetTitle("Delete")
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    )
                )
        );
    }

    /// <summary>
    /// Across a row: a strip of readings, with a hairline saying each number is its own.
    /// </summary>
    private static ContainerComponent CreateRowGroup()
    {
        return DemoUI.CreateExample("Between two things on a row",
            new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetWrap(true)
                    .SetSpacing(16)
                    .AddChild(new TextComponent()
                        .SetTitle("47")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Deploys")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    // A vertical rule has no content to take a height from, so it is given one.
                    .AddChild(new SeparatorComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetHeight(UILayoutLength.Absolute(38))
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("2")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Rolled back")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new SeparatorComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetHeight(UILayoutLength.Absolute(38))
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("99.94%")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("Availability")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
        );
    }

    /// <summary>
    /// The case against: space already groups, so a rule earns its ink only where there is no room to spend on space.
    /// </summary>
    private static ContainerComponent CreateAgainstSpaceGroup()
    {
        return DemoUI.CreateExample("Against the space that would do it",
            UILayout.Row(16)
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(8)
                    .SetWidth(UILayoutLength.Absolute(230))
                    .SetVerticalAlignment(UIAlignment.Start)
                    .AddChild(new TextComponent()
                        .SetTitle("With rules")
                        .SetTitleType(UITextAppearance.Overline)
                        .SetTitleColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.All(0, 0, 0, 4))
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Daily backups")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("At 03:00, region time")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Notify on failure")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("To on-call")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(new TextComponent()
                        .SetTitle("Retention")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("Thirty days")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Public IPv4")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("One per server")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(6)
                    .SetWidth(UILayoutLength.Absolute(230))
                    .SetVerticalAlignment(UIAlignment.Start)
                    .AddChild(new TextComponent()
                        .SetTitle("With space")
                        .SetTitleType(UITextAppearance.Overline)
                        .SetTitleColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.All(0, 0, 0, 4))
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Daily backups")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("At 03:00, region time")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Notify on failure")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("To on-call")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new ContainerComponent().SetHeight(UILayoutLength.Absolute(18)))
                    .AddChild(new TextComponent()
                        .SetTitle("Retention")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("Thirty days")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Public IPv4")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("One per server")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
        );
    }

    /// <summary>
    /// The rule carrying a word, which makes it a heading: the line runs to both edges and the caption sits in the break.
    /// </summary>
    private static ContainerComponent CreateLabelledGroup()
    {
        return DemoUI.CreateExample("A rule with a word in it",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(12)
                    .SetWidth(UILayoutLength.Absolute(320))
                    .AddChild(new TextComponent()
                        .SetTitle("Billing")
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescription("Two regions, eight replicas")
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
        );
    }
}
