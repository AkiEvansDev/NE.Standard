using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// An icon drawn in a shape (<see cref="IconValueRenderer.RenderIconShape"/>): its value, shape and fallback, the mark on its host that
/// shows the icon, and what each of them runs live — the shape's with one more after them where a text body's other parts run one.
/// Built once per site: a text's icon is drawn per row.
/// </summary>
public sealed class WebIconShapeSite
{
    public WebIconShapeSite(UIProperty iconProperty, UIProperty shapeProperty, UIProperty fallbackProperty, string shownAttribute, WebDomOperation? then = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(shownAttribute);

        IconProperty = iconProperty;
        ShapeProperty = shapeProperty;
        FallbackProperty = fallbackProperty;
        ShownAttribute = shownAttribute;
        StandInOperation = WebDomOperation.Custom(IconValueRenderer.StandInOperationKind, name: shownAttribute);

        WebDomOperation shapeClass = WebDomOperation.Class(converter: WebDomConverters.IconShapeClass);

        WebDomOperation[] shapeOperations = then is null ? [shapeClass, StandInOperation] : [shapeClass, StandInOperation, then];
        WebDomOperation[] fallbackOperations = [WebDomOperation.Attribute(WebAttributes.FallbackIcon), StandInOperation];

        ShapeOperations = shapeOperations;
        FallbackOperations = fallbackOperations;
    }

    public UIProperty IconProperty { get; }

    public UIProperty ShapeProperty { get; }

    public UIProperty FallbackProperty { get; }

    /// <summary>The host's mark that shows the icon, which a round icon with no value wears for its stand-in.</summary>
    public string ShownAttribute { get; }

    /// <summary>Redraws the stand-in; the site runs it after the icon value's own operations, before any of its host's.</summary>
    public WebDomOperation StandInOperation { get; }

    public ReadOnlyMemory<WebDomOperation> ShapeOperations { get; }

    public ReadOnlyMemory<WebDomOperation> FallbackOperations { get; }
}
