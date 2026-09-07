using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Colors;
using NE.Standard.UI.Abstractions.Binding.Properties;
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
    private const string OpacityShownAttribute = "data-ui-color-opacity-shown";

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
        RenderReadOnly(context, root);
        RenderInputAppearance(context, root);
        RenderInputHeader(context, root);

        // Both variants and both panes are always rendered, the root says which show: no DOM operation swaps elements.
        List<IHtmlElementBuilder> texts = [];

        RenderRow(context, root, texts.Add);
        RenderSwatchButton(context, root, texts.Add);
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

    /// <summary>Which variant shows, and which of the popup's parts are offered — all four on the root.</summary>
    private static void RenderPresentation(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = RenderProperty<UIColorInputVariant?>(context, root, ColorInputComponent.VariantProperty, static (target, value)
            => target.Attribute(WebAttributes.ColorVariant, value == UIColorInputVariant.Swatch ? "swatch" : "field"),
            [WebDomOperation.Attribute(WebAttributes.ColorVariant, converter: WebDomConverters.ColorInputVariantAttribute)]);

        RenderOffered(context, root, ColorInputComponent.ShowPickerProperty, WebAttributes.ColorPicker);
        RenderOffered(context, root, ColorInputComponent.ShowPaletteProperty, WebAttributes.ColorPalette);
        RenderOffered(context, root, ColorInputComponent.ShowOpacityProperty, OpacityShownAttribute);
    }

    private static void RenderOffered(WebRenderContext context, IHtmlElementBuilder root, UIProperty property, string attribute)
    {
        _ = RenderProperty<bool?>(context, root, property, (target, value) =>
        {
            if (value != false)
                _ = target.Attribute(attribute);
        }, [WebDomOperation.ToggleAttribute(attribute, condition: WebValueCondition.IsTrue)]);
    }

    /// <summary>Read-only on the root, because it is the whole control that stops answering.</summary>
    private static void RenderReadOnly(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = RenderProperty<bool?>(context, root, IInputComponent.IsReadOnlyProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute(WebAttributes.ColorReadonly);
        }, [WebDomOperation.ToggleAttribute(WebAttributes.ColorReadonly, condition: WebValueCondition.IsTrue)]);
    }

    /// <summary>The field variant: a swatch, the colour written beside it, and the button that opens the picker.</summary>
    private static void RenderRow(WebRenderContext context, IHtmlElementBuilder root, Action<IHtmlElementBuilder> onText)
    {
        _ = root.Element("span", row =>
        {
            _ = row.Class("ui-color-input__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            _ = row.Element("span", element => element.Class("ui-color-input__swatch"));

            _ = row.Element("span", element =>
            {
                _ = element.Class("ui-color-input__text");
                onText(element);
            });

            RenderPopupToggle(row, "ui-color-input__toggle", WebAttributes.ColorToggle);
        });
    }

    /// <summary>The swatch variant: the colour itself, with its own text across it, and nothing else.</summary>
    private static void RenderSwatchButton(WebRenderContext context, IHtmlElementBuilder root, Action<IHtmlElementBuilder> onText)
    {
        RenderPopupToggle(root, "ui-color-input__swatch ui-color-input__swatch--button", WebAttributes.ColorToggle, button =>
        {
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

            RenderTab(tabs, PickerPane, context.Translate(UIStrings.ColorPicker));
            RenderTab(tabs, PalettePane, context.Translate(UIStrings.ColorPalette));
        });
    }

    private static void RenderTab(IHtmlElementBuilder tabs, string pane, string caption)
    {
        _ = tabs.Element("button", tab =>
        {
            _ = tab.Class("ui-color-input__tab");
            _ = tab.Attribute("type", "button");
            _ = tab.Attribute(WebAttributes.ColorTab, pane);
            _ = tab.Text(caption);
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

                RenderTextField(fields, "hex", context.Translate(UIStrings.ColorHex), WebAttributes.ColorHex);
                RenderChannelField(fields, context.Translate(UIStrings.ColorRed), "r");
                RenderChannelField(fields, context.Translate(UIStrings.ColorGreen), "g");
                RenderChannelField(fields, context.Translate(UIStrings.ColorBlue), "b");
            });

            RenderOpacitySlider(context, pane);
        });
    }

    /// <summary>The palette: every named colour, a signed shade-to-tint slider, and one for opacity.</summary>
    private static void RenderPalettePane(WebRenderContext context, IHtmlElementBuilder popup)
    {
        _ = popup.Element("div", pane =>
        {
            _ = pane.Class("ui-color-input__pane");
            _ = pane.Attribute(WebAttributes.ColorPane, PalettePane);

            _ = pane.Element("div", grid =>
            {
                _ = grid.Class("ui-color-input__grid");

                foreach (ColorName name in Enum.GetValues<ColorName>())
                    RenderChip(grid, name);
            });

            RenderSlider(pane, context.Translate(UIStrings.ColorFactor), WebAttributes.ColorFactor, -ColorVariant.MaxFactor, ColorVariant.MaxFactor, 0);

            RenderOpacitySlider(context, pane);
        });
    }

    private static void RenderChip(IHtmlElementBuilder grid, ColorName name)
    {
        _ = grid.Element("button", chip =>
        {
            _ = chip.Class("ui-color-input__chip");
            _ = chip.Attribute("type", "button");
            // The palette name is the colour's identifier, on both sides of the wire, so it is shown as it is spelled.
            _ = chip.Attribute(WebAttributes.Tooltip, name.ToString());
            _ = chip.Attribute(WebAttributes.ColorName, name.ToString());
            _ = chip.Style("--ui-color-input-chip", new ColorVariant(name).ToHex());
        });
    }

    private static void RenderTextField(IHtmlElementBuilder fields, string key, string label, string attribute)
    {
        _ = fields.Element("label", field =>
        {
            _ = field.Class("ui-color-input__field");
            _ = field.Element("span", caption => caption.Class("ui-color-input__field-label").Text(label));
            _ = field.Element("input", input =>
            {
                _ = input.Class($"ui-color-input__field-input ui-color-input__field-input--{key}");
                _ = input.Attribute("type", "text");
                _ = input.Attribute("autocomplete", "off");
                _ = input.Attribute(attribute);
            });
        });
    }

    private static void RenderChannelField(IHtmlElementBuilder fields, string label, string channel)
    {
        _ = fields.Element("label", field =>
        {
            _ = field.Class("ui-color-input__field");
            _ = field.Element("span", caption => caption.Class("ui-color-input__field-label").Text(label));
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
        => RenderSlider(pane, context.Translate(UIStrings.ColorOpacity), WebAttributes.ColorOpacity, 0, 255, 255);

    private static void RenderSlider(IHtmlElementBuilder pane, string label, string attribute, int min, int max, int value)
    {
        _ = pane.Element("label", row =>
        {
            _ = row.Class("ui-color-input__slider");
            _ = row.Element("span", caption => caption.Class("ui-color-input__field-label").Text(label));
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
