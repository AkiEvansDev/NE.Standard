using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// The same popup shell as <see cref="SelectComponent"/>, down to the <c>ui-select__*</c> names, so one
/// client engine drives both; only the trigger differs, being a live text input rather than a button.
/// </summary>
public sealed class SearchComponentRenderer : ItemsCollectionRendererBase
{
    public override string ComponentTypeKey => SearchComponent.ComponentTypeKey;

    protected override string ClassName => "ui-search";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-select");

        RenderTooltip(context, root);
        TextContentRendererBase.RenderInputAppearance(context, root);
        TextContentRendererBase.RenderInputHeader(context, root);
        SelectComponentRenderer.RenderAdornmentState(context, root);

        WebRenderValueKind valueKind = SelectComponentRenderer.RenderSelectValue(context, root, out var currentValue, out CompiledUIBinding? valueBinding);

        _ = RenderProperty<UISearchSelectionDisplayMode?>(context, root, SearchComponent.SelectionDisplayModeProperty, static (target, value) =>
        {
            if (value is UISearchSelectionDisplayMode mode)
                _ = target.Class(WebClassNames.SearchSelectionMode(mode));
        }, [WebDomOperation.Class(converter: WebDomConverters.SearchSelectionModeClass)]);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, SelectComponentRenderer.OptionWrapperElementName, SelectComponentRenderer.OptionWrapperClassName);
        RegisterItemsFilterSortMetadata(context);

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderTrigger(context, root);
        SelectComponentRenderer.RenderValueInput(context, root, valueKind, currentValue, valueBinding);
        SelectComponentRenderer.RenderPopup(context, root, items, isBound);

        RenderValidationMessage(context, root);
    }

    private static void RenderTrigger(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = root.Element("div", trigger =>
        {
            _ = trigger.Class("ui-select__trigger");
            _ = trigger.Class("ui-search__trigger");

            BorderStyleRenderer.RenderBorderStyle(context, trigger);

            // A click on this trigger may be the caret being placed in the text field, not a request to close.
            _ = trigger.Attribute(WebAttributes.SelectTriggerMode, "input");

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: false));

            RenderSearchInput(context, trigger);

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: true));

            SelectComponentRenderer.RenderClear(context, trigger);
            SelectComponentRenderer.RenderChevron(trigger);
        });
    }

    private static void RenderSearchInput(WebRenderContext context, IHtmlElementBuilder trigger)
    {
        _ = trigger.Element("input", input =>
        {
            _ = input.Class("ui-search__input");
            _ = input.Class("ui-field");
            _ = input.Attribute("type", "search");
            NativeInputRendererBase.RenderFieldName(context, input, "search");
            _ = input.Attribute("autocomplete", "off");

            // The trigger is the input here, so the placeholder goes on the native attribute, not a span.
            NativeInputRendererBase.RenderPlaceholder(context, input);

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
            }, [WebDomOperation.Attribute(WebAttributes.SearchDebounce)]);

            _ = RenderProperty<int?>(context, input, SearchComponent.MinSearchLengthProperty, static (target, value) =>
            {
                if (value is int length && length > 0)
                    _ = target.Attribute(WebAttributes.SearchMinLength, length.ToString(CultureInfo.InvariantCulture));
            }, [WebDomOperation.Attribute(WebAttributes.SearchMinLength)]);

            _ = RenderProperty<bool?>(context, input, SearchComponent.AutoSearchProperty, static (target, value) =>
            {
                if (value == false)
                    _ = target.Attribute(WebAttributes.SearchManual);
            }, [WebDomOperation.ToggleAttribute(WebAttributes.SearchManual, condition: WebValueCondition.IsFalse)]);

            NativeInputRendererBase.RenderIsReadOnly(context, input);
        });
    }
}
