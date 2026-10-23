using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component one part of which is the chosen one by its key — a row, a segment, a tab — which the reader's press writes back.
/// </summary>
public interface ISelectedKeyComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="SelectedKey"/>.
    /// </summary>
    static UIProperty SelectedKeyProperty { get; } = new UIProperty(nameof(SelectedKey));

    /// <summary>
    /// Gets the key of the chosen part — a host's row under <see cref="Primitives.Styling.UISelectionMode.One"/>, a strip's segment, the
    /// tab shown; two-way, so the reader's choice writes the new key back.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    string? SelectedKey { get; }
}
