using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;
using TeamRoom.Controllers;

namespace TeamRoom.Views;

/// <summary>
/// The frame every signed-in page wears: the title band with the person in it, and the sidebar the controller fills.
/// </summary>
public abstract class TeamRoomView : UIViewBase
{
    private const string SidebarId = "teamroom-sidebar";

    public override UIViewOptions Options { get; } = new() { StickyHeader = true, ScrollContentOnly = true };

    public override string Title => $"{PageTitle} · TeamRoom";

    protected abstract string PageTitle { get; }

    protected abstract string PageDescription { get; }

    protected override IVisualComponent? CreateHeader()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(24, 16, 24, 8))
            .AddRow(UIGridUnit.Auto())
            .AddChild(new TextComponent()
                .SetTitle(PageTitle)
                .SetTitleType(UITextAppearance.Display)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.OnBackground))
                .SetDescription(PageDescription)
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetPlacement(1, 1, 16, 1)
            )
            .AddChild(CreatePerson().SetPlacement(17, 1, 8, 1));

    /// <summary>Who is signed in, and the two things they may do from anywhere: switch the theme, leave.</summary>
    private static StackPanelComponent CreatePerson()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(12)
            .SetHorizontalAlignment(UIAlignment.End)
            .SetVerticalAlignment(UIAlignment.Start)
            .AddChild(new ImageComponent()
                .BindSource(nameof(TeamRoomController.AvatarSource))
                .SetFallbackSource(AppImages.DefaultAvatar)
                .SetAltText("Your picture")
                .SetFit(UIImageFit.Cover)
                .SetCornerRadius(UICornerRadius.Uniform(20))
                .SetWidth(UILayoutLength.Absolute(40))
                .SetHeight(UILayoutLength.Absolute(40))
            )
            .AddChild(new TextComponent()
                .BindTitle(nameof(TeamRoomController.DisplayName))
                .BindDescription(nameof(TeamRoomController.RoleLabel))
                .SetDescriptionType(UITextAppearance.Caption)
                .SetVerticalAlignment(UIAlignment.Center)
            )
            .AddChild(new ThemeSwitcherComponent()
                .SetLightIcon(AppIcons.Outline(AppIcons.LightMode))
                .SetDarkIcon(AppIcons.Outline(AppIcons.DarkMode))
                .SetVerticalAlignment(UIAlignment.Center)
            )
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetIcon(AppIcons.Outline(AppIcons.SignOut))
                .SetTooltip("Sign out")
                .SetVerticalAlignment(UIAlignment.Center)
                .OnClick(nameof(TeamRoomController.SignOutAsync))
            );

    protected override IVisualComponent? CreateLeftSide()
        => new ContainerComponent()
            .SetHorizontalAlignment(UIAlignment.Start)
            .SetPadding(UIThickness.All(16, 0, 8, 24))
            .AddChild(new MenuComponent(SidebarId)
                .SetShowCollapseToggle(true)
                .SetMinWidth(UILayoutLength.Absolute(180))
                .BindItems(nameof(TeamRoomController.Navigation))
            );

    /// <summary>The content fills the region it scrolls in, so a page that wants the whole height — the chat, the files — takes it.</summary>
    protected override IVisualComponent CreateContent()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetPadding(UIThickness.All(8, 4, 24, 24))
            .SetHeight(UILayoutLength.Fill())
            .AddChild(CreatePage());

    protected abstract IVisualComponent CreatePage();
}
