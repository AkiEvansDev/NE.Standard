using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Base type for objects that expose recursive path access and change notifications.
/// </summary>
public abstract class RecursiveObservable
{
    private sealed class PropertyForwarder
    {
        private readonly RecursiveObservable _owner;

        public PropertyForwarder(RecursiveObservable owner, PathSegment segment)
        {
            _owner = owner;
            Segment = segment;
            Notify = Forward;
        }

        /// <summary>The callback a child is handed, made once so a re-propagation allocates no delegate.</summary>
        public Action<RecursiveChange> Notify { get; }

        /// <summary>The property the child stands in.</summary>
        public PathSegment Segment { get; }

        private void Forward(RecursiveChange change)
            => _owner.Notify(change.Prepend(Segment));
    }

    // How far up a refusal names the places it compares; an owner chain is a tree, so this only keeps a broken one from hanging it.
    private const int MaxDescribedSteps = 32;

    private readonly Dictionary<PathSegment, PropertyForwarder> _propertyForwarders = [];
    private Action<RecursiveChange>? _notifier;

    // Strong on purpose: the notifier this node is handed already holds its owner, so a weak reference would only cost a handle.
    private RecursiveObservable? _owner;

    // Which place under the owner holds this node — a property's forwarder, or the collection itself for an item.
    private object? _ownerSlot;

    /// <summary>
    /// Attempts to get a value by recursive path.
    /// </summary>
    public bool TryGetRecursiveValue(string path, out object? value)
        => TryGetRecursiveValue(RecursivePath.Parse(path), out value);

    /// <summary>
    /// Attempts to get a value by recursive path.
    /// </summary>
    public bool TryGetRecursiveValue(RecursivePath path, out object? value)
    {
        ArgumentNullException.ThrowIfNull(path);

        return TryGetValueCore(path.AsSpan(), 0, out value);
    }

    /// <summary>
    /// Attempts to get the value one segment below this object, without a path of its own.
    /// </summary>
    public bool TryGetRecursiveValue(PathSegment segment, out object? value)
        => TryGetValueCore(new ReadOnlySpan<PathSegment>(in segment), 0, out value);

    /// <summary>Gets a value by recursive path.</summary>
    /// <exception cref="InvalidOperationException">
    /// The path cannot be resolved on this object.
    /// </exception>
    public object? GetRecursiveValue(string path)
        => GetRecursiveValue(RecursivePath.Parse(path));

    /// <summary>Gets a value by recursive path.</summary>
    /// <exception cref="InvalidOperationException">
    /// The path cannot be resolved on this object.
    /// </exception>
    public object? GetRecursiveValue(RecursivePath path)
    {
        ArgumentNullException.ThrowIfNull(path);

        return TryGetRecursiveValue(path, out var value)
            ? value
            : throw new InvalidOperationException($"Failed to resolve path '{path}' on type '{GetType().Name}'.");
    }

    /// <summary>
    /// Attempts to set a value by recursive path.
    /// </summary>
    public bool TrySetRecursiveValue(string path, object? value)
        => TrySetRecursiveValue(RecursivePath.Parse(path), value);

    /// <summary>
    /// Attempts to set a value by recursive path.
    /// </summary>
    public bool TrySetRecursiveValue(RecursivePath path, object? value)
    {
        ArgumentNullException.ThrowIfNull(path);

        return TrySetValueCore(path.AsSpan(), 0, value);
    }

    /// <summary>Sets a value by recursive path.</summary>
    /// <exception cref="InvalidOperationException">
    /// The path cannot be set on this object.
    /// </exception>
    public void SetRecursiveValue(string path, object? value)
        => SetRecursiveValue(RecursivePath.Parse(path), value);

