using System;
using System.Globalization;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// A native <c>&lt;textarea&gt;</c> under the same header/field/message shell as
/// <c>TextInputComponentRenderer</c>, so both controls read as one family: icon, title and badge in the
/// header, the field itself carrying the border and the native attributes.
/// <para>
/// Derives from <see cref="TextContentRendererBase"/> for that header and calls
/// <see cref="NativeInputRendererBase"/>'s two field helpers as public statics, since only one base can be
/// inherited. Every declared property renders.
/// </para>
/// </summary>
public sealed class TextAreaComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => TextAreaComponent.ComponentTypeKey;

    protected override string ClassName => "ui-text-area";

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
        RenderField(context, root);
        RenderValidationMessage(root, $"{ClassName}__message");
    }


    private void RenderField(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = root.Element("textarea", textarea =>
        {
            _ = textarea.Class($"{ClassName}__field");

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

            // Read by `readBoundElementValue` off whichever element carries it, so the same attribute
            // gives a textarea the trimming a text input already had.
            _ = RenderProperty<bool?>(context, textarea, TextAreaComponent.TrimInputProperty, static (target, value) =>
            {
                if (value == true)
                    _ = target.Attribute("data-ui-trim-input");
            }, [WebDomOperation.ToggleAttribute("data-ui-trim-input", condition: WebValueCondition.IsTrue)]);

            NativeInputRendererBase.RenderFormId(context, textarea);
            NativeInputRendererBase.RenderIsReadOnly(context, textarea);

            _ = RenderProperty<string?>(context, textarea, IInputComponent.ValueProperty, static (target, value) =>
            {
                if (!string.IsNullOrEmpty(value))
                    _ = target.Text(value);
            }, [WebDomOperation.Property("value")]);
        });
    }
}
