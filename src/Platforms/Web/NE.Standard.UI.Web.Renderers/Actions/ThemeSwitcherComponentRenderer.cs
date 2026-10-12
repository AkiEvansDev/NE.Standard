using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>
/// Draws the theme switcher as a button carrying both glyphs, or as a settings form's field offering Light, Dark and System.
/// </summary>
/// <remarks>
/// The shell markup is cached across themes, so neither shape says which theme the page is in: the stylesheet picks the button's glyph,
/// and the page marks the field's current choice (<c>theme-switcher-engine.ts</c>, as the body is parsed and on every switch).
/// </remarks>
public sealed class ThemeSwitcherComponentRenderer : ButtonRendererBase
{
    /// <summary>The field's list of the three themes, a listbox.</summary>
    public const string MenuClassName = "ui-theme-switcher__menu";

    /// <summary>One theme in the field's list.</summary>
    public const string ChoiceClassName = "ui-theme-switcher__choice";

    /// <summary>What the field's box shows: every theme's words stacked, the current one shown.</summary>
    public const string LabelClassName = "ui-theme-switcher__label";

    /// <summary>One theme's words inside the label; the page marks the current one.</summary>
    public const string LabelTextClassName = "ui-theme-switcher__label-text";

    // The field's choices: the theme as the root's `data-ui-theme` spells it, and its word.
    private static readonly (string Theme, string Key)[] FieldChoices =
    [
        (WebCssValues.ThemeName(UIThemeMode.Light), UIStrings.ThemeLight),
        (WebCssValues.ThemeName(UIThemeMode.Dark), UIStrings.ThemeDark),
        (WebCssValues.RootThemeName(null), UIStrings.ThemeSystem)
    ];

    public override string ComponentTypeKey => ThemeSwitcherComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Button;

    // A span for the field, which holds its box's button and the list's.
    protected override (string ElementName, string ClassName) ResolveRoot(WebRenderContext context)
        => SwitcherChromeRenderer.IsField(context) ? ("span", SwitcherChromeRenderer.FieldClassName) : base.ResolveRoot(context);

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        if (SwitcherChromeRenderer.IsField(context))
        {
            SwitcherChromeRenderer.RenderField(context, root, WebAttributes.ThemeSwitcher, UIStrings.ThemeField, trigger => RenderFieldLabel(context, trigger), list => RenderFieldChoices(context, list));
            return;
        }

        _ = root.Class("ui-theme-switcher");

        // The engine's hook is a marker attribute, not the class: a class is styling.
        _ = root.Attribute(WebAttributes.ThemeSwitcher);
        _ = root.Attribute("type", "button");

        // Two glyphs and no words: without this the switcher is a button a reader is told nothing about.
        WebWords.Write(context, root, "aria-label", UIStrings.ThemeSwitch);

        SwitcherChromeRenderer.RenderChrome(context, root);

        // Named on hover as every glyph-only button is: by its own words where the author gives it no tooltip.
        if (ResolveRenderValue(context, ITooltipComponent.TooltipProperty, out string? tooltip, out _) != WebRenderValueKind.Binding && string.IsNullOrWhiteSpace(tooltip))
            WebWords.Write(context, root, WebAttributes.Tooltip, UIStrings.ThemeSwitch);

        RenderGlyph(context, root, "light", ThemeSwitcherComponent.LightIconProperty);
        RenderGlyph(context, root, "dark", ThemeSwitcherComponent.DarkIconProperty);
    }

    /// <summary>Every theme's word stacked in the box, so it keeps one width as the theme changes; the page marks the current one.</summary>
    private static void RenderFieldLabel(WebRenderContext context, IHtmlElementBuilder trigger)
        => _ = trigger.Element("span", label =>
        {
            _ = label.Class(LabelClassName);

            foreach ((var theme, var key) in FieldChoices)
            {
                _ = label.Element("span", text =>
                {
                    _ = text.Class(LabelTextClassName);
                    _ = text.Attribute(WebAttributes.ThemeChoice, theme);
                    WebWords.Write(context, text, null, key);
                });
            }
        });

    /// <summary>The three themes as a listbox's options, none chosen: the page chooses the one it is in.</summary>
    private static void RenderFieldChoices(WebRenderContext context, IHtmlElementBuilder list)
    {
        _ = list.Class(MenuClassName);

        foreach ((var theme, var key) in FieldChoices)
        {
            _ = list.Element("button", choice =>
            {
                _ = choice.Class(ChoiceClassName);
                _ = choice.Attribute("type", "button");
                _ = choice.Attribute("role", "option");
                _ = choice.Attribute("tabindex", "-1");
                _ = choice.Attribute("aria-selected", "false");
                _ = choice.Attribute(WebAttributes.ThemeChoice, theme);
                WebWords.Write(context, choice, null, key);
            });
        }
    }

    private static void RenderGlyph(WebRenderContext context, IHtmlElementBuilder root, string modifier, UIProperty property)
        => _ = root.Element("span", icon =>
        {
            _ = icon.Class("ui-theme-switcher__icon");
            _ = icon.Class($"ui-theme-switcher__icon--{modifier}");
            _ = icon.Class("ui-icon");

            SwitcherChromeRenderer.RenderGlyph(context, icon, property);
        });
}
