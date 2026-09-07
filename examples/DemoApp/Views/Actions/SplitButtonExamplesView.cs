using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Actions;

/// <summary>
/// The places a split button is written: a primary action with its variants, a toolbar of menu buttons, and a field's end.
/// </summary>
/// <remarks>Nothing here is bound: the pages exist to show the shapes, and a press has nowhere to report to.</remarks>
internal sealed class SplitButtonExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.split-button.examples";

    protected override string ComponentRoute => "/actions/split-button";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.actions.split-button.header";
    protected override string HeaderDescription => "demo.actions.split-button.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateVariantsGroup(), CreateFieldGroup()],
            [CreateToolbarGroup()]
        ));
    }

    /// <summary>
    /// The shape the control exists for: one obvious action, and the less common ways of doing the same thing behind it.
    /// </summary>
    private static ContainerComponent CreateVariantsGroup()
    {
        return DemoUI.CreateGroup(null, "An action and its variants",
            content => content.AddChild(DemoUI.CreateRow(16)
                .AddChild(new SplitButtonComponent()
                    .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                    .SetTitle("Download")
                    .SetItems([
                        new MenuItem { Id = "zip", Title = "As a ZIP archive" },
                        new MenuItem { Id = "tar", Title = "As a tarball" },
                        new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
                        new MenuItem { Id = "clone", Title = "Copy the clone command", Icon = DemoIcons.Outline(DemoIcons.Copy) }
                    ])
                )
                .AddChild(new SplitButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetTitle("Run")
                    .SetItems([
                        new MenuItem { Id = "run-debug", Title = "Run with the debugger", Shortcut = "F5" },
                        new MenuItem { Id = "run-profile", Title = "Run with the profiler" },
                        new MenuItem { Id = "run-coverage", Title = "Run with coverage", Enabled = false }
                    ])
                )
                .AddChild(new SplitButtonComponent()
                    .SetType(UIButtonType.Danger)
                    .SetSize(UIButtonSize.Small)
                    .SetTitle("Delete")
                    .SetItems([
                        new MenuItem { Id = "delete-branch", Title = "Delete the branch too" },
                        new MenuItem { Id = "delete-keep", Title = "Keep the branch" }
                    ])
                )
            ),
            note: "The label runs the ordinary case; the end opens the rest. A disabled entry stays in the list and takes no press."
        );
    }

    /// <summary>
    /// Menu buttons: nothing happens on the label, every choice is in the list — the shape a toolbar's "New…" and "View" take.
    /// </summary>
    private static ContainerComponent CreateToolbarGroup()
    {
        return DemoUI.CreateGroup(null, "A toolbar of menu buttons",
            content => content.AddChild(new SurfaceComponent()
                .SetPadding(UIThickness.All(12, 8, 12, 8))
                .SetContent(DemoUI.CreateRow(4)
                    .AddChild(CreateMenuButton("New", DemoIcons.Outline(DemoIcons.File), [
                        new MenuItem { Id = "new-file", Title = "File", Shortcut = "Ctrl+N" },
                        new MenuItem { Id = "new-folder", Title = "Folder" },
                        new MenuItem { Id = "new-project", Title = "Project…" }
                    ]))
                    .AddChild(CreateMenuButton("View", DemoIcons.Outline(DemoIcons.LayoutDashboard), [
                        new MenuItem { Id = "view-heading", Title = "Panels", Kind = UIMenuItemKind.Header },
                        new MenuItem { Id = "view-explorer", Title = "Explorer", Shortcut = "Ctrl+Shift+E" },
                        new MenuItem { Id = "view-search", Title = "Search", Shortcut = "Ctrl+Shift+F" },
                        new MenuItem { Id = "view-rule", Kind = UIMenuItemKind.Separator },
                        new MenuItem { Id = "view-zen", Title = "Zen mode" }
                    ]))
                    .AddChild(CreateMenuButton("Share", DemoIcons.Outline(DemoIcons.Send), [
                        new MenuItem { Id = "share-link", Title = "Copy a link", Icon = DemoIcons.Outline(DemoIcons.Link) },
                        new MenuItem { Id = "share-mail", Title = "Send by mail", Icon = DemoIcons.Outline(DemoIcons.Mail) }
                    ]))
                )
            ),
            note: "In Menu mode the whole button is the opener and the divider goes; the chevron is the only sign of the list."
        );
    }

    private static SplitButtonComponent CreateMenuButton(string title, string icon, MenuItem[] entries)
        => new SplitButtonComponent()
            .SetMode(UISplitButtonMode.Menu)
            .SetType(UIButtonType.Ghost)
            .SetSize(UIButtonSize.Small)
            .SetIcon(icon)
            .SetTitle(title)
            .SetItems(entries);

    /// <summary>
    /// A field's trailing action: a plain button, and a split button — the menu case with nothing more to build.
    /// </summary>
    private static ContainerComponent CreateFieldGroup()
    {
        return DemoUI.CreateGroup(null, "At the end of a field",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new TextInputComponent()
                    .SetTitle("API key")
                    .SetValue("sk_live_4f9c…d21e")
                    .SetIsReadOnly(true)
                    .SetTrailingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                        .SetTooltip("Generate a new key")
                    )
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Assignee")
                    .SetValue("release-bot")
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
                )
            ),
            note: "The field lays the control in its row and dresses it as an adornment; the clipboard example on the TextInput page is the other one."
        );
    }
}
