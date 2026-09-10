using System;
using System.Globalization;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

public sealed class TextInputComponentRenderer : TextContentRendererBase
{
    // Read by the stylesheet alone, so it is this renderer's own rather than a WebAttributes constant.
    private const string ClearShownAttribute = "data-ui-clear-shown";

    public override string ComponentTypeKey => TextInputComponent.ComponentTypeKey;

    protected override string ElementName => "label";
    protected override string ClassName => "ui-text-input";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root);

        // Whether the clear button shows, on the root: the button itself is always rendered.
        _ = RenderProperty<bool?>(context, root, TextInputComponent.ShowClearButtonProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute(ClearShownAttribute);
        }, [WebDomOperation.ToggleAttribute(ClearShownAttribute, condition: WebValueCondition.IsTrue)]);

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{ClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = row.Element("span", prefix => RenderInputAffixText(context, prefix, suffix: false));

            _ = row.Element("input", input =>
            {
                _ = input.Class($"{ClassName}__field");
                _ = input.Class("ui-field");

                _ = RenderProperty<UITextInputType?>(context, input, TextInputComponent.TypeProperty, static (target, value)
                    => _ = target.Attribute("type", WebClassNames.TextInputType(value ?? UITextInputType.Text))
                , [WebDomOperation.Attribute("type", converter: WebDomConverters.TextInputTypeAttribute)]);

                _ = RenderProperty<int?>(context, input, TextInputComponent.MaxLengthProperty, static (target, value) =>
                {
                    if (value is int maxLength)
                        _ = target.Attribute("maxlength", maxLength.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Attribute("maxlength")]);

                // What the browser may fill in. A password manager reads the sign-in pair from these words and from nothing else:
                // wrapping the password in a form of its own, which is what silenced Chrome's console warning, gave it a form with a
                // password and no name in it, and it remembered the password without the login (the owner, 2026-09-10).
                _ = RenderProperty<string?>(context, input, TextInputComponent.AutocompleteProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Attribute("autocomplete", value);
                }, [WebDomOperation.Attribute("autocomplete")]);

                NativeInputRendererBase.RenderPlaceholder(context, input);
                NativeInputRendererBase.RenderIsReadOnly(context, input);

                _ = RenderProperty<bool?>(context, input, TextInputComponent.TrimInputProperty, static (target, value) =>
                {
                    if (value == true)
                        _ = target.Attribute(WebAttributes.TrimInput);
                }, [WebDomOperation.ToggleAttribute(WebAttributes.TrimInput, condition: WebValueCondition.IsTrue)]);

                // Read by DebouncedCommitEngine on every keystroke, so a bound value is in force at once.
                _ = RenderProperty<int?>(context, input, TextInputComponent.DebounceMillisecondsProperty, static (target, value) =>
                {
                    if (value is int milliseconds)
                        _ = target.Attribute(WebAttributes.InputDebounce, milliseconds.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Attribute(WebAttributes.InputDebounce)]);

                NativeInputRendererBase.RenderFormId(context, input);
                NativeInputRendererBase.RenderFieldName(context, input);

                _ = RenderProperty<string?>(context, input, IInputComponent.ValueProperty, static (target, value) =>
                {
                    if (!string.IsNullOrEmpty(value))
                        _ = target.Attribute("value", value);
                }, [WebDomOperation.Property("value")]);
            });

            _ = row.Element("span", suffix => RenderInputAffixText(context, suffix, suffix: true));

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            // Always rendered, shown by the root's own attribute.
            _ = row.Element("button", clear =>
            {
                _ = clear.Class($"{ClassName}__clear");
                _ = clear.Attribute("type", "button");
                _ = clear.Attribute("aria-label", context.Translate(UIStrings.InputClear));
                _ = clear.Attribute(WebAttributes.Clear);
            });

            // After the clear: what the field can do with its value stands past what takes the value away.
            if (HasRegion(context, RegionNames.TrailingAction))
            {
                _ = row.Element("span", action =>
                {
                    _ = action.Class($"{ClassName}__action");

                    RenderRegion(context, action, RegionNames.TrailingAction);
                });
            }
        });

        RenderValidationMessage(context, root);
    }
}
