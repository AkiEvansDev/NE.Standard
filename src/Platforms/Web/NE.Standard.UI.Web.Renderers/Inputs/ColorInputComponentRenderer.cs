using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>A swatch that opens a picker: a free colour on one tab, the palette on the other.</summary>
public sealed class ColorInputComponentRenderer : TextContentRendererBase
{
    private const string ValueInputClass = "ui-color-input__value-input";
    private const string PickerPane = "picker";
    private const string PalettePane = "palette";
    // Read by the stylesheet alone, so it is this renderer's own rather than a WebAttributes constant.
    private const string NoOpacityAttribute = "data-ui-color-no-opacity";

    // The palette as a colour chart: a column per family around the hue wheel, the neutrals last, and a row per step the palette's
    // names give — the deep one, Nebula, Lunar. In the enum's order, ten to a row, every family broke across two rows.
    private static readonly ColorName[] FamilyChips =
    [
        ColorName.StellarRed, ColorName.SolarAmber, ColorName.EclipseOlive, ColorName.AuroraGreen, ColorName.AstralTeal, ColorName.QuantumBlue, ColorName.NovaPurple, ColorName.IronFog,
        ColorName.NebulaRose, ColorName.NebulaLemon, ColorName.NebulaLime, ColorName.NebulaMint, ColorName.NebulaCyan, ColorName.NebulaAqua, ColorName.NebulaViolet, ColorName.SilverNight,
        ColorName.LunarPink, ColorName.LunarYellow, ColorName.LunarSage, ColorName.LunarFern, ColorName.LunarMoss, ColorName.LunarAzure, ColorName.LunarLavender, ColorName.BronzeDusk
    ];

    // Under the chart, the bright ones that belong to no step, in hue order.
    private static readonly ColorName[] BrightChips =
    [
        ColorName.Flare, ColorName.Ember, ColorName.SolarGold, ColorName.Photon, ColorName.Comet, ColorName.Halo, ColorName.Vortex, ColorName.PulsarMagenta
    ];

    // One operation per toggle: an operation's selector lands on the first part it matches.
    private static readonly WebDomOperation[] ReadOnlyOperations =
    [
        NativeInputRendererBase.ReadOnlyMarkOperation,
        WebDomOperation.ToggleAttribute("aria-disabled", target: ".ui-color-input__toggle", condition: WebValueCondition.IsTrue, value: "true"),
        WebDomOperation.ToggleAttribute("aria-disabled", target: ".ui-color-input__swatch--button", condition: WebValueCondition.IsTrue, value: "true")
    ];

    public override string ComponentTypeKey => ColorInputComponent.ComponentTypeKey;

    protected override string ClassName => "ui-color-input";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = ResolveRenderValue(context, ColorInputComponent.TextFormatProperty, out UIColorTextFormat? textFormat, out _);

        UIColorTextFormat format = textFormat ?? UIColorTextFormat.Hex;

        RenderTooltip(context, root);

        RenderTextFormat(context, root);
        RenderPresentation(context, root);
        RenderInputAppearance(context, root);
        RenderInputHeader(context, root, titleCanGoInside: true);

        // Both variants and both panes are always rendered, the root says which show: no DOM operation swaps elements.
        List<IHtmlElementBuilder> texts = [];
        List<IHtmlElementBuilder> toggles = [];

