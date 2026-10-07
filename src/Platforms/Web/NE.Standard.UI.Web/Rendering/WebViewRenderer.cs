using System;
using System.Collections.Frozen;
using System.Runtime.CompilerServices;
using Microsoft.Extensions.Hosting;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
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
    private const string DialogPlacementAttribute = "data-ui-dialog-placement";
    private const string DialogSurfaceAttribute = "data-ui-dialog-surface";
    private const string DrawerToggleClass = "ui-shell__drawer-toggle";
    private const string SkipLinkClass = "ui-shell__skip-link";

    // The content region's id where a skip link points at it: the link's own address, which the client follows without touching the page's.
    private const string ContentElementId = "ui-content";

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
        var railAlone = view.Options.SideDrawers && IsRailAlone(view, RegionNames.LeftSide);
        var bottomBar = railAlone && view.Options.RailBottomBar;
        var railDrawer = railAlone && !view.Options.RailBottomBar;
        var leftDrawer = !bottomBar && HasRegion(view, RegionNames.LeftSide);
        var rightDrawer = HasRegion(view, RegionNames.RightSide);
        // A side the page opens by a button of its own gets none of the shell's, so a header collapsed on a phone leaves no band for it.
        (var leftOpener, var rightOpener) = OwnOpeners(view);
        var leftToggle = leftDrawer && !leftOpener;
        var rightToggle = rightDrawer && !rightOpener;
        // The band that carries the drawers' buttons: the header, or the content where a page has none.
        var toggles = view.Options.SideDrawers ? ToggleHost(view, leftToggle, rightToggle) : null;
        // A keyboard reader would otherwise Tab through the whole side, a sidebar menu's every entry, before reaching the page.
        var skipLink = HasRegion(view, RegionNames.LeftSide);

        if (skipLink)
            RenderSkipLink(html, viewResolution);

        for (var i = 0; i < view.Regions.Length; i++)
        {
            CompiledRegion region = view.Regions[i];

            _ = html.Element("section", section =>
            {
                _ = section.Attribute(WebAttributes.Region, region.Key);

                // A `section`, not `header`/`main`/`nav`, keeps the grid's rules; the role makes it a landmark.
                if (LandmarkRole(view, region.Key) is string role)
                    _ = section.Attribute("role", role);

                if (skipLink && string.Equals(region.Key, RegionNames.Content, StringComparison.Ordinal))
                    _ = section.Attribute("id", ContentElementId);

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

                if (carriesToggles && leftToggle)
                    RenderDrawerToggle(section, RegionNames.LeftSide, viewResolution);

                RenderRoot(viewResolution, region.RootComponentId, section, metadata, values);

                if (carriesToggles && rightToggle)
                    RenderDrawerToggle(section, RegionNames.RightSide, viewResolution);
            });
        }
    }

    /// <summary>Whether a side holds a rail and nothing else (<see cref="UIMenuDisplay.Rail"/>).</summary>
    private static bool IsRailAlone(CompiledView view, string side)
        => SideMenu(view, side) is UIComponentNode menu
            && view.State.TryGetValue(menu.ComponentId, MenuComponent.DisplayProperty, out CompiledUIPropertyValue? display)
            && display is { IsBind: false, Value: UIMenuDisplay.Rail };

    /// <summary>The menu a side holds and nothing else: the menu itself, or plain boxes each holding only the next, down to it.</summary>
    private static UIComponentNode? SideMenu(CompiledView view, string side)
    {
        if (FindRegion(view, side) is not CompiledRegion region)
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

    private static CompiledRegion? FindRegion(CompiledView view, string key)
    {
        foreach (CompiledRegion region in view.Regions)
        {
            if (string.Equals(region.Key, key, StringComparison.Ordinal))
                return region;
        }

        return null;
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

    private static bool HasRegion(CompiledView view, string key)
        => FindRegion(view, key) is not null;

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
            : HasRegion(view, RegionNames.Header) ? RegionNames.Header
            : RegionNames.Content;

    /// <summary>
    /// The page's first stop where a left side stands before the content: a link to the content region, seen only while it holds the
    /// keyboard, which skip-link-engine.ts follows by moving the keyboard there.
    /// </summary>
    private void RenderSkipLink(HtmlContentBuilder html, UIViewResolution resolution)
        => _ = html.Element("a", link =>
        {
            _ = link
                .Class(SkipLinkClass)
                .Attribute("href", "#" + ContentElementId)
                .Attribute(WebAttributes.SkipLink);

            WebWords.Write(_translator, resolution.Session.Language, link, null, UIStrings.SkipToContent);
        });

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
                    _ = layer.Attribute(DialogPlacementAttribute, dialog.Placement.ToString().ToLowerInvariant());

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
