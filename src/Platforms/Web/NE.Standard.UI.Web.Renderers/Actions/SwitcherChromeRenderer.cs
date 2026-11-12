using System;
using System.Collections.Concurrent;
using NE.Standard.UI.Abstractions.Binding.Properties;
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

    // The caption's words, and the box's name with them, falling back to the switcher's own translation key when pushed blank.
    private static readonly ConcurrentDictionary<string, WebDomOperation[]> FieldTitleOperationsByDefault = new(StringComparer.Ordinal);

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
    /// title or else the framework's word for the setting (<paramref name="defaultTitleKey"/>); the edge on the box, as a select's. The
    /// button's chrome (<see cref="RenderChrome"/>) — its look, padding, ground and picture — is the button's alone.
    /// </summary>
    public static void RenderField(WebRenderContext context, IHtmlElementBuilder root, string hookAttribute, string defaultTitleKey, Action<IHtmlElementBuilder> renderValue, Action<IHtmlElementBuilder> renderChoices)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Attribute(hookAttribute, FieldHookValue);
        // A caption always shows, the framework's word where the author gives none, so the header the input family hides until then opens.
        _ = root.Attribute(WebAttributes.TextTitle);

        WebComponentRendererBase.RenderTooltip(context, root);
        TextContentRendererBase.RenderFieldAppearance(context, root, ISwitcherComponent.FieldVariantProperty);

        _ = WebComponentRendererBase.ResolveRenderValue(context, ISwitcherComponent.TitleProperty, out string? title, out _);

        _ = root.Element("span", header =>
        {
            _ = header.Class(WebClassNames.InputHeader);
            _ = header.Class(WebClassNames.Text);
            _ = header.Class(WebClassNames.TextType(UITextType.Caption));

            _ = header.Element("span", body =>
            {
                _ = body.Class(WebClassNames.TextBody);
                _ = body.Element("span", line =>
                {
                    _ = line.Class(WebClassNames.TextHeader);
                    _ = line.Element("span", caption => RenderFieldCaption(context, caption, defaultTitleKey));
                });
            });
        });

        _ = root.Element("button", trigger =>
        {
            _ = trigger.Class(WebClassNames.SelectTrigger);
            _ = trigger.Attribute("type", "button");

            // On the box, not the root: the box is the field, as a select's trigger is.
            BorderStyleRenderer.RenderBorderStyle(context, trigger);

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
        _ = caption.Class(WebClassNames.TextTitle);

        // The framework's word is marked, so a language switch writes it again; the author's is the property's own.
        _ = WebComponentRendererBase.RenderProperty<string?>(context, caption, ISwitcherComponent.TitleProperty, (target, value) =>
        {
            if (string.IsNullOrWhiteSpace(value))
                WebWords.Write(context, target, null, defaultTitleKey);
            else
                _ = target.Text(value);
        }, GetFieldTitleOperations(defaultTitleKey));
    }

    private static WebDomOperation[] GetFieldTitleOperations(string defaultTitleKey)
        => FieldTitleOperationsByDefault.GetOrAdd(defaultTitleKey, static key =>
        [
            new WebDomOperation { Kind = WebComponentRendererBase.DefaultWordsOperationKind, Value = key },
            new WebDomOperation { Kind = WebComponentRendererBase.DefaultWordsOperationKind, Name = "aria-label", Target = $".{WebClassNames.SelectTrigger}", Value = key }
        ]);

    /// <summary>The tooltip, the button's look, the padding, the ground, its picture and the edge, on the root the pointer rests on.</summary>
    public static void RenderChrome(WebRenderContext context, IHtmlElementBuilder root)
    {
        WebComponentRendererBase.RenderTooltip(context, root);

        ButtonRendererBase.RenderButtonLook(context, root, ISwitcherComponent.ButtonVariantProperty);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, ISurfaceComponent.PaddingProperty, WebResponsiveCss.PaddingVariable);

        SurfaceStyleRenderer.RenderBackground(context, root, ISurfaceComponent.BackgroundProperty);
        SurfaceStyleRenderer.RenderBackgroundImage(context, root);

        BorderStyleRenderer.RenderBorderStyle(context, root);
    }

    /// <summary>
    /// A glyph drawn from <paramref name="property"/> at the switcher's icon size, which <paramref name="marksRoot"/> writes on the
    /// switcher's root too, as a text's root carries its glyph's size: a glyph edge hangs the theme switcher by its glyph.
    /// </summary>
    public static void RenderGlyph(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder icon, UIProperty property, bool marksRoot = true)
    {
        IconValueRenderer.RenderGlyphSize(context, root, icon, ISwitcherComponent.IconSizeProperty, marksRoot);

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
