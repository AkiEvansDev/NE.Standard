using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>The shared shell and custom picker popup behind the date, time and date-time inputs.</summary>
public abstract class TemporalInputRendererBase<TComponent, TValue> : TextContentRendererBase
    where TComponent : TemporalInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <summary>The shared class every part of the shell is named after, and what the client engine matches on.</summary>
    protected const string SharedClassName = "ui-temporal-input";

    private const char CulturePackSeparator = '|';

    public override string ComponentTypeKey => TComponent.ComponentTypeKey;

    /// <summary>Which surfaces the popup opens with: <c>date</c>, <c>time</c> or <c>date-time</c>.</summary>
    protected abstract string TemporalMode { get; }

    /// <summary>
    /// Whether this control opens a picker popup at all; one without edits its value in place — a clock's segments and a stepper.
    /// </summary>
    protected virtual bool HasPicker => true;

    /// <summary>The display format used when the author set no <c>DisplayFormat</c>: this mode's, in the patterns the field falls back on.</summary>
    protected abstract string GetDefaultDisplayFormat(UITemporalStep? step, WebTemporalPatterns patterns);

    /// <summary>Converts the value into the canonical string and <see cref="DateTime"/> the shell needs; false when unset.</summary>
    protected abstract bool TryResolveTemporal(TValue? value, out DateTime moment, out string canonical);

    protected sealed override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class(SharedClassName);
        _ = root.Attribute(WebAttributes.TemporalMode, TemporalMode);

        // Render-time only: how many fields the row holds is how the control is built.
        if (IsRange(context))
            _ = root.Attribute(WebAttributes.TemporalRange);

        RenderTooltip(context, root);

        _ = ResolveRenderValue(context, TemporalInputComponentBase<TComponent, TValue>.StepProperty, out UITemporalStep? step, out _);

        // A field that names its culture asks for its patterns; one in the page's follows the application's default.
        _ = ResolveRenderValue(context, IFormattedInputComponent.CultureProperty, out string? authoredCulture, out _);
        var ownCulture = !string.IsNullOrWhiteSpace(authoredCulture);

        CultureInfo inputCulture = ResolveInputCulture(context);
        var defaultDisplayFormat = GetDefaultDisplayFormat(step, WebTemporalPatterns.Resolve(inputCulture, context.Temporal, ownCulture));

        WebTemporalCulturePack culture = RenderPickerMetadata(context, root, step, defaultDisplayFormat, inputCulture, ownCulture);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root, titleCanGoInside: true);
        RenderRow(context, root, culture, defaultDisplayFormat);

        if (HasPicker)
        {
            _ = root.Element("div", popup =>
            {
                _ = popup.Class($"{SharedClassName}__popup");
                _ = popup.Attribute("role", "dialog");
            });
        }

        RenderValidationMessage(context, root);
    }

    /// <summary>
    /// Writes what the client needs to build the grid; <c>Step</c>, <c>FirstDayOfWeek</c> and <c>Culture</c> ignore a binding, and no
    /// <c>Culture</c> is the page's own.
    /// </summary>
    private WebTemporalCulturePack RenderPickerMetadata(WebRenderContext context, IHtmlElementBuilder root, UITemporalStep? step, string defaultDisplayFormat, CultureInfo inputCulture, bool ownCulture)
    {
        _ = RenderProperty<TValue>(context, root, MinMaxInputComponentBase<TComponent, TValue>.MinProperty, (target, value) =>
        {
            if (TryResolveTemporal(value, out _, out var canonical))
                _ = target.Attribute(WebAttributes.TemporalMin, canonical);
        }, [WebDomOperation.Attribute(WebAttributes.TemporalMin, target: "root")]);

        _ = RenderProperty<TValue>(context, root, MinMaxInputComponentBase<TComponent, TValue>.MaxProperty, (target, value) =>
        {
            if (TryResolveTemporal(value, out _, out var canonical))
                _ = target.Attribute(WebAttributes.TemporalMax, canonical);
        }, [WebDomOperation.Attribute(WebAttributes.TemporalMax, target: "root")]);

        _ = RenderProperty<string?>(context, root, IFormattedInputComponent.DisplayFormatProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.TemporalFormat, value);
        }, [WebDomOperation.Attribute(WebAttributes.TemporalFormat, target: "root")]);

        // DisplayFormat can be patched to nothing, so the client needs a format to fall back on.
        _ = root.Attribute(WebAttributes.TemporalDefaultFormat, defaultDisplayFormat);

        // A field in the page's culture follows the page's language: a switch writes its names and default format again.
        if (!ownCulture)
            _ = root.Attribute(WebAttributes.TemporalPageCulture);

        if (step is UITemporalStep resolvedStep)
        {
            _ = root.Attribute(WebAttributes.TemporalStep, resolvedStep.Value.ToString(CultureInfo.InvariantCulture));
            _ = root.Attribute(WebAttributes.TemporalStepUnit, StepUnitName(resolvedStep.Unit));
        }

        _ = ResolveRenderValue(context, TemporalInputComponentBase<TComponent, TValue>.FirstDayOfWeekProperty, out UIDayOfWeek? firstDayOfWeek, out _);

        // UIDayOfWeek starts at Monday, JavaScript's getDay() at Sunday; the shift converts between them.
        var firstDay = firstDayOfWeek is UIDayOfWeek day ? ((int)day + 1) % 7 : 1;
        _ = root.Attribute(WebAttributes.TemporalFirstDay, firstDay.ToString(CultureInfo.InvariantCulture));

        WebTemporalCulturePack culture = WebTemporalCulturePack.FromCulture(inputCulture);

        _ = root.Attribute(WebAttributes.TemporalMonths, Join(culture.MonthNames));
        _ = root.Attribute(WebAttributes.TemporalMonthsGenitive, Join(culture.MonthGenitiveNames));
        _ = root.Attribute(WebAttributes.TemporalMonthsShort, Join(culture.AbbreviatedMonthNames));
        _ = root.Attribute(WebAttributes.TemporalDaynames, Join(culture.DayNames));
        _ = root.Attribute(WebAttributes.TemporalWeekdays, Join(culture.AbbreviatedDayNames));
        _ = root.Attribute(WebAttributes.TemporalAm, culture.AmDesignator);
        _ = root.Attribute(WebAttributes.TemporalPm, culture.PmDesignator);

        return culture;
    }

    private static string StepUnitName(UITemporalStepUnit unit)
        => unit switch
        {
            UITemporalStepUnit.Hour => "hour",
            UITemporalStepUnit.Minute => "minute",
            UITemporalStepUnit.Second => "second",
            _ => "day"
        };

    private static string Join(IReadOnlyList<string> names)
        => string.Join(CulturePackSeparator, names);

    /// <summary>Whether the control edits a period: two fields under one caption, the end behind the second.</summary>
    protected static bool IsRange(WebRenderContext context)
    {
        _ = ResolveRenderValue(context, TemporalInputComponentBase<TComponent, TValue>.IsRangeProperty, out bool? isRange, out _);

        return isRange == true;
    }

    /// <summary>
    /// Renders the row a value is entered in — two parts for a period — and the hidden canonical value inputs: a text field and the
    /// popup's toggle where there is a picker, a clock's segments and a stepper where the value is edited in place.
    /// </summary>
    private void RenderRow(WebRenderContext context, IHtmlElementBuilder root, WebTemporalCulturePack culture, string defaultDisplayFormat)
    {
        var format = ResolveDisplayFormat(context, defaultDisplayFormat);
        var isRange = IsRange(context);
        var partElement = HasPicker ? "input" : "span";

        IHtmlElementBuilder? startPart = null;
        IHtmlElementBuilder? endPart = null;
        IHtmlElementBuilder? toggle = null;

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{SharedClassName}__row");

            // A period's two parts are one answer to one caption: the row is the group the caption names.
            if (isRange)
            {
                _ = row.Attribute("role", "group");
                RenderFieldLabel(context, row);
            }

            BorderStyleRenderer.RenderBorderStyle(context, row);

            RenderInputHeaderInside(context, root, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = row.Element(partElement, part =>
            {
                startPart = part;
                RenderPart(context, part, format, end: false);
            });

            // A period's two parts share the row, and its toggle or stepper, which drives whichever part has focus.
            if (isRange)
            {
                RenderRangeSeparator(row);

                _ = row.Element(partElement, part =>
                {
                    endPart = part;
                    RenderPart(context, part, format, end: true);
                });
            }

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            if (HasPicker)
            {
                RenderPopupToggle(row, $"{SharedClassName}__toggle", WebAttributes.TemporalToggle, button =>
                {
                    toggle = button;
                    _ = button.Attribute("tabindex", "-1");
                    WebWords.Write(context, button, "aria-label", UIStrings.PickerOpen);
                });
            }
            else
            {
                _ = row.Element("span", stepper =>
                {
                    _ = stepper.Class($"{SharedClassName}__stepper");

                    RenderStepButton(stepper, $"{SharedClassName}__step", WebAttributes.TemporalStepDirection, "up");
                    RenderStepButton(stepper, $"{SharedClassName}__step", WebAttributes.TemporalStepDirection, "down");
                });
            }
        });

        // The tree is written out only once the whole component is built, so writing onto these after their own
        // element callbacks returned is safe.
        IHtmlElementBuilder startDisplay = startPart!;
        IHtmlElementBuilder? endDisplay = endPart;

        // Without a picker, read-only is the root's mark alone: the stepper and the segments both read it, and the segments stay in
        // the tab order.
        if (HasPicker)
            RenderFieldReadOnly(context, root, startDisplay, endDisplay, toggle!);
        else
            NativeInputRendererBase.RenderIsReadOnlyMark(context, root);

        // A text field shows the value as its own; a clock's segments as their text.
        Action<IHtmlElementBuilder, string> writeDisplay = HasPicker ? static (part, text) => _ = part.Attribute("value", text) : static (part, text) => _ = part.Text(text);

        RenderValueInput(context, root, culture, format, text => writeDisplay(startDisplay, text));

        if (isRange)
            RenderEndValueInput(context, root, culture, format, text => writeDisplay(endDisplay!, text));
    }

    /// <summary>The part a value — or a period's start or end — is entered in: a text field, or a clock's segments.</summary>
    private void RenderPart(WebRenderContext context, IHtmlElementBuilder part, string format, bool end)
    {
        if (HasPicker)
        {
            RenderDisplayField(context, part, format, end);
            return;
        }

        _ = part.Class($"{SharedClassName}__segments");
        _ = part.Attribute("role", "group");

        RenderPartLabel(context, part, end);
    }

    private static void RenderDisplayField(WebRenderContext context, IHtmlElementBuilder input, string format, bool end)
    {
        _ = input.Class($"{SharedClassName}__field");
        NativeInputRendererBase.RenderFieldName(context, input, end ? "end-text" : "text");
        _ = input.Class("ui-field");
        _ = input.Attribute("type", "text");
        _ = input.Attribute("autocomplete", "off");
        // The format in the page's letters; the client writes it again after a switch or a patched format.
        _ = input.Attribute("placeholder", WebTemporalFormat.Placeholder(format, WebTemporalLetters.FromWords(context.Translate)));

        RenderPartLabel(context, input, end);
    }

    /// <summary>
    /// A picker's read-only: the text fields read-only and the toggle saying it does nothing, rather than turning disabled, which
    /// would drop a focus it holds; the refusal engine turns its press away.
    /// </summary>
    private static void RenderFieldReadOnly(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder field, IHtmlElementBuilder? endField, IHtmlElementBuilder toggle)
    {
        // One registration, every target: a property renders once per component, so this can't be several RenderProperty calls;
        // the end field's target is optional since not every instance is a period.
        _ = RenderProperty<bool?>(context, field, IInputComponent.IsReadOnlyProperty, (target, value) =>
        {
            if (value != true)
                return;

            _ = root.Class(WebClassNames.ReadOnly);
            _ = target.Attribute("readonly");
            _ = endField?.Attribute("readonly");
            _ = toggle.Attribute("aria-disabled", "true");
        }, [
            NativeInputRendererBase.ReadOnlyMarkOperation,
            WebDomOperation.ToggleAttribute("readonly", target: $".{SharedClassName}__field:not([{WebAttributes.TemporalEnd}])", condition: WebValueCondition.IsTrue),
            WebDomOperation.ToggleAttribute("readonly", target: $".{SharedClassName}__field[{WebAttributes.TemporalEnd}]", condition: WebValueCondition.IsTrue, optional: true),
            WebDomOperation.ToggleAttribute("aria-disabled", target: $".{SharedClassName}__toggle", condition: WebValueCondition.IsTrue, value: "true")
        ]);
    }

    /// <summary>Names the part a value is entered in: a period's start or end by its own word, a single value by the field's caption.</summary>
    protected static void RenderPartLabel(WebRenderContext context, IHtmlElementBuilder part, bool end)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(part);

        // A period's two parts are told apart by name, since their caption names the period rather than either end.
        if (IsRange(context))
            WebWords.Write(context, part, "aria-label", end ? UIStrings.PickerEnd : UIStrings.PickerStart);
        else
            RenderFieldLabel(context, part);

        if (end)
            _ = part.Attribute(WebAttributes.TemporalEnd);
    }

    /// <summary>The dash between a period's two fields: drawn text, so the row reads "from – to" without an icon pack.</summary>
    protected static void RenderRangeSeparator(IHtmlElementBuilder row)
    {
        ArgumentNullException.ThrowIfNull(row);

        _ = row.Element("span", separator =>
        {
            _ = separator.Class($"{SharedClassName}__range-separator");
            _ = separator.Attribute("aria-hidden", "true");
            _ = separator.Text("–");
        });
    }

    /// <summary>The effective display format: the author's <c>DisplayFormat</c>, or this mode's default.</summary>
    protected string ResolveDisplayFormat(WebRenderContext context, string defaultDisplayFormat)
    {
        _ = ResolveRenderValue(context, IFormattedInputComponent.DisplayFormatProperty, out string? displayFormat, out _);

        return string.IsNullOrWhiteSpace(displayFormat) ? defaultDisplayFormat : displayFormat;
    }

    /// <summary>The hidden input the value binds to, and the one place <c>Value</c> is registered for any row shape.</summary>
    protected void RenderValueInput(WebRenderContext context, IHtmlElementBuilder root, WebTemporalCulturePack culture, string format, Action<string> writeDisplay)
    {
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(writeDisplay);

        NativeInputRendererBase.RenderHiddenValueInput(context, root, $"{SharedClassName}__value-input", valueInput =>
        {
            _ = RenderProperty<TValue>(context, valueInput, IInputComponent.ValueProperty, (target, value) =>
            {
                if (!TryResolveTemporal(value, out DateTime moment, out var canonical))
                    return;

                _ = target.Attribute("value", canonical);
                writeDisplay(WebTemporalFormat.Format(moment, format, culture));
            }, [WebDomOperation.Property("value")]);
        });
    }

    /// <summary>The period's end, a second hidden input beside the first, bound to <c>EndValue</c> the same way.</summary>
    protected void RenderEndValueInput(WebRenderContext context, IHtmlElementBuilder root, WebTemporalCulturePack culture, string format, Action<string> writeDisplay)
    {
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(writeDisplay);

        NativeInputRendererBase.RenderHiddenValueInput(context, root, $"{SharedClassName}__end-value-input", valueInput =>
        {
            _ = valueInput.Attribute(WebAttributes.TemporalEnd);

            _ = RenderProperty<TValue>(context, valueInput, TemporalInputComponentBase<TComponent, TValue>.EndValueProperty, (target, value) =>
            {
                if (!TryResolveTemporal(value, out DateTime moment, out var canonical))
                    return;

                _ = target.Attribute("value", canonical);
                writeDisplay(WebTemporalFormat.Format(moment, format, culture));
            }, [WebDomOperation.Property("value")]);
        }, part: "end");
    }
}
