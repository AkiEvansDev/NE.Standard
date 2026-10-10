using System;
using System.Globalization;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Constants;
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
    private static readonly WebDomOperation[] MaxRowsOperations = [WebDomOperation.Attribute(WebAttributes.TextAreaGrow, converter: WebDomConverters.PositiveFlagAttribute), WebDomOperation.Style(MaxRowsVariable, converter: WebDomConverters.PositiveCount)];

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
        if (FieldActionsRenderer.Has(context, RegionNames.LeadingAction) || FieldActionsRenderer.Has(context, RegionNames.TrailingAction))
        {
            _ = root.Element("div", box =>
            {
                _ = box.Class($"{ClassName}__box");
                _ = box.Class(FieldBoxClassName);

                BorderStyleRenderer.RenderBorderStyle(context, box);

                RenderField(context, root, box, boxed: true);

                // After the text in the tab order, whichever end they stand at; the stylesheet puts the leading group first.
                FieldActionsRenderer.Render(context, box, RegionNames.LeadingAction, $"{ClassName}__action {ClassName}__action--leading");
                FieldActionsRenderer.Render(context, box, RegionNames.TrailingAction, $"{ClassName}__action");
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

            _ = RenderProperty<int?>(context, textarea, TextAreaComponent.MaxRowsProperty, static (target, value) =>
            {
                if (value is int maxRows and > 0)
                    _ = target.Attribute(WebAttributes.TextAreaGrow).Style(MaxRowsVariable, maxRows.ToString(CultureInfo.InvariantCulture));
            }, MaxRowsOperations);

            RenderFlagAttribute(context, textarea, TextAreaComponent.SubmitOnEnterProperty, WebAttributes.SubmitOnEnter);

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
            }, [WebDomOperation.Attribute(WebAttributes.InputDebounce, converter: WebDomConverters.NonNegativeCount)]);

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
            }, [WebDomOperation.Property("value")]);
        });
    }
}
