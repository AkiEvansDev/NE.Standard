using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>
/// Draws the language switcher: one press in the button's look showing the page's language — its two-letter code by default, with
/// no chevron whatever it does — and the list of the languages it offers, each named in itself.
/// </summary>
/// <remarks>
/// <c>language-switcher-engine.ts</c> switches on a press where there are two languages and opens the list where there are more;
/// the list is drawn for two as well, since the engine reads the other one from it. With one language nothing is drawn inside the
/// root, which the stylesheet hides. A page in a language the switcher does not offer names none of its own as current: the button
/// shows the page's language as a label that is never a choice.
/// </remarks>
public sealed class LanguageSwitcherComponentRenderer : WebComponentRendererBase
{
    /// <summary>The press the engine switches or opens the list from.</summary>
    public const string TriggerClassName = "ui-language-switcher__trigger";

    /// <summary>What the press shows for the page's language: every offered language's words stacked, the current one shown.</summary>
    public const string LabelClassName = "ui-language-switcher__label";

    /// <summary>One language's words inside the label; the page's own carries <see cref="CurrentLabelClassName"/>.</summary>
    public const string LabelTextClassName = "ui-language-switcher__label-text";

    /// <summary>The label text of the language the page is in, the one shown.</summary>
    public const string CurrentLabelClassName = "ui-language-switcher__label-text--current";

    /// <summary>A language the page may be in but the switcher does not offer: a label shown only while it is the page's, never a choice.</summary>
    public const string PageLabelClassName = "ui-language-switcher__label-text--page";

    /// <summary>The list of the offered languages, opened where there are more than two.</summary>
    public const string MenuClassName = "ui-language-switcher__menu";

    /// <summary>One language in the list, named in itself.</summary>
    public const string ChoiceClassName = "ui-language-switcher__choice";

    /// <summary>A switcher with one language to offer, which has nothing to switch and is not shown.</summary>
    public const string SingleClassName = "ui-language-switcher--single";

    // A language's own name is the same on every page, and a culture lookup is not free.
    private static readonly ConcurrentDictionary<string, string> NativeNames = new(StringComparer.Ordinal);

    public override string ComponentTypeKey => LanguageSwitcherComponent.ComponentTypeKey;

    // A span, not a button: a button may not contain the press and the list's own buttons.
    protected override string ElementName => "span";

    protected override string ClassName => "ui-language-switcher";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class(WebClassNames.Button);

        IReadOnlyList<string> languages = ResolveLanguages(context);
        var current = ResolveCurrent(context);
        UILanguageDisplay display = ReadRenderValue<UILanguageDisplay?>(context, LanguageSwitcherComponent.DisplayProperty, null) ?? UILanguageDisplay.Code;

        // The engine's hook, a marker rather than the class, and what the button shows for a language.
        _ = root.Attribute(WebAttributes.LanguageSwitcher, display == UILanguageDisplay.Name ? "name" : "code");

        SwitcherChromeRenderer.RenderChrome(context, root);

        if (languages.Count < 2)
        {
            _ = root.Class(SingleClassName);
            return;
        }

        var opensList = languages.Count > 2;

        _ = root.Element("button", trigger =>
        {
            _ = trigger.Class(TriggerClassName);
            _ = trigger.Attribute("type", "button");

            // The page's language by its name and the code the button shows (WCAG 2.5.3, the label in the name), and with two the one a
            // press switches to, the same way.
            if (opensList)
            {
                WebWords.Write(context, trigger, "aria-label", UIStrings.LanguageCurrent, new Dictionary<string, object?>(StringComparer.Ordinal)
                {
                    ["language"] = NativeName(current),
                    ["code"] = Code(current)
                });
                RenderPopupTrigger(trigger, "menu");
            }
            else
            {
                WebWords.Write(context, trigger, "aria-label", UIStrings.LanguageSwitch, new Dictionary<string, object?>(StringComparer.Ordinal)
                {
                    ["language"] = NativeName(current),
                    ["code"] = Code(current),
                    ["other"] = NativeName(ToggleTarget(languages, current)),
                    ["otherCode"] = Code(ToggleTarget(languages, current))
                });
            }

            _ = trigger.Element("span", icon =>
            {
                _ = icon.Class("ui-language-switcher__icon");
                _ = icon.Class("ui-icon");

                SwitcherChromeRenderer.RenderGlyph(context, icon, LanguageSwitcherComponent.IconProperty);
            });

            RenderLabel(trigger, languages, PageOnlyLanguages(context, languages, current), current, display);
        });

