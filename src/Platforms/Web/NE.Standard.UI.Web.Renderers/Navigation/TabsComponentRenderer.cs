using System;
using System.Collections.Generic;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// A caption strip over a set of pages. Both halves of a tab are real components in their own regions, so a
/// caption's title, icon, badge and <c>Visible</c> all live-patch through the ordinary property path — which
/// is why the strip is not markup this renderer invents.
/// </summary>
public sealed class TabsComponentRenderer : WebComponentRendererBase
{
    private const string HeaderRegionPrefix = "tab-header:";
    private const string SelectedAttribute = "data-ui-tabs-selected";

    public override string ComponentTypeKey => TabsComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tabs";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // The selected key rides on the root rather than as a class per tab: one attribute is what the client
        // engine flips on a click and what a server patch writes, so both drive the same single fact.
        _ = RenderProperty<string?>(context, root, TabsComponent.SelectedKeyProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(SelectedAttribute, value);
        }, [WebDomOperation.Attribute(SelectedAttribute, target: "root")]);

        List<string> keys = ResolveTabKeys(context);

        _ = root.Element("div", strip =>
        {
            _ = strip.Class("ui-tabs__strip");
            _ = strip.Attribute("role", "tablist");

            foreach (var key in keys)
                RenderRegion(context, strip, TabRegionNames.Header(key));
        });

        _ = root.Element("div", pages =>
        {
            _ = pages.Class("ui-tabs__pages");

            foreach (var key in keys)
            {
                _ = pages.Element("div", page =>
                {
                    _ = page.Class("ui-tabs__page");
                    _ = page.Attribute("data-ui-tab-page", key);
                    _ = page.Attribute("role", "tabpanel");

                    RenderRegion(context, page, TabRegionNames.Page(key));
                });
            }
        });
    }

    /// <summary>
    /// The tab order, read off the compiled slots rather than off the authoring component — a compiled node
    /// keeps no reference to the component it came from, and slots are recorded in the order they were added,
    /// which is the order <c>AddTab</c> was called in.
    /// </summary>
    private static List<string> ResolveTabKeys(WebRenderContext context)
    {
        List<string> keys = [];

        foreach (UIComponentSlot slot in context.Node.Slots)
        {
            if (slot.Kind == UIComponentSlotKind.Region && slot.Key is { } name && name.StartsWith(HeaderRegionPrefix, StringComparison.Ordinal))
                keys.Add(name[HeaderRegionPrefix.Length..]);
        }

        return keys;
    }
}
