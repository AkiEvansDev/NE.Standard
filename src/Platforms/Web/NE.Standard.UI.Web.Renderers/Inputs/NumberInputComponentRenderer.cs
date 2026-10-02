using System;
using System.Globalization;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// Renders a number field as <c>&lt;input type="text" inputmode="decimal"&gt;</c>, since a native number
/// input rejects a grouping comma and could not support <c>AllowThousandsSeparator</c>.
/// </summary>
public sealed class NumberInputComponentRenderer : TextContentRendererBase
{
    private static readonly WebDomOperation[] DisplayFormatOperations = [WebDomOperation.Attribute(WebAttributes.NumberFormat, target: "root")];

    protected override string ClassName => "ui-number-input";

    public override string ComponentTypeKey => NumberInputComponent.ComponentTypeKey;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);

        // How the client writes the value: the culture's separators and the author's format. The value itself stays invariant, as it
        // travels.
        NumberCultureRenderer.RenderNumberCulture(root, ResolveInputCulture(context));

        // A field in the page's culture follows the page's language: a switch writes its pack again and the field redraws.
        _ = ResolveRenderValue(context, IFormattedInputComponent.CultureProperty, out string? authoredCulture, out _);

        if (string.IsNullOrWhiteSpace(authoredCulture))
            _ = root.Attribute(WebAttributes.PageCulture);

        _ = RenderProperty<string?>(context, root, IFormattedInputComponent.DisplayFormatProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.NumberFormat, value);
        }, DisplayFormatOperations);

        RenderFlagClass(context, root, NumberInputComponent.ShowStepperProperty, "ui-number-input--stepper");

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root, titleCanGoInside: true);

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{ClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            RenderInputHeaderInside(context, root, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = row.Element("span", prefix => RenderInputAffixText(context, prefix, suffix: false));

            _ = row.Element("input", input =>
            {
                _ = input.Class($"{ClassName}__field");
                _ = input.Class("ui-field");
                _ = input.Attribute("type", "text");
                _ = input.Attribute("inputmode", "decimal");
                _ = input.Attribute("autocomplete", "off");

                RenderFlagAttribute(context, input, NumberInputComponent.AllowDecimalsProperty, WebAttributes.NumberNoDecimals, WebValueCondition.IsFalse);

                RenderFlagAttribute(context, input, NumberInputComponent.AllowNegativeProperty, WebAttributes.NumberNoNegative, WebValueCondition.IsFalse);

                RenderFlagAttribute(context, input, NumberInputComponent.AllowThousandsSeparatorProperty, WebAttributes.NumberNoThousands, WebValueCondition.IsFalse);

                RenderFlagAttribute(context, input, NumberInputComponent.TrimTrailingZerosProperty, WebAttributes.NumberTrimZeros);

                // Live like Min and Max: NumberInputEngine reads the attribute on every step press.
                _ = RenderProperty<decimal?>(context, input, NumberInputComponent.StepProperty, static (target, value) =>
                    _ = target.Attribute(WebAttributes.NumberStep, (value ?? 1m).ToString(CultureInfo.InvariantCulture)),
                [WebDomOperation.Attribute(WebAttributes.NumberStep)]);

                // Min/Max stay live-patchable: resolving them statically would let a bound one compile and do nothing.
                _ = RenderProperty<decimal?>(context, input, NumberInputComponent.MinProperty, static (target, value) =>
                {
                    if (value is decimal min)
                        _ = target.Attribute(WebAttributes.NumberMin, min.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Attribute(WebAttributes.NumberMin)]);

                _ = RenderProperty<decimal?>(context, input, NumberInputComponent.MaxProperty, static (target, value) =>
                {
                    if (value is decimal max)
                        _ = target.Attribute(WebAttributes.NumberMax, max.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Attribute(WebAttributes.NumberMax)]);

                NativeInputRendererBase.RenderPlaceholder(context, input);
                NativeInputRendererBase.RenderFormId(context, input);
                NativeInputRendererBase.RenderFieldName(context, input);
                NativeInputRendererBase.RenderIsReadOnly(context, root, input);
                RenderFieldLabel(context, input);

                // Trimmed here too, so the first paint shows what the client shows once it runs; a push the client trims itself.
                _ = ResolveRenderValue(context, NumberInputComponent.TrimTrailingZerosProperty, out bool? trim, out _);
                var trimZeros = trim == true;

                _ = RenderProperty<decimal?>(context, input, IInputComponent.ValueProperty, (target, value) =>
                {
                    if (value is decimal current)
                        _ = target.Attribute("value", trimZeros ? TrimTrailingZeros(current) : current.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Property("value")]);
            });

            _ = row.Element("span", suffix => RenderInputAffixText(context, suffix, suffix: true));

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            // Custom step buttons: a text input has no spinner, and the native one could not be themed.
            _ = row.Element("span", stepper =>
            {
                _ = stepper.Class($"{ClassName}__stepper");
                RenderStepButton(stepper, $"{ClassName}__step-up", WebAttributes.NumberStepDirection, "up");
                RenderStepButton(stepper, $"{ClassName}__step-down", WebAttributes.NumberStepDirection, "down");
            });
        });

        RenderValidationMessage(context, root);
    }

    /// <summary>A value's invariant text without the zeros its scale carries past the last digit (<c>1.500</c> as <c>1.5</c>).</summary>
    internal static string TrimTrailingZeros(decimal value)
    {
        var text = value.ToString(CultureInfo.InvariantCulture);

        return text.Contains('.', StringComparison.Ordinal) ? text.TrimEnd('0').TrimEnd('.') : text;
    }
}
