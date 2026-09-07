using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A clock edited in place: one focusable segment per display-format unit plus a stepper, no popup. The
/// canonical string always carries seconds precision regardless of <c>Step</c>.
/// </summary>
public sealed class TimeInputComponentRenderer : TemporalInputRendererBase<TimeInputComponent, TimeOnly?>
{
    internal const string CanonicalTimeFormat = "HH:mm:ss";

    /// <summary>The date a time-only value is carried on — <c>TimeOnlyBaseYear</c> in <c>temporal-dom.ts</c>.</summary>
    private static readonly DateOnly TimeOnlyBaseDate = new(2000, 1, 1);

    protected override string ClassName => "ui-time-input";

    protected override string TemporalMode => "time";

    protected override bool HasPicker => false;

    protected override void RenderRow(WebRenderContext context, IHtmlElementBuilder root, WebTemporalCulturePack culture, string defaultDisplayFormat)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        var format = ResolveDisplayFormat(context, defaultDisplayFormat);
        var isRange = IsRange(context);

        IHtmlElementBuilder? segments = null;
        IHtmlElementBuilder? endSegments = null;

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{SharedClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            _ = row.Element("span", container =>
            {
                segments = container;
                RenderSegments(context, container, end: false);
            });

            // A period's two clocks share the row and the stepper, which drives whichever segment has focus.
            if (isRange)
            {
                RenderRangeSeparator(row);

                _ = row.Element("span", container =>
                {
                    endSegments = container;
                    RenderSegments(context, container, end: true);
                });
            }

            _ = row.Element("span", stepper =>
            {
                _ = stepper.Class($"{SharedClassName}__stepper");

                RenderStepButton(stepper, $"{SharedClassName}__step", WebAttributes.TemporalStepDirection, "up");
                RenderStepButton(stepper, $"{SharedClassName}__step", WebAttributes.TemporalStepDirection, "down");
            });
        });

        // Read-only lands on the root: a DOM operation patches one target, and both buttons and the segments react to it.
        _ = RenderProperty<bool?>(context, root, IInputComponent.IsReadOnlyProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute(WebAttributes.TemporalReadonly);
        }, [WebDomOperation.ToggleAttribute(WebAttributes.TemporalReadonly, target: "root", condition: WebValueCondition.IsTrue)]);

        // Safe after the callback returned: the tree is written out only once the whole component is built.
        IHtmlElementBuilder display = segments!;
        IHtmlElementBuilder? endDisplay = endSegments;

        RenderValueInput(context, root, culture, format, text => _ = display.Text(text));

        if (isRange)
            RenderEndValueInput(context, root, culture, format, text => _ = endDisplay!.Text(text));
    }

    private static void RenderSegments(WebRenderContext context, IHtmlElementBuilder container, bool end)
    {
        _ = container.Class($"{SharedClassName}__segments");
        _ = container.Attribute("role", "group");

        if (IsRange(context))
            _ = container.Attribute("aria-label", context.Translate(end ? UIStrings.PickerEnd : UIStrings.PickerStart));

        if (end)
            _ = container.Attribute(WebAttributes.TemporalEnd);
    }

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

        // The date half is a placeholder for the shared plumbing and must match the client's, or a format
        // carrying a weekday or year token would paint a different date on each side.
        moment = TimeOnlyBaseDate.ToDateTime(time);
        canonical = time.ToString(CanonicalTimeFormat, CultureInfo.InvariantCulture);
        return true;
    }
}
