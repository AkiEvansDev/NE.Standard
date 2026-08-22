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

        _ = root.Element("span", track =>
        {
            _ = track.Class("ui-progress__track");
            _ = track.Element("span", fill => fill.Class("ui-progress__fill"));
        });

        _ = ResolveRenderValue(context, ProgressComponent.ValueProperty, out decimal? initialValue, out _);

        _ = root.Element("span", valueText =>
        {
            _ = valueText.Class("ui-progress__value");
            _ = valueText.Text($"{ComputePercent(initialValue)}%");
        });

        _ = RenderProperty<decimal?>(context, root, ProgressComponent.ValueProperty, static (target, value)
            => target.Style("--ui-progress-value", (value ?? 0m).ToString(CultureInfo.InvariantCulture)),
        [
            WebDomOperation.Style("--ui-progress-value"),
            WebDomOperation.Text(target: ".ui-progress__value", converter: WebDomConverters.ProgressPercentText)
        ]);
    }

    private static int ComputePercent(decimal? value)
        => (int)Math.Round(Math.Clamp(value ?? 0m, 0m, 100m), MidpointRounding.AwayFromZero);
}
