using System;
using System.Collections.Generic;
using System.Diagnostics;
using NE.Standard.UI.Primitives.Recursive;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Represents a change reported by a recursively observed object graph.
/// </summary>
[DebuggerDisplay("{Kind}({Path}, Index = {Index}, Count = {Count}, OldIndex = {OldIndex})")]
public sealed class RecursiveChange
{
    private sealed class PrefixNode
    {
        private readonly RecursivePath? _path;
        private readonly PathSegment _segment;

        public PrefixNode(RecursivePath path, PrefixNode? next)
        {
            _path = path;
            Next = next;
            Count = path.Count;
        }

        public PrefixNode(PathSegment segment, PrefixNode? next)
        {
            _segment = segment;
            Next = next;
            Count = 1;
        }

        public PrefixNode? Next { get; }
        public int Count { get; }

        public void CopyTo(PathSegment[] destination, int index)
        {
            if (_path is not null)
            {
                for (var i = 0; i < _path.Count; i++)
                    destination[index + i] = _path[i];

                return;
            }

            destination[index] = _segment;
        }
    }

    private static readonly string[] EmptyItemIds = [];

    private readonly RecursivePath _localPath;
    private readonly PrefixNode? _prefix;

    private readonly string[] _itemIds;
    private readonly string[] _oldItemIds;

    /// <summary>
    /// Creates a change of the given kind for the given path.
    /// </summary>
    public RecursiveChange(RecursiveChangeKind kind, RecursivePath path, int index = -1, int count = 0, int oldIndex = -1)
        : this(kind, path, null, index, count, oldIndex, EmptyItemIds, EmptyItemIds)
    { }

    private RecursiveChange(RecursiveChangeKind kind, RecursivePath localPath, PrefixNode? prefix, int index, int count, int oldIndex, string[] itemIds, string[] oldItemIds)
    {
        ArgumentNullException.ThrowIfNull(localPath);
        ArgumentNullException.ThrowIfNull(itemIds);
        ArgumentNullException.ThrowIfNull(oldItemIds);

        Validate(kind, index, count, oldIndex, itemIds, oldItemIds);

        Kind = kind;

        _localPath = localPath;
        _prefix = prefix;

        Index = index;
        Count = count;
        OldIndex = oldIndex;

        _itemIds = itemIds.Length == 0 ? EmptyItemIds : [.. itemIds];
        _oldItemIds = oldItemIds.Length == 0 ? EmptyItemIds : [.. oldItemIds];
    }

    private static void Validate(RecursiveChangeKind kind, int index, int count, int oldIndex, string[] itemIds, string[] oldItemIds)
    {
        switch (kind)
        {
            case RecursiveChangeKind.Set:
            case RecursiveChangeKind.Reset:
                if (index != -1 || count != 0 || oldIndex != -1)
                    throw new ArgumentException("Set and Reset changes must not specify collection indices or counts.");

                if (itemIds.Length != 0 || oldItemIds.Length != 0)
                    throw new ArgumentException("Set and Reset changes must not specify collection item ids.");

                break;

            case RecursiveChangeKind.Add:
                ArgumentOutOfRangeException.ThrowIfNegative(index);
                ArgumentOutOfRangeException.ThrowIfNegativeOrZero(count);

                if (oldIndex != -1)
                    throw new ArgumentException("Add change must not specify oldIndex.");

                ValidateItemIds(count, itemIds, nameof(itemIds));
                ValidateNoItemIds(oldItemIds, nameof(oldItemIds), "Add change must not specify old item ids.");
                break;

            case RecursiveChangeKind.Remove:
                ArgumentOutOfRangeException.ThrowIfNegative(index);
                ArgumentOutOfRangeException.ThrowIfNegativeOrZero(count);

                if (oldIndex != -1)
                    throw new ArgumentException("Remove change must not specify oldIndex.");

                ValidateNoItemIds(itemIds, nameof(itemIds), "Remove change must not specify new item ids.");
                ValidateItemIds(count, oldItemIds, nameof(oldItemIds));
                break;

            case RecursiveChangeKind.Replace:
                ArgumentOutOfRangeException.ThrowIfNegative(index);
                ArgumentOutOfRangeException.ThrowIfNegativeOrZero(count);

                if (oldIndex != -1 && oldIndex != index)
                    throw new ArgumentException("Replace change must use oldIndex equal to index or -1.");

                ValidateItemIds(count, itemIds, nameof(itemIds));
                ValidateItemIds(count, oldItemIds, nameof(oldItemIds));
                break;

            case RecursiveChangeKind.Move:
                ArgumentOutOfRangeException.ThrowIfNegative(index);
                ArgumentOutOfRangeException.ThrowIfNegative(oldIndex);
                ArgumentOutOfRangeException.ThrowIfNegativeOrZero(count);

                ValidateItemIds(count, itemIds, nameof(itemIds));
                ValidateNoItemIds(oldItemIds, nameof(oldItemIds), "Move change must not specify old item ids.");
                break;

            default:
                throw new ArgumentOutOfRangeException(nameof(kind));
        }
    }

