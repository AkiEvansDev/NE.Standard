using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A clock edited in place: one focusable segment per display-format unit plus a stepper, no popup — the temporal row without a
/// picker. The canonical string always carries seconds precision regardless of <c>Step</c>.
/// </summary>
public sealed class TimeInputComponentRenderer : TemporalInputRendererBase<TimeInputComponent, TimeOnly?>
{
    internal const string CanonicalTimeFormat = "HH:mm:ss";

    /// <summary>The date a time-only value is carried on — <c>TimeOnlyBaseYear</c> in <c>temporal-dom.ts</c>.</summary>
    private static readonly DateOnly TimeOnlyBaseDate = new(2000, 1, 1);

    protected override string ClassName => "ui-time-input";

    protected override string TemporalMode => "time";

    protected override bool HasPicker => false;

    protected override string GetDefaultDisplayFormat(UITemporalStep? step)
        => GetTimeDisplayFormat(step);

    /// <summary>The display format for a step, showing seconds only when the step reaches them.</summary>
    internal static string GetTimeDisplayFormat(UITemporalStep? step)
        => step?.Unit == UITemporalStepUnit.Second ? CanonicalTimeFormat : "HH:mm";

    protected override bool TryResolveTemporal(TimeOnly? value, out DateTime moment, out string canonical)
    {
        if (value is not TimeOnly time)
        {
            moment = default;
            canonical = "";
            return false;
        }

        // The date half is a placeholder for the shared plumbing and must match the client's, or a weekday/year token would
        // paint a different date on each side.
        moment = TimeOnlyBaseDate.ToDateTime(time);
        canonical = time.ToString(CanonicalTimeFormat, CultureInfo.InvariantCulture);
        return true;
    }
}
