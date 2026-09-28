using DemoApp.Controllers.Actions;
using DemoApp.Views.Base;

namespace DemoApp.Views.Actions;

/// <summary>
/// The places a split button is written: a primary action with its variants, a toolbar of menu buttons, a field's end, and a
/// menu whose entries are the controller's list.
/// </summary>
/// <remarks>The first three groups are unbound shapes with nowhere to report to; the targets group is the bound one.</remarks>
internal sealed class SplitButtonExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string TargetsGroup = nameof(SplitButtonExamplesController.TargetsGroup);

    public static string ViewKey => "demo.actions.split-button.examples";

    protected override string ComponentRoute => "/actions/split-button";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.actions.split-button.header";
    protected override string HeaderDescription => "demo.actions.split-button.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns([CreateVariantsGroup()], [CreateToolbarGroup(), CreateTargetsGroup()]));

        _ = container.AddChild(CreateFieldGroup());
    }

    /// <summary>
    /// The shape the control exists for: one obvious action, and the less common ways of doing the same thing behind it.
    /// </summary>
    private static ContainerComponent CreateVariantsGroup()
    {
        return DemoUI.CreateExample("An action and its variants",
            UILayout.Row(16)
                .AddChild(new SplitButtonComponent()
                    .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                    .SetTitle("Download")
                    .SetItems([
                        new MenuItem { Id = "image", Title = "As a disk image" },
                        new MenuItem { Id = "tar", Title = "As a tarball" },
                        new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
                        new MenuItem { Id = "clone", Title = "Clone to another region", Icon = DemoIcons.Outline(DemoIcons.Copy) }
                    ])
                )
                .AddChild(new SplitButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetTitle("Restart")
                    .SetItems([
                        new MenuItem { Id = "restart-graceful", Title = "Restart gracefully", Shortcut = "F5" },
                        new MenuItem { Id = "restart-hard", Title = "Restart hard" },
                        new MenuItem { Id = "restart-maintenance", Title = "Restart into maintenance", Enabled = false }
                    ])
                )
                .AddChild(new SplitButtonComponent()
                    .SetType(UIButtonType.Danger)
                    .SetSize(UIButtonSize.Small)
                    .SetTitle("Delete")
                    .SetItems([
                        new MenuItem { Id = "delete-all", Title = "Delete the snapshots too" },
                        new MenuItem { Id = "delete-keep", Title = "Keep the last snapshot" }
                    ])
                ),
            note: "The label runs the ordinary case; the end opens the rest. A disabled entry stays in the list and takes no press."
        );
    }

    /// <summary>
    /// Menu buttons: nothing happens on the label, every choice is in the list — the shape a toolbar's "New…" and "View" take.
    /// </summary>
    private static ContainerComponent CreateToolbarGroup()
    {
        return DemoUI.CreateExample("A toolbar of menu buttons",
            new SurfaceComponent()
                .SetPadding(UIThickness.All(12, 8, 12, 8))
                .SetContent(UILayout.Row(4)
                    .AddChild(new SplitButtonComponent()
                        .SetMode(UISplitButtonMode.Menu)
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetIcon(DemoIcons.Outline(DemoIcons.File))
                        .SetTitle("New")
                        .SetItems([
                            new MenuItem { Id = "new-server", Title = "Server", Shortcut = "Ctrl+N" },
                            new MenuItem { Id = "new-subscription", Title = "Subscription" },
                            new MenuItem { Id = "new-certificate", Title = "Certificate…" }
                        ])
                    )
                    .AddChild(new SplitButtonComponent()
                        .SetMode(UISplitButtonMode.Menu)
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetIcon(DemoIcons.Outline(DemoIcons.LayoutDashboard))
                        .SetTitle("View")
                        .SetItems([
                            new MenuItem { Id = "view-heading", Title = "Panels", Kind = UIMenuItemKind.Header },
                            new MenuItem { Id = "view-servers", Title = "Servers", Shortcut = "Ctrl+Shift+S" },
                            new MenuItem { Id = "view-regions", Title = "Regions", Shortcut = "Ctrl+Shift+R" },
                            new MenuItem { Id = "view-rule", Kind = UIMenuItemKind.Separator },
                            new MenuItem { Id = "view-invoices", Title = "Invoices" }
                        ])
                    )
                    .AddChild(new SplitButtonComponent()
                        .SetMode(UISplitButtonMode.Menu)
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                        .SetTitle("Share")
                        .SetItems([
                            new MenuItem { Id = "share-link", Title = "Copy a link", Icon = DemoIcons.Outline(DemoIcons.Link) },
                            new MenuItem { Id = "share-mail", Title = "Send by mail", Icon = DemoIcons.Outline(DemoIcons.Mail) }
                        ])
                    )
                ),
            note: "In Menu mode the whole button is the opener and the divider goes; the chevron is the only sign of the list."
        );
    }

    /// <summary>
    /// The entries are the controller's: a bound list, a tick that moves to the target chosen last, and a target added while the
    /// page is open — the menu follows each change the way any bound collection does.
    /// </summary>
    private static ContainerComponent CreateTargetsGroup()
    {
        return DemoUI.CreateExample("A list the controller keeps",
            UILayout.Row(16)
                .AddChild(new SplitButtonComponent()
                    .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                    .SetTitle("Deploy")
                    .BindItems($"{TargetsGroup}.{nameof(SplitButtonTargetsGroupContext.Targets)}")
                    .OnItemClickWithItemKey(nameof(SplitButtonExamplesController.DeployTo))
                    .OnClick(nameof(SplitButtonExamplesController.Deploy))
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Add))
                    .SetTitle("Add a target")
                    .OnClick(nameof(SplitButtonExamplesController.AddTarget))
                ),
            context: TargetsGroup,
            note: "The main part deploys to the ticked target; an entry deploys there and takes the tick. Add a target and open the menu again: the entry is there, the list being the controller's."
        );
    }

    /// <summary>
    /// A field's trailing action: a plain button, and a split button — the menu case with nothing more to build.
    /// </summary>
    private static ContainerComponent CreateFieldGroup()
    {
        return DemoUI.CreateExample("At the end of a field",
            UILayout.Row(32)
                .AddChild(new TextInputComponent()
                    .SetTitle("API key")
                    .SetWidth(UILayoutLength.Absolute(460))
                    .SetValue("orv_live_4f9c…d21e")
                    .SetIsReadOnly(true)
                    .SetTrailingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                        .SetTooltip("Generate a new key")
                    )
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Assignee")
                    .SetWidth(UILayoutLength.Absolute(460))
                    .SetValue("Grace Kim")
                    .SetTrailingAction(new SplitButtonComponent()
                        .SetMode(UISplitButtonMode.Menu)
                        .SetType(UIButtonType.Ghost)
                        .SetTitle("Assign")
                        .SetItems([
                            new MenuItem { Id = "me", Title = "Assign to me", Icon = DemoIcons.Outline(DemoIcons.User) },
                            new MenuItem { Id = "team", Title = "Assign to the team", Icon = DemoIcons.Outline(DemoIcons.Groups) },
                            new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
                            new MenuItem { Id = "clear", Title = "Unassign" }
                        ])
                    )
                ),
            columns: 24,
            note: "The field lays the control in its row and dresses it as an adornment; the clipboard example on the TextInput page is the other one."
        );
    }
}
