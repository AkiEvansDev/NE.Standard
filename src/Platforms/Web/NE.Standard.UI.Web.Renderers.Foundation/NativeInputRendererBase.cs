using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Shell.Localization;
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

    /// <summary>
    /// The root's clear mark as a patch (<see cref="RenderClearable"/>), for an input whose <c>ShowClearButton</c> registration carries
    /// more beside it.
    /// </summary>
    public static WebDomOperation ClearableMarkOperation { get; } = WebDomOperation.ToggleAttribute(WebAttributes.Clearable, target: "root", condition: WebValueCondition.IsTrue);

    // One per attribute a form's id is written under, its writers built once: a form id is rendered on every field of the page.
    private static readonly ConcurrentDictionary<string, FormIdMark> FormIdMarks = new(StringComparer.Ordinal);
    private static readonly WebDomOperation[] PlaceholderOperations = [WebDomOperation.Attribute("placeholder")];
    private static readonly WebDomOperation[] EmptyMarkingPlaceholderOperations = [WebDomOperation.Attribute("placeholder", converter: WebDomConverters.PlaceholderText, convertsNull: true)];
    private static readonly WebDomOperation[] ClearableOperations = [ClearableMarkOperation];
    private static readonly WebDomOperation[] MaxLengthOperations = [WebDomOperation.Attribute("maxlength")];
    private static readonly DebounceMark InputDebounceMark = new(WebAttributes.InputDebounce);
    private static readonly DebounceMark SearchDebounceMark = new(WebAttributes.SearchDebounce);
    private static readonly WebDomOperation[] ReadOnlyOperations = [WebDomOperation.ToggleAttribute("readonly", condition: WebValueCondition.IsTrue), ReadOnlyMarkOperation];
    private static readonly WebDomOperation[] ReadOnlyAriaOperations = [WebDomOperation.ToggleAttribute("aria-readonly", condition: WebValueCondition.IsTrue, value: "true"), ReadOnlyMarkOperation];
    private static readonly WebDomOperation[] ReadOnlyMarkOperations = [ReadOnlyMarkOperation];
    private static readonly WebDomOperation[] MaxFileSizeOperations = [WebDomOperation.Attribute(WebAttributes.FileMaxSize)];
    private static readonly WebDomOperation[] AcceptOperations = [WebDomOperation.Attribute("accept")];
    private static readonly WebDomOperation[] SelectionOperations = [WebDomOperation.Property("value")];
    private static readonly WebDomOperation[] RunsOnEscapeOperations = [WebDomOperation.ToggleAttribute(WebAttributes.RunsOnEscape, condition: WebValueCondition.IsTrue)];

    /// <summary>
    /// The field's <c>FormId</c>: the framework's form, and the browser's own the field joins by <c>form</c> — the hidden form the
    /// shell writes for it (<see cref="WebForms"/>).
    /// </summary>
    public static void RenderFormId(WebRenderContext context, IHtmlElementBuilder input)
        => RenderFormId(context, input, joinsForm: true);

    /// <summary>
    /// The <c>FormId</c> on an element; <paramref name="joinsForm"/> false where it is not a field the browser could own (a radio
    /// group's root), so it carries the framework's form alone.
    /// </summary>
    public static void RenderFormId(WebRenderContext context, IHtmlElementBuilder element, bool joinsForm)
        => RenderFormId(context, element, IInputComponent.FormIdProperty, WebAttributes.FormId, joinsForm);

    /// <summary>
    /// A form's id read from <paramref name="property"/> and written under <paramref name="attribute"/> — a field's form, a submit
    /// button's — and, where <paramref name="joinsForm"/>, the browser's own form the element joins by <c>form</c>.
    /// </summary>
    public static void RenderFormId(WebRenderContext context, IHtmlElementBuilder element, UIProperty property, string attribute, bool joinsForm)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(element);
        ArgumentException.ThrowIfNullOrWhiteSpace(attribute);

        FormIdMark mark = FormIdMarks.GetOrAdd(attribute, static name => new FormIdMark(name));

        _ = joinsForm
            ? WebComponentRendererBase.RenderProperty(context, element, property, mark.WriteJoined, mark.JoinedOperations)
            : WebComponentRendererBase.RenderProperty(context, element, property, mark.Write, mark.Operations);
    }

    /// <summary>The writers and patches of a form's id under one attribute, alone or with the <c>form</c> the element joins by.</summary>
    private sealed class FormIdMark
    {
        private readonly string _attribute;

        public FormIdMark(string attribute)
        {
            _attribute = attribute;
            Operations = [WebDomOperation.Attribute(attribute)];
            JoinedOperations = [WebDomOperation.Attribute(attribute), WebDomOperation.Custom(WebForms.OwnerOperationKind)];
            Write = WriteMark;
            WriteJoined = WriteMarkAndForm;
        }

        public WebDomOperation[] Operations { get; }

        public WebDomOperation[] JoinedOperations { get; }

        public Action<IHtmlElementBuilder, string?> Write { get; }

        public Action<IHtmlElementBuilder, string?> WriteJoined { get; }

        private void WriteMark(IHtmlElementBuilder target, string? value)
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(_attribute, value);
        }

        private void WriteMarkAndForm(IHtmlElementBuilder target, string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return;

            _ = target.Attribute(_attribute, value);
            _ = target.Attribute("form", WebForms.ElementId(value));
        }
    }

    /// <summary>
    /// Marks a text field whose Enter runs a command or an interaction (<c>OnEnter</c>): the field keys engine commits the value and
    /// raises <c>enter</c> where the field stands, rather than leaving it or breaking the line.
    /// </summary>
    public static void RenderRunsOnEnter(WebRenderContext context, IHtmlElementBuilder input)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        if (HandlesEvent(context, EventNames.Enter))
            _ = input.Attribute(WebAttributes.RunsOnEnter);
    }

    /// <summary>Whether the view runs a command or an interaction on the component's <paramref name="eventName"/>.</summary>
    private static bool HandlesEvent(WebRenderContext context, string eventName)
    {
        CompiledUIEventAddress address = new(context.Node.ComponentId, eventName);

        return context.ViewResolution.View.Events.TryGet(address, out _) || context.ViewResolution.View.Interactions.GetBySource(address).Count > 0;
    }

    /// <summary>
    /// Marks a text field whose Escape runs a command or an interaction (<c>OnEscape</c>) while <paramref name="cancelOnEscape"/> holds:
    /// the field keys engine puts back its last committed value, leaves it and raises <c>escape</c>, rather than committing what was typed.
    /// </summary>
    public static void RenderRunsOnEscape(WebRenderContext context, IHtmlElementBuilder input, UIProperty cancelOnEscape)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        if (!HandlesEvent(context, EventNames.Escape))
            return;

        // Read at every Escape, so a bound switch is in force at once.
        _ = WebComponentRendererBase.RenderProperty<bool?>(context, input, cancelOnEscape, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute(WebAttributes.RunsOnEscape);
        }, RunsOnEscapeOperations);
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

    /// <summary>
    /// Writes the hint a native field shows while it holds nothing; <paramref name="marksEmpty"/> writes a blank one where the author
    /// gave none, so <c>:placeholder-shown</c> says the field is empty — what hides its clear.
    /// </summary>
    public static void RenderPlaceholder(WebRenderContext context, IHtmlElementBuilder input, bool marksEmpty = false)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        if (marksEmpty)
        {
            _ = WebComponentRendererBase.RenderProperty<string?>(context, input, IPlaceholderInputComponent.PlaceholderProperty, static (target, value)
                => _ = target.Attribute("placeholder", string.IsNullOrEmpty(value) ? " " : value), EmptyMarkingPlaceholderOperations);

            return;
        }

        _ = WebComponentRendererBase.RenderProperty<string?>(context, input, IPlaceholderInputComponent.PlaceholderProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute("placeholder", value);
        }, PlaceholderOperations);
    }

    /// <summary>
    /// Whether the clear shows (<see cref="IClearableInputComponent"/>), as the root's mark: the button itself is always in the tree, so
    /// the bindable property only shows it. <paramref name="operations"/> replaces the mark's patch where the input says more with it
    /// (a select's Delete key), and holds <see cref="ClearableMarkOperation"/> among them.
    /// </summary>
    public static void RenderClearable(WebRenderContext context, IHtmlElementBuilder root, WebDomOperation[]? operations = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<bool?>(context, root, IClearableInputComponent.ShowClearButtonProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute(WebAttributes.Clearable);
        }, operations ?? ClearableOperations);
    }

    /// <summary>
    /// The clear button of a field's row (<see cref="WebAttributes.Clear"/>): a pointer's shortcut out of the tab order, since the
    /// keyboard empties the field in the field itself; the stylesheet shows it under <see cref="RenderClearable"/>'s mark while there
    /// is a value.
    /// </summary>
    public static void RenderClearButton(WebRenderContext context, IHtmlElementBuilder row, string className)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(row);

        _ = row.Element("button", clear =>
        {
            _ = clear.Class(className);
            _ = clear.Attribute("type", "button");
            _ = clear.Attribute("tabindex", "-1");
            WebWords.Write(context, clear, "aria-label", UIStrings.InputClear);
            _ = clear.Attribute(WebAttributes.Clear);
        });
    }

    /// <summary>A text field's longest value (<see cref="ITextLengthComponent"/>) as its native <c>maxlength</c>.</summary>
    public static void RenderMaxLength(WebRenderContext context, IHtmlElementBuilder input)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        _ = WebComponentRendererBase.RenderProperty<int?>(context, input, ITextLengthComponent.MaxLengthProperty, static (target, value) =>
        {
            if (value is int maxLength)
                _ = target.Attribute("maxlength", maxLength.ToString(CultureInfo.InvariantCulture));
        }, MaxLengthOperations);
    }

    /// <summary>
    /// A field's commit delay (<see cref="IDebounceInputComponent"/>), read by <c>DebouncedCommitEngine</c> on every keystroke, so a
    /// bound value is in force at once; a negative one is written as none, by the first paint and a patch alike.
    /// </summary>
    public static void RenderDebounce(WebRenderContext context, IHtmlElementBuilder input)
        => RenderDebounce(context, input, InputDebounceMark);

    /// <summary>
    /// A search's pause before it asks (<see cref="IDebounceInputComponent"/>), read by the search engine as
    /// <see cref="RenderDebounce(WebRenderContext, IHtmlElementBuilder)"/>'s is read by the commit engine.
    /// </summary>
    /// <remarks>Its own attribute: the commit engine raises <c>change</c> on every field carrying the other, and a search's term is no value.</remarks>
    public static void RenderSearchDebounce(WebRenderContext context, IHtmlElementBuilder input)
        => RenderDebounce(context, input, SearchDebounceMark);

    private static void RenderDebounce(WebRenderContext context, IHtmlElementBuilder input, DebounceMark mark)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(input);

        _ = WebComponentRendererBase.RenderProperty(context, input, IDebounceInputComponent.DebounceMillisecondsProperty, mark.Write, mark.Operations);
    }

    /// <summary>The writer and patch of a pause under one attribute, built once.</summary>
    private sealed class DebounceMark
    {
        private readonly string _attribute;

        public DebounceMark(string attribute)
        {
            _attribute = attribute;
            Operations = [WebDomOperation.Attribute(attribute, converter: WebDomConverters.NonNegativeCount)];
            Write = WriteMark;
        }

        public WebDomOperation[] Operations { get; }

        public Action<IHtmlElementBuilder, int?> Write { get; }

        private void WriteMark(IHtmlElementBuilder target, int? value)
        {
            if (value is int milliseconds and >= 0)
                _ = target.Attribute(_attribute, milliseconds.ToString(CultureInfo.InvariantCulture));
        }
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

    /// <summary>
    /// The patches <see cref="RenderIsReadOnlyAsPick"/> registers, built once per renderer: the root's mark, <c>aria-disabled</c> on
    /// each control a selector names — one selector a control, since an operation lands on the first part its selector matches — and
    /// <c>disabled</c> on the native file picker where <paramref name="nativeSelector"/> names one; <paramref name="optional"/> where not
    /// every instance draws the controls (a shelf of thumbnails alone has no pick).
    /// </summary>
    public static WebDomOperation[] PickReadOnlyOperations(string[] pickSelectors, string? nativeSelector = null, bool optional = false)
    {
        ArgumentNullException.ThrowIfNull(pickSelectors);

        List<WebDomOperation> operations = [ReadOnlyMarkOperation];

        foreach (var selector in pickSelectors)
            operations.Add(WebDomOperation.ToggleAttribute("aria-disabled", target: selector, condition: WebValueCondition.IsTrue, value: "true", optional: optional));

        if (nativeSelector is not null)
            operations.Add(WebDomOperation.ToggleAttribute("disabled", target: nativeSelector, condition: WebValueCondition.IsTrue));

        return [.. operations];
    }

    /// <summary>
    /// <c>IsReadOnly</c> on a control that opens a picker — a file's pick, a picture's surface, a colour's swatch: the root's mark, the
    /// picks saying they do nothing rather than turning disabled, which would drop a focus they hold, and the hidden native file picker
    /// disabled, as it must be. The engines refuse a press and a drop by the mark.
    /// </summary>
    public static void RenderIsReadOnlyAsPick(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<IHtmlElementBuilder> picks, IHtmlElementBuilder? native, WebDomOperation[] operations)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(picks);
        ArgumentNullException.ThrowIfNull(operations);

        // One registration, every target: a property renders once per component. Applied after every pick exists.
        _ = WebComponentRendererBase.RenderProperty<bool?>(context, root, IInputComponent.IsReadOnlyProperty, (target, value) =>
        {
            if (value != true)
                return;

            _ = target.Class(WebClassNames.ReadOnly);

            foreach (IHtmlElementBuilder pick in picks)
                _ = pick.Attribute("aria-disabled", "true");

            _ = native?.Attribute("disabled");
        }, operations);
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

    /// <summary>
    /// The size the client refuses before it uploads (<see cref="IMaxFileSizeComponent"/>); the endpoint's own limit holds whatever this
    /// says.
    /// </summary>
    public static void RenderMaxFileSize(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<long?>(context, root, IMaxFileSizeComponent.MaxFileSizeProperty, static (target, value) =>
        {
            if (value > 0)
                _ = target.Attribute(WebAttributes.FileMaxSize, value.Value.ToString(CultureInfo.InvariantCulture));
        }, MaxFileSizeOperations);
    }

    /// <summary>
    /// The component whose dropped and pasted files the input takes, as the id the compiler gave it and the page finds it by;
    /// render-time only. The view refused an id it lacks when it compiled.
    /// </summary>
    public static void RenderDropTargetId(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.ResolveRenderValue(context, IFilePickerInputComponent.DropTargetIdProperty, out string? dropTarget, out _);

        if (string.IsNullOrWhiteSpace(dropTarget) || !context.ViewResolution.View.Graph.TryGetComponentId(dropTarget, out UIComponentId target))
            return;

        _ = root.Attribute(WebAttributes.FileDropTargetId, target.Value.ToString(CultureInfo.InvariantCulture));
    }

    /// <summary>The native file picker, present but hidden: only a real file input opens the OS dialog, and a control's own press is what is used.</summary>
    public static void RenderFilePicker(WebRenderContext context, IHtmlElementBuilder host, string className, Action<IHtmlElementBuilder>? configure = null)
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

            _ = WebComponentRendererBase.RenderProperty<string?>(context, native, IFileAcceptComponent.AcceptProperty, static (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                    _ = target.Attribute("accept", value);
            }, AcceptOperations);

            configure?.Invoke(native);
        });
    }

    /// <summary>The hidden input an upload's handle lands on and syncs back from; <paramref name="holdsValue"/> where that handle is the component's value.</summary>
    public static void RenderSelectionInput(WebRenderContext context, IHtmlElementBuilder host, string className, bool holdsValue)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);

        UIProperty selectionIdProperty = IFilePickerInputComponent.SelectionIdProperty;

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
