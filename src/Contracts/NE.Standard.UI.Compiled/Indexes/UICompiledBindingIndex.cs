using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Provides lookup and resolution access to compiled bindings.
/// </summary>
public sealed class UICompiledBindingIndex
{
    private readonly record struct BindingTemplateKindKey(UIBindingTemplateId TemplateId, CompiledUIBindingKind Kind);
    private readonly record struct BindingTemplateStringKindKey(UIBindingSourceId SourceId, string Template, CompiledUIBindingKind Kind);

    private static readonly CompiledUIBinding[] Empty = [];

    private readonly UICompiledBindingSourceIndex _sources;
    private readonly UICompiledBindingTemplateIndex _templates;
    private readonly FrozenDictionary<UIBindingId, CompiledUIBinding> _bindingsById;
    private readonly FrozenDictionary<UIPropertyAddress, CompiledUIBinding> _propertyBindingsByAddress;
    private readonly FrozenDictionary<UIPropertyAddress, CompiledUIBinding> _contextBindingsByAddress;
    private readonly FrozenDictionary<UIPropertyAddress, CompiledUIBinding> _collectionBindingsByAddress;
    private readonly FrozenDictionary<UIBindingTemplateId, CompiledUIBinding[]> _bindingsByTemplateId;
    private readonly FrozenDictionary<BindingTemplateKindKey, CompiledUIBinding[]> _bindingsByTemplateIdAndKind;
    private readonly FrozenDictionary<BindingTemplateStringKindKey, CompiledUIBinding[]> _descendantBindingsByTemplateAndKind;
    private readonly CompiledUIBinding[] _all;

    /// <summary>
    /// Initializes the compiled binding index and validates binding references.
    /// </summary>
    public UICompiledBindingIndex(CompiledUIBinding[] bindings, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates)
    {
        ArgumentNullException.ThrowIfNull(bindings);
        ArgumentNullException.ThrowIfNull(sources);
        ArgumentNullException.ThrowIfNull(templates);

        _sources = sources;
        _templates = templates;
        _all = [.. bindings];

        Dictionary<UIBindingId, CompiledUIBinding> byId = new(bindings.Length);
        Dictionary<UIPropertyAddress, CompiledUIBinding> propertyByAddress = [];
        Dictionary<UIPropertyAddress, CompiledUIBinding> contextByAddress = [];
        Dictionary<UIPropertyAddress, CompiledUIBinding> collectionByAddress = [];
        Dictionary<UIBindingTemplateId, List<CompiledUIBinding>> byTemplate = [];
        Dictionary<BindingTemplateKindKey, List<CompiledUIBinding>> byTemplateAndKind = [];
        Dictionary<BindingTemplateStringKindKey, List<CompiledUIBinding>> descendantsByTemplateAndKind = [];

        for (var i = 0; i < bindings.Length; i++)
        {
            CompiledUIBinding binding = bindings[i];

            ValidateBinding(binding, sources, templates);

            if (!byId.TryAdd(binding.Id, binding))
                throw new InvalidOperationException($"Binding '{binding.Id}' is already registered.");

            Dictionary<UIPropertyAddress, CompiledUIBinding> addressMap = binding.Kind switch
            {
                CompiledUIBindingKind.ComponentProperty => propertyByAddress,
                CompiledUIBindingKind.ComponentContext => contextByAddress,
                CompiledUIBindingKind.ComponentCollection => collectionByAddress,
                _ => throw new UnreachableException()
            };

            if (!addressMap.TryAdd(binding.Address, binding))
                throw new InvalidOperationException($"Binding address '{binding.Address}' is already registered for kind '{binding.Kind}'.");

            AddToIndex(byTemplate, binding.TemplateId, binding);
            AddToIndex(byTemplateAndKind, new BindingTemplateKindKey(binding.TemplateId, binding.Kind), binding);
            AddToDescendantTemplateKindIndex(descendantsByTemplateAndKind, binding, templates);
        }

        _bindingsById = byId.ToFrozenDictionary();
        _propertyBindingsByAddress = propertyByAddress.ToFrozenDictionary();
        _contextBindingsByAddress = contextByAddress.ToFrozenDictionary();
        _collectionBindingsByAddress = collectionByAddress.ToFrozenDictionary();
        _bindingsByTemplateId = Freeze(byTemplate);
        _bindingsByTemplateIdAndKind = Freeze(byTemplateAndKind);
        _descendantBindingsByTemplateAndKind = Freeze(descendantsByTemplateAndKind);
    }

