using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// The select's shell down to its <c>ui-select__*</c> names, so one client engine drives both; the field holds a chip per chosen
/// option — its badge, as <see cref="UIMultiSelectVariant.Badges"/> — and the list says it takes several. As
/// <see cref="UIMultiSelectVariant.Checkboxes"/>, a checkbox per option instead of both. The value is a JSON list of keys, read the
/// way an items view's chosen keys are.
/// </summary>
public sealed partial class MultiSelectComponentRenderer : ItemsCollectionRendererBase
{
    /// <summary>The root's mark beside <c>ui-multi-select</c> as <see cref="UIMultiSelectVariant.Badges"/>, which the stylesheet and the select engine read.</summary>
    public const string BadgeSelectClassName = WebClassNames.BadgeSelect;

    private const string ChipLabelClassName = WebClassNames.MultiSelectChipLabel;

    private static readonly WebDomOperation[] MaxSelectedOperations = [WebDomOperation.Attribute(WebAttributes.SelectMax, target: "root", converter: WebDomConverters.PositiveCount)];
    private static readonly WebDomOperation[] SelectedKeysOperations = [WebDomOperation.Attribute(WebAttributes.SelectedKeys, target: "root", converter: WebDomConverters.UniqueSelectedKeysAttribute)];

    public override string ComponentTypeKey => MultiSelectComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.MultiSelect;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        UIMultiSelectVariant variant = ReadRenderValue<UIMultiSelectVariant?>(context, MultiSelectComponent.VariantProperty, null) ?? UIMultiSelectVariant.Chips;

        // Free text never reaches here with checkboxes: the compiler refuses the pair.
        if (variant == UIMultiSelectVariant.Checkboxes)
        {
            RenderCheckboxes(context, root);
            return;
        }

        var freeText = ReadRenderValue<bool?>(context, MultiSelectComponent.AllowFreeTextProperty, null) == true;

        // Each chip its option's badge, rather than its words on the selection's tint.
        var badges = variant == UIMultiSelectVariant.Badges;

        _ = root.Class(WebClassNames.Select);

        if (badges)
            _ = root.Class(BadgeSelectClassName);

        RenderTooltip(context, root);
        TextContentRendererBase.RenderInputAppearance(context, root);
        TextContentRendererBase.RenderInputHeader(context, root, titleCanGoInside: true);
        SelectComponentRenderer.RenderAdornmentState(context, root);
        RenderMaxSelected(context, root);

        if (freeText)
            _ = root.Attribute(WebAttributes.SelectFreeText);

        if (freeText && ReadRenderValue<UITagEntry?>(context, MultiSelectComponent.TagEntryProperty, null) == UITagEntry.FirstSuggestion)
            _ = root.Attribute(WebAttributes.SelectTagEntry, "first-suggestion");

