using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>A calendar-only picker, whose <see cref="DateOnly"/> round-trip form is already the canonical string.</summary>
public sealed class DateInputComponentRenderer : TemporalInputRendererBase<DateInputComponent, DateOnly?>
{
    protected override string ClassName => "ui-date-input";

    protected override string TemporalMode => "date";

    protected override string GetDefaultDisplayFormat(UITemporalStep? step, WebTemporalPatterns patterns)
        => patterns.Date;

    protected override bool TryResolveTemporal(DateOnly? value, out DateTime moment, out string canonical)
    {
        if (value is not DateOnly date)
        {
            moment = default;
            canonical = "";
            return false;
        }

        moment = date.ToDateTime(TimeOnly.MinValue);
        canonical = TemporalCalendarRenderer.CanonicalDay(date);
        return true;
    }
}
