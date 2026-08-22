using System;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Identifies an event on a compiled component.
/// </summary>
public readonly record struct CompiledUIEventAddress
{
    /// <summary>
    /// Creates an event address from a component id and event name.
    /// </summary>
    public CompiledUIEventAddress(UIComponentId componentId, string eventName)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        ArgumentException.ThrowIfNullOrWhiteSpace(eventName);

        ComponentId = componentId;
        EventName = eventName;
    }

    /// <summary>
    /// Gets the component id that owns the event.
    /// </summary>
    public UIComponentId ComponentId { get; }

    /// <summary>
    /// Gets the event name.
    /// </summary>
    public string EventName { get; }

    public override string ToString()
        => $"{ComponentId}.{EventName}";
}