        WebRenderValueKind valueKind = RenderChosenKeys(context, root, out IReadOnlyList<string> chosenKeys, out CompiledUIBinding? valueBinding);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, SelectComponentRenderer.OptionWrapperElementName, SelectComponentRenderer.OptionWrapperClassName, itemWrapperRole: SelectComponentRenderer.OptionRole, announcesSelection: true);
        RegisterItemsFilterSortMetadata(context);

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderTrigger(context, root, items, chosenKeys, freeText, badges);
        RenderValueInput(context, root, valueKind, chosenKeys, valueBinding);
        SelectComponentRenderer.RenderPopup(context, root, items, isBound, new HashSet<string>(chosenKeys, StringComparer.Ordinal));

        RenderValidationMessage(context, root);
    }

    private static void RenderMaxSelected(WebRenderContext context, IHtmlElementBuilder root)
        => _ = RenderProperty<int?>(context, root, MultiSelectComponent.MaxSelectedProperty, static (target, value) =>
        {
            if (value is int max && max > 0)
                _ = target.Attribute(WebAttributes.SelectMax, max.ToString(CultureInfo.InvariantCulture));
        }, MaxSelectedOperations);

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
            if (Distinct(value) is { Count: > 0 } distinct)
                _ = target.Attribute(WebAttributes.SelectedKeys, JsonSerializer.Serialize(distinct));
        }, SelectedKeysOperations);

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

    /// <summary>
    /// The field's box: the chips, then — taking free text — the entry the reader types in, which is then the combobox in the box's
    /// place, so the same names, read-only mark and caption land on whichever control the reader reaches.
    /// </summary>
    private static void RenderTrigger(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<object?> items, IReadOnlyList<string> chosenKeys, bool freeText, bool badges)
    {
        _ = root.Element("div", trigger =>
        {
            _ = trigger.Class(WebClassNames.SelectTrigger);
            _ = trigger.Class("ui-multi-select__trigger");

            BorderStyleRenderer.RenderBorderStyle(context, trigger);

            // A focusable box rather than a button: the chips' remove buttons and the field's actions stand inside it, and a button holds no control.
            if (!freeText)
            {
                _ = trigger.Attribute("tabindex", "0");
                RenderCombobox(context, root, trigger);
            }

            FieldActionsRenderer.RenderLeadingGroups(context, trigger, WebClassNames.SelectAction, $"{WebClassNames.Select}__below");

            TextContentRendererBase.RenderInputHeaderInside(context, root, trigger);

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = trigger.Element("span", chips =>
            {
                _ = chips.Class(WebClassNames.MultiSelectChips);

                // The chips drawn on the first frame, so the field is not empty until the engine starts; the list's order is not theirs.
                var drawn = 0;

                for (var i = 0; i < chosenKeys.Count; i++)
                {
                    if (FindOptionTitle(items, chosenKeys[i], badges, out var content, out IBadgeModel? badge) is UIPhrase title)
                    {
                        RenderChip(context, chips, chosenKeys[i], title, content, badges ? badge ?? new BadgeItem() : null);
                        drawn++;
                    }
                    else if (freeText)
                    {
                        // A value the reader typed has no option: its key is its words, as written, on a badge of no look of its own.
                        RenderChip(context, chips, chosenKeys[i], UIPhrase.Text(chosenKeys[i]), content: true, badges ? new BadgeItem() : null);
                        drawn++;
                    }
                }

                // The clear reads it, as the client keeps it once it draws the chips.
                if (drawn > 0)
                    _ = chips.Attribute(WebAttributes.SelectChips);

                if (freeText)
                    _ = chips.Element("input", entry => RenderEntry(context, root, entry));

                // After the entry, whose `:placeholder-shown` hides it as a sibling once text is typed; placed over it, so the order shows nothing.
                SelectComponentRenderer.RenderPlaceholder(context, chips, hidden: drawn > 0);
            });

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: true));

            SelectComponentRenderer.RenderClear(context, trigger);
            SelectComponentRenderer.RenderChevron(trigger);
            FieldActionsRenderer.RenderTrailingGroups(context, trigger, WebClassNames.SelectAction, $"{WebClassNames.Select}__below");
        });
    }

    /// <summary>
    /// The control the reader reaches: its role, the list it opens, read-only as <c>aria-readonly</c> (focusable and readable, the
    /// engine refusing every change) and the caption as its name.
    /// </summary>
    private static void RenderCombobox(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder control)
    {
        _ = control.Attribute("role", "combobox");
        RenderPopupTrigger(control, "listbox");
        NativeInputRendererBase.RenderIsReadOnlyAsAria(context, root, control);
        TextContentRendererBase.RenderFieldLabel(context, control);
        SelectComponentRenderer.RenderClearKey(context, control);
    }

    /// <summary>
    /// The entry after the chips, where Enter or a comma makes a chip of the text: an editable combobox over the suggestions, as a
    /// search's field is. Its text is a draft, never the value — the engine keeps it from the value's listeners.
    /// </summary>
    private static void RenderEntry(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder entry)
    {
        _ = entry.Class(WebClassNames.MultiSelectEntry);
        _ = entry.Attribute("type", "text");
        NativeInputRendererBase.RenderFieldName(context, entry, "entry");
        _ = entry.Attribute("autocomplete", "off");
        _ = entry.Attribute("enterkeyhint", "enter");
        _ = entry.Attribute("aria-autocomplete", "list");

        // A blank one, so the stylesheet hides the field's placeholder once text is typed (:placeholder-shown).
        _ = entry.Attribute("placeholder", " ");

        RenderCombobox(context, root, entry);
    }

    /// <summary>
    /// What a chip shows for the option a key names: its title — a badge's words first, where the chips are badges — else the key
    /// itself; null where no option has the key. Content where the option says its words are (<see cref="IContentItem"/>), and where
    /// there are no words to look up.
    /// </summary>
    private static UIPhrase? FindOptionTitle(IReadOnlyList<object?> items, string key, bool badges, out bool content, out IBadgeModel? badge)
    {
        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is IBindableItem item && string.Equals(item.Id, key, StringComparison.Ordinal))
            {
                badge = items[i] as IBadgeModel;

                // A blank title from data falls to the key, and a blank key stands as it is: data must not fail the page.
                UIPhrase title = badges && badge?.BadgeTitle is UIPhrase badgeWords && UIPhrase.HasWords(badgeWords) ? badgeWords
                    : items[i] is ITextBaseModel { Title: { } words } && UIPhrase.HasWords(words) ? words
                    : UIPhrase.Text(key);

                content = items[i] is IContentItem { IsContent: true } || !UIPhrase.HasWords(title);
                return title;
            }
        }

        content = false;
        badge = null;
        return null;
    }

    /// <summary>
    /// One chosen option in the field: its words, translated as its row's are, and the button that takes it out, named for the
    /// option it removes; both marked, so a language switch writes them again. A content option's words stand as written, a phrase is
    /// always its words.
    /// </summary>
    private static void RenderChip(WebRenderContext context, IHtmlElementBuilder chips, string key, UIPhrase title, bool content, IBadgeModel? badge)
    {
        _ = chips.Element("span", chip =>
        {
            _ = chip.Class(WebClassNames.MultiSelectChip);
            _ = chip.Attribute(WebAttributes.SelectChip, key);

            // A badge chip is the option's badge itself, its words the badge's text and its remove inside it.
            if (badge is not null)
            {
                BadgeRenderer.RenderBadge(chip, badge, Words(context, title, content), text =>
                {
                    _ = text.Class(ChipLabelClassName);
                    WriteWords(context, text, title, content);
                });
            }
            else
            {
                _ = chip.Element("span", text =>
                {
                    _ = text.Class(ChipLabelClassName);
                    WriteWords(context, text, title, content);
                });
            }

            _ = chip.Element("button", remove =>
            {
                _ = remove.Class(WebClassNames.MultiSelectChipRemove);
                _ = remove.Attribute("type", "button");
                // Out of the tab order: Backspace in the field and the list's own toggle reach every chip without a stop per chip.
                _ = remove.Attribute("tabindex", "-1");
                WebWords.Write(context, remove, "aria-label", UIStrings.SelectRemove, new Dictionary<string, object?>(StringComparer.Ordinal) { ["label"] = LabelArgument(title, content) });
            });
        });
    }

    private static void WriteWords(WebRenderContext context, IHtmlElementBuilder text, UIPhrase title, bool content)
    {
        if (!title.IsText)
            WebWords.Write(context, text, null, title.Key, title.Arguments);
        else if (content)
            _ = text.Text(title.Key);
        else
            WebWords.WriteText(context, text, null, title.Key);
    }

    /// <summary>The words <see cref="WriteWords"/> writes, in the page's language: what a badge's fit is measured by.</summary>
    private static string Words(WebRenderContext context, UIPhrase title, bool content)
        => !title.IsText ? context.Translate(title.Key, title.Arguments)
            : content ? title.Key
            : context.Translator.Translate(context.ViewResolution.Session.Language, title.Key) ?? title.Key;

    /// <summary>The option's words as the removal's argument: an author's text of a content option as written (a literal), else the phrase.</summary>
    private static object? LabelArgument(UIPhrase title, bool content)
        => title.IsText && content ? (object)title.Key : title;

    /// <summary>The one value-bearing element: the chosen keys as JSON under the kind an items view's chosen keys are read by.</summary>
    private static void RenderValueInput(WebRenderContext context, IHtmlElementBuilder root, WebRenderValueKind valueKind, IReadOnlyList<string> chosenKeys, CompiledUIBinding? valueBinding)
        => NativeInputRendererBase.RenderHiddenValueInput(context, root, WebClassNames.SelectValueInput, input =>
        {
            _ = input.Attribute(WebAttributes.ValueKind, WebValueKinds.SelectedKeys);

            if (valueKind == WebRenderValueKind.Static)
                _ = input.Attribute(WebAttributes.SelectedKeys, JsonSerializer.Serialize(chosenKeys));

            if (valueBinding is not null)
                _ = input.Attribute(WebAttributes.BindValue, valueBinding.Id.Value.ToString(CultureInfo.InvariantCulture));
        });
}
