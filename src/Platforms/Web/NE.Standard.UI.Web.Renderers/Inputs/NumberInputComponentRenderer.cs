using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// Renders as <c>&lt;input type="text" inputmode="decimal"&gt;</c> rather than a native
/// <c>&lt;input type="number"&gt;</c> — a native number input hard-rejects any non-numeric character
/// typed into it (including a grouping comma), so <c>AllowThousandsSeparator</c> is structurally
/// impossible to support on top of one. <c>NumberInputEngine</c> (client) does everything the native
/// type gave for free: keystroke-level filtering for <c>AllowDecimals</c>/<c>AllowNegative</c>,
/// display-time thousands-separator grouping (stripped back to a clean digit string on focus, so typing
/// is never fighting inserted commas), and trailing-zero trimming on blur. The tradeoff is losing the
/// native spin buttons and native <c>:invalid</c> range styling — <c>ShowStepper</c> is preserved via a
/// pair of custom step buttons instead (<c>data-ui-number-step</c>/<c>data-ui-number-min</c>/
/// <c>data-ui-number-max</c> carry the values <c>NumberInputEngine</c> needs for them), and Min/Max/Step
/// enforcement remains exactly as unenforced by the authoring setter as it already was — this renderer
/// doesn't newly regress that, and the native type never enforced it either beyond weak <c>:invalid</c>
/// styling nothing here relied on. The live value is clamped instead, on both paths.
/// </summary>
public sealed class NumberInputComponentRenderer : TextContentRendererBase
{
    protected override string ClassName => "ui-number-input";

    public override string ComponentTypeKey => NumberInputComponent.ComponentTypeKey;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<string?>(context, root, ITextBaseComponent.TooltipProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("title", value);
        }, [WebDomOperation.Attribute("title")]);

        _ = RenderProperty<bool?>(context, root, NumberInputComponent.ShowStepperProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-number-input--stepper");
        }, [WebDomOperation.ToggleClass("ui-number-input--stepper")]);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root);

        _ = root.Element("span", row =>
        {
            _ = row.Class("ui-number-input__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = row.Element("span", prefix => RenderAffix(context, prefix, NumberInputComponent.PrefixTextProperty, "prefix"));

            _ = row.Element("input", input =>
            {
                _ = input.Class("ui-number-input__field");
                _ = input.Attribute("type", "text");
                _ = input.Attribute("inputmode", "decimal");
                _ = input.Attribute("autocomplete", "off");

                _ = RenderProperty<bool?>(context, input, NumberInputComponent.AllowDecimalsProperty, static (target, value) =>
                {
                    if (value == false)
                        _ = target.Attribute("data-ui-number-no-decimals");
                }, [WebDomOperation.ToggleAttribute("data-ui-number-no-decimals", condition: WebValueCondition.IsFalse)]);

                _ = RenderProperty<bool?>(context, input, NumberInputComponent.AllowNegativeProperty, static (target, value) =>
                {
                    if (value == false)
                        _ = target.Attribute("data-ui-number-no-negative");
                }, [WebDomOperation.ToggleAttribute("data-ui-number-no-negative", condition: WebValueCondition.IsFalse)]);

                _ = RenderProperty<bool?>(context, input, NumberInputComponent.AllowThousandsSeparatorProperty, static (target, value) =>
                {
                    if (value == false)
                        _ = target.Attribute("data-ui-number-no-thousands");
                }, [WebDomOperation.ToggleAttribute("data-ui-number-no-thousands", condition: WebValueCondition.IsFalse)]);

                _ = RenderProperty<bool?>(context, input, NumberInputComponent.TrimTrailingZerosProperty, static (target, value) =>
                {
                    if (value == true)
                        _ = target.Attribute("data-ui-number-trim-zeros");
                }, [WebDomOperation.ToggleAttribute("data-ui-number-trim-zeros", condition: WebValueCondition.IsTrue)]);

                // Step is resolved once — it is declared unbindable, matching the temporal inputs' own Step,
                // since a running app does not flip a field's granularity.
                _ = ResolveRenderValue(context, NumberInputComponent.StepProperty, out decimal? step, out _);
                _ = input.Attribute("data-ui-number-step", (step ?? 1m).ToString(CultureInfo.InvariantCulture));

                // Min/Max stay live-patchable. They are declared on the shared MinMaxInputComponentBase, where
                // the temporal inputs bind them, so resolving them statically here would have let a bound one
                // compile and silently do nothing. NumberInputEngine re-reads both attributes on every step
                // click, so a patched bound is in force immediately.
                _ = RenderProperty<decimal?>(context, input, NumberInputComponent.MinProperty, static (target, value) =>
                {
                    if (value is decimal min)
                        _ = target.Attribute("data-ui-number-min", min.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Attribute("data-ui-number-min")]);

                _ = RenderProperty<decimal?>(context, input, NumberInputComponent.MaxProperty, static (target, value) =>
                {
                    if (value is decimal max)
                        _ = target.Attribute("data-ui-number-max", max.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Attribute("data-ui-number-max")]);

                NativeInputRendererBase.RenderFormId(context, input);
                NativeInputRendererBase.RenderIsReadOnly(context, input);

                _ = RenderProperty<decimal?>(context, input, IInputComponent.ValueProperty, static (target, value) =>
                {
                    if (value is decimal current)
                        _ = target.Attribute("value", current.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Property("value")]);
            });

            _ = row.Element("span", suffix => RenderAffix(context, suffix, NumberInputComponent.SuffixTextProperty, "suffix"));

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            // Custom step buttons rather than the native spinner: a text input has none, and the native
            // number input's own could not be themed.
            _ = row.Element("span", stepper =>
            {
                _ = stepper.Class("ui-number-input__stepper");
                RenderStepButton(stepper, "ui-number-input__step-up", "up");
                RenderStepButton(stepper, "ui-number-input__step-down", "down");
            });
        });

        RenderValidationMessage(root, "ui-number-input__message");
    }


    private static void RenderStepButton(IHtmlElementBuilder row, string className, string direction)
    {
        _ = row.Element("button", step =>
        {
            _ = step.Class(className);
            _ = step.Attribute("type", "button");
            _ = step.Attribute("tabindex", "-1");
            _ = step.Attribute("data-ui-number-step-direction", direction);
        });
    }

    private static void RenderAffix(WebRenderContext context, IHtmlElementBuilder affix, UIProperty property, string modifier)
    {
        _ = affix.Class("ui-number-input__affix");
        _ = affix.Class($"ui-number-input__affix--{modifier}");

        _ = RenderProperty<string?>(context, affix, property, (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Text(value);
        }, [WebDomOperation.Text()]);
    }
}
