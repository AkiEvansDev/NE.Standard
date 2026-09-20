using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>Renders a read-only selection field with a pick button over a hidden native <c>&lt;input type="file"&gt;</c>.</summary>
public sealed class FileInputComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => FileInputComponent.ComponentTypeKey;

    protected override string ClassName => "ui-file-input";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root, titleCanGoInside: true);

        NativeInputRendererBase.RenderMaxFileSize(context, root, FileInputComponent.MaxFileSizeProperty);

        RenderRow(context, root);
        RenderValidationMessage(context, root);
    }

    /// <summary>Renders the hidden native picker, the read-only display field and the pick button as one control.</summary>
    private void RenderRow(WebRenderContext context, IHtmlElementBuilder root)
    {
        IHtmlElementBuilder? native = null;
        IHtmlElementBuilder? field = null;
        IHtmlElementBuilder? pick = null;

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{ClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            RenderInputHeaderInside(context, root, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            NativeInputRendererBase.RenderFilePicker(context, row, $"{ClassName}__native", FileInputComponent.AcceptProperty, input =>
            {
                native = input;

                _ = RenderProperty<bool?>(context, input, FileInputComponent.MultipleProperty, static (target, value) =>
                {
                    if (value == true)
                        _ = target.Attribute("multiple");
                }, [WebDomOperation.ToggleAttribute("multiple", condition: WebValueCondition.IsTrue)]);
            });

            _ = row.Element("input", input =>
            {
                field = input;

                _ = input.Class($"{ClassName}__field");
                _ = input.Class("ui-field");
                _ = input.Attribute("type", "text");

                // Display-only: what syncs back is SelectionId, on its own hidden input below.
                _ = input.Attribute("readonly");
                _ = input.Attribute("autocomplete", "off");

                NativeInputRendererBase.RenderPlaceholder(context, input);
                NativeInputRendererBase.RenderFormId(context, input);
                NativeInputRendererBase.RenderFieldName(context, input);

                _ = RenderProperty<string?>(context, input, IInputComponent.ValueProperty, static (target, value) =>
                {
                    if (!string.IsNullOrEmpty(value))
                        _ = target.Attribute("value", value);
                }, [WebDomOperation.Property("value")]);
            });

            // The selection id needs its own hidden element, since the field's own value is the file names; it's the component's
            // value for a reader, as other fields come first in the markup.
            NativeInputRendererBase.RenderSelectionInput(context, row, $"{ClassName}__selection", FileInputComponent.SelectionIdProperty, holdsValue: true);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            _ = row.Element("button", button =>
            {
                pick = button;

                _ = button.Class($"{ClassName}__pick");
                _ = button.Attribute("type", "button");
                _ = button.Attribute("aria-label", context.Translate(UIStrings.FileChoose));
                _ = button.Attribute(WebAttributes.FilePick);
            });
        });

        IHtmlElementBuilder nativeInput = native!;
        IHtmlElementBuilder pickButton = pick!;

        // IsReadOnly reaches all three elements, so it is applied after every one of them exists.
        _ = RenderProperty<bool?>(context, field!, IInputComponent.IsReadOnlyProperty, (target, value) =>
        {
            if (value != true)
                return;

            _ = pickButton.Attribute("disabled");
            _ = nativeInput.Attribute("disabled");
        }, [
            WebDomOperation.ToggleAttribute("disabled", target: $".{ClassName}__pick", condition: WebValueCondition.IsTrue),
            WebDomOperation.ToggleAttribute("disabled", target: $".{ClassName}__native", condition: WebValueCondition.IsTrue)
        ]);
    }
}
