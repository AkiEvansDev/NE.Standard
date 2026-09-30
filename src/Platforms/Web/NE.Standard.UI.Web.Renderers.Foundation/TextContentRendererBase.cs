using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Primitives.Text;
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

    // On the element a field's caption names (RenderFieldLabel): what a live title change rewrites the aria-label of.
    private const string LabelledAttribute = "data-ui-labelled";

    /// <summary>
    /// On the element a control's tooltip names while the control shows no title — an icon-only button, or a split button's press:
    /// what a pushed tooltip renames (<see cref="TooltipNameOperation"/>) and a title that arrives unnames.
    /// </summary>
    public const string TooltipNamedAttribute = "data-ui-tooltip-named";

    /// <summary>
    /// The operation a title pushed empty names its control by the tooltip again with: the tooltip's plain text, read off the root
    /// where the tooltip's own operations wrote it (<c>tooltip-name.ts</c>).
    /// </summary>
    public const string TooltipNameOperationKind = "tooltip-name";

    // The named element is the component's root or a press just under it (a split button's); either way the root's title mark
    // decides. `:scope` keeps each half to its own case: the root only matches itself, and a descendant only below the root.
    private const string TooltipNamedUntitledTarget = $":scope[{TooltipNamedAttribute}]:not([{TitleShownAttribute}]), :scope:not([{TitleShownAttribute}]) > [{TooltipNamedAttribute}]";
    private const string TooltipNamedTitledTarget = $":scope[{TooltipNamedAttribute}][{TitleShownAttribute}], :scope[{TitleShownAttribute}] > [{TooltipNamedAttribute}]";

    // A text body is drawn per row, so its operation lists are built once rather than per body.
    private static readonly WebDomOperation[] TextAlignmentOperations = [WebDomOperation.Class(converter: WebDomConverters.TextAlignmentClass)];
    private static readonly WebDomOperation[] SelectableOperations = [WebDomOperation.ToggleClass($"{TextClassPrefix}--selectable")];
    private static readonly WebDomOperation[] BadgePlacementOperations = [WebDomOperation.Class(converter: WebDomConverters.TextBadgePlacementClass)];
    private static readonly WebDomOperation[] AffixTextOperations = [WebDomOperation.Text()];
    private static readonly WebDomOperation[] InputAppearanceOperations = [WebDomOperation.Class(converter: WebDomConverters.InputAppearanceClass)];
    private static readonly WebDomOperation[] InputSizeOperations = [WebDomOperation.Class(converter: WebDomConverters.InputSizeClass)];
    private static readonly WebDomOperation[] PrefixIconOperations = [.. IconValueRenderer.Operations, WebDomOperation.ToggleAttribute(PrefixIconShownAttribute, target: "root", condition: WebValueCondition.DrawsIcon)];
    private static readonly WebDomOperation[] SuffixIconOperations = [.. IconValueRenderer.Operations, WebDomOperation.ToggleAttribute(SuffixIconShownAttribute, target: "root", condition: WebValueCondition.DrawsIcon)];
    private static readonly WebDomOperation[] WrapModeOperations = [WebDomOperation.Class(converter: WebDomConverters.TextWrapClass)];
    private static readonly WebDomOperation[] TitleWrapOperations = [WebDomOperation.ToggleClass(TitleWrapClassName, condition: WebValueCondition.IsTrue)];
    private static readonly WebDomOperation[] MaxLinesOperations = [WebDomOperation.Style(MaxLinesVariable), WebDomOperation.ToggleClass(MaxLinesClassName, condition: WebValueCondition.HasValue)];
    private static readonly WebDomOperation[] QuoteLineOperations = [WebDomOperation.ToggleClass(QuoteClassName, condition: WebValueCondition.IsTrue)];
    private static readonly WebDomOperation[] QuoteLineColorOperations = [WebDomOperation.Style(QuoteColorVariable, converter: WebDomConverters.ThemeColorCss)];
    private static readonly WebDomOperation[] IconOperations = [.. IconValueRenderer.Operations, WebDomOperation.ToggleAttribute(IconOnlyButtonAttribute, target: "root", condition: WebValueCondition.DrawsIcon)];
    private static readonly WebDomOperation[] TitleOperations = [WebDomOperation.Text(), WebDomOperation.ToggleAttribute(TitleShownAttribute, target: "root", condition: WebValueCondition.HasText)];

    // Optional: a field that names nothing of its own (a package's editor, a picture button) carries no mark.
    private static readonly WebDomOperation[] FieldTitleOperations =
    [
        .. TitleOperations,
        new WebDomOperation { Kind = nameof(WebDomOperationKind.Attribute), Name = "aria-label", Target = $"[{LabelledAttribute}]", Optional = true }
    ];
    // After the title's mark is written: a title shown names the host by its words, so the tooltip's name comes off; a title pushed
    // empty hands the name back to the tooltip, whose words the title's value cannot carry, so the client reads them off the root.
    private static readonly WebDomOperation[] TooltipNamedTitleOperations =
    [
        .. TitleOperations,
        new WebDomOperation { Kind = nameof(WebDomOperationKind.RemoveAttribute), Name = "aria-label", Target = TooltipNamedTitledTarget, Optional = true },
        WebDomOperation.Custom(TooltipNameOperationKind, "aria-label", TooltipNamedUntitledTarget, optional: true)
    ];

    /// <summary>
    /// The operation a control's tooltip names it by: the tooltip's words as the <c>aria-label</c> of the element
    /// <see cref="TooltipNamedAttribute"/> marks, while the control shows no title — its plain text, never the Markdown source.
    /// </summary>
    public static WebDomOperation TooltipNameOperation { get; } = new() { Kind = nameof(WebDomOperationKind.Attribute), Name = "aria-label", Target = TooltipNamedUntitledTarget, Converter = WebDomConverters.InlineMarkupPlainText, Optional = true };
    private static readonly WebDomOperation[] DescriptionOperations = [WebDomOperation.Markup(), WebDomOperation.ToggleAttribute(DescriptionShownAttribute, target: "root", condition: WebValueCondition.HasText)];
    private static readonly WebBadgeRenderOptions TextBadgeOptions = new()
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
    };

    // On a caption's help badge (SetHelp's), which is no tab stop: its words describe the field instead, from the element below.
    private const string HelpBadgeAttribute = "data-ui-help-badge";
    private const string HelpDescriptionClassName = $"{TextClassPrefix}__help";

    // A caption's badge its words make a tab stop (RenderReachableBadge): one type draws a caption above its field and one inside
    // its box, and a property's operations are one list per type, so these land only where the render marked the badge reachable.
    private const string ReachableBadgeTarget = $".{TextClassPrefix}__badge[{WebAttributes.TooltipPress}]:not([{HelpBadgeAttribute}])";
    private static readonly WebDomOperation[] CaptionBadgeTooltipOperations =
    [
        TooltipOperation,
        WebDomOperation.ToggleAttribute("tabindex", ReachableBadgeTarget, WebValueCondition.HasText, value: "0", optional: true),
        WebDomOperation.ToggleAttribute("role", ReachableBadgeTarget, WebValueCondition.HasText, value: "button", optional: true),
        new WebDomOperation { Kind = nameof(WebDomOperationKind.Attribute), Name = "aria-label", Target = ReachableBadgeTarget, Converter = WebDomConverters.InlineMarkupPlainText, Optional = true },
        new WebDomOperation { Kind = nameof(WebDomOperationKind.Text), Target = $".{HelpDescriptionClassName}", Converter = WebDomConverters.InlineMarkupPlainText, Optional = true }
    ];
    private static readonly WebBadgeRenderOptions CaptionBadgeOptions = TextBadgeOptions with { TooltipOperations = CaptionBadgeTooltipOperations };

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

                _ = header.Element("span", title => RenderTitle(context, root, title, options.NamesField, options.TooltipNamesHost));

                options.Trailing?.Invoke(header);

                _ = header.Element("span", badge => RenderTextBadge(context, root, badge, options));
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
        }, TextAlignmentOperations);

        _ = RenderProperty<bool?>(context, container, ITextBaseComponent.SelectableProperty, static (target, value) =>
        {
            if (value is true)
                _ = target.Class($"{TextClassPrefix}--selectable");
        }, SelectableOperations);
    }

    private static void RenderTextBadge(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder badge, WebTextBodyOptions options)
    {
        _ = badge.Class($"{TextClassPrefix}__badge");
        _ = badge.Class("ui-badge");

        if (options.DefaultBadgePlacement is UITextBadgePlacement placement)
        {
            _ = RenderProperty<UITextBadgePlacement?>(context, badge, ITextBaseComponent.BadgePlacementProperty, (target, value)
                => _ = target.Class(WebClassNames.TextBadgePlacement(value ?? placement))
            , BadgePlacementOperations);
        }

        BadgeRenderer.RenderBadge(context, root, badge, options.NamesField ? CaptionBadgeOptions : TextBadgeOptions);

        if (!options.NamesField)
            return;

        if (IsHelpBadge(context))
            RenderHelpBadge(context, badge, options.ReachableBadge);
        else if (options.ReachableBadge)
            RenderReachableBadge(context, badge);
    }

    // SetHelp's badge, known by the glyph it shows as the render reads it: an icon pushed later does not make or unmake one.
    private static bool IsHelpBadge(WebRenderContext context)
    {
        _ = ResolveRenderValue(context, ITextBaseComponent.BadgeIconProperty, out string? icon, out _);

        return string.Equals(icon, UIGlyphs.Help, StringComparison.Ordinal);
    }

    /// <summary>
    /// A caption's help badge: no tab stop, so the keyboard, a dialog's first focus included, lands on the field, which its words
    /// describe (<see cref="RenderFieldLabel"/>); the pointer's hover shows them, and outside the field's box a press or a touch.
    /// </summary>
    private static void RenderHelpBadge(WebRenderContext context, IHtmlElementBuilder badge, bool pressable)
    {
        _ = badge.Attribute(HelpBadgeAttribute);

        if (pressable)
            RenderPressBadge(badge);

        if (HelpDescriptionId(context) is not string id)
            return;

        // The words a reader hears, not the Markdown source; a push and a language switch write them through CaptionBadgeOptions'.
        _ = ResolveRenderValue(context, ITextBaseComponent.BadgeTooltipProperty, out string? words, out _);

        _ = badge.Element("span", description =>
        {
            _ = description.Class(HelpDescriptionClassName);
            _ = description.Attribute("id", id);
            // Never drawn: a description is read off the element it names, hidden or not.
            _ = description.Attribute("hidden");

            if (!string.IsNullOrWhiteSpace(words))
                _ = description.Text(UIInlineMarkup.ToPlainText(words));
        });
    }

    private static void RenderPressBadge(IHtmlElementBuilder badge)
    {
        // A touch has no hover to ask with, and a click would close a hover's words.
        _ = badge.Attribute(WebAttributes.TooltipPress);
        // Pressing it does nothing to the field it explains, nor raises the component's own events.
        _ = badge.Attribute(WebAttributes.EventBoundary);
    }

    private static string? HelpDescriptionId(WebRenderContext context)
        => ComponentPartId(context, "help");

    /// <summary>
    /// A caption's badge whose tooltip is all it has to say, other than a help badge: a tab stop while it has words, a button named by
    /// them that shows them on a press and on focus, and described by them while they show.
    /// </summary>
    private static void RenderReachableBadge(WebRenderContext context, IHtmlElementBuilder badge)
    {
        RenderPressBadge(badge);

        // The words a reader sees, not the Markdown source; a push and a language switch write them through CaptionBadgeOptions'.
        _ = ResolveRenderValue(context, ITextBaseComponent.BadgeTooltipProperty, out string? words, out _);

        if (string.IsNullOrWhiteSpace(words))
            return;

        _ = badge.Attribute("tabindex", "0");
        _ = badge.Attribute("role", "button");
        _ = badge.Attribute("aria-label", UIInlineMarkup.ToPlainText(words));
    }

    /// <summary>
    /// The label row every input draws above its field. A single-row field passes <paramref name="titleCanGoInside"/> true, and
    /// an inside caption is then <see cref="RenderInputHeaderInside"/>'s job.
    /// </summary>
    public static void RenderInputHeader(WebRenderContext context, IHtmlElementBuilder root, bool titleCanGoInside = false)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        if (titleCanGoInside && IsTitleInside(context))
        {
            _ = root.Class(TitleInsideClassName);
            return;
        }

        RenderInputHeaderElement(context, root, root, inside: false);
    }

    private static bool IsTitleInside(WebRenderContext context)
    {
        _ = ResolveRenderValue(context, IFieldInputComponent.TitlePlacementProperty, out UIInputTitlePlacement? placement, out _);

        return placement == UIInputTitlePlacement.Inside;
    }

    private static void RenderInputHeaderElement(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder parent, bool inside)
    {
        _ = parent.Element("span", header =>
        {
            _ = header.Class($"{InputClassPrefix}__header");

            RenderTextBody(context, root, header, new WebTextBodyOptions
            {
                DefaultBadgePlacement = UITextBadgePlacement.Trailing,
                Trailing = marker => RenderRequiredMarker(context, marker, $"{InputClassPrefix}__required"),
                NamesField = true,
                // Not in a caption inside the field's box: the box is one control, and a tab stop cannot stand inside it.
                ReachableBadge = !inside
            });
        });
    }

    /// <summary>
    /// Names <paramref name="field"/> by the caption, or the component's <c>AccessibleName</c>, and marks it required, described by its
    /// caption's help and its validation line, and invalid where the render already knows the value was refused.
    /// </summary>
    /// <remarks>
    /// For the element a screen reader lands on (the native field, a picker's trigger, a period's group): the caption drawn beside a
    /// field is not its label, since most fields' roots are not a label element.
    /// </remarks>
    public static void RenderFieldLabel(WebRenderContext context, IHtmlElementBuilder field)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(field);

        _ = field.Attribute(LabelledAttribute);

        _ = ResolveRenderValue(context, ITextBaseComponent.TitleProperty, out string? title, out _);

        if (!string.IsNullOrWhiteSpace(title))
            _ = field.Attribute("aria-label", title);

        RenderAccessibleName(context, field);

        if (HasRequiredValidation(context))
            _ = field.Attribute("aria-required", "true");

        // The caption's help (RenderHelpBadge) first, then the validation line.
        var helpId = IsHelpBadge(context) ? HelpDescriptionId(context) : null;
        var messageId = ValidationMessageId(context);

        if (helpId is not null || messageId is not null)
            _ = field.Attribute("aria-describedby", helpId is null ? messageId : messageId is null ? helpId : $"{helpId} {messageId}");

        _ = ResolveRenderValue(context, IInputComponent.ValidationProperty, out UIValidationMessage? validation, out _);

        if (validation is { Severity: UIValidationSeverity.Error })
            _ = field.Attribute("aria-invalid", "true");
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
            RenderInputHeaderElement(context, root, field, inside: true);
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
        }, AffixTextOperations);
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
        }, InputAppearanceOperations);

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
        }, InputSizeOperations);
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
        WebDomOperation[] operations = suffix ? SuffixIconOperations : PrefixIconOperations;

        _ = RenderProperty<string?>(context, icon, property, (target, value) =>
        {
            if (IconValueRenderer.Draws(value))
            {
                _ = root.Attribute(attribute);
                IconValueRenderer.RenderIconValue(target, value);
            }
        }, operations);
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

    /// <summary>How a paragraph is allowed to run — wrap mode, a title that wraps too, maximum lines and the quote line.</summary>
    protected static void RenderParagraphFlow(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder container)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(container);

        RenderTextWrap(context, container);

        _ = RenderProperty<int?>(context, root, IParagraphComponent.MaxLinesProperty, static (target, value) =>
        {
            if (value is int maxLines && maxLines > 0)
                _ = target.Style(MaxLinesVariable, maxLines.ToString(CultureInfo.InvariantCulture)).Class(MaxLinesClassName);
        }, MaxLinesOperations);

        _ = RenderProperty<bool?>(context, root, IParagraphComponent.ShowQuoteLineProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class(QuoteClassName);
        }, QuoteLineOperations);

        _ = RenderProperty<UIThemeColor?>(context, root, IParagraphComponent.QuoteLineColorProperty, static (target, value) =>
        {
            if (value is UIThemeColor color && WebCssValues.ThemeColor(color) is { Length: > 0 } css)
                _ = target.Style(QuoteColorVariable, css);
        }, QuoteLineColorOperations);
    }

    /// <summary>Whether an <see cref="ITextWrapComponent"/>'s description wraps and its title runs on too, as classes on the text body.</summary>
    protected static void RenderTextWrap(WebRenderContext context, IHtmlElementBuilder container)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(container);

        _ = RenderProperty<UITextWrapMode?>(context, container, ITextWrapComponent.WrapModeProperty, static (target, value) =>
        {
            if (value is UITextWrapMode wrapMode)
                _ = target.Class(WebClassNames.TextWrap(wrapMode));
        }, WrapModeOperations);

        _ = RenderProperty<bool?>(context, container, ITextWrapComponent.TitleWrapProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class(TitleWrapClassName);
        }, TitleWrapOperations);
    }

    private const string MaxLinesClassName = "ui-text--max-lines";
    private const string MaxLinesVariable = "--ui-text-max-lines";
    private const string TitleWrapClassName = "ui-text--title-wrap";
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
            if (IconValueRenderer.Draws(value))
            {
                _ = root.Attribute(IconOnlyButtonAttribute);
                IconValueRenderer.RenderIconValue(target, value);
            }
        }, IconOperations);
    }

    protected static void RenderTitle(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder title, bool namesField = false, bool tooltipNamesHost = false)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(title);

        _ = title.Class($"{TextClassPrefix}__title");

        // No type of its own: the body already wears TitleType (RenderTextBody); a role class here would block inherited
        // values like a button's step or a tab's weight from reaching the title.
        _ = RenderProperty<string?>(context, title, ITextBaseComponent.TitleProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute(TitleShownAttribute);
                _ = target.Text(value);
            }
        }, namesField ? FieldTitleOperations : tooltipNamesHost ? TooltipNamedTitleOperations : TitleOperations);
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
        }, DescriptionOperations);
    }
}
