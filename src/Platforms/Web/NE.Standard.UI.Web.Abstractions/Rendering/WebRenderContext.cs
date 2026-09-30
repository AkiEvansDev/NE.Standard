using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Primitives.Localization;
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

    /// <summary>The application's theme, for a renderer that writes what the theme's own stylesheet cannot say — the length of the series run.</summary>
    public required UITheme Theme { get; init; }

    /// <summary>The application's dates and times, for a field with no pattern of its own; none is the framework's canonical patterns.</summary>
    public UITemporalOptions? Temporal { get; init; }

    /// <summary>
    /// Translates <paramref name="key"/> for this session's language; the key itself when nothing translates it.
    /// </summary>
    public string Translate(string key)
        => Translator.Translate(ViewResolution.Session.Language, key) ?? key;

    /// <summary>
    /// Translates <paramref name="key"/> for this session's language and fills its <c>{name}</c> slots from
    /// <paramref name="arguments"/>; a numeric <c>count</c> picks the key's plural form.
    /// </summary>
    public string Translate(string key, IReadOnlyDictionary<string, object?>? arguments)
        => Translator.Translate(ViewResolution.Session.Language, key, arguments) ?? key;

    /// <summary>Translates a phrase — its key with its arguments — for this session's language; an author's text as a plain value.</summary>
    public string Translate(UIPhrase phrase)
    {
        ArgumentNullException.ThrowIfNull(phrase);

        return phrase.IsText ? Translate(phrase.Key) : Translate(phrase.Key, phrase.Arguments);
    }

    /// <summary>
    /// This session's values, when the render is painting them rather than leaving them to the client — see <see cref="IWebRenderValues"/>.
    /// </summary>
    public IWebRenderValues? Values { get; init; }

    /// <summary>
    /// Whether this subtree is a copy shown somewhere else, rather than the component itself; carries no identity of its own.
    /// </summary>
    public bool IsPresentationCopy { get; init; }

    /// <summary>
    /// Whether this subtree is a template the client clones, once per use: every identity is kept, but nothing that must be unique
    /// on the page — an element id — is written.
    /// </summary>
    public bool IsTemplate { get; init; }

    /// <summary>
    /// Whether this subtree is a popup menu's content — a right-click menu's, named or not — whose entries are menu items to a
    /// screen reader.
    /// </summary>
    public bool IsPopupMenu { get; init; }

    public WebRenderContext ForHtml(IHtmlElementBuilder html)
        => Copy(Node, Parameters, html, IsPresentationCopy, IsTemplate, IsPopupMenu);

    public WebRenderContext ForNode(UIComponentNode node, IHtmlElementBuilder html)
        => Copy(node, Parameters, html, IsPresentationCopy, IsTemplate, IsPopupMenu);

    /// <summary>Renders into <paramref name="html"/> as a picture of a component — see <see cref="IsPresentationCopy"/>.</summary>
    public WebRenderContext AsPresentationCopy(IHtmlElementBuilder html)
        => Copy(Node, Parameters, html, isPresentationCopy: true, IsTemplate, IsPopupMenu);

    /// <summary>Renders into <paramref name="html"/> as a template the client clones — see <see cref="IsTemplate"/>.</summary>
    public WebRenderContext AsTemplate(IHtmlElementBuilder html)
        => Copy(Node, Parameters, html, IsPresentationCopy, isTemplate: true, IsPopupMenu);

    /// <summary>Renders into <paramref name="html"/> as a popup menu's content — see <see cref="IsPopupMenu"/>.</summary>
    public WebRenderContext AsPopupMenu(IHtmlElementBuilder html)
        => Copy(Node, Parameters, html, IsPresentationCopy, IsTemplate, isPopupMenu: true);

    public WebRenderContext WithParameters(IReadOnlyList<UIDynamicParameterScope> parameters)
        => Copy(Node, parameters, Html, IsPresentationCopy, IsTemplate, IsPopupMenu);

    // The one place every member is carried over, so a member added later cannot be dropped by one of the copies.
    private WebRenderContext Copy(UIComponentNode node, IReadOnlyList<UIDynamicParameterScope> parameters, IHtmlElementBuilder html, bool isPresentationCopy, bool isTemplate, bool isPopupMenu)
        => new()
        {
            ViewResolution = ViewResolution,
            Node = node,
            Parameters = parameters,
            Html = html,
            Renderer = Renderer,
            Metadata = Metadata,
            Translator = Translator,
            Theme = Theme,
            Temporal = Temporal,
            Values = Values,
            IsPresentationCopy = isPresentationCopy,
            IsTemplate = isTemplate,
            IsPopupMenu = isPopupMenu
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
        ArgumentNullException.ThrowIfNull(Theme);

        ViewResolution.Validate();
    }
}
