using System;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Shell.Data;

/// <summary>
/// Represents a client asking a windowed items host for the part of its source it can show.
/// </summary>
/// <remarks>
/// Its own request rather than a client update: reading a window runs the author's code and awaits it, and
/// the change-set path applies its updates under a lock it cannot release.
/// </remarks>
public sealed class UIItemWindowClientRequest
{
    /// <summary>
    /// The largest window a client may ask for at once, however it was reached — a viewport measurement gone
    /// wrong should cost one refusal, not a source reading a million rows.
    /// </summary>
    public const int MaxCount = 1000;

    /// <summary>
    /// Gets the windowed component asking.
    /// </summary>
    public required UIComponentId ComponentId { get; init; }

    /// <summary>
    /// Gets the dynamic parameters addressing the component instance, for a host inside a template.
    /// </summary>
    public object?[] DynamicParameters { get; init; } = [];

    /// <summary>
    /// Gets what the window is positioned against.
    /// </summary>
    public required UIItemAnchor Anchor { get; init; }

    /// <summary>
    /// Gets how many items are wanted.
    /// </summary>
    public required int Count { get; init; }

    /// <summary>
    /// Gets what the read does to the window already realized.
    /// </summary>
    public UIItemWindowMode Mode { get; init; } = UIItemWindowMode.Replace;

    /// <summary>
    /// Validates the window request.
    /// </summary>
    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Component id must not be empty.");

        ArgumentNullException.ThrowIfNull(DynamicParameters);

        if (Count is <= 0 or > MaxCount)
            throw new ArgumentOutOfRangeException(nameof(Count), Count, $"Window count must be between 1 and {MaxCount}.");

        if (Anchor.Kind is UIItemAnchorKind.Before or UIItemAnchorKind.After)
            ArgumentException.ThrowIfNullOrWhiteSpace(Anchor.Key, nameof(Anchor));

        if (Anchor.Kind == UIItemAnchorKind.Offset && Anchor.Offset < 0)
            throw new ArgumentOutOfRangeException(nameof(Anchor), Anchor.Offset, "Window offset cannot be negative.");
    }
}
