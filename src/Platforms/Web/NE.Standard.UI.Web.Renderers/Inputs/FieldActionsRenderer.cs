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
/// <see cref="RegionNames.TrailingInFieldAction"/>) and those sent to the other end of the row under it
/// (<see cref="RegionNames.LeadingBelowEndAction"/>, <see cref="RegionNames.TrailingBelowStartAction"/>) — laid into groups in the
/// order they stand: the text input's and the text area's alike.
/// </summary>
internal static class FieldActionsRenderer
{
    // Read by the stylesheet alone (ui-input.less): the tier below which the actions stand under the field.
    private const string ActionsBelowAttribute = "data-ui-actions-below";

    /// <summary>Whether the field carries any action, at either end or in it.</summary>
    public static bool HasAny(WebRenderContext context)
        => HasTools(context) || Has(context, RegionNames.LeadingInFieldAction) || Has(context, RegionNames.TrailingInFieldAction);

    // The actions that stand under the field below its tier: all but the in-field ones.
    private static bool HasTools(WebRenderContext context)
        => Has(context, RegionNames.LeadingAction) || Has(context, RegionNames.TrailingBelowStartAction) || Has(context, RegionNames.LeadingBelowEndAction) || Has(context, RegionNames.TrailingAction);

    /// <summary>Whether the field carries any action on <paramref name="side"/>.</summary>
    public static bool Has(WebRenderContext context, string side)
        => HasAction(context, side, 0);

    private static bool HasAction(WebRenderContext context, string side, int index)
    {
        ArgumentNullException.ThrowIfNull(context);

        return context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out _, RegionNames.FieldAction(side, index));
    }

    /// <summary>
    /// Renders into <paramref name="parent"/>, before the field, the groups drawn before it as <paramref name="actionClass"/>: the
    /// leading in-field one, the leading, and the leading sent to the row's end — <c>--leading</c>, the in-field one <c>--in-field</c>,
    /// the sent one <c>--below-end</c>; no group where there are none. The leading tools and a trailing group sent to the row's start
    /// stand in a <paramref name="belowClass"/> <c>--start</c> pair, here.
    /// </summary>
    /// <remarks>The caller names the classes whole (<c>$"{ClassName}__action"</c>), so a name check reading renderers finds them there.</remarks>
    public static void RenderLeadingGroups(WebRenderContext context, IHtmlElementBuilder parent, string actionClass, string belowClass)
    {
        // In the markup as they are drawn beside the field, so the keyboard meets them in that order; Shift+Tab from the text reaches them.
        Render(context, parent, RegionNames.LeadingInFieldAction, $"{actionClass} {actionClass}--leading {actionClass}--in-field");

        if (IsPair(context, RegionNames.LeadingAction, RegionNames.TrailingBelowStartAction))
            RenderPair(context, parent, $"{belowClass} {belowClass}--start", RegionNames.LeadingAction, $"{actionClass} {actionClass}--leading", RegionNames.TrailingBelowStartAction, $"{actionClass} {actionClass}--below-start");
        else
            Render(context, parent, RegionNames.LeadingAction, $"{actionClass} {actionClass}--leading");

        if (!IsPair(context, RegionNames.LeadingBelowEndAction, RegionNames.TrailingAction))
            Render(context, parent, RegionNames.LeadingBelowEndAction, $"{actionClass} {actionClass}--leading {actionClass}--below-end");
    }

    /// <summary>
    /// Renders into <paramref name="parent"/>, after the field, the groups drawn after it: the trailing sent to the row's start, the
    /// trailing, and the trailing in-field one. A leading group sent to the row's end and the trailing tools stand in a
    /// <paramref name="belowClass"/> <c>--end</c> pair, here.
    /// </summary>
    public static void RenderTrailingGroups(WebRenderContext context, IHtmlElementBuilder parent, string actionClass, string belowClass)
    {
        if (!IsPair(context, RegionNames.LeadingAction, RegionNames.TrailingBelowStartAction))
            Render(context, parent, RegionNames.TrailingBelowStartAction, $"{actionClass} {actionClass}--below-start");

        if (IsPair(context, RegionNames.LeadingBelowEndAction, RegionNames.TrailingAction))
            RenderPair(context, parent, $"{belowClass} {belowClass}--end", RegionNames.LeadingBelowEndAction, $"{actionClass} {actionClass}--leading {actionClass}--below-end", RegionNames.TrailingAction, actionClass);
        else
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

    // Whether both groups of one end of the row under the field stand there, and so share a pair.
    private static bool IsPair(WebRenderContext context, string first, string second)
        => Has(context, first) && Has(context, second);

    /// <summary>
    /// Renders the two groups of one end of the row under the field, <paramref name="first"/> then <paramref name="second"/>, in a
    /// pair of <paramref name="pairClass"/>.
    /// </summary>
    private static void RenderPair(WebRenderContext context, IHtmlElementBuilder parent, string pairClass, string first, string firstClass, string second, string secondClass)
    {
        // One cell of the root's grid holds that end, and two groups justified to it would overlap: the pair is that cell's one box,
        // and beside the field no box at all (display: contents), so each group keeps its own side there — one of them across the
        // field from where the pair stands, put there by the stylesheet's order.
        _ = parent.Element("span", pair =>
        {
            _ = pair.Class(pairClass);

            Render(context, pair, first, firstClass);
            Render(context, pair, second, secondClass);
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
        if (!HasTools(context))
            return;

        _ = WebComponentRendererBase.ResolveRenderValue(context, property, out UIResponsiveTier? tier, out _);

        if (tier is UIResponsiveTier below and > UIResponsiveTier.Base)
            _ = root.Attribute(ActionsBelowAttribute, WebResponsiveCss.TierWord(below));
    }
}
