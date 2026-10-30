using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// <c>ItemMinWidth</c> (<see cref="IEvenColumnsComponent"/>): the root's <c>ui-even-columns</c> and the width per breakpoint, which
/// the component's stylesheet lays its children or options out by (<c>.ui-even-columns()</c>, <c>placement.less</c>).
/// </summary>
public static class EvenColumnsRenderer
{
    /// <summary>The custom property the narrowest column's width is written under, per breakpoint.</summary>
    public const string ItemMinWidthVariable = "--ui-item-min-width";

    /// <summary>Marks the root and writes the width, where one is set; nothing otherwise.</summary>
    public static void Render(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // Render-time: the columns are a grid where the flow was a flex line, a switch a bound value could not make.
        _ = WebComponentRendererBase.ResolveRenderValue(context, IEvenColumnsComponent.ItemMinWidthProperty, out UIResponsive<double>? width, out _);

        if (width is null)
            return;

        _ = root.Class(WebClassNames.EvenColumns);
        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, IEvenColumnsComponent.ItemMinWidthProperty, ItemMinWidthVariable);
    }
}
