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
    protected override string ClassName => "ui-number-input";

    public override string ComponentTypeKey => NumberInputComponent.ComponentTypeKey;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);

        _ = RenderProperty<bool?>(context, root, NumberInputComponent.ShowStepperProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-number-input--stepper");
        }, [WebDomOperation.ToggleClass("ui-number-input--stepper")]);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root);

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{ClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = row.Element("span", prefix => RenderInputAffixText(context, prefix, suffix: false));

            _ = row.Element("input", input =>
            {
                _ = input.Class($"{ClassName}__field");
                _ = input.Class("ui-field");
                _ = input.Attribute("type", "text");
                _ = input.Attribute("inputmode", "decimal");
                _ = input.Attribute("autocomplete", "off");

                _ = RenderProperty<bool?>(context, input, NumberInputComponent.AllowDecimalsProperty, static (target, value) =>
                {
                    if (value == false)
                        _ = target.Attribute(WebAttributes.NumberNoDecimals);
                }, [WebDomOperation.ToggleAttribute(WebAttributes.NumberNoDecimals, condition: WebValueCondition.IsFalse)]);

                _ = RenderProperty<bool?>(context, input, NumberInputComponent.AllowNegativeProperty, static (target, value) =>
                {
                    if (value == false)
                        _ = target.Attribute(WebAttributes.NumberNoNegative);
                }, [WebDomOperation.ToggleAttribute(WebAttributes.NumberNoNegative, condition: WebValueCondition.IsFalse)]);

                _ = RenderProperty<bool?>(context, input, NumberInputComponent.AllowThousandsSeparatorProperty, static (target, value) =>
                {
                    if (value == false)
                        _ = target.Attribute(WebAttributes.NumberNoThousands);
                }, [WebDomOperation.ToggleAttribute(WebAttributes.NumberNoThousands, condition: WebValueCondition.IsFalse)]);

                _ = RenderProperty<bool?>(context, input, NumberInputComponent.TrimTrailingZerosProperty, static (target, value) =>
                {
                    if (value == true)
                        _ = target.Attribute(WebAttributes.NumberTrimZeros);
                }, [WebDomOperation.ToggleAttribute(WebAttributes.NumberTrimZeros, condition: WebValueCondition.IsTrue)]);

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
                NativeInputRendererBase.RenderIsReadOnly(context, input);

                _ = RenderProperty<decimal?>(context, input, IInputComponent.ValueProperty, static (target, value) =>
                {
                    if (value is decimal current)
                        _ = target.Attribute("value", current.ToString(CultureInfo.InvariantCulture));
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
}
