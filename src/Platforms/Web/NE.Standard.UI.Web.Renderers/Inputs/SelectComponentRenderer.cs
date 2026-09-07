using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A trigger button plus a popup listbox rather than a native <c>&lt;select&gt;</c>, since an
/// <c>&lt;option&gt;</c> holds plain text only and each option here draws its full item template; the statics
/// below are shared with <c>SearchComponentRenderer</c>.
/// </summary>
public sealed class SelectComponentRenderer : ItemsCollectionRendererBase
{
    /// <summary>The shape each server-rendered option gets, registered as items metadata so a client-cloned one matches.</summary>
    public const string OptionWrapperElementName = "div";
    public const string OptionWrapperClassName = "ui-select__option";

    private const string ClearableClassName = "ui-select--clearable";
    private const string NoChevronClassName = "ui-select--no-chevron";

    public override string ComponentTypeKey => SelectComponent.ComponentTypeKey;

    protected override string ClassName => "ui-select";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);
        TextContentRendererBase.RenderInputAppearance(context, root);
        TextContentRendererBase.RenderInputHeader(context, root);
        RenderAdornmentState(context, root);

        WebRenderValueKind valueKind = RenderSelectValue(context, root, out var currentValue, out CompiledUIBinding? valueBinding);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, OptionWrapperElementName, OptionWrapperClassName);
        RegisterItemsFilterSortMetadata(context);

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderTrigger(context, root, FindSelectedItem(items, currentValue));
        RenderValueInput(context, root, valueKind, currentValue, valueBinding);
        RenderPopup(context, root, items, isBound);

        RenderValidationMessage(context, root);
    }

    /// <summary>Whether the clear button and the chevron show, as two classes on the root; both are always in the tree.</summary>
    public static void RenderAdornmentState(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<bool?>(context, root, SelectComponent.ShowClearButtonProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class(ClearableClassName);
        }, [WebDomOperation.ToggleClass(ClearableClassName, condition: WebValueCondition.IsTrue)]);

        _ = RenderProperty<bool?>(context, root, SelectComponent.ShowChevronProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Class(NoChevronClassName);
        }, [WebDomOperation.ToggleClass(NoChevronClassName, condition: WebValueCondition.IsFalse)]);
    }

    /// <summary>
    /// The selection lives in one root-level attribute rather than per-option patches, because a
    /// <c>RenderProperty</c> call drives a single canonical DOM target.
    /// </summary>
    public static WebRenderValueKind RenderSelectValue(WebRenderContext context, IHtmlElementBuilder root, out string? currentValue, out CompiledUIBinding? valueBinding)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        WebRenderValueKind valueKind = ResolveRenderValue(context, IInputComponent.ValueProperty, out currentValue, out valueBinding);

        _ = RenderProperty<string?>(context, root, IInputComponent.ValueProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute(WebAttributes.SelectValue, value);
        }, [WebDomOperation.Attribute(WebAttributes.SelectValue, target: "root")]);

        return valueKind;
    }

    /// <summary>The option the value names, or null where the list is client-side or nothing is chosen.</summary>
    private static object? FindSelectedItem(IReadOnlyList<object?> items, object? currentValue)
    {
        if (currentValue is not string key || key.Length == 0)
            return null;

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is IBindableItem item && string.Equals(item.Id, key, StringComparison.Ordinal))
                return items[i];
        }

        return null;
    }

    private static void RenderTrigger(WebRenderContext context, IHtmlElementBuilder root, object? selectedItem)
    {
        _ = root.Element("button", trigger =>
        {
            _ = trigger.Class("ui-select__trigger");
            _ = trigger.Attribute("type", "button");

            // On the trigger, not the root: the trigger is this control's field, as on every other input.
            BorderStyleRenderer.RenderBorderStyle(context, trigger);

            RenderPopupTrigger(trigger, "listbox");

            NativeInputRendererBase.RenderIsReadOnlyAsDisabled(context, trigger);

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: false));

            // The chosen option drawn here on the first frame, so the field is not empty until the connection is up.
            if (selectedItem is not null)
            {
                _ = trigger.Element("span", content =>
                {
                    _ = content.Class("ui-select__trigger-content");
                    _ = content.Attribute(WebAttributes.SelectContent, ((IBindableItem)selectedItem).Id);
                    _ = content.Style("display", "inline-flex");

                    RenderPresentationItem(context, content, selectedItem);
                });
            }

            _ = trigger.Element("span", placeholder =>
            {
                _ = placeholder.Class("ui-select__placeholder");

                if (selectedItem is not null)
                    _ = placeholder.Style("display", "none");

                var fallback = context.Translate(UIStrings.SelectPlaceholder);

                _ = RenderProperty<string?>(context, placeholder, IPlaceholderInputComponent.PlaceholderProperty, (target, value)
                    => _ = target.Text(string.IsNullOrEmpty(value) ? fallback : value)
                , [WebDomOperation.Text()]);
            });

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: true));

            RenderClear(context, trigger);
            RenderChevron(trigger);
        });
    }

    /// <summary>The clear affordance; a span, not a button, since it sits inside the trigger button.</summary>
    public static void RenderClear(WebRenderContext context, IHtmlElementBuilder trigger)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(trigger);

        _ = trigger.Element("span", clear =>
        {
            _ = clear.Class("ui-select__clear");
            _ = clear.Attribute(WebAttributes.SelectClear);
            _ = clear.Attribute("role", "button");
            _ = clear.Attribute("aria-label", context.Translate(UIStrings.SelectClear));
        });
    }

    /// <summary>The mark that says the field opens a list.</summary>
    public static void RenderChevron(IHtmlElementBuilder trigger)
    {
        ArgumentNullException.ThrowIfNull(trigger);

        _ = trigger.Element("span", chevron => chevron.Class("ui-select__chevron"));
    }

    /// <summary>The one value-bearing element per component, so it carries the form and binding attributes directly.</summary>
    public static void RenderValueInput(WebRenderContext context, IHtmlElementBuilder root, WebRenderValueKind valueKind, string? currentValue, CompiledUIBinding? valueBinding)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        NativeInputRendererBase.RenderHiddenValueInput(context, root, "ui-select__value-input", input =>
        {
            if (valueKind == WebRenderValueKind.Static && !string.IsNullOrEmpty(currentValue))
                _ = input.Attribute("value", currentValue);

            if (valueBinding is not null)
                _ = input.Attribute(WebAttributes.BindValue, valueBinding.Id.Value.ToString(CultureInfo.InvariantCulture));
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
            _ = popup.Attribute(WebAttributes.ItemsHost);

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
