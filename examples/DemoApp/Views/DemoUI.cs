using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using DemoApp.Controllers.Base;

namespace DemoApp.Views;

internal static class DemoUI
{
    /// <summary>The sidebar's authored id, which keys its collapsed state and open section.</summary>
    private const string SidebarId = "demo-sidebar";

    public static readonly (string Title, string Icon, (string Route, string Label)[] Links)[] NavSections =
    [
        // First, because these are the pages a reader judges the whole by: pieces of an application, not a component each.
        ("demo.nav.section.screens", DemoIcons.Outline(DemoIcons.Screens),
        [
            ("/screens/sign-up", "demo.nav.screens.sign-up"),
            ("/screens/checkout", "demo.nav.screens.checkout"),
            ("/screens/settings", "demo.nav.screens.settings"),
            ("/screens/catalogue", "demo.nav.screens.catalogue"),
            ("/screens/inbox", "demo.nav.screens.inbox"),
            ("/screens/article", "demo.nav.screens.article"),
            ("/screens/chat", "demo.nav.screens.chat"),
            ("/screens/files", "demo.nav.screens.files"),
            ("/screens/notes", "demo.nav.screens.notes"),
            ("/screens/sign-in", "demo.nav.screens.sign-in"),
            ("/screens/account", "demo.nav.screens.account"),
            ("/screens/admin", "demo.nav.screens.admin"),
        ]),
        // What the framework does across components, each page a set of live experiments rather than one component's look.
        ("demo.nav.section.mechanisms", DemoIcons.Outline(DemoIcons.Mechanism),
        [
            ("/design/colors", "demo.nav.design.colors"),
            ("/mechanisms/words", "demo.nav.mechanisms.words"),
            ("/mechanisms/commands", "demo.nav.mechanisms.commands"),
            ("/mechanisms/values", "demo.nav.mechanisms.values"),
            ("/mechanisms/lists", "demo.nav.mechanisms.lists"),
            ("/mechanisms/pages", "demo.nav.mechanisms.pages"),
        ]),
        ("demo.nav.section.layouts", DemoIcons.Outline(DemoIcons.LayoutDashboard),
        [
            ("/layouts/container", "demo.nav.layouts.container"),
            ("/layouts/stack-panel", "demo.nav.layouts.stack-panel"),
            ("/layouts/wrap-panel", "demo.nav.layouts.wrap-panel"),
            ("/layouts/scroll", "demo.nav.layouts.scroll"),
            ("/layouts/grid-splitter", "demo.nav.layouts.grid-splitter"),
            ("/layouts/surface", "demo.nav.layouts.surface"),
            ("/layouts/card", "demo.nav.layouts.card"),
            ("/layouts/expander", "demo.nav.layouts.expander"),
            ("/layouts/collapsible-panel", "demo.nav.layouts.collapsible-panel"),
            ("/layouts/flyout", "demo.nav.layouts.flyout"),
        ]),
        ("demo.nav.section.contents", DemoIcons.Outline(DemoIcons.FileText),
        [
            ("/contents/text", "demo.nav.contents.text"),
            ("/contents/paragraph", "demo.nav.contents.paragraph"),
            ("/contents/timestamp", "demo.nav.contents.timestamp"),
            ("/contents/link", "demo.nav.contents.link"),
            ("/contents/icon", "demo.nav.contents.icon"),
            ("/contents/image", "demo.nav.contents.image"),
            ("/contents/badge", "demo.nav.contents.badge"),
            ("/contents/message", "demo.nav.contents.message"),
            ("/contents/separator", "demo.nav.contents.separator"),
        ]),
        ("demo.nav.section.actions", DemoIcons.Outline(DemoIcons.Press),
        [
            ("/actions/button", "demo.nav.actions.button"),
            ("/actions/split-button", "demo.nav.actions.split-button"),
            ("/actions/button-group", "demo.nav.actions.button-group"),
            ("/actions/action", "demo.nav.actions.action"),
            ("/actions/command-bar", "demo.nav.actions.command-bar"),
            ("/actions/theme-switcher", "demo.nav.actions.theme-switcher"),
        ]),
        ("demo.nav.section.inputs", DemoIcons.Outline(DemoIcons.Sliders),
        [
            ("/inputs/checkbox", "demo.nav.inputs.checkbox"),
            ("/inputs/switch", "demo.nav.inputs.switch"),
            ("/inputs/radio-group", "demo.nav.inputs.radio-group"),
            ("/inputs/slider", "demo.nav.inputs.slider"),
            ("/inputs/text-input", "demo.nav.inputs.text-input"),
            ("/inputs/text-area", "demo.nav.inputs.text-area"),
            ("/inputs/number-input", "demo.nav.inputs.number-input"),
            ("/inputs/search", "demo.nav.inputs.search"),
            ("/inputs/select", "demo.nav.inputs.select"),
            ("/inputs/multi-select", "demo.nav.inputs.multi-select"),
            ("/inputs/file-input", "demo.nav.inputs.file-input"),
            ("/inputs/image-input", "demo.nav.inputs.image-input"),
            ("/inputs/date-input", "demo.nav.inputs.date-input"),
            ("/inputs/time-input", "demo.nav.inputs.time-input"),
            ("/inputs/date-time-input", "demo.nav.inputs.date-time-input"),
            ("/inputs/calendar", "demo.nav.inputs.calendar"),
            ("/inputs/color-input", "demo.nav.inputs.color-input"),
        ]),
        ("demo.nav.section.navigation", DemoIcons.Outline(DemoIcons.Navigation),
        [
            ("/navigation/menu", "demo.nav.navigation.menu"),
            ("/navigation/tabs", "demo.nav.navigation.tabs"),
            ("/navigation/tabs-view", "demo.nav.navigation.tabs-view"),
            ("/navigation/breadcrumbs", "demo.nav.navigation.breadcrumbs"),
        ]),
        ("demo.nav.section.items", DemoIcons.Outline(DemoIcons.List),
        [
            ("/items/items-view", "demo.nav.items.items-view"),
            ("/items/table", "demo.nav.items.table"),
            ("/items/pager", "demo.nav.items.pager"),
            ("/items/tree", "demo.nav.items.tree"),
            ("/items/key-value-action", "demo.nav.items.key-value-action"),
        ]),
        ("demo.nav.section.indicators", DemoIcons.Outline(DemoIcons.Clock),
        [
            ("/indicators/spinner", "demo.nav.indicators.spinner"),
            ("/indicators/progress", "demo.nav.indicators.progress"),
        ]),
        ("demo.nav.section.overlays", DemoIcons.Outline(DemoIcons.MessageSquare),
        [
            ("/overlays/dialog", "demo.nav.overlays.dialog"),
            ("/overlays/notification", "demo.nav.overlays.notification"),
        ]),
    ];

