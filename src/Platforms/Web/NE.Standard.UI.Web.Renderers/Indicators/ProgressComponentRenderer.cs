using System;
using System.Globalization;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Indicators;

public sealed class ProgressComponentRenderer : WebComponentRendererBase
{
    // Read by the stylesheet alone, so a named constant here rather than one in WebAttributes, which holds what the client script reads.
    private const string ValueShownAttribute = "data-ui-progress-value";

    public override string ComponentTypeKey => ProgressComponent.ComponentTypeKey;

    protected override string ClassName => "ui-progress";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<UIProgressVariant?>(context, root, ProgressComponent.VariantProperty, static (target, value) =>
        {
            if (value is UIProgressVariant variant)
                _ = target.Class(WebClassNames.ProgressVariant(variant));
        }, [WebDomOperation.Class(converter: WebDomConverters.ProgressVariantClass)]);

        ThemeColorRenderer.RenderThemeColor(context, root, ProgressComponent.ColorProperty);

        _ = RenderProperty<decimal?>(context, root, ProgressComponent.MinProperty, static (target, value)
            => target.Style("--ui-progress-min", (value ?? 0m).ToString(CultureInfo.InvariantCulture)), [WebDomOperation.Style("--ui-progress-min")]);

        _ = RenderProperty<decimal?>(context, root, ProgressComponent.MaxProperty, static (target, value)
            => target.Style("--ui-progress-max", (value ?? 100m).ToString(CultureInfo.InvariantCulture)), [WebDomOperation.Style("--ui-progress-max")]);

        _ = RenderProperty<bool?>(context, root, ProgressComponent.ShowValueProperty, (target, value) =>
        {
            if (value == true)
                _ = root.Attribute(ValueShownAttribute);
        }, [WebDomOperation.ToggleAttribute(ValueShownAttribute, condition: WebValueCondition.IsTrue)]);

        _ = root.Element("span", label =>
        {
            _ = label.Class("ui-progress__label");

            _ = RenderProperty<string?>(context, label, ProgressComponent.LabelProperty, static (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                    _ = target.Text(value);
            }, [WebDomOperation.Text()]);
        });

        _ = root.Element("span", track =>
        {
            _ = track.Class("ui-progress__track");
            _ = track.Element("span", fill => fill.Class("ui-progress__fill"));
        });

        _ = ResolveRenderValue(context, ProgressComponent.ValueProperty, out decimal? initialValue, out _);

        // Ring and reading share a box so the reading centres on the ring, not on the component.
        _ = root.Element("span", dial =>
        {
            _ = dial.Class("ui-progress__dial");

            // Stroked circles, not a masked conic gradient (poor antialiasing); both variants stay in the DOM since Variant is bindable.
            // The reading is a full circle cut to its share by the stylesheet, with a dot at each end rather than a dash.
            _ = dial.Element("svg", ring =>
            {
                _ = ring.Class("ui-progress__ring");
                _ = ring.Attribute("viewBox", "0 0 36 36");
                _ = ring.Attribute("aria-hidden", "true");
                _ = ring.Attribute("focusable", "false");
                _ = ring.Element("circle", track => RenderRingCircle(track, "ui-progress__ring-track"));
                _ = ring.Element("g", fill =>
                {
                    _ = fill.Class("ui-progress__ring-fill");
                    _ = fill.Element("circle", arc => RenderRingCircle(arc, "ui-progress__ring-arc"));
                    _ = fill.Element("circle", cap => RenderRingCap(cap, "ui-progress__ring-cap"));
                    _ = fill.Element("circle", cap => RenderRingCap(cap, "ui-progress__ring-cap ui-progress__ring-cap--end"));
                });
            });

            _ = dial.Element("span", valueText =>
            {
                _ = valueText.Class("ui-progress__value");
                _ = valueText.Element("span", number =>
                {
                    _ = number.Class("ui-progress__number");
                    _ = number.Text(FormatValue(initialValue));
                });

                _ = valueText.Element("span", unit =>
                {
                    _ = unit.Class("ui-progress__unit");

                    _ = RenderProperty<string?>(context, unit, ProgressComponent.ValueUnitProperty, static (target, value) =>
                    {
                        if (!string.IsNullOrWhiteSpace(value))
                            _ = target.Text(value);
                    }, [WebDomOperation.Text()]);
                });
            });
        });

        _ = RenderProperty<decimal?>(context, root, ProgressComponent.ValueProperty, static (target, value)
            => target.Style("--ui-progress-value", (value ?? 0m).ToString(CultureInfo.InvariantCulture)),
        [
            WebDomOperation.Style("--ui-progress-value"),
            WebDomOperation.Text(target: ".ui-progress__number", converter: WebDomConverters.ProgressValueText)
        ]);
    }

    // Radius plus half the stroke must equal the box half (16 + 2 of 18), or the ring's outer edge overhangs.
    private static IHtmlElementBuilder RenderRingCircle(IHtmlElementBuilder circle, string className)
        => circle
            .Class(className)
            .Attribute("cx", "18")
            .Attribute("cy", "18")
            .Attribute("r", "16");

    // A round end stands on the ring at three o'clock; the stylesheet turns it about the centre to the end it marks.
    private static IHtmlElementBuilder RenderRingCap(IHtmlElementBuilder circle, string className)
        => circle
            .Class(className)
            .Attribute("cx", "34")
            .Attribute("cy", "18");

    /// <summary>The reading is the value itself, never a percentage of the range; unset prints nothing.</summary>
    private static string FormatValue(decimal? value)
        => value is decimal number ? number.ToString(CultureInfo.InvariantCulture) : string.Empty;
}
