using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// <see cref="SelectComponent"/>'s field and list, down to the <c>ui-select__*</c> names, so one client engine drives both; the list
/// carries the search's text field pinned over its options.
/// </summary>
public sealed class SearchComponentRenderer : ItemsCollectionRendererBase
{
    private static readonly WebDomOperation[] FieldAppearanceOperations = [WebDomOperation.Class(converter: WebDomConverters.InputAppearanceClass)];

    private static readonly WebDomOperation[] ValueOperations = [WebDomOperation.Property("value")];
    private static readonly WebDomOperation[] MinLengthOperations = [WebDomOperation.Attribute(WebAttributes.SearchMinLength, converter: WebDomConverters.PositiveCount)];

    public override string ComponentTypeKey => SearchComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Search;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        var freeText = ReadRenderValue<bool?>(context, SearchComponent.AllowFreeTextProperty, null) == true;

        _ = root.Class(WebClassNames.Select);

        if (freeText)
            _ = root.Attribute(WebAttributes.SelectFreeText);

        RenderTooltip(context, root);
        TextContentRendererBase.RenderInputAppearance(context, root);
        TextContentRendererBase.RenderInputHeader(context, root, titleCanGoInside: true);
        SelectComponentRenderer.RenderAdornmentState(context, root);

        WebRenderValueKind valueKind = SelectComponentRenderer.RenderSelectValue(context, root, out var currentValue, out CompiledUIBinding? valueBinding);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, SelectComponentRenderer.OptionWrapperElementName, SelectComponentRenderer.OptionWrapperClassName, itemWrapperRole: SelectComponentRenderer.OptionRole);
        RegisterItemsFilterSortMetadata(context);

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        SelectComponentRenderer.RenderTrigger(context, root, items, currentValue, freeText);
        SelectComponentRenderer.RenderValueInput(context, root, valueKind, currentValue, valueBinding);
        SelectComponentRenderer.RenderPopup(context, root, items, isBound, head: popup => RenderSearchField(context, popup));

        RenderValidationMessage(context, root);
    }

    /// <summary>
    /// The field the term is typed into, a glyph before it, at the top of the open list: a field's box under a head wearing its
    /// appearance, as a field's root does, so the stylesheet draws it as every field.
    /// </summary>
    private static void RenderSearchField(WebRenderContext context, IHtmlElementBuilder popup)
    {
        _ = popup.Element("div", head =>
        {
            _ = head.Class("ui-search__head");

            _ = RenderProperty<UIInputAppearance?>(context, head, SearchComponent.SearchFieldAppearanceProperty, static (target, value) =>
            {
                if (value is UIInputAppearance appearance)
                    _ = target.Class(WebClassNames.InputAppearance(appearance));
            }, FieldAppearanceOperations);

            _ = head.Element("div", field =>
            {
                _ = field.Class($"{WebClassNames.SearchField} {WebClassNames.FieldBox}");

                // An icon rather than a mark the stylesheet draws: an application's glyph map (MapUIGlyph) reaches it, as it reaches a search field's.
                IconValueRenderer.RenderIcon(field, UIGlyphs.Search, $"ui-search__glyph {WebClassNames.IconSize(UISize.Small)}");

                _ = field.Element("input", input => RenderSearchInput(context, input));
            });
        });
    }

    private static void RenderSearchInput(WebRenderContext context, IHtmlElementBuilder input)
    {
        _ = input.Class(WebClassNames.SearchInput);
        _ = input.Class(WebClassNames.Field);
        _ = input.Attribute("type", "search");
        NativeInputRendererBase.RenderFieldName(context, input, "search");
        _ = input.Attribute("autocomplete", "off");

        // An editable combobox over the list below it: the engine points it at the list (aria-controls), says it is open and names the
        // option the arrows mark.
        _ = input.Attribute("role", "combobox");
        _ = input.Attribute("aria-autocomplete", "list");
        _ = input.Attribute("aria-expanded", "false");
        TextContentRendererBase.RenderFieldLabel(context, input);

        if (!TextContentRendererBase.IsFieldNamed(context))
            WebWords.Write(context, input, "aria-label", UIStrings.SearchField);

        // The framework's word: the author's placeholder is the closed field's, as a select's.
        WebWords.Write(context, input, "placeholder", UIStrings.SearchField);

        _ = RenderProperty<string?>(context, input, SearchComponent.SearchTextProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute("value", value);
        }, ValueOperations);

        // Bound to SearchText, not Value: the field holds what is being typed, Value the option picked.
        _ = ResolveRenderValue(context, SearchComponent.SearchTextProperty, out string? _, out CompiledUIBinding? searchTextBinding);

        if (searchTextBinding is not null)
            _ = input.Attribute(WebAttributes.BindValue, searchTextBinding.Id.Value.ToString(CultureInfo.InvariantCulture));

        NativeInputRendererBase.RenderSearchDebounce(context, input);

        _ = RenderProperty<int?>(context, input, SearchComponent.MinSearchLengthProperty, static (target, value) =>
        {
            if (value is int length && length > 0)
                _ = target.Attribute(WebAttributes.SearchMinLength, length.ToString(CultureInfo.InvariantCulture));
        }, MinLengthOperations);

        RenderFlagAttribute(context, input, SearchComponent.AutoSearchProperty, WebAttributes.SearchManual, WebValueCondition.IsFalse);

        // The list is the server's answer: the client narrows nothing, or a refill it did not match would be hidden by its own filter.
        if (context.ViewResolution.View.Events.TryGet(new CompiledUIEventAddress(context.Node.ComponentId, EventNames.Search), out _))
            _ = input.Attribute(WebAttributes.SearchAnswered);
    }
}
