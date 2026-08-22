using System;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Html;

namespace NE.Standard.UI.Web.Rendering;

internal sealed class WebViewRenderer : IWebViewRenderer
{
    private readonly IWebRendererRegistry _renderers;
    private readonly ITranslator _translator;

    public WebViewRenderer(IWebRendererRegistry renderers, UIApplication application)
    {
        ArgumentNullException.ThrowIfNull(renderers);
        ArgumentNullException.ThrowIfNull(application);

        _renderers = renderers;
        _translator = application.Translator;
    }

    public WebRenderResult Render(UIViewResolution resolution)
    {
        ArgumentNullException.ThrowIfNull(resolution);

        resolution.Validate();

        HtmlContentBuilder html = new();
        WebRenderMetadata metadata = new();

        RenderRegions(resolution, html, metadata);
        RenderDialogs(resolution, html, metadata);

        WebRenderResult result = new()
        {
            Content = html,
            Metadata = metadata
        };

        result.Validate();

        return result;
    }

    private void RenderRegions(UIViewResolution viewResolution, HtmlContentBuilder html, WebRenderMetadata metadata)
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
                _ = section.Attribute("data-ui-region", region.Key);

                // On the region rather than on the root: sticking is a property of this band of the page, and
                // the shell has no idea which regions the view even declared.
                if (view.Options.StickyHeader && string.Equals(region.Key, RegionNames.Header, StringComparison.Ordinal))
                    _ = section.Attribute("data-ui-sticky");

                UIComponentNode root = view.Graph.GetRequired(region.RootComponentId);

                WebRenderContext context = new()
                {
                    ViewResolution = viewResolution,
                    Node = root,
                    Parameters = [],
                    Html = section,
                    Renderer = this,
                    Metadata = metadata,
                    Translator = _translator
                };

                context.Validate();

                IWebComponentRenderer renderer = _renderers.GetRequired(root.TypeKey);

                renderer.Render(context);
            });
        }
    }

    /// <summary>
    /// Renders every declared dialog into the shell up front, closed. A dialog's content is ordinary
    /// compiled components, so its bindings, events and live updates travel the same channels the rest of
    /// the view does — opening it is purely a client-side visibility flip (see <c>DialogEngine</c>), not a
    /// render. That is what lets a bound value inside a dialog already be correct the moment it opens.
    /// </summary>
    private void RenderDialogs(UIViewResolution viewResolution, HtmlContentBuilder html, WebRenderMetadata metadata)
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
                    .Attribute("data-ui-dialog", dialog.Key)
                    .Attribute("hidden");

                if (dialog.Modal)
                    _ = layer.Attribute("data-ui-dialog-modal");

                if (dialog.CloseOnBackdrop)
                    _ = layer.Attribute("data-ui-dialog-close-backdrop");

                if (dialog.CloseOnEscape)
                    _ = layer.Attribute("data-ui-dialog-close-escape");

                _ = layer.Element("div", backdrop => _ = backdrop
                    .Class("ui-dialog__backdrop")
                    .Attribute("data-ui-dialog-backdrop")
                );

                _ = layer.Element("div", surface =>
                {
                    _ = surface
                        .Class("ui-dialog__surface")
                        .Attribute("role", "dialog")
                        .Attribute("tabindex", "-1");

                    // Render-time only: what a dialog is made of is decided when it is declared, and a live
                    // patch has nothing to address — a dialog is not a component.
                    if (dialog.Surface != UIDialogSurface.Card)
                        _ = surface.Attribute("data-ui-dialog-surface", dialog.Surface.ToString().ToLowerInvariant());

                    // aria-modal only when the dialog genuinely traps interaction — announcing it on a
                    // non-modal dialog tells a screen reader the rest of the page is inert when it is not.
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
                        Translator = _translator
                    };

                    context.Validate();

                    IWebComponentRenderer renderer = _renderers.GetRequired(root.TypeKey);

                    renderer.Render(context);
                });
            });
        }
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
