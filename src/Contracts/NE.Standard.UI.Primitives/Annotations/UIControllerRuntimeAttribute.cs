using System;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Defines how controller changes are propagated to the UI runtime.
/// </summary>
public enum UIControllerUpdateMode
{
    /// <summary>
    /// Updates are accumulated and flushed to the client on an interval.
    /// </summary>
    Batch = 0,

    /// <summary>
    /// Updates are flushed to the client immediately as they occur.
    /// </summary>
    Direct = 1
}

/// <summary>
/// Configures runtime update behavior for a UI controller.
/// </summary>
[AttributeUsage(AttributeTargets.Class, Inherited = true, AllowMultiple = false)]
public sealed class UIControllerRuntimeAttribute : Attribute
{
    /// <summary>
    /// Gets or sets how controller updates are flushed to the client.
    /// </summary>
    public UIControllerUpdateMode UpdateMode { get; init; } = UIControllerUpdateMode.Batch;

    /// <summary>
    /// Gets or sets the flush interval in milliseconds, or a negative value to use the runtime default.
    /// </summary>
    public int FlushIntervalMilliseconds { get; init; } = 50;
}
