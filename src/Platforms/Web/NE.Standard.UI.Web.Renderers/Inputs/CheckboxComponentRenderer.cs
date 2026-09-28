using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

public sealed class CheckboxComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => CheckboxComponent.ComponentTypeKey;

    protected override string ElementName => "label";

    protected override string ClassName => "ui-checkbox";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
        => RenderCheckable(context, root, ClassName);

    /// <summary>
    /// Renders the label/hidden-input/box/text-body shell shared by a checkbox and a switch; <c>BadgePlacement</c> is not honoured,
    /// since an inline-flex toggle has no free space in its row. <paramref name="role"/> is what the native box is to a screen reader
    /// when it is not a checkbox — a switch.
    /// </summary>
    public static void RenderCheckable(WebRenderContext context, IHtmlElementBuilder root, string classPrefix, string? role = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentException.ThrowIfNullOrWhiteSpace(classPrefix);

        RenderTooltip(context, root);
        RenderInputSize(context, root);

        _ = root.Element("input", input =>
        {
            _ = input.Class($"{classPrefix}__input");
            _ = input.Attribute("type", "checkbox");

            if (role is not null)
                _ = input.Attribute("role", role);

            NativeInputRendererBase.RenderIsReadOnlyAsDisabled(context, input);

            NativeInputRendererBase.RenderFormId(context, input);
            NativeInputRendererBase.RenderFieldName(context, input);

            // Its own name rather than the wrapping label's text, which also holds the required mark and the validation line.
            RenderFieldLabel(context, input);

            _ = RenderProperty<bool?>(context, input, IInputComponent.ValueProperty, static (target, value) =>
            {
                if (value == true)
                    _ = target.Attribute("checked");
            }, [WebDomOperation.Property("checked")]);
        });

        _ = root.Element("span", box =>
        {
            _ = box.Class($"{classPrefix}__box");

            BorderStyleRenderer.RenderBorderStyle(context, box);
        });

        // No row element between root and body: the `ui-text` gates only match the root or a direct child of it.
        _ = root.Element("span", label => RenderTextBody(context, root, label, new WebTextBodyOptions
        {
            IncludeTextLayout = true,
            Trailing = header => RenderRequiredMarker(context, header, $"{classPrefix}__required"),
            NamesField = true
        }));

        RenderValidationMessage(context, root);
    }
}
