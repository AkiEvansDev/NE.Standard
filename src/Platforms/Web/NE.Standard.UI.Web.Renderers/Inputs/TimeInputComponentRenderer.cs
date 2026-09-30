using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A clock edited in place: one focusable segment per display-format unit plus a stepper, no popup — the temporal row without a
/// picker. The canonical string always carries seconds precision regardless of <c>Step</c>.
/// </summary>
public sealed class TimeInputComponentRenderer : TemporalInputRendererBase<TimeInputComponent, TimeOnly?>
{
    private const string CanonicalTimeFormat = "HH:mm:ss";

    /// <summary>The date a time-only value is carried on — <c>TimeOnlyBaseYear</c> in <c>temporal-dom.ts</c>.</summary>
    private static readonly DateOnly TimeOnlyBaseDate = new(2000, 1, 1);

    protected override string ClassName => "ui-time-input";

    protected override string TemporalMode => "time";

    protected override bool HasPicker => false;

    protected override string GetDefaultDisplayFormat(UITemporalStep? step, WebTemporalPatterns patterns)
        => patterns.Time(ReachesSeconds(step));

    /// <summary>Whether a clock shows seconds: only where its step reaches them.</summary>
    internal static bool ReachesSeconds(UITemporalStep? step)
        => step?.Unit == UITemporalStepUnit.Second;

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
