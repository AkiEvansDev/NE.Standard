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

    public override string ComponentTypeKey => SearchComponent.ComponentTypeKey;

    protected override string ClassName => "ui-search";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class(WebClassNames.Select);

        RenderTooltip(context, root);
        TextContentRendererBase.RenderInputAppearance(context, root);
        TextContentRendererBase.RenderInputHeader(context, root, titleCanGoInside: true);
        SelectComponentRenderer.RenderAdornmentState(context, root);

        WebRenderValueKind valueKind = SelectComponentRenderer.RenderSelectValue(context, root, out var currentValue, out CompiledUIBinding? valueBinding);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, SelectComponentRenderer.OptionWrapperElementName, SelectComponentRenderer.OptionWrapperClassName);
        RegisterItemsFilterSortMetadata(context);

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        SelectComponentRenderer.RenderTrigger(context, root, items, currentValue);
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
                _ = field.Class("ui-search__field ui-field-box");

                _ = field.Element("span", glyph =>
                {
                    _ = glyph.Class("ui-search__glyph");
                    _ = glyph.Attribute("aria-hidden", "true");
                });

                _ = field.Element("input", input => RenderSearchInput(context, input));
            });
        });
    }

    private static void RenderSearchInput(WebRenderContext context, IHtmlElementBuilder input)
    {
        _ = input.Class("ui-search__input");
        _ = input.Class("ui-field");
        _ = input.Attribute("type", "search");
        NativeInputRendererBase.RenderFieldName(context, input, "search");
        _ = input.Attribute("autocomplete", "off");

        // An editable combobox over the list below it: the engine names the list, says it is open and names the option the arrows mark.
        _ = input.Attribute("role", "combobox");
        _ = input.Attribute("aria-autocomplete", "list");
        _ = input.Attribute("aria-expanded", "false");
        TextContentRendererBase.RenderFieldLabel(context, input);

        // The framework's word: the author's placeholder is the closed field's, as a select's.
        WebWords.Write(context, input, "placeholder", UIStrings.SearchField);

        _ = RenderProperty<string?>(context, input, SearchComponent.SearchTextProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute("value", value);
        }, [WebDomOperation.Property("value")]);

        // Bound to SearchText, not Value: the field holds what is being typed, Value the option picked.
        _ = ResolveRenderValue(context, SearchComponent.SearchTextProperty, out string? _, out CompiledUIBinding? searchTextBinding);

        if (searchTextBinding is not null)
            _ = input.Attribute(WebAttributes.BindValue, searchTextBinding.Id.Value.ToString(CultureInfo.InvariantCulture));

        _ = RenderProperty<int?>(context, input, SearchComponent.DebounceMillisecondsProperty, static (target, value) =>
        {
            if (value is int milliseconds && milliseconds >= 0)
                _ = target.Attribute(WebAttributes.SearchDebounce, milliseconds.ToString(CultureInfo.InvariantCulture));
        }, [WebDomOperation.Attribute(WebAttributes.SearchDebounce, converter: WebDomConverters.NonNegativeCount)]);

        _ = RenderProperty<int?>(context, input, SearchComponent.MinSearchLengthProperty, static (target, value) =>
        {
            if (value is int length && length > 0)
                _ = target.Attribute(WebAttributes.SearchMinLength, length.ToString(CultureInfo.InvariantCulture));
        }, [WebDomOperation.Attribute(WebAttributes.SearchMinLength, converter: WebDomConverters.PositiveCount)]);

        RenderFlagAttribute(context, input, SearchComponent.AutoSearchProperty, WebAttributes.SearchManual, WebValueCondition.IsFalse);

        // The list is the server's answer: the client narrows nothing, or a refill it did not match would be hidden by its own filter.
        if (context.ViewResolution.View.Events.TryGet(new CompiledUIEventAddress(context.Node.ComponentId, EventNames.Search), out _))
            _ = input.Attribute(WebAttributes.SearchAnswered);
    }
}
