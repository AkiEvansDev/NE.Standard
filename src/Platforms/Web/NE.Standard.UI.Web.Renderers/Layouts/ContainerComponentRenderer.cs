using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

public sealed class ContainerComponentRenderer : WebComponentRendererBase
{
    /// <summary>The authored track lists, as custom properties the stylesheet reads under a splitter's own.</summary>
    public const string ColumnsVariable = "--ui-columns";
    public const string RowsVariable = "--ui-rows";

    public override string ComponentTypeKey => ContainerComponent.ComponentTypeKey;

    protected override string ClassName => "ui-container";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ContainerStyleRenderer.RenderContainerStyle(context, root);

        // A variable rather than the grid property itself, so a splitter's tiers can sit over it in the stylesheet's chain.
        RenderTracks(context, root, ContainerComponent.ColumnsProperty, ColumnsVariable, WebAttributes.ColumnLimits);
        RenderTracks(context, root, ContainerComponent.RowsProperty, RowsVariable, WebAttributes.RowLimits);

        RenderChildren(context, root);
    }

    internal static void RenderTracks(WebRenderContext context, IHtmlElementBuilder root, UIProperty property, string variable, string limitsAttribute)
    {
        _ = RenderProperty<IReadOnlyList<UIGridUnit>?>(context, root, property, (target, value) =>
        {
            if (value is not { Count: > 0 } units)
                return;

            _ = target.Style(variable, ToCssGridTemplate(units));

            var limits = WebCssValues.GridTrackLimits(units);

            if (limits.Length > 0)
                _ = target.Attribute(limitsAttribute, limits);
        }, [WebDomOperation.Style(variable, converter: WebDomConverters.GridTemplateCss)]);
    }

    /// <summary>The track list as CSS, a run of equal tracks folded into <c>repeat()</c>; the table's columns, and a package's grid, take the same road.</summary>
    public static string ToCssGridTemplate(IReadOnlyList<UIGridUnit> units)
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
