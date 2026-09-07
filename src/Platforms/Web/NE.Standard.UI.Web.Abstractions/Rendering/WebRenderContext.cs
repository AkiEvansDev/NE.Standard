using System;
using System.Collections.Generic;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderContext
{
    public required UIViewResolution ViewResolution { get; init; }

    public required UIComponentNode Node { get; init; }

    public required IReadOnlyList<UIDynamicParameterScope> Parameters { get; init; }

    public required IHtmlElementBuilder Html { get; init; }

    public required IWebViewRenderer Renderer { get; init; }

    public required WebRenderMetadata Metadata { get; init; }

    public required ITranslator Translator { get; init; }

    /// <summary>
    /// Translates <paramref name="key"/> for this session's language; the key itself when nothing translates it.
    /// </summary>
    public string Translate(string key)
        => Translator.Translate(ViewResolution.Session.Language, key) ?? key;

    /// <summary>
    /// This session's values, when the render is painting them rather than leaving them to the client — see <see cref="IWebRenderValues"/>.
    /// </summary>
    public IWebRenderValues? Values { get; init; }

    /// <summary>
    /// Whether this subtree is a copy shown somewhere else, rather than the component itself; carries no identity of its own.
    /// </summary>
    public bool IsPresentationCopy { get; init; }

    public WebRenderContext ForHtml(IHtmlElementBuilder html)
        => new()
        {
            ViewResolution = ViewResolution,
            Node = Node,
            Parameters = Parameters,
            Html = html,
            Renderer = Renderer,
            Metadata = Metadata,
            Translator = Translator,
            Values = Values,
            IsPresentationCopy = IsPresentationCopy
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
            Translator = Translator,
            Values = Values,
            IsPresentationCopy = IsPresentationCopy
        };

    /// <summary>Renders into <paramref name="html"/> as a picture of a component — see <see cref="IsPresentationCopy"/>.</summary>
    public WebRenderContext AsPresentationCopy(IHtmlElementBuilder html)
        => new()
        {
            ViewResolution = ViewResolution,
            Node = Node,
            Parameters = Parameters,
            Html = html,
            Renderer = Renderer,
            Metadata = Metadata,
            Translator = Translator,
            Values = Values,
            IsPresentationCopy = true
        };

    public WebRenderContext WithParameters(IReadOnlyList<UIDynamicParameterScope> parameters)
        => new()
        {
            ViewResolution = ViewResolution,
            Node = Node,
            Parameters = parameters,
            Html = Html,
            Renderer = Renderer,
            Metadata = Metadata,
            Translator = Translator,
            Values = Values,
            IsPresentationCopy = IsPresentationCopy
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
