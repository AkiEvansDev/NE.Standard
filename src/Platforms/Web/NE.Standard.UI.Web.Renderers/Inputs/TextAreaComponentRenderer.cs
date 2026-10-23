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
    // Read by the stylesheet alone, which bounds a growing area by them.
    private const string RowsVariable = "--ui-text-area-rows";
    private const string MaxRowsVariable = "--ui-text-area-max-rows";

    // Through converters, so a pushed count of zero or less writes nothing, as the first paint does.
    private static readonly WebDomOperation[] RowsOperations = [WebDomOperation.Attribute("rows", converter: WebDomConverters.PositiveCount), WebDomOperation.Style(RowsVariable, converter: WebDomConverters.PositiveCount)];
    // A growing area's root is marked too: its text sizes its height alone, so the root fills its room rather than shrinking to it.
    private const string GrowClassName = "ui-text-area--grow";

    private static readonly WebDomOperation[] MaxRowsOperations =
    [
        WebDomOperation.Attribute(WebAttributes.TextAreaGrow, converter: WebDomConverters.PositiveFlagAttribute),
        WebDomOperation.Style(MaxRowsVariable, converter: WebDomConverters.PositiveCount),
        WebDomOperation.Class(target: "root", converter: WebDomConverters.TextAreaGrowClass)
    ];

    private static readonly WebDomOperation[] ResizeOperations = [WebDomOperation.Style("resize", converter: WebDomConverters.TextAreaResizeCss)];
    private static readonly WebDomOperation[] ValueOperations = [WebDomOperation.Property("value")];

    public override string ComponentTypeKey => TextAreaComponent.ComponentTypeKey;

    protected override string ClassName => "ui-text-area";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root);

        // The author's buttons stand beside the text in one box, outside the text's own scroll; a bare area stays the box itself.
        if (FieldActionsRenderer.HasAny(context))
        {
            FieldActionsRenderer.RenderActionsBelow(context, root, TextAreaComponent.ActionsBelowProperty);

            _ = root.Element("div", box =>
            {
                _ = box.Class($"{ClassName}__box");
                _ = box.Class(FieldBoxClassName);

                BorderStyleRenderer.RenderBorderStyle(context, box);

                FieldActionsRenderer.RenderLeadingGroups(context, box, $"{ClassName}__action", $"{ClassName}__below");

                RenderField(context, root, box, boxed: true);

                FieldActionsRenderer.RenderTrailingGroups(context, box, $"{ClassName}__action", $"{ClassName}__below");
            });
        }
        else
        {
            RenderField(context, root, root, boxed: false);
        }

        RenderValidationMessage(context, root);
    }

    private void RenderField(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder parent, bool boxed)
    {
        _ = parent.Element("textarea", textarea =>
        {
            _ = textarea.Class($"{ClassName}__field");

            if (boxed)
            {
                _ = textarea.Class("ui-field");
            }
            else
            {
                _ = textarea.Class(FieldBoxClassName);

                BorderStyleRenderer.RenderBorderStyle(context, textarea);
            }

            // The rows as a variable too: a growing area is sized to its text, which the attribute no longer bounds from below.
            _ = RenderProperty<int?>(context, textarea, TextAreaComponent.RowsProperty, static (target, value) =>
            {
                if (value is int rows and > 0)
                    _ = target.Attribute("rows", rows.ToString(CultureInfo.InvariantCulture)).Style(RowsVariable, rows.ToString(CultureInfo.InvariantCulture));
            }, RowsOperations);

            _ = RenderProperty<int?>(context, textarea, TextAreaComponent.MaxRowsProperty, (target, value) =>
            {
                if (value is not (int maxRows and > 0))
                    return;

                _ = target.Attribute(WebAttributes.TextAreaGrow).Style(MaxRowsVariable, maxRows.ToString(CultureInfo.InvariantCulture));
                _ = root.Class(GrowClassName);
            }, MaxRowsOperations);

            RenderFlagAttribute(context, textarea, TextAreaComponent.SubmitOnEnterProperty, WebAttributes.SubmitOnEnter);

            _ = RenderProperty<UITextAreaResizeMode?>(context, textarea, TextAreaComponent.ResizeProperty, static (target, value) =>
            {
                if (value is UITextAreaResizeMode resize)
                    _ = target.Style("resize", resize.ToString().ToLowerInvariant());
            }, ResizeOperations);

            NativeInputRendererBase.RenderMaxLength(context, textarea);

            NativeInputRendererBase.RenderDebounce(context, textarea);

            // Read by `readBoundElementValue` off whichever element carries it, textarea or input alike.
            RenderFlagAttribute(context, textarea, TextAreaComponent.TrimInputProperty, WebAttributes.TrimInput);

            NativeInputRendererBase.RenderPlaceholder(context, textarea);
            NativeInputRendererBase.RenderRunsOnEnter(context, textarea);
            NativeInputRendererBase.RenderRunsOnEscape(context, textarea, TextAreaComponent.CancelOnEscapeProperty);
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
            }, ValueOperations);
        });
    }
}
