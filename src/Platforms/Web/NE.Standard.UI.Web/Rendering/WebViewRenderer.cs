using System;
using System.Collections.Frozen;
using System.Runtime.CompilerServices;
using Microsoft.Extensions.Hosting;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Html;

namespace NE.Standard.UI.Web.Rendering;

internal sealed class WebViewRenderer : IWebViewRenderer
{
    // Read by the stylesheet alone, so named constants here rather than in WebAttributes, which holds what the client script reads.
    private const string StickyAttribute = "data-ui-sticky";
    // On the band carrying the drawers' buttons, naming their sides.
    private const string DrawerTogglesAttribute = "data-ui-drawer-toggles";
    private const string DialogSurfaceAttribute = "data-ui-dialog-surface";
    private const string DrawerToggleClass = "ui-shell__drawer-toggle";

    // The plain boxes a side's menu may stand in and still be its whole content: they give it room and ground, nothing of their own.
    private static readonly FrozenSet<string> SideWrapperTypeKeys = new[]
    {
        ContainerComponent.ComponentTypeKey, StackPanelComponent.ComponentTypeKey, WrapPanelComponent.ComponentTypeKey,
        SurfaceComponent.ComponentTypeKey, ScrollContainerComponent.ComponentTypeKey
    }.ToFrozenSet(StringComparer.Ordinal);

    // The sides a view's own buttons open (ButtonComponent.OpensDrawer), read off the compiled state once per view.
    private static readonly ConditionalWeakTable<CompiledView, StrongBox<(bool Left, bool Right)>> DrawerOpeners = [];

    private readonly IWebRendererRegistry _renderers;
    private readonly ITranslator _translator;
    private readonly UITheme _theme;
    private readonly UITemporalOptions _temporal;

    // In development a page is told what each host's rows carry, so a read of a path the server did not ship warns.
    private readonly bool _describesItemPaths;

    public WebViewRenderer(IWebRendererRegistry renderers, UIApplication application, IHostEnvironment? environment = null)
    {
        ArgumentNullException.ThrowIfNull(renderers);
        ArgumentNullException.ThrowIfNull(application);

        _renderers = renderers;
        _translator = application.Translator;
        _theme = application.Theme;
        _temporal = application.Temporal;
        _describesItemPaths = environment?.IsDevelopment() == true;
    }

    public WebRenderResult Render(UIViewResolution resolution, IWebRenderValues? values = null)
    {
        ArgumentNullException.ThrowIfNull(resolution);

        resolution.Validate();

        HtmlContentBuilder html = new();
        WebRenderMetadata metadata = new();

        RenderRegions(resolution, html, metadata, values);
        RenderDialogs(resolution, html, metadata, values);

        if (_describesItemPaths)
            metadata.DescribeItemPaths(resolution.View.ItemProjections);

        WebRenderResult result = new()
        {
            Content = html,
            Metadata = metadata
        };

        result.Validate();

        return result;
    }

    private void RenderRegions(UIViewResolution viewResolution, HtmlContentBuilder html, WebRenderMetadata metadata, IWebRenderValues? values)
    {
        ArgumentNullException.ThrowIfNull(viewResolution);
        ArgumentNullException.ThrowIfNull(html);
        ArgumentNullException.ThrowIfNull(metadata);

        CompiledView view = viewResolution.View;
        // A left side that is a rail alone is a bar along the page's bottom on a phone, not a drawer, so it has no button; unless the
        // view keeps it a drawer, where the rail is drawn as a list.
        var bottomBar = HasBottomBar(view);
        var railDrawer = view.Options.SideDrawers && !view.Options.RailBottomBar && IsRailAlone(view, RegionNames.LeftSide);
        var leftDrawer = !bottomBar && view.FindRegion(RegionNames.LeftSide) is not null;
        var rightDrawer = view.FindRegion(RegionNames.RightSide) is not null;
        // A side the page opens by a button of its own gets none of the shell's, so a header collapsed on a phone leaves no band for it.
        (var leftOpener, var rightOpener) = OwnOpeners(view);
        var leftToggle = leftDrawer && !leftOpener;
        var rightToggle = rightDrawer && !rightOpener;
        // The band that carries the drawers' buttons: the header, or the content where a page has none.
        var toggles = view.Options.SideDrawers ? ToggleHost(view, leftToggle, rightToggle) : null;
        for (var i = 0; i < view.Regions.Length; i++)
        {
            CompiledRegion region = view.Regions[i];

            _ = html.Element("section", section =>
            {
                _ = section.Attribute(WebAttributes.Region, region.Key);

                // A `section`, not `header`/`main`/`nav`, keeps the grid's rules; the role makes it a landmark.
                if (LandmarkRole(view, region.Key) is string role)
                    _ = section.Attribute("role", role);

                // On the region rather than on the root: sticking is a property of this band of the page.
                if (view.Options.StickyHeader && string.Equals(region.Key, RegionNames.Header, StringComparison.Ordinal))
                    _ = section.Attribute(StickyAttribute);

                if (bottomBar && string.Equals(region.Key, RegionNames.LeftSide, StringComparison.Ordinal))
                    _ = section.Attribute(WebAttributes.BottomBar);

                if (railDrawer && string.Equals(region.Key, RegionNames.LeftSide, StringComparison.Ordinal))
                    _ = section.Attribute(WebAttributes.RailDrawer);

                // What the drawer's buttons name as the region they open.
                if (view.Options.SideDrawers && IsDrawer(region.Key, leftDrawer, rightDrawer))
                    _ = section.Attribute("id", WebAttributes.DrawerId(region.Key));

                var carriesToggles = string.Equals(region.Key, toggles, StringComparison.Ordinal);

                // The stylesheet lays the band in a row with its buttons by this, rather than by looking for a button inside it.
                if (carriesToggles && (leftToggle || rightToggle))
                    _ = section.Attribute(DrawerTogglesAttribute, DrawerToggleSides(leftToggle, rightToggle));

                if (carriesToggles && leftToggle)
                    RenderDrawerToggle(section, RegionNames.LeftSide, viewResolution);

                RenderRoot(viewResolution, region.RootComponentId, section, metadata, values);

                if (carriesToggles && rightToggle)
                    RenderDrawerToggle(section, RegionNames.RightSide, viewResolution);
            });
        }
    }

