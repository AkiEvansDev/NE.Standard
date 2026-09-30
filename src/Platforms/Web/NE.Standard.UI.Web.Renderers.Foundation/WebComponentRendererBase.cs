using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
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
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

public abstract class WebComponentRendererBase : IWebComponentRenderer
{
    private const string VisualComponentPropertyOwnerTypeKey = "standard.visual";

    // Every rendered component registers these same lists, so they are built once rather than per component.
    private static readonly WebDomOperation[] ThemeOperations = [WebDomOperation.Attribute(WebAttributes.Theme, converter: WebDomConverters.ThemeNameCss)];

    private static readonly WebDomOperation[] VisibilityOperations =
    [
        WebDomOperation.Attribute(WebAttributes.Visibility, converter: WebDomConverters.VisibilityBaseAttribute),
        WebDomOperation.Attribute(WebAttributes.VisibilitySm, converter: WebDomConverters.VisibilitySmAttribute),
        WebDomOperation.Attribute(WebAttributes.VisibilityMd, converter: WebDomConverters.VisibilityMdAttribute),
        WebDomOperation.Attribute(WebAttributes.VisibilityXl, converter: WebDomConverters.VisibilityXlAttribute),
        WebDomOperation.Attribute(WebAttributes.VisibilityXxl, converter: WebDomConverters.VisibilityXxlAttribute)
    ];

    private static readonly WebDomOperation[] EnabledOperations =
    [
        WebDomOperation.ToggleClass(WebClassNames.Disabled, condition: WebValueCondition.IsFalse),
        WebDomOperation.ToggleAttribute("aria-disabled", condition: WebValueCondition.IsFalse, value: "true")
    ];

    private static readonly WebDomOperation[] LoadingOperations =
    [
        WebDomOperation.ToggleClass(WebClassNames.Loading),
        WebDomOperation.ToggleAttribute("aria-busy", condition: WebValueCondition.IsTrue, value: "true")
    ];

    private static readonly WebDomOperation[] ShowContextMenuOperations = [WebDomOperation.ToggleAttribute(WebAttributes.NoContextMenu, condition: WebValueCondition.IsFalse)];
    private static readonly WebDomOperation[] ScrollGroupOperations = [WebDomOperation.Attribute(WebAttributes.ScrollGroup)];
    private static readonly WebDomOperation[] HorizontalAlignmentOperations = [WebDomOperation.Style("--ui-align-h", converter: WebDomConverters.AlignmentCss)];

    private static readonly WebDomOperation[] VerticalAlignmentOperations =
    [
        WebDomOperation.Style("--ui-align-v", converter: WebDomConverters.AlignmentCss),
        WebDomOperation.Style("--ui-align-v-stretch-fallback", converter: WebDomConverters.AlignmentStretchFallbackCss)
    ];

    private static readonly WebDomOperation[] ZIndexOperations = [WebDomOperation.Style("z-index", target: "root")];

    private static readonly WebDomOperation[] PlacementOperations =
    [
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
    ];

    /// <summary>What a tooltip's words do to the element they are the tooltip of; first in a list of operations the words drive.</summary>
    public static WebDomOperation TooltipOperation { get; } = WebDomOperation.Attribute(WebAttributes.Tooltip);

    private static readonly WebDomOperation[] TooltipOperations = [TooltipOperation];
    private static readonly WebDomOperation[] TooltipPlacementOperations = [WebDomOperation.Attribute(WebAttributes.TooltipPlacement, converter: WebDomConverters.PopupPlacementAttribute)];
    private static readonly WebDomOperation[] DataOperations = [WebDomOperation.Data()];
    private static readonly WebDomOperation[] LinkAddressOperations = [WebDomOperation.Attribute(WebAttributes.Href, converter: WebDomConverters.SafeUrl)];
    private static readonly WebDomOperation[] AccessibleNameOperations = [WebDomOperation.Attribute("aria-label")];

    // The four custom properties one placement tier writes, named once per tier.
    private static readonly PlacementTierNames BasePlacement = new("--ui-placement");
    private static readonly PlacementTierNames SmPlacement = new("--ui-placement-sm");
    private static readonly PlacementTierNames MdPlacement = new("--ui-placement-md");
    private static readonly PlacementTierNames XlPlacement = new("--ui-placement-xl");
    private static readonly PlacementTierNames XxlPlacement = new("--ui-placement-xxl");

    // A binding attribute's and a patch mark's name per property name, since kebab-casing builds a string each time.
    private static readonly ConcurrentDictionary<string, string> BindingAttributeNames = new(StringComparer.Ordinal);
    private static readonly ConcurrentDictionary<string, string> IntoAttributeNames = new(StringComparer.Ordinal);

