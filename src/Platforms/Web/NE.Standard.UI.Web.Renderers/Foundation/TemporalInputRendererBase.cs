using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// The whole surface of <c>DateInputComponent</c>/<c>TimeInputComponent</c>/<c>DateTimeInputComponent</c>:
/// the same header/field/message shell the other text-family inputs draw, plus the custom picker popup that
/// replaced the native <c>&lt;input type="date"&gt;</c>, which had to go because a browser's own picker is
/// unthemeable — CSS reaches almost none of it.
/// <para>
/// Each concrete renderer contributes only what its own value type decides: the mode name, the four
/// property keys declared without a contract (<c>Min</c>/<c>Max</c>/<c>Step</c>/<c>FirstDayOfWeek</c> live on
/// the generic component bases, so they are reached through <typeparamref name="TComponent"/> rather than an
/// interface the way every text/badge/border property is), and the conversion of one value into the two
/// forms the shell needs. An intermediate abstract base is deliberate here rather than duplication: the three
/// components render an identical surface and differ only in their CLR value type.
/// </para>
/// <para>
/// The root additionally carries the shared <c>ui-temporal-input</c> class alongside its own
/// <c>ui-date-input</c>/<c>ui-time-input</c>/<c>ui-date-time-input</c>, so one stylesheet and one client
/// engine serve all three — exactly how <c>SearchComponentRenderer</c> wears <c>ui-select</c> next to
/// <c>ui-search</c>.
/// </para>
/// </summary>
public abstract class TemporalInputRendererBase<TComponent, TValue> : TextContentRendererBase
    where TComponent : TemporalInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <summary>The shared class every part of the shell is named after, and what the client engine matches on.</summary>
    protected const string SharedClassName = "ui-temporal-input";

    private const char CulturePackSeparator = '|';

    public override string ComponentTypeKey => TComponent.ComponentTypeKey;

    /// <summary>
    /// Which surfaces the popup opens with — <c>date</c> (calendar only), <c>time</c> (clock only) or
    /// <c>date-time</c> (both, committed together).
    /// </summary>
    protected abstract string TemporalMode { get; }

    /// <summary>
    /// Whether this control opens a picker popup at all. <c>TimeInput</c> does not: it edits its value in
    /// place through segments, so the popup element would sit in every one of its rows unused.
    /// </summary>
    protected virtual bool HasPicker => true;

    /// <summary>
    /// The display format used when the author set no <c>DisplayFormat</c>. Per mode rather than one shared
    /// constant: <c>WebTemporalFormat</c>'s own empty-format fallback is a full timestamp, which reads
    /// wrongly in a date-only field.
    /// </summary>
    protected abstract string GetDefaultDisplayFormat(UITemporalStep? step);

    /// <summary>
    /// Converts the component's own value into the two forms the shell needs: the invariant canonical string
    /// the hidden input carries, and the <see cref="DateTime"/> the display formatter reads. Returns
    /// <see langword="false"/> when there is no value.
    /// </summary>
    protected abstract bool TryResolveTemporal(TValue? value, out DateTime moment, out string canonical);

    protected sealed override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class(SharedClassName);
        _ = root.Attribute("data-ui-temporal-mode", TemporalMode);

        _ = RenderProperty<string?>(context, root, ITextBaseComponent.TooltipProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("title", value);
        }, [WebDomOperation.Attribute("title")]);

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

        RenderValidationMessage(root, $"{SharedClassName}__message");
    }

    /// <summary>
    /// Everything the client needs to build the grid itself, as root attributes.
    /// <para>
    /// <c>Min</c>/<c>Max</c>/<c>DisplayFormat</c> stay live-patchable — a binding page cycles them and the
    /// engine re-renders an open popup off the mutation. <c>Step</c>, <c>FirstDayOfWeek</c> and the culture
    /// pack are resolved once, statically: the first two are author-time granularity decisions rather than
    /// something a running app flips, and the pack is <em>derived</em> server-side from a
    /// <see cref="CultureInfo"/>, which no client-side converter could reproduce from a patched value. Binding
    /// <c>Culture</c> therefore compiles and silently does nothing — the same static-only trap
    /// <c>TextInputComponent.ShowClearButton</c> has, recorded in <c>docs/PROJECT.md</c> §7.
    /// </para>
    /// </summary>
    private WebTemporalCulturePack RenderPickerMetadata(WebRenderContext context, IHtmlElementBuilder root, UITemporalStep? step, string defaultDisplayFormat)
    {
        _ = RenderProperty<TValue>(context, root, MinMaxInputComponentBase<TComponent, TValue>.MinProperty, (target, value) =>
        {
            if (TryResolveTemporal(value, out _, out var canonical))
                _ = target.Attribute("data-ui-temporal-min", canonical);
        }, [WebDomOperation.Attribute("data-ui-temporal-min", target: "root")]);

        _ = RenderProperty<TValue>(context, root, MinMaxInputComponentBase<TComponent, TValue>.MaxProperty, (target, value) =>
        {
            if (TryResolveTemporal(value, out _, out var canonical))
                _ = target.Attribute("data-ui-temporal-max", canonical);
        }, [WebDomOperation.Attribute("data-ui-temporal-max", target: "root")]);

        _ = RenderProperty<string?>(context, root, IFormattedInputComponent.DisplayFormatProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("data-ui-temporal-format", value);
        }, [WebDomOperation.Attribute("data-ui-temporal-format", target: "root")]);

        // A separate default, because DisplayFormat is live-patchable and can be patched to nothing: the
        // client needs a format to fall back on rather than rendering the canonical string.
        _ = root.Attribute("data-ui-temporal-default-format", defaultDisplayFormat);

        if (step is UITemporalStep resolvedStep)
        {
            _ = root.Attribute("data-ui-temporal-step", resolvedStep.Value.ToString(CultureInfo.InvariantCulture));
            _ = root.Attribute("data-ui-temporal-step-unit", StepUnitName(resolvedStep.Unit));
        }

        _ = ResolveRenderValue(context, TemporalInputComponentBase<TComponent, TValue>.FirstDayOfWeekProperty, out UIDayOfWeek? firstDayOfWeek, out _);

        // UIDayOfWeek starts at Monday, JavaScript's getDay() at Sunday; the shift converts between them.
        // Defaults to Monday rather than to the culture's own first day, which the pack does not carry.
        var firstDay = firstDayOfWeek is UIDayOfWeek day ? ((int)day + 1) % 7 : 1;
        _ = root.Attribute("data-ui-temporal-first-day", firstDay.ToString(CultureInfo.InvariantCulture));

        _ = ResolveRenderValue(context, IFormattedInputComponent.CultureProperty, out string? cultureName, out _);
        WebTemporalCulturePack culture = WebTemporalCulturePack.FromCulture(ResolveCulture(cultureName));

        _ = root.Attribute("data-ui-temporal-months", Join(culture.MonthNames));
        _ = root.Attribute("data-ui-temporal-months-genitive", Join(culture.MonthGenitiveNames));
        _ = root.Attribute("data-ui-temporal-months-short", Join(culture.AbbreviatedMonthNames));
        _ = root.Attribute("data-ui-temporal-daynames", Join(culture.DayNames));
        _ = root.Attribute("data-ui-temporal-weekdays", Join(culture.AbbreviatedDayNames));
        _ = root.Attribute("data-ui-temporal-am", culture.AmDesignator);
        _ = root.Attribute("data-ui-temporal-pm", culture.PmDesignator);

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

    /// <summary>
    /// Mirrors <c>UIFormattedValueNormalizer</c>'s own resolution — an unknown culture name falls back to the
    /// invariant one rather than throwing — so what the field displays and what the server parses can never
    /// disagree about which culture is in force.
    /// </summary>
    private static CultureInfo ResolveCulture(string? culture)
    {
        if (string.IsNullOrWhiteSpace(culture))
            return CultureInfo.InvariantCulture;

        try
        {
            return CultureInfo.GetCultureInfo(culture);
        }
        catch (CultureNotFoundException)
        {
            return CultureInfo.InvariantCulture;
        }
    }

    private static string Join(IReadOnlyList<string> names)
        => string.Join(CulturePackSeparator, names);


    /// <summary>
    /// The two value-bearing elements the picker splits its value across, plus the button that opens the
    /// popup.
    /// <para>
    /// The visible <c>__field</c> shows <c>DisplayFormat</c> text and is what the user types into; the hidden
    /// <c>__value-input</c> carries the invariant canonical value and is the <em>only</em> bound element, so a
    /// server-pushed <c>Value</c> lands there through the ordinary binding-selector target and
    /// <c>ValidationEngine</c>'s <c>data-ui-form-id</c> scan reads a canonical string rather than localized
    /// text. <c>TemporalPickerEngine</c> forwards the field's own <c>change</c> into it verbatim, so a typed
    /// string still reaches <c>UIFormattedValueNormalizer</c> as text.
    /// </para>
    /// </summary>
    protected virtual void RenderRow(WebRenderContext context, IHtmlElementBuilder root, WebTemporalCulturePack culture, string defaultDisplayFormat)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        var format = ResolveDisplayFormat(context, defaultDisplayFormat);

        IHtmlElementBuilder? field = null;
        IHtmlElementBuilder? toggle = null;

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{SharedClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = row.Element("input", input =>
            {
                field = input;

                _ = input.Class($"{SharedClassName}__field");
                _ = input.Attribute("type", "text");
                _ = input.Attribute("autocomplete", "off");
                _ = input.Attribute("placeholder", format);
            });

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            _ = row.Element("button", button =>
            {
                toggle = button;

                _ = button.Class($"{SharedClassName}__toggle");
                _ = button.Attribute("type", "button");
                _ = button.Attribute("tabindex", "-1");
                _ = button.Attribute("aria-haspopup", "dialog");
                _ = button.Attribute("aria-expanded", "false");
                _ = button.Attribute("data-ui-temporal-toggle");
            });
        });

        // The tree is written out only once the whole component is built (see `HtmlElementBuilder`), so
        // writing onto `field`/`toggle` from here — after their own element callbacks returned — is the same
        // deferred-mutation shape `RenderIcon`/`RenderTitle` already use to stamp a presence attribute back
        // onto the root.
        IHtmlElementBuilder displayField = field!;
        IHtmlElementBuilder toggleButton = toggle!;

        // One registration, two targets. `IsReadOnly` reaches both the field and the popup button, and a
        // property may only be rendered once per component (`WebRenderMetadata.RegisterRenderedProperty`), so
        // this cannot be two `RenderProperty` calls the way a single-element input gets away with.
        _ = RenderProperty<bool?>(context, displayField, IInputComponent.IsReadOnlyProperty, (target, value) =>
        {
            if (value != true)
                return;

            _ = target.Attribute("readonly");
            _ = toggleButton.Attribute("disabled");
        }, [
            WebDomOperation.ToggleAttribute("readonly", target: $".{SharedClassName}__field", condition: WebValueCondition.IsTrue),
            WebDomOperation.ToggleAttribute("disabled", target: $".{SharedClassName}__toggle", condition: WebValueCondition.IsTrue)
        ]);

        RenderValueInput(context, root, culture, format, text => _ = displayField.Attribute("value", text));
    }

    /// <summary>The effective display format: the author's <c>DisplayFormat</c>, or this mode's default.</summary>
    protected string ResolveDisplayFormat(WebRenderContext context, string defaultDisplayFormat)
    {
        _ = ResolveRenderValue(context, IFormattedInputComponent.DisplayFormatProperty, out string? displayFormat, out _);

        return string.IsNullOrWhiteSpace(displayFormat) ? defaultDisplayFormat : displayFormat;
    }

    /// <summary>
    /// The hidden input the value binds to, and the single place <c>Value</c> is registered — a property may
    /// be rendered only once per component, so every row shape has to come through here rather than
    /// registering its own. <paramref name="writeDisplay"/> puts the formatted text wherever that row keeps
    /// it: an <c>input</c>'s value for the text field, the element's own text for the segmented row.
    /// </summary>
    protected void RenderValueInput(WebRenderContext context, IHtmlElementBuilder root, WebTemporalCulturePack culture, string format, Action<string> writeDisplay)
    {
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(writeDisplay);

        _ = root.Element("input", valueInput =>
        {
            _ = valueInput.Class($"{SharedClassName}__value-input");
            _ = valueInput.Attribute("type", "hidden");

            NativeInputRendererBase.RenderFormId(context, valueInput);

            _ = RenderProperty<TValue>(context, valueInput, IInputComponent.ValueProperty, (target, value) =>
            {
                if (!TryResolveTemporal(value, out DateTime moment, out var canonical))
                    return;

                _ = target.Attribute("value", canonical);
                writeDisplay(WebTemporalFormat.Format(moment, format, culture));
            }, [WebDomOperation.Property("value")]);
        });
    }
}
