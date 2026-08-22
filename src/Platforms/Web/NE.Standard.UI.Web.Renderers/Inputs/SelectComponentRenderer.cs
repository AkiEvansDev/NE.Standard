using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// Renders as a custom trigger button + popup listbox rather than a native <c>&lt;select&gt;</c> — a
/// real <c>&lt;option&gt;</c> can only hold plain text, but each option renders its full item template
/// (icon/badge/description), the same as <c>RadioGroupComponentRenderer</c>. The closed trigger shows
/// the currently-selected option through that SAME template (not a plain string), but nothing here
/// renders it: <c>SelectInteractionEngine</c> clones the selected option out of the popup into the
/// trigger whenever the live-patched <c>data-ui-select-value</c> attribute changes. This renderer used to
/// pre-render one hidden copy of every option into the trigger for that; a client-rendered (bound)
/// collection could never produce those copies, which is the gap that change closed.
///
/// The value-input/popup/option rendering (everything except the trigger surface itself) is shared with
/// <c>SearchComponentRenderer</c> via the public statics below — a search box is the same popup+options
/// shell as a select, just with a live text input instead of a button as the trigger, and both use the
/// exact same <c>ui-select__*</c> class names/DOM shape for everything they share so
/// <c>SelectInteractionEngine</c> handles both without knowing which one it's looking at.
/// </summary>
public sealed class SelectComponentRenderer : ItemsCollectionRendererBase
{
    /// <summary>
    /// The shape <see cref="RenderPopup"/> gives each server-rendered option, registered as items metadata
    /// so a client-cloned one matches it. The listbox semantics that go with it (<c>role</c>,
    /// <c>tabindex</c>) are not expressible as a wrapper and are stamped by <c>SelectInteractionEngine</c>
    /// instead, the same split <c>RadioGroupComponentRenderer</c> makes with its own sync engine.
    /// </summary>
    public const string OptionWrapperElementName = "div";
    public const string OptionWrapperClassName = "ui-select__option";

    public override string ComponentTypeKey => SelectComponent.ComponentTypeKey;

    protected override string ClassName => "ui-select";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        TextContentRendererBase.RenderInputTooltip(context, root);
        TextContentRendererBase.RenderInputAppearance(context, root);
        TextContentRendererBase.RenderInputHeader(context, root);

