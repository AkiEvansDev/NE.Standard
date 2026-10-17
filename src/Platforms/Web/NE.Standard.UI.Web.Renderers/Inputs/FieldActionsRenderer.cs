using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// The buttons a text field carries — at its start (<see cref="RegionNames.LeadingAction"/>), at its end
/// (<see cref="RegionNames.TrailingAction"/>) and the one in the field at either end (<see cref="RegionNames.LeadingInFieldAction"/>,
/// <see cref="RegionNames.TrailingInFieldAction"/>) — laid into groups in the order they stand: the text input's and the text area's alike.
/// </summary>
internal static class FieldActionsRenderer
{
    // Read by the stylesheet alone (ui-input.less): the tier below which the actions stand under the field.
    private const string ActionsBelowAttribute = "data-ui-actions-below";

    /// <summary>Whether the field carries any action, at either end or in it.</summary>
    public static bool HasAny(WebRenderContext context)
        => Has(context, RegionNames.LeadingAction) || Has(context, RegionNames.TrailingAction) || Has(context, RegionNames.LeadingInFieldAction) || Has(context, RegionNames.TrailingInFieldAction);

    /// <summary>Whether the field carries any action on <paramref name="side"/>.</summary>
    public static bool Has(WebRenderContext context, string side)
        => HasAction(context, side, 0);

    private static bool HasAction(WebRenderContext context, string side, int index)
    {
        ArgumentNullException.ThrowIfNull(context);

        return context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out _, RegionNames.FieldAction(side, index));
    }

    /// <summary>
    /// Renders the groups into <paramref name="parent"/> as <paramref name="actionClass"/> in the order they stand — the leading
    /// in-field one, the leading, the trailing, the trailing in-field one — the leading ones <c>--leading</c>, the in-field ones
    /// <c>--in-field</c>; no group where there are none.
    /// </summary>
    /// <remarks>The caller names the class whole (<c>$"{ClassName}__action"</c>), so a name check reading renderers finds it there.</remarks>
    public static void RenderGroups(WebRenderContext context, IHtmlElementBuilder parent, string actionClass)
    {
        // After the text in the tab order, whichever end they stand at; the stylesheet puts the leading groups first.
        Render(context, parent, RegionNames.LeadingInFieldAction, $"{actionClass} {actionClass}--leading {actionClass}--in-field");
        Render(context, parent, RegionNames.LeadingAction, $"{actionClass} {actionClass}--leading");
        Render(context, parent, RegionNames.TrailingAction, actionClass);
        Render(context, parent, RegionNames.TrailingInFieldAction, $"{actionClass} {actionClass}--in-field");
    }

    private static void Render(WebRenderContext context, IHtmlElementBuilder parent, string side, string className)
    {
        ArgumentNullException.ThrowIfNull(parent);

        if (!Has(context, side))
            return;

        _ = parent.Element("span", group =>
        {
            _ = group.Class(className);

            for (var i = 0; HasAction(context, side, i); i++)
                WebComponentRendererBase.RenderRegion(context, group, RegionNames.FieldAction(side, i));
        });
    }

    /// <summary>
    /// Names on <paramref name="root"/> the tier of <paramref name="property"/> below which the actions stand under the field, for the
    /// stylesheet's width bands; nothing where no action would stand there — none, or the in-field ones alone.
    /// </summary>
    public static void RenderActionsBelow(WebRenderContext context, IHtmlElementBuilder root, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(root);

        // The bands lay the same groups out under the field: no node moves, none is copied. Without a row of tools under it there
        // is nothing to lay out, and no separator to draw over an empty row.
        if (!Has(context, RegionNames.LeadingAction) && !Has(context, RegionNames.TrailingAction))
            return;

        _ = WebComponentRendererBase.ResolveRenderValue(context, property, out UIResponsiveTier? tier, out _);

        if (tier is UIResponsiveTier below and > UIResponsiveTier.Base)
            _ = root.Attribute(ActionsBelowAttribute, WebResponsiveCss.TierWord(below));
    }
}
