using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A month's calendar in place: the root carries what a date input's root carries for its popup, and the client draws the same grid
/// into the body (<c>temporal-picker-engine.ts</c>).
/// </summary>
public sealed class CalendarComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => CalendarComponent.ComponentTypeKey;

    protected override string ClassName => "ui-calendar";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // Read by the same engine as a date input's popup: a day and nothing else.
        _ = root.Attribute(WebAttributes.TemporalMode, "date");

        _ = ResolveRenderValue(context, CalendarComponent.IsRangeProperty, out bool? isRange, out _);

        if (isRange == true)
            _ = root.Attribute(WebAttributes.TemporalRange);

        RenderTooltip(context, root);
        TemporalCalendarRenderer.RenderBounds<DateOnly?>(context, root, CalendarComponent.MinProperty, CalendarComponent.MaxProperty, CanonicalDay);
        TemporalCalendarRenderer.RenderFirstDay(context, root, CalendarComponent.FirstDayOfWeekProperty);
        TemporalCalendarRenderer.RenderMarkedDays(context, root);

        // The page's culture, followed at a language switch as a date input's is.
        _ = root.Attribute(WebAttributes.TemporalPageCulture);
        _ = TemporalCalendarRenderer.RenderCulturePack(root, ResolveCulture(context));

        NativeInputRendererBase.RenderIsReadOnlyMark(context, root);
        RenderInputHeader(context, root);

        _ = root.Element("div", body =>
        {
            _ = body.Class("ui-calendar__body");
            _ = body.Attribute("role", "group");

            RenderFieldLabel(context, body);
        });

        TemporalCalendarRenderer.RenderValueInput<DateOnly?>(context, root, IInputComponent.ValueProperty, end: false, CanonicalDay);

        if (isRange == true)
            TemporalCalendarRenderer.RenderValueInput<DateOnly?>(context, root, CalendarComponent.EndValueProperty, end: true, CanonicalDay);

        RenderValidationMessage(context, root);
    }

    private static string? CanonicalDay(DateOnly? day)
        => day is DateOnly value ? TemporalCalendarRenderer.CanonicalDay(value) : null;
}
