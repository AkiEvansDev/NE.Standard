using System;
using System.Globalization;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A read-only field showing the current selection with the pick button flush against it, under the same
/// header/row/message shell as <c>TextInputComponentRenderer</c>. The native
/// <c>&lt;input type="file"&gt;</c> is present but hidden, and is triggered by that button — the same
/// "hidden native input, styled shell" split <c>CheckboxComponentRenderer</c> uses.
/// <para>
/// This replaces a bare native file input styled through <c>::file-selector-button</c>. That version could
/// not carry any of the inherited label surface (icon, title, badge, required marker) and looked like
/// nothing else in the library, because the browser's own button is the only part of a file input that is
/// reachable from CSS. Owning the surface is what makes those properties meaningful here at all — the same
/// argument that replaced the native temporal inputs.
/// </para>
/// <para>
/// <c>Value</c> is the field's text and stays display-only. What the client writes back is
/// <c>SelectionId</c>, on its own hidden input — the same split <c>SearchComponentRenderer</c> makes between
/// what the field holds and what the component resolved to. <c>MaxFileSize</c> stays unrendered on purpose:
/// the limit that holds is <c>UIFileOptions.MaxFileSize</c> at the endpoint, because a client can simply not
/// honour the component's. See <c>docs/FILES.md</c>.
/// </para>
/// </summary>
public sealed class FileInputComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => FileInputComponent.ComponentTypeKey;

    protected override string ClassName => "ui-file-input";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<string?>(context, root, ITextBaseComponent.TooltipProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("title", value);
        }, [WebDomOperation.Attribute("title")]);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root);
        RenderRow(context, root);
        RenderValidationMessage(root, $"{ClassName}__message");
    }


    /// <summary>
    /// Three elements, one control: the hidden native input that owns the OS picker, the read-only field
    /// the selection is displayed in, and the button that opens the picker.
    /// </summary>
    private void RenderRow(WebRenderContext context, IHtmlElementBuilder root)
    {
        IHtmlElementBuilder? native = null;
        IHtmlElementBuilder? field = null;
        IHtmlElementBuilder? pick = null;

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{ClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = row.Element("input", input =>
            {
                native = input;

                _ = input.Class($"{ClassName}__native");
                _ = input.Attribute("type", "file");

                // Hidden but still in the DOM — only a real file input can open the OS dialog. Kept out of the
                // tab order and the accessibility tree, since the pick button is what the user interacts with.
                _ = input.Attribute("tabindex", "-1");
                _ = input.Attribute("aria-hidden", "true");

                _ = RenderProperty<string?>(context, input, FileInputComponent.AcceptProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Attribute("accept", value);
                }, [WebDomOperation.Attribute("accept")]);

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
                _ = input.Attribute("type", "text");

                // The field displays the selection and is never typed into: a file path cannot be authored by
                // hand. It stays display-only — what syncs back is SelectionId, on its own hidden input below.
                _ = input.Attribute("readonly");
                _ = input.Attribute("autocomplete", "off");

                NativeInputRendererBase.RenderFormId(context, input);

                _ = RenderProperty<string?>(context, input, IInputComponent.ValueProperty, static (target, value) =>
                {
                    if (!string.IsNullOrEmpty(value))
                        _ = target.Attribute("value", value);
                }, [WebDomOperation.Property("value")]);
            });

            // The selection id gets its own element rather than sharing the field's, because the field's value
            // is the file names. Hidden: nothing about an id is worth showing, and the client writes it.
            _ = ResolveRenderValue(context, FileInputComponent.SelectionIdProperty, out string? _, out CompiledUIBinding? selectionBinding);

            _ = row.Element("input", input =>
            {
                _ = input.Class($"{ClassName}__selection");
                _ = input.Attribute("type", "hidden");

                // RenderProperty as well as the attribute: resolving the value alone does not register the
                // binding in the render metadata, and the client refuses a binding id it cannot look up.
                _ = RenderProperty<string?>(context, input, FileInputComponent.SelectionIdProperty, static (target, value) =>
                {
                    if (!string.IsNullOrEmpty(value))
                        _ = target.Attribute("value", value);
                }, [WebDomOperation.Property("value")]);

                if (selectionBinding is not null)
                    _ = input.Attribute("data-ui-bind-value", selectionBinding.Id.Value.ToString(CultureInfo.InvariantCulture));
            });

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            _ = row.Element("button", button =>
            {
                pick = button;

                _ = button.Class($"{ClassName}__pick");
                _ = button.Attribute("type", "button");
                _ = button.Attribute("data-ui-file-pick");
            });
        });

        IHtmlElementBuilder nativeInput = native!;
        IHtmlElementBuilder pickButton = pick!;

        // IsReadOnly has to reach three elements — the display field, the hidden native input and the pick
        // button — so it is applied after all three exist rather than inside any one of their builders.
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
