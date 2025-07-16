using CommunityToolkit.Mvvm.ComponentModel;
using NE.Standard.Extensions;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

namespace NE.Standard.Types
{
    /// <summary>
    /// Provides recursive property change tracking by automatically wiring and propagating change notifications
    /// through nested <see cref="RecursiveObservable"/> instances.
    /// </summary>
    public class RecursiveObservable : ObservableObject
    {
        private static readonly ConcurrentDictionary<Type, Dictionary<string, PropertyInfo>> _typeCache = new ConcurrentDictionary<Type, Dictionary<string, PropertyInfo>>();
        private readonly Type _type;

        private WeakAction<RecursiveChangedEventArgs>? _notifier;
        private string _prefix = "";

        /// <summary>
        /// Initializes a new instance of the <see cref="RecursiveObservable"/> class.
        /// Caches observable properties using reflection for efficient traversal.
        /// </summary>
        public RecursiveObservable()
        {
            _type = GetType();
            _typeCache.GetOrAdd(_type, t => t.GetFieldsWithAttribute<ObservablePropertyAttribute>()
                .Select(f => new
                {
                    Property = t.GetProperty(GetPropertyNameFromField(f), ReflectionExtensions.Flags)
                })
                .Where(x => x.Property != null)
                .ToDictionary(x => x.Property!.Name, x => x.Property!)
            );

            ResetNotifier();
        }

        private static string GetPropertyNameFromField(FieldInfo field)
        {
            var name = field.Name;

            if (name.StartsWith("_"))
                name = name[1..];

            return name.UpFirst();
        }

        /// <summary>
        /// Resets the change notification delegate and re-propagates it through child observables.
        /// </summary>
        /// <param name="visited">Used to track visited nodes and prevent recursion loops.</param>
        protected internal virtual void ResetNotifier(HashSet<RecursiveObservable>? visited = null)
        {
            SetNotifier(OnNotify, visited: visited);
        }

        /// <summary>
        /// Sets the recursive notifier callback and updates child <see cref="RecursiveObservable"/> instances.
        /// </summary>
        /// <param name="notify">The notification delegate to propagate.</param>
        /// <param name="prefix">Optional path prefix for this object within the structure.</param>
        /// <param name="visited">Used to track visited nodes and prevent recursion loops.</param>
        protected internal virtual void SetNotifier(Action<RecursiveChangedEventArgs> notify, string? prefix = null, HashSet<RecursiveObservable>? visited = null)
        {
            if (visited == null || visited.Add(this))
            {
                _notifier = new WeakAction<RecursiveChangedEventArgs>(notify);
                _prefix = prefix ?? "";

                PropagateNotifier(
                    notify,
                    visited ?? new HashSet<RecursiveObservable>(ReferenceComparer<RecursiveObservable>.Instance)
                    {
                        this
                    }
                );
            }
        }

        /// <summary>
        /// Propagates the notifier to all child <see cref="RecursiveObservable"/> instances.
        /// </summary>
        /// <param name="notify">The notification callback.</param>
        /// <param name="visited">The set of already visited nodes.</param>
        protected internal virtual void PropagateNotifier(Action<RecursiveChangedEventArgs> notify, HashSet<RecursiveObservable> visited)
        {
            foreach (var prop in _typeCache[_type].Values)
            {
                if (prop.GetValue(this) is RecursiveObservable ro && visited.Add(ro))
                    ro.SetNotifier(notify, BuildPath(prop.Name), visited);
            }
        }

        /// <summary>
        /// Retrieves the value located at the specified dot-separated path within the object graph.
        /// </summary>
        /// <param name="path">Dot-separated path (e.g. "Parent.Child.Property").</param>
        /// <returns>The object found at the path, or throws if unresolved.</returns>
        public virtual object? GetValue(string path)
        {
            if (path.IsNull())
                return this;

            SplitPath(path, out var head, out var tail);

            if (!_typeCache[_type].TryGetValue(head, out var prop))
                throw new ArgumentException($"Property '{head}' not found on type '{_type.Name}'.");

            var value = prop.GetValue(this);
            return tail == null ? value : (value as RecursiveObservable)?.GetValue(tail);
        }

        /// <summary>
        /// Sets the value at the specified dot-separated path within the object graph.
        /// </summary>
        /// <param name="path">Dot-separated path (e.g. "Parent.Child.Property").</param>
        /// <param name="value">The new value to set.</param>
        public virtual void SetValue(string path, object? value)
        {
            if (path.IsNull())
                throw new ArgumentException("Path cannot be null or empty.");

            SplitPath(path, out var head, out var tail);

            if (!_typeCache[_type].TryGetValue(head, out var prop))
                throw new ArgumentException($"Property '{head}' not found on type '{_type.Name}'.");

            if (tail == null)
                prop.SetValue(this, value);
            else
            {
                if (prop.GetValue(this) is RecursiveObservable ro)
                    ro.SetValue(tail, value);
                else
                    throw new InvalidOperationException($"Property '{head}' is not recursive.");
            }
        }

        /// <summary>
        /// Splits a dot-separated path into its head (first property) and tail (remaining path).
        /// </summary>
        /// <param name="path">The path string to split.</param>
        /// <param name="head">The first property in the path.</param>
        /// <param name="tail">The remaining part of the path, or <c>null</c> if there is none.</param>
        protected internal static void SplitPath(string path, out string head, out string? tail)
        {
            var dot = path.IndexOf('.');
            if (dot < 0)
            {
                head = path;
                tail = null;
            }
            else
            {
                head = path[..dot];
                tail = path[(dot + 1)..];
            }
        }

        /// <inheritdoc/>
        protected override void OnPropertyChanging(PropertyChangingEventArgs e)
        {
            base.OnPropertyChanging(e);

            if (_typeCache[_type].TryGetValue(e.PropertyName, out var prop))
            {
                if (prop.GetValue(this) is RecursiveObservable ro)
                    ro.ResetNotifier();
            }
        }

        /// <inheritdoc/>
        protected override void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            base.OnPropertyChanged(e);

            if (_typeCache[_type].TryGetValue(e.PropertyName, out var prop))
            {
                if (prop.GetValue(this) is RecursiveObservable ro)
                    ro.SetNotifier(Notify, e.PropertyName);

                Notify(new RecursiveChangedEventArgs(e.PropertyName));
            }
        }

        /// <summary>
        /// Executes the recursive change notification for the current object.
        /// </summary>
        /// <param name="e">The recursive change arguments.</param>
        protected internal void Notify(RecursiveChangedEventArgs e)
        {
            _notifier?.Execute(e.Action == RecursiveChangedAction.Set
                ? new RecursiveChangedEventArgs(BuildPath(e.Path))
                : new RecursiveChangedEventArgs(
                    e.Action,
                    BuildPath(e.Path),
                    e.Index,
                    e.Count
                )
            );
        }

        /// <summary>
        /// Builds a full path by prepending the current object's prefix.
        /// </summary>
        /// <param name="property">The property name.</param>
        /// <returns>A fully-qualified property path.</returns>
        protected internal string BuildPath(string property)
            => _prefix.IsNull() ? property : $"{_prefix}{(property.IsNull() ? "" : $".{property}")}";

        /// <summary>
        /// Called when a recursive change occurs.
        /// Override this method to handle propagated change events.
        /// </summary>
        /// <param name="e">The recursive change event args.</param>
        protected virtual void OnNotify(RecursiveChangedEventArgs e) { }
    }
}
