using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Text.Json;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Items;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Items;

/// <summary>Shared template and item-rendering logic for components that render item collections.</summary>
public abstract class ItemsCollectionRendererBase : WebComponentRendererBase
{
    private const string DefaultTemplateName = "default";
    private const string ItemsQueryClassName = "ui-items-query";

    // The wire's conventions, so the text a render writes is the text a patch would: camel-cased, an enum by its name.
    private static readonly JsonSerializerOptions QueryJsonOptions = WebWireJson.CreateOptions();

    /// <summary>What a virtualized static host paints before the client runs; the client takes over from these rows and holds the rest as values.</summary>
    protected const int VirtualizedFirstPaintRows = 40;

    protected static void RenderLayout(WebRenderContext context, IHtmlElementBuilder root, UIProperty layoutTypeProperty, UIProperty orientationProperty, UIProperty spacingProperty)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<UIItemsLayoutType?>(context, root, layoutTypeProperty, static (target, value) =>
        {
            if (value is UIItemsLayoutType layoutType)
                _ = target.Class(WebClassNames.ItemsViewLayout(layoutType));
        }, [WebDomOperation.Class(converter: WebDomConverters.ItemsViewLayoutClass)]);

        _ = RenderProperty<UIOrientation?>(context, root, orientationProperty, static (target, value) =>
        {
            if (value is UIOrientation orientation)
                _ = target.Class(WebClassNames.Orientation(orientation));
        }, [WebDomOperation.Class(converter: WebDomConverters.OrientationClass)]);

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, spacingProperty, "--ui-items-view-spacing");
    }

    /// <summary>Writes the selection mode and the single key onto the root; one element holds one writable value, so the list goes on the host.</summary>
    protected static void RenderSelection(WebRenderContext context, IHtmlElementBuilder root, bool focusable = false)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // The root takes the focus and the arrows walk its rows: always where the host walks them anyway, else only with rows to choose.
        if (focusable)
            _ = root.Attribute("tabindex", "0");

        _ = RenderProperty<UISelectionMode?>(context, root, ISelectableItemsComponent.SelectionModeProperty, (target, value) =>
        {
            if (value is not UISelectionMode mode)
                return;

            _ = target.Attribute(WebAttributes.Selection, WebCssValues.SelectionMode(mode));

            if (!focusable && mode != UISelectionMode.None)
                _ = target.Attribute("tabindex", "0");
        }, [WebDomOperation.Attribute(WebAttributes.Selection, converter: WebDomConverters.SelectionModeAttribute)]);

        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.SelectedKey);
        _ = RenderProperty<string?>(context, root, ISelectableItemsComponent.SelectedKeyProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute(WebAttributes.SelectedKey, value);
        }, [WebDomOperation.Attribute(WebAttributes.SelectedKey)]);

        RenderItemsQuery(context, root);
    }

    /// <summary>
    /// The terms the viewer set — a header's sort, a filter row — as JSON on a hidden element of their own inside the root, since the
    /// root's one writable value is the chosen key. An engine writes the attribute and raises <c>change</c> on the element; the rule
    /// watcher re-syncs the host on either side's write.
    /// </summary>
    protected static void RenderItemsQuery(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Element("div", query =>
        {
            _ = query.Class(ItemsQueryClassName).Attribute("hidden").Attribute(WebAttributes.ValueKind, WebValueKinds.ItemsQuery);
            _ = RenderProperty<UIItemsQuery?>(context, query, IItemsComponent.QueryProperty, static (target, value) =>
            {
                if (value is { IsEmpty: false })
                    _ = target.Attribute(WebAttributes.ItemsQuery, JsonSerializer.Serialize(value, QueryJsonOptions));
            }, [WebDomOperation.Attribute(WebAttributes.ItemsQuery)]);
        });
    }

    /// <summary>Marks a rendered row as chosen when its key is among the chosen ones.</summary>
    protected static void MarkSelected(IHtmlElementBuilder row, object? item, HashSet<string> selected)
    {
        ArgumentNullException.ThrowIfNull(row);
        ArgumentNullException.ThrowIfNull(selected);

        if (item is IBindableItem { Id: { } id } && selected.Contains(id))
            _ = row.Attribute(WebAttributes.Selected);
    }

    /// <summary>
    /// The row template of a composite is stamped, not rendered, so the abilities it carries are written here under the slot's own
    /// context; a list whose row template is not the built-in one writes nothing.
    /// </summary>
    protected static void RenderStampedRowAbilities(WebRenderContext context, IHtmlElementBuilder row, object? item)
    {
        if (ForStampedSlot(context, row, item, TemplateNames.Row) is WebRenderContext rowContext)
            ItemAbilitiesRenderer.RenderItemAbilities(rowContext, row);
    }

    /// <summary>Writes the chosen keys onto the host — JSON, so a pushed list and a chosen one are the same text.</summary>
    protected static void RenderSelectedKeys(WebRenderContext context, IHtmlElementBuilder host)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);

        _ = host.Attribute(WebAttributes.ValueKind, WebValueKinds.SelectedKeys);
        _ = RenderProperty<IReadOnlyList<string>?>(context, host, ISelectableItemsComponent.SelectedKeysProperty, static (target, value) =>
        {
            if (value is { Count: > 0 })
                _ = target.Attribute(WebAttributes.SelectedKeys, JsonSerializer.Serialize(value));
        }, [WebDomOperation.Attribute(WebAttributes.SelectedKeys, $"[{WebAttributes.ItemsHost}]")]);
    }

    /// <summary>The keys a static render marks as chosen, read from whichever property the selection mode names.</summary>
    protected static HashSet<string> ResolveSelectedKeys(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        HashSet<string> keys = new(StringComparer.Ordinal);

        _ = ResolveRenderValue(context, ISelectableItemsComponent.SelectionModeProperty, out UISelectionMode? mode, out _);

        if (mode == UISelectionMode.One)
        {
            _ = ResolveRenderValue(context, ISelectableItemsComponent.SelectedKeyProperty, out string? selectedKey, out _);

            if (!string.IsNullOrEmpty(selectedKey))
                _ = keys.Add(selectedKey);
        }
        else if (mode == UISelectionMode.Many)
        {
            _ = ResolveRenderValue(context, ISelectableItemsComponent.SelectedKeysProperty, out IReadOnlyList<string>? selectedKeys, out _);

            if (selectedKeys is not null)
                keys.UnionWith(selectedKeys);
        }

        return keys;
    }

    protected static UIItemsHostMode ResolveHostMode(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        _ = ResolveRenderValue(context, IItemsHostComponent.HostModeProperty, out UIItemsHostMode? hostMode, out _);

        return hostMode ?? UIItemsHostMode.Plain;
    }

    /// <summary>Names the mode on the host, the one place the client reads it; a plain host carries nothing.</summary>
    protected static void ApplyHostMode(IHtmlElementBuilder host, UIItemsHostMode hostMode)
    {
        ArgumentNullException.ThrowIfNull(host);

        if (hostMode == UIItemsHostMode.Virtualized)
            _ = host.Attribute(WebAttributes.HostMode, "virtualized");
        else if (hostMode == UIItemsHostMode.Windowed)
            _ = host.Attribute(WebAttributes.HostMode, "windowed");
    }

    /// <summary>The <see cref="IScrollableComponent"/> block, as classes and the anchor attribute on the host, which is the element that scrolls.</summary>
    protected static void ApplyHostScroll(WebRenderContext context, IHtmlElementBuilder host)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);

        _ = RenderProperty<UIScrollMode?>(context, host, IScrollableComponent.HorizontalScrollProperty, static (target, value) =>
        {
            if (value is UIScrollMode scrollMode)
                _ = target.Class(WebClassNames.ScrollX(scrollMode));
        }, [WebDomOperation.Class($"[{WebAttributes.ItemsHost}]", WebDomConverters.ScrollXClass)]);

        _ = RenderProperty<UIScrollMode?>(context, host, IScrollableComponent.VerticalScrollProperty, static (target, value) =>
        {
            if (value is UIScrollMode scrollMode)
                _ = target.Class(WebClassNames.ScrollY(scrollMode));
        }, [WebDomOperation.Class($"[{WebAttributes.ItemsHost}]", WebDomConverters.ScrollYClass)]);

        _ = RenderProperty<UIScrollSnapMode?>(context, host, IScrollableComponent.ScrollSnapProperty, static (target, value) =>
        {
            if (value is UIScrollSnapMode scrollSnap)
                _ = target.Class(WebClassNames.ScrollSnap(scrollSnap));
        }, [WebDomOperation.Class($"[{WebAttributes.ItemsHost}]", WebDomConverters.ScrollSnapClass)]);

        // The enum name, not a lowercased form: a patched value arrives as the name and is compared against it.
        _ = RenderProperty<UIScrollAnchor?>(context, host, IScrollableComponent.ScrollAnchorProperty, static (target, value) =>
        {
            if (value is UIScrollAnchor anchor)
                _ = target.Attribute(WebAttributes.ScrollAnchor, anchor.ToString());
        }, [WebDomOperation.Attribute(WebAttributes.ScrollAnchor, $"[{WebAttributes.ItemsHost}]")]);
    }

    /// <summary>Writes the window's size, offset and has-more flags onto a windowed host.</summary>
    protected static void ApplyWindowProperties(WebRenderContext context, IHtmlElementBuilder host, UIItemsHostMode hostMode)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);

        if (hostMode != UIItemsHostMode.Windowed)
            return;

        _ = ResolveRenderValue(context, IItemsHostComponent.WindowSizeProperty, out int? windowSize, out _);

        _ = host.Attribute(WebAttributes.WindowSize, (windowSize ?? 0).ToString(CultureInfo.InvariantCulture));

        RenderWindowValue(context, host, IItemsHostComponent.WindowOffsetProperty, WebAttributes.WindowOffset);
        RenderWindowValue(context, host, IItemsHostComponent.WindowTotalCountProperty, WebAttributes.WindowTotal);
        RenderWindowValue(context, host, IItemsHostComponent.WindowHasMoreBeforeProperty, WebAttributes.WindowMoreBefore);
        RenderWindowValue(context, host, IItemsHostComponent.WindowHasMoreAfterProperty, WebAttributes.WindowMoreAfter);
    }

    private static void RenderWindowValue(WebRenderContext context, IHtmlElementBuilder host, UIProperty property, string attribute)
    {
        _ = RenderProperty<object?>(context, host, property, (target, value) =>
        {
            // Lowercase for a bool, matching what a live patch writes through JavaScript's String().
            if (value is bool flag)
                _ = target.Attribute(attribute, flag ? "true" : "false");
            else if (value is not null)
                _ = target.Attribute(attribute, Convert.ToString(value, CultureInfo.InvariantCulture) ?? "");
        }, [WebDomOperation.Attribute(attribute, $"[{WebAttributes.ItemsHost}]")]);
    }

    protected static void RenderTemplates(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        CompiledView view = context.ViewResolution.View;

        if (view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Template, out UIComponentSlot? defaultTemplate))
        {
            _ = root.Element("template", template =>
            {
                _ = template.Attribute(WebAttributes.Template, DefaultTemplateName);
                context.Renderer.RenderComponent(context.ForHtml(template), defaultTemplate.RootComponentId);
            });
        }

        IReadOnlyList<UIComponentSlot> variants = view.Graph.GetSlots(context.Node.ComponentId, UIComponentSlotKind.TemplateVariant);

        for (var i = 0; i < variants.Count; i++)
        {
            UIComponentSlot variant = variants[i];

            if (string.IsNullOrWhiteSpace(variant.Key))
                continue;

            _ = root.Element("template", template =>
            {
                _ = template.Attribute(WebAttributes.Template, variant.Key);
                context.Renderer.RenderComponent(context.ForHtml(template), variant.RootComponentId);
            });
        }

        if (view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.EmptyTemplate, out UIComponentSlot? emptyTemplate))
        {
            _ = root.Element("template", template =>
            {
                _ = template.Attribute(WebAttributes.EmptyTemplate);
                context.Renderer.RenderComponent(context.ForHtml(template), emptyTemplate.RootComponentId);
            });
        }

        if (view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.GroupTemplate, out UIComponentSlot? groupTemplate))
        {
            _ = root.Element("template", template =>
            {
                _ = template.Attribute(WebAttributes.GroupTemplate);
                context.Renderer.RenderComponent(context.ForHtml(template), groupTemplate.RootComponentId);
            });
        }
    }

    /// <summary>Renders the empty-state content directly into an items host.</summary>
    protected static void RenderEmptyPlaceholder(WebRenderContext context, IHtmlElementBuilder host)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);

        CompiledView view = context.ViewResolution.View;

        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.EmptyTemplate, out UIComponentSlot? slot))
            return;

        _ = host.Element("div", placeholder =>
        {
            _ = placeholder.Attribute(WebAttributes.EmptyPlaceholder);
            context.Renderer.RenderComponent(context.ForHtml(placeholder), slot.RootComponentId);
        });
    }

    /// <summary>Registers the template metadata a client-rendered bound item is rebuilt from, wrapper and composite included.</summary>
    protected static void RegisterItemsTemplateMetadata(WebRenderContext context, string? itemWrapperElementName = null, string? itemWrapperClassName = null, WebRenderItemsCompositeMetadata? composite = null, string? rowDecorator = null)
    {
        ArgumentNullException.ThrowIfNull(context);

        var templateKeyPropertyName = ResolveStaticStringProperty(context, ITemplatedComponent.TemplateKeyPropertyProperty);
        var fallbackTemplateKey = ResolveStaticStringProperty(context, ITemplatedComponent.FallbackTemplateKeyProperty);

        context.Metadata.RegisterItemsTemplate(context.Node.ComponentId, templateKeyPropertyName, fallbackTemplateKey, itemWrapperElementName, itemWrapperClassName, composite, rowDecorator);
    }

    /// <summary>Registers filter/sort metadata from a static <c>ItemsView</c>; a bound one arrives as a live update instead.</summary>
    protected static void RegisterItemsFilterSortMetadata(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        CompiledView view = context.ViewResolution.View;

        if (view.State.TryGetValue(context.Node.ComponentId, IItemsComponent.ItemsViewProperty, out CompiledUIPropertyValue? propertyValue) &&
            propertyValue is { IsBind: false, Value: CompiledUIItemsView itemsView })
        {
            context.Metadata.RegisterItemsFilterSort(context.Node.ComponentId, itemsView);
        }
    }

    /// <summary>Resolves the item collection, and whether it is left to the client to render.</summary>
    protected static (IReadOnlyList<object?> Items, bool IsBound) ResolveItems(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        CompiledView view = context.ViewResolution.View;

        if (!view.State.TryGetValue(context.Node.ComponentId, IItemsComponent.ItemsProperty, out CompiledUIPropertyValue? propertyValue) || propertyValue is null)
            return ([], false);

        if (!propertyValue.IsBind)
            return ResolveStaticItems(propertyValue.Value);

        if (propertyValue.BindingId is not UIBindingId bindingId || bindingId.IsEmpty)
            throw new InvalidOperationException($"Property '{IItemsComponent.ItemsProperty.Name}' binding id is required.");

        CompiledUIBinding binding = view.Bindings.GetRequired(bindingId);

        // A bound Items is not automatically a client-rendered one: it resolves statically whenever the binding is
        // reachable from an already-known parent item.
        if (TryResolveStaticBindingValue(context, binding, out var bindingValue))
            return ResolveStaticItems(bindingValue);

        // A controller-bound one is server-rendered too when this render was handed the session's items.
        return TryResolveSessionItems(context, out IReadOnlyList<object?> sessionItems)
            ? (sessionItems, false)
            : ([], true);
    }

    private static (IReadOnlyList<object?> Items, bool IsBound) ResolveStaticItems(object? value)
    {
        if (value is null)
            return ([], false);

        if (value is IReadOnlyList<object?> objectList)
            return (objectList, false);

        if (value is IEnumerable enumerable and not string)
        {
            List<object?> result = [];

            foreach (var item in enumerable)
                result.Add(item);

            return (result, false);
        }

        throw new InvalidOperationException($"Property '{IItemsComponent.ItemsProperty.Name}' value must be an item collection.");
    }

    private static bool TryResolveSessionItems(WebRenderContext context, out IReadOnlyList<object?> items)
    {
        items = [];

        if (context.Values is null)
            return false;

        UIComponentAddress component = new(context.Node.ComponentId, ResolveDynamicParameters(context));

        return context.Values.TryGetItems(component, out items);
    }

    /// <summary>
    /// The inner element the items go in — inner, not the root, because the client resolves it with <c>querySelector</c>,
    /// which searches descendants only. A bound list leaves it empty for the client; an empty static one shows the placeholder.
    /// </summary>
    protected static void RenderItemsHost(WebRenderContext context, IHtmlElementBuilder root, string hostClassName, IReadOnlyList<object?> items, bool isBound, string itemClassName, Action<IHtmlElementBuilder>? configureHost = null, string itemElementName = "div", Action<IHtmlElementBuilder, object?, int>? decorateItem = null, Action<IHtmlElementBuilder, object?, int>? appendItem = null, Action<IHtmlElementBuilder>? renderItems = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(items);

        _ = root.Element("div", host =>
        {
            _ = host.Class(hostClassName);
            _ = host.Attribute(WebAttributes.ItemsHost);

            // Host properties apply either way; only the item content waits for the client.
            configureHost?.Invoke(host);

            if (isBound)
                return;

            if (items.Count == 0)
            {
                RenderEmptyPlaceholder(context, host);
                return;
            }

            // A host with rows of its own shape — a composite's, a virtualized host's first paint — draws them itself.
            if (renderItems is not null)
                renderItems(host);
            else
                RenderItemList(context, host, items, itemClassName, itemElementName, decorateItem, appendItem);
        });
    }

    /// <summary>
    /// Renders a resolved item list, bucketed into contiguous group sections when a group template is configured. With a limit only the
    /// first rows are rendered, ungrouped, and every value is published: the client draws the rest.
    /// </summary>
    protected static void RenderItemList(WebRenderContext context, IHtmlElementBuilder host, IReadOnlyList<object?> items, string itemClassName, string itemElementName = "div", Action<IHtmlElementBuilder, object?, int>? decorateItem = null, Action<IHtmlElementBuilder, object?, int>? appendItem = null, int? limit = null, bool publishValues = false)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(items);
        ArgumentException.ThrowIfNullOrWhiteSpace(itemClassName);

        CompiledView view = context.ViewResolution.View;

        // Grouping needs both halves: a declared group template and items that actually carry a group.
        var isGrouped = limit is null &&
            view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.GroupTemplate, out _) &&
            ContainsGroupedItem(items);

        RegisterServerRenderedItemValues(context, items, isGrouped, publishValues);

        if (!isGrouped)
        {
            var count = limit is int max && max < items.Count ? max : items.Count;

            for (var i = 0; i < count; i++)
                RenderItem(context, host, items[i], i, itemClassName, itemElementName, decorateItem, appendItem);

            return;
        }

        List<string> order = [];
        Dictionary<string, List<int>> buckets = new(StringComparer.Ordinal);

        for (var i = 0; i < items.Count; i++)
        {
            var key = items[i] is IBindableGroup group ? group.Group ?? string.Empty : string.Empty;

            if (!buckets.TryGetValue(key, out List<int>? indexes))
            {
                indexes = [];
                buckets.Add(key, indexes);
                order.Add(key);
            }

            indexes.Add(i);
        }

        // The items without a group are a bucket with no header: a rule with an empty label would only be a stray line.
        foreach (var key in order)
        {
            List<int> indexes = buckets[key];

            if (key.Length > 0)
                RenderGroupHeader(context, host, items[indexes[0]]);

            foreach (var index in indexes)
                RenderItem(context, host, items[index], index, itemClassName, itemElementName, decorateItem, appendItem);
        }
    }

    private static bool ContainsGroupedItem(IReadOnlyList<object?> items)
    {
        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is IBindableGroup { Group.Length: > 0 })
                return true;
        }

        return false;
    }

    /// <summary>Publishes the values behind a server-rendered item list, when grouping, filter/sort rules or the host itself will read them.</summary>
    protected static void RegisterServerRenderedItemValues(WebRenderContext context, IReadOnlyList<object?> items, bool isGrouped = false, bool always = false)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(items);

        if (items.Count == 0 || IsSessionItems(context) || (!always && !isGrouped && !HasItemsViewRules(context)))
            return;

        List<WebRenderItemValue> values = new(items.Count);

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is IBindableItem bindableItem && !string.IsNullOrWhiteSpace(bindableItem.Id))
                values.Add(new WebRenderItemValue { Key = bindableItem.Id, Item = items[i] });
        }

        context.Metadata.RegisterItemValues(context.Node.ComponentId, values);
    }

    /// <summary>Whether these rows are the session's own; those are already in the change set, so metadata skips them.</summary>
    private static bool IsSessionItems(WebRenderContext context)
        => context.Values is not null
        && context.ViewResolution.View.State.TryGetValue(context.Node.ComponentId, IItemsComponent.ItemsProperty, out CompiledUIPropertyValue? propertyValue)
        && propertyValue is { IsBind: true };

    private static bool HasItemsViewRules(WebRenderContext context)
    {
        CompiledView view = context.ViewResolution.View;

        if (!view.State.TryGetValue(context.Node.ComponentId, IItemsComponent.ItemsViewProperty, out CompiledUIPropertyValue? propertyValue) || propertyValue is null)
            return false;

        if (propertyValue.IsBind)
            return true;

        return propertyValue.Value is CompiledUIItemsView itemsView && (itemsView.Filters.Length != 0 || itemsView.Sorts.Length != 0);
    }

    protected static void RenderItem(WebRenderContext context, IHtmlElementBuilder host, object? item, int index, string itemClassName, string itemElementName = "div", Action<IHtmlElementBuilder, object?, int>? decorateItem = null, Action<IHtmlElementBuilder, object?, int>? appendItem = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(item);
        ArgumentException.ThrowIfNullOrWhiteSpace(itemClassName);
        ArgumentException.ThrowIfNullOrWhiteSpace(itemElementName);

        if (!TryResolveItemTemplate(context, item, out UIComponentSlot? slot))
            return;

        UIDynamicParameterScope parameter = CreateParameterScope(slot.RootComponentId, item);
        WebRenderContext itemContext = context.WithParameters([.. context.Parameters, parameter]);

        _ = host.Element(itemElementName, itemRoot =>
        {
            _ = itemRoot.Class(itemClassName);
            ApplyItemParameterAttributes(itemRoot, parameter, item);
            decorateItem?.Invoke(itemRoot, item, index);

            context.Renderer.RenderComponent(itemContext.ForHtml(itemRoot), slot.RootComponentId);

            appendItem?.Invoke(itemRoot, item, index);
        });
    }

    // Headers are attribute-marked siblings, not containers: the client re-groups after every change and can then
    // re-place a header without moving the items.
    private static void RenderGroupHeader(WebRenderContext context, IHtmlElementBuilder host, object? anchorItem)
    {
        CompiledView view = context.ViewResolution.View;

        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.GroupTemplate, out UIComponentSlot? slot))
            return;

        UIDynamicParameterScope parameter = CreateParameterScope(slot.RootComponentId, anchorItem);
        WebRenderContext headerContext = context.WithParameters([.. context.Parameters, parameter]);

        _ = host.Element("div", headerRoot =>
        {
            _ = headerRoot.Attribute(WebAttributes.GroupHeader);
            context.Renderer.RenderComponent(headerContext.ForHtml(headerRoot), slot.RootComponentId);
        });
    }

    /// <summary>Draws one item through its own template outside the list, as a picture: no key, no ids, nothing registered.</summary>
    protected static void RenderPresentationItem(WebRenderContext context, IHtmlElementBuilder host, object? item)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);

        if (item is null || !TryResolveItemTemplate(context, item, out UIComponentSlot? slot))
            return;

        UIDynamicParameterScope parameter = CreateParameterScope(slot.RootComponentId, item);
        WebRenderContext itemContext = context.WithParameters([.. context.Parameters, parameter]);

        context.Renderer.RenderComponent(itemContext.AsPresentationCopy(host), slot.RootComponentId);
    }

    /// <summary>Renders a fixed, named template-variant slot for an item; a no-op if that variant is not configured.</summary>
    protected static void RenderNamedTemplateSlot(WebRenderContext context, IHtmlElementBuilder host, object? item, string variantKey, string itemClassName, string? variantKeyPropertyName = null, string? role = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(item);
        ArgumentException.ThrowIfNullOrWhiteSpace(variantKey);
        ArgumentException.ThrowIfNullOrWhiteSpace(itemClassName);

        CompiledView view = context.ViewResolution.View;

        // A typed variant the item names first, the slot's own variant otherwise — the same fallback the client's composite renderer makes.
        UIComponentSlot? slot = null;
        var typedKey = variantKeyPropertyName is null ? null : ReadItemString(item, variantKeyPropertyName);

        if (typedKey is not null)
            _ = view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.TemplateVariant, out slot, $"{variantKey}:{typedKey}");

        if (slot is null && !view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.TemplateVariant, out slot, variantKey))
            return;

        UIDynamicParameterScope parameter = CreateParameterScope(slot.RootComponentId, item);
        WebRenderContext itemContext = context.WithParameters([.. context.Parameters, parameter]);

        _ = host.Element("div", slotRoot =>
        {
            _ = slotRoot.Class(itemClassName);

            if (role is not null)
                _ = slotRoot.Attribute("role", role);

            ApplyItemParameterAttributes(slotRoot, parameter, item);

            context.Renderer.RenderComponent(itemContext.ForHtml(slotRoot), slot.RootComponentId);
        });
    }

    /// <summary>Makes an already-rendered element the DOM host for a named template variant, instead of wrapping it in a new one.</summary>
    /// <summary>
    /// The context a stamped slot's own properties render under — the slot's node, the item's parameter and the stamped element —
    /// for the properties a stamped row carries that its template's renderer never got to write; null when the list has no such slot.
    /// </summary>
    protected static WebRenderContext? ForStampedSlot(WebRenderContext context, IHtmlElementBuilder existingRoot, object? item, string variantKey)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(existingRoot);
        ArgumentNullException.ThrowIfNull(item);
        ArgumentException.ThrowIfNullOrWhiteSpace(variantKey);

        CompiledView view = context.ViewResolution.View;

        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.TemplateVariant, out UIComponentSlot? slot, variantKey))
            return null;

        UIComponentNode node = view.Graph.GetRequired(slot.RootComponentId);
        UIDynamicParameterScope parameter = CreateParameterScope(slot.RootComponentId, item);

        return context.WithParameters([.. context.Parameters, parameter]).ForNode(node, existingRoot);
    }

    protected static void StampTemplateSlotAsHost(WebRenderContext context, IHtmlElementBuilder existingRoot, object? item, string variantKey)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(existingRoot);
        ArgumentNullException.ThrowIfNull(item);
        ArgumentException.ThrowIfNullOrWhiteSpace(variantKey);

        CompiledView view = context.ViewResolution.View;

        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.TemplateVariant, out UIComponentSlot? slot, variantKey))
            return;

        UIComponentNode node = view.Graph.GetRequired(slot.RootComponentId);
        UIDynamicParameterScope parameter = CreateParameterScope(slot.RootComponentId, item);

        _ = existingRoot.Attribute(WebAttributes.Id, node.ComponentId.Value.ToString(CultureInfo.InvariantCulture));
        _ = existingRoot.Attribute(WebAttributes.Context, node.ContextId.Value.ToString(CultureInfo.InvariantCulture));

        // A stamped element sets no `--ui-align-*` of its own, so it would inherit the owning list's alignment;
        // stretch is the only value that leaves the item's own layout alone.
        _ = existingRoot.Style("align-self", "stretch");
        _ = existingRoot.Style("justify-self", "stretch");

        if (node.ContextParameterCount > 0)
            _ = existingRoot.Attribute(WebAttributes.Pc, node.ContextParameterCount.ToString(CultureInfo.InvariantCulture));

        ApplyItemParameterAttributes(existingRoot, parameter, item);

        context.Metadata.AddEvents(view.Events.GetByComponent(node.ComponentId));
        context.Metadata.AddInteractions(view.Interactions.GetByComponent(node.ComponentId));
        context.Metadata.AddValidations(view.Validations.GetByComponent(node.ComponentId));
    }

    private static void ApplyItemParameterAttributes(IHtmlElementBuilder itemRoot, UIDynamicParameterScope parameter, object? item)
    {
        _ = itemRoot.Attribute(WebAttributes.Key, parameter.Key);

        if (item is IBindableGroup group && group.Group is not null)
            _ = itemRoot.Attribute(WebAttributes.Group, group.Group);

        if (item is IItemAbilitiesModel abilities)
        {
            if (abilities.CanSelect == false)
                _ = itemRoot.Attribute(WebAttributes.Unselectable);

            if (abilities.CanDrag == false)
                _ = itemRoot.Attribute(WebAttributes.Undraggable);

            if (abilities.CanRemove == false)
                _ = itemRoot.Attribute(WebAttributes.Unremovable);

            if (abilities.CanRename == false)
                _ = itemRoot.Attribute(WebAttributes.Unrenamable);

            if (abilities.CanShowContextMenu == false)
                _ = itemRoot.Attribute(WebAttributes.NoContextMenu);
        }
    }

    private static bool TryResolveItemTemplate(WebRenderContext context, object? item, [NotNullWhen(true)] out UIComponentSlot? slot)
    {
        var key = ResolveItemTemplateKey(context, item);
        CompiledView view = context.ViewResolution.View;

        if (!string.IsNullOrWhiteSpace(key) &&
            view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.TemplateVariant, out slot, key))
        {
            return true;
        }

        var fallbackKey = ResolveStaticStringProperty(context, ITemplatedComponent.FallbackTemplateKeyProperty);

        if (!string.IsNullOrWhiteSpace(fallbackKey) &&
            view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.TemplateVariant, out slot, fallbackKey))
        {
            return true;
        }

        return view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Template, out slot);
    }

    private static string? ResolveItemTemplateKey(WebRenderContext context, object? item)
    {
        var templateKeyProperty = ResolveStaticStringProperty(context, ITemplatedComponent.TemplateKeyPropertyProperty);

        return string.IsNullOrWhiteSpace(templateKeyProperty) ? null : ReadItemString(item, templateKeyProperty);
    }

    /// <summary>An item's property as the text a template key is matched by; null when the item has none or it is empty.</summary>
    private static string? ReadItemString(object? item, string propertyName)
    {
        var value = ItemContext.TryReadProperty(item, propertyName, out var itemValue) ? itemValue : null;

        var text = value switch
        {
            null => null,
            string stringValue => stringValue,
            _ => Convert.ToString(value, CultureInfo.InvariantCulture)
        };

        return string.IsNullOrWhiteSpace(text) ? null : text;
    }

    private static string? ResolveStaticStringProperty(WebRenderContext context, UIProperty property)
    {
        CompiledView view = context.ViewResolution.View;

        if (!view.State.TryGetValue(context.Node.ComponentId, property, out CompiledUIPropertyValue? propertyValue) ||
            propertyValue is null ||
            propertyValue.IsBind ||
            propertyValue.Value is null)
        {
            return null;
        }

        return propertyValue.Value as string ??
               throw new InvalidOperationException($"Property '{property.Name}' value must be a string.");
    }

    /// <summary>Builds the addressing scope for one rendered item; refuses an item that carries no key.</summary>
    private static UIDynamicParameterScope CreateParameterScope(UIComponentId componentId, object? item)
    {
        if (item is not IBindableItem bindableItem)
        {
            throw new InvalidOperationException(
                $"Item of type '{item?.GetType().Name ?? "null"}' does not implement '{nameof(IBindableItem)}' and cannot be " +
                "addressed. Implement it on the item type, or wrap a plain value in 'UIValueItem<T>' " +
                "('UIOptionValue<T>' for Select/Search/RadioGroup).");
        }

        if (string.IsNullOrWhiteSpace(bindableItem.Id))
            throw new InvalidOperationException($"Item of type '{item.GetType().Name}' has no '{nameof(IBindableItem.Id)}'.");

        return new UIDynamicParameterScope(componentId, bindableItem.Id, item);
    }
}