    private static void ValidateItemIds(int count, string[] itemIds, string parameterName)
    {
        if (itemIds.Length == 0)
            return;

        if (itemIds.Length != count)
            throw new ArgumentException("Collection item id count must match the changed item count.", parameterName);

        for (var i = 0; i < itemIds.Length; i++)
            ArgumentException.ThrowIfNullOrWhiteSpace(itemIds[i]);
    }

    private static void ValidateNoItemIds(string[] itemIds, string parameterName, string message)
    {
        if (itemIds.Length != 0)
            throw new ArgumentException(message, parameterName);
    }

    /// <summary>
    /// Gets the change kind.
    /// </summary>
    public RecursiveChangeKind Kind { get; }

    /// <summary>
    /// Gets the changed path.
    /// </summary>
    public RecursivePath Path => field ??= MaterializePath();

    /// <summary>
    /// Gets the collection index affected by the change, or -1 when not applicable.
    /// </summary>
    public int Index { get; }

    /// <summary>
    /// Gets the number of collection items affected by the change.
    /// </summary>
    public int Count { get; }

    /// <summary>
    /// Gets the previous collection index for move or replace changes, or -1 when not applicable.
    /// </summary>
    public int OldIndex { get; }

    /// <summary>
    /// Gets new item ids associated with the change, when available.
    /// </summary>
    public IReadOnlyList<string> ItemIds => _itemIds;

    /// <summary>
    /// Gets old item ids associated with the change, when available.
    /// </summary>
    public IReadOnlyList<string> OldItemIds => _oldItemIds;

    /// <summary>
    /// Gets whether the change includes new item ids.
    /// </summary>
    public bool HasItemIds => _itemIds.Length > 0;

    /// <summary>
    /// Gets whether the change includes old item ids.
    /// </summary>
    public bool HasOldItemIds => _oldItemIds.Length > 0;

    /// <summary>
    /// Creates a change reporting that the value at the given path was set.
    /// </summary>
    public static RecursiveChange Set(RecursivePath path)
        => new(RecursiveChangeKind.Set, path);

    /// <summary>
    /// Creates a change reporting that items were added to a collection at the given path.
    /// </summary>
    public static RecursiveChange Add(RecursivePath path, int index, int count, string[] itemIds)
        => new(RecursiveChangeKind.Add, path, prefix: null, index, count, oldIndex: -1, itemIds, oldItemIds: EmptyItemIds);

    /// <summary>
    /// Creates a change reporting that items were removed from a collection at the given path.
    /// </summary>
    public static RecursiveChange Remove(RecursivePath path, int index, int count, string[] oldItemIds)
        => new(RecursiveChangeKind.Remove, path, prefix: null, index, count, oldIndex: -1, itemIds: EmptyItemIds, oldItemIds);

    /// <summary>
    /// Creates a change reporting that items were replaced in a collection at the given path.
    /// </summary>
    public static RecursiveChange Replace(RecursivePath path, int index, int count, string[] oldItemIds, string[] itemIds)
        => new(RecursiveChangeKind.Replace, path, prefix: null, index, count, oldIndex: index, itemIds, oldItemIds);

    /// <summary>
    /// Creates a change reporting that an item was moved within a collection at the given path.
    /// </summary>
    public static RecursiveChange Move(RecursivePath path, int oldIndex, int newIndex, int count, string[] itemIds)
        => new(RecursiveChangeKind.Move, path, prefix: null, index: newIndex, count, oldIndex, itemIds, oldItemIds: EmptyItemIds);

    /// <summary>
    /// Creates a change reporting that the collection at the given path was reset.
    /// </summary>
    public static RecursiveChange Reset(RecursivePath path)
        => new(RecursiveChangeKind.Reset, path);

    /// <summary>
    /// Returns a change with the specified path prefix prepended.
    /// </summary>
    public RecursiveChange Prepend(RecursivePath prefix)
    {
        ArgumentNullException.ThrowIfNull(prefix);

        return prefix.Count == 0
            ? this
            : new RecursiveChange(Kind, _localPath, new PrefixNode(prefix, _prefix), Index, Count, OldIndex, _itemIds, _oldItemIds);
    }

    /// <summary>
    /// Returns a change with the specified path segment prepended.
    /// </summary>
    public RecursiveChange Prepend(PathSegment segment)
        => new(Kind, _localPath, new PrefixNode(segment, _prefix), Index, Count, OldIndex, _itemIds, _oldItemIds);

    private RecursivePath MaterializePath()
    {
        if (_prefix is null)
            return _localPath;

        var prefixSegmentCount = 0;

        for (PrefixNode? current = _prefix; current is not null; current = current.Next)
            prefixSegmentCount += current.Count;

        PathSegment[] segments = new PathSegment[prefixSegmentCount + _localPath.Count];

        var writeIndex = 0;

        for (PrefixNode? current = _prefix; current is not null; current = current.Next)
        {
            current.CopyTo(segments, writeIndex);
            writeIndex += current.Count;
        }

        for (var i = 0; i < _localPath.Count; i++)
            segments[writeIndex++] = _localPath[i];

        return new RecursivePath(segments, ownsArray: true);
    }
}
