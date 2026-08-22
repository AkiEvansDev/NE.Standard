using System;

namespace NE.Standard.UI.Abstractions.Data;

/// <summary>
/// Defines what a requested window of items is positioned against.
/// </summary>
public enum UIItemAnchorKind
{
    /// <summary>
    /// The first items the source has.
    /// </summary>
    Start = 0,

    /// <summary>
    /// The last items the source has.
    /// </summary>
    End = 1,

    /// <summary>
    /// The items starting at an absolute offset.
    /// </summary>
    Offset = 2,

    /// <summary>
    /// The items immediately before a known item.
    /// </summary>
    Before = 3,

    /// <summary>
    /// The items immediately after a known item.
    /// </summary>
    After = 4
}

/// <summary>
/// Positions a requested window of items, either at an absolute offset or against an item the client already
/// holds.
/// </summary>
/// <remarks>
/// Both forms exist because neither covers the other. A data grid needs the offset: its scrollbar is
/// proportional and it jumps into the middle of a million rows. A chat cannot use one at all — its items have
/// no stable position, since a message prepended at the top shifts every index below it — and asks for
/// "the thirty before this one" instead.
/// </remarks>
public readonly record struct UIItemAnchor
{
    private UIItemAnchor(UIItemAnchorKind kind, int offset, string? key)
    {
        Kind = kind;
        Offset = offset;
        Key = key;
    }

    /// <summary>
    /// Anchors the window at the first items of the source.
    /// </summary>
    public static UIItemAnchor Start { get; } = new(UIItemAnchorKind.Start, 0, null);

    /// <summary>
    /// Anchors the window at the last items of the source.
    /// </summary>
    public static UIItemAnchor End { get; } = new(UIItemAnchorKind.End, 0, null);

    /// <summary>
    /// Anchors the window at an absolute item offset.
    /// </summary>
    public static UIItemAnchor At(int offset)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(offset);

        return new(UIItemAnchorKind.Offset, offset, null);
    }

    /// <summary>
    /// Anchors the window immediately before the item with the given key.
    /// </summary>
    public static UIItemAnchor Before(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return new(UIItemAnchorKind.Before, 0, key);
    }

    /// <summary>
    /// Anchors the window immediately after the item with the given key.
    /// </summary>
    public static UIItemAnchor After(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return new(UIItemAnchorKind.After, 0, key);
    }

    /// <summary>
    /// Gets what the window is positioned against.
    /// </summary>
    public UIItemAnchorKind Kind { get; }

    /// <summary>
    /// Gets the absolute offset, for an <see cref="UIItemAnchorKind.Offset"/> anchor.
    /// </summary>
    public int Offset { get; }

    /// <summary>
    /// Gets the item key, for a <see cref="UIItemAnchorKind.Before"/> or <see cref="UIItemAnchorKind.After"/> anchor.
    /// </summary>
    public string? Key { get; }

    /// <inheritdoc />
    public override string ToString()
        => Kind switch
        {
            UIItemAnchorKind.Offset => $"{Kind}({Offset})",
            UIItemAnchorKind.Before or UIItemAnchorKind.After => $"{Kind}('{Key}')",
            _ => Kind.ToString()
        };
}
