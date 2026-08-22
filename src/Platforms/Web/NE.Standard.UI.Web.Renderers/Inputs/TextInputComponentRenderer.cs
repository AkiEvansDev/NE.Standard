using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

public sealed class TextInputComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => TextInputComponent.ComponentTypeKey;

    protected override string ElementName => "label";
    protected override string ClassName => "ui-text-input";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderInputTooltip(context, root);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root);

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{ClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = row.Element("span", prefix => RenderAffix(context, prefix, TextInputComponent.PrefixTextProperty, "prefix"));

            _ = row.Element("input", input =>
            {
                _ = input.Class($"{ClassName}__field");

                _ = RenderProperty<UITextInputType?>(context, input, TextInputComponent.TypeProperty, static (target, value)
                    => _ = target.Attribute("type", WebClassNames.TextInputType(value ?? UITextInputType.Text))
                , [WebDomOperation.Attribute("type", converter: WebDomConverters.TextInputTypeAttribute)]);

                _ = RenderProperty<int?>(context, input, TextInputComponent.MaxLengthProperty, static (target, value) =>
                {
                    if (value is int maxLength)
                        _ = target.Attribute("maxlength", maxLength.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Attribute("maxlength")]);

                _ = RenderProperty<bool?>(context, input, IInputComponent.IsReadOnlyProperty, static (target, value) =>
                {
                    if (value == true)
                        _ = target.Attribute("readonly");
                }, [WebDomOperation.ToggleAttribute("readonly", condition: WebValueCondition.IsTrue)]);

                _ = RenderProperty<bool?>(context, input, TextInputComponent.TrimInputProperty, static (target, value) =>
                {
                    if (value == true)
                        _ = target.Attribute("data-ui-trim-input");
                }, [WebDomOperation.ToggleAttribute("data-ui-trim-input", condition: WebValueCondition.IsTrue)]);

                _ = RenderProperty<string?>(context, input, IInputComponent.FormIdProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Attribute("data-ui-form-id", value);
                }, [WebDomOperation.Attribute("data-ui-form-id")]);

                _ = RenderProperty<string?>(context, input, IInputComponent.ValueProperty, static (target, value) =>
                {
                    if (!string.IsNullOrEmpty(value))
                        _ = target.Attribute("value", value);
                }, [WebDomOperation.Property("value")]);
            });

            _ = row.Element("span", suffix => RenderAffix(context, suffix, TextInputComponent.SuffixTextProperty, "suffix"));

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            if (ShouldRenderClearButton(context))
            {
                _ = row.Element("button", clear =>
                {
                    _ = clear.Class($"{ClassName}__clear");
                    _ = clear.Attribute("type", "button");
                    _ = clear.Attribute("data-ui-clear");
                });
            }
        });

        _ = root.Element("span", message =>
        {
            _ = message.Class($"{ClassName}__message");
            _ = message.Attribute("data-ui-validation-message");
        });
    }

    /// <summary>
    /// Renders a static prefix/suffix text span. Not a live-bindable DOM target beyond its own text —
    /// mirrors <c>RenderIcon</c>/<c>RenderTitle</c>'s "one text-bearing element, one
    /// <c>RenderProperty</c> call" shape.
    /// </summary>
    private static void RenderAffix(WebRenderContext context, IHtmlElementBuilder affix, UIProperty property, string modifier)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(affix);
        ArgumentException.ThrowIfNullOrWhiteSpace(modifier);

        _ = affix.Class("ui-text-input__affix");
        _ = affix.Class($"ui-text-input__affix--{modifier}");

        _ = RenderProperty<string?>(context, affix, property, (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Text(value);
        }, [WebDomOperation.Text()]);
    }

    /// <summary>
    /// <c>TextInputComponent.ShowClearButton</c> decides whether the clear button element exists
    /// at all — it isn't a live DOM-patchable toggle (no <c>WebDomOperationKind</c> adds/removes whole
    /// elements), so it's resolved statically at render time.
    /// </summary>
    private static bool ShouldRenderClearButton(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        WebRenderValueKind kind = ResolveRenderValue(context, TextInputComponent.ShowClearButtonProperty, out bool? value, out _);
        return kind == WebRenderValueKind.Static && value == true;
    }
}
