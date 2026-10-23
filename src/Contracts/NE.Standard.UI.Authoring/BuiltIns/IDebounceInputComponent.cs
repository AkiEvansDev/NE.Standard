using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A component that commits some time after the viewer stops interacting with it.
/// </summary>
public interface IDebounceInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="DebounceMilliseconds"/>.
    /// </summary>
    static UIProperty DebounceMillisecondsProperty { get; } = new(nameof(DebounceMilliseconds));

    /// <summary>
    /// Gets or sets how long after the viewer stops typing the value is committed, in milliseconds; unset, a field commits as it is
    /// left (or on Enter), and a search asks after its own short pause.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
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
