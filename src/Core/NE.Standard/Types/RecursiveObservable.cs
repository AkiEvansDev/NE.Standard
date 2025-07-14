using CommunityToolkit.Mvvm.ComponentModel;
using NE.Standard.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Reflection;

namespace NE.Standard.Types
{
    /// <summary>
    /// Defines a mechanism for recursive change notification across nested observable objects.
    /// </summary>
    public interface IRecursiveObservable
    {
        /// <summary>
        /// Registers a notification callback that will be invoked when a nested property changes.
        /// </summary>
        /// <param name="notify">The callback to invoke on property changes.</param>
        /// <param name="prefix">
        /// Optional prefix to prepend to property paths in <see cref="RecursiveChangedEventArgs.Path"/>.
        /// Useful for nested object hierarchies.
        /// </param>
        void SetNotifier(Action<RecursiveChangedEventArgs> notify, string? prefix);

        /// <summary>
        /// Clears the previously registered change notification callback.
        /// </summary>
        void ClearNotifier();
    }

    /// <summary>
    /// Provides recursive property change tracking by automatically wiring and propagating
    /// change notifications through nested <see cref="IRecursiveObservable"/> instances.
    /// </summary>
    public class RecursiveObservable : ObservableObject, IRecursiveObservable
    {
        private static readonly Dictionary<Type, Dictionary<string, PropertyInfo>> _typeCache = new Dictionary<Type, Dictionary<string, PropertyInfo>>();
        private readonly Type _type;

        private WeakAction<RecursiveChangedEventArgs>? _notifier;
        private string _propertyPrefix = "";

        /// <summary>
        /// Initializes a new instance of the <see cref="RecursiveObservable"/> class.
        /// Caches observable properties using reflection for efficient traversal.
        /// </summary>
        public RecursiveObservable()
        {
            _type = GetType();

            if (!_typeCache.ContainsKey(_type))
            {
                var props = new Dictionary<string, PropertyInfo>();

                foreach (var field in _type.GetFieldsWithAttribute<ObservablePropertyAttribute>())
                {
                    var property = _type.GetProperty(GetPropertyNameFromField(field), ReflectionExtensions.Flags);
                    if (property != null)
                    {
                        props[property.Name] = property;
                    }
                }

                _typeCache[_type] = props;
            }
        }

        private static string GetPropertyNameFromField(FieldInfo field)
        {
            var name = field.Name;

            if (name.StartsWith("_"))
                name = name[1..];

            return name.UpFirst();
        }

        /// <summary>
        /// Sets a recursive notifier that will be triggered on property changes in this object and its nested children.
        /// </summary>
        /// <param name="notify">The callback to execute when a change occurs.</param>
        /// <param name="prefix">
        /// Optional string prefix to prepend to the path of the property in the change event.
        /// This helps identify the nesting hierarchy.
        /// </param>
        public void SetNotifier(Action<RecursiveChangedEventArgs> notify, string? prefix = null)
        {
            _notifier = new WeakAction<RecursiveChangedEventArgs>(notify);
            _propertyPrefix = prefix.IsNull() ? "" : $"{prefix}.";

            var visited = new HashSet<object> { this };
            PropagateNotifier(notify, visited);
        }

        private void PropagateNotifier(Action<RecursiveChangedEventArgs> notify, HashSet<object> visited)
        {
            foreach (var prop in _typeCache[_type].Values)
            {
                var value = prop.GetValue(this);
                if (value is IRecursiveObservable ro && visited.Add(ro))
                {
                    ro.SetNotifier(notify, prop.Name);
                }
            }
        }

        /// <summary>
        /// Removes the current recursive notifier and clears notification propagation to nested children.
        /// </summary>
        public void ClearNotifier()
        {
            _notifier = null;
            _propertyPrefix = "";

            var visited = new HashSet<object> { this };
            PropagateClear(visited);
        }

        private void PropagateClear(HashSet<object> visited)
        {
            foreach (var prop in _typeCache[_type].Values)
            {
                var value = prop.GetValue(this);
                if (value is IRecursiveObservable ro && visited.Add(ro))
                {
                    ro.ClearNotifier();
                }
            }
        }

        /// <summary>
        /// Overrides the base property change handler to propagate change tracking recursively
        /// and raise <see cref="RecursiveChangedEventArgs"/> for external listeners.
        /// </summary>
        /// <param name="e">The property change event arguments.</param>
        protected override void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            base.OnPropertyChanged(e);

            if (_typeCache[_type].TryGetValue(e.PropertyName, out var prop))
            {
                var value = prop.GetValue(this);
                if (value is IRecursiveObservable ro)
                {
                    ro.SetNotifier(NotifyChange, prop.Name);
                }

                var evt = new RecursiveChangedEventArgs(e.PropertyName, value);
                NotifyChange(evt);
            }
        }

        private void NotifyChange(RecursiveChangedEventArgs e)
        {
            if (_notifier is null)
                return;

            var fullPath = $"{_propertyPrefix}{e.Path}";
            var forwarded = e.Action switch
            {
                RecursiveChangedAction.Set => new RecursiveChangedEventArgs(fullPath, e.Value),
                _ => new RecursiveChangedEventArgs(
                    e.Action,
                    fullPath,
                    e.NewStartingIndex,
                    e.NewItems,
                    e.OldStartingIndex,
                    e.OldItems
                )
            };

            _notifier.Execute(forwarded);
        }
    }
}
