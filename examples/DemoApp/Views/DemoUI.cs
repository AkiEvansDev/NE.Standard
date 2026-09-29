using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;

namespace DemoApp.Views;

internal static class DemoUI
{
    /// <summary>The sidebar's authored id, which keys its collapsed state and open section.</summary>
    private const string SidebarId = "demo-sidebar";

    public static readonly (string Title, string Icon, (string ComponentRoute, string Label)[] Links)[] NavSections =
    [
        // First, because these are the pages a reader judges the whole by: pieces of an application, not a component each.
        ("demo.nav.section.screens", DemoIcons.Outline(DemoIcons.Home),
        [
            ("/screens/sign-up", "demo.nav.screens.sign-up"),
            ("/screens/checkout", "demo.nav.screens.checkout"),
            ("/screens/settings", "demo.nav.screens.settings"),
            ("/screens/catalogue", "demo.nav.screens.catalogue"),
            ("/screens/inbox", "demo.nav.screens.inbox"),
            ("/screens/article", "demo.nav.screens.article"),
            ("/screens/sign-in", "demo.nav.screens.sign-in"),
            ("/screens/account", "demo.nav.screens.account"),
            ("/screens/admin", "demo.nav.screens.admin"),
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
            ("/contents/link", "demo.nav.contents.link"),
            ("/contents/icon", "demo.nav.contents.icon"),
            ("/contents/image", "demo.nav.contents.image"),
            ("/contents/badge", "demo.nav.contents.badge"),
            ("/contents/separator", "demo.nav.contents.separator"),
        ]),
        ("demo.nav.section.actions", DemoIcons.Outline(DemoIcons.Navigation),
        [
            ("/actions/button", "demo.nav.actions.button"),
            ("/actions/split-button", "demo.nav.actions.split-button"),
            ("/actions/button-group", "demo.nav.actions.button-group"),
            ("/actions/action", "demo.nav.actions.action"),
            ("/actions/command-bar", "demo.nav.actions.command-bar"),
            ("/actions/theme-switcher", "demo.nav.actions.theme-switcher"),
            ("/actions/language-switcher", "demo.nav.actions.language-switcher"),
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
    /// The page a route lands on; the sidebar lists the routes named here, each at its <see cref="DemoViewKind.Main"/> or <see cref="DemoViewKind.Test"/> page.
    /// </summary>
    internal static readonly Dictionary<string, DemoViewKind> LandingKinds = new(StringComparer.Ordinal)
    {
        // A screen's route is its own page, which is what Main means here; it has no other kinds.
        ["/screens/sign-up"] = DemoViewKind.Main,
        ["/screens/checkout"] = DemoViewKind.Main,
        ["/screens/settings"] = DemoViewKind.Main,
        ["/screens/catalogue"] = DemoViewKind.Main,
        ["/screens/inbox"] = DemoViewKind.Main,
        ["/screens/article"] = DemoViewKind.Main,
        ["/screens/sign-in"] = DemoViewKind.Main,
        ["/screens/account"] = DemoViewKind.Main,
        ["/screens/admin"] = DemoViewKind.Main,
        ["/screens/forbidden"] = DemoViewKind.Main,
        ["/actions/button"] = DemoViewKind.Main,
        ["/actions/action"] = DemoViewKind.Main,
        ["/actions/split-button"] = DemoViewKind.Main,
        ["/actions/command-bar"] = DemoViewKind.Main,
        ["/actions/theme-switcher"] = DemoViewKind.Main,
        ["/actions/language-switcher"] = DemoViewKind.Main,
        ["/contents/badge"] = DemoViewKind.Main,
        ["/contents/icon"] = DemoViewKind.Main,
        ["/contents/image"] = DemoViewKind.Main,
        ["/contents/link"] = DemoViewKind.Main,
        ["/contents/separator"] = DemoViewKind.Main,
        ["/indicators/progress"] = DemoViewKind.Main,
        ["/indicators/spinner"] = DemoViewKind.Main,
        ["/contents/text"] = DemoViewKind.Main,
        ["/contents/paragraph"] = DemoViewKind.Main,
        ["/items/key-value-action"] = DemoViewKind.Main,
        ["/layouts/container"] = DemoViewKind.Main,
        ["/layouts/surface"] = DemoViewKind.Main,
        ["/layouts/card"] = DemoViewKind.Main,
        ["/layouts/expander"] = DemoViewKind.Main,
        ["/layouts/stack-panel"] = DemoViewKind.Main,
        ["/layouts/wrap-panel"] = DemoViewKind.Main,
        ["/layouts/scroll"] = DemoViewKind.Main,
        ["/layouts/flyout"] = DemoViewKind.Main,
        ["/layouts/collapsible-panel"] = DemoViewKind.Main,
        ["/layouts/grid-splitter"] = DemoViewKind.Main,
        ["/inputs/color-input"] = DemoViewKind.Main,
        ["/inputs/text-input"] = DemoViewKind.Main,
        ["/inputs/text-area"] = DemoViewKind.Main,
        ["/inputs/number-input"] = DemoViewKind.Main,
        ["/inputs/checkbox"] = DemoViewKind.Main,
        ["/inputs/switch"] = DemoViewKind.Main,
        ["/inputs/radio-group"] = DemoViewKind.Main,
        ["/inputs/select"] = DemoViewKind.Main,
        ["/inputs/multi-select"] = DemoViewKind.Main,
        ["/inputs/search"] = DemoViewKind.Main,
        ["/inputs/file-input"] = DemoViewKind.Main,
        ["/inputs/image-input"] = DemoViewKind.Main,
        ["/inputs/slider"] = DemoViewKind.Main,
        ["/inputs/date-input"] = DemoViewKind.Main,
        ["/inputs/time-input"] = DemoViewKind.Main,
        ["/inputs/date-time-input"] = DemoViewKind.Main,
        ["/items/items-view"] = DemoViewKind.Main,
        ["/items/table"] = DemoViewKind.Main,
        ["/items/tree"] = DemoViewKind.Main,
        ["/navigation/menu"] = DemoViewKind.Main,
        ["/navigation/tabs"] = DemoViewKind.Main,
        ["/navigation/tabs-view"] = DemoViewKind.Main,
        ["/navigation/breadcrumbs"] = DemoViewKind.Main,
        ["/actions/button-group"] = DemoViewKind.Main,
        ["/overlays/dialog"] = DemoViewKind.Test,
        ["/overlays/notification"] = DemoViewKind.Test
    };

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
    public static ContainerComponent CreateSidebar(string currentComponentRoute)
    {
        List<MenuItem> entries =
        [
            CreateNavEntry("/", "demo.nav.home", currentComponentRoute, icon: DemoIcons.Outline(DemoIcons.Home)),
            CreateNavEntry("/design/colors", "demo.nav.design.colors", currentComponentRoute, icon: DemoIcons.Outline(DemoIcons.Palette))
        ];

        foreach ((var sectionTitle, var sectionIcon, (string ComponentRoute, string Label)[] links) in NavSections)
        {
            MenuItem section = new() { Id = sectionTitle, Title = sectionTitle, Icon = sectionIcon };

            foreach ((var componentRoute, var label) in links)
            {
                if (!LandingKinds.TryGetValue(componentRoute, out DemoViewKind landing))
                    continue;

                section.Items.Add(CreateNavEntry(RouteFor(componentRoute, landing), label, currentComponentRoute, componentRoute));
            }

            if (section.Items.Count == 0)
                continue;

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
    private static MenuItem CreateNavEntry(string route, string label, string currentComponentRoute, string? componentRoute = null, string? icon = null)
        => new()
        {
            Id = route,
            Title = label,
            Icon = icon,
            Url = route,
            Selected = (componentRoute ?? route) == currentComponentRoute
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

    /// <summary>The vertical stack an Examples group lays its samples in, the width of the group.</summary>
    public static StackPanelComponent CreateStack(double spacing = 12)
        => UILayout.Stack(spacing).SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// The shell every demo page is built from, so a layout fix here lands on every demo route at once.
    /// </summary>
    /// <remarks>
    /// <paramref name="initControls"/> and its 220px column are optional, and <paramref name="controlsBelow"/> puts them under the
    /// content at every width, for a sample that needs the group's whole width; <paramref name="contentMinHeight"/>
    /// reserves nothing unless a caller needs a fixed box; <paramref name="note"/> is the line under the title.
    /// </remarks>
    public static ContainerComponent CreateGroup(string? context, string title, Action<ContainerComponent> initContent, Action<StackPanelComponent>? initControls = null, double contentMinHeight = 0, int columns = 12, string? note = null, string? code = null, bool controlsBelow = false)
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
        var contextRow = hasContext ? 2 : 1;
        var noteRow = contextRow + (hasNote ? 1 : 0);
        var contentRow = noteRow + 1;

        // No outline of its own: the preview and the options list each draw their own. No inline padding either, so a group's
        // content starts at the page's own edge, under its heading and tab strip; the page's wrap keeps the groups apart.
        // The title row is as tall as the code button, so a group with the button starts its content where one without it does.
        ContainerComponent group = new ContainerComponent()
            .SetPadding(UIThickness.All(0, 12, 0, 12))
            .SetRow(1, UIGridUnit.Auto(min: 24))
            .SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, columns, 1));

        // Reserved for the message, so one arriving does not move the content.
        if (hasContext)
            _ = group.AddRow(UIGridUnit.Auto(min: 26));

        if (hasNote)
            _ = group.AddRow(UIGridUnit.Auto());

        _ = group.AddRow(UIGridUnit.Star());

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

        // A row of its own rather than the title's description: sharing the title's cell would take the title off the row's middle.
        if (hasContext)
        {
            _ = group.BindContext(context!);
            _ = group.AddChild(new TextComponent()
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetVerticalAlignment(UIAlignment.Start)
                .BindDescription(nameof(DemoGroupContext.Message), UIBindingScope.Relative)
                .SetPlacement(1, contextRow, 24, 1, md: UIGridPlacement.At(1, contextRow, span, 1))
            );
        }

        // Over the title's own cell rather than a column of its own, which would take a twenty-fourth of the width from every group.
        if (code is not null)
        {
            _ = header.SetMargin(UIThickness.All(0, 0, 32, 0));
            _ = group.AddChild(CreateCodeFlyout(code).SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, span, 1)));
        }

        // A note rather than a title: prose wraps, a title ends in an ellipsis.
        if (hasNote)
            _ = group.AddChild(UIText.Note(note!).SetMargin(UIThickness.All(0, 0, 0, 8)).SetPlacement(1, noteRow, 24, 1, md: UIGridPlacement.At(1, noteRow, span, 1)));

        _ = group.AddChild(content);

        if (controls is null)
            return group;

        // A captioned block rather than a bare column of ghost buttons, and no frame: each control draws its own.
        ContainerComponent panel = new ContainerComponent()
            .SetVerticalAlignment(UIAlignment.Start)
            .SetMargin(beside ? UIResponsive<UIThickness>.Create(UIThickness.All(0, 12, 0, 0), md: UIThickness.All(12, 0, 0, 0)) : UIThickness.All(0, 12, 0, 0))
            .SetRow(1, UIGridUnit.Auto(min: 24))
            .AddRow(UIGridUnit.Auto())
            // The spacer keeps the frame the height of its rows rather than sharing the column's slack.
            .AddRow(UIGridUnit.Star())
            .AddChild(UIText.Label("demo.group.actions")
                .SetVerticalAlignment(UIAlignment.Start)
                .SetPlacement(1, 1, 24, 1)
            )
            .AddChild(new ContainerComponent()
                // A container starts with one Star row, so adding another leaves an empty row.
                .SetRow(1, UIGridUnit.Auto())
                .AddChild(controls)
                .SetPlacement(1, 2, 24, 1)
            )
            .SetPlacement(1, contentRow + 1, 24, 1, md: beside ? UIGridPlacement.At(24, 1, 1, contentRow) : null);

        if (beside)
            _ = group.SetColumn(24, UIGridUnit.Absolute(220));

        return group
            .AddRow(UIGridUnit.Auto())
            .AddChild(panel);
    }

    /// <summary>
    /// The <c>&lt;/&gt;</c> button in a group's corner and the popup it opens: the sample's source, read-only, with a copy button.
    /// </summary>
    private static FlyoutComponent CreateCodeFlyout(string expression)
    {
        var source = FormatSource(expression);
        var lines = source.Count(static c => c == '\n') + 1;

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
                .AddChild(new CodeInputComponent()
                    .SetLanguage(UICodeLanguages.CSharp)
                    .SetValue(source)
                    .SetIsReadOnly(true)
                    .SetStatusBar(false)
                    .SetSearch(false)
                    .SetCompletions(false)
                    // One row over the text's own: a long line brings a horizontal scrollbar, which would cover the last one.
                    .SetRows(Math.Clamp(lines + 1, 3, 24))
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

    /// <summary>
    /// An Examples group around one sample, its source a press away in the title's corner.
    /// </summary>
    /// <remarks>
    /// The source is the argument's own text, captured by the compiler, so the popup cannot drift from what runs; the price is that a
    /// sample is one expression, and the sample data it takes is named in it rather than shown.
    /// </remarks>
    public static ContainerComponent CreateExample(string title, IVisualComponent example, string? note = null, int columns = 12, string? context = null, Action<StackPanelComponent>? initControls = null, double contentMinHeight = 0, bool controlsBelow = false, [CallerArgumentExpression(nameof(example))] string code = "")
        => CreateGroup(context, title, content => content.AddChild(CreateStack(0).AddChild(example)), initControls, contentMinHeight, columns, note, code, controlsBelow);

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
                _ = stack.AddChild(UIText.Label(caption));

            ContainerComponent frame = new ContainerComponent()
                .SetPadding(UIThickness.Uniform(12))
                .SetBorderThickness(UIThickness.Uniform(1))
                .SetBorderColor(UIThemeColor.Border)
                .SetMinHeight(UILayoutLength.Absolute(panes.Length == 1 ? contentMinHeight - 40 : frameMinHeight));

            initContent(frame);

            _ = stack.AddChild(frame);
        }

        // No "last change" line under the caption: every option row already prints its own value.
        return CreateGroup(null, "demo.group.preview",
            content => content.AddChild(stack),
            contentMinHeight: contentMinHeight,
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

    public static StackPanelComponent CreatePageTabs(string componentRoute, DemoViewKind current, DemoViewKind[] available)
    {
        (string Label, string Url)[] tabs = new (string Label, string Url)[available.Length];

        for (var i = 0; i < available.Length; i++)
            tabs[i] = (KindKey(available[i]), RouteFor(componentRoute, available[i]));

        return CreateTabs(tabs, RouteFor(componentRoute, current));
    }

    /// <summary>A kind's name as the demo's key: <c>demo.kind.examples</c>.</summary>
    public static string KindKey(DemoViewKind kind)
        => "demo.kind." + kind.ToString().ToLowerInvariant();

    /// <summary>
    /// The page a kind lives at. A component's first page is its own route: <see cref="DemoViewKind.Main"/>, or
    /// <see cref="DemoViewKind.Test"/> for the two that have no Main, so no component's own address is a 404.
    /// </summary>
    public static string RouteFor(string componentRoute, DemoViewKind kind)
        => kind is DemoViewKind.Main or DemoViewKind.Test
            ? componentRoute
            : $"{componentRoute}/{kind.ToString().ToLowerInvariant()}";

    public static StackPanelComponent CreateTabs((string Label, string Url)[] tabs, string currentUrl)
    {
        StackPanelComponent row = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(10)
            .SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, 24, 1));

        foreach ((var label, var url) in tabs)
        {
            _ = row.AddChild(new LinkComponent()
                .SetTitle(label)
                .SetUrl(url)
                .SetTitleType(UITextAppearance.Body)
                // The brand colour marks the page you are on; the rest stay quiet.
                .SetTitleColor(UIThemeColor.FromStyle(url == currentUrl ? UIColorStyle.Primary : UIColorStyle.Muted))
            );
        }

        return row;
    }

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
