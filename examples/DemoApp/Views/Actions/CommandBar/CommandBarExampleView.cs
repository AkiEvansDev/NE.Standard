using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Actions.CommandBar;

internal sealed class CommandBarExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.command-bar.example";

    protected override string ComponentRoute => "/actions/command-bar";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.actions.command-bar.header";
    protected override string HeaderDescription => "demo.actions.command-bar.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateToolbarGroup())
            .AddChild(CreateSidebarGroup())
            .AddChild(CreateWrappingGroup());
    }

    private static ContainerComponent CreateToolbarGroup()
    {
        return DemoUI.CreateGroup(null, "Editor toolbar",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(10)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextComponent()
                    .SetTitle("deploy-pipeline.yaml")
                    .SetTitleType(UITextAppearance.Body)
                    .SetDescription("Edited 4 minutes ago by Mara")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(new CommandBarComponent()
                    .SetSpacing(8)
                    .SetItems(
                    [
                        new ButtonItem { Id = "save", Icon = LucideIcons.Save, Title = "Save", Type = UIButtonType.Primary },
                        new ButtonItem { Id = "undo", Icon = LucideIcons.Undo, Title = "Undo", Type = UIButtonType.Outline },
                        new ButtonItem { Id = "redo", Icon = LucideIcons.Redo, Title = "Redo", Type = UIButtonType.Outline },
                        new ButtonItem { Id = "run", Icon = LucideIcons.Play, Title = "Run", Type = UIButtonType.Ghost },
                    ])
                )
            ),
            static _ => { },
            contentMinHeight: 140
        );
    }

    private static ContainerComponent CreateSidebarGroup()
    {
        return DemoUI.CreateGroup(null, "Vertical rail",
            content => content.AddChild(new CommandBarComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(6)
                .SetWidth(UILayoutLength.Absolute(190))
                .SetPlacement(1, 1, 24, 1)
                .SetItems(
                [
                    new ButtonItem { Id = "builds", Icon = LucideIcons.Wrench, Title = "Builds", Type = UIButtonType.Ghost },
                    new ButtonItem { Id = "deploys", Icon = LucideIcons.Package, Title = "Deploys", Type = UIButtonType.Ghost },
                    new ButtonItem { Id = "members", Icon = LucideIcons.Users, Title = "Members", Type = UIButtonType.Ghost },
                    new ButtonItem { Id = "files", Icon = LucideIcons.Folder, Title = "Files", Type = UIButtonType.Ghost },
                ])
            ),
            static _ => { },
            contentMinHeight: 220
        );
    }

    /// <summary>
    /// <c>Wrap</c> is the difference between a bar that reflows and one that overflows its container —
    /// the only way to see it is to give it more items than fit, so this group deliberately crowds it.
    /// </summary>
    private static ContainerComponent CreateWrappingGroup()
    {

        // Constrained width on purpose: wrapping is the whole point of this group and only shows up when
        // the bar has less room than its items need.
        CommandBarComponent bar = new CommandBarComponent()
            .SetWrap(true)
            .SetSpacing(6)
            .SetMaxWidth(UILayoutLength.Absolute(330));

        (string Id, string Icon, string Title)[] filters =
        [
            ("all", LucideIcons.List, "All"),
            ("failed", LucideIcons.BadgeX, "Failed"),
            ("passed", LucideIcons.BadgeCheck, "Passed"),
            ("running", LucideIcons.Loading, "Running"),
            ("queued", LucideIcons.Clock, "Queued"),
            ("archived", LucideIcons.Archive, "Archived"),
        ];

        foreach ((var id, var icon, var title) in filters)
            _ = bar.AddItem(new ButtonItem { Id = id, Icon = icon, Title = title, Type = UIButtonType.Outline });

        return DemoUI.CreateGroup(null, "Wrapping filter bar",
            content => content.AddChild(bar.SetPlacement(1, 1, 24, 1)),
            static _ => { },
            contentMinHeight: 150
        );
    }
}
