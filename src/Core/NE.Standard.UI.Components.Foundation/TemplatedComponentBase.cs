using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Recursive;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for visual components that render content through templates.
/// </summary>
public abstract partial class TemplatedComponentBase<TComponent>(string? id = null) : VisualComponentBase<TComponent>(id), ITemplatedComponent, ITemplateEventHost
    where TComponent : TemplatedComponentBase<TComponent>, IUIComponentDefinition
{
    // The default template's key among the item events; no variant can take it, since a variant key is never blank.
    private const string DefaultTemplateSlot = "";

    private readonly Dictionary<string, IVisualComponent> _templates = new(StringComparer.Ordinal);
    private readonly Dictionary<string, string> _compositeSlots = new(StringComparer.Ordinal);
    private readonly Dictionary<string, List<Action<IVisualComponent>>> _templateEvents = new(StringComparer.Ordinal);

    /// <inheritdoc/>
    IVisualComponent? ITemplatedComponent.Template => Template;

    /// <inheritdoc/>
    IReadOnlyDictionary<string, IVisualComponent> ITemplatedComponent.Templates => Templates;

    /// <summary>
    /// The composite slots by base key, each with the item property naming its typed variants (<see cref="DeclareCompositeSlot"/>).
    /// </summary>
    public IReadOnlyDictionary<string, string> CompositeSlotKeyProperties => _compositeSlots;

    /// <summary>
    /// Gets the default template, untyped; an items component hides this with its own strongly-typed <c>Template</c>.
    /// </summary>
    protected IVisualComponent? Template { get; private set; }

    /// <summary>
    /// Gets the named template variants, untyped.
    /// </summary>
    protected virtual IReadOnlyDictionary<string, IVisualComponent> Templates => _templates;

    /// <inheritdoc/>
    public IVisualComponent? EmptyTemplate { get; private set; }

    /// <inheritdoc/>
    /// <remarks>Render-time only: the renderer and the runtime read it off the compiled state to pick a variant, so a binding would change nothing.</remarks>
    [UIComponentProperty(Contract = typeof(ITemplatedComponent), IsBindable = false, DefaultValue = null)]
    public string? TemplateKeyProperty
    {
        get;
        set
        {
            if (value is { Length: > 0 } && !string.IsNullOrWhiteSpace(value))
                EnsureDottedPropertyPath(value, nameof(value));

            field = value;
        }
    }

    private static void EnsureDottedPropertyPath(string path, string paramName)
    {
        if (string.Equals(path, ".", StringComparison.Ordinal))
            return;

        RecursivePath parsed;

        try
        {
            parsed = RecursivePath.Parse(path);
        }
        catch (FormatException exception)
        {
            throw new ArgumentException($"TemplateKeyProperty '{path}' is not a valid dotted property path.", paramName, exception);
        }

        EnsurePropertySegmentsOnly(parsed, paramName);
    }

    private static void EnsurePropertySegmentsOnly(RecursivePath path, string paramName)
    {
        for (var i = 0; i < path.Count; i++)
        {
            if (path[i].Kind != PathSegmentKind.Property)
                throw new ArgumentException("TemplateKeyProperty must name a dotted property path without indexers or keys.", paramName);
        }
    }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITemplatedComponent), IsBindable = false, DefaultValue = null)]
    public string? FallbackTemplateKey { get; set; }

    /// <inheritdoc/>
    public bool HasTemplate => Template is not null;

    /// <inheritdoc/>
    public bool HasTemplates => Templates.Count > 0;

    /// <summary>
    /// Sets the item property path used to select a named template variant.
    /// </summary>
    public TComponent SetTemplateKeyProperty<TRow>(Expression<Func<TRow, object?>> propertyPath)
    {
        RecursivePath path = RecursivePath.FromExpression(propertyPath);
        EnsurePropertySegmentsOnly(path, nameof(propertyPath));

        return SetTemplateKeyProperty(path.ToString());
    }

    /// <summary>
    /// Declares a composite slot: the base variant key every row wears unless its <paramref name="keyPropertyName"/> names a
    /// typed variant (<c>base:kind</c>) that exists.
    /// </summary>
    protected TComponent DeclareCompositeSlot(string baseKey, string keyPropertyName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(baseKey);
        ArgumentException.ThrowIfNullOrWhiteSpace(keyPropertyName);

        _compositeSlots[baseKey] = keyPropertyName;
        return Self;
    }

    /// <inheritdoc/>
    public bool HasEmptyTemplate => EmptyTemplate is not null;

    /// <summary>
    /// Sets the template used when there are no items or no content.
    /// </summary>
    public TComponent SetEmptyTemplate(IVisualComponent visualTemplate)
    {
        EmptyTemplate = Accept(visualTemplate);
        return Self;
    }

    private IVisualComponent Accept(IVisualComponent visualTemplate)
    {
        ArgumentNullException.ThrowIfNull(visualTemplate);

        return ReferenceEquals(visualTemplate, this)
            ? throw new InvalidOperationException("A component cannot use itself as template content.")
            : visualTemplate;
    }

    /// <summary>
    /// Sets the default template.
    /// </summary>
    protected TComponent SetTemplateCore(IVisualComponent visualTemplate)
    {
        Template = Accept(visualTemplate);
        WriteTemplateEvents(DefaultTemplateSlot, visualTemplate);

        return Self;
    }

    private void WriteTemplateEvents(string slot, IVisualComponent visualTemplate)
    {
        if (!_templateEvents.TryGetValue(slot, out List<Action<IVisualComponent>>? writes))
            return;

        foreach (Action<IVisualComponent> write in writes)
            write(visualTemplate);
    }

    /// <summary>
    /// Gets a template variant by key.
    /// </summary>
    protected IVisualComponent? GetTemplateVariant(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        return _templates.GetValueOrDefault(key);
    }

    /// <summary>
    /// Adds or replaces a named template variant.
    /// </summary>
    protected TComponent SetTemplateVariantCore(string key, IVisualComponent visualTemplate)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        _templates[key] = Accept(visualTemplate);
        WriteTemplateEvents(key, visualTemplate);

        return Self;
    }

    /// <summary>
    /// Removes a named template variant when present.
    /// </summary>
    protected TComponent RemoveTemplateVariantCore(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        _ = _templates.Remove(key);
        return Self;
    }

    /// <summary>
    /// Writes an item event on the template in <paramref name="slotKey"/> (the default template when null) and again on every template
    /// set there later, so the event and the template may be given in either order.
    /// </summary>
    /// <remarks>A template that is not a <typeparamref name="TTemplate"/> is passed over.</remarks>
    protected TComponent OnTemplate<TTemplate>(string? slotKey, Action<TTemplate> register)
        where TTemplate : class, IVisualComponent
    {
        ArgumentNullException.ThrowIfNull(register);

        var slot = slotKey ?? DefaultTemplateSlot;

        void Write(IVisualComponent visualTemplate)
        {
            if (visualTemplate is TTemplate typed)
                register(typed);
        }

        if (!_templateEvents.TryGetValue(slot, out List<Action<IVisualComponent>>? writes))
            _templateEvents[slot] = writes = [];

        writes.Add(Write);

        IVisualComponent? current = slotKey is null ? Template : _templates.GetValueOrDefault(slotKey);

        if (current is not null)
            Write(current);

        return Self;
    }

    /// <inheritdoc/>
    void ITemplateEventHost.OnTemplate<TTemplate>(string? slotKey, Action<TTemplate> register)
        => _ = OnTemplate(slotKey, register);
}

/// <summary>
/// A templated host that writes an item event on its template now and on every template set later, for the shared registration
/// shorthands that hold the host only by an interface.
/// </summary>
internal interface ITemplateEventHost
{
    /// <summary>
    /// Writes an item event on the template in <paramref name="slotKey"/> now and on every template set there later.
    /// </summary>
    void OnTemplate<TTemplate>(string? slotKey, Action<TTemplate> register)
        where TTemplate : class, IVisualComponent;
}