    /// <summary>Whether the left side is a phone's bottom bar: a rail alone under side drawers, unless the view keeps it a drawer.</summary>
    internal static bool HasBottomBar(CompiledView view)
        => view.Options.SideDrawers && view.Options.RailBottomBar && IsRailAlone(view, RegionNames.LeftSide);

    /// <summary>
    /// Whether the content region's root fills its height: its base <c>Height</c> is <c>Fill</c>, a bound one as the session's values
    /// paint it. The client keeps the mark as the height changes (<c>content-fills.ts</c>).
    /// </summary>
    internal static bool ContentFills(CompiledView view, IWebRenderValues? values)
    {
        if (view.FindRegion(RegionNames.Content) is not CompiledRegion region || !view.State.TryGetValue(region.RootComponentId, IVisualComponent.HeightProperty, out CompiledUIPropertyValue? height))
            return false;

        var value = height.Value;

        // The page's root stands in no row, so its bound value is sent under no keys.
        if (height.IsBind && (values is null || !values.TryGetValue(new UIPropertyAddress(region.RootComponentId, IVisualComponent.HeightProperty), out value)))
            return false;

        return RecursiveValueCoercion.TryCoerce(value, out UIResponsive<UILayoutLength> length) && length.Base.Kind == UILayoutLengthKind.Fill;
    }

    /// <summary>Whether a side holds a rail and nothing else (<see cref="UIMenuDisplay.Rail"/>).</summary>
    private static bool IsRailAlone(CompiledView view, string side)
        => SideMenu(view, side) is UIComponentNode menu
            && view.State.TryGetValue(menu.ComponentId, MenuComponent.DisplayProperty, out CompiledUIPropertyValue? display)
            && display is { IsBind: false, Value: UIMenuDisplay.Rail };

    /// <summary>The menu a side holds and nothing else: the menu itself, or plain boxes each holding only the next, down to it.</summary>
    private static UIComponentNode? SideMenu(CompiledView view, string side)
    {
        if (view.FindRegion(side) is not CompiledRegion region)
            return null;

        UIComponentNode node = view.Graph.GetRequired(region.RootComponentId);

        while (SideWrapperTypeKeys.Contains(node.TypeKey))
        {
            if (OnlyHeld(node) is not UIComponentId held)
                return null;

            node = view.Graph.GetRequired(held);
        }

        return string.Equals(node.TypeKey, MenuComponent.ComponentTypeKey, StringComparison.Ordinal) ? node : null;
    }

    /// <summary>The one component a box holds, as a child or as its content region; none where it holds more, or anything else.</summary>
    private static UIComponentId? OnlyHeld(UIComponentNode node)
    {
        UIComponentId? held = null;

        foreach (UIComponentId child in node.Children)
        {
            if (held is not null && held != child)
                return null;

            held = child;
        }

        foreach (UIComponentSlot slot in node.Slots)
        {
            if (slot.Kind is not (UIComponentSlotKind.Child or UIComponentSlotKind.Region) || (held is not null && held != slot.RootComponentId))
                return null;

            held = slot.RootComponentId;
        }

        return held;
    }

