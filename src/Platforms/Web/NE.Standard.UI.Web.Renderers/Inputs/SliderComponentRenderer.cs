using System;
using System.Globalization;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// Renders a slider as a native <c>&lt;input type="range"&gt;</c> with an optional value readout; with <c>IsRange</c>, two of them on
/// one track, the band's start and its end.
/// </summary>
public sealed class SliderComponentRenderer : TextContentRendererBase
{
    private const string EndInputClass = "ui-slider__input--end";

    // A range's end handle and its readings: optional targets, since a property registers one list for both kinds of slider.
    private static readonly WebDomOperation[] EndValueOperations =
    [
        WebDomOperation.Property("value"),
        new WebDomOperation { Kind = nameof(WebDomOperationKind.Text), Target = ".ui-slider__value--end", Optional = true },
        new WebDomOperation { Kind = nameof(WebDomOperationKind.Text), Target = ".ui-slider__bubble--end", Optional = true }
    ];

    public override string ComponentTypeKey => SliderComponent.ComponentTypeKey;

    protected override string ClassName => "ui-slider";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = ResolveRenderValue(context, SliderComponent.IsRangeProperty, out bool? range, out _);
        var isRange = range == true;

        RenderTooltip(context, root);
        RenderInputSize(context, root);
        RenderInputHeader(context, root);

        _ = RenderProperty<UIOrientation?>(context, root, SliderComponent.OrientationProperty, static (target, value) =>
        {
            if (value is UIOrientation orientation)
                _ = target.Class(WebClassNames.Orientation(orientation));
        }, [WebDomOperation.Class(converter: WebDomConverters.OrientationClass)]);

        RenderFlagClass(context, root, SliderComponent.ShowValueProperty, "ui-slider--show-value");

        RenderFlagClass(context, root, SliderComponent.ShowRangeProperty, "ui-slider--show-range");

        // Two handles are one control to a screen reader: a group named by the caption, each handle by its end.
        if (isRange)
        {
            _ = root.Class("ui-slider--range");
            _ = root.Attribute("role", "group");

            RenderFieldLabel(context, root);
        }

        _ = RenderProperty<decimal?>(context, root, SliderComponent.MinDistanceProperty, static (target, value) =>
        {
            if (value is decimal distance)
                _ = target.Attribute(WebAttributes.SliderMinDistance, distance.ToString(CultureInfo.InvariantCulture));
        }, [WebDomOperation.Attribute(WebAttributes.SliderMinDistance)]);

        // One RenderProperty list per property, driving every target at once: registering the same property with another list is rejected.
        _ = ResolveRenderValue(context, IInputComponent.ValueProperty, out decimal? initialValue, out _);
        _ = ResolveRenderValue(context, SliderComponent.EndValueProperty, out decimal? initialEnd, out _);
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

                if (isRange)
                    _ = track.Style("--ui-slider-end-fraction", Fraction(initialEnd, initialMin, initialMax).ToString(CultureInfo.InvariantCulture));

                _ = track.Element("input", input =>
                {
                    RenderHandle(context, root, input, isRange ? UIStrings.SliderFrom : null, part: null);

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

                RenderBubble(track, Clamp(initialValue, initialMin, initialMax), end: false);

                if (!isRange)
                    return;

                // After the start's bubble: a patch reaches the first `.ui-slider__bubble` in the track, which is the start's.
                _ = track.Element("input", input =>
                {
                    RenderHandle(context, root, input, UIStrings.SliderTo, part: "end");

                    _ = input.Class(EndInputClass);
                    _ = input.Attribute(WebAttributes.ValueEnd);

                    _ = RenderProperty<decimal?>(context, input, SliderComponent.EndValueProperty, (target, value) =>
                    {
                        if (Clamp(value, initialMin, initialMax) is decimal current)
                            _ = target.Attribute("value", current.ToString(CultureInfo.InvariantCulture));
                    }, EndValueOperations);
                });

                RenderBubble(track, Clamp(initialEnd, initialMin, initialMax), end: true);
            });

            _ = row.Element("span", max =>
            {
                _ = max.Class("ui-slider__max");

                if (initialMax is decimal initial)
                    _ = max.Text(initial.ToString(CultureInfo.InvariantCulture));
            });

            if (isRange)
                RenderRangeReadout(row, Clamp(initialValue, initialMin, initialMax), Clamp(initialEnd, initialMin, initialMax));
            else
                RenderReadout(row, Clamp(initialValue, initialMin, initialMax), end: false);
        });

        RenderValidationMessage(context, root);
    }

    /// <summary>
    /// What both handles share: the bounds and the step, the form, read-only and the name — the caption's alone, or a band's end's
    /// <paramref name="words"/> under the group the caption names. The end's field is named apart from the start's by its <paramref name="part"/>.
    /// </summary>
    private static void RenderHandle(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder input, string? words, string? part)
    {
        _ = input.Class("ui-slider__input");
        _ = input.Attribute("type", "range");

        // The same lists on both handles, so a bound bound reaches both; the text beside the track is the first handle's to write.
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
        NativeInputRendererBase.RenderFieldName(context, input, part);
        NativeInputRendererBase.RenderIsReadOnlyAsAria(context, root, input);

        if (words is null)
            RenderFieldLabel(context, input);
        else
            WebWords.Write(context, input, "aria-label", words);
    }

    /// <summary>A handle's bubble, over it while held or under the keyboard; its anchor first, since a range input paints its own handle.</summary>
    private static void RenderBubble(IHtmlElementBuilder track, decimal? initial, bool end)
    {
        _ = track.Element("span", anchor =>
        {
            _ = anchor.Class("ui-slider__thumb-anchor");

            if (end)
                _ = anchor.Class("ui-slider__thumb-anchor--end");
        });

        // After the input, so the states that show it are a sibling selector rather than a client-toggled class.
        _ = track.Element("span", bubble =>
        {
            _ = bubble.Class("ui-slider__bubble");

            if (end)
                _ = bubble.Class("ui-slider__bubble--end");

            if (initial is decimal value)
                _ = bubble.Text(value.ToString(CultureInfo.InvariantCulture));
        });
    }

    /// <summary>The reading beside the track: one value, or one end of a band.</summary>
    private static void RenderReadout(IHtmlElementBuilder parent, decimal? initial, bool end)
    {
        _ = parent.Element("output", output =>
        {
            _ = output.Class("ui-slider__value");

            if (end)
                _ = output.Class("ui-slider__value--end");

            if (initial is decimal value)
                _ = output.Text(value.ToString(CultureInfo.InvariantCulture));
        });
    }

    /// <summary>A band's two readings, "20 – 80", each written as the single slider writes its value.</summary>
    private static void RenderRangeReadout(IHtmlElementBuilder row, decimal? start, decimal? end)
    {
        _ = row.Element("span", values =>
        {
            _ = values.Class("ui-slider__values");

            RenderReadout(values, start, end: false);

            _ = values.Element("span", dash =>
            {
                _ = dash.Class("ui-slider__dash");
                _ = dash.Text(" – ");
            });

            RenderReadout(values, end, end: true);
        });
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