    /// <summary>
    /// Gets all registered bindings.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> All => _all;

    /// <summary>
    /// Resolves the property binding for an address using dynamic template parameters.
    /// </summary>
    public CompiledUIBindingResolution Resolve(UIPropertyAddress address, object?[] dynamicParameters)
    {
        CompiledUIBinding binding = GetRequiredProperty(address);

        return Resolve(binding, dynamicParameters);
    }

    /// <summary>
    /// Resolves a compiled binding using dynamic template parameters.
    /// </summary>
    public CompiledUIBindingResolution Resolve(CompiledUIBinding binding, object?[] dynamicParameters)
    {
        ArgumentNullException.ThrowIfNull(binding);
        ArgumentNullException.ThrowIfNull(dynamicParameters);

        var parameters = CompiledUIBindingParameterResolver.Build(binding.Parameters, dynamicParameters);
        RecursivePath path = MaterializePath(binding, parameters);
        CompiledUIBindingSource source = _sources.GetRequired(binding.SourceId);

        return new CompiledUIBindingResolution(binding, source, path);
    }

    /// <summary>
    /// Materializes a binding template using concrete template parameters.
    /// </summary>
    public RecursivePath MaterializePath(CompiledUIBinding binding, object[] parameters)
    {
        ArgumentNullException.ThrowIfNull(binding);
        ArgumentNullException.ThrowIfNull(parameters);

        return _templates.Materialize(binding.TemplateId, parameters);
    }

    /// <summary>
    /// Attempts to get a binding by id.
    /// </summary>
    public bool TryGet(UIBindingId bindingId, [NotNullWhen(true)] out CompiledUIBinding? binding)
    {
        if (bindingId.IsEmpty)
            throw new ArgumentException("Binding id must not be empty.", nameof(bindingId));

        return _bindingsById.TryGetValue(bindingId, out binding);
    }

    /// <summary>
    /// Gets a binding by id or throws when it is not registered.
    /// </summary>
    public CompiledUIBinding GetRequired(UIBindingId bindingId)
        => TryGet(bindingId, out CompiledUIBinding? binding)
            ? binding
            : throw new InvalidOperationException($"Binding '{bindingId}' was not found.");

    /// <summary>
    /// Attempts to get a component property binding by address.
    /// </summary>
    public bool TryGetProperty(UIPropertyAddress address, [NotNullWhen(true)] out CompiledUIBinding? binding)
        => _propertyBindingsByAddress.TryGetValue(address, out binding);

    /// <summary>
    /// Gets a component property binding by address or throws when it is not registered.
    /// </summary>
    public CompiledUIBinding GetRequiredProperty(UIPropertyAddress address)
        => TryGetProperty(address, out CompiledUIBinding? binding)
            ? binding
            : throw new InvalidOperationException($"Property binding for address '{address}' was not found.");

    /// <summary>
    /// Attempts to get the context binding for a component.
    /// </summary>
    public bool TryGetContext(UIComponentId componentId, [NotNullWhen(true)] out CompiledUIBinding? binding)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        UIPropertyAddress address = new(componentId, nameof(IBindableComponent.Context));