    /// <summary>The sides a button of the view's own opens (<see cref="ButtonComponent{T}.OpensDrawer"/>).</summary>
    private static (bool Left, bool Right) OwnOpeners(CompiledView view)
        => DrawerOpeners.GetValue(view, static view =>
        {
            (bool Left, bool Right) openers = default;

            foreach (UIComponentState state in view.State.All)
            {
                if (!state.TryGet(ButtonComponent.OpensDrawerProperty, out CompiledUIPropertyValue? value) || value.IsBind)
                    continue;

                if (value.Value is UISide.Left)
                    openers.Left = true;
                else if (value.Value is UISide.Right)
                    openers.Right = true;
            }

            return new StrongBox<(bool Left, bool Right)>(openers);
        }).Value;

    private static string? ToggleHost(CompiledView view, bool leftDrawer, bool rightDrawer)
        => !leftDrawer && !rightDrawer ? null
            : view.FindRegion(RegionNames.Header) is not null ? RegionNames.Header
            : RegionNames.Content;

    /// <summary>What a region is in a screen reader's list of landmarks.</summary>
    private static string? LandmarkRole(CompiledView view, string key)
        => key switch
        {
            RegionNames.Header => "banner",
            RegionNames.Content => "main",
            RegionNames.Footer => "contentinfo",
            RegionNames.LeftSide => SideRole(view, key, view.Options.LeftSideLandmark),
            RegionNames.RightSide => SideRole(view, key, view.Options.RightSideLandmark),
            _ => null
        };

    /// <summary>A side's landmark: the page's navigation where it holds a menu alone, unless the view says what it is.</summary>
    private static string SideRole(CompiledView view, string side, UISideLandmark landmark)
        => landmark switch
        {
            UISideLandmark.Navigation => "navigation",
            UISideLandmark.Complementary => "complementary",
            _ => SideMenu(view, side) is null ? "complementary" : "navigation"
        };

    private static bool IsDrawer(string key, bool leftDrawer, bool rightDrawer)
        => (leftDrawer && string.Equals(key, RegionNames.LeftSide, StringComparison.Ordinal))
            || (rightDrawer && string.Equals(key, RegionNames.RightSide, StringComparison.Ordinal));

    /// <summary>The sides whose buttons a band carries, as its drawer toggles attribute lists them.</summary>
    private static string DrawerToggleSides(bool left, bool right)
        => (left, right) switch
        {
            (true, true) => RegionNames.LeftSide + " " + RegionNames.RightSide,
            (true, false) => RegionNames.LeftSide,
            _ => RegionNames.RightSide
        };

    /// <summary>The button that opens one side as a drawer; the stylesheet shows it only on a narrow screen, and draws its burger.</summary>
    private void RenderDrawerToggle(IHtmlElementBuilder section, string side, UIViewResolution resolution)
        => _ = section.Element("button", toggle =>
        {
            _ = toggle
                .Class(DrawerToggleClass)
                .Attribute("type", "button")
                .Attribute(WebAttributes.DrawerToggle, side)
                .Attribute("aria-expanded", "false")
                .Attribute("aria-controls", WebAttributes.DrawerId(side));

            WebWords.Write(_translator, resolution.Session.Language, toggle, "aria-label", UIStrings.SideOpen);
        });

    /// <summary>Renders the component a region or a dialog holds at its root, outside any item.</summary>
    private void RenderRoot(UIViewResolution viewResolution, UIComponentId rootId, IHtmlElementBuilder html, WebRenderMetadata metadata, IWebRenderValues? values)
    {
        UIComponentNode root = viewResolution.View.Graph.GetRequired(rootId);

        WebRenderContext context = new()
        {
            ViewResolution = viewResolution,
            Node = root,
            Parameters = [],
            Html = html,
            Renderer = this,
            Metadata = metadata,
            Translator = _translator,
            Theme = _theme,
            Temporal = _temporal,
            Values = values
        };

        context.Validate();

        _renderers.GetRequired(root.TypeKey).Render(context);
    }

    /// <summary>The width a centred panel with no width of its own is capped at, from the Sm tier up; below it the panel is the screen less a margin.</summary>
    private const string CenteredDialogWidthCap = "560px";

