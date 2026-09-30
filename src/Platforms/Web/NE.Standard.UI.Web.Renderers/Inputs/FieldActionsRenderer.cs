using System;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// The buttons a text field carries at one end (<see cref="RegionNames.LeadingAction"/> or <see cref="RegionNames.TrailingAction"/>
/// and their numbered followers), laid into one group in the order they were added.
/// </summary>
internal static class FieldActionsRenderer
{
    /// <summary>Whether the field carries any action on <paramref name="side"/>.</summary>
    public static bool Has(WebRenderContext context, string side)
        => HasAction(context, side, 0);

    /// <summary>Renders the actions on <paramref name="side"/> into a group of <paramref name="className"/>; no group where there are none.</summary>
    public static void Render(WebRenderContext context, IHtmlElementBuilder parent, string side, string className)
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

    private static bool HasAction(WebRenderContext context, string side, int index)
    {
        ArgumentNullException.ThrowIfNull(context);

        return context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out _, RegionNames.FieldAction(side, index));
    }
}
