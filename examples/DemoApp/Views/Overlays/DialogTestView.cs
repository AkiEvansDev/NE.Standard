using System.Collections.Generic;
using DemoApp.Controllers.Overlays;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Overlays;

/// <summary>
/// A dialog is not a component placed in the tree: the view declares it, the shell renders it closed, and a
/// command opens it by key. Its content is ordinary compiled components, so everything inside binds, patches
/// and validates through the same channels the page does.
/// </summary>
internal sealed class DialogTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.overlays.dialog.test";

    protected override string ComponentRoute => "/overlays/dialog";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Test];
    protected override string Header => "demo.overlays.dialog.header";
    protected override string HeaderDescription => "demo.overlays.dialog.description";

    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => [
            new UIDialog
            {
                Key = DialogTestController.StandardKey,
                Content = CreateMessage(
                    "A standard dialog",
                    "Modal. Escape closes it, so does a click on the backdrop, and so does the button below — that one goes through the server.",
                    nameof(DialogTestController.CloseStandard),
                    "Close from the server"
                )
            },
            new UIDialog
            {
                Key = DialogTestController.StubbornKey,
                CloseOnBackdrop = false,
                CloseOnEscape = false,
                Content = CreateMessage(
                    "Only this button closes it",
                    "CloseOnBackdrop and CloseOnEscape are both off, which is what a dialog asking to confirm something destructive wants.",
                    nameof(DialogTestController.CloseStubborn),
                    "Close"
                )
            },
            new UIDialog
            {
                Key = DialogTestController.ModelessKey,
                Modal = false,
                Content = CreateMessage(
                    "Not modal",
                    "No backdrop, and the page behind still answers the pointer — try the buttons on the left while this is open.",
                    nameof(DialogTestController.CloseModeless),
                    "Close"
                )
            },
            new UIDialog
            {
                Key = DialogTestController.ScreenKey,
                Surface = UIDialogSurface.Background,
                Content = CreateMessage(
                    "Built out of the page background",
                    "Not a card floating over the page but a screen of its own: the page's own background inside a border. What a dialog holding a whole task wants.",
                    nameof(DialogTestController.CloseScreen),
                    "Close"
                )
            },
            new UIDialog
            {
                Key = DialogTestController.FormKey,
                Content = CreateForm()
            }
        ];

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateStandardGroup())
            .AddChild(CreateSwitchesGroup())
            .AddChild(CreateServiceGroup())
            .AddChild(CreateFormGroup());
    }

    private static ContainerComponent CreateStandardGroup()
    {
        return DemoUI.CreateGroup(nameof(DialogTestController.StandardGroup), "Opened and closed by a command",
            content => content.AddChild(CreateButton("Open", nameof(DialogTestController.OpenStandard), UIButtonType.Primary)),
            static _ => { },
            contentMinHeight: 120
        );
    }

    private static ContainerComponent CreateSwitchesGroup()
    {
        return DemoUI.CreateGroup(nameof(DialogTestController.SwitchesGroup), "The three switches",
            content => content
                .AddRow(UIGridUnit.Auto())
                .AddChild(CreateButton("No backdrop, no escape", nameof(DialogTestController.OpenStubborn)))
                .AddRow(UIGridUnit.Auto())
                .AddChild(CreateButton("Not modal", nameof(DialogTestController.OpenModeless)).SetPlacement(1, 2, 24, 1))
                .AddChild(CreateButton("Background surface", nameof(DialogTestController.OpenScreen)).SetPlacement(1, 3, 24, 1)),
            static _ => { },
            contentMinHeight: 180
        );
    }

    private static ContainerComponent CreateServiceGroup()
    {
        return DemoUI.CreateGroup(nameof(DialogTestController.ServiceGroup), "Pushed while the command runs",
            content => content.AddChild(CreateButton("Show from the service", nameof(DialogTestController.OpenFromServiceAsync))),
            static _ => { },
            contentMinHeight: 120
        );
    }

    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateGroup(nameof(DialogTestController.FormGroup), "A dialog that edits state",
            content => content
                .AddRow(UIGridUnit.Auto())
                .AddChild(new TextComponent()
                    .SetTitle("Service name")
                    .SetTitleType(UITextAppearance.Caption)
                    .BindDescription(nameof(DialogTestController.ServiceName))
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(CreateButton("Edit", nameof(DialogTestController.OpenForm)).SetPlacement(1, 2, 24, 1)),
            static _ => { },
            contentMinHeight: 120
        );
    }

    private static ButtonComponent CreateButton(string title, string command, UIButtonType type = UIButtonType.Outline)
        => new ButtonComponent()
            .OnClick(command)
            .SetType(type)
            .SetHorizontalAlignment(UIAlignment.Start)
            .SetPlacement(1, 1, 24, 1)
            .ConfigureDefaultContent(c => c.SetTitle(title));

    private static StackPanelComponent CreateMessage(string title, string description, string closeCommand, string closeTitle)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .AddChild(new TextComponent()
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Title)
                .SetDescription(description)
            )
            .AddChild(new ButtonComponent()
                .OnClick(closeCommand)
                .SetType(UIButtonType.Primary)
                .SetHorizontalAlignment(UIAlignment.End)
                .ConfigureDefaultContent(c => c.SetTitle(closeTitle))
            );

    private static StackPanelComponent CreateForm()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .AddChild(new TextComponent()
                .SetTitle("Rename the service")
                .SetTitleType(UITextAppearance.Title)
                .SetDescription("The field binds to controller state, so the value is already saved by the time the command runs.")
            )
            .AddChild(new TextInputComponent()
                .BindValue(nameof(DialogTestController.ServiceName))
                .SetTitle("Service name")
            )
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .SetHorizontalAlignment(UIAlignment.End)
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(DialogTestController.CancelForm))
                    .SetType(UIButtonType.Ghost)
                    .ConfigureDefaultContent(c => c.SetTitle("Cancel"))
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(DialogTestController.SaveForm))
                    .SetType(UIButtonType.Primary)
                    .ConfigureDefaultContent(c => c.SetTitle("Save"))
                )
            );
}
