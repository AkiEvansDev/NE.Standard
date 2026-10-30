using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>A caption strip over a set of pages, both halves of each tab being real components in their own regions.</summary>
public sealed class TabsComponentRenderer : WebComponentRendererBase
{
    private const string CaptionRegionPrefix = "tab-caption:";

    internal const string TabPart = "tab";
    internal const string PanelPart = "panel";

    public override string ComponentTypeKey => TabsComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Tabs;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SelectionStyleRenderer.RenderSelectionStyle(context, root);

        TabsSelectionRenderer.RenderSelectedKey(context, root);

        RenderFlagClass(context, root, TabsComponent.ShowOverflowProperty, WebClassNames.TabsNoOverflow, WebValueCondition.IsFalse);

        List<string> keys = ResolveTabKeys(context);
        var selected = ResolveSelectedTab(context, keys);

        // With actions, a band holds the strip (the tablist, which takes only tabs) and the actions after it, and draws the rule;
        // without, the strip is the band.
        if (!HasRegion(context, TabRegionNames.Action(0)) && !keys.Exists(key => HasRegion(context, TabRegionNames.TabAction(key, 0))))
        {
            RenderStrip(context, root, keys);
        }
        else
        {
            _ = root.Element("div", band =>
            {
                _ = band.Class(WebClassNames.TabsBand);
                RenderStrip(context, band, keys);
                _ = band.Element("div", actions => RenderActions(context, actions, keys, selected));
            });
        }

        _ = root.Element("div", pages =>
        {
            _ = pages.Class("ui-tabs__pages");

            for (var i = 0; i < keys.Count; i++)
            {
                var key = keys[i];
                var index = i;

                _ = pages.Element("div", page =>
                {
                    _ = page.Class("ui-tabs__page");
                    _ = page.Attribute(WebAttributes.TabPage, key);
                    _ = page.Attribute("role", "tabpanel");

                    // Named by its tab, which names it back (TabCaptionComponentRenderer).
                    if (TabPartId(context, PanelPart, index) is string id)
                    {
                        _ = page.Attribute("id", id);
                        _ = page.Attribute("aria-labelledby", TabPartId(context, TabPart, index));
                    }

                    // Hidden here as the engine would hide it, so the first paint shows one page rather than all of them stacked.
                    if (selected is not null && !string.Equals(key, selected, StringComparison.Ordinal))
                        _ = page.Attribute("hidden");

                    RenderRegion(context, page, TabRegionNames.Page(key));
                });
            }
        });
    }

    /// <summary>The tab order, read off the compiled slots, which are recorded in the order they were added.</summary>
    internal static List<string> ResolveTabKeys(WebRenderContext context)
    {
        List<string> keys = [];

        foreach (UIComponentSlot slot in context.Node.Slots)
        {
            if (slot.Kind == UIComponentSlotKind.Region && slot.Key is { } name && name.StartsWith(CaptionRegionPrefix, StringComparison.Ordinal))
                keys.Add(name[CaptionRegionPrefix.Length..]);
        }

        return keys;
    }

    /// <summary>
    /// The tab the page opens on, as <c>tabs-engine.ts</c> decides it: the chosen key, or the first tab where the key names none;
    /// null where the render cannot know it (a bound key with no session value).
    /// </summary>
    internal static string? ResolveSelectedTab(WebRenderContext context, List<string> keys)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(keys);

        WebRenderValueKind kind = ResolveRenderValue(context, TabsComponent.SelectedKeyProperty, out string? selected, out _);

        if (keys.Count == 0 || (kind == WebRenderValueKind.Binding && selected is null))
            return null;

        return selected is not null && keys.Contains(selected) ? selected : keys[0];
    }

    private static void RenderStrip(WebRenderContext context, IHtmlElementBuilder host, List<string> keys)
        => _ = host.Element("div", strip =>
        {
            _ = strip.Class(WebClassNames.TabsStrip);
            _ = strip.Attribute("role", "tablist");

            foreach (var key in keys)
                RenderRegion(context, strip, TabRegionNames.Caption(key));

            RenderTabOverflowButton(context, strip);
        });

    /// <summary>Each tab's own actions in a group of their own, hidden as its page is, in the tabs' order; then the strip's own.</summary>
    private static void RenderActions(WebRenderContext context, IHtmlElementBuilder actions, List<string> keys, string? selected)
    {
        _ = actions.Class("ui-tabs__actions");

        foreach (var key in keys)
        {
            if (!HasRegion(context, TabRegionNames.TabAction(key, 0)))
                continue;

            _ = actions.Element("div", group =>
            {
                _ = group.Class("ui-tabs__tab-actions");
                _ = group.Attribute(WebAttributes.TabActions, key);

                if (selected is not null && !string.Equals(key, selected, StringComparison.Ordinal))
                    _ = group.Attribute("hidden");

                for (var i = 0; HasRegion(context, TabRegionNames.TabAction(key, i)); i++)
                    RenderRegion(context, group, TabRegionNames.TabAction(key, i));
            });
        }

        for (var i = 0; HasRegion(context, TabRegionNames.Action(i)); i++)
            RenderRegion(context, actions, TabRegionNames.Action(i));
    }

    /// <summary>
    /// The id of the tab at <paramref name="index"/> in the strip of <paramref name="tabs"/>, or of its page; null where the tabs may
    /// stand on the page more than once.
    /// </summary>
    internal static string? TabPartId(WebRenderContext tabs, string part, int index)
        => ComponentPartId(tabs, string.Create(CultureInfo.InvariantCulture, $"{part}-{index}"));
}
