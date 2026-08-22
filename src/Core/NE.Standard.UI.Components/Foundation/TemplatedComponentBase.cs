using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for visual components that can render item templates and template variants.
/// </summary>
public abstract partial class TemplatedComponentBase<TComponent>(string? id = null) : VisualComponentBase<TComponent>(id), ITemplatedComponent
    where TComponent : TemplatedComponentBase<TComponent>, IUIComponentDefinition
{
    private readonly Dictionary<string, IVisualComponent> _templates = new(StringComparer.Ordinal);

    /// <inheritdoc/>
    public IVisualComponent? Template { get; protected set; }

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Templates => _templates;

    /// <inheritdoc/>
    public IVisualComponent? EmptyTemplate { get; protected set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITemplatedComponent), DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    public string? TemplateKeyProperty { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITemplatedComponent), IsBindable = false, GenerateBinder = false, DefaultValue = null)]
    public string? FallbackTemplateKey { get; set; }

    /// <inheritdoc/>
    public bool HasTemplate => Template is not null;

    /// <inheritdoc/>
    public bool HasTemplates => _templates.Count > 0;

    /// <inheritdoc/>
    public bool HasEmptyTemplate => EmptyTemplate is not null;

    /// <summary>
    /// Sets the default template content.
    /// </summary>
    public virtual TComponent SetTemplate(IVisualComponent visualTemplate)
    {
        ArgumentNullException.ThrowIfNull(visualTemplate);

        if (ReferenceEquals(visualTemplate, this))
            throw new InvalidOperationException("A component cannot use itself as template content.");

        Template = visualTemplate;
        return Self;
    }

    /// <summary>
    /// Adds or replaces a named template variant.
    /// </summary>
    public virtual TComponent AddTemplateVariant(string key, IVisualComponent visualTemplate)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(visualTemplate);

        if (ReferenceEquals(visualTemplate, this))
            throw new InvalidOperationException("A component cannot use itself as template content.");

        _templates[key] = visualTemplate;
        return Self;
    }

    /// <summary>
    /// Sets the template used when there are no items or no content.
    /// </summary>
    public virtual TComponent SetEmptyTemplate(IVisualComponent visualTemplate)
    {
        ArgumentNullException.ThrowIfNull(visualTemplate);

        if (ReferenceEquals(visualTemplate, this))
            throw new InvalidOperationException("A component cannot use itself as template content.");

        EmptyTemplate = visualTemplate;
        return Self;
    }

    /// <summary>
    /// Gets a template variant by key.
    /// </summary>
    protected IVisualComponent? GetTemplateVariant(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        return _templates.GetValueOrDefault(key);
    }
}
