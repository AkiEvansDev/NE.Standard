using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// The select's shell down to its <c>ui-select__*</c> names, so one client engine drives both; the field holds a chip per chosen
/// option and the list says it takes several. The value is a JSON list of keys, read the way an items view's chosen keys are.
/// </summary>
public sealed class MultiSelectComponentRenderer : ItemsCollectionRendererBase
{
    private const string OptionRole = "option";

    public override string ComponentTypeKey => MultiSelectComponent.ComponentTypeKey;

    protected override string ClassName => "ui-multi-select";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-select");

        RenderTooltip(context, root);
        TextContentRendererBase.RenderInputAppearance(context, root);
        TextContentRendererBase.RenderInputHeader(context, root, titleCanGoInside: true);
        SelectComponentRenderer.RenderAdornmentState(context, root);
        RenderMaxSelected(context, root);

        WebRenderValueKind valueKind = RenderChosenKeys(context, root, out IReadOnlyList<string> chosenKeys, out CompiledUIBinding? valueBinding);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, SelectComponentRenderer.OptionWrapperElementName, SelectComponentRenderer.OptionWrapperClassName, itemWrapperRole: OptionRole, announcesSelection: true);
        RegisterItemsFilterSortMetadata(context);

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderTrigger(context, root, items, chosenKeys);
        RenderValueInput(context, root, valueKind, chosenKeys, valueBinding);
        SelectComponentRenderer.RenderPopup(context, root, items, isBound, new HashSet<string>(chosenKeys, StringComparer.Ordinal));

        RenderValidationMessage(context, root);
    }

    private static void RenderMaxSelected(WebRenderContext context, IHtmlElementBuilder root)
        => _ = RenderProperty<int?>(context, root, MultiSelectComponent.MaxSelectedProperty, static (target, value) =>
        {
            if (value is int max && max > 0)
                _ = target.Attribute(WebAttributes.SelectMax, max.ToString(CultureInfo.InvariantCulture));
        }, [WebDomOperation.Attribute(WebAttributes.SelectMax, target: "root")]);

    /// <summary>
    /// The chosen keys live in one root-level attribute, as the select's one key does; a key given twice is taken once, since the
    /// field holds each option at most once.
    /// </summary>
    private static WebRenderValueKind RenderChosenKeys(WebRenderContext context, IHtmlElementBuilder root, out IReadOnlyList<string> chosenKeys, out CompiledUIBinding? valueBinding)
    {
        WebRenderValueKind valueKind = ResolveRenderValue(context, IInputComponent.ValueProperty, out IReadOnlyList<string>? keys, out valueBinding);

        chosenKeys = Distinct(keys);

        _ = RenderProperty<IReadOnlyList<string>?>(context, root, IInputComponent.ValueProperty, static (target, value) =>
        {
            if (value is { Count: > 0 })
                _ = target.Attribute(WebAttributes.SelectedKeys, JsonSerializer.Serialize(Distinct(value)));
        }, [WebDomOperation.Attribute(WebAttributes.SelectedKeys, target: "root")]);

        return valueKind;
    }

    private static List<string> Distinct(IReadOnlyList<string>? keys)
    {
        List<string> distinct = [];

        if (keys is null)
            return distinct;

        HashSet<string> seen = new(StringComparer.Ordinal);

        for (var i = 0; i < keys.Count; i++)
        {
            if (!string.IsNullOrEmpty(keys[i]) && seen.Add(keys[i]))
                distinct.Add(keys[i]);
        }

        return distinct;
    }

    private static void RenderTrigger(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<object?> items, IReadOnlyList<string> chosenKeys)
    {
        _ = root.Element("div", trigger =>
        {
            _ = trigger.Class("ui-select__trigger");
            _ = trigger.Class("ui-multi-select__trigger");

            BorderStyleRenderer.RenderBorderStyle(context, trigger);

            // A focusable box rather than the select's button: the chips' remove buttons stand inside it, and a button holds no control.
            _ = trigger.Attribute("role", "combobox");
            _ = trigger.Attribute("tabindex", "0");
            RenderPopupTrigger(trigger, "listbox");

            // Read-only keeps the field focusable and its chips readable; the engine offers no list and removes nothing.
            NativeInputRendererBase.RenderIsReadOnlyAsAria(context, root, trigger);

            TextContentRendererBase.RenderFieldLabel(context, trigger);
            TextContentRendererBase.RenderInputHeaderInside(context, root, trigger);

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = trigger.Element("span", chips =>
            {
                _ = chips.Class("ui-multi-select__chips");

                // The chips drawn on the first frame, so the field is not empty until the engine starts; the list's order is not theirs.
                var drawn = 0;

                for (var i = 0; i < chosenKeys.Count; i++)
                {
                    if (FindOptionTitle(items, chosenKeys[i], out var content) is string title)
                    {
                        RenderChip(context, chips, chosenKeys[i], title, content);
                        drawn++;
                    }
                }

                SelectComponentRenderer.RenderPlaceholder(context, chips, hidden: drawn > 0);
            });

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: true));

            SelectComponentRenderer.RenderClear(context, trigger);
            SelectComponentRenderer.RenderChevron(trigger);
        });
    }

    /// <summary>
    /// What a chip shows for the option a key names: its title, else the key itself; null where no option has the key. Content where
    /// the option says its words are (<see cref="IContentItem"/>), and where there are no words to look up.
    /// </summary>
    private static string? FindOptionTitle(IReadOnlyList<object?> items, string key, out bool content)
    {
        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is IBindableItem item && string.Equals(item.Id, key, StringComparison.Ordinal))
            {
                // A blank title from data falls to the key, and a blank key stands as it is: data must not fail the page.
                var title = items[i] is ITextBaseModel { Title: { } text } && !string.IsNullOrWhiteSpace(text) ? text : key;

                content = items[i] is IContentItem { IsContent: true } || string.IsNullOrWhiteSpace(title);
                return title;
            }
        }

        content = false;
        return null;
    }

    /// <summary>
    /// One chosen option in the field: its words, translated as its row's are, and the button that takes it out, named for the
    /// option it removes; both marked, so a language switch writes them again. A content option's words stand as written.
    /// </summary>
    private static void RenderChip(WebRenderContext context, IHtmlElementBuilder chips, string key, string title, bool content)
    {
        _ = chips.Element("span", chip =>
        {
            _ = chip.Class("ui-multi-select__chip");
            _ = chip.Attribute(WebAttributes.SelectChip, key);

            _ = chip.Element("span", text =>
            {
                _ = text.Class("ui-multi-select__chip-label");

                if (content)
                    _ = text.Text(title);
                else
                    WebWords.WriteText(context, text, null, title);
            });

            _ = chip.Element("button", remove =>
            {
                _ = remove.Class("ui-multi-select__chip-remove");
                _ = remove.Attribute("type", "button");
                // Out of the tab order: Backspace in the field and the list's own toggle reach every chip without a stop per chip.
                _ = remove.Attribute("tabindex", "-1");
                WebWords.Write(context, remove, "aria-label", UIStrings.SelectRemove, new Dictionary<string, object?>(StringComparer.Ordinal) { ["label"] = content ? title : UIPhrase.Text(title) });
            });
        });
    }

    /// <summary>The one value-bearing element: the chosen keys as JSON under the kind an items view's chosen keys are read by.</summary>
    private static void RenderValueInput(WebRenderContext context, IHtmlElementBuilder root, WebRenderValueKind valueKind, IReadOnlyList<string> chosenKeys, CompiledUIBinding? valueBinding)
        => NativeInputRendererBase.RenderHiddenValueInput(context, root, "ui-select__value-input", input =>
        {
            _ = input.Attribute(WebAttributes.ValueKind, WebValueKinds.SelectedKeys);

            if (valueKind == WebRenderValueKind.Static)
                _ = input.Attribute(WebAttributes.SelectedKeys, JsonSerializer.Serialize(chosenKeys));

            if (valueBinding is not null)
                _ = input.Attribute(WebAttributes.BindValue, valueBinding.Id.Value.ToString(CultureInfo.InvariantCulture));
        });
}
