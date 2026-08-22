using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents an items component whose items come from a windowed source rather than from a collection the
/// server holds whole — the client asks for the part it can show and the source answers.
/// </summary>
public interface ISourceItemsComponent : IItemsComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="IsWindowed"/>.
    /// </summary>
    static UIProperty IsWindowedProperty { get; } = new(nameof(IsWindowed));

    /// <summary>
    /// Gets the registered property key for <see cref="WindowSize"/>.
    /// </summary>
    static UIProperty WindowSizeProperty { get; } = new(nameof(WindowSize));

    /// <summary>
    /// Gets whether the component's items are bound to a source. Set by binding one, never by the author.
    /// </summary>
    bool IsWindowed { get; }

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
    /// Gets where the realized window starts, as the source last reported it.
    /// </summary>
    /// <remarks>
    /// This and the three below are the window's geometry, and they are <em>bound by the compiler</em>, never
    /// by the author: the client needs them to size a scrollbar over items it does not hold, and they live on
    /// the source, which the client cannot see. Binding one by hand is refused.
    /// </remarks>
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
