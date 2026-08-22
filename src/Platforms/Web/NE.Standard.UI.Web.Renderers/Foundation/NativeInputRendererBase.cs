using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Shared <c>FormId</c>/<c>IsReadOnly</c> rendering for components that render as a single native
/// <c>&lt;input&gt;</c> with no per-item template concern (unlike Select/RadioGroup) — currently
/// <c>NumberInputComponentRenderer</c> directly, and <c>TemporalInputRendererBase</c>'s
/// Date/Time/DateTimeInput renderers.
/// <para>
/// Both helpers are <see langword="public"/> rather than <see langword="protected"/> so a renderer that
/// needs them from *outside* this hierarchy can still call them — <c>TextAreaComponentRenderer</c> renders
/// a native field but derives from <c>TextContentRendererBase</c> for its icon/title/badge header, and C#
/// gives it only one base to pick. This is the same "public static on the owning renderer" sharing shape
/// as <c>BorderComponentRenderer.RenderBorder</c>.
/// </para>
/// </summary>
public abstract class NativeInputRendererBase : WebComponentRendererBase
{
    public static void RenderFormId(WebRenderContext context, IHtmlElementBuilder input)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        _ = RenderProperty<string?>(context, input, IInputComponent.FormIdProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("data-ui-form-id", value);
        }, [WebDomOperation.Attribute("data-ui-form-id")]);
    }

    public static void RenderIsReadOnly(WebRenderContext context, IHtmlElementBuilder input)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        _ = RenderProperty<bool?>(context, input, IInputComponent.IsReadOnlyProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute("readonly");
        }, [WebDomOperation.ToggleAttribute("readonly", condition: WebValueCondition.IsTrue)]);
    }
}
