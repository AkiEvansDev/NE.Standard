using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

public sealed class ContainerComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => ContainerComponent.ComponentTypeKey;

    protected override string ClassName => "ui-container";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ContainerStyleRenderer.RenderContainerStyle(context, root);

        _ = RenderProperty<IReadOnlyList<UIGridUnit>?>(context, root, ContainerComponent.ColumnsProperty, static (target, value) =>
        {
            if (value is { Count: > 0 } columns)
                _ = target.Style("grid-template-columns", ToCssGridTemplate(columns));
        }, [WebDomOperation.Style("grid-template-columns", converter: WebDomConverters.GridTemplateCss)]);

        _ = RenderProperty<IReadOnlyList<UIGridUnit>?>(context, root, ContainerComponent.RowsProperty, static (target, value) =>
        {
            if (value is { Count: > 0 } rows)
                _ = target.Style("grid-template-rows", ToCssGridTemplate(rows));
        }, [WebDomOperation.Style("grid-template-rows", converter: WebDomConverters.GridTemplateCss)]);

        RenderChildren(context, root);
    }

    private static string ToCssGridTemplate(IReadOnlyList<UIGridUnit> units)
    {
        ArgumentNullException.ThrowIfNull(units);

        return units.Count switch
        {
            0 => "none",
            1 => WebCssValues.GridUnit(units[0]),
            _ when TryCreateRepeatGridTemplate(units, out var template) => template,
            _ => ToCssGridTemplateCore(units)
        };
    }

    private static string ToCssGridTemplateCore(IReadOnlyList<UIGridUnit> units)
    {
        StringBuilder builder = new();

        for (var i = 0; i < units.Count; i++)
        {
            if (i > 0)
                _ = builder.Append(' ');

            _ = builder.Append(WebCssValues.GridUnit(units[i]));
        }

        return builder.ToString();
    }

    private static bool TryCreateRepeatGridTemplate(IReadOnlyList<UIGridUnit> units, out string template)
    {
        UIGridUnit first = units[0];

        for (var i = 1; i < units.Count; i++)
        {
            if (units[i] != first)
            {
                template = string.Empty;
                return false;
            }
        }

        template = string.Create(
            CultureInfo.InvariantCulture,
            $"repeat({units.Count}, {WebCssValues.GridUnit(first)})"
        );

        return true;
    }
}