        WebRenderValueKind valueKind = RenderSelectValue(context, root, out var currentValue, out CompiledUIBinding? valueBinding);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, OptionWrapperElementName, OptionWrapperClassName);
        RegisterItemsFilterSortMetadata(context);

        if (HasRequiredValidation(context))
            _ = root.Attribute("aria-required", "true");

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderTrigger(context, root);
        RenderValueInput(context, root, valueKind, currentValue, valueBinding);
        RenderPopup(context, root, items, isBound);

        _ = root.Element("span", message =>
        {
            _ = message.Class("ui-select__message");
            _ = message.Attribute("data-ui-validation-message");
        });
    }

    /// <summary>
    /// A single RenderProperty call can only ever drive one canonical DOM target, so which trigger
    /// candidate/option is shown as "selected" is driven by this one root-level attribute rather than
    /// per-candidate live patches. <c>SelectInteractionEngine</c> watches it (both for the initial
    /// post-connect delivery of a bound Value and any later change) and keeps the trigger content, the
    /// hidden value input, and each option's <c>aria-selected</c> in sync.
    /// </summary>
    public static WebRenderValueKind RenderSelectValue(WebRenderContext context, IHtmlElementBuilder root, out string? currentValue, out CompiledUIBinding? valueBinding)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        WebRenderValueKind valueKind = ResolveRenderValue(context, IInputComponent.ValueProperty, out currentValue, out valueBinding);

        _ = RenderProperty<string?>(context, root, IInputComponent.ValueProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute("data-ui-select-value", value);
        }, [WebDomOperation.Attribute("data-ui-select-value", target: "root")]);

        return valueKind;
    }

    private static void RenderTrigger(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = root.Element("button", trigger =>
        {
            _ = trigger.Class("ui-select__trigger");
            _ = trigger.Attribute("type", "button");
            _ = trigger.Attribute("aria-haspopup", "listbox");
            _ = trigger.Attribute("aria-expanded", "false");

            _ = RenderProperty<bool?>(context, trigger, IInputComponent.IsReadOnlyProperty, static (target, value) =>
            {
                if (value == true)
                    _ = target.Attribute("disabled");
            }, [WebDomOperation.ToggleAttribute("disabled", condition: WebValueCondition.IsTrue)]);

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = trigger.Element("span", placeholder =>
            {
                _ = placeholder.Class("ui-select__placeholder");

                _ = RenderProperty<string?>(context, placeholder, SelectComponent.PlaceholderProperty, static (target, value)
                    => _ = target.Text(string.IsNullOrEmpty(value) ? "Select…" : value)
                , [WebDomOperation.Text()]);
            });

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: true));

            RenderClear(context, trigger);

            _ = trigger.Element("span", chevron => chevron.Class("ui-select__chevron"));
        });
    }

    /// <summary>
    /// The clear affordance, shared with <c>SearchComponentRenderer</c> — without it that component
    /// declared <c>AllowEmptySelection</c> and rendered nothing for it, so a search box could never be
    /// cleared back to no selection.
    /// <para>
    /// A nested <c>&lt;button&gt;</c> inside Select's trigger <c>&lt;button&gt;</c> would be invalid HTML
    /// (and would toggle the popup via bubbling before ever reaching a dedicated click handler) — a plain
    /// <c>&lt;span&gt;</c> works for both, since <c>SelectInteractionEngine</c> resolves clicks by CSS
    /// target matching rather than native button semantics; see its <c>handleClick</c>'s dedicated
    /// <c>data-ui-select-clear</c> branch.
    /// </para>
    /// </summary>
    public static void RenderClear(WebRenderContext context, IHtmlElementBuilder trigger)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(trigger);

        if (!IsStaticallyClearable(context))
            return;

        _ = trigger.Element("span", clear =>
        {
            _ = clear.Class("ui-select__clear");
            _ = clear.Attribute("data-ui-select-clear");
            _ = clear.Attribute("role", "button");
            _ = clear.Attribute("aria-label", "Clear selection");
        });
    }

    /// <summary>
    /// <c>AllowEmptySelection</c> gates whether the clear span exists at all — resolved statically at
    /// render time (matching <c>TextInputComponentRenderer.ShouldRenderClearButton</c>'s precedent) since
    /// whether a selection is *currently* clearable (a value is actually selected) is a separate, dynamic
    /// concern <c>SelectInteractionEngine</c> already handles by toggling its visibility off the same
    /// <c>data-ui-select-value</c> attribute it uses for everything else.
    /// </summary>
    private static bool IsStaticallyClearable(WebRenderContext context)
    {
        WebRenderValueKind kind = ResolveRenderValue(context, SelectComponent.AllowEmptySelectionProperty, out bool? value, out _);
        return kind == WebRenderValueKind.Static && value == true;
    }

    /// <summary>
    /// The single, definite value-bearing element a form's Submit-trigger scan and the ordinary
    /// <c>ValueBindingEngine</c> read/sync against — unlike <c>RadioGroupComponentRenderer</c>'s N native
    /// radios, there's exactly one of these per component, so it can carry <c>data-ui-form-id</c>/
    /// <c>data-ui-bind-value</c> directly with no extra client-side fallback needed.
    /// </summary>
    public static void RenderValueInput(WebRenderContext context, IHtmlElementBuilder root, WebRenderValueKind valueKind, string? currentValue, CompiledUIBinding? valueBinding)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Element("input", input =>
        {
            _ = input.Class("ui-select__value-input");
            _ = input.Attribute("type", "hidden");

            if (valueKind == WebRenderValueKind.Static && !string.IsNullOrEmpty(currentValue))
                _ = input.Attribute("value", currentValue);

            if (valueBinding is not null)
                _ = input.Attribute("data-ui-bind-value", valueBinding.Id.Value.ToString(CultureInfo.InvariantCulture));

            _ = RenderProperty<string?>(context, input, IInputComponent.FormIdProperty, static (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                    _ = target.Attribute("data-ui-form-id", value);
            }, [WebDomOperation.Attribute("data-ui-form-id")]);
        });
    }

    public static void RenderPopup(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<object?> items, bool isBound)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(items);

        _ = root.Element("div", popup =>
        {
            _ = popup.Class("ui-select__popup");
            _ = popup.Attribute("role", "listbox");
            _ = popup.Attribute("data-ui-items-host");

            if (isBound)
                return;

            if (items.Count == 0)
            {
                RenderEmptyPlaceholder(context, popup);
                return;
            }

            RenderItemList(context, popup, items, OptionWrapperClassName, OptionWrapperElementName, static (optionRoot, _, _) =>
            {
                _ = optionRoot.Attribute("role", "option");
                _ = optionRoot.Attribute("tabindex", "0");
            });
        });
    }
}
