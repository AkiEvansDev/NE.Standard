using System.Collections.Generic;
using DemoApp.Controllers.Overlays;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Overlays;

/// <summary>
/// Five things a page asks a dialog for, each answered on the page itself: a confirmation, an edit, a sheet of filters,
/// a sheet of details, and a wait.
/// </summary>
/// <remarks>A dialog is declared by the view, rendered closed by the shell, and opened by key from a command.</remarks>
internal sealed class DialogTestView : DemoTestView, IUIViewDefinition
{
    private const string ConfirmGroup = nameof(DialogTestController.ConfirmGroup);
    private const string EditGroup = nameof(DialogTestController.EditGroup);
    private const string FiltersGroup = nameof(DialogTestController.FiltersGroup);
    private const string DetailsGroup = nameof(DialogTestController.DetailsGroup);
    private const string ProgressGroup = nameof(DialogTestController.ProgressGroup);

    public static string ViewKey => "demo.overlays.dialog.test";

    protected override string ComponentRoute => "/overlays/dialog";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Test];
    protected override string Header => "demo.overlays.dialog.header";
    protected override string HeaderDescription => "demo.overlays.dialog.description";

    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => [
            // Neither the backdrop nor Escape answers a destructive question: only its two buttons do.
            new UIDialog
            {
                Key = DialogTestController.ConfirmKey,
                CloseOnBackdrop = false,
                CloseOnEscape = false,
                Content = CreatePanel("Delete this build?", $"{ConfirmGroup}.{nameof(ConfirmGroupContext.Question)}",
                    CreateButtons(
                        CreateButton("Cancel", nameof(DialogTestController.KeepBuild), UIButtonType.Ghost),
                        CreateButton("Delete", nameof(DialogTestController.DeleteBuild), UIButtonType.Danger)
                    )
                )
            },
            new UIDialog
            {
                Key = DialogTestController.EditKey,
                Content = CreatePanel("Edit the service", null,
                    new TextInputComponent()
                        .SetTitle("Name")
                        .BindValue($"{EditGroup}.{nameof(EditGroupContext.DraftName)}"),
                    new TextInputComponent()
                        .SetTitle("Owner")
                        .BindValue($"{EditGroup}.{nameof(EditGroupContext.DraftOwner)}"),
                    CreateButtons(
                        CreateButton("Cancel", nameof(DialogTestController.CancelEdit), UIButtonType.Ghost),
                        CreateButton("Save", nameof(DialogTestController.SaveEdit), UIButtonType.Primary)
                    )
                )
            },
            // A sheet at the left edge, not modal: the page keeps answering, so the count follows each switch as it is thrown.
            // On the page's own ground, not lifted: a drawer is part of the page, so it wears the first surface, not the second.
            new UIDialog
            {
                Key = DialogTestController.FiltersKey,
                Placement = UIDialogPlacement.Left,
                Surface = UISurfaceStyle.Background,
                Modal = false,
                Content = CreatePanel("Filters", null,
                    CreateFilter("Only failures", nameof(FiltersGroupContext.OnlyFailures)),
                    CreateFilter("Include retries", nameof(FiltersGroupContext.IncludeRetries)),
                    CreateFilter("Last 24 hours", nameof(FiltersGroupContext.LastDay)),
                    CreateButtons(CreateButton("Close", nameof(DialogTestController.CloseFilters), UIButtonType.Outline))
                )
            },
            // A sheet at the right edge over a backdrop: a click beside it, or Escape, puts the list back.
            new UIDialog
            {
                Key = DialogTestController.DetailsKey,
                Placement = UIDialogPlacement.Right,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new TextComponent()
                        .BindTitle($"{DetailsGroup}.{nameof(DetailsGroupContext.SelectedService)}")
                        .SetTitleType(UITextAppearance.Title)
                        .BindDescription($"{DetailsGroup}.{nameof(DetailsGroupContext.SelectedStatus)}")
                        .BindDescriptionColor($"{DetailsGroup}.{nameof(DetailsGroupContext.SelectedColor)}")
                    )
                    .AddChild(new ParagraphComponent()
                        .BindDescription($"{DetailsGroup}.{nameof(DetailsGroupContext.SelectedDetails)}")
                    )
                    .AddChild(CreateButtons(CreateButton("Close", nameof(DialogTestController.CloseDetails), UIButtonType.Outline)))
            },
            // Nothing on it closes it: the command that showed it hides it when the work is done.
            new UIDialog
            {
                Key = DialogTestController.ProgressKey,
                CloseOnBackdrop = false,
                CloseOnEscape = false,
                Content = new SpinnerComponent()
                    .SetLabel("Publishing build #481")
            }
        ];

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateConfirmGroup(), CreateEditGroup(), CreateProgressGroup()],
            [CreateFiltersGroup(), CreateDetailsGroup()]
        ));
    }

    /// <summary>The list on the page shrinks when the dialog says Delete and stays when it says Cancel.</summary>
    private static ContainerComponent CreateConfirmGroup()
    {
        return DemoUI.CreateGroup(ConfirmGroup, "Ask before deleting",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(ConfirmGroupContext.Builds), UIBindingScope.Relative)
                )
                .AddChild(DemoUI.CreateRow(8)
                    .AddChild(CreateButton("Delete the latest build", nameof(DialogTestController.AskBeforeDelete), UIButtonType.Danger))
                    .AddChild(CreateButton("Restore", nameof(DialogTestController.RestoreBuilds), UIButtonType.Ghost))
                )
            ),
            contentMinHeight: 120,
            note: "The dialog closes on neither the backdrop nor Escape: a destructive question is answered, not dismissed."
        );
    }

    /// <summary>The card shows the saved values; the dialog edits a draft, so Cancel really does cancel.</summary>
    private static ContainerComponent CreateEditGroup()
    {
        return DemoUI.CreateGroup(EditGroup, "Edit on a form, read it on the card",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new TextComponent()
                    .BindTitle(nameof(EditGroupContext.Name), UIBindingScope.Relative)
                    .SetTitleType(UITextAppearance.Subtitle)
                    .BindDescription(nameof(EditGroupContext.Owner), UIBindingScope.Relative)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(CreateButton("Edit", nameof(DialogTestController.BeginEdit), UIButtonType.Outline))
            ),
            contentMinHeight: 120,
            note: "The fields bind to a draft the controller keeps beside the card, and Save is the one command that copies it over."
        );
    }

    /// <summary>The dialog is shown and hidden by the command, and the page says when it finished.</summary>
    private static ContainerComponent CreateProgressGroup()
    {
        return DemoUI.CreateGroup(ProgressGroup, "Wait while a command works",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(ProgressGroupContext.Published), UIBindingScope.Relative)
                )
                .AddChild(new ButtonComponent()
                    .OnClickWithLoading(nameof(DialogTestController.PublishAsync))
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("Publish")
                )
            ),
            contentMinHeight: 120,
            note: "Dialogs.ShowAsync and HideAsync push straight to the connection, so the dialog stands for as long as the command runs."
        );
    }

    /// <summary>The count on the page follows each switch while the sheet stays open beside it.</summary>
    private static ContainerComponent CreateFiltersGroup()
    {
        return DemoUI.CreateGroup(FiltersGroup, "A sheet of filters at the left edge",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(FiltersGroupContext.Summary), UIBindingScope.Relative)
                )
                .AddChild(CreateButton("Filters", nameof(DialogTestController.OpenFilters), UIButtonType.Outline).SetIcon(DemoIcons.Outline(DemoIcons.Filter)))
            ),
            contentMinHeight: 120,
            note: "Placement = Left, Modal = false, Surface = Background: a drawer on the page's own ground that the page keeps working beside, the shape a hidden menu takes."
        );
    }

    /// <summary>A row opens the sheet with its own details; the list stays where it was.</summary>
    private static ContainerComponent CreateDetailsGroup()
    {
        return DemoUI.CreateGroup(DetailsGroup, "A sheet of details at the right edge",
            content => content.AddChild(new KeyValueActionComponent()
                .SetShowActions(false)
                .SetRowHoverable(true)
                .BindItems(nameof(DetailsGroupContext.Rows), UIBindingScope.Relative)
                .OnRowClickWithItemKey(nameof(DialogTestController.ShowDeploy))
                .SetPlacement(1, 1, 24, 1)
            ),
            contentMinHeight: 160,
            note: "Placement = Right over a backdrop: a click beside the sheet, or Escape, closes it, and the row's own details are what it shows."
        );
    }

    private static SwitchComponent CreateFilter(string title, string property)
        => new SwitchComponent()
            .SetTitle(title)
            .BindValue($"{FiltersGroup}.{property}")
            .OnChange(nameof(DialogTestController.ApplyFilters));

    private static ButtonComponent CreateButton(string title, string command, UIButtonType type)
        => new ButtonComponent()
            .OnClick(command)
            .SetType(type)
            .SetHorizontalAlignment(UIAlignment.Start)
            .SetTitle(title);

    private static StackPanelComponent CreateButtons(params ButtonComponent[] buttons)
    {
        StackPanelComponent row = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(8)
            .SetHorizontalAlignment(UIAlignment.End);

        foreach (ButtonComponent button in buttons)
            _ = row.AddChild(button.SetHorizontalAlignment(UIAlignment.End));

        return row;
    }

    /// <summary>A title, an optional bound line under it, and whatever the dialog holds below.</summary>
    private static StackPanelComponent CreatePanel(string title, string? descriptionPath, params IVisualComponent[] body)
    {
        TextComponent heading = new TextComponent()
            .SetTitle(title)
            .SetTitleType(UITextAppearance.Title);

        if (descriptionPath is not null)
            _ = heading.BindDescription(descriptionPath);

        StackPanelComponent panel = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetMinWidth(UILayoutLength.Absolute(320))
            .AddChild(heading);

        foreach (IVisualComponent component in body)
            _ = panel.AddChild(component);

        return panel;
    }
}
