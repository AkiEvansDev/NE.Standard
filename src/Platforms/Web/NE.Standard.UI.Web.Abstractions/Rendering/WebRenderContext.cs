using System;
using System.Collections.Generic;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderContext
{
    public required UIViewResolution ViewResolution { get; init; }

    public required UIComponentNode Node { get; init; }

    public required IReadOnlyList<WebDynamicParameterScope> Parameters { get; init; }

    public required IHtmlElementBuilder Html { get; init; }

    public required IWebViewRenderer Renderer { get; init; }

    public required WebRenderMetadata Metadata { get; init; }

    public required ITranslator Translator { get; init; }

    public WebRenderContext ForHtml(IHtmlElementBuilder html)
        => new()
        {
            ViewResolution = ViewResolution,
            Node = Node,
            Parameters = Parameters,
            Html = html,
            Renderer = Renderer,
            Metadata = Metadata,
            Translator = Translator
        };

    public WebRenderContext ForNode(UIComponentNode node, IHtmlElementBuilder html)
        => new()
        {
            ViewResolution = ViewResolution,
            Node = node,
            Parameters = Parameters,
            Html = html,
            Renderer = Renderer,
            Metadata = Metadata,
            Translator = Translator
        };

    public WebRenderContext WithParameters(IReadOnlyList<WebDynamicParameterScope> parameters)
        => new()
        {
            ViewResolution = ViewResolution,
            Node = Node,
            Parameters = parameters,
            Html = Html,
            Renderer = Renderer,
            Metadata = Metadata,
            Translator = Translator
        };

    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(ViewResolution);
        ArgumentNullException.ThrowIfNull(Node);
        ArgumentNullException.ThrowIfNull(Parameters);
        ArgumentNullException.ThrowIfNull(Html);
        ArgumentNullException.ThrowIfNull(Renderer);
        ArgumentNullException.ThrowIfNull(Metadata);
        ArgumentNullException.ThrowIfNull(Translator);

        ViewResolution.Validate();
    }
}
