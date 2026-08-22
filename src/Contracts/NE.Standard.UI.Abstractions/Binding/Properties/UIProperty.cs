using System;

namespace NE.Standard.UI.Abstractions.Binding.Properties;

/// <summary>
/// Represents a UI component property key.
/// </summary>
public readonly record struct UIProperty
{
    /// <summary>
    /// Creates a property key from its name.
    /// </summary>
    public UIProperty(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
    }

    /// <summary>
    /// Gets the property name.
    /// </summary>
    public string Name { get; }

    public override string ToString()
        => Name;
}
