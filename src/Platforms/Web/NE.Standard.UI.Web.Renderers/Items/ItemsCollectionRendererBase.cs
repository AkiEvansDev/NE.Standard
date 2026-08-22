using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Items;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Items;

/// <summary>
/// Provides shared template and item-rendering logic for components that render item collections.
/// </summary>
public abstract class ItemsCollectionRendererBase : WebComponentRendererBase
{
    private const string DefaultTemplateName = "default";

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

    protected static void RenderTemplates(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        CompiledView view = context.ViewResolution.View;

        if (view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Template, out UIComponentSlot? defaultTemplate))
        {
            _ = root.Element("template", template =>
            {
                _ = template.Attribute("data-ui-template", DefaultTemplateName);
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
                _ = template.Attribute("data-ui-template", variant.Key);
                context.Renderer.RenderComponent(context.ForHtml(template), variant.RootComponentId);
            });
        }

        if (view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.EmptyTemplate, out UIComponentSlot? emptyTemplate))
        {
            _ = root.Element("template", template =>
            {
                _ = template.Attribute("data-ui-empty-template");
                context.Renderer.RenderComponent(context.ForHtml(template), emptyTemplate.RootComponentId);
            });
        }

        if (view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.GroupTemplate, out UIComponentSlot? groupTemplate))
        {
            _ = root.Element("template", template =>
            {
                _ = template.Attribute("data-ui-group-template");
                context.Renderer.RenderComponent(context.ForHtml(template), groupTemplate.RootComponentId);
            });
        }
    }

    /// <summary>
    /// Renders the empty-state content directly into an items host, used both when a statically-known
    /// collection has zero items and (mirrored client-side) when a live collection becomes empty.
    /// </summary>
    protected static void RenderEmptyPlaceholder(WebRenderContext context, IHtmlElementBuilder host)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);

        CompiledView view = context.ViewResolution.View;

        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.EmptyTemplate, out UIComponentSlot? slot))
            return;

        _ = host.Element("div", placeholder =>
        {
            _ = placeholder.Attribute("data-ui-empty-placeholder");
            context.Renderer.RenderComponent(context.ForHtml(placeholder), slot.RootComponentId);
        });
    }

    /// <param name="context">The current render context.</param>
    /// <param name="itemWrapperElementName">
    /// See <see cref="WebRenderItemsTemplateMetadata.ItemWrapperElementName"/> —
    /// pass together with <paramref name="itemWrapperClassName"/> when this renderer's static item shape
    /// (<see cref="RenderItem"/>'s <c>itemElementName</c>/<c>itemClassName</c>) wraps its resolved template
    /// content in something extra, so a client-cloned bound item gets the same wrapper.
    /// </param>
    /// <param name="itemWrapperClassName">See <paramref name="itemWrapperElementName"/>.</param>
    /// <param name="composite">
    /// See <see cref="WebRenderItemsCompositeMetadata"/> — pass when this renderer's static item shape is
    /// composed of several named template slots at once (<see cref="RenderNamedTemplateSlot"/>/
    /// <see cref="StampTemplateSlotAsHost"/>) rather than one key-selected template, so a client-rendered
    /// bound item is composed the same way.
    /// </param>
    protected static void RegisterItemsTemplateMetadata(WebRenderContext context, string? itemWrapperElementName = null, string? itemWrapperClassName = null, WebRenderItemsCompositeMetadata? composite = null)
    {
        ArgumentNullException.ThrowIfNull(context);

        var templateKeyPropertyName = ResolveStaticStringProperty(context, ITemplatedComponent.TemplateKeyPropertyProperty);
        var fallbackTemplateKeyPropertyName = ResolveStaticStringProperty(context, ITemplatedComponent.FallbackTemplateKeyProperty);

        context.Metadata.RegisterItemsTemplate(context.Node.ComponentId, templateKeyPropertyName, fallbackTemplateKeyPropertyName, itemWrapperElementName, itemWrapperClassName, composite);
    }

    /// <summary>
    /// Registers filter/sort rule metadata for the client, when this component's <c>ItemsView</c>
    /// static property carries any — only the statically-authored value is ever inspected here, since
    /// a controller-bound <c>ItemsView</c> (<c>BindItemsView</c>) is resolved and pushed as a live value
    /// update instead, outside the normal render pass.
    /// </summary>
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

    /// <summary>
    /// Resolves the <c>Items</c>/<c>Options</c> collection (shared <see cref="IItemsComponent.ItemsProperty"/>
    /// key, so this applies to any <see cref="IItemsComponent"/> — <c>ItemsViewComponent</c> as well as
    /// <c>SelectComponent</c>/<c>RadioGroupComponent</c>, which inherit it via
    /// <c>ItemsComponentBase</c>) for either full server-side rendering or client-side deferral, per the
    /// static-vs-bound split documented in <c>docs/PROJECT.md</c> §5.
    /// </summary>
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

        // A bound Items is not automatically a client-rendered one. Static resolution is tried first and
        // succeeds whenever the binding is reachable from an already-known parent item — a static outer
        // collection's relative sub-items, for instance. Skipping this stops those rendering at all.
        return TryResolveStaticBindingValue(context, binding, out var bindingValue)
            ? ResolveStaticItems(bindingValue)
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

    /// <summary>
    /// Renders a statically-known item list, bucketing items into contiguous group-template sections
    /// (stable partition, ordered by each group's first appearance) when a group template is configured
    /// for this component — otherwise renders the flat list exactly as before.
    /// </summary>
    /// <param name="context">The current render context.</param>
    /// <param name="host">The element the item list is rendered into.</param>
    /// <param name="items">The resolved item collection.</param>
    /// <param name="itemClassName">The CSS class applied to each item's wrapper element.</param>
    /// <param name="itemElementName">
    /// The wrapping element for each item — "div" for a plain list (<see cref="ItemsViewComponentRenderer"/>),
    /// "label" for a selection list whose item needs to be a native click/tap target for a nested hidden
    /// input (<c>RadioGroupComponentRenderer</c>), mirroring <c>CheckboxComponentRenderer</c>'s own
    /// label-wraps-input pattern.
    /// </param>
    /// <param name="decorateItem">
    /// Invoked once per item, immediately after the item wrapper's class/key attributes are applied but
    /// before the resolved template renders into it — the hook a selection list uses to inject its own
    /// hidden input/visual indicator ahead of the templated content.
    /// </param>
    /// <param name="appendItem">
    /// Invoked once per item, after the resolved template has rendered into the wrapper — the other side of
    /// <paramref name="decorateItem"/>, for content that belongs *after* the entry. <c>MenuComponentRenderer</c>
    /// hangs an item's own sub-entries there.
    /// </param>
    protected static void RenderItemList(WebRenderContext context, IHtmlElementBuilder host, IReadOnlyList<object?> items, string itemClassName, string itemElementName = "div", Action<IHtmlElementBuilder, object?, int>? decorateItem = null, Action<IHtmlElementBuilder, object?, int>? appendItem = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(items);
        ArgumentException.ThrowIfNullOrWhiteSpace(itemClassName);

        CompiledView view = context.ViewResolution.View;

        // Grouping needs both halves: a declared group template and items that actually carry a group. One
        // without the other renders as a flat list, which is what an author who declared neither expects.
        var isGrouped = view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.GroupTemplate, out _) &&
            ContainsGroupedItem(items);

        RegisterServerRenderedItemValues(context, items, isGrouped);

        if (!isGrouped)
        {
            for (var i = 0; i < items.Count; i++)
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

        foreach (var key in order)
        {
            List<int> indexes = buckets[key];

            RenderGroupHeader(context, host, items[indexes[0]]);

            foreach (var index in indexes)
                RenderItem(context, host, items[index], index, itemClassName, itemElementName, decorateItem, appendItem);
        }
    }

    /// <summary>
    /// Publishes the values behind a server-rendered item list, which the client otherwise has no copy of —
    /// it never rendered these items and so never recorded what they hold.
    /// </summary>
    /// <remarks>
    /// Gated on something actually reading them: grouping (a header renders against its anchor item) or
    /// declarative filter/sort rules. A *bound* <c>ItemsView</c> counts even though its rules are not here
    /// yet — they arrive as a value update later, and by then the render is over. Everything else leaves
    /// both client paths a no-op, and would pay for a copy nobody reads.
    /// </remarks>
    protected static void RegisterServerRenderedItemValues(WebRenderContext context, IReadOnlyList<object?> items, bool isGrouped = false)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(items);

        if (items.Count == 0 || (!isGrouped && !HasItemsViewRules(context)))
            return;

        List<WebRenderItemValue> values = new(items.Count);

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is IBindableItem bindableItem && !string.IsNullOrWhiteSpace(bindableItem.Id))
                values.Add(new WebRenderItemValue { Key = bindableItem.Id, Item = items[i] });
        }

        context.Metadata.RegisterItemValues(context.Node.ComponentId, values);
    }

    private static bool HasItemsViewRules(WebRenderContext context)
    {
        CompiledView view = context.ViewResolution.View;

        if (!view.State.TryGetValue(context.Node.ComponentId, IItemsComponent.ItemsViewProperty, out CompiledUIPropertyValue? propertyValue) || propertyValue is null)
            return false;

        if (propertyValue.IsBind)
            return true;

        return propertyValue.Value is CompiledUIItemsView itemsView && (itemsView.Filters.Length != 0 || itemsView.Sorts.Length != 0);
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

    // Headers are ordinary siblings in the host, marked by an attribute rather than wrapping their items in a
    // container: the client re-runs grouping after every collection change, and a flat host lets it drop and
    // re-place headers without moving the items themselves.
    private static void RenderGroupHeader(WebRenderContext context, IHtmlElementBuilder host, object? anchorItem)
    {
        CompiledView view = context.ViewResolution.View;

        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.GroupTemplate, out UIComponentSlot? slot))
            return;

        WebDynamicParameterScope parameter = CreateParameterScope(slot.RootComponentId, anchorItem);
        WebRenderContext headerContext = context.WithParameters([.. context.Parameters, parameter]);

        _ = host.Element("div", headerRoot =>
        {
            _ = headerRoot.Attribute("data-ui-group-header");
            context.Renderer.RenderComponent(headerContext.ForHtml(headerRoot), slot.RootComponentId);
        });
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

        WebDynamicParameterScope parameter = CreateParameterScope(slot.RootComponentId, item);
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

    /// <summary>
    /// Renders a fixed, named template-variant slot for an item (e.g. <c>KeyValueActionComponent</c>'s
    /// "key"/"value"/"action" — always-resolved-by-name slots, unlike <see cref="RenderItem"/>'s
    /// per-item <c>TemplateKeyProperty</c>-driven selection among variants) — a no-op if that variant
    /// isn't configured on this component.
    /// </summary>
    protected static void RenderNamedTemplateSlot(WebRenderContext context, IHtmlElementBuilder host, object? item, string variantKey, string itemClassName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(item);
        ArgumentException.ThrowIfNullOrWhiteSpace(variantKey);
        ArgumentException.ThrowIfNullOrWhiteSpace(itemClassName);

        CompiledView view = context.ViewResolution.View;

        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.TemplateVariant, out UIComponentSlot? slot, variantKey))
            return;

        WebDynamicParameterScope parameter = CreateParameterScope(slot.RootComponentId, item);
        WebRenderContext itemContext = context.WithParameters([.. context.Parameters, parameter]);

        _ = host.Element("div", slotRoot =>
        {
            _ = slotRoot.Class(itemClassName);
            ApplyItemParameterAttributes(slotRoot, parameter, item);

            context.Renderer.RenderComponent(itemContext.ForHtml(slotRoot), slot.RootComponentId);
        });
    }

    /// <summary>
    /// Makes an already-rendered structural element (e.g. <c>KeyValueActionComponentRenderer</c>'s own
    /// row <c>&lt;div&gt;</c>) the addressable/clickable DOM host for a named template-variant slot's
    /// compiled identity, instead of <see cref="RenderNamedTemplateSlot"/>'s "render into a new wrapper"
    /// behavior — for a template variant that carries no visible content of its own (see
    /// <c>DefaultRowTemplate</c>), so its per-item click/interaction/validation metadata attaches to the
    /// element that already exists rather than an extra nested wrapper around nothing. A no-op if the
    /// variant isn't configured on this component, same as <see cref="RenderNamedTemplateSlot"/>.
    /// </summary>
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
        WebDynamicParameterScope parameter = CreateParameterScope(slot.RootComponentId, item);

        _ = existingRoot.Attribute("data-ui-id", node.ComponentId.Value.ToString(CultureInfo.InvariantCulture));
        _ = existingRoot.Attribute("data-ui-context", node.ContextId.Value.ToString(CultureInfo.InvariantCulture));

        // `[data-ui-id]` (runtime.less) resolves `justify-self`/`align-self` from the `--ui-align-h`/
        // `--ui-align-v` custom properties, which this stamped element never sets itself — left alone, it
        // would inherit whatever the *owning* items component's own alignment happens to be (e.g. a
        // centred list would centre every row inside its own track and collapse them to content width).
        // Stretch is the only value that means "leave the item's own layout alone".
        _ = existingRoot.Style("align-self", "stretch");
        _ = existingRoot.Style("justify-self", "stretch");

        if (node.ContextParameterCount > 0)
            _ = existingRoot.Attribute("data-ui-pc", node.ContextParameterCount.ToString(CultureInfo.InvariantCulture));

        ApplyItemParameterAttributes(existingRoot, parameter, item);

        context.Metadata.AddEvents(view.Events.GetByComponent(node.ComponentId));
        context.Metadata.AddInteractions(view.Interactions.GetByComponent(node.ComponentId));
        context.Metadata.AddValidations(view.Validations.GetByComponent(node.ComponentId));
    }

    private static void ApplyItemParameterAttributes(IHtmlElementBuilder itemRoot, WebDynamicParameterScope parameter, object? item)
    {
        _ = itemRoot.Attribute("data-ui-key", parameter.Key);

        if (item is IBindableGroup group && group.Group is not null)
            _ = itemRoot.Attribute("data-ui-group", group.Group);
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

        if (string.IsNullOrWhiteSpace(templateKeyProperty))
            return null;

        var value = ItemContext.TryReadProperty(item, templateKeyProperty, out var itemValue) ? itemValue : null;

        return value switch
        {
            null => null,
            string stringValue => stringValue,
            _ => Convert.ToString(value, CultureInfo.InvariantCulture)
        };
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

    /// <summary>
    /// Builds the addressing scope for one rendered item. Refuses an item that carries no key, because there
    /// would be nothing for a later update, a command dispatch or a filter to address it by.
    /// </summary>
    private static WebDynamicParameterScope CreateParameterScope(UIComponentId componentId, object? item)
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

        return new WebDynamicParameterScope(componentId, bindableItem.Id, item);
    }
}
