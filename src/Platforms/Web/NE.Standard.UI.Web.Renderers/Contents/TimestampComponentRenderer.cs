using System;
using System.Globalization;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

/// <summary>
/// A <c>&lt;time&gt;</c> whose <c>datetime</c> is the instant; <c>timestamp-engine.ts</c> writes it in the reader's zone, in the patterns
/// the page's words table carries, and keeps a relative one current.
/// </summary>
/// <remarks>
/// The first paint is <see cref="WebMoments.FirstPaint"/> — the instant in UTC in the page's names and the application's patterns,
/// said to be UTC where it shows a clock, since a time with no zone named would read as the reader's own — as a moment in a phrase's
/// words is painted. The boot script finds that text as the body is parsed and writes it in the reader's zone before the first paint.
/// </remarks>
public sealed class TimestampComponentRenderer : WebComponentRendererBase
{
    private static readonly WebDomOperation[] DateTimeOperations = [WebDomOperation.Attribute("datetime")];

    public override string ComponentTypeKey => TimestampComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Timestamp;

    protected override string ElementName => "time";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = ResolveRenderValue(context, TimestampComponent.FormatProperty, out UITimestampFormat? format, out _);
        UITimestampFormat shown = format ?? UITimestampFormat.DateTime;

        // Render-time only: the page reads it once, as the temporal inputs read their step.
        _ = root.Attribute(WebAttributes.TimestampFormat, UIMomentJsonConverter.FormatName(shown));

        TextAppearanceRenderer.RenderTextAppearance(context, root, TimestampComponent.TextTypeProperty);
        ThemeColorRenderer.RenderThemeColor(context, root, TimestampComponent.ColorProperty);
        RenderTooltip(context, root);

        CultureInfo culture = ResolveCulture(context);
        IHtmlElementBuilder? text = null;

        _ = root.Element("span", part =>
        {
            text = part;
            _ = part.Class(WebClassNames.TimestampText);
        });

        // The tree is written out only once the whole component is built, so writing the text after its element returned is safe.
        _ = RenderProperty<DateTimeOffset?>(context, root, TimestampComponent.ValueProperty, (target, value) =>
        {
            if (value is not DateTimeOffset instant)
                return;

            _ = target.Attribute("datetime", UIMomentJsonConverter.InstantText(instant));
            _ = text!.Text(WebMoments.FirstPaint(instant, shown, culture, context.Temporal));
        }, DateTimeOperations);
    }
}
