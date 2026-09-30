using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text.Json;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// Writes a word the chrome shows for good — an <c>aria-label</c>, a caption — translated for the page, and marks it with its key
/// (<see cref="WebAttributes.Words"/>) so a language switch writes it again in place; the client's twin is <c>strings.write</c>.
/// </summary>
/// <remarks>
/// A word shown only for a moment (an open popup's, a toast's) needs no mark: it is written again the next time it shows. The mark is
/// <c>{"aria-label":["ui.tabs.more"],"#text":["ui.grid.page-of",{…}]}</c> — per attribute, or <c>#text</c> for the element's own text,
/// the key and its arguments; an author's plain text (<see cref="WriteText(WebRenderContext, IHtmlElementBuilder, string?, string)"/>)
/// is marked as the string itself.
/// </remarks>
public static class WebWords
{
    /// <summary>The mark's name for the element's own text, which only an element holding nothing but the word may take.</summary>
    public const string TextTarget = "#text";

    private static readonly JsonSerializerOptions JsonOptions = WebWireJson.CreateOptions();

    // Every word written on one element so far, so a second word on it joins the mark rather than replacing it.
    private static readonly ConditionalWeakTable<IHtmlElementBuilder, Dictionary<string, object>> Marks = [];

    /// <summary>
    /// Writes <paramref name="key"/>'s words for the page's language on <paramref name="attribute"/>, or as the element's text when it
    /// is <see langword="null"/>, filled from <paramref name="arguments"/> — a moment as its first paint in the application's patterns —
    /// and marks it.
    /// </summary>
    public static void Write(WebRenderContext context, IHtmlElementBuilder element, string? attribute, string key, IReadOnlyDictionary<string, object?>? arguments = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(element);
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        WriteMarked(element, attribute, context.Translate(key, arguments), Mark(key, arguments));
    }

    /// <summary>The mark of a key's words: <c>[key]</c>, or <c>[key, arguments]</c> with each moment in a moment's shape.</summary>
    private static object[] Mark(string key, IReadOnlyDictionary<string, object?>? arguments)
        => arguments is null || arguments.Count == 0 ? [key] : [key, WebMoments.ForWire(arguments)!];

    /// <summary>
    /// Writes and marks a word where no render context is at hand — the shell's own chrome — for <paramref name="language"/>; a moment
    /// in the canonical patterns, until the page writes it.
    /// </summary>
    public static void Write(ITranslator translator, string language, IHtmlElementBuilder element, string? attribute, string key, IReadOnlyDictionary<string, object?>? arguments = null)
    {
        ArgumentNullException.ThrowIfNull(translator);
        ArgumentNullException.ThrowIfNull(element);
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        WriteMarked(element, attribute, translator.Translate(language, key, arguments) ?? key, Mark(key, arguments));
    }

    /// <summary>
    /// Writes an author's text — a column's caption, a dialog's label — translated as a plain value is (a key only where the
    /// application's prefixes say so), and marks it, so a language switch writes it again.
    /// </summary>
    public static void WriteText(WebRenderContext context, IHtmlElementBuilder element, string? attribute, string text)
    {
        ArgumentNullException.ThrowIfNull(context);

        WriteText(context.Translator, context.ViewResolution.Session.Language, element, attribute, text);
    }

    /// <summary>Writes and marks an author's text where no render context is at hand, for <paramref name="language"/>.</summary>
    public static void WriteText(ITranslator translator, string language, IHtmlElementBuilder element, string? attribute, string text)
    {
        ArgumentNullException.ThrowIfNull(translator);
        ArgumentNullException.ThrowIfNull(element);
        ArgumentException.ThrowIfNullOrWhiteSpace(text);

        WriteMarked(element, attribute, translator.Translate(language, text) ?? text, text);
    }

    /// <summary>
    /// Writes the words and joins the element's mark: a key as <c>[key]</c> or <c>[key, arguments]</c>, a plain value as itself.
    /// </summary>
    private static void WriteMarked(IHtmlElementBuilder element, string? attribute, string words, object mark)
    {
        if (attribute is null)
            _ = element.Text(words);
        else
            _ = element.Attribute(attribute, words);

        Dictionary<string, object> marks = Marks.GetOrCreateValue(element);

        marks[attribute ?? TextTarget] = mark;

        _ = element.Attribute(WebAttributes.Words, JsonSerializer.Serialize(marks, JsonOptions));
    }
}
