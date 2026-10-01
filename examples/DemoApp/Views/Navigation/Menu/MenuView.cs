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
/// Two panes: bound entries follow the controller, and only set entries can carry a nested group. A context menu is this same
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
    protected override (string Route, string Label)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(600,
            ("Bound entries", frame => frame.AddChild(Bind(new MenuComponent())
                .BindItems($"{MenuGroup}.{nameof(MenuGroupContext.Entries)}")
                .OnItemClickWithItemKey(nameof(MenuController.Choose))
                .SetPlacement(1, 1, 24, 1)
            )),
            ("Set entries, with a group", frame => frame.AddChild(Bind(new MenuComponent(SetMenuId))
                .SetShowCollapseToggle(true)
                .SetItems(CreateSetEntries())
                .SetPlacement(1, 1, 24, 1)
            ))
        );

    private static MenuComponent Bind(MenuComponent menu)
        => menu
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindOrientation($"{MenuGroup}.{nameof(MenuGroupContext.Orientation)}")
            .BindSpacing($"{MenuGroup}.{nameof(MenuGroupContext.Spacing)}")
            .BindExpanded($"{MenuGroup}.{nameof(MenuGroupContext.Expanded)}")
            .BindSelectionStyle($"{MenuGroup}.{nameof(MenuGroupContext.SelectionStyle)}");

    /// <summary>
    /// The shape a sidebar has: a group open on the page it holds, one closed, and an entry outside both.
    /// </summary>
    private static MenuItem[] CreateSetEntries()
    {
        MenuItem environments = new()
        {
            Id = "environments",
            Title = "Environments",
            Icon = DemoIcons.Outline(DemoIcons.LayoutDashboard),
            Expanded = true
        };

        environments.Items.Add(new MenuItem { Id = "production", Title = "Production", Selected = true });
        environments.Items.Add(new MenuItem { Id = "staging", Title = "Staging" });

        MenuItem access = new() { Id = "access", Title = "Access", Icon = DemoIcons.Outline(DemoIcons.Lock) };

        access.Items.Add(new MenuItem { Id = "members", Title = "Members", BadgeText = "8" });
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
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(MenuGroup, "Menu", nameof(MenuController.CycleMenuGroupOption))
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
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetMaxWidth(UILayoutLength.Absolute(280))
                    .SetContent(new MenuComponent()
                        .BindItems(nameof(FiltersGroupContext.Entries), UIBindingScope.Relative)
                        .OnItemClickWithItemKey(nameof(MenuController.Filter))
                    )
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
                )
                // Outlined, as a filter bar's buttons are: the bar is a row of choices, none of them the page's main action.
                .AddChild(new SplitButtonComponent()
                    .SetMode(UISplitButtonMode.Menu)
                    .SetType(UIButtonType.Outline)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Sliders))
                    .SetTitle("Filters")
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .BindItems(nameof(FiltersGroupContext.Entries), UIBindingScope.Relative)
                    .OnItemClickWithItemKey(nameof(MenuController.Filter))
                    .SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(13, 1, 12, 1))
                ),
            note: "Kind = Select carries Value and its Items as the choices; Kind = Check carries Checked. Both click the entry command with their key, and the controller answers on the bound items.",
            context: FiltersGroup
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
                .SetSurface(UISurfaceStyle.Raised)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(new MenuComponent(SidebarId)
                    .SetShowCollapseToggle(true)
                    .SetSearch()
                    .SetMinWidth(UILayoutLength.Absolute(200))
                    .BindItems(nameof(SidebarGroupContext.Entries), UIBindingScope.Relative)
                ),
            note: "Type into the box: a section stays while any of its entries matches, and opens to show it. Type what no entry holds and the menu says \"Nothing to show.\", the framework's own line, in the page's language.",
            context: SidebarGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add a section"] = nameof(MenuController.AddSection)
            })
        );
    }

    /// <summary>
    /// A menu on one ordinary component, through one <c>SetContextMenu</c> and nothing placed in the tree.
    /// </summary>
    private static ContainerComponent CreateContextGroup()
    {
        return DemoUI.CreateExample("As a context menu on one component",
            new CardComponent()
                .SetContextMenu(new MenuComponent().SetItems(
                [
                    new MenuItem { Id = "card-actions", Kind = UIMenuItemKind.Header, Title = "Card" },
                    new MenuItem { Id = "rename", Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit) },
                    new MenuItem { Id = "duplicate", Title = "Duplicate", Icon = DemoIcons.Outline(DemoIcons.Copy) }
                ]).SetSurface(UISurfaceStyle.Background).OnItemClickWithItemKey(nameof(MenuController.RunCardAction), "entry"))
                // A paragraph: the explanation is prose, which a text's one line would cut.
                .SetContent(new ParagraphComponent()
                    .SetTitle("Right-click this card")
                    .SetDescription("The menu is set on the card itself — it compiles with the card and opens where the pointer is; Surface = Background puts it on the page's ground.")
                ),
            context: ContextGroup
        );
    }

    /// <summary>
    /// Entries that run something rather than go somewhere, each with the key that fires it without the menu.
    /// </summary>
    private static ContainerComponent CreateCommandsGroup()
    {
        return DemoUI.CreateExample("Commands, and the keys that fire them",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                // Room for the longest entry beside its shortcut: at 280 "Download the config" lost its end.
                .SetWidth(UILayoutLength.Absolute(360))
                .SetContent(new MenuComponent()
                    .BindItems(nameof(MenuListGroupContext.Entries), UIBindingScope.Relative)
                    .OnItemClickWithItemKey(nameof(MenuController.Run))
                ),
            context: CommandsGroup
        );
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
                    .SetSurface(UISurfaceStyle.Raised)
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
                            .BindItems(nameof(BarsGroupContext.TopEntries), UIBindingScope.Relative)
                            .OnItemClickWithItemKey(nameof(MenuController.Navigate))
                        )
                    )
                )
                .AddChild(UILayout.Row(48)
                    .AddChild(UIPage.Labelled("Side = Left, no ground", CreateRail()))
                    .AddChild(UIPage.Labelled("Side = Right", CreateRail().SetSide(UISide.Right)))
                    .AddChild(UIPage.Labelled("Surface = Tinted", CreateRail().SetSurface(UISurfaceStyle.Tinted)))
                    .AddChild(UIPage.Labelled("Size = Small", CreateRail().SetSize(UIButtonSize.Small)))
                    .AddChild(UIPage.Labelled("Size = Large", CreateRail().SetSize(UIButtonSize.Large)))
                ),
            columns: 24,
            note: "`SetOrientation(UIOrientation.Horizontal)` lays the entries along a bar. `SetDisplay(UIMenuDisplay.Rail)`: each entry its icon over a one-line label, the badge on the icon's corner — a count on Chat, an empty `BadgeText` as the dot on Profile. "
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
            .BindItems(nameof(BarsGroupContext.Entries), UIBindingScope.Relative)
            .OnItemClickWithItemKey(nameof(MenuController.SelectRailEntry));
}
