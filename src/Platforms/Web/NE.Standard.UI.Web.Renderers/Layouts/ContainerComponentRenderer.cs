using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.CompilerServices;
using System.Text;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
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

    /// <summary>The air between the children, read as the row gap and, capped so twenty-four columns always fit, the column gap.</summary>
    public const string SpacingVariable = "--ui-container-spacing";

    /// <summary>The room the columns cannot give up (absolute widths and floors), which the column gap's cap leaves out.</summary>
    public const string FixedColumnsVariable = "--ui-container-fixed-columns";

    /// <summary>The free air after the container's end, which the scroller along that end takes for its overlay bar (core/scrollbar.less).</summary>
    public const string ScrollbarAirVariable = "--ui-scrollbar-air";

    // A track list's first paint and its one operation per variable, built once rather than per container (a row template's too).
    private static readonly ConcurrentDictionary<(string Variable, string LimitsAttribute), TrackRender> TrackRenders = new();

    // A track list's CSS, worked out once per list: a compiled view hands every render of the container, and every row a row template
    // draws, the same authored list.
    private static readonly ConditionalWeakTable<IReadOnlyList<UIResponsive<UIGridUnit>>, TrackCss> TrackCssByList = [];

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
        RenderSpacing(context, root);
        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, ContainerComponent.ScrollbarAirProperty, ScrollbarAirVariable);

        RenderChildren(context, root);
    }

    /// <summary>The air between the children, and the fixed room the column gap's cap has to leave out when there is any.</summary>
    internal static void RenderSpacing(WebRenderContext context, IHtmlElementBuilder root)
    {
        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, ISpacingComponent.SpacingProperty, SpacingVariable);

        // A bound spacing counts as set, since its value may arrive after the page; an unspaced container writes nothing more.
        WebRenderValueKind kind = ResolveRenderValue(context, ISpacingComponent.SpacingProperty, out UIResponsive<double>? spacing, out _);

        if (kind == WebRenderValueKind.Missing || (kind == WebRenderValueKind.Static && spacing is null))
            return;

        _ = ResolveRenderValue(context, ContainerComponent.ColumnsProperty, out IReadOnlyList<UIResponsive<UIGridUnit>>? columns, out _);

        if (columns is null)
            return;

        // What the columns take at each width: an absolute column's size and any other's floor. An auto column's content is unknown here.
        double? below = null;

        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            double room = 0;

            foreach (UIResponsive<UIGridUnit> track in columns)
            {
                UIGridUnit column = track.Resolve(tier);

                room += column.Unit == UIGridUnitType.Absolute ? column.Value : Math.Max(column.MinValue ?? 0, 0);
            }

            if (room != (below ?? 0))
                _ = root.Style(WebResponsiveCss.TierName(FixedColumnsVariable, tier), WebCssValues.Pixels(room));

            below = room;
        }
    }

    internal static void RenderTracks(WebRenderContext context, IHtmlElementBuilder root, UIProperty property, string variable, string limitsAttribute)
    {
        TrackRender tracks = TrackRenders.GetOrAdd((variable, limitsAttribute), static key => new TrackRender((target, value) =>
        {
            if (value is not { Count: > 0 } list)
                return;

            TrackCss css = TrackCssByList.GetValue(list, static list => new TrackCss(list));

            _ = target.Style(key.Variable, css.Template);

            if (css.Limits.Length > 0)
                _ = target.Attribute(key.LimitsAttribute, css.Limits);

            // Each wider tier whose tracks differ from the one below, read through the stylesheet's chain (ui-container.less).
            for (UIResponsiveTier tier = UIResponsiveTier.Sm; tier <= UIResponsiveTier.Xxl; tier++)
            {
                if (css.Tiers[(int)tier] is string own)
                    _ = target.Style(WebResponsiveCss.TierName(key.Variable, tier), own);
            }
        }, [WebDomOperation.Style(key.Variable, converter: WebDomConverters.GridTemplateCss)]));

        _ = RenderProperty<IReadOnlyList<UIResponsive<UIGridUnit>>?>(context, root, property, tracks.Render, tracks.Operations);
    }

    /// <summary>The tracks in force at <paramref name="tier"/>.</summary>
    internal static UIGridUnit[] AtTier(IReadOnlyList<UIResponsive<UIGridUnit>> tracks, UIResponsiveTier tier)
    {
        ArgumentNullException.ThrowIfNull(tracks);

        UIGridUnit[] units = new UIGridUnit[tracks.Count];

        for (var i = 0; i < units.Length; i++)
            units[i] = tracks[i].Resolve(tier);

        return units;
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

        template = string.Create(CultureInfo.InvariantCulture, $"repeat({units.Count}, {WebCssValues.GridUnit(first)})");

        return true;
    }

    private sealed record TrackRender(Action<IHtmlElementBuilder, IReadOnlyList<UIResponsive<UIGridUnit>>?> Render, WebDomOperation[] Operations);

    /// <summary>
    /// A track list as CSS: the base tier's template and a splitter's bounds (the compiler refuses a splitter over tracks that change by
    /// width), and each wider tier's template where it differs from the one below, else null.
    /// </summary>
    private sealed class TrackCss
    {
        public TrackCss(IReadOnlyList<UIResponsive<UIGridUnit>> tracks)
        {
            UIGridUnit[] units = AtTier(tracks, UIResponsiveTier.Base);

            Template = ToCssGridTemplate(units);
            Limits = WebCssValues.GridTrackLimits(units);
            Tiers = new string?[(int)UIResponsiveTier.Xxl + 1];

            var below = Template;

            for (UIResponsiveTier tier = UIResponsiveTier.Sm; tier <= UIResponsiveTier.Xxl; tier++)
            {
                var own = ToCssGridTemplate(AtTier(tracks, tier));

                Tiers[(int)tier] = string.Equals(own, below, StringComparison.Ordinal) ? null : own;
                below = own;
            }
        }

        public string Template { get; }

        public string Limits { get; }

        public string?[] Tiers { get; }
    }
}
