using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Contents;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Provides shared rendering logic for components that render a TextComponent-shaped content block
/// (a tooltip/max-lines pair, an icon, a title with an optional trailing/inline badge, and a
/// description) under a component-specific BEM class prefix — see TextComponentRenderer and
/// ButtonContentRegionRenderer. Badge-placement CSS class generation stays with each renderer since the
/// two components resolve to genuinely different CSS classes, not just a different prefix.
/// </summary>
public abstract class TextContentRendererBase : WebComponentRendererBase
{
    /// <summary>The BEM prefix the shared input header renders under.</summary>
    public const string InputClassPrefix = "ui-input";

    /// <summary>
    /// The label row every input draws above its field — icon, title, badge and the required marker — under
    /// one shared <c>ui-input</c> class prefix instead of a copy per component. Public static rather than
    /// protected, because half the inputs that need it inherit a different base (see
    /// <c>SelectComponentRenderer</c>, <c>SliderComponentRenderer</c>).
    /// <para>
    /// The <c>data-ui-input-title</c>/<c>data-ui-input-icon</c> hooks go on the <em>component root</em>,
    /// which is where a live patch puts them (<c>WebDomOperation.ToggleAttribute(target: "root")</c>). The
    /// text input used to render them onto the header instead, so a bound title that started out empty never
    /// became visible when the controller filled it in.
    /// </para>
    /// </summary>
    public static void RenderInputHeader(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Element("span", header =>
        {
            _ = header.Class($"{InputClassPrefix}__header");

            // On the header, which encloses both the title and the icon — see RenderTitleColor.
            RenderTitleColor(context, header);

            _ = header.Element("span", icon => RenderIcon(context, root, icon, InputClassPrefix));

            _ = header.Element("span", title => RenderTitle(context, root, title, InputClassPrefix));

            _ = header.Element("span", badge =>
            {
                _ = badge.Class($"{InputClassPrefix}__badge");
                _ = badge.Class("ui-badge");

                _ = RenderProperty<UITextBadgePlacement?>(context, badge, ITextBaseComponent.BadgePlacementProperty, static (target, value)
                    => _ = target.Class(WebClassNames.InputBadgePlacement(value ?? UITextBadgePlacement.Trailing))
                , [
                    WebDomOperation.Class(converter: WebDomConverters.InputBadgePlacementClass)
                ]);

                BadgeComponentRenderer.RenderBadge(context, root, badge,
                    new WebBadgeRenderOptions
                    {
                        StyleProperty = ITextBaseComponent.BadgeStyleProperty,
                        IconProperty = ITextBaseComponent.BadgeIconProperty,
                        IconColorProperty = ITextBaseComponent.BadgeIconColorProperty,
                        IconSizeProperty = ITextBaseComponent.BadgeIconSizeProperty,
                        TextProperty = ITextBaseComponent.BadgeTextProperty,
                        TextTypeProperty = ITextBaseComponent.BadgeTextTypeProperty,
                        TooltipProperty = ITextBaseComponent.BadgeTooltipProperty,
                        ContentStateTarget = $".{InputClassPrefix}__badge"
                    });
            });

            RenderRequiredMarker(context, header, $"{InputClassPrefix}__required");
        });
    }

    /// <summary>
    /// How the field surface is drawn — a filled box or a single rule under the text. A modifier on the
    /// component root rather than on the field, so one rule in <c>ui-input.less</c> covers every field shape.
    /// </summary>
    public static void RenderInputAppearance(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<UIInputAppearance?>(context, root, IFieldInputComponent.AppearanceProperty, static (target, value) =>
        {
            if (value is UIInputAppearance appearance)
                _ = target.Class(WebClassNames.InputAppearance(appearance));
        }, [WebDomOperation.Class(converter: WebDomConverters.InputAppearanceClass)]);
    }

    /// <summary>
    /// A glyph standing beside the text inside the field. Icon name only — the field decides its size and
    /// colour, so the pair always matches the text it sits next to; the captioned icon with knobs of its own
    /// is the one <see cref="RenderInputHeader"/> draws next to the title.
    /// </summary>
    /// <remarks>
    /// The <c>data-ui-input-prefix-icon</c>/<c>-suffix-icon</c> hooks go on the component root, which is where
    /// a live patch puts them, so an icon that starts out unset still appears when a controller fills it in.
    /// </remarks>
    public static void RenderInputAffixIcon(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder icon, bool suffix)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(icon);

        var modifier = suffix ? "suffix" : "prefix";

        _ = icon.Class($"{InputClassPrefix}__affix-icon");
        _ = icon.Class($"{InputClassPrefix}__affix-icon--{modifier}");
        _ = icon.Class("ui-icon");

