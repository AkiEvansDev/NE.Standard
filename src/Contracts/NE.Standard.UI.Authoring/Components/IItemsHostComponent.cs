using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Items;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents an items host that says how it holds its rows: whole, virtualized, or windowed from a source.
/// </summary>
public interface IItemsHostComponent : IItemsComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="HostMode"/>.
    /// </summary>
    static UIProperty HostModeProperty { get; } = new(nameof(HostMode));

    /// <summary>
    /// Gets the registered property key for <see cref="WindowSize"/>.
    /// </summary>
    static UIProperty WindowSizeProperty { get; } = new(nameof(WindowSize));

    /// <summary>
    /// Gets how the host holds its rows. Set by <c>Virtualized()</c> or by binding a source, never directly.
    /// </summary>
    UIItemsHostMode HostMode { get; }

    /// <summary>
    /// Gets how many items one window holds.
    /// </summary>
    int WindowSize { get; }

    /// <summary>
    /// Gets the registered property key for <see cref="WindowOffset"/>.
    /// </summary>
    static UIProperty WindowOffsetProperty { get; } = new(nameof(WindowOffset));

    /// <summary>
    /// Gets the registered property key for <see cref="WindowTotalCount"/>.
    /// </summary>
    static UIProperty WindowTotalCountProperty { get; } = new(nameof(WindowTotalCount));

    /// <summary>
    /// Gets the registered property key for <see cref="WindowHasMoreBefore"/>.
    /// </summary>
    static UIProperty WindowHasMoreBeforeProperty { get; } = new(nameof(WindowHasMoreBefore));

    /// <summary>
    /// Gets the registered property key for <see cref="WindowHasMoreAfter"/>.
    /// </summary>
    static UIProperty WindowHasMoreAfterProperty { get; } = new(nameof(WindowHasMoreAfter));

    /// <summary>
    /// Gets where the realized window starts, as the source last reported it. This and the three below are
    /// bound by the compiler only; binding one by hand is refused.
    /// </summary>
    int? WindowOffset { get; }

    /// <summary>
    /// Gets how many items the source holds, as it last reported.
    /// </summary>
    int? WindowTotalCount { get; }

    /// <summary>
    /// Gets whether the source has items before the realized window.
    /// </summary>
    bool WindowHasMoreBefore { get; }

    /// <summary>
    /// Gets whether the source has items after the realized window.
    /// </summary>
    bool WindowHasMoreAfter { get; }
}
