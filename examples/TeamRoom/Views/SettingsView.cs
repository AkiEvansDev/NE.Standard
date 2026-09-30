using System.Collections.Generic;
using TeamRoom.Controllers;

namespace TeamRoom.Views;

/// <summary>
/// One card: the settings as rows edited in place — the picture, the name, the password, the chat's background and its fit — and a
/// preview of how the feed will read.
/// </summary>
public sealed class SettingsView : TeamRoomView, IUIViewDefinition
{
    public static string ViewKey => "teamroom.settings";

    protected override string PageTitle => "Settings";

    protected override string PageDescription => "How you appear, and what you sign in with.";

    protected override IVisualComponent CreatePage()
        => new CardComponent()
            .SetWidth(UILayoutLength.Absolute(720))
            .SetHorizontalAlignment(UIAlignment.Start)
            .ConfigureDefaultHeader(static header => header.SetIcon(AppIcons.Outline(AppIcons.Direct)).SetTitle("You").BindDescription(nameof(SettingsController.AccountLine)))
            .SetContent(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .AddChild(CreateRows())
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetIcon(AppIcons.Outline(AppIcons.Close))
                    .SetTitle("Remove the background")
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .OnClick(nameof(SettingsController.RemoveBackground))
                )
                .AddChild(CreatePreview())
            );

    /// <summary>The pencil on a row opens it through the controller, which seeds the draft; Save hands the draft back by the row's id.</summary>
    private static KeyValueActionComponent CreateRows()
        => new KeyValueActionComponent()
            .SetRowHoverable(true)
            .SetBorderThickness(UIThickness.Uniform(0))
            .BindItems(nameof(SettingsController.Rows))
            .AddValueInputTemplate("avatar", new ImageInputComponent()
                .SetShape(UIImageInputShape.Avatar)
                .SetPlaceholderIcon(AppIcons.Outline(AppIcons.Direct))
                .BindSelectionId(nameof(PictureRow.SelectionId), UIBindingScope.Relative)
            )
            .AddValueInputTemplate("picture", new ImageInputComponent()
                .SetShape(UIImageInputShape.Inline)
                .SetPlaceholder("Pick or drop a picture")
                .BindSelectionId(nameof(PictureRow.SelectionId), UIBindingScope.Relative)
            )
            .AddValueInputTemplate("fit", new SelectComponent()
                .SetOptions([
                    new OptionItem { Id = nameof(UIImageFit.Cover), Title = "Cover" },
                    new OptionItem { Id = nameof(UIImageFit.Contain), Title = "Contain" },
                    new OptionItem { Id = nameof(UIImageFit.Fill), Title = "Stretch" },
                    new OptionItem { Id = nameof(UIImageFit.None), Title = "As is" }
                ])
            )
            .EnableEditing(nameof(SettingsController.SaveRowAsync), nameof(SettingsController.OpenRow));

    /// <summary>
    /// The password's own dialog: the login it belongs to, the current one and the new one, each named for the browser's password
    /// manager — which files a changed password under the username beside it, so the login stands in the dialog, read-only.
    /// </summary>
    protected override IReadOnlyList<UIDialog> CreateDialogs()
        =>
        [
            new UIDialog
            {
                Key = SettingsController.PasswordDialogKey,
                Label = "Change password",
                CloseOnBackdrop = false,
                Content = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetMinWidth(UILayoutLength.Absolute(360))
                    .AddChild(new TextComponent().SetTitle("Change the password").SetTitleType(UITextAppearance.Title).SetDescription("Your other sessions are signed out."))
                    .AddChild(new TextInputComponent()
                        .SetTitle("Login")
                        .SetAutocomplete(UIAutocomplete.Username)
                        .SetIsReadOnly(true)
                        .BindValue(nameof(SettingsController.Login))
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle("Current password")
                        .SetType(UITextInputType.Password)
                        .SetAutocomplete(UIAutocomplete.CurrentPassword)
                        .BindValue(nameof(SettingsController.CurrentPassword))
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle("New password")
                        .SetType(UITextInputType.Password)
                        .SetAutocomplete(UIAutocomplete.NewPassword)
                        .BindValue(nameof(SettingsController.NewPassword))
                    )
                    .AddChild(CreateDialogButtons(nameof(SettingsController.ClosePasswordDialog), nameof(SettingsController.ChangePasswordAsync), "Change"))
            }
        ];

    /// <summary>Drawn the way the chat's feed draws it: the same property on the same kind of surface.</summary>
    private static SurfaceComponent CreatePreview()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Background)
            .SetHeight(UILayoutLength.Absolute(220))
            .BindBackgroundImage(nameof(SettingsController.BackgroundSource))
            .BindBackgroundImageFit(nameof(SettingsController.PreviewFit))
            .SetContent(new TextComponent()
                .SetTitle("This is how the feed will look.")
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .BindVisibility(nameof(SettingsController.PreviewCaptionVisibility))
            );
}
