using System;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Defines how concurrent invocations of a UI command are handled.
/// </summary>
public enum UICommandConcurrencyMode
{
    /// <summary>
    /// Only one invocation of the command may run at a time.
    /// </summary>
    Exclusive = 0,

    /// <summary>
    /// The command may run concurrently with other invocations.
    /// </summary>
    Background = 1
}

/// <summary>
/// Marks a controller method as a UI command.
/// </summary>
[AttributeUsage(AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
public sealed class UICommandAttribute : Attribute
{
    /// <summary>
    /// Initializes the attribute with no external command name.
    /// </summary>
    public UICommandAttribute() { }

    /// <summary>
    /// Initializes the attribute with the external command name.
    /// </summary>
    public UICommandAttribute(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        Name = name;
    }

    /// <summary>
    /// Gets the external command name.
    /// </summary>
    public string? Name { get; }

    /// <summary>
    /// Gets or sets how concurrent command invocations are handled.
    /// </summary>
    public UICommandConcurrencyMode ConcurrencyMode { get; init; } = UICommandConcurrencyMode.Exclusive;
}
