using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.Menu;
using DemoApp.Views.Base;

namespace DemoApp.Views.Navigation.Menu;

/// <summary>
/// One menu and every property that can be bound to it; then the places a menu is put, and the two things it is besides a list of
/// pages: a list of commands, and the panel a right-click opens.
/// </summary>
/// <remarks>
/// Two panes: bound entries follow the controller (their nested sub-entries included), alongside static set entries. A context menu is this same
/// component, set on another through <c>SetContextMenu</c> rather than placed in the tree; one on every row of a list is on the items
/// view's and the tree's pages.
/// </remarks>
internal sealed class MenuView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string MenuGroup = nameof(MenuController.MenuGroup);

    /// <summary>The set pane's id, which keys its collapsed state and open group in the browser.</summary>
    private const string SetMenuId = "demo-menu-preview";

    private const string SidebarGroup = nameof(MenuController.SidebarGroup);
    private const string CommandsGroup = nameof(MenuController.CommandsGroup);
    private const string ContextGroup = nameof(MenuController.ContextGroup);
    private const string FiltersGroup = nameof(MenuController.FiltersGroup);
    private const string BarsGroup = nameof(MenuController.BarsGroup);

    /// <summary>The sidebar's authored id, which keys its collapsed state and open section.</summary>
    private const string SidebarId = "demo-menu-examples-sidebar";

    public static string ViewKey => "demo.navigation.menu";

    protected override string ComponentRoute => "/navigation/menu";
    protected override string Header => "demo.navigation.menu.header";
    protected override string HeaderDescription => "demo.navigation.menu.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(600,
            ("Bound entries", frame => frame.AddChild(Bind(new MenuComponent())
                .BindItems<MenuController>(static x => x.MenuGroup.Entries)
                .OnItemClickWithItemKey(nameof(MenuController.Choose))
                .SetPlacement(1, 1, 24, 1)
            )),
            ("Set entries, with nested groups", frame => frame.AddChild(Bind(new MenuComponent(SetMenuId))
                .SetShowCollapseToggle(true)
                .SetItems(CreateSetEntries())
                .SetPlacement(1, 1, 24, 1)
            ))
        );

    private static MenuComponent Bind(MenuComponent menu)
        => menu
            .BindStandard()
            .BindOrientation<MenuController>(static x => x.MenuGroup.Orientation)
            .BindSpacing<MenuController>(static x => x.MenuGroup.Spacing)
            .BindExpanded<MenuController>(static x => x.MenuGroup.Expanded)
            .BindSelectionStyle<MenuController>(static x => x.MenuGroup.SelectionStyle);

    /// <summary>
    /// The shape a sidebar has: a group open on the page it holds, one closed, and an entry outside both.
    /// </summary>
    private static MenuItem[] CreateSetEntries()
    {
        MenuItem production = new() { Id = "production", Title = "Production", Expanded = true };

        production.Items.Add(new MenuItem { Id = "prod-eu-west", Title = "EU West", Selected = true });
        production.Items.Add(new MenuItem { Id = "prod-us-east", Title = "US East" });

        MenuItem staging = new() { Id = "staging", Title = "Staging" };

        staging.Items.Add(new MenuItem { Id = "staging-preview", Title = "Preview" });
        staging.Items.Add(new MenuItem { Id = "staging-qa", Title = "QA" });

        MenuItem environments = new()
        {
            Id = "environments",
            Title = "Environments",
            Icon = DemoIcons.Outline(DemoIcons.LayoutDashboard),
            Expanded = true
        };

        environments.Items.Add(production);
        environments.Items.Add(staging);

        MenuItem access = new() { Id = "access", Title = "Access", Icon = DemoIcons.Outline(DemoIcons.Lock) };

        access.Items.Add(new MenuItem { Id = "members", Title = "Members", BadgeTitle = "8" });
        access.Items.Add(new MenuItem { Id = "tokens", Title = "Tokens" });

        return
        [
            environments,
            access,
            new MenuItem { Id = "billing", Title = "Billing", Icon = DemoIcons.Outline(DemoIcons.FileText) }
        ];
    }

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(MenuGroup, "Menu")
        );

    protected override IVisualComponent[] CreateExamples()
        // Two stacks of two, as tall as each other: in pairs the sidebar left a hole beside the short context menu.
        => [DemoUI.CreateHalf(CreateFiltersGroup(), CreateCommandsGroup()), DemoUI.CreateHalf(CreateSidebarGroup(), CreateContextGroup()), CreateBarsGroup()];

    /// <summary>
    /// Settings as entries: a select shows its value and opens its choices beside it, a check turns in place. The same entries
    /// once as a list and once dropped from a button, since a filter bar is where they are usually found.
    /// </summary>
    private static ContainerComponent CreateFiltersGroup()
    {
        return DemoUI.CreateExample("Selects and checks",
            // A grid of two halves rather than a row, so the button starts at the middle whatever the list's width.
            // One declared row: below md the button takes an implicit second, so the spacing never stands under an empty one.
            new ContainerComponent()
                .SetRow(1, UIGridUnit.Auto())
                .SetSpacing(16)
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Surface)
                    .SetPadding(UIThickness.Uniform(4))
                    .SetMaxWidth(UILayoutLength.Absolute(280))
                    .SetContent(new MenuComponent()
                        .BindItems<FiltersGroupContext>(static x => x.Entries, UIBindingScope.Relative)
                        .OnItemClickWithItemKey(nameof(MenuController.Filter))
                    )
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
                )
                // Outlined, as a filter bar's buttons are: the bar is a row of choices, none of them the page's main action.
                .AddChild(new SplitButtonComponent()
                    .SetMode(UISplitButtonMode.Menu)
                    .SetVariant(UIButtonVariant.Ghost)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Sliders))
                    .SetTitle("Filters")
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .BindItems<FiltersGroupContext>(static x => x.Entries, UIBindingScope.Relative)
                    .OnItemClickWithItemKey(nameof(MenuController.Filter))
                    .SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(13, 1, 12, 1))
                ),
            note: "Kind = Select carries Value and its Items as the choices; Kind = Check carries Checked. Both click the entry command with their key, and the controller answers on the bound items.",
            context: FiltersGroup
        );
    }

    /// <summary>
    /// Entries that run something rather than go somewhere, each with the key that fires it without the menu.
    /// </summary>
    private static ContainerComponent CreateCommandsGroup()
    {
        return DemoUI.CreateExample("Commands, and the keys that fire them",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Surface)
                .SetPadding(UIThickness.Uniform(4))
                // Room for the longest entry beside its shortcut: at 280 "Download the config" lost its end.
                .SetWidth(UILayoutLength.Absolute(360))
                .SetContent(new MenuComponent()
                    .BindItems<MenuListGroupContext>(static x => x.Entries, UIBindingScope.Relative)
                    .OnItemClickWithItemKey(nameof(MenuController.Run))
                ),
            context: CommandsGroup
        );
    }

    /// <summary>
    /// This demo's own pages in sections that open and close, on a rail that folds to its icons, with a box over them that narrows
    /// the entries as the reader types. The entries are the controller's, and a section added live is a row the client builds, its
    /// sub-entries included.
    /// </summary>
    private static ContainerComponent CreateSidebarGroup()
    {
        return DemoUI.CreateExample("A sidebar with sections",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Surface)
                .SetPadding(UIThickness.Uniform(4))
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(new MenuComponent(SidebarId)
                    .SetShowCollapseToggle(true)
                    .OnExpand(nameof(MenuController.SidebarExpanded))
                    .OnCollapse(nameof(MenuController.SidebarCollapsed))
                    .SetSearch()
                    .SetMinWidth(UILayoutLength.Absolute(200))
                    .SetSubmenuDepth(2)
                    .BindItems<SidebarGroupContext>(static x => x.Entries, UIBindingScope.Relative)
                ),
            note: "Type into the box: a section stays while any of its entries matches, and opens to show it. Type what no entry holds and the menu says \"Nothing to show.\", the framework's own line, in the page's language. The switch folds the menu to its icons and raises Collapse, and back raises Expand, logged below; a section opening or closing is an entry's fold and raises neither.",
            context: SidebarGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add a section"] = nameof(MenuController.AddSection),
                ["Toggle Inbox folders"] = nameof(MenuController.ToggleInboxFolders)
            })
        );
    }

    /// <summary>
    /// Context menus on ordinary components: first a file card opened by right-click, long-press or a <c>⋮</c> header button with
    /// three-level cascading submenus, and below it a message surface carrying <c>SetActionBar</c> so the entries marked
    /// <c>InActionBar</c> float above it as compact icon buttons beside <c>⋯</c>.
    /// </summary>
    private static ContainerComponent CreateContextGroup()
    {
        return DemoUI.CreateExample("Context menu and floating action bar",
            UILayout.Stack(16)
                .AddChild(new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Code)
                        .SetTitle("Program.cs")
                        .SetDescription("src/Orvane.Api · 4.2 KB")
                    )
                    .SetHeaderAction(UIIconButtons.More(CreateContextMenuEntries())
                        .SetPopupPlacement(UIPopupPlacement.BottomEnd)
                        .OnItemClickWithItemKey(nameof(MenuController.RunCardAction), "entry")
                    )
                    .SetContextMenu(new MenuComponent()
                        .SetItems(CreateContextMenuEntries())
                        .SetSurface(UISurfaceStyle.Background)
                        .OnItemClickWithItemKey(nameof(MenuController.RunCardAction), "entry")
                    )
                    // A paragraph: the explanation is prose, which a text's one line would cut.
                    .SetContent(new ParagraphComponent()
                        .SetTitle("Right-click, long-press, or press ⋮")
                        .SetDescription("Opens a context menu with nested Copy and Move to submenus cascading three levels deep. Surface = Background puts the right-click menu on the page's ground.")
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Surface)
                    .SetContextMenu(new MenuComponent()
                        .SetItems(CreateActionBarMenuEntries())
                        .SetSurface(UISurfaceStyle.Background)
                        .OnItemClickWithItemKey(nameof(MenuController.RunMessageAction), "entry")
                    )
                    .SetActionBar(UIActionBarAlignment.End)
                    .SetContent(new ParagraphComponent()
                        .SetTitle("Maya Lin · 14:20")
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Primary)
                        .SetDescription("Click or tap this message to reveal the compact icon bar above it (SetActionBar + InActionBar), press ⋯ for the full menu, or right-click anywhere on the surface.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                ),
            note: "`SetContextMenu` attaches the menu for right-click and long-press. Adding `SetActionBar(UIActionBarAlignment.End)` floats the entries marked `InActionBar = true` as small icon buttons above the host when chosen or focused, with `⋯` opening the full menu.",
            context: ContextGroup
        );
    }

    private static MenuItem[] CreateContextMenuEntries()
    {
        MenuItem copyAs = new() { Id = "copy-as", Title = "Copy as" };

        copyAs.Items.Add(new MenuItem { Id = "copy-markdown", Title = "Markdown Link" });
        copyAs.Items.Add(new MenuItem { Id = "copy-uri", Title = "File URI" });
        copyAs.Items.Add(new MenuItem { Id = "copy-namespace", Title = "C# Namespace" });

        MenuItem copy = new() { Id = "copy", Title = "Copy", Icon = DemoIcons.Outline(DemoIcons.Copy) };

        copy.Items.Add(new MenuItem { Id = "copy-path", Title = "Copy Path", Shortcut = "Ctrl+Alt+C" });
        copy.Items.Add(new MenuItem { Id = "copy-relative-path", Title = "Copy Relative Path", Shortcut = "Ctrl+Shift+C" });
        copy.Items.Add(copyAs);

        MenuItem apiFolder = new() { Id = "move-api", Title = "src/Orvane.Api", Icon = DemoIcons.Outline(DemoIcons.Folder) };

        apiFolder.Items.Add(new MenuItem { Id = "move-controllers", Title = "Controllers" });
        apiFolder.Items.Add(new MenuItem { Id = "move-endpoints", Title = "Endpoints" });
        apiFolder.Items.Add(new MenuItem { Id = "move-middleware", Title = "Middleware" });

        MenuItem moveTo = new() { Id = "move-to", Title = "Move to", Icon = DemoIcons.Outline(DemoIcons.Folder) };

        moveTo.Items.Add(apiFolder);
        moveTo.Items.Add(new MenuItem { Id = "move-tests", Title = "tests/Orvane.Tests", Icon = DemoIcons.Outline(DemoIcons.Folder) });

        return
        [
            new MenuItem { Id = "open", Title = "Open", Icon = DemoIcons.Outline(DemoIcons.FileText), Shortcut = "Enter" },
            new MenuItem { Id = "open-side", Title = "Open to the Side", Icon = DemoIcons.Outline(DemoIcons.ExternalLink) },
            new MenuItem { Id = "rule-1", Kind = UIMenuItemKind.Separator },
            copy,
            moveTo,
            new MenuItem { Id = "rule-2", Kind = UIMenuItemKind.Separator },
            new MenuItem { Id = "rename", Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit), Shortcut = "F2" },
            new MenuItem { Id = "duplicate", Title = "Duplicate", Icon = DemoIcons.Outline(DemoIcons.Copy) },
            new MenuItem { Id = "delete", Title = "Delete", Icon = UIGlyphs.Delete, IconColor = UIThemeColor.Danger, TitleColor = UIThemeColor.Danger, Shortcut = "Delete" }
        ];
    }

    private static MenuItem[] CreateActionBarMenuEntries()
    {
        MenuItem direct = new() { Id = "forward-direct", Title = "Direct message" };

        direct.Items.Add(new MenuItem { Id = "forward-maya", Title = "Maya Lin" });
        direct.Items.Add(new MenuItem { Id = "forward-tomasz", Title = "Tomasz Kowalski" });

        MenuItem forward = new() { Id = "forward", Title = "Forward to", Icon = DemoIcons.Outline(DemoIcons.ExternalLink) };

        forward.Items.Add(new MenuItem { Id = "forward-deployments", Title = "#deployments" });
        forward.Items.Add(new MenuItem { Id = "forward-incidents", Title = "#incidents" });
        forward.Items.Add(direct);

        return
        [
            new MenuItem { Id = "reply", Title = "Reply", Icon = DemoIcons.Outline(DemoIcons.MessageSquare), InActionBar = true, Shortcut = "R" },
            new MenuItem { Id = "pin", Title = "Pin", Icon = UIGlyphs.Pin, InActionBar = true, Shortcut = "P" },
            new MenuItem { Id = "copy", Title = "Copy Text", Icon = DemoIcons.Outline(DemoIcons.Copy), InActionBar = true, Shortcut = "Ctrl+C" },
            new MenuItem { Id = "rule-1", Kind = UIMenuItemKind.Separator },
            forward,
            new MenuItem { Id = "unread", Title = "Mark Unread", Icon = DemoIcons.Outline(DemoIcons.Mail) },
            new MenuItem { Id = "rule-2", Kind = UIMenuItemKind.Separator },
            new MenuItem { Id = "delete", Title = "Delete", Icon = UIGlyphs.Delete, IconColor = UIThemeColor.Danger, TitleColor = UIThemeColor.Danger, InActionBar = true, Shortcut = "Delete" }
        ];
    }

    /// <summary>
    /// A row of pages across the top of a screen, and a navigation rail five times over one set of entries: on the left edge with no
    /// ground of its own, on the right edge, on a tinted ground a step apart from the page's, and at its two other sizes. The current mark
    /// follows the press on each.
    /// </summary>
    private static ContainerComponent CreateBarsGroup()
    {
        return DemoUI.CreateExample("Across the top and down the edge",
            UILayout.Stack(24)
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Surface)
                    .SetContent(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(24)
                        // On a phone the entries go under the name rather than past the bar's edge.
                        .SetWrap(true)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Shield)
                            .SetTitle("Billing")
                            .SetTitleType(UITextAppearance.Subtitle)
                        )
                        .AddChild(new MenuComponent()
                            .SetOrientation(UIOrientation.Horizontal)
                            .BindItems<BarsGroupContext>(static x => x.TopEntries, UIBindingScope.Relative)
                            .OnItemClickWithItemKey(nameof(MenuController.Navigate))
                        )
                    )
                )
                .AddChild(UILayout.Row(48)
                    .AddChild(DemoUI.CreateLabelled("Side = Left, no ground", CreateRail()))
                    .AddChild(DemoUI.CreateLabelled("Side = Right", CreateRail().SetSide(UISide.Right)))
                    .AddChild(DemoUI.CreateLabelled("Surface = Tinted", CreateRail().SetSurface(UISurfaceStyle.Tinted)))
                    .AddChild(DemoUI.CreateLabelled("Size = Small", CreateRail().SetSize(UISize.Small)))
                    .AddChild(DemoUI.CreateLabelled("Size = Large", CreateRail().SetSize(UISize.Large)))
                ),
            columns: 24,
            note: "`SetOrientation(UIOrientation.Horizontal)` lays the entries along a bar. `SetDisplay(UIMenuDisplay.Rail)`: each entry its icon over a one-line label, the badge on the icon's corner — a count on Chat, an empty `BadgeTitle` as the dot on Profile. "
                + "A label cut short shows whole as its tooltip; the current entry wears a bar on the rail's edge and its icon filled; Administration's two entries fly out beside the rail. The buttons push a count and move the current mark, into the group and out. "
                + "`SetSize` picks the rail's measures, Medium unless set: Small is a column of 48 px squares whose labels are only their tooltips, Large a 72 px column of larger glyphs and labels. The entries stand edge to edge at every size.",
            context: BarsGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Push a count"] = nameof(MenuController.PushRailCount),
                ["Move the selection"] = nameof(MenuController.MoveRailSelection)
            })
        );
    }

    /// <summary>One rail over the group's entries; a press marks the entry current.</summary>
    private static MenuComponent CreateRail()
        => new MenuComponent()
            .SetDisplay(UIMenuDisplay.Rail)
            .BindItems<BarsGroupContext>(static x => x.Entries, UIBindingScope.Relative)
            .OnItemClickWithItemKey(nameof(MenuController.SelectRailEntry));
}
