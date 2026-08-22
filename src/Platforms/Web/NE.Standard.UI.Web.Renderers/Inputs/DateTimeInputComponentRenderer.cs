using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// Calendar and clock columns side by side, committed together. The canonical string carries only the
/// wall-clock reading ("yyyy-MM-ddTHH:mm:ss") and deliberately drops the offset: on the way back
/// <c>RecursiveValueCoercion</c> parses it with <c>DateTimeStyles.AssumeLocal</c>, treating it as the
/// server's local time. So an app where the offset itself is meaningful, not just the reading, cannot get it
/// back from this control.
/// </summary>
public sealed class DateTimeInputComponentRenderer : TemporalInputRendererBase<DateTimeInputComponent, DateTimeOffset?>
{
    private const string CanonicalDateTimeFormat = "yyyy-MM-ddTHH:mm:ss";

    protected override string ClassName => "ui-date-time-input";

    protected override string TemporalMode => "date-time";

    protected override string GetDefaultDisplayFormat(UITemporalStep? step)
        => $"{DateInputComponentRenderer.CanonicalDateFormat} {TimeInputComponentRenderer.GetTimeDisplayFormat(step)}";

    protected override bool TryResolveTemporal(DateTimeOffset? value, out DateTime moment, out string canonical)
    {
        if (value is not DateTimeOffset instant)
        {
            moment = default;
            canonical = "";
            return false;
        }

        moment = instant.DateTime;
        canonical = instant.ToString(CanonicalDateTimeFormat, CultureInfo.InvariantCulture);
        return true;
    }
}
