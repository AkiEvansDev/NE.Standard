using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
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
/// Renders each option through the same templated-item machinery as <c>ItemsViewComponent</c>
/// (<see cref="ItemsCollectionRendererBase"/>), with a hidden native radio input injected ahead of the
/// template content per item (mirroring <c>CheckboxComponentRenderer</c>'s label-wraps-input shell) so
/// selection gets real keyboard/click semantics for free.
/// </summary>
public sealed class RadioGroupComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-radio-group__item";

    public override string ComponentTypeKey => RadioGroupComponent.ComponentTypeKey;

    protected override string ClassName => "ui-radio-group";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        TextContentRendererBase.RenderInputTooltip(context, root);
        TextContentRendererBase.RenderInputHeader(context, root);

        _ = root.Attribute("role", "radiogroup");

        _ = RenderProperty<UIOrientation?>(context, root, RadioGroupComponent.OrientationProperty, static (target, value) =>
        {
            if (value is UIOrientation orientation)
                _ = target.Class(WebClassNames.Orientation(orientation));
        }, [WebDomOperation.Class(converter: WebDomConverters.OrientationClass)]);

        // The initial `checked` option is decided once, here, by comparing the resolved Value against
        // each option's Id (see RenderRadioInput) — a single RenderProperty call can only ever drive ONE
        // element, and this one value has to reach N radios. Live changes therefore travel a root-level
        // data-ui-radio-value attribute that RadioGroupSyncEngine watches and fans out.
        WebRenderValueKind valueKind = ResolveRenderValue(context, IInputComponent.ValueProperty, out string? currentValue, out CompiledUIBinding? valueBinding);

        _ = RenderProperty<string?>(context, root, IInputComponent.ValueProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute("data-ui-radio-value", value);
        }, [WebDomOperation.Attribute("data-ui-radio-value", target: "root")]);

        WebRenderValueKind isReadOnlyKind = ResolveRenderValue(context, IInputComponent.IsReadOnlyProperty, out bool? isReadOnly, out _);
        var isReadOnlyStatic = isReadOnlyKind == WebRenderValueKind.Static && isReadOnly == true;

        // Only a statically-known IsReadOnly can disable the inputs at render time; a bound one is applied by
        // the sync engine, for the same one-value-N-targets reason as Value.
        _ = RenderProperty<string?>(context, root, IInputComponent.FormIdProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("data-ui-form-id", value);
        }, [WebDomOperation.Attribute("data-ui-form-id", target: "root")]);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, "label", ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        if (HasRequiredValidation(context))
            _ = root.Attribute("aria-required", "true");

        // Derived from the component id so two radio groups on one page cannot share a native input name — and
        // so the client can stamp the same name onto options it clones for a bound collection.
        var groupName = "ui-radio-" + context.Node.ComponentId.Value.ToString(CultureInfo.InvariantCulture);

        _ = root.Attribute("data-ui-radio-group-name", groupName);

        if (valueBinding is not null)
            _ = root.Attribute("data-ui-radio-bind-value-id", valueBinding.Id.Value.ToString(CultureInfo.InvariantCulture));

        if (isReadOnlyStatic)
            _ = root.Attribute("data-ui-radio-disabled");

        RenderOptions(context, root, groupName, valueKind, currentValue, valueBinding, isReadOnlyStatic);

        RenderValidationMessage(root, "ui-radio-group__message");
    }

    private static void RenderOptions(WebRenderContext context, IHtmlElementBuilder root, string groupName, WebRenderValueKind valueKind, string? currentValue, CompiledUIBinding? valueBinding, bool isReadOnlyStatic)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        _ = root.Element("div", host =>
        {
            _ = host.Class("ui-radio-group__host");
            _ = host.Attribute("data-ui-items-host");

            // An inner host, not the root: the client resolves an items host with querySelector, which
            // searches descendants only, so a bound collection would never populate without one.
            if (isBound)
                return;

            if (items.Count == 0)
            {
                RenderEmptyPlaceholder(context, host);
                return;
            }

            RenderItemList(context, host, items, ItemClassName, "label", (itemRoot, item, index) =>
                RenderRadioInput(itemRoot, item, groupName, valueKind, currentValue, valueBinding, isReadOnlyStatic));
        });
    }

    private static void RenderRadioInput(IHtmlElementBuilder itemRoot, object? item, string groupName, WebRenderValueKind valueKind, string? currentValue, CompiledUIBinding? valueBinding, bool isReadOnlyStatic)
    {
        var optionId = item is IBindableItem bindableItem ? bindableItem.Id : null;

        _ = itemRoot.Element("input", input =>
        {
            _ = input.Class("ui-radio-group__input");
            _ = input.Attribute("type", "radio");
            _ = input.Attribute("name", groupName);

            if (!string.IsNullOrEmpty(optionId))
                _ = input.Attribute("value", optionId);

            if (valueKind == WebRenderValueKind.Static && optionId is not null && optionId == currentValue)
                _ = input.Attribute("checked");

            if (isReadOnlyStatic)
                _ = input.Attribute("disabled");

            // Each radio carries the group's single Value binding, so a click on any of them reports back
            // through the ordinary two-way channel instead of needing its own dispatch.
            if (valueBinding is not null)
                _ = input.Attribute("data-ui-bind-value", valueBinding.Id.Value.ToString(CultureInfo.InvariantCulture));
        });

        _ = itemRoot.Element("span", dot => dot.Class("ui-radio-group__dot"));
    }
}
