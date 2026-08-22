using System.Collections.Generic;
using DemoApp.Controllers.Actions.Button;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Actions.Button;

internal sealed class ButtonTestView : DemoTestView, IUIViewDefinition
{
    private const string ShowDetailsButtonId = "button-test-show-details";
    private const string HideDetailsButtonId = "button-test-hide-details";

    public static string ViewKey => "demo.actions.button.test";

    protected override string ComponentRoute => "/actions/button";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.actions.button.header";
    protected override string HeaderDescription => "demo.actions.button.description";

    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => [
            new UIDialog
            {
                Key = ButtonTestController.DialogKey,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new TextComponent()
                        .SetTitle("Dialog opened by a command")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("Escape or a backdrop click closes it, and Tab cycles inside it rather than escaping to the page behind.")
                    )
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(ButtonTestController.CloseTestDialog))
                        .SetType(UIButtonType.Primary)
                        .ConfigureDefaultContent(c => c.SetTitle("Close from the server"))
                    )
            }
        ];

    protected override void DrawContent(WrapPanelComponent container)
        => container
            .AddChild(CreateTestGroup())
            .AddChild(CreateLoadingGroup())
            .AddChild(CreateInteractionGroup())
            .AddChild(CreateEffectGroup());

    private static ContainerComponent CreateTestGroup()
    {
        return DemoUI.CreateGroup(nameof(ButtonTestController.TestGroup), "Click",
            content => content.AddChild(new ButtonComponent()
                .OnClick(nameof(ButtonTestController.RecordClick))
                .SetPlacement(1, 1, 24, 1)
                .ConfigureDefaultContent(c => c.SetTitle("Click me"))
            ),
            static _ => { }
        );
    }

    private static ContainerComponent CreateLoadingGroup()
    {
        return DemoUI.CreateGroup(nameof(ButtonTestController.TestGroup), "Loading during async command",
            content => content.AddChild(new ButtonComponent()
                .OnClick(nameof(ButtonTestController.RecordSlowClickAsync))
                .InteractBeforeClick(IVisualComponent.LoadingProperty, true)
                .InteractAfterClick(IVisualComponent.LoadingProperty, false)
                .SetPlacement(1, 1, 24, 1)
                .ConfigureDefaultContent(c => c.SetIcon(LucideIcons.Save).SetTitle("Save (1.2s)"))
            ),
            static _ => { }
        );
    }

    /// <summary>
    /// The counterpart to <see cref="CreateInteractionGroup"/>: every button here goes to the server and the
    /// visible result comes back as a <c>ClientEffect</c> on the command result, dispatched by the client's
    /// effect registry rather than by an interaction rule.
    /// </summary>
    private static ContainerComponent CreateEffectGroup()
    {
        return DemoUI.CreateGroup(nameof(ButtonTestController.TestGroup), "Server-driven effects",
            content =>
            {
                StackPanelComponent stack = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12);

                _ = stack
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(ButtonTestController.FocusEffectTarget))
                            .SetType(UIButtonType.Outline)
                            .ConfigureDefaultContent(c => c.SetTitle("Focus target"))
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(ButtonTestController.HideEffectTarget))
                            .SetType(UIButtonType.Ghost)
                            .ConfigureDefaultContent(c => c.SetTitle("Hide"))
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(ButtonTestController.ShowEffectTarget))
                            .SetType(UIButtonType.Ghost)
                            .ConfigureDefaultContent(c => c.SetTitle("Show"))
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(ButtonTestController.NavigateToTextExample))
                            .SetType(UIButtonType.Ghost)
                            .ConfigureDefaultContent(c => c.SetTitle("Navigate away"))
                        )
                    )
                    // Second row: seven buttons on one line overflowed the group at the demo's usual width,
                    // so the effect buttons are split off into their own row.
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(ButtonTestController.OpenTestDialog))
                            .SetType(UIButtonType.Outline)
                            .ConfigureDefaultContent(c => c.SetTitle("Open dialog"))
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(ButtonTestController.OpenDialogFromServiceAsync))
                            .SetType(UIButtonType.Outline)
                            .ConfigureDefaultContent(c => c.SetTitle("Open via service"))
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(ButtonTestController.NotifySuccess))
                            .SetType(UIButtonType.Ghost)
                            .ConfigureDefaultContent(c => c.SetTitle("Toast: success"))
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(ButtonTestController.NotifyDanger))
                            .SetType(UIButtonType.Ghost)
                            .ConfigureDefaultContent(c => c.SetTitle("Toast: danger"))
                        )
                    )
                    .AddChild(new ButtonComponent(ButtonTestController.EffectTargetId)
                        .SetType(UIButtonType.Primary)
                        .ConfigureDefaultContent(c => c.SetTitle("Effect target"))
                    );

                _ = content.AddChild(stack.SetPlacement(1, 1, 24, 1));
            },
            static _ => { }
        );
    }

    private static ContainerComponent CreateInteractionGroup()
    {
        return DemoUI.CreateGroup(null, "Client-side interaction (no server round-trip)",
            content =>
            {
                StackPanelComponent stack = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12);

                _ = stack
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .AddChild(new ButtonComponent(ShowDetailsButtonId)
                            .SetType(UIButtonType.Outline)
                            .ConfigureDefaultContent(c => c.SetTitle("Show details"))
                        )
                        .AddChild(new ButtonComponent(HideDetailsButtonId)
                            .SetType(UIButtonType.Ghost)
                            .ConfigureDefaultContent(c => c.SetTitle("Hide details"))
                        )
                    )
                    .AddChild(new TextComponent()
                        .SetVisible(false)
                        .SetTitle("Details revealed purely on the client.")
                        .SetDescription("No command was dispatched to reveal this — check the network tab.")
                        .InteractOn(ShowDetailsButtonId, EventNames.Click, IVisualComponent.VisibleProperty, true)
                        .InteractOn(HideDetailsButtonId, EventNames.Click, IVisualComponent.VisibleProperty, false)
                    );

                _ = content.AddChild(stack.SetPlacement(1, 1, 24, 1));
            },
            static _ => { }
        );
    }
}