        return _contextBindingsByAddress.TryGetValue(address, out binding);
    }

    /// <summary>
    /// Gets the context binding for a component or throws when it is not registered.
    /// </summary>
    public CompiledUIBinding GetRequiredContext(UIComponentId componentId)
        => TryGetContext(componentId, out CompiledUIBinding? binding)
            ? binding
            : throw new InvalidOperationException($"Context binding for component '{componentId}' was not found.");

    /// <summary>
    /// Attempts to get the collection binding for an items component.
    /// </summary>
    public bool TryGetCollection(UIComponentId componentId, [NotNullWhen(true)] out CompiledUIBinding? binding)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        UIPropertyAddress address = new(componentId, nameof(IBindableItemsComponent.Items));

        return _collectionBindingsByAddress.TryGetValue(address, out binding);
    }

    /// <summary>
    /// Gets the collection binding for an items component or throws when it is not registered.
    /// </summary>
    public CompiledUIBinding GetRequiredCollection(UIComponentId componentId)
        => TryGetCollection(componentId, out CompiledUIBinding? binding)
            ? binding
            : throw new InvalidOperationException($"Collection binding for component '{componentId}' was not found.");

    /// <summary>
    /// Gets controller-source bindings matching the specified path.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> GetController(RecursivePath path, out object[] parameters)
        => Get(_sources.Controller.Id, path, out parameters);

    /// <summary>
    /// Gets controller-source property bindings matching the specified path.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> GetControllerProperties(RecursivePath path, out object[] parameters)
        => Get(_sources.Controller.Id, path, CompiledUIBindingKind.ComponentProperty, out parameters);

    /// <summary>
    /// Gets controller-source context bindings matching the specified path.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> GetControllerContexts(RecursivePath path, out object[] parameters)
        => Get(_sources.Controller.Id, path, CompiledUIBindingKind.ComponentContext, out parameters);

    /// <summary>
    /// Gets controller-source collection bindings matching the specified path.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> GetControllerCollections(RecursivePath path, out object[] parameters)
        => Get(_sources.Controller.Id, path, CompiledUIBindingKind.ComponentCollection, out parameters);

    /// <summary>
    /// Gets controller-source property bindings below the specified path.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> GetControllerDescendantProperties(RecursivePath path, out object[] parameters)
        => GetDescendants(_sources.Controller.Id, path, CompiledUIBindingKind.ComponentProperty, out parameters);

    /// <summary>
    /// Gets bindings for a source and concrete path.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> Get(UIBindingSourceId sourceId, RecursivePath path, out object[] parameters)
    {
        if (sourceId.IsEmpty)
            throw new ArgumentException("Binding source id must not be empty.", nameof(sourceId));

        ArgumentNullException.ThrowIfNull(path);

        (RecursivePathTemplate template, var pathParameters) = RecursivePathTemplate.FromPath(path);
        parameters = pathParameters;

        return Get(sourceId, template);
    }

    /// <summary>
    /// Gets bindings of the specified kind for a source and concrete path.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> Get(UIBindingSourceId sourceId, RecursivePath path, CompiledUIBindingKind kind, out object[] parameters)
    {
        if (sourceId.IsEmpty)
            throw new ArgumentException("Binding source id must not be empty.", nameof(sourceId));

        ArgumentNullException.ThrowIfNull(path);

        (RecursivePathTemplate template, var pathParameters) = RecursivePathTemplate.FromPath(path);
        parameters = pathParameters;

        return Get(sourceId, template, kind);
    }

    /// <summary>
    /// Gets bindings for a source and path template.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> Get(UIBindingSourceId sourceId, RecursivePathTemplate template)
    {
        if (sourceId.IsEmpty)
            throw new ArgumentException("Binding source id must not be empty.", nameof(sourceId));

        ArgumentNullException.ThrowIfNull(template);

        return _templates.TryGet(sourceId, template, out CompiledUIBindingTemplate? compiledTemplate)
            ? GetByTemplateId(compiledTemplate.Id)
            : Empty;
    }

    /// <summary>
    /// Gets bindings of the specified kind for a source and path template.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> Get(UIBindingSourceId sourceId, RecursivePathTemplate template, CompiledUIBindingKind kind)
    {
        if (sourceId.IsEmpty)
            throw new ArgumentException("Binding source id must not be empty.", nameof(sourceId));

        ArgumentNullException.ThrowIfNull(template);

        return _templates.TryGet(sourceId, template, out CompiledUIBindingTemplate? compiledTemplate)
            ? GetByTemplateId(compiledTemplate.Id, kind)
            : Empty;
    }

    /// <summary>
    /// Gets bindings below the specified source path.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> GetDescendants(UIBindingSourceId sourceId, RecursivePath path, CompiledUIBindingKind kind, out object[] parameters)
    {
        if (sourceId.IsEmpty)
            throw new ArgumentException("Binding source id must not be empty.", nameof(sourceId));

        ArgumentNullException.ThrowIfNull(path);

        (RecursivePathTemplate template, var pathParameters) = RecursivePathTemplate.FromPath(path);
        parameters = pathParameters;

        return GetDescendants(sourceId, template, kind);
    }

    /// <summary>
    /// Gets bindings below the specified source path template.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> GetDescendants(UIBindingSourceId sourceId, RecursivePathTemplate template, CompiledUIBindingKind kind)
    {
        if (sourceId.IsEmpty)
            throw new ArgumentException("Binding source id must not be empty.", nameof(sourceId));

        ArgumentNullException.ThrowIfNull(template);

        return _descendantBindingsByTemplateAndKind.TryGetValue(new BindingTemplateStringKindKey(sourceId, template.Template, kind), out CompiledUIBinding[]? bindings)
            ? bindings
            : Empty;
    }

    /// <summary>
    /// Gets bindings using the specified template.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> GetByTemplateId(UIBindingTemplateId templateId)
    {
        if (templateId.IsEmpty)
            throw new ArgumentException("Binding template id must not be empty.", nameof(templateId));

        return _bindingsByTemplateId.TryGetValue(templateId, out CompiledUIBinding[]? bindings)
            ? bindings
            : Empty;
    }

    /// <summary>
    /// Gets bindings of the specified kind using the specified template.
    /// </summary>
    public IReadOnlyList<CompiledUIBinding> GetByTemplateId(UIBindingTemplateId templateId, CompiledUIBindingKind kind)
    {
        if (templateId.IsEmpty)
            throw new ArgumentException("Binding template id must not be empty.", nameof(templateId));

        return _bindingsByTemplateIdAndKind.TryGetValue(new BindingTemplateKindKey(templateId, kind), out CompiledUIBinding[]? bindings)
            ? bindings
            : Empty;
    }

    private static void ValidateBinding(CompiledUIBinding binding, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates)
    {
        ArgumentNullException.ThrowIfNull(binding);

        if (binding.Id.IsEmpty)
            throw new InvalidOperationException("Binding id must not be empty.");

        if (binding.SourceId.IsEmpty)
            throw new InvalidOperationException($"Binding '{binding.Id}' source id must not be empty.");

        if (binding.TemplateId.IsEmpty)
            throw new InvalidOperationException($"Binding '{binding.Id}' template id must not be empty.");

        _ = sources.GetRequired(binding.SourceId);

        CompiledUIBindingTemplate template = templates.GetRequired(binding.TemplateId);

        if (!template.SourceId.Equals(binding.SourceId))
            throw new InvalidOperationException($"Binding '{binding.Id}' source '{binding.SourceId}' does not match template '{binding.TemplateId}' source '{template.SourceId}'.");

        var slotCount = CompiledUIBindingParameterResolver.CountSlots(binding.Parameters);

        if (slotCount != template.ParameterCount)
            throw new InvalidOperationException($"Binding '{binding.Id}' has {slotCount} parameters, but template '{template.Id}' expects {template.ParameterCount}.");

        CompiledUIBindingParameterResolver.ValidateDynamicComponentIds($"Binding '{binding.Id}'", binding.Parameters, binding.DynamicParameterComponentIds);
    }

    private static void AddToIndex<TKey>(Dictionary<TKey, List<CompiledUIBinding>> index, TKey key, CompiledUIBinding binding)
        where TKey : notnull
    {
        if (!index.TryGetValue(key, out List<CompiledUIBinding>? group))
        {
            group = [];
            index.Add(key, group);
        }

        group.Add(binding);
    }

    private static void AddToDescendantTemplateKindIndex(Dictionary<BindingTemplateStringKindKey, List<CompiledUIBinding>> index, CompiledUIBinding binding, UICompiledBindingTemplateIndex templates)
    {
        CompiledUIBindingTemplate template = templates.GetRequired(binding.TemplateId);

        foreach (var ancestorTemplate in EnumerateAncestorTemplates(template.Template))
        {
            BindingTemplateStringKindKey key = new(binding.SourceId, ancestorTemplate, binding.Kind);

            AddToIndex(index, key, binding);
        }
    }

    private static IEnumerable<string> EnumerateAncestorTemplates(string template)
    {
        ArgumentNullException.ThrowIfNull(template);

        if (template.Length == 0)
            yield break;

        yield return string.Empty;

        for (var i = 0; i < template.Length; i++)
        {
            if (template[i] is not '.' and not '[')
                continue;

            if (i == 0)
                continue;

            yield return template[..i];
        }
    }

    private static FrozenDictionary<TKey, CompiledUIBinding[]> Freeze<TKey>(Dictionary<TKey, List<CompiledUIBinding>> source)
        where TKey : notnull
    {
        Dictionary<TKey, CompiledUIBinding[]> result = new(source.Count);

        foreach (KeyValuePair<TKey, List<CompiledUIBinding>> pair in source)
            result.Add(pair.Key, [.. pair.Value]);

        return result.ToFrozenDictionary();
    }
}
