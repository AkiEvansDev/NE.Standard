using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Authoring.Components;
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
/// A search box is the same popup + options shell as <see cref="SelectComponent"/> —
/// this renderer reuses <see cref="SelectComponentRenderer"/>'s public statics for everything except the
/// trigger, which is a live text input instead of a button, and shares its exact <c>ui-select__*</c>
/// class names/DOM shape so the client's <c>SelectInteractionEngine</c> handles both without needing to
/// know which one it's looking at (the root additionally carries the "ui-select" class alongside its own
/// "ui-search" for that reason). Typing debounce/dispatch is a separate concern, owned by
/// <c>SearchInputEngine</c> client-side.
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

        TextContentRendererBase.RenderInputTooltip(context, root);
        TextContentRendererBase.RenderInputAppearance(context, root);
        TextContentRendererBase.RenderInputHeader(context, root);

        WebRenderValueKind valueKind = SelectComponentRenderer.RenderSelectValue(context, root, out var currentValue, out CompiledUIBinding? valueBinding);

        _ = RenderProperty<UISearchSelectionDisplayMode?>(context, root, SearchComponent.SelectionDisplayModeProperty, static (target, value) =>
        {
            if (value is UISearchSelectionDisplayMode mode)
                _ = target.Class(WebClassNames.SearchSelectionMode(mode));
        }, [WebDomOperation.Class(converter: WebDomConverters.SearchSelectionModeClass)]);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, SelectComponentRenderer.OptionWrapperElementName, SelectComponentRenderer.OptionWrapperClassName);
        RegisterItemsFilterSortMetadata(context);

        if (HasRequiredValidation(context))
            _ = root.Attribute("aria-required", "true");

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderTrigger(context, root);
        SelectComponentRenderer.RenderValueInput(context, root, valueKind, currentValue, valueBinding);
        SelectComponentRenderer.RenderPopup(context, root, items, isBound);

        _ = root.Element("span", message =>
        {
            _ = message.Class("ui-select__message");
            _ = message.Attribute("data-ui-validation-message");
        });
    }

    private static void RenderTrigger(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = root.Element("div", trigger =>
        {
            _ = trigger.Class("ui-select__trigger");
            _ = trigger.Class("ui-search__trigger");

            // Tells SelectInteractionEngine's shared open/close click handler that a click directly on
            // this trigger may be the user placing the caret in a live text field, not asking to close.
            _ = trigger.Attribute("data-ui-select-trigger-mode", "input");

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: false));

            RenderSearchInput(context, trigger);

            if (HasRequiredValidation(context))
            {
                _ = trigger.Element("span", required =>
                {
                    _ = required.Class("ui-select__required");
                    _ = required.Text("*");
                });
            }

            _ = trigger.Element("span", icon => TextContentRendererBase.RenderInputAffixIcon(context, root, icon, suffix: true));

            SelectComponentRenderer.RenderClear(context, trigger);

            _ = trigger.Element("span", chevron => chevron.Class("ui-select__chevron"));
        });
    }

    private static void RenderSearchInput(WebRenderContext context, IHtmlElementBuilder trigger)
    {
        _ = trigger.Element("input", input =>
        {
            _ = input.Class("ui-search__input");
            _ = input.Attribute("type", "search");
            _ = input.Attribute("autocomplete", "off");

            // Select draws its own placeholder span; a search box has no room for one because its trigger *is*
            // the input, so the inherited property goes onto the native attribute instead.
            _ = RenderProperty<string?>(context, input, SelectComponent.PlaceholderProperty, static (target, value) =>
            {
                if (!string.IsNullOrEmpty(value))
                    _ = target.Attribute("placeholder", value);
            }, [WebDomOperation.Attribute("placeholder")]);

            _ = RenderProperty<string?>(context, input, SearchComponent.SearchTextProperty, static (target, value) =>
            {
                if (!string.IsNullOrEmpty(value))
                    _ = target.Attribute("value", value);
            }, [WebDomOperation.Property("value")]);

            // SearchText, not Value, is what this input is bound to: the field holds what the user is typing,
            // while Value holds the option they eventually picked. Property, not Attribute — a live patch has
            // to reach the element's current value once it has diverged from its attribute.
            _ = ResolveRenderValue(context, SearchComponent.SearchTextProperty, out string? _, out CompiledUIBinding? searchTextBinding);

            if (searchTextBinding is not null)
                _ = input.Attribute("data-ui-bind-value", searchTextBinding.Id.Value.ToString(CultureInfo.InvariantCulture));

            _ = RenderProperty<int?>(context, input, SearchComponent.DebounceMillisecondsProperty, static (target, value) =>
            {
                if (value is int milliseconds && milliseconds >= 0)
                    _ = target.Attribute("data-ui-search-debounce", milliseconds.ToString(CultureInfo.InvariantCulture));
            }, [WebDomOperation.Attribute("data-ui-search-debounce")]);

            _ = RenderProperty<int?>(context, input, SearchComponent.MinSearchLengthProperty, static (target, value) =>
            {
                if (value is int length && length > 0)
                    _ = target.Attribute("data-ui-search-min-length", length.ToString(CultureInfo.InvariantCulture));
            }, [WebDomOperation.Attribute("data-ui-search-min-length")]);

            _ = RenderProperty<bool?>(context, input, SearchComponent.AutoSearchProperty, static (target, value) =>
            {
                if (value == false)
                    _ = target.Attribute("data-ui-search-manual");
            }, [WebDomOperation.ToggleAttribute("data-ui-search-manual", condition: WebValueCondition.IsFalse)]);

            _ = RenderProperty<bool?>(context, input, IInputComponent.IsReadOnlyProperty, static (target, value) =>
            {
                if (value == true)
                    _ = target.Attribute("readonly");
            }, [WebDomOperation.ToggleAttribute("readonly", condition: WebValueCondition.IsTrue)]);
        });
    }
}
