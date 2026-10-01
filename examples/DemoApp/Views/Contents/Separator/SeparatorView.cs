using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Separator;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Separator;

/// <summary>
/// One rule and every property that can be bound to it; then what a rule is for.
/// </summary>
/// <remarks>The preview draws it between two lines of text, since a rule alone in a frame makes every row unreadable; a vertical one needs the <c>Height</c> row. A rule states that two things belong to different groups, which the space between them usually already says: it earns its ink where there is no room to spend on space.</remarks>
internal sealed class SeparatorView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SeparatorGroup = nameof(SeparatorController.SeparatorGroup);

    public static string ViewKey => "demo.contents.separator";

    protected override string ComponentRoute => "/contents/separator";
    protected override string Header => "demo.contents.separator.header";
    protected override string HeaderDescription => "demo.contents.separator.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/checkout", "demo.nav.screens.checkout");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new StackPanelComponent()
            // A stack, not the frame's grid rows: a taller container hands its slack to its tracks.
            .BindOrientation($"{SeparatorGroup}.{nameof(SeparatorGroupContext.PreviewOrientation)}")
            .SetSpacing(4)
            .AddChild(new TextComponent()
                .SetTitle("Everything before the rule")
                .SetTitleType(UITextAppearance.Body)
            )
            .AddChild(new SeparatorComponent()
                .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
                .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
                .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
                .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
                .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
                .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
                .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
                .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
                .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
                .BindOrientation($"{SeparatorGroup}.{nameof(SeparatorGroupContext.Orientation)}")
                .BindLabel($"{SeparatorGroup}.{nameof(SeparatorGroupContext.Label)}")
                .BindColor($"{SeparatorGroup}.{nameof(SeparatorGroupContext.Color)}")
            )
            .AddChild(new TextComponent()
                .SetTitle("Everything after it")
                .SetTitleType(UITextAppearance.Body)
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 140);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SeparatorGroup, "Separator", nameof(SeparatorController.CycleSeparatorGroupOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // The menu beside the two short groups stacked, as tall together: paired, the labelled rule stood alone in a row of its own.
        => [CreateSectionsGroup(), DemoUI.CreateHalf(CreateRowGroup(), CreateLabelledGroup())];

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
