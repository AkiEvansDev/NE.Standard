using System;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Defines how concurrent invocations of a UI command are handled.
/// </summary>
public enum UICommandConcurrencyMode
{
    /// <summary>
    /// One exclusive command of the runtime runs at a time, whichever command it is; background commands and value writes go on beside it.
    /// </summary>
    Exclusive = 0,

    /// <summary>
    /// The command runs beside the exclusive command in progress and other background commands, and lets go of its tab at once.
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
    /// Gets the command's name as the client calls it; unset, the method's own name is used instead.
    /// </summary>
    public string? Name { get; }

    /// <summary>
    /// Gets or sets how concurrent command invocations are handled.
    /// </summary>
    public UICommandConcurrencyMode ConcurrencyMode { get; init; } = UICommandConcurrencyMode.Exclusive;

    /// <summary>
    /// Gets or sets how many runs of a <see cref="UICommandConcurrencyMode.Background"/> command one runtime may have under way at
    /// once; a press past it is refused. One by default: a second run of an export or a query beside the first is one nobody asked for.
    /// </summary>
    /// <remarks>Held on the server, whatever the page sends; an exclusive command already runs one at a time.</remarks>
    public int MaxConcurrent { get; init; } = 1;
}
