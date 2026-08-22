using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Base type for objects that expose recursive path access and change notifications.
/// </summary>
public abstract class RecursiveObservable
{
    private sealed class PropertyForwarder(RecursiveObservable owner, PathSegment segment)
    {
        private readonly RecursiveObservable _owner = owner;
        private readonly PathSegment _segment = segment;

        public void Notify(RecursiveChange change)
            => _owner.Notify(change.Prepend(_segment));
    }

    private readonly Dictionary<PathSegment, PropertyForwarder> _propertyForwarders = [];
    private Action<RecursiveChange>? _notifier;
    private WeakReference<RecursiveObservable>? _owner;

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
    /// Gets a value by recursive path.
    /// </summary>
    /// <exception cref="InvalidOperationException">
    /// The path cannot be resolved on this object.
    /// </exception>
    public object? GetRecursiveValue(string path)
        => GetRecursiveValue(RecursivePath.Parse(path));

    /// <summary>
    /// Gets a value by recursive path.
    /// </summary>
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

    /// <summary>
    /// Sets a value by recursive path.
    /// </summary>
    /// <exception cref="InvalidOperationException">
    /// The path cannot be set on this object.
    /// </exception>
    public void SetRecursiveValue(string path, object? value)
        => SetRecursiveValue(RecursivePath.Parse(path), value);

    /// <summary>
    /// Sets a value by recursive path.
    /// </summary>
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
    /// Attaches this object to a recursive owner.
    /// </summary>
    protected internal void AttachOwner(RecursiveObservable owner)
    {
        ArgumentNullException.ThrowIfNull(owner);

        if (_owner?.TryGetTarget(out RecursiveObservable? existing) == true && !ReferenceEquals(existing, owner))
            throw new InvalidOperationException("Recursive nodes must belong to a single owner. Shared nodes are not supported.");

        _owner = new WeakReference<RecursiveObservable>(owner);
    }

    /// <summary>
    /// Detaches this object from the specified recursive owner.
    /// </summary>
    protected internal void DetachOwner(RecursiveObservable owner)
    {
        if (_owner?.TryGetTarget(out RecursiveObservable? existing) == true && ReferenceEquals(existing, owner))
            _owner = null;
    }

    /// <summary>
    /// Sets a recursive child property and emits a change when the value changes.
    /// </summary>
    protected bool SetRecursiveProperty<T>(ref T field, T value, PathSegment segment)
    {
        if (EqualityComparer<T>.Default.Equals(field, value))
            return false;

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

        child.AttachOwner(this);

        PropertyForwarder forwarder = GetOrCreatePropertyForwarder(segment);

        child.SetNotifier(forwarder.Notify, visited);
    }

    private PropertyForwarder GetOrCreatePropertyForwarder(PathSegment segment)
    {
        if (_propertyForwarders.TryGetValue(segment, out PropertyForwarder? forwarder))
            return forwarder;

        forwarder = new PropertyForwarder(this, segment);
        _propertyForwarders.Add(segment, forwarder);

        return forwarder;
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
