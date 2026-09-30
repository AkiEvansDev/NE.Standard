using System;
using System.Globalization;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
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
/// The first paint is the instant in UTC in the page's names and the application's patterns — the ones the words table carries —
/// said to be UTC where it shows a clock, since a time with no zone named would read as the reader's own. It is not the reader's zone
/// because one render is shared by every reader of the view. The page writes the same patterns in the reader's zone, so at
/// hydration only the time moves and " UTC" goes.
/// </remarks>
public sealed class TimestampComponentRenderer : WebComponentRendererBase
{
    private const string TextClassName = "ui-timestamp__text";

    public override string ComponentTypeKey => TimestampComponent.ComponentTypeKey;

    protected override string ClassName => "ui-timestamp";

    protected override string ElementName => "time";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = ResolveRenderValue(context, TimestampComponent.FormatProperty, out UITimestampFormat? format, out _);
        UITimestampFormat shown = format ?? UITimestampFormat.DateTime;

        // Render-time only: the page reads it once, as the temporal inputs read their step.
        _ = root.Attribute(WebAttributes.TimestampFormat, FormatName(shown));

        TextAppearanceRenderer.RenderTextAppearance(context, root, TimestampComponent.TextTypeProperty);
        ThemeColorRenderer.RenderThemeColor(context, root, TimestampComponent.ColorProperty);
        RenderTooltip(context, root);

        CultureInfo culture = ResolveCulture(context);
        IHtmlElementBuilder? text = null;

        _ = root.Element("span", part =>
        {
            text = part;
            _ = part.Class(TextClassName);
        });

        // The tree is written out only once the whole component is built, so writing the text after its element returned is safe.
        _ = RenderProperty<DateTimeOffset?>(context, root, TimestampComponent.ValueProperty, (target, value) =>
        {
            if (value is not DateTimeOffset instant)
                return;

            _ = target.Attribute("datetime", instant.UtcDateTime.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'", CultureInfo.InvariantCulture));
            _ = text!.Text(FirstPaint(instant, shown, culture, context.Temporal));
        }, [WebDomOperation.Attribute("datetime")]);
    }

    /// <summary>The name the page reads a format by.</summary>
    public static string FormatName(UITimestampFormat format)
        => format switch
        {
            UITimestampFormat.Date => "date",
            UITimestampFormat.Time => "time",
            UITimestampFormat.Relative => "relative",
            _ => "date-time"
        };

    /// <summary>
    /// The instant as the server can write it, in UTC in the page's names and the application's patterns, until the page writes it
    /// in the reader's zone; a relative one as the day and the time, since how long ago it was depends on when the page is read.
    /// </summary>
    public static string FirstPaint(DateTimeOffset instant, UITimestampFormat format, CultureInfo culture, UITemporalOptions? options)
    {
        ArgumentNullException.ThrowIfNull(culture);

        WebTemporalPatterns patterns = WebTemporalPatterns.Resolve(culture, options, ownCulture: false);
        WebTemporalCulturePack names = WebTemporalCulturePack.FromCulture(culture);
        DateTime utc = instant.UtcDateTime;

        return format switch
        {
            UITimestampFormat.Date => WebTemporalFormat.Format(utc, patterns.Date, names),
            UITimestampFormat.Time => $"{WebTemporalFormat.Format(utc, patterns.ShortTime, names)} UTC",
            _ => $"{WebTemporalFormat.Format(utc, patterns.DateTime(seconds: false), names)} UTC"
        };
    }
}