        UIProperty property = suffix ? IAffixedInputComponent.SuffixIconProperty : IAffixedInputComponent.PrefixIconProperty;
        var attribute = $"data-{InputClassPrefix}-{modifier}-icon";

        _ = RenderProperty<string?>(context, icon, property, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute(attribute);
                _ = target.Class(WebIconClassName.FromIconName(value));
            }
        }, [
            WebDomOperation.Class(converter: WebDomConverters.IconClass),
            WebDomOperation.ToggleAttribute(attribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }

    /// <summary>
    /// The tooltip an input carries on its own root.
    /// </summary>
    public static void RenderInputTooltip(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<string?>(context, root, ITextBaseComponent.TooltipProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("title", value);
        }, [WebDomOperation.Attribute("title")]);
    }

    protected static void RenderTooltipAndMaxLines(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<string?>(context, root, TextComponent.TooltipProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("title", value);
        }, [WebDomOperation.Attribute("title")]);

        _ = RenderProperty<int?>(context, root, TextComponent.MaxLinesProperty, static (target, value) =>
        {
            if (value is int maxLines && maxLines > 0)
                _ = target.Style("--ui-text-max-lines", maxLines.ToString(CultureInfo.InvariantCulture));
        }, [WebDomOperation.Style("--ui-text-max-lines")]);
    }

    protected static void RenderIcon(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder icon, string classPrefix)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(icon);
        ArgumentException.ThrowIfNullOrWhiteSpace(classPrefix);

        _ = icon.Class($"{classPrefix}__icon");
        _ = icon.Class("ui-icon");

        _ = RenderProperty<UIIconSize?>(context, icon, TextComponent.IconSizeProperty, static (target, value) =>
        {
            if (value is UIIconSize iconSize)
                _ = target.Class(WebClassNames.IconSize(iconSize));
        }, [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)]);

        ThemeColorRenderer.RenderThemeColor(context, icon, TextComponent.IconColorProperty);

        var iconAttribute = $"data-{classPrefix}-icon";

        _ = RenderProperty<string?>(context, icon, TextComponent.IconProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute(iconAttribute);
                _ = target.Class(WebIconClassName.FromIconName(value));
            }
        }, [
            WebDomOperation.Class(converter: WebDomConverters.IconClass),
            WebDomOperation.ToggleAttribute(iconAttribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }

    protected static void RenderTitle(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder title, string classPrefix)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(classPrefix);

        _ = title.Class($"{classPrefix}__title");

        TextAppearanceRenderer.RenderTextAppearance(context, title, TextComponent.TitleTypeProperty);

        var titleAttribute = $"data-{classPrefix}-title";

        _ = RenderProperty<string?>(context, title, TextComponent.TitleProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute(titleAttribute);
                _ = target.Text(value);
            }
        }, [
            WebDomOperation.Text(),
            WebDomOperation.ToggleAttribute(titleAttribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }

    /// <summary>
    /// Applies <c>TitleColor</c> to <paramref name="titleScope"/> — the nearest element that contains both
    /// the title and the icon, which differs per renderer (the header row for Text, the whole region root
    /// for Card/Expander/Button content).
    /// <para>
    /// It deliberately does not go on the title element itself: the icon is a *sibling* of the title, so
    /// colouring only the title left a recoloured heading sitting next to an icon still on its own default.
    /// On the shared scope both inherit it, and an explicit <c>IconColor</c> (unset by default) still
    /// overrides the glyph on its own. Harmless where the title has no icon — <c>TitleColor</c>'s own
    /// default is <c>UIColorStyle.Default</c>, which renders as <c>color: inherit</c>.
    /// </para>
    /// </summary>
    protected static void RenderTitleColor(WebRenderContext context, IHtmlElementBuilder titleScope)
        => ThemeColorRenderer.RenderThemeColor(context, titleScope, TextComponent.TitleColorProperty);

    protected static void RenderDescription(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder description, string classPrefix)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(description);
        ArgumentException.ThrowIfNullOrWhiteSpace(classPrefix);

        _ = description.Class($"{classPrefix}__description");

        TextAppearanceRenderer.RenderTextAppearance(context, description, TextComponent.DescriptionTypeProperty);

        ThemeColorRenderer.RenderThemeColor(context, description, TextComponent.DescriptionColorProperty);

        var descriptionAttribute = $"data-{classPrefix}-description";

        _ = RenderProperty<string?>(context, description, TextComponent.DescriptionProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute(descriptionAttribute);
                _ = target.Text(value);
            }
        }, [
            WebDomOperation.Text(),
            WebDomOperation.ToggleAttribute(descriptionAttribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }
}
