using System.Collections.Generic;
using DemoApp.Controllers.Overlays;
using DemoApp.Views.Base;

namespace DemoApp.Views.Overlays;

/// <summary>
/// Five things a page asks a dialog for, each answered on the page itself: a confirmation, an edit, a sheet of filters,
/// a sheet of details, and a wait.
/// </summary>
/// <remarks>
/// A dialog is declared by the view, rendered closed by the shell, and opened by key from a command. The page is words, not samples:
/// every title, note, button and line is a key, in each of the demo's languages; the deploys it lists are its data.
/// </remarks>
internal sealed class DialogTestView : DemoTestView, IUIViewDefinition
{
    private const string ConfirmGroup = nameof(DialogTestController.ConfirmGroup);
    private const string EditGroup = nameof(DialogTestController.EditGroup);
    private const string FiltersGroup = nameof(DialogTestController.FiltersGroup);
    private const string DetailsGroup = nameof(DialogTestController.DetailsGroup);
    private const string ProgressGroup = nameof(DialogTestController.ProgressGroup);
    private const string Words = "demo.overlays.dialog.";

    public static string ViewKey => "demo.overlays.dialog.test";

    protected override string ComponentRoute => "/overlays/dialog";
    protected override string Header => "demo.overlays.dialog.header";
    protected override string HeaderDescription => "demo.overlays.dialog.description";

    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => [
            // Neither the backdrop nor Escape answers a destructive question: only its two buttons do.
            new UIDialog
            {
                Key = DialogTestController.ConfirmKey,
                Label = Words + "confirm.label",
                CloseOnBackdrop = false,
                CloseOnEscape = false,
                Content = CreatePanel(Words + "confirm.heading", $"{ConfirmGroup}.{nameof(ConfirmGroupContext.Question)}",
                    CreateButtons(
                        CreateButton(Words + "cancel", nameof(DialogTestController.KeepRelease), UIButtonType.Ghost),
                        CreateButton(Words + "delete", nameof(DialogTestController.DeleteRelease), UIButtonType.Danger)
                    )
                )
            },
            // Wider than a centred dialog's own cap: the width is the dialog's to name, and the fields stretch to it.
            new UIDialog
            {
                Key = DialogTestController.EditKey,
                Label = Words + "edit.label",
                Width = UILayoutLength.Absolute(640),
                Content = CreatePanel(Words + "edit.heading", null,
                    new TextInputComponent()
                        .SetTitle(Words + "edit.name")
                        .BindValue($"{EditGroup}.{nameof(EditGroupContext.DraftName)}"),
                    new TextInputComponent()
                        .SetTitle(Words + "edit.owner")
                        .BindValue($"{EditGroup}.{nameof(EditGroupContext.DraftOwner)}"),
                    CreateButtons(
                        CreateButton(Words + "cancel", nameof(DialogTestController.CancelEdit), UIButtonType.Ghost),
                        CreateButton(Words + "save", nameof(DialogTestController.SaveEdit), UIButtonType.Primary)
                    )
                )
            },
            // A sheet at the left edge, not modal: the page keeps answering, so the count follows each switch as it is thrown.
            // On the page's own ground, not lifted: a drawer is part of the page, so it wears the first surface, not the second.
            new UIDialog
            {
                Key = DialogTestController.FiltersKey,
                Label = Words + "filters",
                Placement = UIDialogPlacement.Left,
                Surface = UISurfaceStyle.Background,
                Modal = false,
                Content = CreatePanel(Words + "filters", null,
                    CreateFilter(Words + "filters.only-failures", nameof(FiltersGroupContext.OnlyFailures)),
                    CreateFilter(Words + "filters.include-retries", nameof(FiltersGroupContext.IncludeRetries)),
                    CreateFilter(Words + "filters.last-day", nameof(FiltersGroupContext.LastDay)),
                    CreateButtons(CreateButton(Words + "close", nameof(DialogTestController.CloseFilters), UIButtonType.Outline))
                )
            },
            // A sheet at the right edge over a backdrop: a click beside it, or Escape, puts the list back.
            new UIDialog
            {
                Key = DialogTestController.DetailsKey,
                Label = Words + "details.label",
                Placement = UIDialogPlacement.Right,
                Width = UILayoutLength.Absolute(480),
                Content = UILayout.Stack(12)
                    .AddChild(new TextComponent()
                        .BindTitle($"{DetailsGroup}.{nameof(DetailsGroupContext.SelectedService)}")
                        .SetTitleType(UITextAppearance.Title)
                        .BindDescription($"{DetailsGroup}.{nameof(DetailsGroupContext.SelectedStatus)}")
                        .BindDescriptionColor($"{DetailsGroup}.{nameof(DetailsGroupContext.SelectedColor)}")
                    )
                    .AddChild(new ParagraphComponent()
                        .BindDescription($"{DetailsGroup}.{nameof(DetailsGroupContext.SelectedDetails)}")
                    )
                    .AddChild(CreateButtons(CreateButton(Words + "close", nameof(DialogTestController.CloseDetails), UIButtonType.Outline)))
            },
            // Nothing on it closes it: the command that showed it hides it when the work is done.
            new UIDialog
            {
                Key = DialogTestController.ProgressKey,
                Label = Words + "progress.label",
                CloseOnBackdrop = false,
                CloseOnEscape = false,
                Content = new SpinnerComponent()
                    .SetLabel(Words + "progress.spinner")
            }
        ];

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateConfirmGroup(), CreateEditGroup(), CreateProgressGroup()], [CreateFiltersGroup(), CreateDetailsGroup()]));

    /// <summary>The list on the page shrinks when the dialog says Delete and stays when it says Cancel.</summary>
    private static ContainerComponent CreateConfirmGroup()
    {
        return DemoUI.CreateGroup(ConfirmGroup, Words + "confirm.title",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(ConfirmGroupContext.Releases), UIBindingScope.Relative)
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(CreateButton(Words + "confirm.delete-latest", nameof(DialogTestController.AskBeforeDelete), UIButtonType.Danger))
                    .AddChild(CreateButton(Words + "confirm.restore", nameof(DialogTestController.RestoreReleases), UIButtonType.Ghost))
                )
            ),
            note: Words + "confirm.note",
            words: true
        );
    }

    /// <summary>The card shows the saved values; the dialog edits a draft, so Cancel really does cancel.</summary>
    private static ContainerComponent CreateEditGroup()
    {
        return DemoUI.CreateGroup(EditGroup, Words + "edit.title",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new TextComponent()
                    .BindTitle(nameof(EditGroupContext.Name), UIBindingScope.Relative)
                    .SetTitleType(UITextAppearance.Subtitle)
                    .BindDescription(nameof(EditGroupContext.Owner), UIBindingScope.Relative)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(CreateButton(Words + "edit", nameof(DialogTestController.BeginEdit), UIButtonType.Outline))
            ),
            note: Words + "edit.note",
            words: true
        );
    }

    /// <summary>The dialog is shown and hidden by the command, and the page says when it finished.</summary>
    private static ContainerComponent CreateProgressGroup()
    {
        return DemoUI.CreateGroup(ProgressGroup, Words + "progress.title",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(ProgressGroupContext.Published), UIBindingScope.Relative)
                )
                .AddChild(new ButtonComponent()
                    .OnClickShowingLoading(nameof(DialogTestController.PublishAsync))
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle(Words + "progress.publish")
                )
            ),
            note: Words + "progress.note",
            words: true
        );
    }

    /// <summary>The count on the page follows each switch while the sheet stays open beside it.</summary>
    private static ContainerComponent CreateFiltersGroup()
    {
        return DemoUI.CreateGroup(FiltersGroup, Words + "filters.title",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(FiltersGroupContext.Summary), UIBindingScope.Relative)
                )
                .AddChild(CreateButton(Words + "filters", nameof(DialogTestController.OpenFilters), UIButtonType.Outline).SetIcon(DemoIcons.Outline(DemoIcons.Filter)))
            ),
            note: Words + "filters.note",
            words: true
        );
    }

    /// <summary>A row opens the sheet with its own details; the list stays where it was.</summary>
    private static ContainerComponent CreateDetailsGroup()
    {
        return DemoUI.CreateGroup(DetailsGroup, Words + "details.title",
            content => content.AddChild(new KeyValueActionComponent()
                .SetShowActions(false)
                .SetRowHoverable(true)
                .BindItems(nameof(DetailsGroupContext.Rows), UIBindingScope.Relative)
                .OnRowClickWithItemKey(nameof(DialogTestController.ShowDeploy))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "details.note",
            words: true
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
        // A paragraph, not a text: the title and the question under it are prose, which wraps rather than ending in an ellipsis.
        ParagraphComponent heading = new ParagraphComponent()
            .SetTitle(title)
            .SetTitleType(UITextAppearance.Title)
            .SetTitleWrap(true);

        if (descriptionPath is not null)
            _ = heading.BindDescription(descriptionPath);

        StackPanelComponent panel = UILayout.Stack(12)
            .SetMinWidth(UILayoutLength.Absolute(320))
            .AddChild(heading);

        foreach (IVisualComponent component in body)
            _ = panel.AddChild(component);

        return panel;
    }
}
