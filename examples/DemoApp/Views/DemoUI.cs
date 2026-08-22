using System;
using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Security;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views;

internal static class DemoUI
{
    /// <summary>The sidebar's authored id — the key its collapsed state and open section are kept under.</summary>
    private const string SidebarId = "demo-sidebar";

    public static readonly (string Title, string Icon, (string ComponentRoute, string Label)[] Links)[] NavSections =
    [
        ("demo.nav.section.layouts", LucideIcons.LayoutDashboard,
        [
            ("/layouts/container", "demo.nav.layouts.container"),
            ("/layouts/stack-panel", "demo.nav.layouts.stack-panel"),
            ("/layouts/wrap-panel", "demo.nav.layouts.wrap-panel"),
            ("/layouts/card", "demo.nav.layouts.card"),
            ("/layouts/expander", "demo.nav.layouts.expander"),
            ("/layouts/scroll-container", "demo.nav.layouts.scroll-container"),
            ("/layouts/flyout", "demo.nav.layouts.flyout"),
        ]),
        ("demo.nav.section.contents", LucideIcons.FileText,
        [
            ("/contents/text", "demo.nav.contents.text"),
            ("/contents/badge", "demo.nav.contents.badge"),
            ("/contents/icon", "demo.nav.contents.icon"),
            ("/contents/image", "demo.nav.contents.image"),
            ("/contents/link", "demo.nav.contents.link"),
            ("/contents/separator", "demo.nav.contents.separator"),
            ("/contents/key-value-action", "demo.nav.contents.key-value-action"),
        ]),
        ("demo.nav.section.actions", LucideIcons.Play,
        [
            ("/actions/button", "demo.nav.actions.button"),
            ("/actions/action", "demo.nav.actions.action"),
            ("/actions/command-bar", "demo.nav.actions.command-bar"),
        ]),
        ("demo.nav.section.navigation", LucideIcons.Navigation,
        [
            ("/navigation/menu", "demo.nav.navigation.menu"),
            ("/navigation/context-menu", "demo.nav.navigation.context-menu"),
            ("/navigation/tabs", "demo.nav.navigation.tabs"),
            ("/navigation/tabs-view", "demo.nav.navigation.tabs-view"),
            ("/navigation/breadcrumbs", "demo.nav.navigation.breadcrumbs"),
        ]),
        ("demo.nav.section.inputs", LucideIcons.Sliders,
        [
            ("/inputs/text-input", "demo.nav.inputs.text-input"),
            ("/inputs/text-area", "demo.nav.inputs.text-area"),
            ("/inputs/number-input", "demo.nav.inputs.number-input"),
            ("/inputs/slider", "demo.nav.inputs.slider"),
            ("/inputs/date-input", "demo.nav.inputs.date-input"),
            ("/inputs/time-input", "demo.nav.inputs.time-input"),
            ("/inputs/date-time-input", "demo.nav.inputs.date-time-input"),
            ("/inputs/search", "demo.nav.inputs.search"),
            ("/inputs/select", "demo.nav.inputs.select"),
            ("/inputs/radio-group", "demo.nav.inputs.radio-group"),
            ("/inputs/checkbox", "demo.nav.inputs.checkbox"),
            ("/inputs/switch", "demo.nav.inputs.switch"),
            ("/inputs/file-input", "demo.nav.inputs.file-input"),
        ]),
        ("demo.nav.section.indicators", LucideIcons.ChartLine,
        [
            ("/indicators/progress", "demo.nav.indicators.progress"),
            ("/indicators/spinner", "demo.nav.indicators.spinner"),
        ]),
        ("demo.nav.section.items", LucideIcons.List,
        [
            ("/items/items-view", "demo.nav.items.items-view"),
        ]),
        ("demo.nav.section.overlays", LucideIcons.MessageSquare,
        [
            ("/overlays/dialog", "demo.nav.overlays.dialog"),
            ("/overlays/notification", "demo.nav.overlays.notification"),
        ]),
    ];

    /// <summary>
    /// The page a sidebar entry lands on where it is not Binding. Every component has a binding page but
    /// this one, and an entry pointing at a page nobody registered is a 404 the sidebar itself produces.
    /// </summary>
    private static readonly Dictionary<string, DemoViewKind> LandingKinds = new(StringComparer.Ordinal)
    {
        ["/navigation/context-menu"] = DemoViewKind.Test,
        ["/overlays/dialog"] = DemoViewKind.Test,
        ["/overlays/notification"] = DemoViewKind.Test
    };

