using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Provides lookup and materialization access to compiled binding templates.
/// </summary>
public sealed class UICompiledBindingTemplateIndex
{
    private readonly record struct TemplateKey(UIBindingSourceId SourceId, string Template);

    private readonly FrozenDictionary<UIBindingTemplateId, CompiledUIBindingTemplate> _templatesById;
    private readonly FrozenDictionary<TemplateKey, CompiledUIBindingTemplate> _templatesByKey;
    private readonly FrozenDictionary<UIBindingTemplateId, RecursivePathTemplate> _recursiveTemplatesById;
    private readonly CompiledUIBindingTemplate[] _all;

    /// <summary>
    /// Initializes the binding template index and validates template uniqueness.
    /// </summary>
    public UICompiledBindingTemplateIndex(CompiledUIBindingTemplate[] templates)
    {
        ArgumentNullException.ThrowIfNull(templates);

        _all = [.. templates];

        Dictionary<UIBindingTemplateId, CompiledUIBindingTemplate> byId = new(templates.Length);
        Dictionary<TemplateKey, CompiledUIBindingTemplate> byKey = [];
        Dictionary<UIBindingTemplateId, RecursivePathTemplate> recursiveById = new(templates.Length);

        for (var i = 0; i < templates.Length; i++)
        {
            CompiledUIBindingTemplate template = templates[i];

            if (template.Id.IsEmpty)
                throw new InvalidOperationException("Binding template id must not be empty.");

            if (template.SourceId.IsEmpty)
                throw new InvalidOperationException($"Binding template '{template.Id}' source id must not be empty.");

            ArgumentNullException.ThrowIfNull(template.Template);

            RecursivePathTemplate recursiveTemplate = RecursivePathTemplate.Parse(template.Template);

            if (recursiveTemplate.ParameterCount != template.ParameterCount)
                throw new InvalidOperationException($"Binding template '{template.Id}' declares {template.ParameterCount} parameters, but parsed template has {recursiveTemplate.ParameterCount} parameters.");

            if (!byId.TryAdd(template.Id, template))
                throw new InvalidOperationException($"Binding template '{template.Id}' is already registered.");

            TemplateKey key = new(template.SourceId, template.Template);

            if (!byKey.TryAdd(key, template))
                throw new InvalidOperationException($"Binding template '{template.Template}' for source '{template.SourceId}' is already registered.");

            recursiveById.Add(template.Id, recursiveTemplate);
        }

        _templatesById = byId.ToFrozenDictionary();
        _templatesByKey = byKey.ToFrozenDictionary();
        _recursiveTemplatesById = recursiveById.ToFrozenDictionary();
    }

    /// <summary>
    /// Gets all registered binding templates.
    /// </summary>
    public IReadOnlyList<CompiledUIBindingTemplate> All => _all;

    /// <summary>
    /// Attempts to get a binding template by id.
    /// </summary>
    public bool TryGet(UIBindingTemplateId templateId, [NotNullWhen(true)] out CompiledUIBindingTemplate? template)
        => templateId.IsEmpty
            ? throw new ArgumentException("Binding template id must not be empty.", nameof(templateId))
            : _templatesById.TryGetValue(templateId, out template);

    /// <summary>
    /// Gets a binding template by id or throws when it is not registered.
    /// </summary>
    public CompiledUIBindingTemplate GetRequired(UIBindingTemplateId templateId)
        => TryGet(templateId, out CompiledUIBindingTemplate? template)
            ? template
            : throw new InvalidOperationException($"Binding template '{templateId}' was not found.");

    /// <summary>
    /// Attempts to get a binding template by source and recursive template.
    /// </summary>
    public bool TryGet(UIBindingSourceId sourceId, RecursivePathTemplate template, [NotNullWhen(true)] out CompiledUIBindingTemplate? compiledTemplate)
    {
        if (sourceId.IsEmpty)
            throw new ArgumentException("Binding source id must not be empty.", nameof(sourceId));

        ArgumentNullException.ThrowIfNull(template);

        return TryGet(sourceId, template.Template, out compiledTemplate);
    }

    /// <summary>
    /// Gets a binding template by source and recursive template or throws when it is not registered.
    /// </summary>
    public CompiledUIBindingTemplate GetRequired(UIBindingSourceId sourceId, RecursivePathTemplate template)
    {
        if (sourceId.IsEmpty)
            throw new ArgumentException("Binding source id must not be empty.", nameof(sourceId));

        ArgumentNullException.ThrowIfNull(template);

        return GetRequired(sourceId, template.Template);
    }

    /// <summary>
    /// Attempts to get a binding template by source and template string.
    /// </summary>
    public bool TryGet(UIBindingSourceId sourceId, string template, [NotNullWhen(true)] out CompiledUIBindingTemplate? compiledTemplate)
    {
        if (sourceId.IsEmpty)
            throw new ArgumentException("Binding source id must not be empty.", nameof(sourceId));

        ArgumentNullException.ThrowIfNull(template);

        return _templatesByKey.TryGetValue(new TemplateKey(sourceId, template), out compiledTemplate);
    }

    /// <summary>
    /// Gets a binding template by source and template string or throws when it is not registered.
    /// </summary>
    public CompiledUIBindingTemplate GetRequired(UIBindingSourceId sourceId, string template)
        => TryGet(sourceId, template, out CompiledUIBindingTemplate? compiledTemplate)
            ? compiledTemplate
            : throw new InvalidOperationException($"Binding template '{template}' for source '{sourceId}' was not found.");

    /// <summary>
    /// Materializes a registered template into a concrete recursive path.
    /// </summary>
    public RecursivePath Materialize(UIBindingTemplateId templateId, object[] parameters)
    {
        if (templateId.IsEmpty)
            throw new ArgumentException("Binding template id must not be empty.", nameof(templateId));

        ArgumentNullException.ThrowIfNull(parameters);

        return !_recursiveTemplatesById.TryGetValue(templateId, out RecursivePathTemplate? template)
            ? throw new InvalidOperationException($"Binding template '{templateId}' was not found.")
            : template.Materialize(parameters);
    }
}
