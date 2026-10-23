using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// An input that can offer a button emptying its value.
/// </summary>
public interface IClearableInputComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="ShowClearButton"/>.
    /// </summary>
    static UIProperty ShowClearButtonProperty { get; } = new(nameof(ShowClearButton));

    /// <summary>
    /// Gets or sets whether a button that empties the value is shown; it stays out of the tab order, and is gone while the field is
    /// empty, read-only or disabled.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    bool? ShowClearButton { get; set; }
}

/// <summary>
/// The setter <see cref="IClearableInputComponent"/> components share.
/// </summary>
public static class ClearableInputComponentExtensions
{
    /// <summary>
    /// Shows the button that empties the value.
    /// </summary>
    public static T SetShowClearButton<T>(this T component) where T : IClearableInputComponent
    {
        component.ShowClearButton = true;
        return component;
    }
}
