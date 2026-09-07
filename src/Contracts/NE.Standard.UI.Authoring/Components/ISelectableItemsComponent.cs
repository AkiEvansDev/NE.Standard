using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents an items host whose rows the viewer can choose, one or many, and whose choice a controller can
/// read and drive.
/// </summary>
public interface ISelectableItemsComponent : IItemsComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="SelectionMode"/>.
    /// </summary>
    static UIProperty SelectionModeProperty { get; } = new UIProperty(nameof(SelectionMode));

    /// <summary>
    /// Gets the registered property key for <see cref="SelectedKey"/>.
    /// </summary>
    static UIProperty SelectedKeyProperty { get; } = new UIProperty(nameof(SelectedKey));

    /// <summary>
    /// Gets the registered property key for <see cref="SelectedKeys"/>.
    /// </summary>
    static UIProperty SelectedKeysProperty { get; } = new UIProperty(nameof(SelectedKeys));

    /// <summary>
    /// Gets how many rows may be chosen at once.
    /// </summary>
    [UIComponentProperty(DefaultValue = UISelectionMode.None)]
    UISelectionMode? SelectionMode { get; }

    /// <summary>
    /// Gets the key of the chosen row under <see cref="UISelectionMode.One"/>.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    string? SelectedKey { get; }

    /// <summary>
    /// Gets the keys of the chosen rows under <see cref="UISelectionMode.Many"/>, in the order they were
    /// chosen.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    IReadOnlyList<string>? SelectedKeys { get; }
}