    // A flag's one operation per name and condition: a table alone renders seven of them per instance.
    private static readonly ConcurrentDictionary<(string Name, WebValueCondition Condition), WebDomOperation[]> FlagAttributeOperations = new();
    private static readonly ConcurrentDictionary<(string Name, WebValueCondition Condition), WebDomOperation[]> FlagClassOperations = new();

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

        ApplyIdentity(context, html);

        // Every property below is written twice — static markup and a WebDomOperation list — and both must produce
        // identical output, so the client's converters mirror WebCssValues/WebClassNames name for name.
        _ = RenderProperty<UIThemeMode?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.ThemeProperty, static (target, value) =>
        {
            if (value is UIThemeMode mode)
                _ = target.Attribute(WebAttributes.Theme, WebCssValues.ThemeName(mode));
        }, ThemeOperations);
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
        }, VisibilityOperations);

        // The class is the look and the fact the client reads: it makes the root's children inert and refuses a press on the root
        // itself (refusal-engine.ts). Not `inert` on the root, which would take away its tooltip and its place for a screen reader.
        _ = RenderProperty<bool?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.EnabledProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Class(WebClassNames.Disabled).Attribute("aria-disabled", "true");
        }, EnabledOperations);

        // Loading keeps its own colour, and refuses the reader the way a disabled component does.
        _ = RenderProperty<bool?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.LoadingProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class(WebClassNames.Loading).Attribute("aria-busy", "true");
        }, LoadingOperations);

        // Off, the menu stays in the tree and the engine refuses the right-click; on a host with rows, every row's.
        _ = RenderProperty<bool?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.ShowContextMenuProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Attribute(WebAttributes.NoContextMenu);
        }, ShowContextMenuOperations);

        _ = RenderProperty<string?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.ScrollGroupProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.ScrollGroup, value.Trim());
        }, ScrollGroupOperations);

        _ = RenderProperty<UIAlignment?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.HorizontalAlignmentProperty, static (target, value) =>
        {
            if (value is UIAlignment alignment)
                _ = target.Style("--ui-align-h", WebCssValues.Alignment(alignment));
        }, HorizontalAlignmentOperations);

        // Stretch needs a fallback: in a grid track with no height to stretch into the item would collapse.
        _ = RenderProperty<UIAlignment?>(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.VerticalAlignmentProperty, static (target, value) =>
        {
            if (value is UIAlignment alignment)
            {
                _ = target.Style("--ui-align-v", WebCssValues.Alignment(alignment));

                if (alignment == UIAlignment.Stretch)
                    _ = target.Style("--ui-align-v-stretch-fallback", "start");
            }
        }, VerticalAlignmentOperations);

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
        }, ZIndexOperations);

        ResponsiveRenderer.ApplyResponsiveThickness(context, html, VisualComponentPropertyOwnerTypeKey, IVisualComponent.MarginProperty, "--ui-margin");

        ApplyPlacement(context, html);
    }

    /// <summary>The attributes the client finds a component by; a presentation copy carries no identity, only appearance.</summary>
    private static void ApplyIdentity(WebRenderContext context, IHtmlElementBuilder html)
    {
        if (context.IsPresentationCopy)
            return;

        UIComponentNode node = context.Node;

        _ = html.Attribute(WebAttributes.Id, node.ComponentId.Value.ToString(CultureInfo.InvariantCulture));
        _ = html.Attribute(WebAttributes.Context, node.ContextId.Value.ToString(CultureInfo.InvariantCulture));

        // Only an authored name: it is the one identifier that survives a recompilation, so persisted state keys by it.
        if (node.HasAuthoredId)
            _ = html.Attribute(WebAttributes.Name, node.AuthoringId);

        // Gated on ContextParameterCount, not DefinesContextParameter: a component that only inherits an item scope
        // still needs this to stay addressable by DomRegistry.findComponent.
        if (node.ContextParameterCount > 0)
            _ = html.Attribute(WebAttributes.Pc, node.ContextParameterCount.ToString(CultureInfo.InvariantCulture));
    }

    /// <summary>Renders the right-click menu inside its owner rather than portaled, so <c>closest()</c> paths keep working.</summary>
    private static void RenderContextMenu(WebRenderContext context, IHtmlElementBuilder root)
    {
        if (!context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.ContextMenu, out UIComponentSlot? slot))
            return;

        RenderContextMenuHost(context, root, slot, null);
    }

    /// <summary>Renders one of the component's regions as a further named right-click menu of its owner.</summary>
    /// <remarks>A region the component does not have renders nothing.</remarks>
    protected static void RenderContextMenuRegion(WebRenderContext context, IHtmlElementBuilder root, string name, string regionName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);

        if (context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out UIComponentSlot? slot, regionName))
            RenderContextMenuHost(context, root, slot, name);
    }

    private static void RenderContextMenuHost(WebRenderContext context, IHtmlElementBuilder root, UIComponentSlot slot, string? name)
    {
        _ = root.Attribute(WebAttributes.ContextMenuOwner);

        _ = root.Element("div", host =>
        {
            _ = host.Class("ui-context-menu");
            _ = host.Attribute(WebAttributes.ContextMenu, name);
            _ = host.Attribute("role", "menu");
            // An entry with no command of its own must not hand its click to the owner's.
            _ = host.Attribute(WebAttributes.EventBoundary);

            // Marked, not inferred from the slot: a named menu is a region of its owner like any other, and its entries are still menu items.
            context.Renderer.RenderComponent(context.AsPopupMenu(host), slot.RootComponentId);
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

            WritePlacementTier(target, BasePlacement, responsive.Base);

            if (responsive.Sm is UIGridPlacement sm)
                WritePlacementTier(target, SmPlacement, sm);

            if (responsive.Md is UIGridPlacement md)
                WritePlacementTier(target, MdPlacement, md);

            if (responsive.Xl is UIGridPlacement xl)
                WritePlacementTier(target, XlPlacement, xl);

            if (responsive.Xxl is UIGridPlacement xxl)
                WritePlacementTier(target, XxlPlacement, xxl);
        }, PlacementOperations);
    }

    private static void WritePlacementTier(IHtmlElementBuilder target, PlacementTierNames names, UIGridPlacement placement)
    {
        _ = target.Style(names.Column, placement.Column.ToString(CultureInfo.InvariantCulture));
        _ = target.Style(names.Row, placement.Row.ToString(CultureInfo.InvariantCulture));
        _ = target.Style(names.ColumnSpan, placement.ColumnSpan.ToString(CultureInfo.InvariantCulture));
        _ = target.Style(names.RowSpan, placement.RowSpan.ToString(CultureInfo.InvariantCulture));
    }

    private sealed class PlacementTierNames(string prefix)
    {
        public string Column { get; } = prefix + "-column";

        public string Row { get; } = prefix + "-row";

        public string ColumnSpan { get; } = prefix + "-column-span";

        public string RowSpan { get; } = prefix + "-row-span";
    }

    private static void ApplyMetadata(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        if (context.IsPresentationCopy)
            return;

        CompiledView view = context.ViewResolution.View;
        UIComponentId componentId = context.Node.ComponentId;

        context.Metadata.AddEvents(view.Events.GetByComponent(componentId));
        context.Metadata.AddInteractions(view.Interactions.GetByComponent(componentId));
        context.Metadata.AddValidations(view.Validations.GetByComponent(componentId));
    }

    /// <summary>
    /// Makes an element drawn by another renderer stand as <see cref="WebRenderContext.Node"/> — its identity and its events,
    /// interactions and validations, as a rendered component carries them; nothing for a presentation copy.
    /// </summary>
    protected static void StampComponent(WebRenderContext context, IHtmlElementBuilder html)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(html);

        ApplyIdentity(context, html);
        ApplyMetadata(context);
    }

    public static void RenderChildren(WebRenderContext context, IHtmlElementBuilder html)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(html);

        IReadOnlyList<UIComponentId> children = context.ViewResolution.View.Graph.GetChildren(context.Node.ComponentId);

        for (var i = 0; i < children.Count; i++)
            context.Renderer.RenderComponent(context.ForHtml(html), children[i]);
    }

    /// <summary>
    /// Renders the component a region holds; <paramref name="exposed"/> properties are ones a package's client may set like
    /// a push (<c>properties.set</c>), for state it keeps in sync.
    /// </summary>
    public static void RenderRegion(WebRenderContext context, IHtmlElementBuilder html, string regionName, params ReadOnlySpan<UIProperty> exposed)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(html);
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);

        CompiledView view = context.ViewResolution.View;

        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out UIComponentSlot? slot, regionName))
            return;

        // Before the render, which marks the element each exposed property lands on.
        foreach (UIProperty property in exposed)
            context.Metadata.ExposeProperty(new UIPropertyAddress(slot.RootComponentId, property));

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
        => RenderOverflowButton(context, parent, "ui-tab-overflow ui-button ui-button--ghost ui-button--small", UIStrings.TabsMore, tabStop: false);

    /// <summary>
    /// The "…" control a strip shows once what it holds no longer fits, opening a menu of what was put away; the stylesheet hides
    /// it until the client marks the strip. Out of the tab order in a roving strip (tabs), a tab stop where each item is one.
    /// </summary>
    protected static void RenderOverflowButton(WebRenderContext context, IHtmlElementBuilder parent, string className, string word, bool tabStop)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(parent);

        _ = parent.Element("button", button =>
        {
            _ = button.Class(className);
            _ = button.Attribute("type", "button");
            WebWords.Write(context, button, "aria-label", word);
            RenderPopupTrigger(button, "menu");

            if (!tabStop)
                _ = button.Attribute("tabindex", "-1");
        });
    }

    /// <summary>
    /// Writes an <see cref="IAccessibleNameComponent"/>'s authored name as <paramref name="target"/>'s <c>aria-label</c>, over whatever
    /// named it before; nothing where the component sets none.
    /// </summary>
    public static void RenderAccessibleName(WebRenderContext context, IHtmlElementBuilder target)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        // Registered only where it is set or bound: most controls are named by their words and carry no such property at all.
        if (ResolveRenderValue(context, IAccessibleNameComponent.AccessibleNameProperty, out string? _, out _) == WebRenderValueKind.Missing)
            return;

        _ = RenderProperty<string?>(context, target, IAccessibleNameComponent.AccessibleNameProperty, static (element, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = element.Attribute("aria-label", value);
        }, AccessibleNameOperations);
    }

    /// <summary>Writes the tooltip markup and placement attributes <c>tooltip-engine.ts</c> reads.</summary>
    public static void RenderTooltip(WebRenderContext context, IHtmlElementBuilder target)
        => RenderTooltip(context, target, ITooltipComponent.TooltipProperty, ITooltipComponent.TooltipPlacementProperty);

    /// <inheritdoc cref="RenderTooltip(WebRenderContext, IHtmlElementBuilder)"/>
    public static void RenderTooltip(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, UIProperty placementProperty)
        => RenderTooltip(context, target, property, placementProperty, TooltipOperations);

    /// <summary>
    /// The tooltip of a control it also names — an icon-only button: <paramref name="nameOperation"/> joins the tooltip's own
    /// operations, so the name follows a push and a language switch (<see cref="TextContentRendererBase.TooltipNameOperation"/>).
    /// </summary>
    protected static void RenderTooltip(WebRenderContext context, IHtmlElementBuilder target, WebDomOperation nameOperation)
        => RenderTooltip(context, target, ITooltipComponent.TooltipProperty, ITooltipComponent.TooltipPlacementProperty, [TooltipOperation, nameOperation]);

    /// <summary>
    /// The tooltip whose words drive <paramref name="operations"/> — <see cref="TooltipOperation"/> first, then what else follows the
    /// words, as a caption badge's name and tab stop do.
    /// </summary>
    public static void RenderTooltip(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, UIProperty placementProperty, ReadOnlySpan<WebDomOperation> operations)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = RenderProperty<string?>(context, target, property, static (element, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = element.Attribute(WebAttributes.Tooltip, value);
        }, operations);

        // Written even for the default, so a bound and an unbound tooltip carry the same attribute.
        _ = RenderProperty<UIPopupPlacement?>(context, target, placementProperty, static (element, value) =>
        {
            if (value is UIPopupPlacement placement)
                _ = element.Attribute(WebAttributes.TooltipPlacement, WebClassNames.PopupPlacement(placement));
        }, TooltipPlacementOperations);
    }

    /// <summary>
    /// The message line under a field (<c>data-ui-validation-message</c>), painted from the controller's <c>Validation</c> when
    /// set; the client's ValidationEngine then owns and merges it with the rules.
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

        // Auto says nothing on the element: the stylesheet decides by where the field stands, and the engine reads its decision.
        _ = ResolveRenderValue(context, IInputComponent.ValidationPresentationProperty, out UIValidationPresentation? presentation, out _);

        if (presentation is UIValidationPresentation.Marker)
            _ = target.Class("ui-validation--marker");
        else if (presentation is UIValidationPresentation.Message)
            _ = target.Class("ui-validation--message");

        // A field sending its words elsewhere outranks either presentation, since the two can't both be on; the target is
        // resolved after the page renders since it may come later.
        if (context.ViewResolution.View.Validations.TryGetMessageTarget(context.Node.ComponentId, out UIPropertyAddress messageTarget))
        {
            _ = target.Class("ui-validation--elsewhere");
            context.Metadata.AddValidationTarget(context.Node.ComponentId, messageTarget);
        }

        _ = target.Element("span", line =>
        {
            _ = line.Class("ui-validation-message");
            _ = line.Attribute(WebAttributes.ValidationMessage);

            // Read out when the words change, and named by the field it describes where the render can give it an id.
            if (ValidationMessageId(context) is string id)
                _ = line.Attribute("id", id);

            _ = line.Attribute("aria-live", "polite");

            // Marked with the author's words, so a language switch writes it again; the validation engine keeps the mark once it writes.
            if (validation is { Message: { IsText: true } text })
                WebWords.WriteText(context, line, null, text.Key);
            else if (validation is { Message: { } phrase })
                WebWords.Write(context, line, null, phrase.Key, phrase.Arguments);
        });
    }

    /// <summary>
    /// The id a field's validation line carries; null where the component may stand on the page more than once — a row, a template
    /// the client clones — since an id must be unique.
    /// </summary>
    protected static string? ValidationMessageId(WebRenderContext context)
        => ComponentPartId(context, "validation");

    /// <summary>
    /// The id of a part of the component another of its elements names (<c>aria-describedby</c>); null where the component may stand
    /// on the page more than once — a row, a template the client clones — since an id must be unique.
    /// </summary>
    protected static string? ComponentPartId(WebRenderContext context, string part)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentException.ThrowIfNullOrWhiteSpace(part);

        return context.Node.ContextParameterCount == 0 && !context.IsPresentationCopy && !context.IsTemplate
            ? string.Create(CultureInfo.InvariantCulture, $"ui-{context.Node.ComponentId.Value}-{part}")
            : null;
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

    /// <summary>
    /// A link's address: kept on <see cref="WebAttributes.Href"/> always, and as <c>href</c> only while the component is enabled and
    /// not loading, so a disabled link opens from nowhere — the browser's own menu included. The client moves <c>href</c> with the state.
    /// </summary>
    /// <remarks>An anchor with no <c>href</c> leaves the tab order, so meanwhile it takes <c>tabindex="0"</c>, as a disabled button stays focusable.</remarks>
    public static void RenderLinkAddress(WebRenderContext context, IHtmlElementBuilder target, UIProperty urlProperty)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        var live = ReadRenderValue(context, IVisualComponent.EnabledProperty, true) && !ReadRenderValue(context, IVisualComponent.LoadingProperty, false);

        _ = RenderProperty<string?>(context, target, urlProperty, (element, value) =>
        {
            if (!WebUrlSafety.IsSafeLink(value))
                return;

            _ = element.Attribute(WebAttributes.Href, value);

            if (live)
                _ = element.Attribute("href", value);
            else
                _ = element.Attribute("tabindex", "0");
        }, LinkAddressOperations);
    }

    /// <summary>A control that opens a popup: the kind it opens, and closed until its engine says otherwise.</summary>
    protected static void RenderPopupTrigger(IHtmlElementBuilder trigger, string popupKind)
    {
        ArgumentNullException.ThrowIfNull(trigger);

        _ = trigger.Attribute("aria-haspopup", popupKind);
        _ = trigger.Attribute("aria-expanded", "false");
    }

    /// <summary>A boolean property as an attribute on the target, present when the condition holds; a live patch lands on the same element.</summary>
    protected static void RenderFlagAttribute(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string attribute, WebValueCondition condition = WebValueCondition.IsTrue)
    {
        var whenTrue = condition == WebValueCondition.IsTrue;

        _ = RenderProperty<bool?>(context, target, property, (element, value) =>
        {
            if (value == whenTrue)
                _ = element.Attribute(attribute);
        }, FlagAttributeOperations.GetOrAdd((attribute, condition), static key => [WebDomOperation.ToggleAttribute(key.Name, condition: key.Condition)]));
    }

    /// <summary>A boolean property as a modifier class on the target, worn when the condition holds; a live patch lands on the same element.</summary>
    protected static void RenderFlagClass(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string className, WebValueCondition condition = WebValueCondition.IsTrue)
    {
        var whenTrue = condition == WebValueCondition.IsTrue;

        _ = RenderProperty<bool?>(context, target, property, (element, value) =>
        {
            if (value == whenTrue)
                _ = element.Class(className);
        }, FlagClassOperations.GetOrAdd((className, condition), static key => [WebDomOperation.ToggleClass(key.Name, condition: key.Condition)]));
    }

    public static WebRenderValueKind RenderProperty<T>(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, Action<IHtmlElementBuilder, T?> renderStatic, params ReadOnlySpan<WebDomOperation> operations)
    {
        ArgumentNullException.ThrowIfNull(context);

        return RenderProperty(context, target, context.Node.TypeKey, property, renderStatic, operations);
    }

    /// <summary>
    /// Renders one property and registers what it does to the DOM, so the static markup and a live patch agree.
    /// </summary>
    /// <remarks>
    /// The operations are a span so the call site's collection expression stays on the stack; this runs for every rendered
    /// property on the page.
    /// </remarks>
    public static WebRenderValueKind RenderProperty<T>(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, Action<IHtmlElementBuilder, T?> renderStatic, params ReadOnlySpan<WebDomOperation> operations)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyOwnerTypeKey);
        ArgumentException.ThrowIfNullOrWhiteSpace(property.Name);
        ArgumentNullException.ThrowIfNull(renderStatic);

        WebRenderValueKind kind = ResolveRenderValue(context, property, out T? value, out CompiledUIBinding? binding, out RenderedWord word);
        UIPropertyAddress address = new(context.Node.ComponentId, property);
        var propertyId = context.Metadata.RegisterProperty(propertyOwnerTypeKey, property, word.Translatable, operations);
        context.Metadata.RegisterRenderedProperty(address, propertyId, word.Content);

        switch (kind)
        {
            case WebRenderValueKind.Static:
                renderStatic(target, value);
                RenderIntoMark(context, target, address, RecordWord(context, propertyId, word));
                break;

            case WebRenderValueKind.Binding:
                // A copy is painted and left unbound, or a live update would land on it too.
                if (context.IsPresentationCopy)
                {
                    renderStatic(target, value);
                    break;
                }

                _ = target.Attribute(CreateBindingAttributeName(property), binding!.Id.Value.ToString(CultureInfo.InvariantCulture));
                context.Metadata.Bind(context, binding, propertyId, word.Content);

                // Painting the first value as well, so the page arrives finished rather than filling itself in later.
                if (context.Values is not null)
                    renderStatic(target, value);
                break;

            default:
            case WebRenderValueKind.Missing:
                RenderIntoMark(context, target, address, recordedWord: false);
                break;
        }

        return kind;
    }

    /// <summary>
    /// A static translatable value recorded for the page, so a language switch writes it again: once for every instance when it is
    /// the component's own, per row when it was read off the row's item. Only where the page can switch to another language.
    /// </summary>
    private static bool RecordWord(WebRenderContext context, string propertyId, RenderedWord word)
    {
        if (word.Key is null || context.IsPresentationCopy || context.Translator.Languages.Count < 2)
            return false;

        context.Metadata.AddWord(context.Node.ComponentId, propertyId, word.FromItem ? ResolveItemKeys(context) : null, word.Key);
        return true;
    }

    /// <summary>
    /// The keys of the rows a value read off an item belongs to, innermost last: the whole address on the page, only the inner rows'
    /// inside a template the client clones into rows of its own (a grid's cell editor) — the client matches them from the innermost.
    /// </summary>
    private static object?[]? ResolveItemKeys(WebRenderContext context)
    {
        var count = Math.Min(context.Node.ContextParameterCount, context.Parameters.Count);

        if (count <= 0)
            return null;

        var keys = new object?[count];

        for (var i = 0; i < count; i++)
            keys[i] = context.Parameters[context.Parameters.Count - count + i].Key;

        return keys;
    }

    /// <summary>
    /// Marks the element an unbound property lands on, for patches that still reach it (a field's validation words, an exposed
    /// property, a recorded word a language switch writes again); without a mark, a patch lands on the root.
    /// </summary>
    private static void RenderIntoMark(WebRenderContext context, IHtmlElementBuilder target, UIPropertyAddress address, bool recordedWord)
    {
        if (context.IsPresentationCopy)
            return;

        if (recordedWord || context.ViewResolution.View.Validations.IsMessageTarget(address) || context.Metadata.IsExposed(address))
            _ = target.Attribute(IntoAttributeNames.GetOrAdd(address.Property.Name, static name => WebAttributes.IntoPrefix + WebNaming.ToKebabCase(name)));
    }

    /// <summary>Registers a property for value tracking only, with no DOM effect of its own.</summary>
    protected static WebRenderValueKind RenderValue<T>(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);

        return RenderProperty<T>(context, target, context.Node.TypeKey, property, static (_, _) => { }, DataOperations);
    }

    /// <inheritdoc cref="RenderValue{T}(WebRenderContext, IHtmlElementBuilder, UIProperty)"/>
    protected static WebRenderValueKind RenderValue<T>(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property)
        => RenderProperty<T>(context, target, propertyOwnerTypeKey, property, static (_, _) => { }, DataOperations);

    /// <summary>A translatable property's render-time value both ways: the author's key or <see cref="UIPhrase"/>, and the page's words.</summary>
    /// <remarks>
    /// <paramref name="key"/> is null where this instance shows the value as written or it is bound. For a word a renderer hands the
    /// client to translate again after a switch (a unit, a caption in a model).
    /// </remarks>
    public static WebRenderValueKind ResolveRenderWord(WebRenderContext context, UIProperty property, out object? key, out string? words)
    {
        WebRenderValueKind kind = ResolveRenderValue(context, property, out words, out _, out RenderedWord word);

        key = word.Key;
        return kind;
    }

    /// <summary>
    /// Writes a translatable property's words on <paramref name="attribute"/>, or as the element's text, marked with the author's key
    /// (<see cref="WebWords"/>) so a language switch writes them again.
    /// </summary>
    /// <remarks>
    /// Content, and a bound value's first paint, are written as they stand. For chrome that repeats a property's words elsewhere.
    /// </remarks>
    public static WebRenderValueKind WriteRenderWord(WebRenderContext context, IHtmlElementBuilder element, string? attribute, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(element);

        WebRenderValueKind kind = ResolveRenderWord(context, property, out var key, out var words);

        switch (key)
        {
            case UIPhrase { IsText: true } text:
                WebWords.WriteText(context, element, attribute, text.Key);
                break;
            case UIPhrase phrase:
                WebWords.Write(context, element, attribute, phrase.Key, phrase.Arguments);
                break;
            case string text:
                WebWords.WriteText(context, element, attribute, text);
                break;
            default:
                if (string.IsNullOrWhiteSpace(words))
                    break;

                _ = attribute is null ? element.Text(words) : element.Attribute(attribute, words);
                break;
        }

        return kind;
    }

    /// <summary>
    /// A property's render-time value — translated for the page where it is a key — or <paramref name="fallback"/> where it is
    /// missing, bound with no value yet, or null.
    /// </summary>
    protected static T ReadRenderValue<T>(WebRenderContext context, UIProperty property, T fallback)
    {
        _ = ResolveRenderValue(context, property, out T? value, out _);

        return value ?? fallback;
    }

    /// <summary>
    /// Reads a property's render-time value, translated for the page where it is a key or a phrase: the words the page shows, not
    /// the author's key — <see cref="ResolveRenderWord"/> gives both.
    /// </summary>
    public static WebRenderValueKind ResolveRenderValue<T>(WebRenderContext context, UIProperty property, out T? value, out CompiledUIBinding? binding)
        => ResolveRenderValue(context, property, out value, out binding, out _);

    /// <summary>
    /// Reads a property's render-time value, translated where it is a key, and says which key it was — what the page records to
    /// write the value again in another language.
    /// </summary>
    private static WebRenderValueKind ResolveRenderValue<T>(WebRenderContext context, UIProperty property, out T? value, out CompiledUIBinding? binding, out RenderedWord word)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentException.ThrowIfNullOrWhiteSpace(property.Name);

        value = default;
        binding = null;
        word = default;

        CompiledView view = context.ViewResolution.View;

        if (!view.State.TryGetValue(context.Node.ComponentId, property, out CompiledUIPropertyValue? propertyValue))
            return WebRenderValueKind.Missing;

        // The compiler's answer, carried on the value: asking the property register here would take its lock per property.
        word = new RenderedWord(propertyValue.IsTranslatable, propertyValue.IsContent, null, FromItem: false);

        if (propertyValue.IsBind)
        {
            if (propertyValue.BindingId is not UIBindingId bindingId || bindingId.IsEmpty)
                throw new InvalidOperationException($"Property '{property.Name}' binding id is required.");

            binding = view.Bindings.GetRequired(bindingId);

            if (TryResolveStaticBindingValue(context, binding, out var bindingValue, out var scopeItem))
            {
                // Translated here too: an author-declared item reaches its template through a binding — unless the item says its
                // words are content.
                var translatable = propertyValue.IsTranslatable && !IsContentItem(scopeItem);

                word = word with { Key = ReadWordKey(translatable, bindingValue), FromItem = true };
                bindingValue = TranslateRenderedValue(context, translatable, bindingValue);

                value = CastRenderedValue<T>(bindingValue, property);
                return WebRenderValueKind.Static;
            }

            // Still a binding, but carrying this session's value so a renderer deriving from several properties
            // at once (a slider's fill from value, min and max) sees the real ones.
            _ = TryReadSessionValue(context, property, propertyValue, binding, out value);

            return WebRenderValueKind.Binding;
        }

        var rawValue = propertyValue.Value;

        word = word with { Key = ReadWordKey(propertyValue.IsTranslatable, rawValue) };
        rawValue = TranslateRenderedValue(context, propertyValue.IsTranslatable, rawValue);

        value = CastRenderedValue<T>(rawValue, property);
        return WebRenderValueKind.Static;
    }

    /// <summary>The key a rendered value was translated from — a phrase, or a plain string on a translatable property — else none.</summary>
    private static object? ReadWordKey(bool translatable, object? value)
    {
        if (value is UIPhrase)
            return value;

        return translatable && value is string text && !string.IsNullOrWhiteSpace(text) ? value : null;
    }

    /// <summary>
    /// A phrase is always translated; a plain string only on a translatable property this instance does not show as written, read
    /// off no item marked content.
    /// </summary>
    private static object? TranslateRenderedValue(WebRenderContext context, bool translatable, object? value)
        => value switch
        {
            UIPhrase phrase => context.Translate(phrase),
            string text when translatable => context.Translate(text),
            _ => value
        };

    /// <summary>Whether the item a value was read off says its words are content (<see cref="IContentItem"/>).</summary>
    private static bool IsContentItem(object? item)
        => item is IContentItem { IsContent: true };

    /// <summary>
    /// Whether a property's value is translatable here, whether it is translatable text this instance shows as written, the key a
    /// static value was translated from, and whether that value was read off the row's item rather than the component's own.
    /// </summary>
    private readonly record struct RenderedWord(bool Translatable, bool Content, object? Key, bool FromItem);

    protected static bool TryResolveStaticBindingValue(WebRenderContext context, CompiledUIBinding binding, out object? value)
        => TryResolveStaticBindingValue(context, binding, out value, out _);

    /// <summary>A bound value read off the items in scope, and the item it was read off.</summary>
    private static bool TryResolveStaticBindingValue(WebRenderContext context, CompiledUIBinding binding, out object? value, out object? scopeItem)
    {
        scopeItem = null;
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(binding);

        value = null;

        CompiledView view = context.ViewResolution.View;
        CompiledUIBindingSource source = view.Sources.GetRequired(binding.SourceId);

        if (source.Kind != CompiledUIBindingSourceKind.ComponentItems)
            return false;

        return TryReadItemScopeValue(context, binding, out value, out scopeItem);
    }

    /// <summary>
    /// A bound value read off the items in scope, innermost first — an author-declared item's, or a bound row's own for a binding
    /// with a Dynamic parameter — and the item that answered.
    /// </summary>
    private static bool TryReadItemScopeValue(WebRenderContext context, CompiledUIBinding binding, out object? value, out object? scopeItem)
    {
        value = null;
        scopeItem = null;

        if (context.Parameters.Count == 0)
            return false;

        CompiledUIBindingTemplate template = context.ViewResolution.View.Templates.GetRequired(binding.TemplateId);

        for (var i = context.Parameters.Count - 1; i >= 0; i--)
        {
            if (new ItemContext(context.Parameters[i].Item).TryResolveBindingTemplate(template, binding.Parameters, context.Parameters, out value))
            {
                scopeItem = context.Parameters[i].Item;

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

        // A Dynamic parameter's value travels as the row and never updates on its own, so the binding decides the shape
        // rather than a lookup that can't hit.
        object? raw;
        var translatable = propertyValue.IsTranslatable;

        if (HasDynamicParameter(binding))
        {
            if (!TryReadItemScopeValue(context, binding, out raw, out var scopeItem))
                return false;

            translatable &= !IsContentItem(scopeItem);
        }
        else
        {
            UIPropertyAddress address = new(context.Node.ComponentId, property, ResolveDynamicParameters(context));

            if (!context.Values.TryGetValue(address, out raw))
                return false;
        }

        raw = TranslateRenderedValue(context, translatable, raw);

        if (raw is null)
            return true;

        // Not CastRenderedValue: a value that does not fit is left to the client rather than failing the page.
        if (!RecursiveValueCoercion.TryCoerce(raw, out T typed))
            return false;

        value = typed;
        return true;
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

    /// <summary>The culture this session's page is written in, for a value the renderer formats itself.</summary>
    protected static CultureInfo ResolveCulture(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        return WebCultures.Resolve(context.ViewResolution.Session.Language);
    }

    /// <summary>The culture a formatted input writes its value in: its own <c>Culture</c>, else the page's — the session's language.</summary>
    protected static CultureInfo ResolveInputCulture(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        _ = ResolveRenderValue(context, IFormattedInputComponent.CultureProperty, out string? culture, out _);

        return string.IsNullOrWhiteSpace(culture) ? ResolveCulture(context) : WebCultures.Resolve(culture);
    }

    /// <summary>The items of an items component, and whether they are left to the client to render.</summary>
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

    private static string CreateBindingAttributeName(UIProperty property)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(property.Name);

        return BindingAttributeNames.GetOrAdd(property.Name, static name => WebAttributes.BindingPrefix + WebNaming.ToKebabCase(name));
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
