using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A clock edited in place: one focusable segment per unit named by the display format, plus a stepper,
/// and no popup. The canonical string always carries seconds precision regardless of <c>Step</c> — the step
/// only decides how far one press moves a segment.
/// </summary>
/// <remarks>
/// The segments themselves are built client-side by <c>time-segment-engine.ts</c>, from the same format
/// tokens the formatter already knows; what is rendered here is the formatted text it replaces, so the
/// first paint is correct and the swap is invisible. Deciding the segments server-side would have made the
/// token walk a third hand-maintained port.
/// </remarks>
public sealed class TimeInputComponentRenderer : TemporalInputRendererBase<TimeInputComponent, TimeOnly?>
{
    internal const string CanonicalTimeFormat = "HH:mm:ss";

    private const string ReadOnlyAttribute = "data-ui-temporal-readonly";
    private const string StepDirectionAttribute = "data-ui-temporal-step-direction";

    protected override string ClassName => "ui-time-input";

    protected override string TemporalMode => "time";

    protected override bool HasPicker => false;

    protected override void RenderRow(WebRenderContext context, IHtmlElementBuilder root, WebTemporalCulturePack culture, string defaultDisplayFormat)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        var format = ResolveDisplayFormat(context, defaultDisplayFormat);

        IHtmlElementBuilder? segments = null;

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{SharedClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            _ = row.Element("span", container =>
            {
                segments = container;

                _ = container.Class($"{SharedClassName}__segments");
                _ = container.Attribute("role", "group");
            });

            _ = row.Element("span", stepper =>
            {
                _ = stepper.Class($"{SharedClassName}__stepper");

                RenderStepButton(stepper, "up");
                RenderStepButton(stepper, "down");
            });
        });

        // Read-only lands on the root as one attribute rather than on the two stepper buttons: a DOM
        // operation patches a single target, and both buttons plus the segments have to react to it.
        _ = RenderProperty<bool?>(context, root, IInputComponent.IsReadOnlyProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute(ReadOnlyAttribute);
        }, [WebDomOperation.ToggleAttribute(ReadOnlyAttribute, target: "root", condition: WebValueCondition.IsTrue)]);

        // See `HtmlElementBuilder`: the tree is written out once the whole component is built, so writing
        // onto `segments` after its own callback returned is the same deferred-mutation shape the base uses.
        IHtmlElementBuilder display = segments!;

        RenderValueInput(context, root, culture, format, text => _ = display.Text(text));
    }

    private static void RenderStepButton(IHtmlElementBuilder stepper, string direction)
    {
        _ = stepper.Element("button", button =>
        {
            _ = button.Class($"{SharedClassName}__step");
            _ = button.Attribute("type", "button");
            _ = button.Attribute("tabindex", "-1");
            _ = button.Attribute("aria-hidden", "true");
            _ = button.Attribute(StepDirectionAttribute, direction);
        });
    }

    protected override string GetDefaultDisplayFormat(UITemporalStep? step)
        => GetTimeDisplayFormat(step);

    /// <summary>
    /// Seconds are shown only when the step actually reaches them — a field stepping by 15 minutes displaying
    /// a permanent ":00" is noise, not precision. Shared with <c>DateTimeInputComponentRenderer</c>, whose
    /// default is this appended to a date.
    /// </summary>
    internal static string GetTimeDisplayFormat(UITemporalStep? step)
        => step?.Unit == UITemporalStepUnit.Second ? "HH:mm:ss" : "HH:mm";

    protected override bool TryResolveTemporal(TimeOnly? value, out DateTime moment, out string canonical)
    {
        if (value is not TimeOnly time)
        {
            moment = default;
            canonical = "";
            return false;
        }

        // A TimeOnly has to become a DateTime for the shared picker plumbing; the date half is a placeholder
        // and never reaches the canonical string.
        moment = DateOnly.MinValue.ToDateTime(time);
        canonical = time.ToString(CanonicalTimeFormat, CultureInfo.InvariantCulture);
        return true;
    }
}