    /// <summary>Sets a value by recursive path.</summary>
    /// <exception cref="InvalidOperationException">
    /// The path cannot be set on this object.
    /// </exception>
    public void SetRecursiveValue(RecursivePath path, object? value)
    {
        ArgumentNullException.ThrowIfNull(path);

        if (!TrySetRecursiveValue(path, value))
            throw new InvalidOperationException($"Failed to set path '{path}' on type '{GetType().Name}'.");
    }

    /// <summary>
    /// Resets this object's notifier to the default local notification handler.
    /// </summary>
    protected internal virtual void ResetNotifier(HashSet<RecursiveObservable>? visited = null)
        => SetNotifier(OnNotify, visited);

    /// <summary>
    /// Sets the notification callback for this object and its recursive children.
    /// </summary>
    protected internal virtual void SetNotifier(Action<RecursiveChange> notify, HashSet<RecursiveObservable>? visited = null)
    {
        ArgumentNullException.ThrowIfNull(notify);

        visited ??= new HashSet<RecursiveObservable>(ReferenceEqualityComparer.Instance);

        if (!visited.Add(this))
            return;

        _notifier = notify;

        PropagateNotifier(visited);
    }

    /// <summary>
    /// Propagates the current notifier to recursive child objects.
    /// </summary>
    protected internal virtual void PropagateNotifier(HashSet<RecursiveObservable> visited) { }

    /// <summary>
    /// Throws when this object may not be attached to <paramref name="owner"/> at <paramref name="slot"/>: it already belongs to
    /// another owner, or to this one in another place.
    /// </summary>
    /// <remarks>Called before anything changes, so a refused attach changes nothing.</remarks>
    protected internal void EnsureCanAttach(RecursiveObservable owner, object slot)
    {
        ArgumentNullException.ThrowIfNull(owner);
        ArgumentNullException.ThrowIfNull(slot);

        if (_owner is null || (ReferenceEquals(_owner, owner) && ReferenceEquals(_ownerSlot, slot)))
            return;

        throw new InvalidOperationException(
            $"A {GetType().Name} cannot be held in two places: it stands at {DescribePlace(_owner, _ownerSlot!)} and is being put at " +
            $"{DescribePlace(owner, slot)}. Shared nodes are not supported; give each place its own instance. A closed list of options " +
            "belongs on the view (SetOptions), where one list is shared freely by every select and every page.");
    }

    // Only on a refusal, so an ordinary attach pays nothing for it: the path from the root to the place, and the root's type. A row
    // is named by its key as a path writes one, escaped; an unkeyed row by "[]", since its index would mean reading its list under
    // that list's lock from inside another's.
    private string DescribePlace(RecursiveObservable owner, object slot)
    {
        List<string> steps = [];
        RecursiveObservable node = this;
        RecursiveObservable? current = owner;
        var place = slot;

        while (current is not null && steps.Count < MaxDescribedSteps)
        {
            steps.Add(place is PropertyForwarder forwarder ? $".{forwarder.Segment}" : node is IBindableItem { Id.Length: > 0 } item ? PathSegment.WithKey(item.Id).ToString() : "[]");
            node = current;
            place = current._ownerSlot;
            current = current._owner;
        }

        steps.Reverse();

        return $"'{string.Concat(steps).TrimStart('.')}' on {node.GetType().Name}";
    }

    /// <summary>
    /// Attaches this object to a recursive owner at the given place; attaching it where it already is does nothing.
    /// </summary>
    protected internal void AttachOwner(RecursiveObservable owner, object slot)
    {
        if (ReferenceEquals(_owner, owner) && ReferenceEquals(_ownerSlot, slot))
            return;

        EnsureCanAttach(owner, slot);

        _owner = owner;
        _ownerSlot = slot;
    }

    /// <summary>
    /// Detaches this object from the specified recursive owner.
    /// </summary>
    protected internal void DetachOwner(RecursiveObservable owner)
    {
        if (!ReferenceEquals(_owner, owner))
            return;

        _owner = null;
        _ownerSlot = null;
    }

