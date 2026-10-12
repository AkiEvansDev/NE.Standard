using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Inputs;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>
/// What both page switchers (<see cref="ISwitcherComponent"/>) draw alike: the button's chrome on the root, a glyph's slot, and the
/// field shape's caption, box and list.
/// </summary>
/// <remarks>
/// The field is select-shaped — the input family's caption, a select's trigger in the field's appearance, a listbox — and is no
/// <c>ui-select</c>, whose engine would take it: the switcher's own engine opens the list and switches.
/// </remarks>
internal static class SwitcherChromeRenderer
{
    /// <summary>The value of a switcher's engine hook on its field shape.</summary>
    public const string FieldHookValue = "field";

    /// <summary>The field shape's root.</summary>
    public const string FieldClassName = "ui-switcher-field";

    private static readonly WebDomOperation[] IconSizeOperations = [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)];

    // The caption's words, and the box's name with them: the box is the field's control, as a select's trigger is.
    private static readonly WebDomOperation[] FieldTitleOperations = [WebDomOperation.Text(), WebDomOperation.Attribute("aria-label", $".{WebClassNames.SelectTrigger}")];

    private static readonly WebDomOperation[] GlyphOperations =
    [
        .. IconValueRenderer.Operations,
        WebDomOperation.ToggleAttribute(WebAttributes.Icon, condition: WebValueCondition.DrawsIcon)
    ];

    /// <summary>Whether the switcher is drawn as a settings form's field rather than a button; decided once at render.</summary>
    public static bool IsField(WebRenderContext context)
    {
        _ = WebComponentRendererBase.ResolveRenderValue(context, ISwitcherComponent.VariantProperty, out UISwitcherVariant? variant, out _);

        return variant == UISwitcherVariant.Field;
    }

    /// <summary>
    /// The field's root: the engine's hook, the tooltip and the box's appearance, an input's; the caption over the box, the author's
    /// title or else the framework's word for the setting (<paramref name="defaultTitleKey"/>).
    /// </summary>
    public static void RenderField(WebRenderContext context, IHtmlElementBuilder root, string hookAttribute, string defaultTitleKey, Action<IHtmlElementBuilder> renderValue, Action<IHtmlElementBuilder> renderChoices)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Attribute(hookAttribute, FieldHookValue);
        // A caption always shows, the framework's word where the author gives none, so the header the input family hides until then opens.
        _ = root.Attribute(WebAttributes.TextTitle);

        WebComponentRendererBase.RenderTooltip(context, root);
        TextContentRendererBase.RenderFieldAppearance(context, root);

        _ = WebComponentRendererBase.ResolveRenderValue(context, ISwitcherComponent.TitleProperty, out string? title, out _);

        _ = root.Element("span", header =>
        {
            _ = header.Class("ui-input__header");
            _ = header.Class("ui-text");
            _ = header.Class(WebClassNames.TextType(UITextType.Caption));

            _ = header.Element("span", body =>
            {
                _ = body.Class("ui-text__body");
                _ = body.Element("span", line =>
                {
                    _ = line.Class("ui-text__header");
                    _ = line.Element("span", caption => RenderFieldCaption(context, caption, defaultTitleKey));
                });
            });
        });

        _ = root.Element("button", trigger =>
        {
            _ = trigger.Class(WebClassNames.SelectTrigger);
            _ = trigger.Attribute("type", "button");
            // A select-only combobox: the caption is its name and the current choice drawn inside it is its value.
            _ = trigger.Attribute("role", "combobox");
            _ = trigger.Attribute("aria-haspopup", "listbox");
            _ = trigger.Attribute("aria-expanded", "false");

            if (string.IsNullOrWhiteSpace(title))
                WebWords.Write(context, trigger, "aria-label", defaultTitleKey);
            else
                _ = trigger.Attribute("aria-label", title);

            renderValue(trigger);

            SelectComponentRenderer.RenderChevron(trigger);
        });

        _ = root.Element("div", list =>
        {
            _ = list.Attribute("role", "listbox");
            _ = list.Attribute(WebAttributes.EventBoundary);

            renderChoices(list);
        });
    }

    private static void RenderFieldCaption(WebRenderContext context, IHtmlElementBuilder caption, string defaultTitleKey)
    {
        _ = caption.Class("ui-text__title");

        // The framework's word is marked, so a language switch writes it again; the author's is the property's own.
        _ = WebComponentRendererBase.RenderProperty<string?>(context, caption, ISwitcherComponent.TitleProperty, (target, value) =>
        {
            if (string.IsNullOrWhiteSpace(value))
                WebWords.Write(context, target, null, defaultTitleKey);
            else
                _ = target.Text(value);
        }, FieldTitleOperations);
    }

    /// <summary>The tooltip, the button's look, the padding, the ground and the edge, on the root the pointer rests on.</summary>
    public static void RenderChrome(WebRenderContext context, IHtmlElementBuilder root)
    {
        WebComponentRendererBase.RenderTooltip(context, root);

        ButtonRendererBase.RenderButtonLook(context, root);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, ISurfaceComponent.PaddingProperty, WebResponsiveCss.PaddingVariable);

        SurfaceStyleRenderer.RenderBackground(context, root, ISurfaceComponent.BackgroundProperty);

        BorderStyleRenderer.RenderBorderStyle(context, root);
    }

    /// <summary>A glyph drawn from <paramref name="property"/> at the switcher's icon size.</summary>
    public static void RenderGlyph(WebRenderContext context, IHtmlElementBuilder icon, UIProperty property)
    {
        _ = WebComponentRendererBase.RenderProperty<UIIconSize?>(context, icon, ISwitcherComponent.IconSizeProperty, static (target, value) =>
        {
            if (value is UIIconSize iconSize)
                _ = target.Class(WebClassNames.IconSize(iconSize));
        }, IconSizeOperations);

        // The marker as well as the class: `.ui-icon::before` stays hidden until `data-ui-icon` says a glyph is there.
        _ = WebComponentRendererBase.RenderProperty<string?>(context, icon, property, static (target, value) =>
        {
            if (IconValueRenderer.Draws(value))
            {
                _ = target.Attribute(WebAttributes.Icon);
                IconValueRenderer.RenderIconValue(target, value);
            }
        }, GlyphOperations);
    }
}
