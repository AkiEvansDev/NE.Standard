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
/// Renders each option through the templated-item machinery, with a hidden native radio input ahead of the
/// template content so selection keeps real keyboard and click semantics.
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

        RenderTooltip(context, root);
        TextContentRendererBase.RenderInputSize(context, root);
        TextContentRendererBase.RenderInputHeader(context, root);

        _ = root.Attribute("role", "radiogroup");

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, RadioGroupComponent.SpacingProperty, "--ui-radio-group-spacing");

        _ = RenderProperty<UIOrientation?>(context, root, RadioGroupComponent.OrientationProperty, static (target, value) =>
        {
            if (value is UIOrientation orientation)
                _ = target.Class(WebClassNames.Orientation(orientation));
        }, [WebDomOperation.Class(converter: WebDomConverters.OrientationClass)]);

        // One RenderProperty drives one element, but this value has to reach N radios: the initial `checked` is
        // decided here, and live changes fan out from a root attribute RadioGroupSyncEngine watches.
        WebRenderValueKind valueKind = ResolveRenderValue(context, IInputComponent.ValueProperty, out string? currentValue, out CompiledUIBinding? valueBinding);

        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.CheckedRadio);
        _ = RenderProperty<string?>(context, root, IInputComponent.ValueProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute(WebAttributes.RadioValue, value);
        }, [WebDomOperation.Attribute(WebAttributes.RadioValue, target: "root")]);

        // The mark reaches every radio through RadioGroupSyncEngine, on a bound change and at first render; written here too, so a
        // page read before the engine runs is already read-only.
        _ = ResolveRenderValue(context, IInputComponent.IsReadOnlyProperty, out bool? isReadOnly, out _);
        var readOnly = isReadOnly == true;

        _ = RenderProperty<bool?>(context, root, IInputComponent.IsReadOnlyProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute(WebAttributes.RadioDisabled);
        }, [WebDomOperation.ToggleAttribute(WebAttributes.RadioDisabled, target: "root", condition: WebValueCondition.IsTrue)]);

        NativeInputRendererBase.RenderFormId(context, root);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, "label", ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        // The one name every radio here shares, so the browser treats them as one choice; derived from the
        // component id so two groups on a page cannot collide.
        var groupName = NativeInputRendererBase.FieldName(context);

        _ = root.Attribute(WebAttributes.RadioGroupName, groupName);

        if (valueBinding is not null)
            _ = root.Attribute(WebAttributes.RadioBindValueId, valueBinding.Id.Value.ToString(CultureInfo.InvariantCulture));

        RenderOptions(context, root, groupName, valueKind, currentValue, valueBinding, readOnly);

        RenderValidationMessage(context, root);
    }

    private static void RenderOptions(WebRenderContext context, IHtmlElementBuilder root, string groupName, WebRenderValueKind valueKind, string? currentValue, CompiledUIBinding? valueBinding, bool readOnly)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        // Before the option's text, as a checkbox's box is and as RadioGroupSyncEngine prepends it on a row the client builds.
        RenderItemsHost(context, root, "ui-radio-group__host", items, isBound, ItemClassName, itemElementName: "label",
            decorateItem: (itemRoot, item, _) => RenderRadioInput(itemRoot, item, groupName, valueKind, currentValue, valueBinding, readOnly)
        );
    }

    private static void RenderRadioInput(IHtmlElementBuilder itemRoot, object? item, string groupName, WebRenderValueKind valueKind, string? currentValue, CompiledUIBinding? valueBinding, bool readOnly)
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

            if (readOnly)
                _ = input.Attribute("disabled");

            // Each radio carries the group's single Value binding, so a click reports back through the ordinary two-way channel.
            if (valueBinding is not null)
                _ = input.Attribute(WebAttributes.BindValue, valueBinding.Id.Value.ToString(CultureInfo.InvariantCulture));
        });

        _ = itemRoot.Element("span", dot => dot.Class("ui-radio-group__dot"));
    }
}
