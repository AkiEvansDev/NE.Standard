using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Provides lookup access to compiled UI events.
/// </summary>
public sealed class UIEventIndex
{
    private readonly FrozenDictionary<UIEventId, CompiledUIEvent> _eventsById;
    private static readonly CompiledUIEvent[] Empty = [];

    private readonly FrozenDictionary<CompiledUIEventAddress, CompiledUIEvent> _eventsByAddress;
    private readonly FrozenDictionary<UIComponentId, CompiledUIEvent[]> _eventsByComponent;
    private readonly CompiledUIEvent[] _all;

    /// <summary>
    /// Initializes the event index and validates event uniqueness and argument references.
    /// </summary>
    public UIEventIndex(CompiledUIEvent[] events, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates)
    {
        ArgumentNullException.ThrowIfNull(events);
        ArgumentNullException.ThrowIfNull(sources);
        ArgumentNullException.ThrowIfNull(templates);

        _all = [.. events];

        Dictionary<UIEventId, CompiledUIEvent> byId = new(events.Length);
        Dictionary<CompiledUIEventAddress, CompiledUIEvent> byAddress = new(events.Length);
        Dictionary<UIComponentId, List<CompiledUIEvent>> byComponent = [];

        for (var i = 0; i < events.Length; i++)
        {
            CompiledUIEvent compiledEvent = events[i];

            ValidateEvent(compiledEvent, sources, templates);

            if (!byId.TryAdd(compiledEvent.Id, compiledEvent))
                throw new InvalidOperationException($"Event '{compiledEvent.Id}' is already registered.");

            if (!byAddress.TryAdd(compiledEvent.Address, compiledEvent))
                throw new InvalidOperationException($"Event '{compiledEvent.Address}' is already registered.");

            Add(byComponent, compiledEvent.Address.ComponentId, compiledEvent);
        }

        _eventsById = byId.ToFrozenDictionary();
        _eventsByAddress = byAddress.ToFrozenDictionary();
        _eventsByComponent = Freeze(byComponent);
    }

    /// <summary>
    /// Gets all registered events.
    /// </summary>
    public IReadOnlyList<CompiledUIEvent> All => _all;