        RenderRow(context, root, texts.Add, toggles.Add);
        RenderSwatchButton(context, root, texts.Add, toggles.Add);
        RenderReadOnly(context, root, toggles);
        RenderPopup(context, root);
        RenderValueInput(context, root, format, texts);
        RenderValidationMessage(context, root);
    }

    /// <summary>How the colour reads as text, on the root for the engine to answer with.</summary>
    private static void RenderTextFormat(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = RenderProperty<UIColorTextFormat?>(context, root, ColorInputComponent.TextFormatProperty, static (target, value)
            => target.Attribute(WebAttributes.ColorFormat, value == UIColorTextFormat.Rgb ? "rgb" : "hex"),
            [WebDomOperation.Attribute(WebAttributes.ColorFormat, converter: WebDomConverters.ColorTextFormatAttribute)]);
    }

    /// <summary>Which variant shows, and which of the popup's parts are refused — all four on the root.</summary>
    private static void RenderPresentation(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = RenderProperty<UIColorInputVariant?>(context, root, ColorInputComponent.VariantProperty, static (target, value)
            => target.Attribute(WebAttributes.ColorVariant, value == UIColorInputVariant.Swatch ? "swatch" : "field"),
            [WebDomOperation.Attribute(WebAttributes.ColorVariant, converter: WebDomConverters.ColorInputVariantAttribute)]);

        // A refusal rather than an offer: each defaults to shown, so an unset or null value, first paint and live patch alike, marks nothing.
        RenderFlagAttribute(context, root, ColorInputComponent.ShowPickerProperty, WebAttributes.ColorNoPicker, WebValueCondition.IsFalse);
        RenderFlagAttribute(context, root, ColorInputComponent.ShowPaletteProperty, WebAttributes.ColorNoPalette, WebValueCondition.IsFalse);
        RenderFlagAttribute(context, root, ColorInputComponent.ShowOpacityProperty, NoOpacityAttribute, WebValueCondition.IsFalse);
    }

    /// <summary>
    /// Read-only on the root, because it is the whole control that stops answering; its two toggles stay focusable, as a read-only
    /// field does, and say they do nothing.
    /// </summary>
    private static void RenderReadOnly(WebRenderContext context, IHtmlElementBuilder root, List<IHtmlElementBuilder> toggles)
    {
        _ = RenderProperty<bool?>(context, root, IInputComponent.IsReadOnlyProperty, (target, value) =>
        {
            if (value != true)
                return;

            _ = target.Class(WebClassNames.ReadOnly);

            foreach (IHtmlElementBuilder toggle in toggles)
                _ = toggle.Attribute("aria-disabled", "true");
        }, ReadOnlyOperations);
    }

    /// <summary>The field variant: a swatch, the colour written beside it, and the button that opens the picker.</summary>
    private static void RenderRow(WebRenderContext context, IHtmlElementBuilder root, Action<IHtmlElementBuilder> onText, Action<IHtmlElementBuilder> onToggle)
    {
        _ = root.Element("span", row =>
        {
            _ = row.Class("ui-color-input__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            RenderInputHeaderInside(context, root, row);

            _ = row.Element("span", element => element.Class("ui-color-input__swatch"));

            _ = row.Element("span", element =>
            {
                _ = element.Class("ui-color-input__text");
                onText(element);
            });

            RenderPopupToggle(row, "ui-color-input__toggle", WebAttributes.ColorToggle, button =>
            {
                onToggle(button);
                WebWords.Write(context, button, "aria-label", UIStrings.ColorChoose);
            });
        });
    }

    /// <summary>The swatch variant: the colour itself, with its own text across it, and nothing else.</summary>
    private static void RenderSwatchButton(WebRenderContext context, IHtmlElementBuilder root, Action<IHtmlElementBuilder> onText, Action<IHtmlElementBuilder> onToggle)
    {
        RenderPopupToggle(root, "ui-color-input__swatch ui-color-input__swatch--button", WebAttributes.ColorToggle, button =>
        {
            onToggle(button);
            WebWords.Write(context, button, "aria-label", UIStrings.ColorChoose);

            BorderStyleRenderer.RenderBorderStyle(context, button);

            _ = button.Element("span", element =>
            {
                _ = element.Class("ui-color-input__text ui-color-input__text--over");
                onText(element);
            });
        });
    }

    private static void RenderPopup(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = root.Element("div", popup =>
        {
            _ = popup.Class("ui-color-input__popup");
            _ = popup.Attribute("role", "dialog");

            // A holder, as a flyout's panel is: Enter in its Hex or channel field hands it the keyboard, never the page's body.
            _ = popup.Attribute("tabindex", "-1");
            _ = popup.Attribute(WebAttributes.FocusHolder);

            RenderTabs(context, popup);
            RenderPickerPane(context, popup);
            RenderPalettePane(context, popup);
        });
    }

    private static void RenderTabs(WebRenderContext context, IHtmlElementBuilder popup)
    {
        _ = popup.Element("div", tabs =>
        {
            _ = tabs.Class("ui-color-input__tabs");

            RenderTab(context, tabs, PickerPane, UIStrings.ColorPicker);
            RenderTab(context, tabs, PalettePane, UIStrings.ColorPalette);
        });
    }

    private static void RenderTab(WebRenderContext context, IHtmlElementBuilder tabs, string pane, string captionKey)
    {
        _ = tabs.Element("button", tab =>
        {
            _ = tab.Class("ui-color-input__tab");
            _ = tab.Attribute("type", "button");
            _ = tab.Attribute(WebAttributes.ColorTab, pane);
            WebWords.Write(context, tab, null, captionKey);
        });
    }

    /// <summary>The free picker: saturation/value square, hue strip, and the hex and channel fields.</summary>
    private static void RenderPickerPane(WebRenderContext context, IHtmlElementBuilder popup)
    {
        _ = popup.Element("div", pane =>
        {
            _ = pane.Class("ui-color-input__pane");
            _ = pane.Attribute(WebAttributes.ColorPane, PickerPane);

            _ = pane.Element("div", area =>
            {
                _ = area.Class("ui-color-input__area");

                _ = area.Element("div", square =>
                {
                    _ = square.Class("ui-color-input__square");
                    _ = square.Attribute(WebAttributes.ColorSquare);
                    _ = square.Element("span", thumb => thumb.Class("ui-color-input__square-thumb"));
                });

                _ = area.Element("div", hue =>
                {
                    _ = hue.Class("ui-color-input__hue");
                    _ = hue.Attribute(WebAttributes.ColorHue);
                    _ = hue.Element("span", thumb => thumb.Class("ui-color-input__hue-thumb"));
                });
            });

            _ = pane.Element("div", fields =>
            {
                _ = fields.Class("ui-color-input__fields");

                RenderTextField(context, fields, "hex", UIStrings.ColorHex, WebAttributes.ColorHex);
                RenderChannelField(context, fields, UIStrings.ColorRed, "r");
                RenderChannelField(context, fields, UIStrings.ColorGreen, "g");
                RenderChannelField(context, fields, UIStrings.ColorBlue, "b");
            });

            RenderOpacitySlider(context, pane);
        });
    }

    /// <summary>The palette: every named colour as a chart of families and steps, a signed shade-to-tint slider, and one for opacity.</summary>
    private static void RenderPalettePane(WebRenderContext context, IHtmlElementBuilder popup)
    {
        _ = popup.Element("div", pane =>
        {
            _ = pane.Class("ui-color-input__pane");
            _ = pane.Attribute(WebAttributes.ColorPane, PalettePane);

            _ = pane.Element("div", palette =>
            {
                _ = palette.Class("ui-color-input__palette");

                RenderChips(context, palette, FamilyChips);
                RenderChips(context, palette, BrightChips);
            });

            RenderSlider(context, pane, UIStrings.ColorFactor, WebAttributes.ColorFactor, -ColorVariant.MaxFactor, ColorVariant.MaxFactor, 0);

            RenderOpacitySlider(context, pane);
        });
    }

    private static void RenderChips(WebRenderContext context, IHtmlElementBuilder palette, ColorName[] names)
        => palette.Element("div", grid =>
        {
            _ = grid.Class("ui-color-input__grid");

            foreach (ColorName name in names)
                RenderChip(context, grid, name);
        });

    private static void RenderChip(WebRenderContext context, IHtmlElementBuilder grid, ColorName name)
    {
        _ = grid.Element("button", chip =>
        {
            _ = chip.Class("ui-color-input__chip");
            _ = chip.Attribute("type", "button");
            // The palette name is the colour's identifier on the wire, and a word to the reader; since the tooltip engine reads to
            // nobody else, the word doubles as the label.
            var key = UIStrings.ColorNameKey(name);

            WebWords.Write(context, chip, WebAttributes.Tooltip, key);
            WebWords.Write(context, chip, "aria-label", key);
            _ = chip.Attribute(WebAttributes.ColorName, name.ToString());
            _ = chip.Style("--ui-color-input-chip", new ColorVariant(name).ToHex());
        });
    }

    private static void RenderTextField(WebRenderContext context, IHtmlElementBuilder fields, string key, string labelKey, string attribute)
    {
        _ = fields.Element("label", field =>
        {
            _ = field.Class("ui-color-input__field");
            _ = field.Element("span", caption => WebWords.Write(context, caption.Class("ui-color-input__field-label"), null, labelKey));
            _ = field.Element("input", input =>
            {
                _ = input.Class($"ui-color-input__field-input ui-color-input__field-input--{key}");
                _ = input.Attribute("type", "text");
                _ = input.Attribute("autocomplete", "off");
                _ = input.Attribute(attribute);
            });
        });
    }

    private static void RenderChannelField(WebRenderContext context, IHtmlElementBuilder fields, string labelKey, string channel)
    {
        _ = fields.Element("label", field =>
        {
            _ = field.Class("ui-color-input__field");
            _ = field.Element("span", caption => WebWords.Write(context, caption.Class("ui-color-input__field-label"), null, labelKey));
            _ = field.Element("input", input =>
            {
                _ = input.Class("ui-color-input__field-input ui-color-input__field-input--channel");
                _ = input.Attribute("type", "text");
                _ = input.Attribute("inputmode", "numeric");
                _ = input.Attribute("autocomplete", "off");
                _ = input.Attribute(WebAttributes.ColorChannel, channel);
            });
        });
    }

    private static void RenderOpacitySlider(WebRenderContext context, IHtmlElementBuilder pane)
        => RenderSlider(context, pane, UIStrings.ColorOpacity, WebAttributes.ColorOpacity, 0, 255, 255);

    private static void RenderSlider(WebRenderContext context, IHtmlElementBuilder pane, string labelKey, string attribute, int min, int max, int value)
    {
        _ = pane.Element("label", row =>
        {
            _ = row.Class("ui-color-input__slider");
            _ = row.Element("span", caption => WebWords.Write(context, caption.Class("ui-color-input__field-label"), null, labelKey));
            _ = row.Element("input", input =>
            {
                _ = input.Class("ui-color-input__slider-input");
                _ = input.Attribute("type", "range");
                _ = input.Attribute("min", min.ToString(CultureInfo.InvariantCulture));
                _ = input.Attribute("max", max.ToString(CultureInfo.InvariantCulture));
                _ = input.Attribute("value", value.ToString(CultureInfo.InvariantCulture));
                _ = input.Attribute(attribute);
            });
        });
    }

    /// <summary>The hidden input the value binds to, and the one place <c>Value</c> is registered.</summary>
    private static void RenderValueInput(WebRenderContext context, IHtmlElementBuilder root, UIColorTextFormat format, List<IHtmlElementBuilder> texts)
    {
        NativeInputRendererBase.RenderHiddenValueInput(context, root, ValueInputClass, valueInput =>
        {
            _ = RenderProperty<UIThemeColor?>(context, valueInput, IInputComponent.ValueProperty, (target, value) =>
            {
                if (value is not UIThemeColor color)
                    return;

                // Canonical text is written whatever it holds; a semantic role has no colour to show and stays blank,
                // since resolving one here would freeze what the live theme decides.
                _ = target.Attribute("value", color.ToCanonical());

                ColorVariant? variant = color.Light ?? color.Dark;

                if (variant is null)
                    return;

                _ = root.Style("--ui-color-input-color", WebCssValues.ThemeColor(color));
                _ = root.Style("--ui-color-input-on-color", OnColor(color));

                // Both variants carry the text, because both are rendered.
                var described = Describe(color, format);

                foreach (IHtmlElementBuilder text in texts)
                    _ = text.Text(described);
            }, [WebDomOperation.Property("value", converter: WebDomConverters.ThemeColorCanonical)]);
        });
    }

    /// <summary>The text colour that reads on top, judged over the swatch's white checkerboard rather than the colour alone.</summary>
    private static string OnColor(UIThemeColor color)
    {
        ColorVariant? variant = color.Light ?? color.Dark;

        return variant is null
            ? "inherit"
            : WebCssValues.OnColorToken(variant.Value.IsLightOverWhite());
    }

    /// <summary>How the colour reads as text.</summary>
    private static string Describe(UIThemeColor color, UIColorTextFormat format)
    {
        ColorVariant? variant = color.Light ?? color.Dark;

        if (variant is null)
            return string.Empty;

        var hex = variant.Value.ToHex();

        if (format == UIColorTextFormat.Hex)
            return variant.Value.Opacity == byte.MaxValue ? hex[..7] : hex;

        System.Drawing.Color resolved = variant.Value.ToColor();

        return resolved.A == byte.MaxValue
            ? string.Create(CultureInfo.InvariantCulture, $"rgb({resolved.R}, {resolved.G}, {resolved.B})")
            : string.Create(CultureInfo.InvariantCulture, $"rgba({resolved.R}, {resolved.G}, {resolved.B}, {WebCssValues.Opacity(resolved.A)})");
    }
}
