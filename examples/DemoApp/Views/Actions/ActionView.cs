using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;

namespace DemoApp.Views.Actions;

/// <summary>
/// One action, and every property that can be bound to it — the button's bindings plus the trailing pair; then what an action is
/// for: a column of them.
/// </summary>
/// <remarks>Everything a button can be asked is asked on the button's page; what is left is a row among rows.</remarks>
internal sealed class ActionView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ButtonGroup = nameof(ActionController.ButtonGroup);
    private const string ActionGroup = nameof(ActionController.ActionGroup);
    private const string ContentGroup = nameof(ActionController.ContentGroup);
    private const string LayoutGroup = nameof(ActionController.LayoutGroup);
    private const string BadgeGroup = nameof(ActionController.BadgeGroup);
    private const string BorderGroup = nameof(ActionController.BorderGroup);

    public static string ViewKey => "demo.actions.action";

    protected override string ComponentRoute => "/actions/action";
    protected override string Header => "demo.actions.action.header";
    protected override string HeaderDescription => "demo.actions.action.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(
            DemoButtonBindings.Bind(new ActionComponent(), ButtonGroup, ContentGroup, LayoutGroup, BadgeGroup, BorderGroup)
                .BindTrailingText($"{ActionGroup}.{nameof(ActionGroupContext.TrailingText)}")
                .BindTrailingIcon($"{ActionGroup}.{nameof(ActionGroupContext.TrailingIcon)}")
                .BindShowChevron($"{ActionGroup}.{nameof(ActionGroupContext.ShowChevron)}")
                .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ButtonGroup, "Button", nameof(ActionController.CycleButtonOption)),
            DemoUI.CreateOptionSection(ActionGroup, "Action", nameof(ActionController.CycleActionOption)),
            DemoUI.CreateOptionSection(LayoutGroup, "Layout", nameof(ActionController.CycleLayoutOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(ActionController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(ActionController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ActionController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [CreateSettingsGroup(), .. DemoUI.CreateColumns([CreateMenuGroup()], [CreateAgainstButtonGroup()])];

    /// <summary>
    /// The settings screen: every row a mark, a name, a line of explanation, and its state at the far end.
    /// </summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateExample("A settings screen",
            // The sections run across rather than down: three columns of rows is a settings screen, one column is a list.
            UILayout.Row(32)
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetWidth(UILayoutLength.Absolute(380))
                    .SetSpacing(4)
                    .AddChild(new TextComponent()
                        .SetTitle("Account")
                        .SetTitleType(UITextAppearance.Overline)
                        .SetTitleColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.All(0, 0, 0, 4))
                    )
                    .AddChild(new ActionComponent()
                        // The same Icon property carrying a picture instead of a glyph name.
                        .SetIcon(DemoImages.Avatar)
                        .SetTitle("Profile")
                        .SetDescription("Robin Hale · Admin")
                        .SetTrailingText("Signed in")
                    )
                    .AddChild(new ActionComponent()
                        .SetIcon(DemoIcons.Lock)
                        .SetTitle("Password")
                        .SetDescription("Last changed 8 months ago")
                        .SetTrailingText("Change")
                    )
                    .AddChild(new ActionComponent()
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Two-factor authentication")
                        .SetDescription("A second step from a new device")
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Warning)
                    )
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetWidth(UILayoutLength.Absolute(380))
                    .SetSpacing(4)
                    .AddChild(new TextComponent()
                        .SetTitle("Notifications")
                        .SetTitleType(UITextAppearance.Overline)
                        .SetTitleColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.All(0, 0, 0, 4))
                    )
                    .AddChild(new ActionComponent()
                        .SetIcon(DemoIcons.Bell)
                        .SetTitle("Deploys")
                        .SetTrailingText("On")
                    )
                    .AddChild(new ActionComponent()
                        .SetIcon(DemoIcons.Mail)
                        .SetTitle("Weekly digest")
                        .SetTrailingText("Off")
                    )
                    .AddChild(new ActionComponent()
                        .SetIcon(DemoIcons.ExternalLink)
                        .SetTitle("Status page")
                        .SetDescription("Opens status.orvane.example")
                        // A named glyph replaces the built-in chevron, saying the row leaves the application.
                        .SetTrailingIcon(DemoIcons.ExternalLink)
                    )
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetWidth(UILayoutLength.Absolute(380))
                    .SetSpacing(4)
                    .AddChild(new TextComponent()
                        .SetTitle("Danger zone")
                        .SetTitleType(UITextAppearance.Overline)
                        .SetTitleColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.All(0, 0, 0, 4))
                    )
                    .AddChild(new ActionComponent()
                        .SetIcon(DemoIcons.Alert)
                        .SetType(UIButtonType.Danger)
                        .SetTitle("Delete this server")
                        .SetDescription("Cannot be undone")
                    )
                ),
            columns: 24
        );
    }

    /// <summary>
    /// The same rows with no ground and no chevron, which is what a menu or a popover wants.
    /// </summary>
    private static ContainerComponent CreateMenuGroup()
    {
        return DemoUI.CreateExample("Inside something that is already a panel",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetPadding(UIThickness.Uniform(6))
                .SetContent(UILayout.Stack(2)
                    .SetWidth(UILayoutLength.Absolute(260))
                    // No chevron: in a popover it would promise a submenu, and TrailingIcon cannot say that (unset draws it).
                    .AddChild(new ActionComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetShowChevron(false)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Edit))
                        .SetTitle("Rename")
                    )
                    .AddChild(new ActionComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetShowChevron(false)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                        .SetTitle("Duplicate")
                        .SetTrailingText("⌘D")
                    )
                    .AddChild(new ActionComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetShowChevron(false)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                        .SetTitle("Export")
                    )
                    // Not Type.Danger: the row keeps its ghost ground and colours only its own label.
                    .AddChild(new ActionComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetShowChevron(false)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Alert))
                        .SetTitle("Delete")
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    )
                )
        );
    }

    /// <summary>
    /// The pair, running the same command: a button takes the room its word needs, a row fills the width it is given.
    /// </summary>
    private static ContainerComponent CreateAgainstButtonGroup()
    {
        return DemoUI.CreateExample("Against a button",
            // One column and one width for both, or how much of the offered width each takes cannot be seen.
            new SurfaceComponent()
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(UILayout.Stack(8)
                    .SetWidth(UILayoutLength.Absolute(300))
                    .AddChild(UIText.Label("ButtonComponent"))
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        // Asked for: a button centres itself, and the two only compare from the same edge.
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Bell))
                        .SetTitle("Notifications")
                        .SetDescription("Mailed to on-call")
                        .SetDescriptionType(UITextAppearance.Caption)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(UIText.Label("ActionComponent"))
                    .AddChild(new ActionComponent()
                        .SetIcon(DemoIcons.Bell)
                        .SetTitle("Notifications")
                        .SetDescription("Mailed to on-call")
                        .SetTrailingText("On")
                    )
                )
        );
    }
}
