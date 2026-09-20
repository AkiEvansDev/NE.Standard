using System;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
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
    // Read by the stylesheet alone, so a named constant here rather than one in WebAttributes, which holds what the client script reads.
    private const string RegionAttribute = "data-ui-region";
    private const string StickyAttribute = "data-ui-sticky";
    private const string DialogPlacementAttribute = "data-ui-dialog-placement";
    private const string DialogSurfaceAttribute = "data-ui-dialog-surface";

    private readonly IWebRendererRegistry _renderers;
    private readonly ITranslator _translator;
    private readonly UITheme _theme;

    public WebViewRenderer(IWebRendererRegistry renderers, UIApplication application)
    {
        ArgumentNullException.ThrowIfNull(renderers);
        ArgumentNullException.ThrowIfNull(application);

        _renderers = renderers;
        _translator = application.Translator;
        _theme = application.Theme;
    }

    public WebRenderResult Render(UIViewResolution resolution, IWebRenderValues? values = null)
    {
        ArgumentNullException.ThrowIfNull(resolution);

        resolution.Validate();

        HtmlContentBuilder html = new();
        WebRenderMetadata metadata = new();

        RenderRegions(resolution, html, metadata, values);
        RenderDialogs(resolution, html, metadata, values);

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

        for (var i = 0; i < view.Regions.Length; i++)
        {
            CompiledRegion region = view.Regions[i];

            _ = html.Element("section", section =>
            {
                _ = section.Attribute(RegionAttribute, region.Key);

                // On the region rather than on the root: sticking is a property of this band of the page.
                if (view.Options.StickyHeader && string.Equals(region.Key, RegionNames.Header, StringComparison.Ordinal))
                    _ = section.Attribute(StickyAttribute);

                UIComponentNode root = view.Graph.GetRequired(region.RootComponentId);

                WebRenderContext context = new()
                {
                    ViewResolution = viewResolution,
                    Node = root,
                    Parameters = [],
                    Html = section,
                    Renderer = this,
                    Metadata = metadata,
                    Translator = _translator,
                    Theme = _theme,
                    Values = values
                };

                context.Validate();

                IWebComponentRenderer renderer = _renderers.GetRequired(root.TypeKey);

                renderer.Render(context);
            });
        }
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
                        .Class("ui-dialog__surface")
                        .Attribute("role", "dialog")
                        .Attribute("tabindex", "-1");

                    // Render-time only: a dialog is not a component, so a live patch has nothing to address.
                    if (dialog.Surface != UISurfaceStyle.Raised)
                        _ = surface.Attribute(DialogSurfaceAttribute, dialog.Surface.ToString().ToLowerInvariant());

                    RenderDialogLayout(dialog, surface);

                    // aria-modal only when the dialog truly traps interaction, or a reader is told the page is inert when it's not.
                    if (dialog.Modal)
                        _ = surface.Attribute("aria-modal", "true");

                    UIComponentNode root = view.Graph.GetRequired(dialog.RootComponentId);

                    WebRenderContext context = new()
                    {
                        ViewResolution = viewResolution,
                        Node = root,
                        Parameters = [],
                        Html = surface,
                        Renderer = this,
                        Metadata = metadata,
                        Translator = _translator,
                        Theme = _theme,
                        Values = values
                    };

                    context.Validate();

                    IWebComponentRenderer renderer = _renderers.GetRequired(root.TypeKey);

                    renderer.Render(context);
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
        WriteDialogLength(surface, dialog.Width, "--ui-width");
        WriteDialogLength(surface, dialog.MinWidth, "--ui-min-width");
        WriteDialogLength(surface, dialog.MaxWidth, "--ui-max-width");
        WriteDialogLength(surface, dialog.Height, "--ui-height");
        WriteDialogLength(surface, dialog.MinHeight, "--ui-min-height");
        WriteDialogLength(surface, dialog.MaxHeight, "--ui-max-height");

        if (dialog.Margin is UIResponsive<UIThickness> margin)
            WebResponsiveCss.WriteTiers(surface, margin, "--ui-margin", WebCssValues.Thickness);

        if (dialog.HorizontalAlignment is UIAlignment horizontal)
            _ = surface.Style("--ui-align-h", WebCssValues.Alignment(horizontal));

        if (dialog.VerticalAlignment is UIAlignment vertical)
            _ = surface.Style("--ui-align-v", WebCssValues.Alignment(vertical));

        // Written here, not in the stylesheet: a cap in the chain's default would clamp a width the author named.
        if (dialog.Placement == UIDialogPlacement.Center && dialog.Width is null && dialog.MaxWidth is null)
            _ = surface.Style("--ui-max-width-sm", CenteredDialogWidthCap);
    }

    private static void WriteDialogLength(IHtmlElementBuilder surface, UIResponsive<UILayoutLength>? value, string cssVariableName)
    {
        if (value is UIResponsive<UILayoutLength> responsive)
            WebResponsiveCss.WriteTiers(surface, responsive, cssVariableName, WebCssValues.ResponsiveLayoutLength);
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
