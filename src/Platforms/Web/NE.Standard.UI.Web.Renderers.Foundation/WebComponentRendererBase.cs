using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
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

    private static void ApplyDefaultAttributes(WebRenderContext context, IHtmlElementBuilder html)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(html);

        UIComponentNode node = context.Node;

        // A presentation copy carries no identity, only appearance.
        if (!context.IsPresentationCopy)
        {
            _ = html.Attribute(WebAttributes.Id, node.ComponentId.Value.ToString(CultureInfo.InvariantCulture));
            _ = html.Attribute(WebAttributes.Context, node.ContextId.Value.ToString(CultureInfo.InvariantCulture));
        }

        // Only an authored name: it is the one identifier that survives a recompilation, so persisted state keys by it.
        if (node.HasAuthoredId && !context.IsPresentationCopy)
            _ = html.Attribute(WebAttributes.Name, node.AuthoringId);

        // Gated on ContextParameterCount, not DefinesContextParameter: a component that only inherits an item scope
        // still needs this to stay addressable by DomRegistry.findComponent.
        if (node.ContextParameterCount > 0 && !context.IsPresentationCopy)
            _ = html.Attribute(WebAttributes.Pc, node.ContextParameterCount.ToString(CultureInfo.InvariantCulture));

        // Every property below is written twice — static markup and a WebDomOperation list — and both must produce
        // identical output, so the client's converters mirror WebCssValues/WebClassNames name for name.
        _ = RenderProperty<UIThemeMode?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.ThemeProperty, static (target, value) =>
        {
            if (value is UIThemeMode mode)
                _ = target.Attribute(WebAttributes.Theme, WebCssValues.ThemeName(mode));
        }, [WebDomOperation.Attribute(WebAttributes.Theme, converter: WebDomConverters.ThemeNameCss)]);
        // One attribute per tier rather than a class, so the Show/Hide/Collapse effects and a bound Visibility
        // resolve through the same mechanism instead of fighting over the element.
        _ = RenderProperty<UIResponsive<UIVisibility>?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.VisibilityProperty, static (target, value) =>
        {
            if (value is not UIResponsive<UIVisibility> responsive)
                return;

            UIVisibility tier = responsive.Base;
            RenderVisibilityTier(target, WebAttributes.Visibility, tier);

            tier = responsive.Sm ?? tier;
            RenderVisibilityTier(target, WebAttributes.VisibilitySm, tier);

            tier = responsive.Md ?? tier;
            RenderVisibilityTier(target, WebAttributes.VisibilityMd, tier);

            tier = responsive.Xl ?? tier;
            RenderVisibilityTier(target, WebAttributes.VisibilityXl, tier);

            tier = responsive.Xxl ?? tier;
            RenderVisibilityTier(target, WebAttributes.VisibilityXxl, tier);
        }, [
            WebDomOperation.Attribute(WebAttributes.Visibility, converter: WebDomConverters.VisibilityBaseAttribute),
            WebDomOperation.Attribute(WebAttributes.VisibilitySm, converter: WebDomConverters.VisibilitySmAttribute),
            WebDomOperation.Attribute(WebAttributes.VisibilityMd, converter: WebDomConverters.VisibilityMdAttribute),
            WebDomOperation.Attribute(WebAttributes.VisibilityXl, converter: WebDomConverters.VisibilityXlAttribute),
            WebDomOperation.Attribute(WebAttributes.VisibilityXxl, converter: WebDomConverters.VisibilityXxlAttribute)
        ]);

        // The class is the look, `inert` the fact: a class cannot take the keyboard away, and `inert` covers the whole subtree.
        _ = RenderProperty<bool?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.EnabledProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Class("ui-disabled").Attribute("inert");
        }, [
            WebDomOperation.ToggleClass("ui-disabled", condition: WebValueCondition.IsFalse),
            WebDomOperation.ToggleAttribute("inert", condition: WebValueCondition.IsFalse)
        ]);

        // Loading keeps its own colour but still takes `inert`; the client refcounts that attribute across this and Enabled.
        _ = RenderProperty<bool?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.LoadingProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-loading").Attribute("inert");
        }, [
            WebDomOperation.ToggleClass("ui-loading"),
            WebDomOperation.ToggleAttribute("inert", condition: WebValueCondition.IsTrue)
        ]);

        // Off, the menu stays in the tree and the engine refuses the right-click; on a host with rows, every row's.
        _ = RenderProperty<bool?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.ShowContextMenuProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Attribute(WebAttributes.NoContextMenu);
        }, [WebDomOperation.ToggleAttribute(WebAttributes.NoContextMenu, condition: WebValueCondition.IsFalse)]);

        _ = RenderProperty<UIAlignment?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.HorizontalAlignmentProperty, static (target, value) =>
        {
            if (value is UIAlignment alignment)
                _ = target.Style("--ui-align-h", WebCssValues.Alignment(alignment));
        }, [WebDomOperation.Style("--ui-align-h", converter: WebDomConverters.AlignmentCss)]);

        // Stretch needs a fallback: in a grid track with no height to stretch into the item would collapse.
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

    /// <summary>Renders the right-click menu inside its owner rather than portaled, so <c>closest()</c> paths keep working.</summary>
    private static void RenderContextMenu(WebRenderContext context, IHtmlElementBuilder root)
    {
        if (!context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.ContextMenu, out UIComponentSlot? slot))
            return;

        _ = root.Attribute(WebAttributes.ContextMenuOwner);

        _ = root.Element("div", host =>
        {
            _ = host.Class("ui-context-menu");
            _ = host.Attribute(WebAttributes.ContextMenu);
            _ = host.Attribute("role", "menu");
            // An entry with no command of its own must not hand its click to the owner's.
            _ = host.Attribute(WebAttributes.EventBoundary);

            context.Renderer.RenderComponent(context.ForHtml(host), slot.RootComponentId);
        });
    }

    // Each tier's rules are fenced into its own width band, so every tier restates its resolved value; `Visible` is
    // the absence of an attribute and must never be written.
    private static void RenderVisibilityTier(IHtmlElementBuilder target, string attribute, UIVisibility value)
    {
        if (value != UIVisibility.Visible)
            _ = target.Attribute(attribute, WebClassNames.Visibility(value));
    }

    // One custom property per tier; the stylesheet's widest-first var() chain lets an unset tier inherit the one below.
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
        if (context.IsPresentationCopy)
            return;

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

    /// <summary>Whether an optional region is set, so a renderer can skip emitting an empty wrapper for it.</summary>
    protected static bool HasRegion(WebRenderContext context, string regionName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);

        return context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out _, regionName);
    }

    /// <summary>Whether the component carries a required rule, read from the compiled validation index.</summary>
    protected static bool HasRequiredValidation(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        IReadOnlyList<CompiledUIValidationRule> rules = context.ViewResolution.View.Validations.GetByComponent(context.Node.ComponentId);

        for (var i = 0; i < rules.Count; i++)
        {
            if (rules[i].Operator == UIComparisonOperator.Required && rules[i].Severity == UIValidationSeverity.Error)
                return true;
        }

        return false;
    }

    /// <summary>Renders the <c>*</c> marker a required field carries.</summary>
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

    /// <summary>The "…" control at the end of a tab strip, shown by the client once captions are hidden for want of room; it lists every tab.</summary>
    protected static void RenderTabOverflowButton(WebRenderContext context, IHtmlElementBuilder parent)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(parent);

        _ = parent.Element("button", button =>
        {
            _ = button.Class("ui-tab-overflow ui-button ui-button--ghost ui-button--small");
            _ = button.Attribute("type", "button");
            _ = button.Attribute("aria-label", context.Translate(UIStrings.TabsMore));
            RenderPopupTrigger(button, "menu");
            _ = button.Attribute("tabindex", "-1");
        });
    }

    /// <summary>Writes the tooltip markup and placement attributes <c>TooltipEngine</c> reads.</summary>
    public static void RenderTooltip(WebRenderContext context, IHtmlElementBuilder target)
        => RenderTooltip(context, target, ITooltipComponent.TooltipProperty, ITooltipComponent.TooltipPlacementProperty);

    /// <inheritdoc cref="RenderTooltip(WebRenderContext, IHtmlElementBuilder)"/>
    public static void RenderTooltip(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, UIProperty placementProperty)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = RenderProperty<string?>(context, target, property, static (element, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = element.Attribute(WebAttributes.Tooltip, value);
        }, [WebDomOperation.Attribute(WebAttributes.Tooltip)]);

        // Written even for the default, so a bound and an unbound tooltip carry the same attribute.
        _ = RenderProperty<UIPopupPlacement?>(context, target, placementProperty, static (element, value) =>
        {
            if (value is UIPopupPlacement placement)
                _ = element.Attribute(WebAttributes.TooltipPlacement, WebClassNames.PopupPlacement(placement));
        }, [WebDomOperation.Attribute(WebAttributes.TooltipPlacement, converter: WebDomConverters.PopupPlacementAttribute)]);
    }

    /// <summary>
    /// The message line under a field (the <c>data-ui-validation-message</c> span), painted with the controller's
    /// <c>Validation</c> when one is set; the client's ValidationEngine owns it from then on and merges it with the rules.
    /// </summary>
    protected static void RenderValidationMessage(WebRenderContext context, IHtmlElementBuilder target)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = ResolveRenderValue(context, IInputComponent.ValidationProperty, out UIValidationMessage? validation, out _);
        _ = RenderValue<UIValidationMessage?>(context, target, IInputComponent.ValidationProperty);

        if (validation is { } message)
        {
            _ = target.Class(ValidationClass(message.Severity));
            _ = target.Style("--ui-validation-color", $"var(--ui-color-{ValidationColor(message.Severity)})");
        }

        _ = target.Element("span", line =>
        {
            _ = line.Class("ui-validation-message");
            _ = line.Attribute(WebAttributes.ValidationMessage);

            if (validation is { } text)
                _ = line.Text(text.Message);
        });
    }

    private static string ValidationClass(UIValidationSeverity severity)
        => severity switch
        {
            UIValidationSeverity.Warning => "ui-validation--warning",
            UIValidationSeverity.Info => "ui-validation--info",
            _ => "ui-invalid"
        };

    private static string ValidationColor(UIValidationSeverity severity)
        => severity switch
        {
            UIValidationSeverity.Warning => "warning",
            UIValidationSeverity.Info => "info",
            _ => "danger"
        };

    /// <summary>A control that opens a popup: the kind it opens, and closed until its engine says otherwise.</summary>
    protected static void RenderPopupTrigger(IHtmlElementBuilder trigger, string popupKind)
    {
        ArgumentNullException.ThrowIfNull(trigger);

        _ = trigger.Attribute("aria-haspopup", popupKind);
        _ = trigger.Attribute("aria-expanded", "false");
    }

    /// <summary>A boolean property as an attribute on the target, present when the condition holds; a bound one flips live.</summary>
    protected static void RenderFlagAttribute(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string attribute, WebValueCondition condition = WebValueCondition.IsTrue)
    {
        var whenTrue = condition == WebValueCondition.IsTrue;

        _ = RenderProperty<bool?>(context, target, property, (element, value) =>
        {
            if (value == whenTrue)
                _ = element.Attribute(attribute);
        }, [WebDomOperation.ToggleAttribute(attribute, target: "root", condition: condition)]);
    }

    /// <summary>A boolean property as a modifier class on the target, worn when the condition holds; a bound one flips live.</summary>
    protected static void RenderFlagClass(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string className, WebValueCondition condition = WebValueCondition.IsTrue)
    {
        var whenTrue = condition == WebValueCondition.IsTrue;

        _ = RenderProperty<bool?>(context, target, property, (element, value) =>
        {
            if (value == whenTrue)
                _ = element.Class(className);
        }, [WebDomOperation.ToggleClass(className, condition: condition)]);
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
                // A copy is painted and left unbound, or a live update would land on it too.
                if (context.IsPresentationCopy)
                {
                    renderStatic(target, value);
                    break;
                }

                _ = target.Attribute(CreateBindingAttributeName(property), binding!.Id.Value.ToString(CultureInfo.InvariantCulture));
                context.Metadata.Bind(context, binding, propertyId);

                // Painting the first value as well, so the page arrives finished rather than filling itself in later.
                if (context.Values is not null)
                    renderStatic(target, value);
                break;

            default:
            case WebRenderValueKind.Missing:
                break;
        }

        return kind;
    }

    /// <summary>Registers a property for value tracking only, with no DOM effect of its own.</summary>
    protected static WebRenderValueKind RenderValue<T>(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);

        return RenderProperty<T>(context, target, context.Node.TypeKey, property, static (_, _) => { }, [WebDomOperation.Data()]);
    }

    /// <inheritdoc cref="RenderValue{T}(WebRenderContext, IHtmlElementBuilder, UIProperty)"/>
    protected static WebRenderValueKind RenderValue<T>(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property)
        => RenderProperty<T>(context, target, propertyOwnerTypeKey, property, static (_, _) => { }, [WebDomOperation.Data()]);

    /// <summary>Reads a property's render-time value.</summary>
    public static WebRenderValueKind ResolveRenderValue<T>(WebRenderContext context, UIProperty property, out T? value, out CompiledUIBinding? binding)
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
                // Translated here too: an author-declared item reaches its template through a binding.
                if (propertyValue.IsTranslatable && bindingValue is string bindingText)
                    bindingValue = context.Translate(bindingText);

                value = CastRenderedValue<T>(bindingValue, property);
                return WebRenderValueKind.Static;
            }

            // Still a binding, but carrying this session's value so a renderer deriving from several properties
            // at once (a slider's fill from value, min and max) sees the real ones.
            _ = TryReadSessionValue(context, property, propertyValue, binding, out value);

            return WebRenderValueKind.Binding;
        }

        var rawValue = propertyValue.Value;

        if (propertyValue.IsTranslatable && rawValue is string text)
            rawValue = context.Translate(text);

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
            UIDynamicParameterScope scope = context.Parameters[i];

            if (new ItemContext(scope.Item).TryResolveBindingTemplate(template, binding.Parameters, context.Parameters, out value))
            {
                // An item saying nothing about a property is not an item saying "nothing": fall back to the template's literal.
                value ??= binding.TargetFallbackValue;
                return true;
            }
        }

        return false;
    }

    /// <summary>This session's value for a bound property, when the render was given any.</summary>
    private static bool TryReadSessionValue<T>(WebRenderContext context, UIProperty property, CompiledUIPropertyValue propertyValue, CompiledUIBinding binding, out T? value)
    {
        value = default;

        if (context.Values is null)
            return false;

        // A Dynamic parameter's value travels as the row and never has an update of its own, so the shape is
        // decided by the binding rather than by attempting a lookup that cannot hit.
        object? raw;

        if (HasDynamicParameter(binding))
        {
            if (!TryReadItemScopeValue(context, binding, out raw))
                return false;
        }
        else
        {
            UIPropertyAddress address = new(context.Node.ComponentId, property, ResolveDynamicParameters(context));

            if (!context.Values.TryGetValue(address, out raw))
                return false;
        }

        if (propertyValue.IsTranslatable && raw is string text)
            raw = context.Translate(text);

        if (raw is null)
            return true;

        // Not CastRenderedValue: a value that does not fit is left to the client rather than failing the page.
        if (!RecursiveValueCoercion.TryCoerce(raw, out T typed))
            return false;

        value = typed;
        return true;
    }

    /// <summary>A bound row's own value from the item in scope; only valid for a binding with a Dynamic parameter.</summary>
    private static bool TryReadItemScopeValue(WebRenderContext context, CompiledUIBinding binding, out object? value)
    {
        value = null;

        if (context.Parameters.Count == 0)
            return false;

        CompiledUIBindingTemplate template = context.ViewResolution.View.Templates.GetRequired(binding.TemplateId);

        for (var i = context.Parameters.Count - 1; i >= 0; i--)
        {
            if (new ItemContext(context.Parameters[i].Item).TryResolveBindingTemplate(template, binding.Parameters, context.Parameters, out value))
            {
                value ??= binding.TargetFallbackValue;
                return true;
            }
        }

        return false;
    }

    private static bool HasDynamicParameter(CompiledUIBinding binding)
    {
        for (var i = 0; i < binding.Parameters.Length; i++)
        {
            if (binding.Parameters[i].Kind == CompiledUIBindingParameterKind.Dynamic)
                return true;
        }

        return false;
    }

    /// <summary>The keys addressing the item this component is rendered inside, innermost last.</summary>
    protected static object?[]? ResolveDynamicParameters(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        var count = context.Node.ContextParameterCount;

        if (count <= 0 || context.Parameters.Count < count)
            return null;

        var parameters = new object?[count];

        for (var i = 0; i < count; i++)
            parameters[i] = context.Parameters[context.Parameters.Count - count + i].Key;

        return parameters;
    }

    private static string CreateBindingAttributeName(UIProperty property)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(property.Name);

        return WebAttributes.BindingPrefix + WebNaming.ToKebabCase(property.Name);
    }

    private static T? CastRenderedValue<T>(object? source, UIProperty property)
    {
        if (source is null)
            return default;

        // The same coercion a server update applies: a plain value against a responsive property is legal authoring.
        if (RecursiveValueCoercion.TryCoerce(source, out T typed))
            return typed;

        throw new InvalidOperationException($"Property '{property.Name}' value has type '{source.GetType().FullName}', but '{typeof(T).FullName}' was expected.");
    }
}