        RenderChoices(root, languages, current);
    }

    /// <summary>The languages offered: the author's, in the author's order, as far as the translator lists them; else the translator's.</summary>
    private static IReadOnlyList<string> ResolveLanguages(WebRenderContext context)
    {
        IReadOnlyList<string> listed = context.Translator.Languages;
        IReadOnlyList<string>? chosen = ReadRenderValue<IReadOnlyList<string>?>(context, LanguageSwitcherComponent.LanguagesProperty, null);

        if (chosen is null || chosen.Count == 0)
            return listed;

        List<string> offered = new(chosen.Count);

        foreach (var language in chosen)
        {
            if (!string.IsNullOrWhiteSpace(language) && context.Translator.HasLanguage(language) && !offered.Contains(language))
                offered.Add(language);
        }

        return offered;
    }

    /// <summary>The page's language: the session's, else the translator's default — offered by this switcher or not.</summary>
    private static string ResolveCurrent(WebRenderContext context)
    {
        var session = context.ViewResolution.Session.Language;

        return string.IsNullOrWhiteSpace(session) ? context.Translator.DefaultLanguage : session;
    }

    /// <summary>What a press on a two-language switcher asks for: the other language, or the first where the page is in neither.</summary>
    private static string ToggleTarget(IReadOnlyList<string> languages, string current)
        => string.Equals(languages[0], current, StringComparison.Ordinal) ? languages[1] : languages[0];

    /// <summary>The languages the page may be in — the translator's and the page's own — that this switcher does not offer.</summary>
    private static List<string> PageOnlyLanguages(WebRenderContext context, IReadOnlyList<string> languages, string current)
    {
        List<string> pageOnly = [];

        foreach (var language in context.Translator.Languages)
        {
            if (!Contains(languages, language) && !pageOnly.Contains(language))
                pageOnly.Add(language);
        }

        if (!Contains(languages, current) && !pageOnly.Contains(current))
            pageOnly.Add(current);

        return pageOnly;
    }

    private static bool Contains(IReadOnlyList<string> languages, string language)
    {
        for (var i = 0; i < languages.Count; i++)
        {
            if (string.Equals(languages[i], language, StringComparison.Ordinal))
                return true;
        }

        return false;
    }

    /// <summary>
    /// Every offered language's words stacked in one place, only the page's shown: the button is as wide as its widest language, so
    /// a switch never moves what stands beside it. A language it does not offer is there too, hidden, taking no room while not the page's.
    /// </summary>
    private static void RenderLabel(IHtmlElementBuilder trigger, IReadOnlyList<string> languages, IReadOnlyList<string> pageOnly, string current, UILanguageDisplay display)
        => _ = trigger.Element("span", label =>
        {
            _ = label.Class(LabelClassName);

            foreach (var language in languages)
                RenderLabelText(label, language, current, display, pageOnly: false);

            foreach (var language in pageOnly)
                RenderLabelText(label, language, current, display, pageOnly: true);
        });

    private static void RenderLabelText(IHtmlElementBuilder label, string language, string current, UILanguageDisplay display, bool pageOnly)
        => _ = label.Element("span", text =>
        {
            var isCurrent = string.Equals(language, current, StringComparison.Ordinal);

            _ = text.Class(LabelTextClassName);

            if (isCurrent)
                _ = text.Class(CurrentLabelClassName);

            if (pageOnly)
            {
                _ = text.Class(PageLabelClassName);

                if (!isCurrent)
                    _ = text.Attribute("hidden");
            }

            _ = text.Attribute(WebAttributes.Language, language);
            _ = text.Text(DisplayText(language, display));
        });

    /// <summary>What the button shows for a language: its two-letter code, or its own name.</summary>
    private static string DisplayText(string language, UILanguageDisplay display)
        => display == UILanguageDisplay.Name ? NativeName(language) : Code(language);

    /// <summary>A language's two-letter code upper-cased: the language before any script or region ("ZH" for zh-Hans).</summary>
    private static string Code(string language)
    {
        var end = language.IndexOf('-', StringComparison.Ordinal);

        return (end < 0 ? language : language[..end]).ToUpperInvariant();
    }

    /// <summary>
    /// A language's own name for itself, capitalised as a name standing alone is; its code where the runtime knows no culture by
    /// it (invariant globalisation).
    /// </summary>
    private static string NativeName(string language)
        => NativeNames.GetOrAdd(language, static code =>
        {
            try
            {
                CultureInfo culture = CultureInfo.GetCultureInfo(code);
                var name = culture.NativeName;

                if (string.IsNullOrWhiteSpace(name) || culture.Equals(CultureInfo.InvariantCulture))
                    return code;

                return string.Concat(culture.TextInfo.ToUpper(name[0]).ToString(), name.AsSpan(1));
            }
            catch (CultureNotFoundException)
            {
                return code;
            }
        });

    /// <summary>
    /// The list, a menu of one choice per language, the page's own checked; inside the root, like a split button's, so the
    /// component's inert and its closest() paths hold.
    /// </summary>
    private static void RenderChoices(IHtmlElementBuilder root, IReadOnlyList<string> languages, string current)
        => _ = root.Element("div", menu =>
        {
            _ = menu.Class(MenuClassName);
            _ = menu.Attribute("role", "menu");
            _ = menu.Attribute(WebAttributes.EventBoundary);

            foreach (var language in languages)
            {
                _ = menu.Element("button", choice =>
                {
                    _ = choice.Class(ChoiceClassName);
                    _ = choice.Attribute("type", "button");
                    _ = choice.Attribute("role", "menuitemradio");
                    _ = choice.Attribute("tabindex", "-1");
                    _ = choice.Attribute("aria-checked", string.Equals(language, current, StringComparison.Ordinal) ? "true" : "false");
                    _ = choice.Attribute(WebAttributes.Language, language);
                    // Named in itself, so a reader's voice reads it in its own language.
                    _ = choice.Attribute("lang", language);
                    _ = choice.Text(NativeName(language));
                });
            }
        });
}
