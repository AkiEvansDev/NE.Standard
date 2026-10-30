using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

public sealed partial class MultiSelectComponentRenderer
{
    /// <summary>The root's mark beside <c>ui-multi-select</c> as <see cref="UIMultiSelectVariant.Checkboxes"/>, which the stylesheet and the checkbox engine read.</summary>
    public const string CheckboxesClassName = WebClassNames.MultiSelectCheckboxes;

    private const string ChecksHostClassName = "ui-multi-select__checks";
    private const string CheckClassName = WebClassNames.MultiSelectCheck;
    // The client's CheckboxRowDecorator, which draws the box on a row the client builds.
    private const string CheckRowDecoratorKind = "checkbox";

    // IsReadOnly under a key of its own: the chips' registration writes aria-readonly on their one control, and a patch lands on one
    // element, where here every box carries it — the checkbox engine writes theirs as the root's mark moves.
    private static readonly string CheckboxesPropertyOwnerTypeKey = $"{MultiSelectComponent.ComponentTypeKey}.checkboxes";
    private static readonly WebDomOperation[] CheckboxesReadOnlyOperations = [NativeInputRendererBase.ReadOnlyMarkOperation];

    /// <summary>
    /// The checkboxes: no field and no list, a checkbox per option in an items host, laid out as a radio group's radios are, the box
    /// a checkbox's own (<c>ui-checkbox__input</c>, <c>ui-checkbox__box</c>). The value is the same JSON list of keys on the root and
    /// on the value input; the client's checkbox engine keeps the boxes in step with it and writes it as they are toggled.
    /// </summary>
    private static void RenderCheckboxes(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = root.Class(CheckboxesClassName);

        RenderTooltip(context, root);
        TextContentRendererBase.RenderInputSize(context, root);
        TextContentRendererBase.RenderInputHeader(context, root);

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, ISpacingComponent.SpacingProperty, "--ui-multi-select-spacing");
        EvenColumnsRenderer.Render(context, root);
        OrientationStyleRenderer.RenderOrientation(context, root, IOrientationComponent.OrientationProperty);
        RenderMaxSelected(context, root);

        WebRenderValueKind valueKind = RenderChosenKeys(context, root, out IReadOnlyList<string> chosenKeys, out CompiledUIBinding? valueBinding);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, "label", CheckClassName, rowDecorator: CheckRowDecoratorKind);
        RegisterItemsFilterSortMetadata(context);

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);
        HashSet<string> chosen = new(chosenKeys, StringComparer.Ordinal);
        var full = ReadRenderValue<int?>(context, MultiSelectComponent.MaxSelectedProperty, null) is int max && max > 0 && chosen.Count >= max;
        var readOnly = RenderReadOnly(context, root);
        var disabled = ReadRenderValue<bool?>(context, IVisualComponent.EnabledProperty, null) == false || ReadRenderValue<bool?>(context, IVisualComponent.LoadingProperty, null) == true;

        // Before the option's text, as a checkbox's box is and as the client's CheckboxRowDecorator prepends it on a row it builds.
        // The host is the group, not the root: the caption and the validation line stand outside the choice itself.
        RenderItemsHost(context, root, ChecksHostClassName, items, isBound, CheckClassName, itemElementName: "label",
            configureHost: host =>
            {
                _ = host.Attribute("role", "group");
                TextContentRendererBase.RenderGroupLabel(context, host);
            },
            decorateItem: (row, item, _) => RenderCheck(row, item, chosen, full, readOnly, disabled)
        );

        RenderValueInput(context, root, valueKind, chosenKeys, valueBinding);
        RenderValidationMessage(context, root);
    }

    /// <summary>
    /// <c>IsReadOnly</c> as the root's mark, which the checkbox engine refuses a box's change by; whether the first paint is read-only,
    /// for the boxes' own <c>aria-readonly</c> (a group takes none). The boxes stay focusable and readable.
    /// </summary>
    private static bool RenderReadOnly(WebRenderContext context, IHtmlElementBuilder root)
    {
        var readOnly = false;

        _ = RenderProperty<bool?>(context, root, CheckboxesPropertyOwnerTypeKey, IInputComponent.IsReadOnlyProperty, (target, value) =>
        {
            readOnly = value == true;

            if (readOnly)
                _ = target.Class(WebClassNames.ReadOnly);
        }, CheckboxesReadOnlyOperations);

        return readOnly;
    }

    /// <summary>
    /// One option's box, checked where its key is chosen; a full field turns off the boxes it does not hold, as its list refuses their
    /// options, so the first paint already says so. Out of a form's fields: the value travels on the value input alone.
    /// </summary>
    private static void RenderCheck(IHtmlElementBuilder row, object? item, HashSet<string> chosen, bool full, bool readOnly, bool disabled)
    {
        var key = item is IBindableItem bindable ? bindable.Id : null;
        var isChecked = key is not null && chosen.Contains(key);
        var refused = full && !isChecked;

        if (refused)
            _ = row.Attribute("aria-disabled", "true");

        _ = row.Element("input", input =>
        {
            _ = input.Class(WebClassNames.CheckboxInput);
            _ = input.Attribute("type", "checkbox");

            if (!string.IsNullOrEmpty(key))
                _ = input.Attribute("value", key);

            if (isChecked)
                _ = input.Attribute("checked");

            if (disabled || refused)
                _ = input.Attribute("disabled");

            if (readOnly)
                _ = input.Attribute("aria-readonly", "true");
        });

        _ = row.Element("span", box => box.Class(WebClassNames.CheckboxBox));
    }
}