    /// <summary>
    /// The page band from the preset; the theme and language switchers are on every page, controller or not, since the theme and the
    /// language are the framework's state.
    /// </summary>
    public static ContainerComponent CreateHeader(string title, string description)
        => UIPage.Header(title, description,
            new LanguageSwitcherComponent(),
            new ThemeSwitcherComponent()
                .SetLightIcon(DemoIcons.Outline(DemoIcons.LightMode))
                .SetDarkIcon(DemoIcons.Outline(DemoIcons.DarkMode))
        );

    /// <summary>
    /// The sidebar every route wears, built from <see cref="MenuComponent"/>.
    /// </summary>
    public static ContainerComponent CreateSidebar(string currentRoute)
    {
        List<MenuItem> entries =
        [
            CreateNavEntry("/", "demo.nav.home", currentRoute, DemoIcons.Outline(DemoIcons.Home))
        ];

        foreach ((var sectionTitle, var sectionIcon, (string Route, string Label)[] links) in NavSections)
        {
            MenuItem section = new() { Id = sectionTitle, Title = sectionTitle, Icon = sectionIcon };

            foreach ((var route, var label) in links)
                section.Items.Add(CreateNavEntry(route, label, currentRoute));

            // A section with one page is that page: a fold over a single entry is a click for nothing.
            if (section.Items.Count == 1)
            {
                MenuItem only = section.Items[0];
                only.Icon = sectionIcon;
                entries.Add(only);
                continue;
            }

            // The current page's section opens in the HTML itself, so nothing shifts after the first paint.
            section.Expanded = HoldsCurrentRoute(section);

            entries.Add(section);
        }

        // The width sits on the menu, not the container, or opening a section would move the whole page.
        // The authored id is what the client keys the collapsed state and the open group by.
        return new ContainerComponent()
            .SetHorizontalAlignment(UIAlignment.Start)
            .SetPadding(UIThickness.All(16, 16, 16, 24))
            .AddChild(new MenuComponent(SidebarId)
                .SetShowCollapseToggle(true)
                .SetSearch()
                .SetMinWidth(UILayoutLength.Absolute(180))
                .SetItems([.. entries])
            );
    }

