using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// What the month grid reads off its root, written alike for a temporal input's popup and a calendar drawn in place: both are drawn
/// by one client engine (<c>temporal-picker-engine.ts</c>, the grid in <c>temporal-calendar.ts</c>).
/// </summary>
public static class TemporalCalendarRenderer
{
    /// <summary>The class every part of a temporal control is named after, a calendar's value inputs and grid included.</summary>
    public const string TemporalClassName = "ui-temporal-input";

    private const char CulturePackSeparator = '|';

    private static readonly WebDomOperation[] MinOperations = [WebDomOperation.Attribute(WebAttributes.TemporalMin, target: "root")];
    private static readonly WebDomOperation[] MaxOperations = [WebDomOperation.Attribute(WebAttributes.TemporalMax, target: "root")];
    private static readonly WebDomOperation[] ValueOperations = [WebDomOperation.Property("value")];
    private static readonly WebDomOperation[] MarkedDaysOperations = [WebDomOperation.Attribute(WebAttributes.TemporalMarkedDays, target: "root", converter: WebDomConverters.MarkedDaysAttribute)];
    private static readonly WebDomOperation[] MarkedOnlyOperations = [WebDomOperation.ToggleAttribute(WebAttributes.TemporalMarkedOnly, target: "root", condition: WebValueCondition.IsTrue)];

    /// <summary>A day in the one form the page reads a day in, the canonical date pattern.</summary>
    public static string CanonicalDay(DateOnly day)
        => day.ToString(WebTemporalPatterns.Canonical.Date, CultureInfo.InvariantCulture);

    /// <summary>
    /// <c>Min</c> and <c>Max</c> as the canonical text the grid and the fields read, first painted and patched alike; a bound with no
    /// canonical form writes nothing.
    /// </summary>
    public static void RenderBounds<TValue>(WebRenderContext context, IHtmlElementBuilder root, UIProperty minProperty, UIProperty maxProperty, Func<TValue?, string?> canonical)
    {
        RenderCanonical(context, root, minProperty, canonical, WebAttributes.TemporalMin, MinOperations);
        RenderCanonical(context, root, maxProperty, canonical, WebAttributes.TemporalMax, MaxOperations);
    }

    /// <summary>One property's value as its canonical text on an attribute; <paramref name="shown"/> hears each value written.</summary>
    private static void RenderCanonical<TValue>(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, Func<TValue?, string?> canonical, string attribute, WebDomOperation[] operations, Action<TValue?>? shown = null)
    {
        ArgumentNullException.ThrowIfNull(canonical);

        _ = WebComponentRendererBase.RenderProperty<TValue>(context, target, property, (element, value) =>
        {
            if (canonical(value) is not { } text)
                return;

            _ = element.Attribute(attribute, text);
            shown?.Invoke(value);
        }, operations);
    }

    /// <summary>
    /// The hidden input a value — or, with <paramref name="end"/>, a period's end — binds to, holding its canonical text for the engine;
    /// <paramref name="shown"/> hears each value written, for a field that shows it too.
    /// </summary>
    public static void RenderValueInput<TValue>(WebRenderContext context, IHtmlElementBuilder root, UIProperty property, bool end, Func<TValue?, string?> canonical, Action<TValue?>? shown = null)
        => NativeInputRendererBase.RenderHiddenValueInput(context, root, end ? $"{TemporalClassName}__end-value-input" : $"{TemporalClassName}__value-input", valueInput =>
        {
            if (end)
                _ = valueInput.Attribute(WebAttributes.TemporalEnd);

            RenderCanonical(context, valueInput, property, canonical, "value", ValueOperations, shown);
        }, part: end ? "end" : null);

    /// <summary>The first day of the week the grid's rows start on, as JavaScript counts it; unset, Monday. It ignores a binding.</summary>
    public static void RenderFirstDay(WebRenderContext context, IHtmlElementBuilder root, UIProperty firstDayOfWeekProperty)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.ResolveRenderValue(context, firstDayOfWeekProperty, out UIDayOfWeek? firstDayOfWeek, out _);

        // UIDayOfWeek starts at Monday, JavaScript's getDay() at Sunday; the shift converts between them.
        var firstDay = firstDayOfWeek is UIDayOfWeek day ? ((int)day + 1) % 7 : 1;
        _ = root.Attribute(WebAttributes.TemporalFirstDay, firstDay.ToString(CultureInfo.InvariantCulture));
    }

    /// <summary>The culture's month and day names the grid and the fields are drawn in.</summary>
    public static WebTemporalCulturePack RenderCulturePack(IHtmlElementBuilder root, CultureInfo culture)
    {
        ArgumentNullException.ThrowIfNull(root);

        WebTemporalCulturePack pack = WebTemporalCulturePack.FromCulture(culture);

        _ = root.Attribute(WebAttributes.TemporalMonths, Join(pack.MonthNames));
        _ = root.Attribute(WebAttributes.TemporalMonthsGenitive, Join(pack.MonthGenitiveNames));
        _ = root.Attribute(WebAttributes.TemporalMonthsShort, Join(pack.AbbreviatedMonthNames));
        _ = root.Attribute(WebAttributes.TemporalDaynames, Join(pack.DayNames));
        _ = root.Attribute(WebAttributes.TemporalWeekdays, Join(pack.AbbreviatedDayNames));
        _ = root.Attribute(WebAttributes.TemporalAm, pack.AmDesignator);
        _ = root.Attribute(WebAttributes.TemporalPm, pack.PmDesignator);

        return pack;
    }

    private static string Join(IReadOnlyList<string> names)
        => string.Join(CulturePackSeparator, names);

    /// <summary>
    /// The days drawn marked and whether they are the only ones on offer; a bound set is written again whole when the controller
    /// assigns a new one.
    /// </summary>
    public static void RenderMarkedDays(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<IEnumerable<DateOnly>?>(context, root, IMarkedDaysComponent.MarkedDaysProperty, static (target, value) =>
        {
            if (value is not null && WebTemporalFormat.Days(value) is { Length: > 0 } days)
                _ = target.Attribute(WebAttributes.TemporalMarkedDays, days);
        }, MarkedDaysOperations);

        _ = WebComponentRendererBase.RenderProperty<bool?>(context, root, IMarkedDaysComponent.MarkedDaysOnlyProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute(WebAttributes.TemporalMarkedOnly);
        }, MarkedOnlyOperations);
    }
}
