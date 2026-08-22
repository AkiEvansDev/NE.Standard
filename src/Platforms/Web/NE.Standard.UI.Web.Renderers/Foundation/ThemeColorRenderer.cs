using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Renders a <see cref="UIThemeColor"/>-typed property onto the CSS <c>color</c> property, either as a
/// <c>ui-color--*</c> class (semantic <see cref="UIThemeColor.Style"/>, tracks the live theme) or as an
/// inline style (explicit <see cref="UIThemeColor.Light"/>/<see cref="UIThemeColor.Dark"/> override, which
/// always wins when both are set). Only fit for <c>color</c> — the <c>ui-color--*</c> classes only ever
/// set that declaration, so <c>Background</c>/<c>BorderColor</c> properties (which paint
/// <c>background</c>/<c>border-color</c>) are rendered directly instead of through this helper. Shared by
/// every renderer with a themable text/icon color — see <c>TextContentRendererBase</c>,
/// <c>BadgeComponentRenderer</c>, <c>IconComponentRenderer</c>, <c>SpinnerComponentRenderer</c>,
/// <c>ProgressComponentRenderer</c>, <c>SeparatorComponentRenderer</c>, <c>LinkComponentRenderer</c>.
/// </summary>
public static class ThemeColorRenderer
{
    public static void RenderThemeColor(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UIThemeColor?>(context, target, property, static (t, value) =>
        {
            if (value is not UIThemeColor color)
                return;

            if (color.Light is not null || color.Dark is not null)
                _ = t.Style("color", WebCssValues.ThemeColor(color));
            else if (color.Style is UIColorStyle style)
                _ = t.Class(WebClassNames.Color(style));
        }, [
            WebDomOperation.Style("color", converter: WebDomConverters.ThemeColorCss),
            WebDomOperation.Class(converter: WebDomConverters.ThemeColorClass)
        ]);
    }
}