    /// <summary>
    /// Gets events registered for the specified component.
    /// </summary>
    public IReadOnlyList<CompiledUIEvent> GetByComponent(UIComponentId componentId)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        return _eventsByComponent.TryGetValue(componentId, out CompiledUIEvent[]? events)
            ? events
            : Empty;
    }

    /// <summary>
    /// Attempts to get an event by id.
    /// </summary>
    public bool TryGet(UIEventId eventId, [NotNullWhen(true)] out CompiledUIEvent? compiledEvent)
        => eventId.IsEmpty
            ? throw new ArgumentException("Event id must not be empty.", nameof(eventId))
            : _eventsById.TryGetValue(eventId, out compiledEvent);

    /// <summary>
    /// Gets an event by id or throws when it is not registered.
    /// </summary>
    public CompiledUIEvent GetRequired(UIEventId eventId)
        => TryGet(eventId, out CompiledUIEvent? compiledEvent)
            ? compiledEvent
            : throw new InvalidOperationException($"Event '{eventId}' was not found.");

    /// <summary>
    /// Attempts to get an event by component event address.
    /// </summary>
    public bool TryGet(CompiledUIEventAddress address, [NotNullWhen(true)] out CompiledUIEvent? compiledEvent)
        => _eventsByAddress.TryGetValue(address, out compiledEvent);

    /// <summary>
    /// Gets an event by component event address or throws when it is not registered.
    /// </summary>
    public CompiledUIEvent GetRequired(CompiledUIEventAddress address)
        => TryGet(address, out CompiledUIEvent? compiledEvent)
            ? compiledEvent
            : throw new InvalidOperationException($"Event '{address}' was not found.");

    private static void Add<TKey>(Dictionary<TKey, List<CompiledUIEvent>> map, TKey key, CompiledUIEvent compiledEvent)
        where TKey : notnull
    {
        if (!map.TryGetValue(key, out List<CompiledUIEvent>? list))
        {
            list = [];
            map.Add(key, list);
        }

        list.Add(compiledEvent);
    }

    private static FrozenDictionary<TKey, CompiledUIEvent[]> Freeze<TKey>(Dictionary<TKey, List<CompiledUIEvent>> source)
        where TKey : notnull
    {
        Dictionary<TKey, CompiledUIEvent[]> result = new(source.Count);

        foreach (KeyValuePair<TKey, List<CompiledUIEvent>> pair in source)
            result.Add(pair.Key, [.. pair.Value]);

        return result.ToFrozenDictionary();
    }

    private static void ValidateEvent(CompiledUIEvent compiledEvent, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates)
    {
        ArgumentNullException.ThrowIfNull(compiledEvent);

        if (compiledEvent.Id.IsEmpty)
            throw new InvalidOperationException("Event id must not be empty.");

        ArgumentException.ThrowIfNullOrWhiteSpace(compiledEvent.Command);
        ArgumentNullException.ThrowIfNull(compiledEvent.Arguments);

        if (compiledEvent.Address.ComponentId.IsEmpty)
            throw new InvalidOperationException($"Event '{compiledEvent.Id}' has invalid component id.");

        ArgumentException.ThrowIfNullOrWhiteSpace(compiledEvent.Address.EventName);

        HashSet<string> argumentNames = new(StringComparer.Ordinal);

        for (var i = 0; i < compiledEvent.Arguments.Length; i++)
        {
            CompiledUIActionArgument argument = compiledEvent.Arguments[i];

            ValidateArgument(compiledEvent, argument, sources, templates);

            if (!argumentNames.Add(argument.Name))
                throw new InvalidOperationException($"Event '{compiledEvent.Id}' has duplicate argument '{argument.Name}'.");
        }
    }

    private static void ValidateArgument(CompiledUIEvent compiledEvent, CompiledUIActionArgument argument, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates)
    {
        ArgumentNullException.ThrowIfNull(argument);
        ArgumentException.ThrowIfNullOrWhiteSpace(argument.Name);

        switch (argument.Kind)
        {
            case CompiledUIActionArgumentKind.Literal:
                if (argument.SourceId is not null)
                    throw new InvalidOperationException($"Event '{compiledEvent.Id}' literal argument '{argument.Name}' must not specify source id.");

                if (argument.TemplateId is not null)
                    throw new InvalidOperationException($"Event '{compiledEvent.Id}' literal argument '{argument.Name}' must not specify template id.");

                if (argument.Parameters.Length != 0)
                    throw new InvalidOperationException($"Event '{compiledEvent.Id}' literal argument '{argument.Name}' must not specify parameters.");

                if (argument.DynamicParameterComponentIds.Length != 0)
                    throw new InvalidOperationException($"Event '{compiledEvent.Id}' literal argument '{argument.Name}' must not specify dynamic parameter ids.");

                break;

            case CompiledUIActionArgumentKind.CurrentItemKey:
                if (argument.Value is not null)
                    throw new InvalidOperationException($"Event '{compiledEvent.Id}' argument '{argument.Name}' must not specify literal value.");

                if (argument.SourceId is not null)
                    throw new InvalidOperationException($"Event '{compiledEvent.Id}' argument '{argument.Name}' must not specify source id.");

                if (argument.TemplateId is not null)
                    throw new InvalidOperationException($"Event '{compiledEvent.Id}' argument '{argument.Name}' must not specify template id.");

                if (argument.Parameters.Length != 0)
                    throw new InvalidOperationException($"Event '{compiledEvent.Id}' argument '{argument.Name}' must not specify parameters.");

                if (argument.DynamicParameterComponentIds.Length != 0)
                    throw new InvalidOperationException($"Event '{compiledEvent.Id}' argument '{argument.Name}' must not specify dynamic parameter ids.");

                break;

            case CompiledUIActionArgumentKind.Binding:
                {
                    if (argument.Value is not null)
                        throw new InvalidOperationException($"Event '{compiledEvent.Id}' binding argument '{argument.Name}' must not specify literal value.");

                    if (argument.SourceId is null || argument.SourceId.Value.IsEmpty)
                        throw new InvalidOperationException($"Event '{compiledEvent.Id}' binding argument '{argument.Name}' must specify source id.");

                    if (argument.TemplateId is null || argument.TemplateId.Value.IsEmpty)
                        throw new InvalidOperationException($"Event '{compiledEvent.Id}' binding argument '{argument.Name}' must specify template id.");

                    UIBindingSourceId sourceId = argument.SourceId.Value;
                    UIBindingTemplateId templateId = argument.TemplateId.Value;

                    _ = sources.GetRequired(sourceId);

                    CompiledUIBindingTemplate template = templates.GetRequired(templateId);

                    if (!template.SourceId.Equals(sourceId))
                        throw new InvalidOperationException($"Event '{compiledEvent.Id}' argument '{argument.Name}' source '{sourceId}' does not match template '{templateId}' source '{template.SourceId}'.");

                    var slotCount = CompiledUIBindingParameterResolver.CountSlots(argument.Parameters);

                    if (slotCount != template.ParameterCount)
                        throw new InvalidOperationException($"Event '{compiledEvent.Id}' argument '{argument.Name}' has {slotCount} parameters, but template '{template.Id}' expects {template.ParameterCount}.");

                    CompiledUIBindingParameterResolver.ValidateDynamicComponentIds(
                        $"Event '{compiledEvent.Id}' argument '{argument.Name}'",
                        argument.Parameters,
                        argument.DynamicParameterComponentIds);

                    break;
                }
            default:
                throw new UnreachableException();
        }
    }
}
