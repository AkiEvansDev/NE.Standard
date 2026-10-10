using System;
using System.Globalization;
using NE.Standard.UI.Authoring.BuiltIns;
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

    // On a field with no caption: its root is a <label>, whose words would name it, the names of the buttons standing in it among
    // them ("Attach Emoji Send"); its placeholder names it instead, as the page translates or patches it.
    private const string PlaceholderNamesAttribute = "data-ui-placeholder-names";

    private static readonly WebDomOperation[] PlaceholderOperations =
    [
        WebDomOperation.Attribute("placeholder", converter: WebDomConverters.PlaceholderText, convertsNull: true),
        WebDomOperation.Attribute("aria-label", $"[{PlaceholderNamesAttribute}]", optional: true)
    ];

    public override string ComponentTypeKey => TextInputComponent.ComponentTypeKey;

    protected override string ElementName => "label";
    protected override string ClassName => WebClassNames.TextInput;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);

        RenderInputAppearance(context, root);
        RenderInputHeader(context, root, titleCanGoInside: true);

        // Whether the clear button shows, on the root: the button itself is always rendered.
        RenderFlagAttribute(context, root, TextInputComponent.ShowClearButtonProperty, ClearShownAttribute);

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{ClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            RenderInputHeaderInside(context, root, row);

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

                // What the browser may fill in. A password manager reads the sign-in pair from these words and the form the
                // field stands in: the page's, or its FormId's, so a sign-in pair shares one.
                _ = RenderProperty<string?>(context, input, TextInputComponent.AutocompleteProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Attribute("autocomplete", value);
                }, [WebDomOperation.Attribute("autocomplete")]);

                // The keyboard a phone raises, apart from the type: a one-time code stays text and asks for digits.
                _ = RenderProperty<UIInputMode?>(context, input, TextInputComponent.InputModeProperty, static (target, value) =>
                {
                    if (value is UIInputMode mode)
                        _ = target.Attribute("inputmode", WebClassNames.InputMode(mode));
                }, [WebDomOperation.Attribute("inputmode", converter: WebDomConverters.InputModeAttribute)]);

                var namedByPlaceholder = !IsNamed(context);

                if (namedByPlaceholder)
                    _ = input.Attribute(PlaceholderNamesAttribute);

                _ = RenderProperty<string?>(context, input, IPlaceholderInputComponent.PlaceholderProperty, (target, value) =>
                {
                    if (string.IsNullOrEmpty(value))
                        return;

                    _ = target.Attribute("placeholder", value);

                    if (namedByPlaceholder)
                        _ = target.Attribute("aria-label", value);
                }, PlaceholderOperations);

                // A blank one where the author gave none, so :placeholder-shown says the field is empty and the clear goes.
                if (string.IsNullOrEmpty(ReadRenderValue<string?>(context, IPlaceholderInputComponent.PlaceholderProperty, null)))
                    _ = input.Attribute("placeholder", " ");

                NativeInputRendererBase.RenderIsReadOnly(context, root, input);

                RenderFlagAttribute(context, input, TextInputComponent.TrimInputProperty, WebAttributes.TrimInput);

                // Read by DebouncedCommitEngine on every keystroke, so a bound value is in force at once.
                _ = RenderProperty<int?>(context, input, TextInputComponent.DebounceMillisecondsProperty, static (target, value) =>
                {
                    if (value is int milliseconds and >= 0)
                        _ = target.Attribute(WebAttributes.InputDebounce, milliseconds.ToString(CultureInfo.InvariantCulture));
                }, [WebDomOperation.Attribute(WebAttributes.InputDebounce, converter: WebDomConverters.NonNegativeCount)]);

                NativeInputRendererBase.RenderRunsOnEnter(context, input);
                NativeInputRendererBase.RenderRunsOnEscape(context, input, TextInputComponent.CancelOnEscapeProperty);
                NativeInputRendererBase.RenderFormId(context, input);
                NativeInputRendererBase.RenderFieldName(context, input);
                RenderFieldLabel(context, input);

                _ = RenderProperty<string?>(context, input, IInputComponent.ValueProperty, static (target, value) =>
                {
                    if (!string.IsNullOrEmpty(value))
                        _ = target.Attribute("value", value);
                }, [WebDomOperation.Property("value")]);
            });

            _ = row.Element("span", suffix => RenderInputAffixText(context, suffix, suffix: true));

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            // Always rendered: the bindable ShowClearButton shows it by the root's own mark. A pointer's shortcut and no tab stop: the
            // keyboard empties the field in the field itself.
            _ = row.Element("button", clear =>
            {
                _ = clear.Class($"{ClassName}__clear");
                _ = clear.Attribute("type", "button");
                _ = clear.Attribute("tabindex", "-1");
                WebWords.Write(context, clear, "aria-label", UIStrings.InputClear);
                _ = clear.Attribute(WebAttributes.Clear);
            });

            // The author's buttons come after the value in the tab order, whichever end they stand at: the leading group follows it
            // here and the stylesheet puts it first. After the clear, what the field can do with its value stands past what takes it away.
            FieldActionsRenderer.Render(context, row, RegionNames.LeadingAction, $"{ClassName}__action {ClassName}__action--leading");
            FieldActionsRenderer.Render(context, row, RegionNames.TrailingAction, $"{ClassName}__action");
        });

        RenderValidationMessage(context, root);
    }

    /// <summary>Whether a caption names the field, now or once its binding delivers one.</summary>
    private static bool IsNamed(WebRenderContext context)
    {
        WebRenderValueKind title = ResolveRenderValue(context, ITextBaseComponent.TitleProperty, out string? caption, out _);

        return title == WebRenderValueKind.Binding || (title == WebRenderValueKind.Static && !string.IsNullOrWhiteSpace(caption));
    }
}
