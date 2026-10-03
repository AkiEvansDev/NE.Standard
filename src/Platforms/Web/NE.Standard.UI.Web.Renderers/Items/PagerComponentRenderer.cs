using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Items;

/// <summary>
/// Draws a pager: the buttons that turn a page, a place for the numbered pages and one for the rows the page holds — which
/// <c>pager-engine.ts</c> fills from the target host's window, since only the page knows where it stands — and the page sizes where
/// the author offered them.
/// </summary>
public sealed class PagerComponentRenderer : WebComponentRendererBase
{
    /// <summary>A button that turns a page: the four at the ends and every numbered page.</summary>
    public const string ButtonClassName = "ui-pager__button";

    /// <summary>The place the engine draws the numbered pages in, with an ellipsis for the pages it leaves out.</summary>
    public const string PagesClassName = "ui-pager__pages";

    /// <summary>The line saying which rows the page holds, the compact look's.</summary>
    public const string RangeClassName = "ui-pager__range";

    /// <summary>The page-size choice: its button and the list it opens.</summary>
    public const string SizeClassName = "ui-pager__size";
    public const string SizeTriggerClassName = "ui-pager__size-trigger";
    public const string SizeLabelClassName = "ui-pager__size-label";
    public const string SizeMenuClassName = "ui-pager__sizes";
    public const string SizeChoiceClassName = "ui-pager__size-choice";

    // Read by the stylesheet alone, so a named constant here rather than one in WebAttributes, which holds what the client script reads.
    private const string ModeAttribute = "data-ui-pager-mode";

    private const string ButtonLookClassNames = $"{ButtonClassName} {WebClassNames.Button} ui-button--ghost ui-button--small";

    private static readonly WebDomOperation[] ModeOperations = [WebDomOperation.Attribute(ModeAttribute)];

    public override string ComponentTypeKey => PagerComponent.ComponentTypeKey;

    protected override string ElementName => "nav";

    protected override string ClassName => "ui-pager";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        WebWords.Write(context, root, "aria-label", UIStrings.PagerLabel);

        // The host as the id the compiler gave it, which the page finds it by; the view refused one it lacks when it compiled.
        _ = ResolveRenderValue(context, PagerComponent.TargetProperty, out string? target, out _);

        if (!string.IsNullOrWhiteSpace(target) && context.ViewResolution.View.Graph.TryGetComponentId(target, out UIComponentId host))
            _ = root.Attribute(WebAttributes.PagerTarget, host.Value.ToString(CultureInfo.InvariantCulture));

        // The figures in the page's culture, written again on a language switch, as a grid's count beside them is.
        NumberCultureRenderer.RenderNumberCulture(root, ResolveCulture(context));
        _ = root.Attribute(WebAttributes.PageCulture);

        // The enum's name, which is what a patch writes.
        _ = RenderProperty<UIPagerMode?>(context, root, PagerComponent.ModeProperty, static (element, value) => element.Attribute(ModeAttribute, (value ?? UIPagerMode.Full).ToString()), ModeOperations);

        RenderPageButton(context, root, "first", UIGlyphs.FirstPage, UIStrings.PagerFirst);
        RenderPageButton(context, root, "previous", UIGlyphs.ChevronLeft, UIStrings.PagerPrevious);

        _ = root.Element("span", pages => pages.Class(PagesClassName));

        // Told as it changes, so a page turned from the keyboard says where it landed.
        _ = root.Element("span", range =>
        {
            _ = range.Class(RangeClassName);
            _ = range.Attribute("aria-live", "polite");
        });

        RenderPageButton(context, root, "next", UIGlyphs.ChevronRight, UIStrings.PagerNext);
        RenderPageButton(context, root, "last", UIGlyphs.LastPage, UIStrings.PagerLast);

        RenderPageSizes(context, root);
    }

    /// <summary>An end's button: its glyph alone, named and hinted in the page's words.</summary>
    private static void RenderPageButton(WebRenderContext context, IHtmlElementBuilder root, string page, string icon, string wordKey)
        => _ = root.Element("button", button =>
        {
            _ = button.Class(ButtonLookClassNames);
            _ = button.Attribute("type", "button");
            _ = button.Attribute(TextContentRendererBase.IconOnlyButtonAttribute);
            _ = button.Attribute(WebAttributes.PagerPage, page);
            WebWords.Write(context, button, "aria-label", wordKey);
            WebWords.Write(context, button, WebAttributes.Tooltip, wordKey);
            IconValueRenderer.RenderIcon(button, icon);
        });

    /// <summary>
    /// The sizes offered: a button showing the page's size, which the engine writes, and the menu it opens, one choice per size; inside
    /// the root, as the language switcher's list is, so the component's inert and its closest() paths hold.
    /// </summary>
    private static void RenderPageSizes(WebRenderContext context, IHtmlElementBuilder root)
    {
        IReadOnlyList<int>? sizes = ReadRenderValue<IReadOnlyList<int>?>(context, PagerComponent.PageSizesProperty, null);

        if (sizes is not { Count: > 0 })
            return;

        _ = root.Element("span", size =>
        {
            _ = size.Class(SizeClassName);

            _ = size.Element("button", trigger =>
            {
                _ = trigger.Class($"{SizeTriggerClassName} {WebClassNames.Button} ui-button--ghost ui-button--small");
                _ = trigger.Attribute("type", "button");
                _ = trigger.Attribute("aria-haspopup", "menu");
                _ = trigger.Attribute("aria-expanded", "false");
                _ = trigger.Element("span", label => label.Class(SizeLabelClassName));
                _ = trigger.Element("span", chevron => chevron.Class("ui-pager__size-chevron").Attribute("aria-hidden", "true"));
            });

            _ = size.Element("div", menu =>
            {
                _ = menu.Class(SizeMenuClassName);
                _ = menu.Attribute("role", "menu");
                _ = menu.Attribute(WebAttributes.EventBoundary);
                WebWords.Write(context, menu, "aria-label", UIStrings.PagerSizes);

                for (var i = 0; i < sizes.Count; i++)
                {
                    var rows = sizes[i].ToString(CultureInfo.InvariantCulture);

                    _ = menu.Element("button", choice =>
                    {
                        _ = choice.Class(SizeChoiceClassName);
                        _ = choice.Attribute("type", "button");
                        _ = choice.Attribute("role", "menuitemradio");
                        _ = choice.Attribute("tabindex", "-1");
                        _ = choice.Attribute("aria-checked", "false");
                        _ = choice.Attribute(WebAttributes.PagerSize, rows);
                        _ = choice.Text(rows);
                    });
                }
            });
        });
    }
}
