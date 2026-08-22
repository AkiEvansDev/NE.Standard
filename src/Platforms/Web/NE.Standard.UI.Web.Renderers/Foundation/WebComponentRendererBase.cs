using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

public abstract class WebComponentRendererBase : IWebComponentRenderer
{
    private const string VisualComponentPropertyOwnerTypeKey = "standard.visual";

    public abstract string ComponentTypeKey { get; }

    protected virtual string ElementName => "div";
    protected abstract string ClassName { get; }

    protected abstract void RenderComponent(WebRenderContext context, IHtmlElementBuilder root);

    public void Render(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        _ = context.Html.Element(ElementName, root =>
        {
            _ = root.Class(ClassName);
            ApplyDefaultAttributes(context, root);

            RenderComponent(context, root);
            RenderContextMenu(context, root);
            ApplyMetadata(context);
        });
    }

    /// <summary>
    /// The right-click menu, rendered inside the component it belongs to rather than portaled: every
    /// <c>closest()</c> path the engines rely on keeps working, and the popup is <c>position: fixed</c>, so
    /// living inside an <c>overflow: hidden</c> panel does not clip it. The same reasoning as every other
    /// popup in this platform — see <c>anchored-popup.ts</c>.
    /// </summary>
    private static void RenderContextMenu(WebRenderContext context, IHtmlElementBuilder root)
    {
        if (!context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.ContextMenu, out UIComponentSlot? slot))
            return;

        _ = root.Attribute("data-ui-context-menu-owner");

