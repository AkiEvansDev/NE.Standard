using System.Collections.Generic;
using DemoApp.Controllers.Actions;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.Foundation;

namespace DemoApp.Views.Actions;

/// <summary>
/// Where a row of buttons goes, and the reason it is a bar over a collection rather than buttons placed by
/// hand: the buttons come from state.
/// </summary>
/// <remarks>Every bar here is bound and reports through a single command that names the button pressed.</remarks>
internal sealed class CommandBarExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string ToolbarGroup = nameof(CommandBarExamplesController.ToolbarGroup);
    private const string FooterGroup = nameof(CommandBarExamplesController.FooterGroup);
    private const string RailGroup = nameof(CommandBarExamplesController.RailGroup);
    private const string DeployGroup = nameof(CommandBarExamplesController.DeployGroup);

    public static string ViewKey => "demo.actions.command-bar.examples";

    protected override string ComponentRoute => "/actions/command-bar";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.actions.command-bar.header";
    protected override string HeaderDescription => "demo.actions.command-bar.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateToolbarGroup(), CreateDeployGroup()], [CreateFooterGroup(), CreateRailGroup()]));

    /// <summary>
    /// A strip of small ghost buttons over the thing they act on, in three groups with a rule between them.
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
                        .OnItemClickWithItemKey(nameof(CommandBarExamplesController.PressToolbar))
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
            context: ToolbarGroup
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
                        .OnItemClickWithItemKey(nameof(CommandBarExamplesController.PressDeployAction))
                    )
                ),
            context: DeployGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Fail the deploy"] = nameof(CommandBarExamplesController.FailDeploy),
                ["Succeed"] = nameof(CommandBarExamplesController.SucceedDeploy),
            }),
            // The bar needs the group's whole width for its labels, which a column of controls beside it would take.
            controlsBelow: true
        );
    }

    /// <summary>
    /// The foot of a dialog: the safe answer first, the committing one last, both at the trailing edge.
    /// </summary>
    private static ContainerComponent CreateFooterGroup()
    {
        return DemoUI.CreateExample("A dialog's footer",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(360))
                .SetContent(UILayout.Stack(16)
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Rename the account?")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("Every link to **Bramble Studio** keeps working; only the name on the page changes.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                    .AddChild(new CommandBarComponent()
                        .SetSpacing(8)
                        .SetHorizontalAlignment(UIAlignment.End)
                        .BindItems(nameof(CommandListGroupContext.Commands), UIBindingScope.Relative)
                        .OnItemClickWithItemKey(nameof(CommandBarExamplesController.PressFooter))
                    )
                ),
            context: FooterGroup
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
                        .OnItemClickWithItemKey(nameof(CommandBarExamplesController.PressRail))
                        .SetPlacement(24, 1, 1, 1)
                    )
                ),
            context: RailGroup
        );
    }
}
