using System;
using NE.Standard.UI.Authoring.BuiltIns;
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
    // On a field with no caption: its root is a <label>, whose words would name it, the names of the buttons standing in it among
    // them ("Attach Emoji Send"); its placeholder names it instead, as the page translates or patches it.
    private const string PlaceholderNamesAttribute = "data-ui-placeholder-names";

    private static readonly WebDomOperation[] PlaceholderOperations =
    [
        WebDomOperation.Attribute("placeholder", converter: WebDomConverters.PlaceholderText, convertsNull: true),
        WebDomOperation.Attribute("aria-label", $"[{PlaceholderNamesAttribute}]", optional: true)
    ];

    // Every field registers these same lists, so they are built once rather than per field.
    private static readonly WebDomOperation[] TypeOperations = [WebDomOperation.Attribute("type", converter: WebDomConverters.TextInputTypeAttribute)];
    private static readonly WebDomOperation[] AutocompleteOperations = [WebDomOperation.Attribute("autocomplete")];
    private static readonly WebDomOperation[] InputModeOperations = [WebDomOperation.Attribute("inputmode", converter: WebDomConverters.InputModeAttribute)];
    private static readonly WebDomOperation[] ValueOperations = [WebDomOperation.Property("value")];

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

        NativeInputRendererBase.RenderClearable(context, root);

        FieldActionsRenderer.RenderActionsBelow(context, root, TextInputComponent.ActionsBelowProperty);

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{ClassName}__row");

            BorderStyleRenderer.RenderBorderStyle(context, row);

            // Before a caption inside too, as they stand.
            FieldActionsRenderer.RenderLeadingGroups(context, row, $"{ClassName}__action", $"{ClassName}__below");

            RenderInputHeaderInside(context, root, row);

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: false));

            _ = row.Element("span", prefix => RenderInputAffixText(context, prefix, suffix: false));

            _ = row.Element("input", input =>
            {
                _ = input.Class($"{ClassName}__field");
                _ = input.Class("ui-field");

                _ = RenderProperty<UITextInputType?>(context, input, TextInputComponent.TypeProperty, static (target, value) =>
                {
                    _ = target.Attribute("type", WebClassNames.TextInputType(value ?? UITextInputType.Text));

                    // Not among the patch's operations: a push turning the type to text leaves the field marked as a secret.
                    if (value == UITextInputType.Password)
                        _ = target.Attribute(WebAttributes.SecretField);
                }, TypeOperations);

                NativeInputRendererBase.RenderMaxLength(context, input);

                // What the browser may fill in. A password manager reads the sign-in pair from these words and the form the
                // field stands in: the page's, or its FormId's, so a sign-in pair shares one.
                _ = RenderProperty<string?>(context, input, TextInputComponent.AutocompleteProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Attribute("autocomplete", value);
                }, AutocompleteOperations);

                // The keyboard a phone raises, apart from the type: a one-time code stays text and asks for digits.
                _ = RenderProperty<UIInputMode?>(context, input, TextInputComponent.InputModeProperty, static (target, value) =>
                {
                    if (value is UIInputMode mode)
                        _ = target.Attribute("inputmode", WebClassNames.InputMode(mode));
                }, InputModeOperations);

                var namedByPlaceholder = !IsFieldNamed(context);

                if (namedByPlaceholder)
                    _ = input.Attribute(PlaceholderNamesAttribute);

                _ = RenderProperty<string?>(context, input, IPlaceholderInputComponent.PlaceholderProperty, namedByPlaceholder ? RenderNamingPlaceholder : RenderPlaceholder, PlaceholderOperations);

                // A blank one where the author gave none, so :placeholder-shown says the field is empty and the clear goes.
                if (string.IsNullOrEmpty(ReadRenderValue<string?>(context, IPlaceholderInputComponent.PlaceholderProperty, null)))
                    _ = input.Attribute("placeholder", " ");

                NativeInputRendererBase.RenderIsReadOnly(context, root, input);

                RenderFlagAttribute(context, input, TextInputComponent.TrimInputProperty, WebAttributes.TrimInput);

                NativeInputRendererBase.RenderDebounce(context, input);

                NativeInputRendererBase.RenderRunsOnEnter(context, input);
                NativeInputRendererBase.RenderRunsOnEscape(context, input, TextInputComponent.CancelOnEscapeProperty);
                NativeInputRendererBase.RenderFormId(context, input);
                NativeInputRendererBase.RenderFieldName(context, input);
                RenderFieldLabel(context, input);

                _ = RenderProperty<string?>(context, input, IInputComponent.ValueProperty, static (target, value) =>
                {
                    if (!string.IsNullOrEmpty(value))
                        _ = target.Attribute("value", value);
                }, ValueOperations);
            });

            _ = row.Element("span", suffix => RenderInputAffixText(context, suffix, suffix: true));

            _ = row.Element("span", icon => RenderInputAffixIcon(context, root, icon, suffix: true));

            NativeInputRendererBase.RenderClearButton(context, row, $"{ClassName}__clear");

            // After the clear, what the field can do with its value stands past what takes it away.
            FieldActionsRenderer.RenderTrailingGroups(context, row, $"{ClassName}__action", $"{ClassName}__below");
        });

        RenderValidationMessage(context, root);
    }

    private static void RenderNamingPlaceholder(IHtmlElementBuilder target, string? value)
    {
        if (!string.IsNullOrEmpty(value))
            _ = target.Attribute("placeholder", value).Attribute("aria-label", value);
    }

    private static void RenderPlaceholder(IHtmlElementBuilder target, string? value)
    {
        if (!string.IsNullOrEmpty(value))
            _ = target.Attribute("placeholder", value);
    }
}
