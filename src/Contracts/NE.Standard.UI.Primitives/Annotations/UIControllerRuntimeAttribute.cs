using System;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Configures how often a UI controller's changes are flushed to its pages.
/// </summary>
[AttributeUsage(AttributeTargets.Class, Inherited = true, AllowMultiple = false)]
public sealed class UIControllerRuntimeAttribute : Attribute
{
    /// <summary>
    /// Gets or sets the flush interval in milliseconds, or -1 (the default) to use the application's flush interval.
    /// </summary>
    public int FlushIntervalMilliseconds { get; init; } = -1;
}
