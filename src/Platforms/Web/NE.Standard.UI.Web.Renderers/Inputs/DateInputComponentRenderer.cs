using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A calendar-only picker. <see cref="DateOnly"/>'s round-trip "yyyy-MM-dd" form is already the canonical
/// string the hidden value input carries, so no conversion is needed either direction.
/// </summary>
public sealed class DateInputComponentRenderer : TemporalInputRendererBase<DateInputComponent, DateOnly?>
{
    internal const string CanonicalDateFormat = "yyyy-MM-dd";

    protected override string ClassName => "ui-date-input";

    protected override string TemporalMode => "date";

    protected override string GetDefaultDisplayFormat(UITemporalStep? step)
        => CanonicalDateFormat;

    protected override bool TryResolveTemporal(DateOnly? value, out DateTime moment, out string canonical)
    {
        if (value is not DateOnly date)
        {
            moment = default;
            canonical = "";
            return false;
        }

        moment = date.ToDateTime(TimeOnly.MinValue);
        canonical = date.ToString(CanonicalDateFormat, CultureInfo.InvariantCulture);
        return true;
    }
}
