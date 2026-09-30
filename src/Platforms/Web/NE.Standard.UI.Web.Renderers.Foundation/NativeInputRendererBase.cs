using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>The attribute writers every input renderer shares: name, form, placeholder, read-only, hidden value and file inputs.</summary>
public static class NativeInputRendererBase
{
    /// <summary>
    /// The root's read-only mark as a patch: every input's <c>IsReadOnly</c> registration carries it beside what its own control
    /// needs, since a property registers once per component.
    /// </summary>
    public static WebDomOperation ReadOnlyMarkOperation { get; } = WebDomOperation.ToggleClass(WebClassNames.ReadOnly, target: "root", condition: WebValueCondition.IsTrue);

    private static readonly WebDomOperation[] FormIdOperations = [WebDomOperation.Attribute(WebAttributes.FormId)];
    private static readonly WebDomOperation[] PlaceholderOperations = [WebDomOperation.Attribute("placeholder")];
    private static readonly WebDomOperation[] ReadOnlyOperations = [WebDomOperation.ToggleAttribute("readonly", condition: WebValueCondition.IsTrue), ReadOnlyMarkOperation];
    private static readonly WebDomOperation[] ReadOnlyAriaOperations = [WebDomOperation.ToggleAttribute("aria-readonly", condition: WebValueCondition.IsTrue, value: "true"), ReadOnlyMarkOperation];
    private static readonly WebDomOperation[] ReadOnlyMarkOperations = [ReadOnlyMarkOperation];
    private static readonly WebDomOperation[] MaxFileSizeOperations = [WebDomOperation.Attribute(WebAttributes.FileMaxSize)];
    private static readonly WebDomOperation[] AcceptOperations = [WebDomOperation.Attribute("accept")];
    private static readonly WebDomOperation[] SelectionOperations = [WebDomOperation.Property("value")];

