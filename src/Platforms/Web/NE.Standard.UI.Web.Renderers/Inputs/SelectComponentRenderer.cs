using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A trigger button plus a popup listbox, not a native <c>&lt;select&gt;</c>, since <c>&lt;option&gt;</c> holds plain text only
/// and each option draws its full item template.
/// </summary>
public sealed class SelectComponentRenderer : ItemsCollectionRendererBase
{
    /// <summary>The shape each server-rendered option gets, registered as items metadata so a client-cloned one matches.</summary>
    public const string OptionWrapperElementName = "div";
    public const string OptionWrapperClassName = "ui-select__option";

    /// <summary>What every option row is to assistive technology, the server's and the client's alike.</summary>
    public const string OptionRole = "option";

    // The floating panel, and the listbox the options stand in: one element in a select, two in a search, whose field stands between.
    private const string PopupClassName = "ui-select__popup";
    private const string ListClassName = "ui-select__list";

    private const string ClearableClassName = "ui-select--clearable";
    private const string NoChevronClassName = "ui-select--no-chevron";

    public override string ComponentTypeKey => SelectComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Select;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);
        TextContentRendererBase.RenderInputAppearance(context, root);
        TextContentRendererBase.RenderInputHeader(context, root, titleCanGoInside: true);
        RenderAdornmentState(context, root);

        WebRenderValueKind valueKind = RenderSelectValue(context, root, out var currentValue, out CompiledUIBinding? valueBinding);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, OptionWrapperElementName, OptionWrapperClassName, itemWrapperRole: OptionRole);
        RegisterItemsFilterSortMetadata(context);

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderTrigger(context, root, items, currentValue);
        RenderValueInput(context, root, valueKind, currentValue, valueBinding);
        RenderPopup(context, root, items, isBound);

        RenderValidationMessage(context, root);
    }

    /// <summary>
    /// Whether the clear button and the chevron show, as two classes on the root, both always in the tree; and where the list
    /// opens, when that is not the default.
    /// </summary>
    public static void RenderAdornmentState(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderFlagClass(context, root, SelectComponent.ShowClearButtonProperty, ClearableClassName);

        RenderFlagClass(context, root, SelectComponent.ShowChevronProperty, NoChevronClassName, WebValueCondition.IsFalse);

        _ = ResolveRenderValue(context, SelectComponent.PopupPlacementProperty, out UIPopupPlacement? placement, out _);

        if (placement is UIPopupPlacement resolved && resolved != UIPopupPlacement.BottomStart)
            _ = root.Attribute(WebAttributes.SelectPlacement, WebClassNames.PopupPlacement(resolved));
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

    /// <summary>
    /// The field closed: a button showing the chosen option as the list draws it, else the placeholder, between the affix icons, with
    /// the clear and the chevron — a select's and a search's alike.
    /// </summary>
    public static void RenderTrigger(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<object?> items, string? currentValue)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(items);

        RenderTrigger(context, root, FindSelectedItem(items, currentValue));
    }

    /// <summary>The option the value names, or null where the list is client-side or nothing is chosen.</summary>
    private static object? FindSelectedItem(IReadOnlyList<object?> items, string? currentValue)
    {
        if (string.IsNullOrEmpty(currentValue))
            return null;

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is IBindableItem item && string.Equals(item.Id, currentValue, StringComparison.Ordinal))
                return items[i];
        }

        return null;
    }

    private static void RenderTrigger(WebRenderContext context, IHtmlElementBuilder root, object? selectedItem)
    {
        _ = root.Element("button", trigger =>
        {
            _ = trigger.Class(WebClassNames.SelectTrigger);
            _ = trigger.Attribute("type", "button");

            // On the trigger, not the root: the trigger is this control's field, as on every other input.
            BorderStyleRenderer.RenderBorderStyle(context, trigger);

            RenderPopupTrigger(trigger, "listbox");

            // Read-only keeps the trigger focusable and its value readable, as the multi-select's; the engine offers no list.
            NativeInputRendererBase.RenderIsReadOnlyAsAria(context, root, trigger);

            // A select-only combobox: the caption is its name and the chosen option drawn inside it is its value.
            _ = trigger.Attribute("role", "combobox");
            TextContentRendererBase.RenderFieldLabel(context, trigger);

            TextContentRendererBase.RenderInputHeaderInside(context, root, trigger);

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

            RenderPlaceholder(context, trigger, hidden: selectedItem is not null);

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: true));

            RenderClear(context, trigger);
            RenderChevron(trigger);
        });
    }

    /// <summary>What stands in the field while nothing is chosen: the author's placeholder, else the framework's word.</summary>
    public static void RenderPlaceholder(WebRenderContext context, IHtmlElementBuilder parent, bool hidden)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(parent);

        _ = parent.Element("span", placeholder =>
        {
            _ = placeholder.Class("ui-select__placeholder");

            if (hidden)
                _ = placeholder.Style("display", "none");

            // The framework's word is marked, so a language switch writes it again; the author's is the property's own.
            _ = RenderProperty<string?>(context, placeholder, IPlaceholderInputComponent.PlaceholderProperty, (target, value) =>
            {
                if (string.IsNullOrEmpty(value))
                    WebWords.Write(context, target, null, UIStrings.SelectPlaceholder);
                else
                    _ = target.Text(value);
            }, [WebDomOperation.Text()]);
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
            WebWords.Write(context, clear, "aria-label", UIStrings.SelectClear);
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

    /// <summary>
    /// The list the field opens. Given the chosen keys it is a multi-select's: the listbox says it takes several, and every option
    /// says whether it is chosen on the first paint. Given a head (a search's field), the popup holds it pinned over the listbox,
    /// and only the listbox scrolls.
    /// </summary>
    public static void RenderPopup(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<object?> items, bool isBound, IReadOnlySet<string>? chosenKeys = null, Action<IHtmlElementBuilder>? head = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(items);

        if (head is null)
        {
            RenderList(context, root, items, isBound, chosenKeys, isPopup: true);
            return;
        }

        _ = root.Element("div", popup =>
        {
            _ = popup.Class(PopupClassName);

            head(popup);
            RenderList(context, popup, items, isBound, chosenKeys, isPopup: false);
        });
    }

    private static void RenderList(WebRenderContext context, IHtmlElementBuilder parent, IReadOnlyList<object?> items, bool isBound, IReadOnlySet<string>? chosenKeys, bool isPopup)
    {
        RenderItemsHost(context, parent, isPopup ? PopupClassName : ListClassName, items, isBound, OptionWrapperClassName, configureHost: list =>
        {
            if (isPopup)
                _ = list.Class(ListClassName);

            _ = list.Attribute("role", "listbox");

            if (chosenKeys is not null)
                _ = list.Attribute("aria-multiselectable", "true");
        }, OptionWrapperElementName, decorateItem: (optionRoot, item, index) =>
        {
            _ = optionRoot.Attribute("role", OptionRole);
            // Out of the Tab order, as the client's own options are: the list's roving index gives the one stop as it opens.
            _ = optionRoot.Attribute("tabindex", "-1");

            if (chosenKeys is not null)
                _ = optionRoot.Attribute("aria-selected", item is IBindableItem option && chosenKeys.Contains(option.Id) ? "true" : "false");
        });
    }
}
