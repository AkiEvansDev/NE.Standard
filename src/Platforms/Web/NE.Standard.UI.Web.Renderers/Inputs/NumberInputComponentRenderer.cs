using System;
using System.Globalization;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// Renders a number field as <c>&lt;input type="text" inputmode="decimal"&gt;</c>, since a native number
/// input rejects a grouping comma and could not support <c>AllowThousandsSeparator</c>.
/// </summary>
public sealed class NumberInputComponentRenderer : TextContentRendererBase
{
    private static readonly WebDomOperation[] DisplayFormatOperations = [WebDomOperation.Attribute(WebAttributes.NumberFormat, target: "root")];

    private static readonly WebDomOperation[] ThousandsOperations =
    [
        WebDomOperation.ToggleAttribute(WebAttributes.NumberThousands, condition: WebValueCondition.IsTrue),
        WebDomOperation.ToggleAttribute(WebAttributes.NumberNoThousands, condition: WebValueCondition.IsFalse)
    ];

    protected override string ClassName => "ui-number-input";

    private static readonly WebDomOperation[] StepOperations = [WebDomOperation.Attribute(WebAttributes.NumberStep)];
    private static readonly WebDomOperation[] MinOperations = [WebDomOperation.Attribute(WebAttributes.NumberMin)];
    private static readonly WebDomOperation[] MaxOperations = [WebDomOperation.Attribute(WebAttributes.NumberMax)];
    private static readonly WebDomOperation[] ValueOperations = [WebDomOperation.Property("value")];

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
        NativeInputRendererBase.RenderClearable(context, root);

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

                // Three states in two flags, so a field left to its format carries neither.
                _ = RenderProperty<bool?>(context, input, NumberInputComponent.AllowThousandsSeparatorProperty, static (target, value) =>
                {
                    if (value is bool grouped)
                        _ = target.Attribute(grouped ? WebAttributes.NumberThousands : WebAttributes.NumberNoThousands);
                }, ThousandsOperations);

                RenderFlagAttribute(context, input, NumberInputComponent.TrimTrailingZerosProperty, WebAttributes.NumberTrimZeros);

                // Live like Min and Max: NumberInputEngine reads the attribute on every step press.
                _ = RenderProperty<decimal?>(context, input, NumberInputComponent.StepProperty, static (target, value) =>
                    _ = target.Attribute(WebAttributes.NumberStep, (value ?? 1m).ToString(CultureInfo.InvariantCulture)),
                StepOperations);

                // Min/Max stay live-patchable: resolving them statically would let a bound one compile and do nothing.
                _ = RenderProperty<decimal?>(context, input, NumberInputComponent.MinProperty, static (target, value) =>
                {
                    if (value is decimal min)
                        _ = target.Attribute(WebAttributes.NumberMin, min.ToString(CultureInfo.InvariantCulture));
                }, MinOperations);

                _ = RenderProperty<decimal?>(context, input, NumberInputComponent.MaxProperty, static (target, value) =>
                {
                    if (value is decimal max)
                        _ = target.Attribute(WebAttributes.NumberMax, max.ToString(CultureInfo.InvariantCulture));
                }, MaxOperations);

                NativeInputRendererBase.RenderPlaceholder(context, input, marksEmpty: true);
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
                        _ = target.Attribute("value", (trimZeros ? WebNumberFormat.WithoutTrailingZeros(current) : current).ToString(CultureInfo.InvariantCulture));
                }, ValueOperations);
            });

            _ = row.Element("span", suffix => RenderInputAffixText(context, suffix, suffix: true));

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            NativeInputRendererBase.RenderClearButton(context, row, $"{ClassName}__clear");

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
