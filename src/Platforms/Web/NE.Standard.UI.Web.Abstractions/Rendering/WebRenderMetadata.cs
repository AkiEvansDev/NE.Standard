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
    // Keyed by value, not by a formatted string: a row the second render paints registers its bindings and events again, and the
    // repeat must cost a lookup, not an allocation.
    private readonly HashSet<UIBindingId> _bindingKeys = [];
    private readonly HashSet<(UIEventId Event, UIComponentId Component, string EventName)> _eventKeys = [];
    private readonly HashSet<(UIComponentId Component, string PropertyId, UIValidationTrigger Trigger, UIComparisonOperator Operator, UIValidationSeverity Severity)> _validationKeys = [];
    private readonly HashSet<string> _usedPropertyDefinitionIds = [];
    private readonly HashSet<UIComponentId> _itemsTemplateComponents = [];
    private readonly HashSet<UIComponentId> _itemsFilterSortComponents = [];
    private readonly Dictionary<(string OwnerTypeKey, string PropertyName), string> _propertyDefinitionIds = [];
    private readonly Dictionary<string, WebRenderPropertyDefinitionMetadata> _propertyDefinitionsById = [];
    private readonly Dictionary<UIPropertyAddress, string> _renderedPropertyIds = [];
    private readonly HashSet<UIPropertyAddress> _contentAddresses = [];
    private readonly Dictionary<CompiledUIInteraction, WebRenderInteractionMetadata> _interactionMetadata = [];
    private readonly List<(CompiledUIItemsFilter Compiled, WebRenderItemsFilterMetadata Metadata)> _pendingItemsFilters = [];
    private readonly List<(CompiledUIItemsSort Compiled, WebRenderItemsSortMetadata Metadata)> _pendingItemsSorts = [];

    private readonly List<WebRenderPropertyDefinitionMetadata> _propertyDefinitions = [];
    private readonly List<WebRenderValidationTargetMetadata> _validationTargets = [];

    // Resolved after every component has rendered, since the target component may come later on the page and only a rendered
    // property has an id.
    private readonly List<(UIComponentId Field, UIPropertyAddress Message)> _pendingValidationTargets = [];
    private readonly List<UIPropertyAddress> _pendingExposedProperties = [];
    private readonly HashSet<(UIComponentId Component, string Property)> _exposedPropertyNames = [];
    private readonly List<WebRenderPropertyMetadata> _exposedProperties = [];
    private readonly List<WebRenderBindingMetadata> _bindings = [];
    private readonly List<WebRenderEventMetadata> _events = [];
    private readonly List<WebRenderInteractionMetadata> _interactions = [];
    private readonly List<WebRenderValidationMetadata> _validations = [];
    private readonly List<WebRenderItemsTemplateMetadata> _itemsTemplates = [];
    private readonly List<WebRenderItemsFilterSortMetadata> _itemsFilterSort = [];
    private readonly List<WebRenderItemValuesMetadata> _itemValues = [];
    private readonly List<WebRenderWordMetadata> _words = [];

    // One entry per component, property and row keys: a value inside an item template renders once per row and says the same.
    private readonly HashSet<(UIComponentId Component, string PropertyId, string Keys)> _wordKeys = [];

    public IReadOnlyList<WebRenderPropertyDefinitionMetadata> PropertyDefinitions
        => [.. _propertyDefinitions.Where(definition => _usedPropertyDefinitionIds.Contains(definition.PropertyId))];

    public IReadOnlyList<WebRenderBindingMetadata> Bindings => _bindings;

    public IReadOnlyList<WebRenderEventMetadata> Events => _events;

    public IReadOnlyList<WebRenderInteractionMetadata> Interactions => _interactions;

    public IReadOnlyList<WebRenderValidationMetadata> Validations => _validations;

    public IReadOnlyList<WebRenderValidationTargetMetadata> ValidationTargets => _validationTargets;

    /// <summary>The properties a package's client may set the way a push does, by component and name (<c>properties.set</c>).</summary>
    public IReadOnlyList<WebRenderPropertyMetadata> ExposedProperties => _exposedProperties;

    public IReadOnlyList<WebRenderItemsTemplateMetadata> ItemsTemplates => _itemsTemplates;

    public IReadOnlyList<WebRenderItemsFilterSortMetadata> ItemsFilterSort => _itemsFilterSort;

    public IReadOnlyList<WebRenderItemValuesMetadata> ItemValues => _itemValues;

    /// <summary>The translatable values the page was rendered with rather than bound to, which a language switch writes again.</summary>
    public IReadOnlyList<WebRenderWordMetadata> Words => _words;

    public IReadOnlyList<UIBindingId> InitBindingIds
        => _bindings
            .Select(static binding => binding.BindingId)
            .Distinct()
            .OrderBy(static bindingId => bindingId.Value)
            .ToArray();

    /// <summary>
    /// Registers what a property does to the DOM, once per component type, and answers the id the render writes.
    /// </summary>
    /// <remarks>
    /// The operations arrive as a span so the call site's collection expression stays on the stack; all but the first call
    /// for a given property discard it.
    /// </remarks>
    public string RegisterProperty(string propertyOwnerTypeKey, UIProperty property, params ReadOnlySpan<WebDomOperation> operations)
        => RegisterProperty(propertyOwnerTypeKey, property, translatable: false, operations);

    /// <summary>
    /// Registers what a property does to the DOM, and whether its value is localizable text the page looks up before writing it.
    /// </summary>
    public string RegisterProperty(string propertyOwnerTypeKey, UIProperty property, bool translatable, params ReadOnlySpan<WebDomOperation> operations)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyOwnerTypeKey);
        ArgumentException.ThrowIfNullOrWhiteSpace(property.Name);

        (string, string) key = (propertyOwnerTypeKey, property.Name);

        if (_propertyDefinitionIds.TryGetValue(key, out var propertyId))
        {
            WebRenderPropertyDefinitionMetadata existing = _propertyDefinitionsById[propertyId];

            if (!OperationsEqual(existing.Operations, operations))
                throw new InvalidOperationException($"Property '{propertyOwnerTypeKey}.{property.Name}' was registered with different DOM operations.");

            // Kept once any instance says so: a registration that does not know (a package's older call) must not take it away.
            existing.Translatable |= translatable;

            return propertyId;
        }

        propertyId = string.Create(CultureInfo.InvariantCulture, $"p{_propertyDefinitions.Count + 1}");

        WebRenderPropertyDefinitionMetadata metadata = new()
        {
            PropertyId = propertyId,
            ComponentTypeKey = propertyOwnerTypeKey,
            PropertyName = property.Name,
            Operations = operations.ToArray(),
            Translatable = translatable
        };

        metadata.Validate();

        _propertyDefinitionIds.Add(key, propertyId);
        _propertyDefinitionsById.Add(propertyId, metadata);
        _propertyDefinitions.Add(metadata);

        return propertyId;
    }

    public void Bind(WebRenderContext context, CompiledUIBinding binding, string propertyId)
        => Bind(context, binding, propertyId, content: false);

    /// <summary>
    /// Records a binding; <paramref name="content"/> says the property is translatable text this instance shows as written.
    /// </summary>
    public void Bind(WebRenderContext context, CompiledUIBinding binding, string propertyId, bool content)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(binding);
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyId);

        _ = _usedPropertyDefinitionIds.Add(propertyId);

        // A binding id names one compiled binding, so a repeat would build the same metadata only to drop it.
        if (!_bindingKeys.Add(binding.Id))
            return;

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
            ItemTemplateParameters = itemTemplateParameters,
            Optional = binding.Optional,
            // Only set for a binding read out of an item — every other value already reaches the client substituted.
            FallbackValue = itemTemplate is null ? null : binding.TargetFallbackValue,
            Content = content
        };

        metadata.Validate();

        _bindings.Add(metadata);
    }

    /// <summary>
    /// Registers how a client-built item of an items component is made; once per component, since a list inside a row renders once
    /// per row and would repeat the entry each time.
    /// </summary>
    public void RegisterItemsTemplate(UIComponentId componentId, string? templateKeyPropertyName, string? fallbackTemplateKey, string? itemWrapperElementName = null, string? itemWrapperClassName = null, WebRenderItemsCompositeMetadata? composite = null, string? rowDecorator = null, string? itemWrapperRole = null, bool announcesSelection = false)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        if (!_itemsTemplateComponents.Add(componentId))
            return;

        WebRenderItemsTemplateMetadata metadata = new()
        {
            ComponentId = componentId,
            TemplateKeyPropertyName = templateKeyPropertyName,
            FallbackTemplateKey = fallbackTemplateKey,
            ItemWrapperElementName = itemWrapperElementName,
            ItemWrapperClassName = itemWrapperClassName,
            ItemWrapperRole = itemWrapperRole,
            AnnouncesSelection = announcesSelection,
            Composite = composite,
            RowDecorator = rowDecorator
        };

        metadata.Validate();

        _itemsTemplates.Add(metadata);
    }

    /// <summary>
    /// Registers the values behind one server-rendered items host, addressed as the client finds it — see
    /// <see cref="WebRenderItemValuesMetadata"/>.
    /// </summary>
    public void RegisterItemValues(UIComponentAddress host, IReadOnlyList<WebRenderItemValue> items)
    {
        ArgumentNullException.ThrowIfNull(items);

        if (items.Count == 0)
            return;

        WebRenderItemValuesMetadata metadata = new()
        {
            ComponentId = host.Id,
            DynamicParameters = host.DynamicParameters,
            Items = items
        };

        metadata.Validate();

        _itemValues.Add(metadata);
    }

    /// <summary>
    /// Records a translatable value the page was rendered with — a key or a phrase — so a language switch writes it again; once per
    /// component, property and row keys.
    /// </summary>
    public void AddWord(UIComponentId componentId, string propertyId, IReadOnlyList<object?>? dynamicParameters, object key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyId);
        ArgumentNullException.ThrowIfNull(key);

        IReadOnlyList<object?> keys = dynamicParameters ?? [];

        if (!_wordKeys.Add((componentId, propertyId, JoinKeys(keys))))
            return;

        _ = _usedPropertyDefinitionIds.Add(propertyId);

        WebRenderWordMetadata word = new()
        {
            ComponentId = componentId,
            PropertyId = propertyId,
            DynamicParameters = keys,
            Key = key
        };

        word.Validate();

        _words.Add(word);
    }

    // The same text the client compares row keys by — a key sent as a number and one read off the page as digits are one row —
    // each key prefixed with its length, so no key can run into the next.
    private static string JoinKeys(IReadOnlyList<object?> keys)
    {
        if (keys.Count == 0)
            return string.Empty;

        return string.Concat(keys.Select(static key => Convert.ToString(key, CultureInfo.InvariantCulture) is { } text ? $"{text.Length}:{text};" : "-;"));
    }

    public void RegisterItemsFilterSort(UIComponentId componentId, CompiledUIItemsView itemsView)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        ArgumentNullException.ThrowIfNull(itemsView);

        // Once per component, as the template: the rules are the component's, whichever row it was rendered in.
        if ((itemsView.Filters.Length == 0 && itemsView.Sorts.Length == 0) || !_itemsFilterSortComponents.Add(componentId))
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

            // Checked before anything is built: an event id names one compiled event, so a repeat carries nothing new.
            if (!_eventKeys.Add((compiledEvent.Id, compiledEvent.Address.ComponentId, compiledEvent.Address.EventName)))
                continue;

            WebRenderEventMetadata metadata = new()
            {
                EventId = compiledEvent.Id,
                Address = compiledEvent.Address,
                DynamicParameterComponentIds = GetDynamicParameterComponentIds(compiledEvent.Arguments)
            };

            metadata.Validate();

            _events.Add(metadata);
        }
    }

    /// <summary>Records the id a rendered property answers to.</summary>
    public void RegisterRenderedProperty(UIPropertyAddress address, string propertyId)
        => RegisterRenderedProperty(address, propertyId, content: false);

    /// <summary>
    /// Records the id a rendered property answers to; <paramref name="content"/> says it is translatable text this instance shows as
    /// written, which a reference to it carries to the client (a package's <c>properties.set</c>).
    /// </summary>
    public void RegisterRenderedProperty(UIPropertyAddress address, string propertyId, bool content)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyId);

        if (address.Component.Id.IsEmpty)
            throw new ArgumentException("Property component id must not be empty.", nameof(address));

        if (!_propertyDefinitionsById.ContainsKey(propertyId))
            throw new InvalidOperationException($"Property definition '{propertyId}' is not registered.");

        if (_renderedPropertyIds.TryGetValue(address, out var existingPropertyId))
        {
            if (!string.Equals(existingPropertyId, propertyId, StringComparison.Ordinal))
                throw new InvalidOperationException($"Rendered property '{address.Component.Id.Value}.{address.Property.Name}' was registered with different property ids.");

            return;
        }

        _renderedPropertyIds.Add(address, propertyId);

        if (content)
            _ = _contentAddresses.Add(address);
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

    /// <summary>Records that a field sends its validation message to another component's property.</summary>
    public void AddValidationTarget(UIComponentId componentId, UIPropertyAddress message)
    {
        if (componentId.IsEmpty || message.Component.Id.IsEmpty)
            return;

        _pendingValidationTargets.Add((componentId, message));
    }

    /// <summary>
    /// Records that a package's client may set a component's property like a push; called before the component renders so
    /// its element gets marked.
    /// </summary>
    public void ExposeProperty(UIPropertyAddress address)
    {
        if (address.Component.Id.IsEmpty)
            return;

        _pendingExposedProperties.Add(address);
        _ = _exposedPropertyNames.Add((address.Component.Id, address.Property.Name));
    }

    /// <summary>Whether a package's client may set the property, which a render marks the element of.</summary>
    public bool IsExposed(UIPropertyAddress address)
        => _exposedPropertyNames.Contains((address.Component.Id, address.Property.Name));

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

            if (!_validationKeys.Add((metadata.Target.ComponentId, metadata.Target.PropertyId, metadata.Trigger, metadata.Operator, metadata.Severity)))
                continue;

            _validations.Add(metadata);
        }
    }

    public void Validate()
    {
        CompleteInteractionMetadata();
        CompleteItemsFilterSortMetadata();
        CompleteValidationTargetMetadata();
        CompleteExposedPropertyMetadata();

        for (var i = 0; i < _validationTargets.Count; i++)
            _validationTargets[i].Validate();

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

        for (var i = 0; i < _words.Count; i++)
            _words[i].Validate();
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
            PropertyId = propertyId,
            Content = _contentAddresses.Contains(address)
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

    private void CompleteValidationTargetMetadata()
    {
        foreach ((UIComponentId field, UIPropertyAddress message) in _pendingValidationTargets)
        {
            // A target that never rendered is left out rather than refused: the page still works, the words simply have
            // nowhere to go, and the client says so once.
            if (!TryCreatePropertyMetadata(message, out WebRenderPropertyMetadata? messageMetadata))
                continue;

            _validationTargets.Add(new WebRenderValidationTargetMetadata
            {
                ComponentId = field,
                Message = messageMetadata!
            });
        }
    }

    private void CompleteExposedPropertyMetadata()
    {
        foreach (UIPropertyAddress address in _pendingExposedProperties)
        {
            // Refused rather than left out: a package that exposes a property its component never renders would set nothing, silently.
            if (!TryCreatePropertyMetadata(address, out WebRenderPropertyMetadata? metadata))
                throw new InvalidOperationException($"Exposed property '{address.Component.Id.Value}.{address.Property.Name}' is not rendered by its component.");

            _exposedProperties.Add(metadata!);
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

    private static WebRenderBindingParameterMetadata ToParameterMetadata(CompiledUIBindingParameter parameter)
        => new()
        {
            Kind = parameter.Kind,
            ComponentId = parameter.ComponentId,
            Value = parameter.Value
        };

    private static bool OperationsEqual(IReadOnlyList<WebDomOperation> left, ReadOnlySpan<WebDomOperation> right)
    {
        if (left.Count != right.Length)
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
           string.Equals(left.Value, right.Value, StringComparison.Ordinal) &&
           left.Condition == right.Condition &&
           left.Optional == right.Optional;

    private static UIComponentId[] GetDynamicParameterComponentIds(IReadOnlyList<CompiledUIActionArgument> arguments)
        => [.. arguments
            .SelectMany(static argument => argument.DynamicParameterComponentIds)
            .Distinct()
            .OrderBy(static componentId => componentId.Value)];
}
