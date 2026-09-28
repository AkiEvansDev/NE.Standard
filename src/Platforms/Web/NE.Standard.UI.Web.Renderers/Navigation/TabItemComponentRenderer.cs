using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>One tab: a caption and the page it opens, with the close control a sibling button rather than a nested one.</summary>
public sealed class TabItemComponentRenderer : WebComponentRendererBase
{
    private const string CloseClass = "ui-tab-item__close";
    private const string LabelClass = "ui-tab-item__label";
    private const string PinClass = "ui-tab-item__pin";
    private const string SelectedClassName = "ui-tab-item--selected";

    private static readonly WebDomOperation[] PinnedOperations =
    [
        WebDomOperation.ToggleAttribute(WebAttributes.TabPinned, target: "root", condition: WebValueCondition.IsTrue),
        WebDomOperation.ToggleAttribute(WebAttributes.TabPinned, target: "." + PinClass, condition: WebValueCondition.IsTrue)
    ];

    public override string ComponentTypeKey => TabItemComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tab-item";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // The order rides on the root as an attribute, so a drag writes it there and the ordinary two-way path carries it.
        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.TabOrder);
        _ = RenderProperty<double?>(context, root, TabItemComponent.OrderProperty, static (target, value) =>
        {
            if (value is double order)
                _ = target.Attribute(WebAttributes.TabOrder, order.ToString(CultureInfo.InvariantCulture));
        }, [WebDomOperation.Attribute(WebAttributes.TabOrder, target: "root")]);

        // Null where the render cannot know which tab is open: then every mark waits for the engine, as before.
        var own = IsSelectedTab(context, root);

        if (own == true)
            _ = root.Class(SelectedClassName);

        // The tab is its own row: the marks the strip reads — no close for an unremovable tab, no drag for an undraggable one — are its.
        ItemAbilitiesRenderer.RenderItemAbilities(context, root);

        // A pinned tab is one more mark of the same kind, read by the stylesheet and the strip's engine alike. The binding sits on
        // the pin below, since the root's one writable value is already the order.
        if (ReadRenderValue<bool?>(context, TabItemComponent.PinnedProperty, false) == true)
            _ = root.Attribute(WebAttributes.TabPinned);

        _ = root.Element("div", caption =>
        {
            _ = caption.Class("ui-tab-item__caption");

            // A right press on the caption opens the strip's tab menu; a template with a menu of its own is the nearer owner.
            _ = caption.Attribute(WebAttributes.ContextMenuUse, UITabMenu.Name);

            _ = caption.Element("button", label =>
            {
                _ = label.Class(LabelClass + " ui-button ui-button--ghost");
                _ = label.Attribute("type", "button");
                _ = label.Attribute("role", "tab");

                if (own is bool selected)
                    _ = label.Attribute("aria-selected", selected ? "true" : "false");

                // On the label, not the root: one element carries one writable value, and the root's is already the order.
                _ = label.Attribute(WebAttributes.ValueKind, WebValueKinds.TabCaption);
                _ = RenderProperty<string?>(context, label, TabItemComponent.RenamedTitleProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Attribute(WebAttributes.TabCaption, value);
                }, [WebDomOperation.Attribute(WebAttributes.TabCaption, target: "." + LabelClass)]);

                RenderRegion(context, label, RegionNames.Header);
            });

            // The pin is always in the markup and drawn only on a pinned tab, so pinning is an attribute flip, not a re-render. It
            // holds the pinned state the tab menu writes back.
            _ = caption.Element("span", pin =>
            {
                _ = pin.Class(PinClass);
                _ = pin.Attribute("aria-hidden", "true");
                _ = pin.Attribute(WebAttributes.ValueKind, WebValueKinds.TabPinned);
                _ = RenderProperty<bool?>(context, pin, TabItemComponent.PinnedProperty, static (target, value) =>
                {
                    if (value == true)
                        _ = target.Attribute(WebAttributes.TabPinned);
                }, PinnedOperations);
            });

            _ = caption.Element("button", close =>
            {
                _ = close.Class(CloseClass);
                _ = close.Attribute("type", "button");
                _ = close.Attribute("aria-label", context.Translate(UIStrings.TabClose));
                _ = close.Attribute("tabindex", "-1");
            });
        });

        _ = root.Element("div", page =>
        {
            _ = page.Class("ui-tab-item__page");
            _ = page.Attribute("role", "tabpanel");

            // Hidden here as the engine would hide it, so the first paint shows one page rather than all of them stacked.
            if (own == false)
                _ = page.Attribute("hidden");

            RenderRegion(context, page, RegionNames.Content);
        });
    }

    /// <summary>
    /// Whether this tab is the one the tabs view opens on, as <c>tabs-view-engine.ts</c> decides it: the chosen key, or the first
    /// tab where the key names none; null outside a tabs view or where its tabs are the client's to draw.
    /// </summary>
    private static bool? IsSelectedTab(WebRenderContext context, IHtmlElementBuilder root)
    {
        CompiledView view = context.ViewResolution.View;

        if (context.Parameters.Count == 0 || context.Parameters[^1].ComponentId != context.Node.ComponentId)
            return null;

        if (context.Node.ParentId is not UIComponentId parentId || !view.Graph.TryGet(parentId, out UIComponentNode? tabs) || tabs.TypeKey != TabsViewComponent.ComponentTypeKey)
            return null;

        WebRenderContext owner = context.ForNode(tabs, root);
        WebRenderValueKind kind = ResolveRenderValue(owner, TabsViewComponent.SelectedKeyProperty, out string? selected, out _);
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(owner);

        if (isBound || items.Count == 0 || (kind == WebRenderValueKind.Binding && selected is null))
            return null;

        var opened = FindTab(items, selected) ?? (items[0] as IBindableItem)?.Id;

        return string.Equals(opened, context.Parameters[^1].Key, StringComparison.Ordinal);
    }

    private static string? FindTab(IReadOnlyList<object?> items, string? key)
    {
        if (key is null)
            return null;

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is IBindableItem item && string.Equals(item.Id, key, StringComparison.Ordinal))
                return key;
        }

        return null;
    }
}