    /// <summary>
    /// Sets a recursive child property and emits a change when the value changes.
    /// </summary>
    protected bool SetRecursiveProperty<T>(ref T field, T value, PathSegment segment)
    {
        if (EqualityComparer<T>.Default.Equals(field, value))
            return false;

        // Checked before the old child lets go, so a node that belongs elsewhere leaves the property as it was.
        if (value is RecursiveObservable candidate)
            candidate.EnsureCanAttach(this, GetOrCreatePropertyForwarder(segment));

        if (field is RecursiveObservable oldChild)
        {
            oldChild.DetachOwner(this);
            oldChild.ResetNotifier();
        }

        field = value;

        if (value is RecursiveObservable newChild)
            AttachChild(segment, newChild, visited: null);

        Notify(RecursiveChange.Set(RecursivePath.Empty.Append(segment)));

        return true;
    }

    private PropertyForwarder GetOrCreatePropertyForwarder(PathSegment segment)
    {
        // Locked: background commands and client writes can touch this dictionary from different threads; unsynchronized, it can
        // corrupt into a lookup that never returns.
        lock (_propertyForwarders)
        {
            if (_propertyForwarders.TryGetValue(segment, out PropertyForwarder? forwarder))
                return forwarder;

            forwarder = new PropertyForwarder(this, segment);
            _propertyForwarders.Add(segment, forwarder);

            return forwarder;
        }
    }

    /// <summary>
    /// Emits a set change for a recursive property.
    /// </summary>
    protected void NotifyPropertyChanged(PathSegment segment)
        => Notify(RecursiveChange.Set(RecursivePath.Empty.Append(segment)));

    /// <summary>
    /// Attaches a recursive child and forwards its notifications through the specified segment.
    /// </summary>
    protected internal void AttachChild(PathSegment segment, RecursiveObservable child, HashSet<RecursiveObservable>? visited)
    {
        ArgumentNullException.ThrowIfNull(child);

        PropertyForwarder forwarder = GetOrCreatePropertyForwarder(segment);

        child.AttachOwner(this, forwarder);
        child.SetNotifier(forwarder.Notify, visited);
    }

    /// <summary>
    /// Emits or forwards a recursive change.
    /// </summary>
    protected internal void Notify(RecursiveChange change)
    {
        ArgumentNullException.ThrowIfNull(change);

        if (_notifier is not null)
        {
            _notifier(change);
            return;
        }

        OnNotify(change);
    }

    /// <summary>
    /// Handles a recursive change when no external notifier is installed.
    /// </summary>
    protected virtual void OnNotify(RecursiveChange change) { }

    /// <summary>
    /// Attempts to resolve a value from a recursive path segment span.
    /// </summary>
    protected internal virtual bool TryGetValueCore(ReadOnlySpan<PathSegment> segments, int offset, out object? value)
    {
        if (offset == segments.Length)
        {
            value = this;
            return true;
        }

        value = null;
        return false;
    }

    /// <summary>
    /// Attempts to set a value from a recursive path segment span.
    /// </summary>
    protected internal virtual bool TrySetValueCore(ReadOnlySpan<PathSegment> segments, int offset, object? value)
        => false;

    /// <summary>
    /// Attempts to resolve a nested value on another recursive observable.
    /// </summary>
    protected static bool TryGetNestedValue(RecursiveObservable target, ReadOnlySpan<PathSegment> segments, int offset, out object? value)
    {
        ArgumentNullException.ThrowIfNull(target);
        return target.TryGetValueCore(segments, offset, out value);
    }

    /// <summary>
    /// Attempts to set a nested value on another recursive observable.
    /// </summary>
    protected static bool TrySetNestedValue(RecursiveObservable target, ReadOnlySpan<PathSegment> segments, int offset, object? value)
    {
        ArgumentNullException.ThrowIfNull(target);
        return target.TrySetValueCore(segments, offset, value);
    }
}
