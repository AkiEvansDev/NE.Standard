using System;
using System.Globalization;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>A native <c>&lt;textarea&gt;</c> under the same header/field/message shell as the text input.</summary>
public sealed class TextAreaComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => TextAreaComponent.ComponentTypeKey;

    protected override string ClassName => "ui-text-area";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root);
        RenderField(context, root);
        RenderValidationMessage(context, root);
    }

    private void RenderField(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = root.Element("textarea", textarea =>
        {
            _ = textarea.Class($"{ClassName}__field");
            _ = textarea.Class(FieldBoxClassName);

            BorderStyleRenderer.RenderBorderStyle(context, textarea);

            _ = RenderProperty<int?>(context, textarea, TextAreaComponent.RowsProperty, static (target, value) =>
            {
                if (value is int rows and > 0)
                    _ = target.Attribute("rows", rows.ToString(CultureInfo.InvariantCulture));
            }, [WebDomOperation.Attribute("rows")]);

            _ = RenderProperty<UITextAreaResizeMode?>(context, textarea, TextAreaComponent.ResizeProperty, static (target, value) =>
            {
                if (value is UITextAreaResizeMode resize)
                    _ = target.Style("resize", resize.ToString().ToLowerInvariant());
            }, [WebDomOperation.Style("resize", converter: WebDomConverters.TextAreaResizeCss)]);

            _ = RenderProperty<int?>(context, textarea, TextAreaComponent.MaxLengthProperty, static (target, value) =>
            {
                if (value is int maxLength)
                    _ = target.Attribute("maxlength", maxLength.ToString(CultureInfo.InvariantCulture));
            }, [WebDomOperation.Attribute("maxlength")]);

            // Read by DebouncedCommitEngine on every keystroke, so a bound value is in force at once.
            _ = RenderProperty<int?>(context, textarea, TextAreaComponent.DebounceMillisecondsProperty, static (target, value) =>
            {
                if (value is int milliseconds and >= 0)
                    _ = target.Attribute(WebAttributes.InputDebounce, milliseconds.ToString(CultureInfo.InvariantCulture));
            }, [WebDomOperation.Attribute(WebAttributes.InputDebounce)]);

            // Read by `readBoundElementValue` off whichever element carries it, textarea or input alike.
            RenderFlagAttribute(context, textarea, TextAreaComponent.TrimInputProperty, WebAttributes.TrimInput);

            NativeInputRendererBase.RenderPlaceholder(context, textarea);
            NativeInputRendererBase.RenderFormId(context, textarea);
            NativeInputRendererBase.RenderFieldName(context, textarea);
            NativeInputRendererBase.RenderIsReadOnly(context, root, textarea);
            RenderFieldLabel(context, textarea);

            _ = RenderProperty<string?>(context, textarea, IInputComponent.ValueProperty, static (target, value) =>
            {
                if (string.IsNullOrEmpty(value))
                    return;

                // The parser drops one line break right after <textarea>: a value that starts with one keeps it only if a second precedes it.
                _ = target.Text(value[0] is '\n' or '\r' ? "\n" + value : value);
            }, [WebDomOperation.Property("value")]);
        });
    }
}
