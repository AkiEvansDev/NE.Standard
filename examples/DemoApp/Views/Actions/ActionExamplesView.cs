using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Actions;

/// <summary>
/// What an action is for: a column of them.
/// </summary>
/// <remarks>Everything a button can be asked is asked on the button's pages; what is left is a row among rows.</remarks>
internal sealed class ActionExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.action.examples";

    protected override string ComponentRoute => "/actions/action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.actions.action.header";
    protected override string HeaderDescription => "demo.actions.action.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(CreateSettingsGroup());

        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateMenuGroup()],
            [CreateAgainstButtonGroup()]
        ));
    }

    /// <summary>
    /// The settings screen: every row a mark, a name, a line of explanation, and its state at the far end.
    /// </summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        // The sections run across rather than down: three columns of rows is a settings screen, one column is a list.
        return DemoUI.CreateGroup(null, "A settings screen",
            content => content.AddChild(DemoUI.CreateRow(32)
                .AddChild(CreateSection("Account",
                    new ActionComponent()
                        // The same Icon property carrying a picture instead of a glyph name.
                        .SetIcon(DemoImages.Avatar)
                        .SetTitle("Profile")
                        .SetDescription("Robin Hale · Client runtime")
                        .SetTrailingText("Signed in"),
                    new ActionComponent()
                        .SetIcon(DemoIcons.Lock)
                        .SetTitle("Password")
                        .SetDescription("Last changed 8 months ago")
                        .SetTrailingText("Change"),
                    new ActionComponent()
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Two-factor authentication")
                        .SetDescription("A second step from a new device")
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Warning)
                ))
                .AddChild(CreateSection("Notifications",
                    new ActionComponent()
                        .SetIcon(DemoIcons.Bell)
                        .SetTitle("Deploys")
                        .SetTrailingText("On"),
                    new ActionComponent()
                        .SetIcon(DemoIcons.Mail)
                        .SetTitle("Weekly digest")
                        .SetTrailingText("Off"),
                    new ActionComponent()
                        .SetIcon(DemoIcons.ExternalLink)
                        .SetTitle("Slack integration")
                        .SetDescription("Opens Slack in a new tab")
                        // A named glyph replaces the built-in chevron, saying the row leaves the application.
                        .SetTrailingIcon(DemoIcons.ExternalLink)
                ))
                .AddChild(CreateSection("Danger zone",
                    new ActionComponent()
                        .SetIcon(DemoIcons.Alert)
                        .SetType(UIButtonType.Danger)
                        .SetTitle("Delete this workspace")
                        .SetDescription("Cannot be undone")
                ))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24
        );
    }

    private static StackPanelComponent CreateSection(string caption, params ActionComponent[] rows)
    {
        StackPanelComponent section = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetWidth(UILayoutLength.Absolute(380))
            .SetSpacing(4)
            .AddChild(new TextComponent()
                .SetTitle(caption)
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
                .SetMargin(UIThickness.All(0, 0, 0, 4))
            );

        foreach (ActionComponent row in rows)
            _ = section.AddChild(row);

        return section;
    }

    /// <summary>
    /// The same rows with no ground and no chevron, which is what a menu or a popover wants.
    /// </summary>
    private static ContainerComponent CreateMenuGroup()
    {
        return DemoUI.CreateGroup(null, "Inside something that is already a panel",
            content => content.AddChild(new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetPadding(UIThickness.Uniform(6))
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(2)
                    .SetWidth(UILayoutLength.Absolute(260))
                    .AddChild(CreateGhostRow(DemoIcons.Edit, "Rename", null))
                    .AddChild(CreateGhostRow(DemoIcons.Copy, "Duplicate", "⌘D"))
                    .AddChild(CreateGhostRow(DemoIcons.Download, "Export", null))
                    // Not Type.Danger: the row keeps its ghost ground and colours only its own label.
                    .AddChild(CreateGhostRow(DemoIcons.Alert, "Delete", null)
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    // No chevron: in a popover it would promise a submenu, and TrailingIcon cannot say that (unset draws it).
    private static ActionComponent CreateGhostRow(string icon, string title, string? trailing)
        => new ActionComponent()
            .SetType(UIButtonType.Ghost)
            .SetSize(UIButtonSize.Small)
            .SetShowChevron(false)
            .SetIcon(DemoIcons.Outline(icon))
            .SetTitle(title)
            .SetTrailingText(trailing);

    /// <summary>
    /// The pair, running the same command: a button takes the room its word needs, a row fills the width it is given.
    /// </summary>
    private static ContainerComponent CreateAgainstButtonGroup()
    {
        return DemoUI.CreateGroup(null, "Against a button",
            // One column and one width for both, or how much of the offered width each takes cannot be seen.
            content => content.AddChild(new SurfaceComponent()
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(8)
                    .SetWidth(UILayoutLength.Absolute(300))
                    .AddChild(DemoUI.CreateCaption("ButtonComponent"))
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        // Asked for: a button centres itself, and the two only compare from the same edge.
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Bell))
                        .SetTitle("Notifications")
                        .SetDescription("Sent to #releases")
                        .SetDescriptionType(UITextAppearance.Caption)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(DemoUI.CreateCaption("ActionComponent"))
                    .AddChild(new ActionComponent()
                        .SetIcon(DemoIcons.Bell)
                        .SetTitle("Notifications")
                        .SetDescription("Sent to #releases")
                        .SetTrailingText("On")
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
