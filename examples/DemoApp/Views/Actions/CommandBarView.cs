using System.Collections.Generic;
using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;

namespace DemoApp.Views.Actions;

/// <summary>
/// One command bar, and every property that can be bound to it; then where a row of buttons goes, and the reason it is a bar over
/// a collection rather than buttons placed by hand: the buttons come from state.
/// </summary>
/// <remarks>
/// The bar has four rows; the rest step one of its buttons. <c>Wrap</c> is read with the Standard section's <c>Width</c>. Every
/// example bar is bound and reports through a single command that names the button pressed.
/// </remarks>
internal sealed class CommandBarView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string BarGroup = nameof(CommandBarController.BarGroup);
    private const string ToolbarGroup = nameof(CommandBarController.ToolbarGroup);
    private const string RailGroup = nameof(CommandBarController.RailGroup);
    private const string DeployGroup = nameof(CommandBarController.DeployGroup);

    public static string ViewKey => "demo.actions.command-bar";

    protected override string ComponentRoute => "/actions/command-bar";
    protected override string Header => "demo.actions.command-bar.header";
    protected override string HeaderDescription => "demo.actions.command-bar.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new CommandBarComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindOrientation($"{BarGroup}.{nameof(CommandBarGroupContext.Orientation)}")
            .BindWrap($"{BarGroup}.{nameof(CommandBarGroupContext.Wrap)}")
            .BindSpacing($"{BarGroup}.{nameof(CommandBarGroupContext.Spacing)}")
            .BindGroupSeparator($"{BarGroup}.{nameof(CommandBarGroupContext.GroupSeparator)}")
            .BindItems($"{BarGroup}.{nameof(CommandBarGroupContext.Commands)}")
            .OnItemClickWithItemKey(nameof(CommandBarController.Press))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(BarGroup, "Command bar", nameof(CommandBarController.CycleBarGroupOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // The toolbar beside the rail, the deploy across the page: paired, it stood alone in a row of its own.
        => [.. DemoUI.CreateColumns([CreateToolbarGroup()], [CreateRailGroup()]), CreateDeployGroup()];

    /// <summary>
    /// A strip of small ghost buttons over the thing they act on, in groups with a rule between them, the destructive one last.
    /// </summary>
    private static ContainerComponent CreateToolbarGroup()
    {
        return DemoUI.CreateExample("A toolbar over a document",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetContent(UILayout.Stack(8)
                    .AddChild(new CommandBarComponent()
                        .SetSpacing(2)
                        .SetGroupSeparator(UIGroupSeparator.Rule)
                        .BindItems(nameof(CommandListGroupContext.Commands), UIBindingScope.Relative)
                        .OnItemClickWithItemKey(nameof(CommandBarController.PressToolbar))
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Rollout plan")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("The rollout pauses itself if the error rate doubles in any region. Staging goes first, then one production region an hour.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                ),
            context: ToolbarGroup,
            note: "A row of tools that never changes needs no collection: UIButtons.Toolbar lays fixed buttons out the same way, and the inbox under Screens wears one over the open message."
        );
    }

    /// <summary>
    /// The reason it is a collection: a failed deploy swaps promote for retry, and the bar just redraws.
    /// </summary>
    private static ContainerComponent CreateDeployGroup()
    {
        return DemoUI.CreateExample("The actions a deploy offers",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetContent(UILayout.Stack(12)
                    .AddChild(new TextComponent()
                        .SetIcon(DemoIcons.Upload)
                        .SetTitle("billing · #481")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("eu-west · started 14:02")
                        .BindBadgeText(nameof(DeployActionsGroupContext.State), UIBindingScope.Relative)
                        .BindBadgeStyle(nameof(DeployActionsGroupContext.StateStyle), UIBindingScope.Relative)
                    )
                    .AddChild(new CommandBarComponent()
                        .SetSpacing(8)
                        .BindItems(nameof(DeployActionsGroupContext.Actions), UIBindingScope.Relative)
                        .OnItemClickWithItemKey(nameof(CommandBarController.PressDeployAction))
                    )
                ),
            context: DeployGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Fail the deploy"] = nameof(CommandBarController.FailDeploy),
                ["Succeed"] = nameof(CommandBarController.SucceedDeploy),
            }),
            // Across the page: the bar keeps the room its labels need beside the column of controls, which at half the page it did not.
            columns: 24
        );
    }

    /// <summary>
    /// The same strip turned on its side: a rail of glyph buttons beside the thing they act on.
    /// </summary>
    private static ContainerComponent CreateRailGroup()
    {
        return DemoUI.CreateExample("A rail beside a message",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                // A grid, not a stack: the message takes what is going and the rail takes what it needs.
                .SetContent(new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    .AddChild(new ParagraphComponent()
                        .SetIcon(DemoImages.Avatar)
                        .SetIconShape(UIIconShape.Circle)
                        .SetTitle("Grace")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("The eu-west rollout is paused — error rate doubled at 14:07. I have the logs open if anyone wants to look before we roll back.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetMargin(UIThickness.All(0, 0, 16, 0))
                        .SetPlacement(1, 1, 23, 1)
                    )
                    .AddChild(new CommandBarComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetSpacing(2)
                        .SetVerticalAlignment(UIAlignment.Start)
                        .BindItems(nameof(CommandListGroupContext.Commands), UIBindingScope.Relative)
                        .OnItemClickWithItemKey(nameof(CommandBarController.PressRail))
                        .SetPlacement(24, 1, 1, 1)
                    )
                ),
            context: RailGroup
        );
    }
}
