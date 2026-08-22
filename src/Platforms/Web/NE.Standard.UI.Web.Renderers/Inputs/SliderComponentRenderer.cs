using System;
using System.Globalization;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A plain native <c>&lt;input type="range"&gt;</c> — unlike Select/RadioGroup, a slider has no
/// per-item template concern, so drag/keyboard interaction, min/max/step clamping and live dragging all
/// come from the browser for free. The optional live value readout (<c>ShowValue</c>) is the one thing
/// that needs client JS: it has to track the input's value on every "input" event (while dragging, before
/// the value commits on "change"), which is a purely cosmetic echo handled by <c>RangeValueEngine</c>.
/// </summary>
public sealed class SliderComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => SliderComponent.ComponentTypeKey;

    protected override string ClassName => "ui-slider";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderInputTooltip(context, root);
        RenderInputHeader(context, root);

        _ = RenderProperty<UIOrientation?>(context, root, SliderComponent.OrientationProperty, static (target, value) =>
        {
            if (value is UIOrientation orientation)
                _ = target.Class(WebClassNames.Orientation(orientation));
        }, [WebDomOperation.Class(converter: WebDomConverters.OrientationClass)]);

        _ = RenderProperty<bool?>(context, root, SliderComponent.ShowValueProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-slider--show-value");
        }, [WebDomOperation.ToggleClass("ui-slider--show-value")]);

        _ = RenderProperty<bool?>(context, root, SliderComponent.ShowRangeProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-slider--show-range");
        }, [WebDomOperation.ToggleClass("ui-slider--show-range")]);

        // Value drives two targets at once (the range input's own `value` and the readout's text) — a
        // single RenderProperty call can only ever register ONE canonical operations list, so this
        // consolidates both into one call (see ProgressComponentRenderer for the same technique) instead
        // of registering the same property twice, which the framework rejects. Min/Max follow the same
        // shape below, each additionally driving a range-end label's text alongside the input's own attribute.
        _ = ResolveRenderValue(context, IInputComponent.ValueProperty, out decimal? initialValue, out _);
        _ = ResolveRenderValue(context, SliderComponent.MinProperty, out decimal? initialMin, out _);
        _ = ResolveRenderValue(context, SliderComponent.MaxProperty, out decimal? initialMax, out _);

        _ = root.Element("span", row =>
        {
            _ = row.Class("ui-slider__row");

            _ = row.Element("span", min =>
            {
                _ = min.Class("ui-slider__min");

                if (initialMin is decimal initial)
                    _ = min.Text(initial.ToString(CultureInfo.InvariantCulture));
            });

            _ = row.Element("input", input =>
            {
                _ = input.Class("ui-slider__input");
                _ = input.Attribute("type", "range");

                _ = RenderProperty<decimal?>(context, input, SliderComponent.MinProperty, static (target, value) =>
                {
                    if (value is decimal min)
                        _ = target.Attribute("min", min.ToString(CultureInfo.InvariantCulture));
                }, [
                    WebDomOperation.Attribute("min"),
                    WebDomOperation.Text(target: ".ui-slider__min")
                ]);

                _ = RenderProperty<decimal?>(context, input, SliderComponent.MaxProperty, static (target, value) =>
                {
                    if (value is decimal max)
                        _ = target.Attribute("max", max.ToString(CultureInfo.InvariantCulture));
                }, [
                    WebDomOperation.Attribute("max"),
                    WebDomOperation.Text(target: ".ui-slider__max")
                ]);

                _ = RenderProperty<decimal?>(context, input, SliderComponent.StepProperty, static (target, value) =>
                {
                    if (value is decimal step)
                        _ = target.Attribute("step", step.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Attribute("step")]);

                _ = RenderProperty<string?>(context, input, IInputComponent.FormIdProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Attribute("data-ui-form-id", value);
                }, [WebDomOperation.Attribute("data-ui-form-id")]);

                _ = RenderProperty<bool?>(context, input, IInputComponent.IsReadOnlyProperty, static (target, value) =>
                {
                    if (value == true)
                        _ = target.Attribute("disabled");
                }, [WebDomOperation.ToggleAttribute("disabled", condition: WebValueCondition.IsTrue)]);

                // Clamped on the way out: a range input silently clamps whatever it is given, so an
                // out-of-range value would leave the rendered handle and the server disagreeing with
                // nothing to reconcile them. Writing the clamped value means both sides start out saying
                // the same thing; the client half (a value pushed later) is handled by RangeValueEngine.
                _ = RenderProperty<decimal?>(context, input, IInputComponent.ValueProperty, (target, value) =>
                {
                    if (Clamp(value, initialMin, initialMax) is decimal current)
                        _ = target.Attribute("value", current.ToString(CultureInfo.InvariantCulture));
                }, [
                    WebDomOperation.Property("value"),
                    WebDomOperation.Text(target: ".ui-slider__value")
                ]);
            });

            _ = row.Element("span", max =>
            {
                _ = max.Class("ui-slider__max");

                if (initialMax is decimal initial)
                    _ = max.Text(initial.ToString(CultureInfo.InvariantCulture));
            });

            _ = row.Element("output", output =>
            {
                _ = output.Class("ui-slider__value");

                if (Clamp(initialValue, initialMin, initialMax) is decimal initial)
                    _ = output.Text(initial.ToString(CultureInfo.InvariantCulture));
            });
        });

        RenderValidationMessage(root, "ui-slider__message");
    }

    /// <summary>
    /// Brings a value inside the configured bounds — the same thing the browser does to a range input,
    /// done here so the value the server rendered and the one the DOM shows cannot disagree. Bounds that
    /// are absent constrain nothing.
    /// </summary>
    private static decimal? Clamp(decimal? value, decimal? min, decimal? max)
    {
        if (value is not decimal current)
            return null;

        if (min is decimal lower && current < lower)
            current = lower;

        if (max is decimal upper && current > upper)
            current = upper;

        return current;
    }
}
