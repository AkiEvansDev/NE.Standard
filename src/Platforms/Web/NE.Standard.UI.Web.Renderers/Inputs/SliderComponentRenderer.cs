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

/// <summary>Renders a slider as a native <c>&lt;input type="range"&gt;</c> with an optional value readout.</summary>
public sealed class SliderComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => SliderComponent.ComponentTypeKey;

    protected override string ClassName => "ui-slider";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);
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

        // One RenderProperty call per property, driving every target at once: registering the same property twice is rejected.
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

            _ = row.Element("span", track =>
            {
                _ = track.Class("ui-slider__track");

                // Written here so the bubble stands over the handle before any script runs.
                _ = track.Style("--ui-slider-fraction", Fraction(initialValue, initialMin, initialMax).ToString(CultureInfo.InvariantCulture));

                _ = track.Element("input", input =>
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

                    NativeInputRendererBase.RenderFormId(context, input);
                    NativeInputRendererBase.RenderFieldName(context, input);

                    NativeInputRendererBase.RenderIsReadOnlyAsDisabled(context, input);

                    // Clamped on the way out: a range input clamps silently, so an out-of-range value would leave
                    // the rendered handle and the server disagreeing.
                    _ = RenderProperty<decimal?>(context, input, IInputComponent.ValueProperty, (target, value) =>
                    {
                        if (Clamp(value, initialMin, initialMax) is decimal current)
                            _ = target.Attribute("value", current.ToString(CultureInfo.InvariantCulture));
                    }, [
                        WebDomOperation.Property("value"),
                        WebDomOperation.Text(target: ".ui-slider__value"),
                        WebDomOperation.Text(target: ".ui-slider__bubble")
                    ]);
                });

                // A range input paints its own handle, so the bubble has nothing in the DOM to anchor against without this.
                _ = track.Element("span", anchor => anchor.Class("ui-slider__thumb-anchor"));

                // After the input, so the states that show it are a sibling selector rather than a client-toggled class.
                _ = track.Element("span", bubble =>
                {
                    _ = bubble.Class("ui-slider__bubble");

                    if (Clamp(initialValue, initialMin, initialMax) is decimal initial)
                        _ = bubble.Text(initial.ToString(CultureInfo.InvariantCulture));
                });
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

        RenderValidationMessage(context, root);
    }

    /// <summary>Where the value sits between the bounds, 0 to 1; absent or equal bounds leave it at the start.</summary>
    private static decimal Fraction(decimal? value, decimal? min, decimal? max)
    {
        var lower = min ?? 0m;
        var upper = max ?? 100m;

        if (upper <= lower || Clamp(value, lower, upper) is not decimal current)
            return 0m;

        return (current - lower) / (upper - lower);
    }

    /// <summary>Brings a value inside the configured bounds; absent bounds constrain nothing.</summary>
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
