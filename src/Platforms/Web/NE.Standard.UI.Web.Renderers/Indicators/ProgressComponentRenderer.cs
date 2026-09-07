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
                _ = root.Attribute("data-ui-progress-value");
        }, [WebDomOperation.ToggleAttribute("data-ui-progress-value", condition: WebValueCondition.IsTrue)]);

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

            // Stroked circles, not a masked conic gradient, which antialiases badly; both variants stay in the DOM as Variant is bindable.
            _ = dial.Element("svg", ring =>
            {
                _ = ring.Class("ui-progress__ring");
                _ = ring.Attribute("viewBox", "0 0 36 36");
                _ = ring.Attribute("aria-hidden", "true");
                _ = ring.Attribute("focusable", "false");
                _ = ring.Element("circle", track => RenderRingCircle(track, "ui-progress__ring-track"));
                // Zero is at three o'clock in SVG, and a reading starts at the top.
                _ = ring.Element("circle", fill => RenderRingCircle(fill, "ui-progress__ring-fill").Attribute("transform", "rotate(-90 18 18)"));
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
            .Attribute("r", "16")
            .Attribute("pathLength", "100");

    /// <summary>The reading is the value itself, never a percentage of the range; unset prints nothing.</summary>
    private static string FormatValue(decimal? value)
        => value is decimal number ? number.ToString(CultureInfo.InvariantCulture) : string.Empty;
}
