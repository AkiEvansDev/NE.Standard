using System;

namespace NE.Standard.UI.Abstractions.Interaction;

/// <summary>
/// Represents a UI event handler mapped to an action.
/// </summary>
public readonly record struct UIEvent
{
    /// <summary>
    /// Creates an event mapping the given event name to the given action.
    /// </summary>
    public UIEvent(string name, UIAction action)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentNullException.ThrowIfNull(action);

        Name = name;
        Action = action;
    }

    /// <summary>
    /// Gets the UI event name.
    /// </summary>
    public string Name { get; }

    /// <summary>
    /// Gets the action invoked by the event.
    /// </summary>
    public UIAction Action { get; }

    public override string ToString()
        => $"{Name}>{Action}";
}