    public static void RenderFormId(WebRenderContext context, IHtmlElementBuilder input)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        _ = WebComponentRendererBase.RenderProperty<string?>(context, input, IInputComponent.FormIdProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.FormId, value);
        }, FormIdOperations);
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
        }, PlaceholderOperations);
    }

    /// <summary><c>IsReadOnly</c> as the root's mark and a native text field's own <c>readonly</c>.</summary>
    public static void RenderIsReadOnly(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder input)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(input);

        _ = WebComponentRendererBase.RenderProperty<bool?>(context, input, IInputComponent.IsReadOnlyProperty, (target, value) =>
        {
            if (value != true)
                return;

            _ = target.Attribute("readonly");
            _ = root.Class(WebClassNames.ReadOnly);
        }, ReadOnlyOperations);
    }

    /// <summary>
    /// <c>IsReadOnly</c> as the root's mark and <c>aria-readonly</c> on a control the browser cannot make read-only itself (a box, a
    /// range, a trigger): it stays focusable and readable, and the client's engines refuse the change.
    /// </summary>
    public static void RenderIsReadOnlyAsAria(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder control)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(control);

        _ = WebComponentRendererBase.RenderProperty<bool?>(context, control, IInputComponent.IsReadOnlyProperty, (target, value) =>
        {
            if (value != true)
                return;

            _ = target.Attribute("aria-readonly", "true");
            _ = root.Class(WebClassNames.ReadOnly);
        }, ReadOnlyAriaOperations);
    }

    /// <summary><c>IsReadOnly</c> as the root's mark alone, for a control whose engine reads it and has no native part to tell.</summary>
    public static void RenderIsReadOnlyMark(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<bool?>(context, root, IInputComponent.IsReadOnlyProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class(WebClassNames.ReadOnly);
        }, ReadOnlyMarkOperations);
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

            // The component's own value, not a second field (a period's end); needed since the visible input comes first in the
            // markup and holds something else.
            if (part is null)
                _ = input.Attribute(WebAttributes.ValueHolder);

            RenderFormId(context, input);
            RenderFieldName(context, input, part);

            configure(input);
        });
    }

    /// <summary>The size the client refuses before it uploads; the endpoint's own limit holds whatever this says.</summary>
    public static void RenderMaxFileSize(WebRenderContext context, IHtmlElementBuilder root, UIProperty maxFileSizeProperty)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<long?>(context, root, maxFileSizeProperty, static (target, value) =>
        {
            if (value > 0)
                _ = target.Attribute(WebAttributes.FileMaxSize, value.Value.ToString(CultureInfo.InvariantCulture));
        }, MaxFileSizeOperations);
    }

    /// <summary>The component whose dropped and pasted files the input takes, as the id it is found by on the page; render-time only.</summary>
    /// <exception cref="InvalidOperationException">The view has no component of that id.</exception>
    public static void RenderDropTargetId(WebRenderContext context, IHtmlElementBuilder root, UIProperty dropTargetIdProperty)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.ResolveRenderValue(context, dropTargetIdProperty, out string? dropTarget, out _);

        if (string.IsNullOrWhiteSpace(dropTarget))
            return;

        // A misspelled id would leave the composer silently taking nothing: said at once, as a misspelled effect target is.
        if (!context.ViewResolution.View.Graph.TryGetComponentId(dropTarget, out UIComponentId target))
            throw new InvalidOperationException($"DropTargetId names component '{dropTarget}', which the view does not have.");

        _ = root.Attribute(WebAttributes.FileDropTargetId, target.Value.ToString(CultureInfo.InvariantCulture));
    }

    /// <summary>The native file picker, present but hidden: only a real file input opens the OS dialog, and a control's own press is what is used.</summary>
    public static void RenderFilePicker(WebRenderContext context, IHtmlElementBuilder host, string className, UIProperty acceptProperty, Action<IHtmlElementBuilder>? configure = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);

        _ = host.Element("input", native =>
        {
            _ = native.Class(className);
            _ = native.Attribute("type", "file");
            // The picker's change is the engine's, never the component's: the component changes when the upload's handle lands
            // on the selection input, or an OnChange command ran with nothing picked yet.
            _ = native.Attribute(WebAttributes.EventBoundary);
            _ = native.Attribute("tabindex", "-1");
            _ = native.Attribute("aria-hidden", "true");
            RenderFieldName(context, native, "file");

            _ = WebComponentRendererBase.RenderProperty<string?>(context, native, acceptProperty, static (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                    _ = target.Attribute("accept", value);
            }, AcceptOperations);

            configure?.Invoke(native);
        });
    }

    /// <summary>The hidden input an upload's handle lands on and syncs back from; <paramref name="holdsValue"/> where that handle is the component's value.</summary>
    public static void RenderSelectionInput(WebRenderContext context, IHtmlElementBuilder host, string className, UIProperty selectionIdProperty, bool holdsValue)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);

        _ = WebComponentRendererBase.ResolveRenderValue(context, selectionIdProperty, out string? _, out CompiledUIBinding? selectionBinding);

        _ = host.Element("input", selection =>
        {
            _ = selection.Class(className);
            _ = selection.Attribute("type", "hidden");

            if (holdsValue)
                _ = selection.Attribute(WebAttributes.ValueHolder);

            RenderFieldName(context, selection, "selection");

            // RenderProperty as well as the attribute: resolving alone leaves the binding unregistered, and the
            // client refuses a binding id it cannot look up.
            _ = WebComponentRendererBase.RenderProperty<string?>(context, selection, selectionIdProperty, static (target, value) =>
            {
                if (!string.IsNullOrEmpty(value))
                    _ = target.Attribute("value", value);
            }, SelectionOperations);

            if (selectionBinding is not null)
                _ = selection.Attribute(WebAttributes.BindValue, selectionBinding.Id.Value.ToString(CultureInfo.InvariantCulture));
        });
    }
}
