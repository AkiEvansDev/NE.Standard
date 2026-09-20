using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>The shared icon/title/badge/description body every TextComponent-shaped host draws, under one <c>ui-text</c> prefix.</summary>
public abstract class TextContentRendererBase : WebComponentRendererBase
{
    /// <summary>The BEM prefix every text body renders under, whichever component hosts it.</summary>
    public const string TextClassPrefix = "ui-text";

    /// <summary>The BEM prefix the parts around an input's label — the field, the marker — render under.</summary>
    public const string InputClassPrefix = "ui-input";

    /// <summary>
    /// The class a field-shaped box (a textarea, a package's editor) wears for its ground and states — the stylesheet's contract
    /// for fields it doesn't know.
    /// </summary>
    public const string FieldBoxClassName = "ui-field-box";

    // On the root of a field whose caption stands inside its box, for the stylesheet to read the value from the trailing edge.
    private const string TitleInsideClassName = "ui-input--title-inside";

    /// <summary>
    /// The attribute the framework's button reads to draw an icon-only button as a square; set by a text body's own button and
    /// by a package's hand-built one (a pager's chevron).
    /// </summary>
    public const string IconOnlyButtonAttribute = "data-ui-text-icon";

    // Read by the stylesheet alone: which parts of a text body hold something, so the body lays out only those.
    private const string TitleShownAttribute = "data-ui-text-title";
    private const string DescriptionShownAttribute = "data-ui-text-description";
    private const string PrefixIconShownAttribute = "data-ui-input-prefix-icon";
    private const string SuffixIconShownAttribute = "data-ui-input-suffix-icon";

    /// <summary>
    /// Renders the whole text body into <paramref name="container"/>; <paramref name="root"/> must be the root carrying the patch hooks.
    /// </summary>
    public static void RenderTextBody(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder container, WebTextBodyOptions options)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(container);

        _ = container.Class(TextClassPrefix);

        RenderTitleColor(context, container);

        // On the whole body, not just the title: the icon is a sibling and takes the title's size by inheritance.
        TextAppearanceRenderer.RenderTextAppearance(context, container, ITextBaseComponent.TitleTypeProperty);

        if (options.IncludeTextLayout)
            RenderTextLayout(context, container);

        _ = container.Element("span", icon => RenderIcon(context, root, icon));

