using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents an input that shows a hint where its value would be, for as long as it has none.
/// </summary>
public interface IPlaceholderInputComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Placeholder"/>.
    /// </summary>
    static UIProperty PlaceholderProperty { get; } = new(nameof(Placeholder));

    /// <summary>
    /// Gets the hint shown while the input has no value.
    /// </summary>
    string? Placeholder { get; }
}
