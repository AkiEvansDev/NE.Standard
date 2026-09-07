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

    /// <summary>Whether this control opens a picker popup at all.</summary>
    protected virtual bool HasPicker => true;

    /// <summary>The display format used when the author set no <c>DisplayFormat</c>.</summary>
    protected abstract string GetDefaultDisplayFormat(UITemporalStep? step);

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
        var defaultDisplayFormat = GetDefaultDisplayFormat(step);

        WebTemporalCulturePack culture = RenderPickerMetadata(context, root, step, defaultDisplayFormat);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root);
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
    /// Writes what the client needs to build the grid; <c>Step</c>, <c>FirstDayOfWeek</c> and <c>Culture</c> ignore a binding.
    /// </summary>
    private WebTemporalCulturePack RenderPickerMetadata(WebRenderContext context, IHtmlElementBuilder root, UITemporalStep? step, string defaultDisplayFormat)
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

        if (step is UITemporalStep resolvedStep)
        {
            _ = root.Attribute(WebAttributes.TemporalStep, resolvedStep.Value.ToString(CultureInfo.InvariantCulture));
            _ = root.Attribute(WebAttributes.TemporalStepUnit, StepUnitName(resolvedStep.Unit));
        }

        _ = ResolveRenderValue(context, TemporalInputComponentBase<TComponent, TValue>.FirstDayOfWeekProperty, out UIDayOfWeek? firstDayOfWeek, out _);

        // UIDayOfWeek starts at Monday, JavaScript's getDay() at Sunday; the shift converts between them.
        var firstDay = firstDayOfWeek is UIDayOfWeek day ? ((int)day + 1) % 7 : 1;
        _ = root.Attribute(WebAttributes.TemporalFirstDay, firstDay.ToString(CultureInfo.InvariantCulture));

        _ = ResolveRenderValue(context, IFormattedInputComponent.CultureProperty, out string? cultureName, out _);
        WebTemporalCulturePack culture = WebTemporalCulturePack.FromCulture(WebCultures.Resolve(cultureName));

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

    /// <summary>Renders the visible display field — two of them for a period — the hidden canonical value inputs and the popup toggle.</summary>
    protected virtual void RenderRow(WebRenderContext context, IHtmlElementBuilder root, WebTemporalCulturePack culture, string defaultDisplayFormat)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        var format = ResolveDisplayFormat(context, defaultDisplayFormat);
        var isRange = IsRange(context);

        IHtmlElementBuilder? field = null;
        IHtmlElementBuilder? endField = null;
        IHtmlElementBuilder? toggle = null;

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{SharedClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = row.Element("input", input =>
            {
                field = input;
                RenderDisplayField(context, input, format, end: false);
            });

            if (isRange)
            {
                RenderRangeSeparator(row);

                _ = row.Element("input", input =>
                {
                    endField = input;
                    RenderDisplayField(context, input, format, end: true);
                });
            }

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            RenderPopupToggle(row, $"{SharedClassName}__toggle", WebAttributes.TemporalToggle, button =>
            {
                toggle = button;
                _ = button.Attribute("tabindex", "-1");
            });
        });

        // The tree is written out only once the whole component is built, so writing onto these after their own
        // element callbacks returned is safe.
        IHtmlElementBuilder displayField = field!;
        IHtmlElementBuilder? endDisplayField = endField;
        IHtmlElementBuilder toggleButton = toggle!;

        // One registration, every target: a property may only be rendered once per component, so this cannot be
        // several RenderProperty calls. A patch reaches one element per target, so the two fields are two targets — and
        // one list for the type, whether or not this instance is a period, so the end's target is optional.
        _ = RenderProperty<bool?>(context, displayField, IInputComponent.IsReadOnlyProperty, (target, value) =>
        {
            if (value != true)
                return;

            _ = target.Attribute("readonly");
            _ = endDisplayField?.Attribute("readonly");
            _ = toggleButton.Attribute("disabled");
        }, [
            WebDomOperation.ToggleAttribute("readonly", target: $".{SharedClassName}__field:not([{WebAttributes.TemporalEnd}])", condition: WebValueCondition.IsTrue),
            WebDomOperation.ToggleAttribute("readonly", target: $".{SharedClassName}__field[{WebAttributes.TemporalEnd}]", condition: WebValueCondition.IsTrue, optional: true),
            WebDomOperation.ToggleAttribute("disabled", target: $".{SharedClassName}__toggle", condition: WebValueCondition.IsTrue)
        ]);

        RenderValueInput(context, root, culture, format, text => _ = displayField.Attribute("value", text));

        if (isRange)
            RenderEndValueInput(context, root, culture, format, text => _ = endDisplayField!.Attribute("value", text));
    }

    private static void RenderDisplayField(WebRenderContext context, IHtmlElementBuilder input, string format, bool end)
    {
        _ = input.Class($"{SharedClassName}__field");
        NativeInputRendererBase.RenderFieldName(context, input, end ? "end-text" : "text");
        _ = input.Class("ui-field");
        _ = input.Attribute("type", "text");
        _ = input.Attribute("autocomplete", "off");
        _ = input.Attribute("placeholder", format);

        // A period's two fields are told apart by name, since their caption names the period rather than either end.
        if (IsRange(context))
            _ = input.Attribute("aria-label", context.Translate(end ? UIStrings.PickerEnd : UIStrings.PickerStart));

        if (end)
            _ = input.Attribute(WebAttributes.TemporalEnd);
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