    /// <summary>
    /// Renders every declared dialog into the shell up front, closed; opening it is purely a client-side visibility flip.
    /// </summary>
    private void RenderDialogs(UIViewResolution viewResolution, HtmlContentBuilder html, WebRenderMetadata metadata, IWebRenderValues? values)
    {
        ArgumentNullException.ThrowIfNull(viewResolution);
        ArgumentNullException.ThrowIfNull(html);
        ArgumentNullException.ThrowIfNull(metadata);

        CompiledView view = viewResolution.View;

        for (var i = 0; i < view.Dialogs.Length; i++)
        {
            CompiledDialog dialog = view.Dialogs[i];

            _ = html.Element("div", layer =>
            {
                _ = layer
                    .Class("ui-dialog")
                    .Attribute(WebAttributes.Dialog, dialog.Key)
                    .Attribute("hidden");

                if (dialog.Modal)
                    _ = layer.Attribute(WebAttributes.DialogModal);

                if (dialog.CloseOnBackdrop)
                    _ = layer.Attribute(WebAttributes.DialogCloseBackdrop);

                if (dialog.CloseOnEscape)
                    _ = layer.Attribute(WebAttributes.DialogCloseEscape);

                // Render-time only, like the surface: the stylesheet lays the panel against the edge named.
                if (dialog.Placement != UIDialogPlacement.Center)
                    _ = layer.Attribute(WebAttributes.DialogPlacement, dialog.Placement.ToString().ToLowerInvariant());

                _ = layer.Element("div", backdrop => _ = backdrop
                    .Class("ui-dialog__backdrop")
                    .Attribute(WebAttributes.DialogBackdrop)
                );

                _ = layer.Element("div", surface =>
                {
                    _ = surface
                        .Class(WebClassNames.DialogSurface)
                        .Attribute("role", "dialog")
                        .Attribute("tabindex", "-1");

                    if (!string.IsNullOrWhiteSpace(dialog.Label))
                        WebWords.WriteText(_translator, viewResolution.Session.Language, surface, "aria-label", dialog.Label);

                    // Render-time only: a dialog is not a component, so a live patch has nothing to address.
                    if (dialog.Surface != UISurfaceStyle.Raised)
                        _ = surface.Attribute(DialogSurfaceAttribute, dialog.Surface.ToString().ToLowerInvariant());

                    RenderDialogLayout(dialog, surface);

                    // aria-modal only when the dialog truly traps interaction, or a reader is told the page is inert when it's not.
                    if (dialog.Modal)
                        _ = surface.Attribute("aria-modal", "true");

                    RenderRoot(viewResolution, dialog.RootComponentId, surface, metadata, values);
                });
            });
        }
    }

    /// <summary>
    /// The panel's place on the overlay, as responsive tiers; a centred panel with no set width is capped from Sm up, and below
    /// that the stylesheet makes it the screen minus a margin.
    /// </summary>
    private static void RenderDialogLayout(CompiledDialog dialog, IHtmlElementBuilder surface)
    {
        // A component's words, written as a component's are: Fill is the overlay's room less the panel's margins (ui-dialog.less).
        WriteDialogLength(surface, dialog.Width, WebResponsiveCss.WidthVariable, UIOrientation.Horizontal);
        WriteDialogLength(surface, dialog.MinWidth, WebResponsiveCss.MinWidthVariable, UIOrientation.Horizontal);
        WriteDialogLength(surface, dialog.MaxWidth, WebResponsiveCss.MaxWidthVariable, UIOrientation.Horizontal);
        WriteDialogLength(surface, dialog.Height, WebResponsiveCss.HeightVariable, UIOrientation.Vertical);
        WriteDialogLength(surface, dialog.MinHeight, WebResponsiveCss.MinHeightVariable, UIOrientation.Vertical);
        WriteDialogLength(surface, dialog.MaxHeight, WebResponsiveCss.MaxHeightVariable, UIOrientation.Vertical);

        if (dialog.Margin is UIResponsive<UIThickness> margin)
            WebResponsiveCss.WriteMargin(surface, margin);

        if (dialog.HorizontalAlignment is UIAlignment horizontal)
            _ = surface.Style("--ui-align-h", WebCssValues.Alignment(horizontal));

        if (dialog.VerticalAlignment is UIAlignment vertical)
            _ = surface.Style("--ui-align-v", WebCssValues.Alignment(vertical));

        // Written here, not in the stylesheet: a cap in the chain's default would clamp a width the author named.
        if (dialog.Placement == UIDialogPlacement.Center && dialog.Width is null && dialog.MaxWidth is null)
            _ = surface.Style(WebResponsiveCss.TierName(WebResponsiveCss.MaxWidthVariable, UIResponsiveTier.Sm), CenteredDialogWidthCap);
    }

    private static void WriteDialogLength(IHtmlElementBuilder surface, UIResponsive<UILayoutLength>? value, string cssVariableName, UIOrientation axis)
    {
        if (value is UIResponsive<UILayoutLength> responsive)
            WebResponsiveCss.WriteSize(surface, responsive, cssVariableName, axis);
    }

    public void RenderComponent(WebRenderContext parent, UIComponentId componentId)
    {
        ArgumentNullException.ThrowIfNull(parent);

        CompiledView view = parent.ViewResolution.View;
        UIComponentNode node = view.Graph.GetRequired(componentId);

        WebRenderContext context = parent.ForNode(node, parent.Html);

        IWebComponentRenderer renderer = _renderers.GetRequired(node.TypeKey);

        renderer.Render(context);
    }
}
