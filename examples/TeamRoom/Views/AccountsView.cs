using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using TeamRoom.Controllers;
using TeamRoom.Data;

namespace TeamRoom.Views;

/// <summary>
/// A table of accounts with the four actions at the end of every row, and the dialogs those actions open.
/// </summary>
[UIAuthorize(AccountRoles.Admin)]
public sealed class AccountsView : TeamRoomView, IUIViewDefinition
{
    public static string ViewKey => "teamroom.accounts";

    protected override string PageTitle => "Accounts";

    protected override string PageDescription => "Who gets in, and as what.";

    protected override IVisualComponent CreatePage()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Primary)
                .SetIcon(AppIcons.Outline(AppIcons.Add))
                .SetTitle("New account")
                .SetHorizontalAlignment(UIAlignment.Start)
                .OnClick(nameof(AccountsController.OpenNew))
            )
            .AddChild(new TableComponent("accounts-table")
                .BindItems(nameof(AccountsController.Rows))
                .SetResizableColumns(true)
                .AddTextColumn("Login", nameof(AccountRow.Login), UIGridUnit.Absolute(160))
                .AddTextColumn("Name", nameof(AccountRow.Nickname))
                .AddTextColumn("Role", nameof(AccountRow.Role), UIGridUnit.Absolute(140))
                .AddColumn("Status", new TextComponent()
                    .BindBadgeText(nameof(AccountRow.Status), UIBindingScope.Relative)
                    .BindBadgeStyle(nameof(AccountRow.StatusStyle), UIBindingScope.Relative), UIGridUnit.Absolute(110))
                .AddTextColumn("Since", nameof(AccountRow.Created), UIGridUnit.Absolute(120))
                .AddColumn("", CreateRowActions(), UIGridUnit.Absolute(480), UITextAlignment.End)
            );

    /// <summary>Four buttons per row in four fixed columns, so a "Make member" sits over a "Make administrator"; a click is the button's own, never the row's.</summary>
    private static ContainerComponent CreateRowActions()
        => new ContainerComponent()
            .SetHorizontalAlignment(UIAlignment.Stretch)
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetSize(UIButtonSize.Small)
                .SetIcon(AppIcons.Outline(AppIcons.Shield))
                .BindTitle(nameof(AccountRow.RoleTitle), UIBindingScope.Relative)
                .SetHorizontalAlignment(UIAlignment.Start)
                .OnClick(nameof(AccountsController.ToggleRole), UIAction.ArgCurrentItemKey("id"))
                .SetPlacement(1, 1, 9, 1)
            )
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetSize(UIButtonSize.Small)
                .SetIcon(AppIcons.Outline(AppIcons.Key))
                .SetTitle("New password")
                .SetHorizontalAlignment(UIAlignment.Start)
                .OnClick(nameof(AccountsController.ResetPassword), UIAction.ArgCurrentItemKey("id"))
                .SetPlacement(10, 1, 7, 1)
            )
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetSize(UIButtonSize.Small)
                .SetIcon(AppIcons.Outline(AppIcons.Block))
                .BindTitle(nameof(AccountRow.BlockTitle), UIBindingScope.Relative)
                .SetHorizontalAlignment(UIAlignment.Start)
                .OnClick(nameof(AccountsController.ToggleBlocked), UIAction.ArgCurrentItemKey("id"))
                .SetPlacement(17, 1, 5, 1)
            )
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetSize(UIButtonSize.Small)
                .SetIcon(AppIcons.Outline(AppIcons.Delete))
                .SetTooltip("Delete")
                .SetHorizontalAlignment(UIAlignment.Start)
                .OnClick(nameof(AccountsController.AskDelete), UIAction.ArgCurrentItemKey("id"))
                .SetPlacement(22, 1, 3, 1)
            );

    protected override IReadOnlyList<UIDialog> CreateDialogs()
        =>
        [
            new UIDialog
            {
                Key = AccountsController.NewDialogKey,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(340))
                    .AddChild(new TextComponent().SetTitle("A new account").SetTitleType(UITextAppearance.Title).SetDescription("The password is theirs to change once they are in."))
                    .AddChild(new TextInputComponent().SetTitle("Login").BindValue(nameof(AccountsController.NewLogin)))
                    .AddChild(new TextInputComponent().SetTitle("Name").SetPlaceholder("The login, unless told otherwise").BindValue(nameof(AccountsController.NewNickname)))
                    .AddChild(new TextInputComponent().SetTitle("Password").SetType(UITextInputType.Password).BindValue(nameof(AccountsController.NewPassword)))
                    .AddChild(new SelectComponent()
                        .SetTitle("Role")
                        .SetOptions([
                            new OptionItem { Id = AccountRoles.User, Title = "Member", Description = "Reads the files and talks in the chat." },
                            new OptionItem { Id = AccountRoles.Admin, Title = "Administrator", Description = "Writes the files and manages the accounts." }
                        ])
                        .BindValue(nameof(AccountsController.NewRole))
                    )
                    .AddChild(CreateDialogButtons(nameof(AccountsController.Create), "Create", UIButtonType.Primary))
            },
            new UIDialog
            {
                Key = AccountsController.PasswordDialogKey,
                CloseOnBackdrop = false,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(340))
                    .AddChild(new TextComponent().SetTitle("A new password").SetTitleType(UITextAppearance.Title).SetDescription("Shown once; pass it on."))
                    .AddChild(new ParagraphComponent().BindDescription(nameof(AccountsController.PasswordNotice)).SetDescriptionType(UITextAppearance.Body).SetWrapMode(UITextWrapMode.Wrap))
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetHorizontalAlignment(UIAlignment.End)
                        .AddChild(new ButtonComponent().SetType(UIButtonType.Primary).SetTitle("Done").OnClick(nameof(AccountsController.CloseDialogs)))
                    )
            },
            new UIDialog
            {
                Key = AccountsController.DeleteDialogKey,
                CloseOnBackdrop = false,
                CloseOnEscape = false,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(340))
                    .AddChild(new TextComponent().SetTitle("Delete this account?").SetTitleType(UITextAppearance.Title).BindDescription(nameof(AccountsController.DeleteQuestion)))
                    .AddChild(CreateDialogButtons(nameof(AccountsController.Delete), "Delete", UIButtonType.Danger))
            }
        ];

    private static StackPanelComponent CreateDialogButtons(string command, string title, UIButtonType type)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(8)
            .SetHorizontalAlignment(UIAlignment.End)
            .AddChild(new ButtonComponent().SetType(UIButtonType.Ghost).SetTitle("Cancel").OnClick(nameof(AccountsController.CloseDialogs)))
            .AddChild(new ButtonComponent().SetType(type).SetTitle(title).OnClick(command));
}
