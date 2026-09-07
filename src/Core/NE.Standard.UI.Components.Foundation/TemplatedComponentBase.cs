using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for visual components that render content through templates.
/// </summary>
public abstract partial class TemplatedComponentBase<TComponent>(string? id = null) : VisualComponentBase<TComponent>(id), ITemplatedComponent
    where TComponent : TemplatedComponentBase<TComponent>, IUIComponentDefinition
{
    private readonly Dictionary<string, IVisualComponent> _templates = new(StringComparer.Ordinal);

    /// <inheritdoc/>
    IVisualComponent? ITemplatedComponent.Template => Template;

    /// <inheritdoc/>
    IReadOnlyDictionary<string, IVisualComponent> ITemplatedComponent.Templates => Templates;

    /// <summary>
    /// Gets the default template, untyped; an items component hides this with its own strongly-typed <c>Template</c>.
    /// </summary>
    protected IVisualComponent? Template { get; private set; }

    /// <summary>
    /// Gets the named template variants, untyped.
    /// </summary>
    protected IReadOnlyDictionary<string, IVisualComponent> Templates => _templates;

    /// <inheritdoc/>
    public IVisualComponent? EmptyTemplate { get; private set; }

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

    /// <summary>
    /// Adds or replaces a named template variant.
    /// </summary>
    protected TComponent SetTemplateVariantCore(string key, IVisualComponent visualTemplate)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        _templates[key] = Accept(visualTemplate);
        return Self;
    }
}
