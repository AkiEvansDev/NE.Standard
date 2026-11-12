using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using NE.Standard.UI.Abstractions.Interaction;
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

    private readonly Dictionary<string, IVisualComponent> _templates = [with(StringComparer.Ordinal)];
    private readonly Dictionary<string, string> _compositeSlots = [with(StringComparer.Ordinal)];
    private readonly Dictionary<string, List<Action<IVisualComponent>>> _templateEvents = [with(StringComparer.Ordinal)];
    private Dictionary<string, IVisualComponent>? _defaultTemplates;
    private HashSet<string>? _authoredTemplates;
    private IVisualComponent? _defaultTemplate;
    private IVisualComponent? _defaultEmptyTemplate;
    private bool _hasAuthoredEmptyTemplate;

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

    /// <summary>Gets whether the default template was authored rather than installed as a built-in default.</summary>
    protected bool HasAuthoredTemplate { get; private set; }

    /// <summary>Gets whether the named template variant was authored rather than installed as a built-in default.</summary>
    protected bool IsTemplateVariantAuthored(string key)
        => _authoredTemplates is not null && _authoredTemplates.Contains(key);

    /// <summary>
    /// Sets the template used when there are no items or no content.
    /// </summary>
    public TComponent SetEmptyTemplate(IVisualComponent visualTemplate)
    {
        EmptyTemplate = Accept(visualTemplate);
        _hasAuthoredEmptyTemplate = true;
        return Self;
    }

    /// <summary>Installs the built-in default empty template without marking it as authored.</summary>
    protected void SetDefaultEmptyTemplate(IVisualComponent visualTemplate)
    {
        IVisualComponent accepted = Accept(visualTemplate);
        EmptyTemplate = accepted;
        _defaultEmptyTemplate = accepted;
    }

    /// <summary>Validates that <paramref name="visualTemplate"/> is non-null and not this component itself.</summary>
    protected IVisualComponent Accept(IVisualComponent visualTemplate)
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
        HasAuthoredTemplate = true;
        WriteTemplateEvents(DefaultTemplateSlot, visualTemplate);

        return Self;
    }

    /// <summary>Installs the built-in default template without marking it as authored.</summary>
    protected void SetDefaultTemplate(IVisualComponent visualTemplate)
    {
        IVisualComponent accepted = Accept(visualTemplate);
        Template = accepted;
        _defaultTemplate = accepted;
        WriteTemplateEvents(DefaultTemplateSlot, accepted);
    }

    /// <summary>Marks the current default template as configured by the author.</summary>
    protected void MarkTemplateAuthored()
        => HasAuthoredTemplate = true;

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
        _ = (_authoredTemplates ??= [with(StringComparer.Ordinal)]).Add(key);
        WriteTemplateEvents(key, visualTemplate);

        return Self;
    }

    /// <summary>Installs a built-in default named template variant without marking it as authored.</summary>
    protected void SetDefaultTemplateVariant(string key, IVisualComponent visualTemplate)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        IVisualComponent accepted = Accept(visualTemplate);
        _templates[key] = accepted;
        (_defaultTemplates ??= [with(StringComparer.Ordinal)])[key] = accepted;
        WriteTemplateEvents(key, accepted);
    }

    /// <summary>Marks the named template variant as configured by the author.</summary>
    protected void MarkTemplateVariantAuthored(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        _ = (_authoredTemplates ??= [with(StringComparer.Ordinal)]).Add(key);
    }

    /// <summary>
    /// Removes a named template variant when present.
    /// </summary>
    protected TComponent RemoveTemplateVariantCore(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        _ = _authoredTemplates?.Remove(key);
        _ = _templates.Remove(key);
        return Self;
    }

    /// <summary>Removes a built-in default template variant when present.</summary>
    protected void RemoveDefaultTemplateVariant(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        _ = _defaultTemplates?.Remove(key);
        _ = _templates.Remove(key);
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

    /// <inheritdoc/>
    protected override Action? SnapshotAuthoredState()
    {
        Action? restoreBase = base.SnapshotAuthoredState();
        IVisualComponent? ownTemplate = HasAuthoredTemplate ? Template : null;
        Action? restoreOwnTemplate = (ownTemplate as ITemplateEventTarget)?.SnapshotComponentState();
        IVisualComponent? ownEmptyTemplate = _hasAuthoredEmptyTemplate ? EmptyTemplate : null;
        Action? restoreOwnEmptyTemplate = (ownEmptyTemplate as ITemplateEventTarget)?.SnapshotComponentState();
        IVisualComponent? previousDefaultTemplate = Template;
        UIEvent[]? previousDefaultEvents = ownTemplate is null ? (Template as ITemplateEventTarget)?.SnapshotEvents() : null;

        if (ownTemplate is not null && _defaultTemplate is not null && !ReferenceEquals(ownTemplate, _defaultTemplate))
            Template = _defaultTemplate;

        if (ownEmptyTemplate is not null && _defaultEmptyTemplate is not null && !ReferenceEquals(ownEmptyTemplate, _defaultEmptyTemplate))
            EmptyTemplate = _defaultEmptyTemplate;

        Dictionary<string, IVisualComponent>? previousVariants = _templates.Count > 0 ? new Dictionary<string, IVisualComponent>(_templates, StringComparer.Ordinal) : null;
        Dictionary<string, UIEvent[]>? previousVariantEvents = null;

        if (_templates.Count > 0)
        {
            foreach (KeyValuePair<string, IVisualComponent> pair in _templates)
            {
                if (!IsTemplateVariantAuthored(pair.Key) && pair.Value is ITemplateEventTarget target && target.SnapshotEvents() is { Length: > 0 } events)
                    (previousVariantEvents ??= [with(StringComparer.Ordinal)])[pair.Key] = events;
            }
        }

        List<(string Key, IVisualComponent Variant, Action? Restore)>? ownVariants = null;

        if (_authoredTemplates is { Count: > 0 })
        {
            ownVariants = [with(_authoredTemplates.Count)];

            foreach (var key in _authoredTemplates)
            {
                if (!_templates.TryGetValue(key, out IVisualComponent? variant))
                    continue;

                ownVariants.Add((key, variant, (variant as ITemplateEventTarget)?.SnapshotComponentState()));

                if (_defaultTemplates is not null && _defaultTemplates.TryGetValue(key, out IVisualComponent? defaultVariant) && !ReferenceEquals(variant, defaultVariant))
                    _templates[key] = defaultVariant;
            }
        }

        List<KeyValuePair<string, Action<IVisualComponent>[]>>? ownTemplateEvents = null;

        if (_templateEvents.Count > 0)
        {
            ownTemplateEvents = [with(_templateEvents.Count)];

            foreach (KeyValuePair<string, List<Action<IVisualComponent>>> pair in _templateEvents)
                ownTemplateEvents.Add(new KeyValuePair<string, Action<IVisualComponent>[]>(pair.Key, [.. pair.Value]));

            _templateEvents.Clear();
        }

        HasAuthoredTemplate = false;
        _hasAuthoredEmptyTemplate = false;
        _authoredTemplates?.Clear();

        return () =>
        {
            restoreBase?.Invoke();

            if (ownTemplate is not null)
            {
                Template = ownTemplate;
                HasAuthoredTemplate = true;
                restoreOwnTemplate?.Invoke();
                WriteTemplateEvents(DefaultTemplateSlot, ownTemplate);
            }

            if (ownEmptyTemplate is not null)
            {
                EmptyTemplate = ownEmptyTemplate;
                _hasAuthoredEmptyTemplate = true;
                restoreOwnEmptyTemplate?.Invoke();
            }

            if (ownVariants is not null)
            {
                for (var i = 0; i < ownVariants.Count; i++)
                {
                    (var key, IVisualComponent variant, Action? restore) = ownVariants[i];
                    _templates[key] = variant;
                    _ = (_authoredTemplates ??= [with(StringComparer.Ordinal)]).Add(key);
                    restore?.Invoke();
                    WriteTemplateEvents(key, variant);
                }
            }

            if (ownTemplate is null && ReferenceEquals(Template, previousDefaultTemplate) && previousDefaultEvents is { Length: > 0 } && Template is ITemplateEventTarget defaultTarget)
                defaultTarget.RestoreEvents(previousDefaultEvents);

            if (previousVariantEvents is not null)
            {
                foreach (KeyValuePair<string, UIEvent[]> pair in previousVariantEvents)
                {
                    if (_templates.TryGetValue(pair.Key, out IVisualComponent? currentVariant)
                        && previousVariants is not null
                        && previousVariants.TryGetValue(pair.Key, out IVisualComponent? previousVariant)
                        && ReferenceEquals(currentVariant, previousVariant)
                        && currentVariant is ITemplateEventTarget variantTarget)
                    {
                        variantTarget.RestoreEvents(pair.Value);
                    }
                }
            }

            if (ownTemplateEvents is not null)
            {
                foreach (KeyValuePair<string, Action<IVisualComponent>[]> pair in ownTemplateEvents)
                {
                    if (!_templateEvents.TryGetValue(pair.Key, out List<Action<IVisualComponent>>? writes))
                        _templateEvents[pair.Key] = writes = [];

                    writes.AddRange(pair.Value);

                    IVisualComponent? current = pair.Key.Length == 0 ? Template : _templates.GetValueOrDefault(pair.Key);

                    if (current is not null)
                    {
                        for (var i = 0; i < pair.Value.Length; i++)
                            pair.Value[i](current);
                    }
                }
            }
        };
    }
}

/// <summary>
/// Allows <see cref="TemplatedComponentBase{TComponent}"/> and <see cref="RegionContainerComponentBase{TComponent}"/> to preserve child-authored state on templates and regions across <c>SetDefaults</c>.
/// </summary>
internal interface ITemplateEventTarget
{
    Action SnapshotComponentState();

    UIEvent[] SnapshotEvents();

    void RestoreEvents(UIEvent[] events);
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