        _ = root.Element("div", host =>
        {
            _ = host.Class("ui-context-menu");
            _ = host.Attribute("data-ui-context-menu");
            _ = host.Attribute("role", "menu");

            context.Renderer.RenderComponent(context.ForHtml(host), slot.RootComponentId);
        });
    }

    private static void ApplyDefaultAttributes(WebRenderContext context, IHtmlElementBuilder html)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(html);

        UIComponentNode node = context.Node;

        _ = html.Attribute("data-ui-id", node.ComponentId.Value.ToString(CultureInfo.InvariantCulture));
        _ = html.Attribute("data-ui-context", node.ContextId.Value.ToString(CultureInfo.InvariantCulture));

        // The author's own name for this component, and only when there is one: a generated id is a
        // process-wide counter that means nothing between two runs. It is what the client keys persisted
        // state by, and the only identifier in the DOM that survives a recompilation.
        if (node.HasAuthoredId)
            _ = html.Attribute("data-ui-name", node.AuthoringId);

        // Gated on ContextParameterCount, never on DefinesContextParameter: a component that merely *inherits*
        // an item scope still needs this to be addressable by DomRegistry.findComponent. Narrowing it looks
        // like a tightening and silently breaks live updates to anything that is not a template root.
        if (node.ContextParameterCount > 0)
            _ = html.Attribute("data-ui-pc", node.ContextParameterCount.ToString(CultureInfo.InvariantCulture));

        // Every property below is rendered twice over: once as static markup for the initial HTML, and once as
        // a WebDomOperation list describing how to apply the same value live. Both have to produce identical
        // output, which is why the client's converters mirror WebCssValues/WebClassNames name for name.
        _ = RenderProperty<UISkeletonVariant?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.LoadingPreviewProperty, static (target, value) =>
        {
            if (value is UISkeletonVariant variant)
                _ = target.Class(WebClassNames.SkeletonVariant(variant));
        }, [WebDomOperation.Class(condition: WebValueCondition.HasValue, converter: WebDomConverters.SkeletonVariantClass)]);
        // Theme is scoped per component through an attribute rather than a class, so a subtree can override the
        // page theme and the semantic colour tokens re-resolve underneath it.
        _ = RenderProperty<UIThemeMode?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.ThemeProperty, static (target, value) =>
        {
            if (value is UIThemeMode mode)
                _ = target.Attribute("data-ui-theme", WebCssValues.ThemeName(mode));
        }, [WebDomOperation.Attribute("data-ui-theme", converter: WebDomConverters.ThemeNameCss)]);
        // Visible drives one attribute per breakpoint tier rather than a class, so ShowEffect/HideEffect and a
        // bound Visible resolve through the same mechanism instead of fighting over the element. Note the
        // value can arrive as a bare bool: the implicit conversion lets a controller declare one.
        _ = RenderProperty<UIResponsive<bool>?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.VisibleProperty, static (target, value) =>
        {
            if (value is not UIResponsive<bool> responsive)
                return;

            if (!responsive.Base)
                _ = target.Attribute("data-ui-hidden");

            if (responsive.Sm == false)
                _ = target.Attribute("data-ui-hidden-sm");

            if (responsive.Md == false)
                _ = target.Attribute("data-ui-hidden-md");

            if (responsive.Xl == false)
                _ = target.Attribute("data-ui-hidden-xl");

            if (responsive.Xxl == false)
                _ = target.Attribute("data-ui-hidden-xxl");
        }, [
            WebDomOperation.Attribute("data-ui-hidden", converter: WebDomConverters.VisibleHiddenBaseAttribute),
            WebDomOperation.Attribute("data-ui-hidden-sm", converter: WebDomConverters.VisibleHiddenSmAttribute),
            WebDomOperation.Attribute("data-ui-hidden-md", converter: WebDomConverters.VisibleHiddenMdAttribute),
            WebDomOperation.Attribute("data-ui-hidden-xl", converter: WebDomConverters.VisibleHiddenXlAttribute),
            WebDomOperation.Attribute("data-ui-hidden-xxl", converter: WebDomConverters.VisibleHiddenXxlAttribute)
        ]);

        _ = RenderProperty<bool?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.EnabledProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Class("ui-disabled");
        }, [WebDomOperation.ToggleClass("ui-disabled", condition: WebValueCondition.IsFalse)]);

        _ = RenderProperty<bool?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.LoadingProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-loading");
        }, [WebDomOperation.ToggleClass("ui-loading")]);

        _ = RenderProperty<UIAlignment?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.HorizontalAlignmentProperty, static (target, value) =>
        {
            if (value is UIAlignment alignment)
                _ = target.Style("--ui-align-h", WebCssValues.Alignment(alignment));
        }, [WebDomOperation.Style("--ui-align-h", converter: WebDomConverters.AlignmentCss)]);

        // Stretch needs a companion fallback value: a stretched item in a grid track that has no height to
        // stretch into would otherwise collapse, so the stylesheet falls back to start alignment.
        _ = RenderProperty<UIAlignment?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.VerticalAlignmentProperty, static (target, value) =>
        {
            if (value is UIAlignment alignment)
            {
                _ = target.Style("--ui-align-v", WebCssValues.Alignment(alignment));

                if (alignment == UIAlignment.Stretch)
                    _ = target.Style("--ui-align-v-stretch-fallback", "start");
            }
        }, [
            WebDomOperation.Style("--ui-align-v", converter: WebDomConverters.AlignmentCss),
            WebDomOperation.Style("--ui-align-v-stretch-fallback", converter: WebDomConverters.AlignmentStretchFallbackCss)
        ]);

        ResponsiveRenderer.ApplyResponsiveLayoutLength(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.WidthProperty, "--ui-width");
        ResponsiveRenderer.ApplyResponsiveLayoutLength(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.MinWidthProperty, "--ui-min-width");
        ResponsiveRenderer.ApplyResponsiveLayoutLength(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.MaxWidthProperty, "--ui-max-width");
        ResponsiveRenderer.ApplyResponsiveLayoutLength(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.HeightProperty, "--ui-height");
        ResponsiveRenderer.ApplyResponsiveLayoutLength(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.MinHeightProperty, "--ui-min-height");
        ResponsiveRenderer.ApplyResponsiveLayoutLength(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.MaxHeightProperty, "--ui-max-height");

        _ = RenderProperty<int?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.ZIndexProperty, static (target, value) =>
        {
            if (value is int zIndex && zIndex != 0)
                _ = target.Style("z-index", zIndex.ToString(CultureInfo.InvariantCulture));
        }, [WebDomOperation.Style("z-index", target: "root")]);

        ResponsiveRenderer.ApplyResponsiveThickness(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.MarginProperty, "--ui-margin");

        ApplyPlacement(context, html);
    }

    // Placement writes one custom property per tier, which the stylesheet resolves through the same widest-
    // first var() chain every other responsive property uses — so a tier left unset inherits the one below it.
    private static void ApplyPlacement(WebRenderContext context, IHtmlElementBuilder html)
    {
        _ = RenderProperty<UIResponsive<UIGridPlacement>?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.PlacementProperty, static (target, value) =>
        {
            if (value is not UIResponsive<UIGridPlacement> responsive)
                return;

            WritePlacementTier(target, "--ui-placement", responsive.Base);

            if (responsive.Sm is UIGridPlacement sm)
                WritePlacementTier(target, "--ui-placement-sm", sm);

            if (responsive.Md is UIGridPlacement md)
                WritePlacementTier(target, "--ui-placement-md", md);

            if (responsive.Xl is UIGridPlacement xl)
                WritePlacementTier(target, "--ui-placement-xl", xl);

            if (responsive.Xxl is UIGridPlacement xxl)
                WritePlacementTier(target, "--ui-placement-xxl", xxl);
        }, [
            WebDomOperation.Style("--ui-placement-column", converter: WebDomConverters.GridPlacementBaseColumnCss),
            WebDomOperation.Style("--ui-placement-row", converter: WebDomConverters.GridPlacementBaseRowCss),
            WebDomOperation.Style("--ui-placement-column-span", converter: WebDomConverters.GridPlacementBaseColumnSpanCss),
            WebDomOperation.Style("--ui-placement-row-span", converter: WebDomConverters.GridPlacementBaseRowSpanCss),
            WebDomOperation.Style("--ui-placement-sm-column", converter: WebDomConverters.GridPlacementSmColumnCss),
            WebDomOperation.Style("--ui-placement-sm-row", converter: WebDomConverters.GridPlacementSmRowCss),
            WebDomOperation.Style("--ui-placement-sm-column-span", converter: WebDomConverters.GridPlacementSmColumnSpanCss),
            WebDomOperation.Style("--ui-placement-sm-row-span", converter: WebDomConverters.GridPlacementSmRowSpanCss),
            WebDomOperation.Style("--ui-placement-md-column", converter: WebDomConverters.GridPlacementMdColumnCss),
            WebDomOperation.Style("--ui-placement-md-row", converter: WebDomConverters.GridPlacementMdRowCss),
            WebDomOperation.Style("--ui-placement-md-column-span", converter: WebDomConverters.GridPlacementMdColumnSpanCss),
            WebDomOperation.Style("--ui-placement-md-row-span", converter: WebDomConverters.GridPlacementMdRowSpanCss),
            WebDomOperation.Style("--ui-placement-xl-column", converter: WebDomConverters.GridPlacementXlColumnCss),
            WebDomOperation.Style("--ui-placement-xl-row", converter: WebDomConverters.GridPlacementXlRowCss),
            WebDomOperation.Style("--ui-placement-xl-column-span", converter: WebDomConverters.GridPlacementXlColumnSpanCss),
            WebDomOperation.Style("--ui-placement-xl-row-span", converter: WebDomConverters.GridPlacementXlRowSpanCss),
            WebDomOperation.Style("--ui-placement-xxl-column", converter: WebDomConverters.GridPlacementXxlColumnCss),
            WebDomOperation.Style("--ui-placement-xxl-row", converter: WebDomConverters.GridPlacementXxlRowCss),
            WebDomOperation.Style("--ui-placement-xxl-column-span", converter: WebDomConverters.GridPlacementXxlColumnSpanCss),
            WebDomOperation.Style("--ui-placement-xxl-row-span", converter: WebDomConverters.GridPlacementXxlRowSpanCss)
        ]);
    }

    private static void WritePlacementTier(IHtmlElementBuilder target, string prefix, UIGridPlacement placement)
    {
        _ = target.Style(prefix + "-column", placement.Column.ToString(CultureInfo.InvariantCulture));
        _ = target.Style(prefix + "-row", placement.Row.ToString(CultureInfo.InvariantCulture));
        _ = target.Style(prefix + "-column-span", placement.ColumnSpan.ToString(CultureInfo.InvariantCulture));
        _ = target.Style(prefix + "-row-span", placement.RowSpan.ToString(CultureInfo.InvariantCulture));
    }

    private static void ApplyMetadata(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        CompiledView view = context.ViewResolution.View;
        UIComponentId componentId = context.Node.ComponentId;

        context.Metadata.AddEvents(view.Events.GetByComponent(componentId));
        context.Metadata.AddInteractions(view.Interactions.GetByComponent(componentId));
        context.Metadata.AddValidations(view.Validations.GetByComponent(componentId));
    }

    public static void RenderChildren(WebRenderContext context, IHtmlElementBuilder html)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(html);

        IReadOnlyList<UIComponentId> children = context.ViewResolution.View.Graph.GetChildren(context.Node.ComponentId);

        for (var i = 0; i < children.Count; i++)
            context.Renderer.RenderComponent(context.ForHtml(html), children[i]);
    }

    public static void RenderRegion(WebRenderContext context, IHtmlElementBuilder html, string regionName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(html);
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);

        CompiledView view = context.ViewResolution.View;

        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out UIComponentSlot? slot, regionName))
            return;

        context.Renderer.RenderComponent(context.ForHtml(html), slot.RootComponentId);
    }

    /// <summary>
    /// Whether an optional region (e.g. <see cref="RegionNames"/>.Footer on a card, unlike its
    /// always-created Header) is actually set, so a renderer can skip emitting an empty wrapper element
    /// for it instead of relying on <see cref="RenderRegion"/>'s own silent no-op.
    /// </summary>
    protected static bool HasRegion(WebRenderContext context, string regionName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);

        return context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out _, regionName);
    }

    /// <summary>
    /// Validation rules are compile-time state (<c>UIValidationRule</c> is authored once, not a bound
    /// property), so whether a required-marker asterisk renders is resolved once at render time from the
    /// compiled validation index rather than through <c>RenderProperty</c>/<c>WebDomOperation</c>. Lives
    /// here (not <c>TextContentRendererBase</c>) since it's shared across two otherwise-unrelated
    /// renderer branches — text-shaped content (<c>CheckboxComponentRenderer</c>, etc.) and item-list
    /// content (<c>RadioGroupComponentRenderer</c>).
    /// </summary>
    protected static bool HasRequiredValidation(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        IReadOnlyList<CompiledUIValidationRule> rules = context.ViewResolution.View.Validations.GetByComponent(context.Node.ComponentId);

        for (var i = 0; i < rules.Count; i++)
        {
            if (rules[i].Operator == UIComparisonOperator.Required)
                return true;
        }

        return false;
    }

    /// <summary>
    /// The <c>*</c> marker a required field renders next to itself — shared across renderers with no
    /// common ancestor closer than this base (Slider/DateInput/TimeInput/DateTimeInput/NumberInput each
    /// derive from a different intermediate base) rather than duplicating the same three lines in each.
    /// </summary>
    protected static void RenderRequiredMarker(WebRenderContext context, IHtmlElementBuilder target, string modifierClass)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);
        ArgumentException.ThrowIfNullOrWhiteSpace(modifierClass);

        if (!HasRequiredValidation(context))
            return;

        _ = target.Element("span", required =>
        {
            _ = required.Class(modifierClass);
            _ = required.Text("*");
        });
    }

    /// <summary>
    /// The <c>data-ui-validation-message</c> span <c>ValidationEngine</c> writes an error into — same
    /// sharing rationale as <see cref="RenderRequiredMarker"/>.
    /// </summary>
    protected static void RenderValidationMessage(IHtmlElementBuilder target, string modifierClass)
    {
        ArgumentNullException.ThrowIfNull(target);
        ArgumentException.ThrowIfNullOrWhiteSpace(modifierClass);

        _ = target.Element("span", message =>
        {
            _ = message.Class(modifierClass);
            _ = message.Attribute("data-ui-validation-message");
        });
    }

    public static WebRenderValueKind RenderProperty<T>(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, Action<IHtmlElementBuilder, T?> renderStatic, IReadOnlyList<WebDomOperation> operations)
    {
        ArgumentNullException.ThrowIfNull(context);

        return RenderProperty(context, target, context.Node.TypeKey, property, renderStatic, operations);
    }

    public static WebRenderValueKind RenderProperty<T>(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, Action<IHtmlElementBuilder, T?> renderStatic, IReadOnlyList<WebDomOperation> operations)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyOwnerTypeKey);
        ArgumentException.ThrowIfNullOrWhiteSpace(property.Name);
        ArgumentNullException.ThrowIfNull(renderStatic);
        ArgumentNullException.ThrowIfNull(operations);

        WebRenderValueKind kind = ResolveRenderValue(context, property, out T? value, out CompiledUIBinding? binding);
        UIPropertyAddress address = new(context.Node.ComponentId, property);
        var propertyId = context.Metadata.RegisterProperty(propertyOwnerTypeKey, property, operations);
        context.Metadata.RegisterRenderedProperty(address, propertyId);

        switch (kind)
        {
            case WebRenderValueKind.Static:
                renderStatic(target, value);
                break;

            case WebRenderValueKind.Binding:
                _ = target.Attribute(CreateBindingAttributeName(property), binding!.Id.Value.ToString(CultureInfo.InvariantCulture));
                context.Metadata.Bind(context, binding, propertyId);
                break;

            default:
            case WebRenderValueKind.Missing:
                break;
        }

        return kind;
    }

    /// <summary>
    /// Registers a property purely for value tracking, with no DOM effect of its own (see
    /// <see cref="WebDomOperation.Data"/>) — for a property that exists to be watched (e.g. as a
    /// <c>ReactiveSourceRegistry</c> source) rather than rendered.
    /// </summary>
    protected static WebRenderValueKind RenderValue<T>(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);

        return RenderProperty<T>(context, target, context.Node.TypeKey, property, static (_, _) => { }, [WebDomOperation.Data()]);
    }

    /// <inheritdoc cref="RenderValue{T}(WebRenderContext, IHtmlElementBuilder, UIProperty)"/>
    protected static WebRenderValueKind RenderValue<T>(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property)
        => RenderProperty<T>(context, target, propertyOwnerTypeKey, property, static (_, _) => { }, [WebDomOperation.Data()]);

    protected static WebRenderValueKind ResolveRenderValue<T>(WebRenderContext context, UIProperty property, out T? value, out CompiledUIBinding? binding)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentException.ThrowIfNullOrWhiteSpace(property.Name);

        value = default;
        binding = null;

        CompiledView view = context.ViewResolution.View;

        if (!view.State.TryGetValue(context.Node.ComponentId, property, out CompiledUIPropertyValue? propertyValue))
            return WebRenderValueKind.Missing;

        if (propertyValue.IsBind)
        {
            if (propertyValue.BindingId is not UIBindingId bindingId || bindingId.IsEmpty)
                throw new InvalidOperationException($"Property '{property.Name}' binding id is required.");

            binding = view.Bindings.GetRequired(bindingId);

            if (TryResolveStaticBindingValue(context, binding, out var bindingValue))
            {
                // Translated on this path too, not only on the plain-value one below. An author-declared item
                // reaches its template through a binding, so a `[Translatable]` model field — Title on every
                // item model — arrived at the DOM as its own translation key. IsTranslatable is the *target*
                // property's, recorded at compile time, so this asks the same question the other branch does.
                if (propertyValue.IsTranslatable && bindingValue is string bindingText)
                    bindingValue = context.Translator.Translate(context.ViewResolution.Session.Language, bindingText);

                value = CastRenderedValue<T>(bindingValue, property);
                return WebRenderValueKind.Static;
            }

            return WebRenderValueKind.Binding;
        }

        var rawValue = propertyValue.Value;

        if (propertyValue.IsTranslatable && rawValue is string text)
            rawValue = context.Translator.Translate(context.ViewResolution.Session.Language, text);

        value = CastRenderedValue<T>(rawValue, property);
        return WebRenderValueKind.Static;
    }

    protected static bool TryResolveStaticBindingValue(WebRenderContext context, CompiledUIBinding binding, out object? value)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(binding);

        value = null;

        CompiledView view = context.ViewResolution.View;
        CompiledUIBindingSource source = view.Sources.GetRequired(binding.SourceId);

        if (source.Kind != CompiledUIBindingSourceKind.ComponentItems)
            return false;

        CompiledUIBindingTemplate template = view.Templates.GetRequired(binding.TemplateId);

        for (var i = context.Parameters.Count - 1; i >= 0; i--)
        {
            WebDynamicParameterScope scope = context.Parameters[i];

            if (new ItemContext(scope.Item).TryResolveBindingTemplate(template, binding.Parameters, context.Parameters, out value))
                return true;
        }

        return false;
    }

    private static string CreateBindingAttributeName(UIProperty property)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(property.Name);

        return "data-ui-bind-" + ToKebabCase(property.Name);
    }

    private static string ToKebabCase(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        StringBuilder result = new(value.Length + 8);

        for (var i = 0; i < value.Length; i++)
        {
            var character = value[i];

            if (char.IsUpper(character))
            {
                if (i > 0)
                    _ = result.Append('-');

                _ = result.Append(char.ToLowerInvariant(character));
                continue;
            }

            _ = result.Append(character);
        }

        return result.ToString();
    }

    private static T? CastRenderedValue<T>(object? source, UIProperty property)
    {
        if (source is null)
            return default;

        if (source is T typed)
            return typed;

        throw new InvalidOperationException($"Property '{property.Name}' value has type '{source.GetType().FullName}', but '{typeof(T).FullName}' was expected.");
    }
}