    private static bool HoldsCurrentRoute(MenuItem section)
    {
        foreach (MenuItem entry in section.Items)
        {
            if (entry.Selected == true)
                return true;
        }

        return false;
    }

    /// <summary>
    /// The entry's id is its route, which keys the collection and is stable across renders.
    /// </summary>
    private static MenuItem CreateNavEntry(string route, string label, string currentRoute, string? icon = null)
        => new()
        {
            Id = route,
            Title = label,
            Icon = icon,
            Url = route,
            Selected = route == currentRoute
        };

    /// <summary>
    /// Numbered tiles for the pages whose component has no look of its own.
    /// </summary>
    /// <remarks>Same size, same fill and a number, so a tile reads as a position rather than as content.</remarks>
    public static IVisualComponent[] CreateTiles(int count, double height = 56)
    {
        IVisualComponent[] tiles = new IVisualComponent[count];

        for (var i = 0; i < count; i++)
        {
            tiles[i] = new SurfaceComponent()
                // Square corners: a panel's children sit edge to edge, and rounded ones leave a notch of page.
                .SetSurface(UISurfaceStyle.Tinted)
                .SetBackground(UIThemeColor.Accent)
                .SetBorderColor(UIThemeColor.Accent)
                .SetBorderRadius(UICornerRadius.Uniform(0))
                .SetPadding(UIThickness.Uniform(0))
                .SetWidth(UILayoutLength.Absolute(56))
                .SetHeight(UILayoutLength.Absolute(height))
                .SetContent(new TextComponent()
                    .SetTitle((i + 1).ToString(CultureInfo.InvariantCulture))
                    .SetTitleType(UITextAppearance.Caption)
                    .SetTextAlignment(UITextAlignment.Center)
                    .SetVerticalAlignment(UIAlignment.Center)
                );
        }

        return tiles;
    }

    /// <summary>
    /// The same tiles, sized by the column span each claims rather than by a width of their own.
    /// </summary>
    public static IVisualComponent[] CreateSpannedTiles(int count, int span)
    {
        IVisualComponent[] tiles = CreateTiles(count);

        for (var i = 0; i < tiles.Length; i++)
            _ = ((SurfaceComponent)tiles[i]).SetWidth(UILayoutLength.Auto()).SetPlacement(1, 1, span, 1);

        return tiles;
    }

    /// <summary>
    /// The two columns a gallery page is read in — the shape, so no page has to build it again: the groups go into the page's wrap
    /// in pairs, so the two groups of a row start level, and each takes its own height.
    /// </summary>
    /// <remarks>
    /// Not two independent stacks: every row past the first would start at a different height on each side. A pair leaves room
    /// under its shorter group instead, which reads as a row.
    /// </remarks>
    public static IVisualComponent[] CreateColumns(IEnumerable<ContainerComponent> left, IEnumerable<ContainerComponent> right)
    {
        ContainerComponent[] lefts = [.. left];
        ContainerComponent[] rights = [.. right];
        List<IVisualComponent> groups = [];

        for (var i = 0; i < Math.Max(lefts.Length, rights.Length); i++)
        {
            if (i < lefts.Length)
                groups.Add(lefts[i]);

            if (i < rights.Length)
                groups.Add(rights[i]);
        }

        return [.. groups];
    }

