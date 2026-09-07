using System;
using System.Globalization;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Shared attribute rendering for components that render as a single native <c>&lt;input&gt;</c>.</summary>
public static class NativeInputRendererBase
{
    public static void RenderFormId(WebRenderContext context, IHtmlElementBuilder input)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        _ = WebComponentRendererBase.RenderProperty<string?>(context, input, IInputComponent.FormIdProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.FormId, value);
        }, [WebDomOperation.Attribute(WebAttributes.FormId)]);
    }

    /// <summary>Writes the <c>name</c> a native field carries; <paramref name="part"/> separates several fields of one component.</summary>
    public static void RenderFieldName(WebRenderContext context, IHtmlElementBuilder input, string? part = null)
    {
        ArgumentNullException.ThrowIfNull(input);

        _ = input.Attribute("name", FieldName(context, part));
    }

    /// <summary>The name one component's field goes by — see <see cref="RenderFieldName"/>.</summary>
    public static string FieldName(WebRenderContext context, string? part = null)
    {
        ArgumentNullException.ThrowIfNull(context);

        var name = "ui-" + context.Node.ComponentId.Value.ToString(CultureInfo.InvariantCulture);

        return part is null ? name : name + "-" + part;
    }

    /// <summary>Writes the hint a native field shows while it holds nothing.</summary>
    public static void RenderPlaceholder(WebRenderContext context, IHtmlElementBuilder input)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        _ = WebComponentRendererBase.RenderProperty<string?>(context, input, IPlaceholderInputComponent.PlaceholderProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute("placeholder", value);
        }, [WebDomOperation.Attribute("placeholder")]);
    }

    public static void RenderIsReadOnly(WebRenderContext context, IHtmlElementBuilder input)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        _ = WebComponentRendererBase.RenderProperty<bool?>(context, input, IInputComponent.IsReadOnlyProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute("readonly");
        }, [WebDomOperation.ToggleAttribute("readonly", condition: WebValueCondition.IsTrue)]);
    }

    /// <summary>The hidden input a composed control keeps its value in, named for the form like a native field.</summary>
    public static void RenderHiddenValueInput(WebRenderContext context, IHtmlElementBuilder root, string className, Action<IHtmlElementBuilder> configure, string? part = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(configure);

        _ = root.Element("input", input =>
        {
            _ = input.Class(className);
            _ = input.Attribute("type", "hidden");

            RenderFormId(context, input);
            RenderFieldName(context, input, part);

            configure(input);
        });
    }

    /// <summary>
    /// <see cref="RenderIsReadOnly"/> for controls that ignore <c>readonly</c>; use only there, since
    /// <c>disabled</c> also drops the control out of the tab order.
    /// </summary>
    public static void RenderIsReadOnlyAsDisabled(WebRenderContext context, IHtmlElementBuilder input)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        _ = WebComponentRendererBase.RenderProperty<bool?>(context, input, IInputComponent.IsReadOnlyProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute("disabled");
        }, [WebDomOperation.ToggleAttribute("disabled", condition: WebValueCondition.IsTrue)]);
    }
}