        _ = container.Element("span", body =>
        {
            _ = body.Class($"{TextClassPrefix}__body");

            _ = body.Element("span", header =>
            {
                _ = header.Class($"{TextClassPrefix}__header");

                _ = header.Element("span", title => RenderTitle(context, root, title));

                options.Trailing?.Invoke(header);

                _ = header.Element("span", badge => RenderTextBadge(context, root, badge, options.DefaultBadgePlacement));
            });

            if (options.IncludeTextLayout)
                _ = body.Element("span", description => RenderDescription(context, root, description));
        });
    }

    private static void RenderTextLayout(WebRenderContext context, IHtmlElementBuilder container)
    {
        // Read once rather than registered: IconAlignment is not bindable, so nothing can arrive later.
        _ = ResolveRenderValue(context, ITextMarkAlignmentComponent.IconAlignmentProperty, out UITextIconAlignment? iconAlignment, out _);

        if (iconAlignment is UITextIconAlignment alignment)
            _ = container.Class(WebClassNames.TextIconAlignment(alignment));

        _ = ResolveRenderValue(context, ITextMarkAlignmentComponent.BadgeAlignmentProperty, out UITextBadgeAlignment? badgeAlignment, out _);

        if (badgeAlignment is UITextBadgeAlignment badge)
            _ = container.Class(WebClassNames.TextBadgeAlignment(badge));

        _ = RenderProperty<UITextAlignment?>(context, container, ITextComponent.TextAlignmentProperty, static (target, value) =>
        {
            if (value is UITextAlignment alignment)
                _ = target.Class(WebClassNames.TextAlignment(alignment));
        }, [WebDomOperation.Class(converter: WebDomConverters.TextAlignmentClass)]);

        _ = RenderProperty<bool?>(context, container, ITextBaseComponent.SelectableProperty, static (target, value) =>
        {
            if (value is true)
                _ = target.Class($"{TextClassPrefix}--selectable");
        }, [WebDomOperation.ToggleClass($"{TextClassPrefix}--selectable")]);
    }

    private static void RenderTextBadge(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder badge, UITextBadgePlacement? fallback)
    {
        _ = badge.Class($"{TextClassPrefix}__badge");
        _ = badge.Class("ui-badge");

        if (fallback is UITextBadgePlacement placement)
        {
            _ = RenderProperty<UITextBadgePlacement?>(context, badge, ITextBaseComponent.BadgePlacementProperty, (target, value)
                => _ = target.Class(WebClassNames.TextBadgePlacement(value ?? placement))
            , [
                WebDomOperation.Class(converter: WebDomConverters.TextBadgePlacementClass)
            ]);
        }

        BadgeRenderer.RenderBadge(context, root, badge,
            new WebBadgeRenderOptions
            {
                StyleProperty = ITextBaseComponent.BadgeStyleProperty,
                ColorProperty = ITextBaseComponent.BadgeColorProperty,
                IconProperty = ITextBaseComponent.BadgeIconProperty,
                IconColorProperty = ITextBaseComponent.BadgeIconColorProperty,
                IconSizeProperty = ITextBaseComponent.BadgeIconSizeProperty,
                TextProperty = ITextBaseComponent.BadgeTextProperty,
                TextTypeProperty = ITextBaseComponent.BadgeTextTypeProperty,
                TooltipProperty = ITextBaseComponent.BadgeTooltipProperty,
                TooltipPlacementProperty = ITextBaseComponent.BadgeTooltipPlacementProperty,
                ContentStateTarget = $".{TextClassPrefix}__badge"
            });
    }

    /// <summary>
    /// The label row every input draws above its field. A single-row field passes <paramref name="titleCanGoInside"/> true, and
    /// an inside caption is then <see cref="RenderInputHeaderInside"/>'s job.
    /// </summary>
    public static void RenderInputHeader(WebRenderContext context, IHtmlElementBuilder root, bool titleCanGoInside = false)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // The accessible half of the marker the header draws.
        if (HasRequiredValidation(context))
            _ = root.Attribute("aria-required", "true");

        if (titleCanGoInside && IsTitleInside(context))
        {
            _ = root.Class(TitleInsideClassName);
            return;
        }

        RenderInputHeaderElement(context, root, root);
    }

    private static bool IsTitleInside(WebRenderContext context)
    {
        _ = ResolveRenderValue(context, IFieldInputComponent.TitlePlacementProperty, out UIInputTitlePlacement? placement, out _);

        return placement == UIInputTitlePlacement.Inside;
    }

    private static void RenderInputHeaderElement(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder parent)
    {
        _ = parent.Element("span", header =>
        {
            _ = header.Class($"{InputClassPrefix}__header");

            RenderTextBody(context, root, header, new WebTextBodyOptions
            {
                DefaultBadgePlacement = UITextBadgePlacement.Trailing,
                Trailing = marker => RenderRequiredMarker(context, marker, $"{InputClassPrefix}__required")
            });
        });
    }

    /// <summary>
    /// The caption inside the field's own box, at its leading edge, for a field whose <see cref="IFieldInputComponent.TitlePlacement"/>
    /// is <see cref="UIInputTitlePlacement.Inside"/>; called first thing in the box, and nothing for a caption on top.
    /// </summary>
    public static void RenderInputHeaderInside(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder field)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(field);

        if (IsTitleInside(context))
            RenderInputHeaderElement(context, root, field);
    }

    /// <summary>The word at either end of a value — a currency sign, a unit — for an <see cref="IAffixTextInputComponent"/>.</summary>
    public static void RenderInputAffixText(WebRenderContext context, IHtmlElementBuilder affix, bool suffix)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(affix);

        _ = affix.Class($"{InputClassPrefix}__affix");
        _ = affix.Class($"{InputClassPrefix}__affix--{(suffix ? "suffix" : "prefix")}");

        UIProperty property = suffix ? IAffixTextInputComponent.SuffixTextProperty : IAffixTextInputComponent.PrefixTextProperty;

        _ = RenderProperty<string?>(context, affix, property, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Text(value);
        }, [WebDomOperation.Text()]);
    }

    /// <summary>How the field surface is drawn, as a modifier on the component root.</summary>
    public static void RenderInputAppearance(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<UIInputAppearance?>(context, root, IFieldInputComponent.AppearanceProperty, static (target, value) =>
        {
            if (value is UIInputAppearance appearance)
                _ = target.Class(WebClassNames.InputAppearance(appearance));
        }, [WebDomOperation.Class(converter: WebDomConverters.InputAppearanceClass)]);

        RenderInputSize(context, root);
    }

    /// <summary>How much room an input takes, as a modifier on the component root; a field's appearance renders it with itself.</summary>
    public static void RenderInputSize(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<UIInputSize?>(context, root, ISizedInputComponent.SizeProperty, static (target, value) =>
        {
            if (value is UIInputSize size)
                _ = target.Class(WebClassNames.InputSize(size));
        }, [WebDomOperation.Class(converter: WebDomConverters.InputSizeClass)]);
    }

    /// <summary>A glyph beside the text inside the field; icon name only, the field decides size and colour.</summary>
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
        var attribute = suffix ? SuffixIconShownAttribute : PrefixIconShownAttribute;

        _ = RenderProperty<string?>(context, icon, property, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute(attribute);
                IconValueRenderer.RenderIconValue(target, value);
            }
        }, [
            .. IconValueRenderer.Operations,
            WebDomOperation.ToggleAttribute(attribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }

    /// <summary>
    /// The button that opens a field's popup: a dialog the client toggles, marked by the attribute its engine looks for.
    /// </summary>
    protected static void RenderPopupToggle(IHtmlElementBuilder parent, string className, string toggleAttribute, Action<IHtmlElementBuilder>? configure = null)
    {
        ArgumentNullException.ThrowIfNull(parent);

        _ = parent.Element("button", button =>
        {
            _ = button.Class(className);
            _ = button.Attribute("type", "button");
            RenderPopupTrigger(button, "dialog");
            _ = button.Attribute(toggleAttribute);

            configure?.Invoke(button);
        });
    }

    /// <summary>
    /// One step of a stepper: out of the tab order and hidden from assistive technology, because the arrows on the field
    /// itself are the accessible way to step.
    /// </summary>
    protected static void RenderStepButton(IHtmlElementBuilder stepper, string className, string directionAttribute, string direction)
    {
        ArgumentNullException.ThrowIfNull(stepper);

        _ = stepper.Element("button", button =>
        {
            _ = button.Class(className);
            _ = button.Attribute("type", "button");
            _ = button.Attribute("tabindex", "-1");
            _ = button.Attribute("aria-hidden", "true");
            _ = button.Attribute(directionAttribute, direction);
        });
    }

    /// <summary>How a paragraph is allowed to run — wrap mode and maximum lines.</summary>
    protected static void RenderParagraphFlow(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder container)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(container);

        _ = RenderProperty<UITextWrapMode?>(context, container, IParagraphComponent.WrapModeProperty, static (target, value) =>
        {
            if (value is UITextWrapMode wrapMode)
                _ = target.Class(WebClassNames.TextWrap(wrapMode));
        }, [WebDomOperation.Class(converter: WebDomConverters.TextWrapClass)]);

        _ = RenderProperty<int?>(context, root, IParagraphComponent.MaxLinesProperty, static (target, value) =>
        {
            if (value is int maxLines && maxLines > 0)
                _ = target.Style(MaxLinesVariable, maxLines.ToString(CultureInfo.InvariantCulture)).Class(MaxLinesClassName);
        }, [WebDomOperation.Style(MaxLinesVariable), WebDomOperation.ToggleClass(MaxLinesClassName, condition: WebValueCondition.HasValue)]);

        _ = RenderProperty<bool?>(context, root, IParagraphComponent.ShowQuoteLineProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class(QuoteClassName);
        }, [WebDomOperation.ToggleClass(QuoteClassName, condition: WebValueCondition.IsTrue)]);

        _ = RenderProperty<UIThemeColor?>(context, root, IParagraphComponent.QuoteLineColorProperty, static (target, value) =>
        {
            if (value is UIThemeColor color)
                _ = target.Style(QuoteColorVariable, WebCssValues.ThemeColor(color));
        }, [WebDomOperation.Style(QuoteColorVariable, converter: WebDomConverters.ThemeColorCss)]);
    }

    private const string MaxLinesClassName = "ui-text--max-lines";
    private const string MaxLinesVariable = "--ui-text-max-lines";
    private const string QuoteClassName = "ui-paragraph--quote";
    private const string QuoteColorVariable = "--ui-quote-color";

    protected static void RenderIcon(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder icon)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(icon);

        _ = icon.Class($"{TextClassPrefix}__icon");
        _ = icon.Class("ui-icon");

        IconValueRenderer.RenderIconAppearance(context, icon, ITextBaseComponent.IconSizeProperty, ITextBaseComponent.IconColorProperty);

        _ = RenderProperty<string?>(context, icon, ITextBaseComponent.IconProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute(IconOnlyButtonAttribute);
                IconValueRenderer.RenderIconValue(target, value);
            }
        }, [
            .. IconValueRenderer.Operations,
            WebDomOperation.ToggleAttribute(IconOnlyButtonAttribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }

    protected static void RenderTitle(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder title)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(title);

        _ = title.Class($"{TextClassPrefix}__title");

        // No type of its own: the body already wears TitleType (RenderTextContent); a role class here would block inherited
        // values like a button's step or a tab's weight from reaching the title.
        _ = RenderProperty<string?>(context, title, ITextBaseComponent.TitleProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute(TitleShownAttribute);
                _ = target.Text(value);
            }
        }, [
            WebDomOperation.Text(),
            WebDomOperation.ToggleAttribute(TitleShownAttribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }

    /// <summary>Applies <c>TitleColor</c> to <paramref name="titleScope"/>, which must contain the icon so the glyph inherits it.</summary>
    protected static void RenderTitleColor(WebRenderContext context, IHtmlElementBuilder titleScope)
        => ThemeColorRenderer.RenderThemeColor(context, titleScope, ITextBaseComponent.TitleColorProperty);

    protected static void RenderDescription(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder description)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(description);

        _ = description.Class($"{TextClassPrefix}__description");

        TextAppearanceRenderer.RenderTextAppearance(context, description, ITextComponent.DescriptionTypeProperty);

        ThemeColorRenderer.RenderThemeColor(context, description, ITextComponent.DescriptionColorProperty);

        // Inline markup is allowed here but deliberately not in the title, which is a label rather than a sentence.
        _ = RenderProperty<string?>(context, description, ITextComponent.DescriptionProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute(DescriptionShownAttribute);
                InlineMarkupRenderer.Render(target, value);
            }
        }, [
            WebDomOperation.Markup(),
            WebDomOperation.ToggleAttribute(DescriptionShownAttribute, target: "root", condition: WebValueCondition.HasText)
        ]);
    }
}
