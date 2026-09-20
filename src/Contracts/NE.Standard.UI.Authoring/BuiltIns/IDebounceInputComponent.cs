using System;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A component that commits some time after the viewer stops interacting with it.
/// </summary>
public interface IDebounceInputComponent
{
    /// <summary>
    /// Gets or sets the debounce delay, in milliseconds.
    /// </summary>
    int? DebounceMilliseconds { get; set; }
}

/// <summary>
/// The validated setter <see cref="IDebounceInputComponent"/> components share.
/// </summary>
public static class DebounceInputComponentExtensions
{
    /// <summary>
    /// Sets the debounce delay, in milliseconds.
    /// </summary>
    public static T SetDebounceMilliseconds<T>(this T component, int debounceMilliseconds) where T : IDebounceInputComponent
    {
        ArgumentOutOfRangeException.ThrowIfNegative(debounceMilliseconds);

        component.DebounceMilliseconds = debounceMilliseconds;
        return component;
    }
}