    /// <summary>
    /// Several groups one under another as one half of a pair, beside a single group about as tall as they are together — where a
    /// pair of rows would leave a hole under the shorter side and the last group alone in its row.
    /// </summary>
    /// <remarks>The page's wrap keeps groups 16 apart down a line; the stack keeps its groups as far apart, so the two halves read alike.</remarks>
    public static StackPanelComponent CreateHalf(params ContainerComponent[] groups)
    {
        ArgumentNullException.ThrowIfNull(groups);

        StackPanelComponent half = UILayout.Stack(16)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, 12, 1));

        // Each group takes the half's whole width: its own placement is a half of the page's.
        foreach (ContainerComponent group in groups)
            _ = half.AddChild(group.SetPlacement(1, 1, 24, 1));

        return half;
    }

    /// <summary>The vertical stack an Examples group lays its samples in, the width of the group.</summary>
    public static StackPanelComponent CreateStack(double spacing = 12)
        => UILayout.Stack(spacing).SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// A sample under its label, as <c>UIPage.Labelled</c> lays it out, the label told to wrap: the demo's labels are sentences, which a
    /// label keeps to one line unless the view says so.
    /// </summary>
    public static StackPanelComponent CreateLabelled(string label, IVisualComponent content)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetSpacing(6)
            .AddChild(UIText.Label(label).SetTitleWrap(true))
            .AddChild(content);

    /// <summary>
    /// The heading over a component page's examples, across the page's width under a rule, so the options above read as finished.
    /// </summary>
    public static StackPanelComponent CreateSectionHeading(string title)
        => UILayout.Stack(16,
                new SeparatorComponent(),
                UIText.Subtitle(title)
            )
            .SetPlacement(1, 1, 24, 1);

    /// <summary>The line closing a component page: the screen or mechanism page that composes the component for real.</summary>
    public static StackPanelComponent CreateComposedIn(string route, string label)
        => UILayout.Row(6,
                UIText.Note("demo.page.composed-in"),
                new LinkComponent()
                    .SetTitle(label)
                    .SetUrl(route)
                    .SetTitleType(UITextAppearance.Caption)
            )
            .SetMargin(UIThickness.All(0, 8, 0, 0))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// The shell every demo page is built from, so a layout fix here lands on every demo route at once.
    /// </summary>
    /// <remarks>
    /// <paramref name="initControls"/> and its 220px column are optional, and <paramref name="controlsBelow"/> puts them under the
    /// content at every width, for a sample that needs the group's whole width; <paramref name="contentMinHeight"/>
    /// reserves nothing unless a caller needs a fixed box; <paramref name="note"/> is the line under the title. <paramref name="words"/>
    /// is for a page whose groups are words rather than samples (the overlay pages, the mechanism pages): nothing in it is content, so
    /// the unkeyed report, and with it <c>DemoWordsCoverageTests</c>, reads every static text of the group. <paramref name="context"/>
    /// names the group's controller context, whose message stands under the group. <paramref name="controller"/> names the controller
    /// code the sample runs, shown on a tab of its own beside <paramref name="code"/>.
    /// </remarks>
    public static ContainerComponent CreateGroup(string? context, string title, Action<ContainerComponent> initContent, Action<StackPanelComponent>? initControls = null, double contentMinHeight = 0, int columns = 12, string? note = null, string? code = null, bool controlsBelow = false, bool words = false, IReadOnlyList<DemoCode>? controller = null)
    {
        var hasContext = !string.IsNullOrWhiteSpace(context);
        var hasNote = !string.IsNullOrWhiteSpace(note);

        // Filled before layout, because whether the controls column is kept depends on what ended up in it.
        StackPanelComponent? controls = null;

        if (initControls is not null)
        {
            controls = new StackPanelComponent()
                .SetSpacing(4)
                .SetHorizontalAlignment(UIAlignment.Stretch)
                .SetPlacement(1, 1, 24, 1);

            initControls(controls);

            if (!controls.HasChildren)
                controls = null;
        }

        // Beside the actions from the medium breakpoint up, unless the caller asks for them below; under them on a phone, which has
        // no room for a column of 220 pixels.
        var beside = controls is not null && !controlsBelow;
        var span = beside ? 23 : 24;
        var noteRow = hasNote ? 2 : 1;
        var contentRow = noteRow + 1;
        // The message stands under the content, and under the controls a phone puts below it too, so one arriving moves neither.
        var messageRow = contentRow + (controls is null ? 1 : 2);
        // A group stretched to its taller neighbour's height takes the slack in a last, empty row, so the controls and the message stay
        // right under the content and a message arriving moves nothing in the group.
        var slackRow = messageRow + (hasContext ? 1 : 0);

        // No outline of its own: the preview and the options list each draw their own. No inline padding either, so a group's
        // content starts at the page's own edge, under its heading; the page's wrap keeps the groups apart.
        // The title row is as tall as the code button, so a group with the button starts its content where one without it does.
        // A sample, its title and its note are the author's prose and API names, shown as written: content for the unkeyed report.
        ContainerComponent group = new ContainerComponent()
            .SetPadding(UIThickness.All(0, 12, 0, 12))
            .SetRow(1, UIGridUnit.Auto(min: 24))
            .SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, columns, 1));

        if (!words)
            _ = group.AsContentTree();

        if (hasNote)
            _ = group.AddRow(UIGridUnit.Auto());

        _ = group.AddRow(UIGridUnit.Auto());

        // Centred in its row, as the code button beside it is: both stand on the row's middle with no offset tied to either's size.
        TextComponent header = new TextComponent()
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Overline)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, span, 1));

        // An auto row plus a spacer, not a fixed-height cell: two groups sharing a row must start level.
        ContainerComponent content = new ContainerComponent()
            .SetMinHeight(UILayoutLength.Absolute(contentMinHeight))
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetPlacement(1, contentRow, 24, 1, md: UIGridPlacement.At(1, contentRow, span, 1));

        initContent(content);

        _ = group.AddChild(header);

        // Over the title's own cell rather than a column of its own, which would take a twenty-fourth of the width from every group.
        if (code is not null)
        {
            _ = header.SetMargin(UIThickness.All(0, 0, 32, 0));
            _ = group.AddChild(CreateCodeFlyout(code, controller is null ? null : DemoSources.Read(controller)).SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, span, 1)));
        }

        // A note rather than a title: prose wraps, a title ends in an ellipsis.
        if (hasNote)
            _ = group.AddChild(UIText.Note(note!).SetMargin(UIThickness.All(0, 0, 0, 8)).SetPlacement(1, noteRow, 24, 1, md: UIGridPlacement.At(1, noteRow, span, 1)));

        _ = group.AddChild(content);

        if (controls is not null)
            AddControls(group, controls, beside, contentRow, slackRow);

        if (hasContext)
            AddMessage(group, context!, messageRow, span);

        return group.AddRow(UIGridUnit.Star());
    }

    /// <summary>The controls' panel: in the 220 px column beside the content from the medium breakpoint up, else under it.</summary>
    /// <remarks>
    /// Beside, the panel spans every row down to the slack row, so a panel taller than the content grows that row rather than sharing
    /// its height out among the auto rows, the title's included.
    /// </remarks>
    private static void AddControls(ContainerComponent group, StackPanelComponent controls, bool beside, int contentRow, int slackRow)
    {
        // A captioned block rather than a bare column of ghost buttons, and no frame: each control draws its own.
        ContainerComponent panel = new ContainerComponent()
            .SetVerticalAlignment(UIAlignment.Start)
            .SetMargin(beside ? UIResponsive<UIThickness>.Create(UIThickness.All(0, 12, 0, 0), md: UIThickness.All(12, 0, 0, 0)) : UIThickness.All(0, 12, 0, 0))
            .SetRow(1, UIGridUnit.Auto(min: 24))
            .AddRow(UIGridUnit.Auto())
            // The spacer keeps the frame the height of its rows rather than sharing the column's slack.
            .AddRow(UIGridUnit.Star())
            // Centred in its row, as the group's title is in the row beside it, so the two captions stand on one line.
            .AddChild(UIText.Label("demo.group.actions")
                .SetVerticalAlignment(UIAlignment.Center)
                .SetPlacement(1, 1, 24, 1)
            )
            .AddChild(new ContainerComponent()
                // A container starts with one Star row, so adding another leaves an empty row.
                .SetRow(1, UIGridUnit.Auto())
                .AddChild(controls)
                .SetPlacement(1, 2, 24, 1)
            )
            .SetPlacement(1, contentRow + 1, 24, 1, md: beside ? UIGridPlacement.At(24, 1, 1, slackRow) : null);

        if (beside)
            _ = group.SetColumn(24, UIGridUnit.Absolute(220));

        _ = group
            .AddRow(UIGridUnit.Auto())
            .AddChild(panel);
    }

    /// <summary>
    /// The line the group's controller writes, under everything else and reserving nothing: the sample never moves when a message
    /// arrives, only the groups below it shift by a line, and the gap from the note to the sample is the same in every group.
    /// </summary>
    /// <remarks>Rejected: a row reserved under the note, which put 26 px between the note and the sample of every group with a controller.</remarks>
    private static void AddMessage(ContainerComponent group, string context, int row, int span)
        => _ = group
            .AddRow(UIGridUnit.Auto())
            .BindContext(context)
            .AddChild(new TextComponent()
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetMargin(UIThickness.All(0, 8, 0, 0))
                .BindDescription(nameof(DemoGroupContext.Message), UIBindingScope.Relative)
                .SetPlacement(1, row, 24, 1, md: UIGridPlacement.At(1, row, span, 1))
            );

    /// <summary>
    /// The <c>&lt;/&gt;</c> button in a group's corner and the popup it opens: the sample's source, read-only, with a copy button — and,
    /// where the sample names the controller code it runs, that code on a second tab.
    /// </summary>
    /// <remarks>Both tabs as tall as the longer text, so the popup keeps its size when the tab changes.</remarks>
    private static FlyoutComponent CreateCodeFlyout(string expression, string? controller)
    {
        var view = FormatSource(expression);
        var rows = Math.Clamp(Math.Max(CountLines(view), controller is null ? 0 : CountLines(controller)) + 1, 3, 24);

        IVisualComponent content = controller is null
            ? CreateCodePane(view, rows)
            : new TabsComponent()
                .AddTab("view", "demo.code.view", CreateCodePane(view, rows))
                .AddTab("controller", "demo.code.controller", CreateCodePane(controller, rows));

        return new FlyoutComponent()
            .SetFlyoutPlacement(UIPopupPlacement.BottomEnd)
            .SetHorizontalAlignment(UIAlignment.End)
            .SetVerticalAlignment(UIAlignment.Center)
            // Smaller than a small button's 28px, to fit the title row a group without the button has.
            .SetAnchor(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetSize(UIButtonSize.Small)
                .SetMinHeight(UILayoutLength.Absolute(24))
                .SetPadding(UIThickness.Uniform(2))
                .SetIcon(DemoIcons.Outline(DemoIcons.Code))
                .SetTooltip("demo.code")
            )
            .SetContent(new ContainerComponent()
                .SetWidth(UILayoutLength.Absolute(640))
                .AddChild(content)
            );
    }

    /// <summary>
    /// The captured argument as it would be written on its own: the first line flush left, the rest moved by as much.
    /// </summary>
    /// <remarks>
    /// The compiler hands over the text with the call site's indentation on every line but the first, so the base is found from the
    /// first line at the expression's own depth: a closing bracket stands on the base, a chained call one step (four spaces) in.
    /// </remarks>
    private static string FormatSource(string expression)
    {
        var lines = expression.Trim().Replace("\r\n", "\n", StringComparison.Ordinal).Split('\n');
        var cut = BaseIndent(lines);
        StringBuilder text = new(lines[0].TrimEnd());

        for (var i = 1; i < lines.Length; i++)
        {
            var line = lines[i].TrimEnd();
            var indent = line.Length - line.TrimStart().Length;
            _ = text.Append('\n').Append(line[Math.Min(indent, cut)..]);
        }

        return text.ToString();
    }

    private static int BaseIndent(string[] lines)
    {
        var depth = CountDepth(lines[0], 0);
        var fallback = int.MaxValue;

        for (var i = 1; i < lines.Length; i++)
        {
            var body = lines[i].TrimStart();

            if (body.Length == 0)
                continue;

            var indent = lines[i].Length - body.Length;
            var closers = 0;

            while (closers < body.Length && body[closers] is ')' or ']' or '}')
                closers++;

            if (depth - closers <= 0)
                return closers > 0 ? indent : Math.Max(0, indent - 4);

            fallback = Math.Min(fallback, indent);
            depth = CountDepth(lines[i], depth);
        }

        return fallback == int.MaxValue ? 0 : Math.Max(0, fallback - 4);
    }

    /// <summary>
    /// The bracket depth after a line, skipping string and character literals and a trailing line comment.
    /// </summary>
    private static int CountDepth(string line, int depth)
    {
        for (var i = 0; i < line.Length; i++)
        {
            var c = line[i];

            if (c is '"' or '\'')
            {
                for (i++; i < line.Length && line[i] != c; i++)
                {
                    if (line[i] == '\\')
                        i++;
                }
            }
            else if (c == '/' && i + 1 < line.Length && line[i + 1] == '/')
            {
                break;
            }
            else if (c is '(' or '[' or '{')
            {
                depth++;
            }
            else if (c is ')' or ']' or '}')
            {
                depth--;
            }
        }

        return depth;
    }

    private static int CountLines(string source)
        => source.Count(static c => c == '\n') + 1;

    /// <summary>One source in the framework's code field, read-only, with its own copy button.</summary>
    private static ContainerComponent CreateCodePane(string source, int rows)
        => new ContainerComponent()
            .AddChild(new CodeInputComponent()
                .SetLanguage(UICodeLanguages.CSharp)
                .SetValue(source)
                .SetIsReadOnly(true)
                .SetStatusBar(false)
                .SetSearch(false)
                .SetCompletions(false)
                // One row over the text's own: a long line brings a horizontal scrollbar, which would cover the last one.
                .SetRows(rows)
                .SetPlacement(1, 1, 24, 1)
            )
            // A literal rather than the field's value: the text is fixed, and a literal needs no id unique across the page.
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetSize(UIButtonSize.Small)
                .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                .SetTooltip("demo.copy")
                .SetHorizontalAlignment(UIAlignment.End)
                .SetVerticalAlignment(UIAlignment.Start)
                // Clear of the text's vertical scrollbar, which runs down the same edge once the source is longer than the box.
                .SetMargin(UIThickness.All(4, 4, 16, 4))
                .InteractOn(EventNames.Click, CopyToClipboardEffect.Literal(source))
                .SetPlacement(1, 1, 24, 1)
            )
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// An Examples group around one sample, its source a press away in the title's corner.
    /// </summary>
    /// <remarks>
    /// The source is the argument's own text, captured by the compiler, so the popup cannot drift from what runs; the price is that a
    /// sample is one expression, and the sample data it takes is named in it rather than shown. <paramref name="controller"/> names the
    /// controller code it runs, read from the demo's own sources (<see cref="DemoSources"/>) onto a Controller tab.
    /// </remarks>
    public static ContainerComponent CreateExample(string title, IVisualComponent example, string? note = null, int columns = 12, string? context = null, Action<StackPanelComponent>? initControls = null, double contentMinHeight = 0, bool controlsBelow = false, bool words = false, IReadOnlyList<DemoCode>? controller = null, [CallerArgumentExpression(nameof(example))] string code = "")
        => CreateGroup(context, title, content => content.AddChild(CreateStack(0).AddChild(example)), initControls, contentMinHeight, columns, note, code, controlsBelow, words, controller);

    /// <summary>
    /// The preview half of a component's own page: the component under test, alone, inside a fixed frame.
    /// </summary>
    /// <remarks>The frame does not follow the component, so a hidden or moved one is still readable as such.</remarks>
    public static ContainerComponent CreatePreview(Action<ContainerComponent> initContent, double contentMinHeight = 220)
        => CreatePreview(contentMinHeight, (null, initContent));

    /// <summary>
    /// The same preview drawn more than once — one captioned pane per entry, all bound to the same properties.
    /// </summary>
    /// <remarks>For what cannot be bound: a property the view decides once is reviewed by drawing both answers.</remarks>
    public static ContainerComponent CreatePreview(double contentMinHeight, params (string? Caption, Action<ContainerComponent> InitContent)[] panes)
    {
        ArgumentNullException.ThrowIfNull(panes);

        StackPanelComponent stack = UILayout.Stack(12)
            .SetPlacement(1, 1, 24, 1);

        // One pane keeps the whole height; several share it, none below what a two-line component needs.
        var frameMinHeight = Math.Max(80, ((contentMinHeight - 40) / panes.Length) - 24);

        foreach ((var caption, Action<ContainerComponent> initContent) in panes)
        {
            if (caption is not null)
                _ = stack.AddChild(UIText.Label(caption).SetTitleWrap(true));

            ContainerComponent frame = new ContainerComponent()
                .SetPadding(UIThickness.Uniform(12))
                .SetBorderThickness(UIThickness.Uniform(1))
                .SetBorderColor(UIThemeColor.Border)
                .SetMinHeight(UILayoutLength.Absolute(panes.Length == 1 ? contentMinHeight - 40 : frameMinHeight));

            initContent(frame);

            _ = stack.AddChild(frame);
        }

        // No "last change" line under the caption: every option row already prints its own value. The frames hold the floor; one on the
        // group as well would leave an empty band under them.
        return CreateGroup(null, "demo.group.preview",
            content => content.AddChild(stack),
            columns: 14
        );
    }

    /// <summary>
    /// The options half: every bindable property of the component, in sections, one open at a time.
    /// </summary>
    /// <remarks>No scroller of its own: one open section is short enough to scroll with the page.</remarks>
    public static ContainerComponent CreateOptions(params ExpanderComponent[] sections)
    {
        ArgumentNullException.ThrowIfNull(sections);

        // One section open at a time is the accordion's own rule, so nothing is compiled into the view.
        AccordionComponent accordion = new AccordionComponent()
            .SetPlacement(1, 1, 24, 1)
            .AddChildren(sections);

        // Ten of the twenty-four: a row is a name and a value, and the rest of the width goes to the preview.
        return CreateGroup(null, "demo.group.options",
            content => content.AddChild(accordion),
            columns: 10
        );
    }

    /// <summary>
    /// One themed block of options: the rows its controller context registered, as a key/value/action list.
    /// </summary>
    /// <remarks>The rows come from the context, not the caller, so the value column stays live off a bound collection.</remarks>
    public static ExpanderComponent CreateOptionSection(string context, string title, string cycleCommand, string? note = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(context);
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(cycleCommand);

        // No edge of its own, the expander draws one; no action column, because the whole row is the control.
        KeyValueActionComponent rows = new KeyValueActionComponent()
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetShowActions(false)
            .SetRowHoverable(true)
            .BindItems(nameof(DemoGroupContext.OptionRows), UIBindingScope.Relative)
            .OnRowClickWithItemKey(cycleCommand)
            .SetPlacement(1, 1, 24, 1);

        // Closed to start with: the list reads as a table of contents until a section is asked for.
        return new ExpanderComponent()
            .SetCollapsed()
            .ConfigureDefaultHeader(header => _ = header
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
                .SetDescription(note)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.Muted)
            )
            .BindContext(context)
            .SetContent(rows)
            .SetPlacement(1, 1, 24, 1);
    }

    /// <summary>A strip of sibling pages, each its own address: a horizontal menu, which marks the current one as the sidebar does.</summary>
    /// <remarks>Not the Tabs component: its captions switch panes in place, and these pages are routes of their own.</remarks>
    public static MenuComponent CreateTabs((string Label, string Url)[] tabs, string currentUrl)
        => new MenuComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetItems([.. tabs.Select(tab => CreateNavEntry(tab.Url, tab.Label, currentUrl))])
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// The rows of a group's action panel — one <see cref="ActionComponent"/> per command.
    /// </summary>
    /// <remarks>Sized to the options list's row height rather than the control's own, to keep one rhythm.</remarks>
    public static void InitControls(StackPanelComponent controls, Dictionary<string, string> events)
    {
        ArgumentNullException.ThrowIfNull(controls);
        ArgumentNullException.ThrowIfNull(events);

        foreach ((var title, var command) in events)
        {
            _ = controls.AddChild(new ActionComponent()
                .OnClick(command)
                .SetMinHeight(UILayoutLength.Absolute(40))
                .SetTitle(title).SetTitleType(UITextAppearance.Caption)
            );
        }
    }
}
