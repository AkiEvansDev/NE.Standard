using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Items;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderMetadata
{
    private readonly HashSet<string> _bindingKeys = [];
    private readonly HashSet<string> _eventKeys = [];
    private readonly HashSet<string> _validationKeys = [];
    private readonly HashSet<string> _usedPropertyDefinitionIds = [];
    private readonly Dictionary<string, string> _propertyDefinitionIds = [];
    private readonly Dictionary<UIPropertyAddress, string> _renderedPropertyIds = [];
    private readonly Dictionary<CompiledUIInteraction, WebRenderInteractionMetadata> _interactionMetadata = [];
    private readonly List<(CompiledUIItemsFilter Compiled, WebRenderItemsFilterMetadata Metadata)> _pendingItemsFilters = [];
    private readonly List<(CompiledUIItemsSort Compiled, WebRenderItemsSortMetadata Metadata)> _pendingItemsSorts = [];

    private readonly List<WebRenderPropertyDefinitionMetadata> _propertyDefinitions = [];
    private readonly List<WebRenderBindingMetadata> _bindings = [];
    private readonly List<WebRenderEventMetadata> _events = [];
    private readonly List<WebRenderInteractionMetadata> _interactions = [];
    private readonly List<WebRenderValidationMetadata> _validations = [];
    private readonly List<WebRenderItemsTemplateMetadata> _itemsTemplates = [];
    private readonly List<WebRenderItemsFilterSortMetadata> _itemsFilterSort = [];
    private readonly List<WebRenderItemValuesMetadata> _itemValues = [];

    public IReadOnlyList<WebRenderPropertyDefinitionMetadata> PropertyDefinitions
        => [.. _propertyDefinitions.Where(definition => _usedPropertyDefinitionIds.Contains(definition.PropertyId))];

    public IReadOnlyList<WebRenderBindingMetadata> Bindings => _bindings;

    public IReadOnlyList<WebRenderEventMetadata> Events => _events;

    public IReadOnlyList<WebRenderInteractionMetadata> Interactions => _interactions;

    public IReadOnlyList<WebRenderValidationMetadata> Validations => _validations;

    public IReadOnlyList<WebRenderItemsTemplateMetadata> ItemsTemplates => _itemsTemplates;

    public IReadOnlyList<WebRenderItemsFilterSortMetadata> ItemsFilterSort => _itemsFilterSort;

    public IReadOnlyList<WebRenderItemValuesMetadata> ItemValues => _itemValues;

    public IReadOnlyList<UIBindingId> InitBindingIds
        => _bindings
            .Select(static binding => binding.BindingId)
            .Distinct()
            .OrderBy(static bindingId => bindingId.Value)
            .ToArray();

    public string RegisterProperty(string propertyOwnerTypeKey, UIProperty property, IReadOnlyList<WebDomOperation> operations)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyOwnerTypeKey);
        ArgumentException.ThrowIfNullOrWhiteSpace(property.Name);
        ArgumentNullException.ThrowIfNull(operations);

        var key = CreatePropertyDefinitionKey(propertyOwnerTypeKey, property.Name);

        if (_propertyDefinitionIds.TryGetValue(key, out var propertyId))
        {
            WebRenderPropertyDefinitionMetadata existing = _propertyDefinitions.Single(definition => definition.PropertyId == propertyId);

            if (!OperationsEqual(existing.Operations, operations))
                throw new InvalidOperationException($"Property '{propertyOwnerTypeKey}.{property.Name}' was registered with different DOM operations.");

            return propertyId;
        }

        propertyId = string.Create(CultureInfo.InvariantCulture, $"p{_propertyDefinitions.Count + 1}");

        WebRenderPropertyDefinitionMetadata metadata = new()
        {
            PropertyId = propertyId,
            ComponentTypeKey = propertyOwnerTypeKey,
            PropertyName = property.Name,
            Operations = operations
        };

        metadata.Validate();

        _propertyDefinitionIds.Add(key, propertyId);
        _propertyDefinitions.Add(metadata);

        return propertyId;
    }

    public void Bind(WebRenderContext context, CompiledUIBinding binding, string propertyId)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(binding);
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyId);

        _ = _usedPropertyDefinitionIds.Add(propertyId);

        string? itemTemplate = null;
        IReadOnlyList<WebRenderBindingParameterMetadata>? itemTemplateParameters = null;

        if (binding.Parameters.Length > 0)
        {
            CompiledUIBindingTemplate template = context.ViewResolution.View.Templates.GetRequired(binding.TemplateId);

            itemTemplate = template.Template;
            itemTemplateParameters = [.. binding.Parameters.Select(ToParameterMetadata)];
        }

        WebRenderBindingMetadata metadata = new()
        {
            BindingId = binding.Id,
            Kind = binding.Kind,
            ComponentId = binding.Address.Component.Id,
            PropertyId = propertyId,
            Mode = binding.Mode,
            DynamicParameterComponentIds = binding.DynamicParameterComponentIds,
            ItemTemplate = itemTemplate,
            ItemTemplateParameters = itemTemplateParameters
        };

        metadata.Validate();

        var key = string.Create(CultureInfo.InvariantCulture, $"{binding.Id.Value}");

        if (!_bindingKeys.Add(key))
            return;

        _bindings.Add(metadata);
    }

    public void RegisterItemsTemplate(UIComponentId componentId, string? templateKeyPropertyName, string? fallbackTemplateKeyPropertyName, string? itemWrapperElementName = null, string? itemWrapperClassName = null, WebRenderItemsCompositeMetadata? composite = null)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        WebRenderItemsTemplateMetadata metadata = new()
        {
            ComponentId = componentId,
            TemplateKeyPropertyName = templateKeyPropertyName,
            FallbackTemplateKeyPropertyName = fallbackTemplateKeyPropertyName,
            ItemWrapperElementName = itemWrapperElementName,
            ItemWrapperClassName = itemWrapperClassName,
            Composite = composite
        };

        metadata.Validate();

        _itemsTemplates.Add(metadata);
    }

    /// <summary>
    /// Registers the values behind a server-rendered items host — see <see cref="WebRenderItemValuesMetadata"/>.
    /// </summary>
    public void RegisterItemValues(UIComponentId componentId, IReadOnlyList<WebRenderItemValue> items)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        ArgumentNullException.ThrowIfNull(items);

        if (items.Count == 0)
            return;

        WebRenderItemValuesMetadata metadata = new()
        {
            ComponentId = componentId,
            Items = items
        };

        metadata.Validate();

        _itemValues.Add(metadata);
    }

    public void RegisterItemsFilterSort(UIComponentId componentId, CompiledUIItemsView itemsView)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        ArgumentNullException.ThrowIfNull(itemsView);

        if (itemsView.Filters.Length == 0 && itemsView.Sorts.Length == 0)
            return;

        List<WebRenderItemsFilterMetadata> filters = new(itemsView.Filters.Length);

        for (var i = 0; i < itemsView.Filters.Length; i++)
        {
            CompiledUIItemsFilter compiled = itemsView.Filters[i];

            WebRenderItemsFilterMetadata metadata = new()
            {
                ItemProperty = compiled.ItemProperty,
                Operator = compiled.Operator,
                Value = compiled.Value,
                ActiveOperator = compiled.Source.ActiveOperator,
                ActiveValue = compiled.Source.ActiveValue
            };

            filters.Add(metadata);
            _pendingItemsFilters.Add((compiled, metadata));
        }

        List<WebRenderItemsSortMetadata> sorts = new(itemsView.Sorts.Length);

        for (var i = 0; i < itemsView.Sorts.Length; i++)
        {
            CompiledUIItemsSort compiled = itemsView.Sorts[i];

            WebRenderItemsSortMetadata metadata = new()
            {
                ItemProperty = compiled.ItemProperty,
                Direction = compiled.Direction,
                Priority = compiled.Priority,
                ActiveOperator = compiled.Source.ActiveOperator,
                ActiveValue = compiled.Source.ActiveValue
            };

            sorts.Add(metadata);
            _pendingItemsSorts.Add((compiled, metadata));
        }

        _itemsFilterSort.Add(new WebRenderItemsFilterSortMetadata
        {
            ComponentId = componentId,
            Filters = filters,
            Sorts = sorts
        });
    }

    public void AddEvents(IReadOnlyList<CompiledUIEvent> events)
    {
        ArgumentNullException.ThrowIfNull(events);

        for (var i = 0; i < events.Count; i++)
        {
            CompiledUIEvent compiledEvent = events[i];

            ArgumentNullException.ThrowIfNull(compiledEvent);

            WebRenderEventMetadata metadata = new()
            {
                EventId = compiledEvent.Id,
                Address = compiledEvent.Address,
                DynamicParameterComponentIds = GetDynamicParameterComponentIds(compiledEvent.Arguments)
            };

            metadata.Validate();

            var key = string.Create(
                CultureInfo.InvariantCulture,
                $"{metadata.EventId.Value}:{metadata.Address.ComponentId.Value}:{metadata.Address.EventName}"
            );

            if (!_eventKeys.Add(key))
                continue;

            _events.Add(metadata);
        }
    }

    public void RegisterRenderedProperty(UIPropertyAddress address, string propertyId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyId);

        if (address.Component.Id.IsEmpty)
            throw new ArgumentException("Property component id must not be empty.", nameof(address));

        if (!_propertyDefinitionIds.ContainsValue(propertyId))
            throw new InvalidOperationException($"Property definition '{propertyId}' is not registered.");

        if (_renderedPropertyIds.TryGetValue(address, out var existingPropertyId))
        {
            if (!string.Equals(existingPropertyId, propertyId, StringComparison.Ordinal))
                throw new InvalidOperationException($"Rendered property '{address.Component.Id.Value}.{address.Property.Name}' was registered with different property ids.");

            return;
        }

        _renderedPropertyIds.Add(address, propertyId);
    }

    public void AddInteractions(IReadOnlyList<CompiledUIInteraction> interactions)
    {
        ArgumentNullException.ThrowIfNull(interactions);

        for (var i = 0; i < interactions.Count; i++)
        {
            CompiledUIInteraction interaction = interactions[i];

            ArgumentNullException.ThrowIfNull(interaction);

            WebRenderInteractionMetadata metadata = GetOrAddInteractionMetadata(interaction);

            if (interaction.SourceKind == UIInteractionSourceKind.Property &&
                interaction.Source is UIPropertyAddress source &&
                TryCreatePropertyMetadata(source, out WebRenderPropertyMetadata? sourceMetadata))
            {
                metadata.Source = sourceMetadata;
            }

            if (interaction.Target is UIPropertyAddress interactionTarget &&
                TryCreatePropertyMetadata(interactionTarget, out WebRenderPropertyMetadata? targetMetadata))
            {
                metadata.Target = targetMetadata;
            }
        }
    }

    public void AddValidations(IReadOnlyList<CompiledUIValidationRule> rules)
    {
        ArgumentNullException.ThrowIfNull(rules);

        if (rules.Count == 0)
            return;

        for (var i = 0; i < rules.Count; i++)
        {
            CompiledUIValidationRule rule = rules[i];

            ArgumentNullException.ThrowIfNull(rule);

            if (!TryCreatePropertyMetadata(rule.Target, out WebRenderPropertyMetadata? target))
                continue;

            WebRenderValidationMetadata metadata = new()
            {
                Target = target!,
                Trigger = rule.Trigger,
                Operator = rule.Operator,
                Value = rule.Value,
                Severity = rule.Severity,
                Message = rule.Message
            };

            metadata.Validate();

            var key = string.Create(
                CultureInfo.InvariantCulture,
                $"{metadata.Target.ComponentId.Value}:{metadata.Target.PropertyId}:{metadata.Trigger}:{metadata.Operator}:{metadata.Severity}"
            );

            if (!_validationKeys.Add(key))
                continue;

            _validations.Add(metadata);
        }
    }

    public void Validate()
    {
        CompleteInteractionMetadata();
        CompleteItemsFilterSortMetadata();

        for (var i = 0; i < _propertyDefinitions.Count; i++)
            _propertyDefinitions[i].Validate();

        for (var i = 0; i < _bindings.Count; i++)
            _bindings[i].Validate();

        for (var i = 0; i < _events.Count; i++)
            _events[i].Validate();

        for (var i = 0; i < _interactions.Count; i++)
            _interactions[i].Validate();

        for (var i = 0; i < _validations.Count; i++)
            _validations[i].Validate();

        for (var i = 0; i < _itemsTemplates.Count; i++)
            _itemsTemplates[i].Validate();

        for (var i = 0; i < _itemsFilterSort.Count; i++)
            _itemsFilterSort[i].Validate();
    }

    private bool TryCreatePropertyMetadata(UIPropertyAddress address, out WebRenderPropertyMetadata? metadata)
    {
        if (!_renderedPropertyIds.TryGetValue(address, out var propertyId))
        {
            metadata = null;
            return false;
        }

        _ = _usedPropertyDefinitionIds.Add(propertyId);

        metadata = new()
        {
            ComponentId = address.Component.Id,
            PropertyId = propertyId
        };

        return true;
    }

    private WebRenderInteractionMetadata GetOrAddInteractionMetadata(CompiledUIInteraction interaction)
    {
        if (_interactionMetadata.TryGetValue(interaction, out WebRenderInteractionMetadata? metadata))
            return metadata;

        metadata = new()
        {
            SourceKind = interaction.SourceKind,
            ActionKind = interaction.ActionKind,
            SourceEvent = interaction.SourceEvent,
            Effect = interaction.Effect,
            Operator = interaction.Operator,
            Value = interaction.Value,
            TrueValue = interaction.TrueValue,
            FalseValue = interaction.FalseValue
        };

        _interactionMetadata.Add(interaction, metadata);
        _interactions.Add(metadata);

        return metadata;
    }

    private void CompleteInteractionMetadata()
    {
        foreach (KeyValuePair<CompiledUIInteraction, WebRenderInteractionMetadata> pair in _interactionMetadata)
        {
            CompiledUIInteraction interaction = pair.Key;
            WebRenderInteractionMetadata metadata = pair.Value;

            if (interaction.SourceKind == UIInteractionSourceKind.Property &&
                metadata.Source is null &&
                interaction.Source is UIPropertyAddress source &&
                TryCreatePropertyMetadata(source, out WebRenderPropertyMetadata? sourceMetadata))
            {
                metadata.Source = sourceMetadata;
            }

            if (metadata.Target is null &&
                interaction.Target is UIPropertyAddress interactionTarget &&
                TryCreatePropertyMetadata(interactionTarget, out WebRenderPropertyMetadata? targetMetadata))
            {
                metadata.Target = targetMetadata;
            }
        }
    }

    private void CompleteItemsFilterSortMetadata()
    {
        foreach ((CompiledUIItemsFilter compiled, WebRenderItemsFilterMetadata metadata) in _pendingItemsFilters)
        {
            if (compiled.Source.Source is UIPropertyAddress source && TryCreatePropertyMetadata(source, out WebRenderPropertyMetadata? sourceMetadata))
                metadata.Source = sourceMetadata;
        }

        foreach ((CompiledUIItemsSort compiled, WebRenderItemsSortMetadata metadata) in _pendingItemsSorts)
        {
            if (compiled.Source.Source is UIPropertyAddress source && TryCreatePropertyMetadata(source, out WebRenderPropertyMetadata? sourceMetadata))
                metadata.Source = sourceMetadata;
        }
    }

    private static string CreatePropertyDefinitionKey(string propertyOwnerTypeKey, string propertyName)
        => string.Create(CultureInfo.InvariantCulture, $"{propertyOwnerTypeKey}:{propertyName}");

    private static WebRenderBindingParameterMetadata ToParameterMetadata(CompiledUIBindingParameter parameter)
        => new()
        {
            Kind = parameter.Kind,
            ComponentId = parameter.ComponentId,
            Value = parameter.Value
        };

    private static bool OperationsEqual(IReadOnlyList<WebDomOperation> left, IReadOnlyList<WebDomOperation> right)
    {
        if (left.Count != right.Count)
            return false;

        for (var i = 0; i < left.Count; i++)
        {
            if (!OperationEquals(left[i], right[i]))
                return false;
        }

        return true;
    }

    private static bool OperationEquals(WebDomOperation left, WebDomOperation right)
        => left.Kind == right.Kind &&
           string.Equals(left.Target, right.Target, StringComparison.Ordinal) &&
           string.Equals(left.Name, right.Name, StringComparison.Ordinal) &&
           string.Equals(left.Converter, right.Converter, StringComparison.Ordinal) &&
           left.Condition == right.Condition;

    private static UIComponentId[] GetDynamicParameterComponentIds(IReadOnlyList<CompiledUIActionArgument> arguments)
        => [.. arguments
            .SelectMany(static argument => argument.DynamicParameterComponentIds)
            .Distinct()
            .OrderBy(static componentId => componentId.Value)];
}
