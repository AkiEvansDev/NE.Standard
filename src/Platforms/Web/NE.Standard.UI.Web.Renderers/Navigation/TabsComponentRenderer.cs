using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>A caption strip over a set of pages, both halves of each tab being real components in their own regions.</summary>
public sealed class TabsComponentRenderer : WebComponentRendererBase
{
    private const string HeaderRegionPrefix = "tab-header:";

    public override string ComponentTypeKey => TabsComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tabs";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SelectionStyleRenderer.RenderSelectionStyle(context, root);

        TabsSelectionRenderer.RenderSelectedKey(context, root, TabsComponent.SelectedKeyProperty);

        RenderFlagClass(context, root, TabsComponent.ShowOverflowProperty, "ui-tabs--no-overflow", WebValueCondition.IsFalse);

        List<string> keys = ResolveTabKeys(context);
        var selected = ResolveSelectedTab(context, keys);

        _ = root.Element("div", strip =>
        {
            _ = strip.Class("ui-tabs__strip");
            _ = strip.Attribute("role", "tablist");

            foreach (var key in keys)
                RenderRegion(context, strip, TabRegionNames.Header(key));

            RenderTabOverflowButton(context, strip);
        });

        _ = root.Element("div", pages =>
        {
            _ = pages.Class("ui-tabs__pages");

            foreach (var key in keys)
            {
                _ = pages.Element("div", page =>
                {
                    _ = page.Class("ui-tabs__page");
                    _ = page.Attribute(WebAttributes.TabPage, key);
                    _ = page.Attribute("role", "tabpanel");

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
            if (slot.Kind == UIComponentSlotKind.Region && slot.Key is { } name && name.StartsWith(HeaderRegionPrefix, StringComparison.Ordinal))
                keys.Add(name[HeaderRegionPrefix.Length..]);
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
}
