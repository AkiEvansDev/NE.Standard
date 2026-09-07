using System;
using System.Collections.Generic;
using System.Globalization;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views;

internal static class DemoUI
{
    /// <summary>The sidebar's authored id, which keys its collapsed state and open section.</summary>
    private const string SidebarId = "demo-sidebar";

    public static readonly (string Title, string Icon, (string ComponentRoute, string Label)[] Links)[] NavSections =
    [
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
            ("/contents/key-value-action", "demo.nav.contents.key-value-action"),
        ]),
        ("demo.nav.section.actions", DemoIcons.Outline(DemoIcons.Navigation),
        [
            ("/actions/button", "demo.nav.actions.button"),
            ("/actions/split-button", "demo.nav.actions.split-button"),
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
            ("/navigation/button-group", "demo.nav.navigation.button-group"),
        ]),
        ("demo.nav.section.items", DemoIcons.Outline(DemoIcons.List),
        [
            ("/items/items-view", "demo.nav.items.items-view"),
            ("/items/table", "demo.nav.items.table"),
            ("/items/tree", "demo.nav.items.tree"),
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
    /// The page a route lands on; the sidebar lists only the entries whose kind is <see cref="DemoViewKind.Main"/>.
    /// </summary>
    internal static readonly Dictionary<string, DemoViewKind> LandingKinds = new(StringComparer.Ordinal)
    {
        ["/actions/button"] = DemoViewKind.Main,
        ["/actions/action"] = DemoViewKind.Main,
        ["/actions/split-button"] = DemoViewKind.Main,
        ["/actions/command-bar"] = DemoViewKind.Main,
        ["/actions/theme-switcher"] = DemoViewKind.Main,
        ["/contents/badge"] = DemoViewKind.Main,
        ["/contents/icon"] = DemoViewKind.Main,
        ["/contents/image"] = DemoViewKind.Main,
        ["/contents/link"] = DemoViewKind.Main,
        ["/contents/separator"] = DemoViewKind.Main,
        ["/indicators/progress"] = DemoViewKind.Main,
        ["/indicators/spinner"] = DemoViewKind.Main,
        ["/contents/text"] = DemoViewKind.Main,
        ["/contents/paragraph"] = DemoViewKind.Main,
        ["/contents/key-value-action"] = DemoViewKind.Main,
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
        ["/navigation/button-group"] = DemoViewKind.Main,
        ["/overlays/dialog"] = DemoViewKind.Test,
        ["/overlays/notification"] = DemoViewKind.Test
    };

    public static ContainerComponent CreateHeader(string title, string description)
    {
        ContainerComponent header = new ContainerComponent()
            .SetPadding(UIThickness.All(24, 20, 24, 4))
            .AddRow(UIGridUnit.Star());

        _ = header.AddChild(new TextComponent()
            .SetTitle(title)
            .SetTitleType(UITextAppearance.Display)
            .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.OnBackground))
            .SetDescription(description)
            .SetDescriptionType(UITextAppearance.Body)
            .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            .SetPlacement(1, 1, 22, 1)
        );

        // On every page, controller or not: the theme is the framework's state, so nothing is bound.
        _ = header.AddChild(new ThemeSwitcherComponent()
            .SetLightIcon(DemoIcons.Outline(DemoIcons.LightMode))
            .SetDarkIcon(DemoIcons.Outline(DemoIcons.DarkMode))
            .SetHorizontalAlignment(UIAlignment.End)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetPlacement(23, 1, 2, 1)
        );

        return header;
    }

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
                if (!LandingKinds.TryGetValue(componentRoute, out DemoViewKind landing) || landing is not (DemoViewKind.Main or DemoViewKind.Test))
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
            .SetPadding(UIThickness.All(16, 0, 16, 24))
            .AddChild(new MenuComponent(SidebarId)
                .SetShowCollapseToggle(true)
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
    /// The two columns a gallery page is read in — the shape, so no page has to build it again.
    /// </summary>
    /// <remarks>Two independent stacks rather than a wrap, whose rows would lock to the tallest group in them.</remarks>
    public static IVisualComponent[] CreateColumns(IEnumerable<ContainerComponent> left, IEnumerable<ContainerComponent> right)
        => [CreateColumn(left), CreateColumn(right)];

    private static StackPanelComponent CreateColumn(IEnumerable<ContainerComponent> groups)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(16)
            .AddChildren(groups)
            .SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, 12, 1));

    /// <summary>The vertical stack an Examples group lays its samples in, the width of the group.</summary>
    public static StackPanelComponent CreateStack(double spacing = 12)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(spacing)
            .SetPlacement(1, 1, 24, 1);

    /// <summary>A row of samples that wraps when the group is narrow.</summary>
    public static StackPanelComponent CreateRow(double spacing = 12)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(spacing)
            .SetWrap(true);

    /// <summary>The overline caption a sample or a pane is named by.</summary>
    public static TextComponent CreateCaption(string label)
        => new TextComponent()
            .SetTitle(label)
            .SetTitleType(UITextAppearance.Overline)
            .SetTitleColor(UIThemeColor.Muted);

    /// <summary>A sample under its caption, for the "against" groups that set two things side by side.</summary>
    public static StackPanelComponent CreateCaptionedItem(string label, IVisualComponent sample)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetSpacing(6)
            .AddChild(CreateCaption(label))
            .AddChild(sample);

    /// <summary>
    /// The shell every demo page is built from, so a layout fix here lands on every demo route at once.
    /// </summary>
    /// <remarks>
    /// <paramref name="initControls"/> and its 220px column are optional; <paramref name="contentMinHeight"/>
    /// reserves nothing unless a caller needs a fixed box; <paramref name="note"/> is the line under the title.
    /// </remarks>
    public static ContainerComponent CreateGroup(string? context, string title, Action<ContainerComponent> initContent, Action<StackPanelComponent>? initControls = null, double contentMinHeight = 0, int columns = 12, string? note = null)
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

        var span = controls is null ? 24 : 23;

        // No outline of its own: the preview and the options list each draw their own.
        ContainerComponent group = new ContainerComponent()
            .SetPadding(UIThickness.Uniform(12))
            .SetRow(1, UIGridUnit.Auto(min: hasContext ? 50 : 24))
            .SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, columns, 1));

        if (hasNote)
            _ = group.AddRow(UIGridUnit.Auto());

        _ = group.AddRow(UIGridUnit.Star());

        TextComponent header = new TextComponent()
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Overline)
                .SetVerticalAlignment(UIAlignment.Start)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetPlacement(1, 1, span, 1);

        // An auto row plus a spacer, not a fixed-height cell: two groups sharing a row must start level.
        ContainerComponent content = new ContainerComponent()
            .SetMinHeight(UILayoutLength.Absolute(contentMinHeight))
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetPlacement(1, hasNote ? 3 : 2, span, 1);

        if (hasContext)
        {
            _ = group.BindContext(context!);
            _ = header.BindDescription(nameof(DemoGroupContext.Message), UIBindingScope.Relative);
        }

        initContent(content);

        _ = group.AddChild(header);

        // A description rather than a title: prose wraps, a title ends in an ellipsis.
        if (hasNote)
        {
            _ = group.AddChild(new ParagraphComponent()
                .SetDescription(note!)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.Muted)
                .SetMargin(UIThickness.All(0, 0, 0, 8))
                .SetPlacement(1, 2, span, 1)
            );
        }

        _ = group.AddChild(content);

        if (controls is null)
            return group;

        // A captioned block rather than a bare column of ghost buttons, and no frame: each control draws its own.
        ContainerComponent panel = new ContainerComponent()
            .SetVerticalAlignment(UIAlignment.Start)
            .SetMargin(UIThickness.All(12, 0, 0, 0))
            .SetRow(1, UIGridUnit.Auto(min: 24))
            .AddRow(UIGridUnit.Auto())
            // The spacer keeps the frame the height of its rows rather than sharing the column's slack.
            .AddRow(UIGridUnit.Star())
            .AddChild(new TextComponent()
                .SetTitle("Actions")
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
                .SetVerticalAlignment(UIAlignment.Start)
                .SetPlacement(1, 1, 24, 1)
            )
            .AddChild(new ContainerComponent()
                // A container starts with one Star row, so adding another leaves an empty row.
                .SetRow(1, UIGridUnit.Auto())
                .AddChild(controls)
                .SetPlacement(1, 2, 24, 1)
            )
            .SetPlacement(24, 1, 1, 2);

        return group
            .SetColumn(24, UIGridUnit.Absolute(220))
            .AddChild(panel);
    }

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

        StackPanelComponent stack = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetPlacement(1, 1, 24, 1);

        // One pane keeps the whole height; several share it, none below what a two-line component needs.
        var frameMinHeight = Math.Max(80, ((contentMinHeight - 40) / panes.Length) - 24);

        foreach ((var caption, Action<ContainerComponent> initContent) in panes)
        {
            if (caption is not null)
                _ = stack.AddChild(CreateCaption(caption));

            ContainerComponent frame = new ContainerComponent()
                .SetPadding(UIThickness.Uniform(12))
                .SetBorderThickness(UIThickness.Uniform(1))
                .SetBorderColor(UIThemeColor.Border)
                .SetMinHeight(UILayoutLength.Absolute(panes.Length == 1 ? contentMinHeight - 40 : frameMinHeight));

            initContent(frame);

            _ = stack.AddChild(frame);
        }

        // No "last change" line under the caption: every option row already prints its own value.
        return CreateGroup(null, "Preview",
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
        return CreateGroup(null, "Options",
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
            tabs[i] = (available[i].ToString(), RouteFor(componentRoute, available[i]));

        return CreateTabs(tabs, RouteFor(componentRoute, current));
    }

    /// <summary>The page a kind lives at; <see cref="DemoViewKind.Main"/> is the component's own route.</summary>
    public static string RouteFor(string componentRoute, DemoViewKind kind)
        => kind == DemoViewKind.Main ? componentRoute : $"{componentRoute}/{kind.ToString().ToLowerInvariant()}";

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