    /// <summary>
    /// Listed apart from <see cref="NavSections"/>: those are component pages with example/binding/test tabs,
    /// these are three pages of one flow.
    /// </summary>
    public static readonly (string Route, string Label)[] SecurityLinks =
    [
        (SecurityRoutes.SignIn, "demo.nav.security.sign-in"),
        (SecurityRoutes.Account, "demo.nav.security.account"),
        (SecurityRoutes.Reports, "demo.nav.security.reports"),
        (SecurityRoutes.Forbidden, "demo.nav.security.forbidden"),
    ];

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
            .SetPlacement(1, 1, 24, 1)
        );

        return header;
    }

    /// <summary>
    /// The sidebar every route wears, built from <see cref="MenuComponent"/> — the component's real test, and
    /// the reason section captions and rules are entries of the same collection rather than components the
    /// caller interleaves by hand.
    /// </summary>
    public static ContainerComponent CreateSidebar(string currentComponentRoute)
    {
        List<MenuItem> entries =
        [
            CreateNavEntry("/", "demo.nav.home", currentComponentRoute, icon: LucideIcons.Home),
            CreateNavEntry("/design/colors", "demo.nav.design.colors", currentComponentRoute, icon: LucideIcons.Palette)
        ];

        foreach ((var sectionTitle, var sectionIcon, (string ComponentRoute, string Label)[] links) in NavSections)
        {
            MenuItem section = new() { Id = sectionTitle, Title = sectionTitle, Icon = sectionIcon };

            foreach ((var componentRoute, var label) in links)
            {
                DemoViewKind landing = LandingKinds.TryGetValue(componentRoute, out DemoViewKind kind) ? kind : DemoViewKind.Binding;

                section.Items.Add(CreateNavEntry($"{componentRoute}/{landing.ToString().ToLowerInvariant()}", label, currentComponentRoute, componentRoute));
            }

            // The section holding the current page opens in the HTML itself, so the trail to where you are is
            // there on the first paint instead of arriving after it and pushing everything below it down.
            section.Expanded = HoldsCurrentRoute(section);

            entries.Add(section);
        }

        MenuItem security = new() { Id = "demo.nav.section.security", Title = "demo.nav.section.security", Icon = LucideIcons.Shield };

        foreach ((var route, var label) in SecurityLinks)
            security.Items.Add(CreateNavEntry(route, label, currentComponentRoute));

        security.Expanded = HoldsCurrentRoute(security);

        entries.Add(security);

        // The padding sits on the container: a menu has no padding of its own, the way CommandBar has none.
        // The width sits on the *menu*, not on the container: opening a section adds indented entries, and a
        // container sized to its content moved the whole page every time one opened. Collapsed, the menu
        // takes the width back and the rail is as wide as an icon.
        // The menu carries an authored id because that is what the client keys the collapsed state and the
        // open group by — without one it would work and forget between pages.
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
    /// The entry's id is its route, which is what makes it stable across renders — the collection is keyed by
    /// it, and two entries never share a destination.
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

    public static ContainerComponent CreateGroup(string? context, string title, Action<ContainerComponent> initContent, Action<StackPanelComponent> initControls, double? headerMinHeight = null, double contentMinHeight = 200)
    {

        // Every demo page is built from this one group shell, so a layout fix here lands on all 82 routes.
        var hasContext = !string.IsNullOrWhiteSpace(context);

        ContainerComponent group = new ContainerComponent()
            .SetPadding(UIThickness.Uniform(12))
            .SetBorderColor(UIThemeColor.Primary)
            .SetBorderThickness(UIThickness.Uniform(1.5))
            .SetColumn(24, UIGridUnit.Absolute(160))
            .SetRow(1, UIGridUnit.Auto(min: headerMinHeight ?? (hasContext ? 50 : 24)))
            .AddRow(UIGridUnit.Star())
            .SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, 12, 1));

        TextComponent header = new TextComponent()
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Overline)
                .SetVerticalAlignment(UIAlignment.Start)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetPlacement(1, 1, 23, 1);

        // The content box is an auto row plus a spacer rather than a fixed-height cell: floated in the
        // middle of a reserved height, two groups sharing a row started at different offsets.
        ContainerComponent content = new ContainerComponent()
            .SetMinHeight(UILayoutLength.Absolute(contentMinHeight))
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetPlacement(1, 2, 23, 1);

        StackPanelComponent controls = new StackPanelComponent()
            .SetHorizontalAlignment(UIAlignment.Stretch)
            .SetVerticalAlignment(UIAlignment.Start)
            .SetPadding(UIThickness.All(8, 0, 0, 0))
            .SetPlacement(24, 1, 1, 2);

        if (hasContext)
        {
            _ = group.BindContext(context!);
            _ = header.BindDescription(nameof(DemoGroupContext.Message), UIBindingScope.Relative);
        }

        initContent(content);
        initControls(controls);

        return group
            .AddChild(header)
            .AddChild(content)
            .AddChild(controls);
    }

    public static StackPanelComponent CreatePageTabs(string componentRoute, DemoViewKind current, DemoViewKind[] available)
    {
        (string Label, string Url)[] tabs = new (string Label, string Url)[available.Length];

        for (var i = 0; i < available.Length; i++)
            tabs[i] = (available[i].ToString(), $"{componentRoute}/{available[i].ToString().ToLowerInvariant()}");

        return CreateTabs(tabs, $"{componentRoute}/{current.ToString().ToLowerInvariant()}");
    }

    public static StackPanelComponent CreateTabs((string Label, string Url)[] tabs, string currentUrl)
    {
        StackPanelComponent row = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(16)
            .SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, 24, 1));

        foreach ((var label, var url) in tabs)
        {
            _ = row.AddChild(new LinkComponent()
                .SetText(label)
                .SetUrl(url)
                .SetTextType(UITextAppearance.Body)
                .SetTextColor(UIThemeColor.FromStyle(url == currentUrl ? UIColorStyle.OnBackground : UIColorStyle.Primary))
            );
        }

        return row;
    }

    public static void InitControls(StackPanelComponent controls, Dictionary<string, string> events)
    {
        foreach (var key in events.Keys)
        {
            _ = controls.AddChild(new ButtonComponent()
                .OnClick(events[key])
                .SetType(UIButtonType.Ghost)
                .SetHorizontalAlignment(UIAlignment.Stretch)
                .ConfigureDefaultContent(c => _ = c.SetTitle(key)
                    .SetTitleType(UITextAppearance.Caption)
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                    .SetTextAlignment(UITextAlignment.End)
                )
            );
        }
    }
}
