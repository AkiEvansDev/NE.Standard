using CommunityToolkit.Mvvm.ComponentModel;
using NE.Standard.Design.Elements;
using NE.Standard.Extensions;
using NE.Standard.Serialization;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.Design.Models
{
    public enum SyncMode
    {
        None,
        Immediate,
        Batched,
        Debounced
    }

    public enum UpdatePropertyType
    {
        /// <summary>
        /// Only for property.
        /// </summary>
        Set = -1,

        /// <summary>
        /// An item was added to the collection.
        /// </summary>
        Add = 0,
        /// <summary>
        /// An item was removed from the collection.
        /// </summary>
        Remove = 1,
        /// <summary>
        /// An item was replaced in the collection.
        /// </summary>
        Replace = 2,
        /// <summary>
        /// An item was moved within the collection.
        /// </summary>
        Move = 3,
        /// <summary>
        /// The content of the collection was cleared.
        /// </summary>
        Reset = 4
    }

    [AttributeUsage(AttributeTargets.Method)]
    public class UIAction : Attribute
    {
        public string Name { get; }
        public UIAction(string name) => Name = name;
    }

    [ObjectSerializable]
    public class UpdateProperty
    {
        public string Property { get; set; }
        public UpdatePropertyType Action { get; set; }

        public UpdateProperty(string property, UpdatePropertyType type)
        {
            Property = property;
            Action = type;
        }

        public object? Value { get; set; }

        public List<object>? NewItems { get; set; }
        public int? NewStartingIndex { get; set; }

        public List<object>? OldItems { get; set; }
        public int? OldStartingIndex { get; set; }
    }

    [ObjectSerializable]
    public class UIActionResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public interface IUIModel : IDisposable
    {
        SyncMode SyncMode { get; set; }

        void UpdateProperty(UpdateProperty update);
        Task<UIActionResult> ExecuteAsync(string methodName, object[]? parameters);
    }

    internal interface IUIRequestModel
    {
        void SetRequest(IUIRequest request);
    }

    public abstract class UIModel : ObservableObject, IUIModel, IUIRequestModel
    {
        private readonly object _lock = new object();

        private readonly Dictionary<string, PropertyInfo> _collCache;
        private readonly Dictionary<string, PropertyInfo> _propCache;
        private readonly Dictionary<string, MethodInfo> _methodCache;
        private readonly List<UpdateProperty> _changedProperties;

        private Timer? _debounceTimer;
        private IUIRequest? _request;

        /// <summary>
        /// Set <see cref="SyncMode.None"/> for WPF app
        /// </summary>
        public SyncMode SyncMode { get; set; } = SyncMode.None;
        protected virtual TimeSpan DebounceDelay { get; } = TimeSpan.FromMilliseconds(150);

        public UIModel()
        {
            var type = GetType();

            _changedProperties = new List<UpdateProperty>();
            _methodCache = type
                .GetMethodsWithAttribute<UIAction>()
                .ToDictionary(m => m.GetCustomAttribute<UIAction>().Name, m => m);

            _collCache = new Dictionary<string, PropertyInfo>();
            _propCache = new Dictionary<string, PropertyInfo>();
            foreach (var field in type.GetFieldsWithAttribute<ObservablePropertyAttribute>())
            {
                var property = type.GetProperty(GetPropertyNameFromField(field), ReflectionExtensions.Flags);
                if (property != null)
                {
                    if (property.PropertyType == typeof(ObservableCollection<>))
                        _collCache[property.Name] = property;

                    _propCache[property.Name] = property;
                }
            }
        }

        private static string GetPropertyNameFromField(FieldInfo field)
        {
            var name = field.Name;

            if (name.StartsWith("_"))
                name = name[1..];

            return name.UpFirst();
        }

        void IUIRequestModel.SetRequest(IUIRequest request)
        {
            _request = request;
        }

        protected bool RequestNavigate(string key)
        {
            return _request?.RequestNavigate(key) ?? false;
        }

        protected bool RequestOpenDialog(string id)
        {
            return _request?.RequestOpenDialog(id) ?? false;
        }

        protected bool RequestNotification(UINotification notification)
        {
            return _request?.RequestNotification(notification) ?? false;
        }

        protected override void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            base.OnPropertyChanged(e);

            if (SyncMode == SyncMode.None)
                return;

            if (_collCache.TryGetValue(e.PropertyName, out var property))
            {
                var value = property.GetValue(this);
                if (value is INotifyCollectionChanged notifyCollection)
                {
                    notifyCollection.CollectionChanged += (s, e) =>
                    {
                        Update(new UpdateProperty(property.Name, (UpdatePropertyType)e.Action)
                        {
                            NewItems = e.NewItems?.Cast<object>()?.ToList(),
                            NewStartingIndex = e.NewStartingIndex,
                            OldItems = e.OldItems?.Cast<object>()?.ToList(),
                            OldStartingIndex = e.OldStartingIndex
                        });
                    };
                }
            }

            Update(new UpdateProperty(e.PropertyName, UpdatePropertyType.Set)
            {
                Value = GetValue(e.PropertyName)
            });
        }

        private void Update(UpdateProperty update)
        {
            switch (SyncMode)
            {
                case SyncMode.Immediate:
                    _request?.RequestSync(new List<UpdateProperty> { update });
                    break;
                case SyncMode.Batched:
                    lock (_lock)
                    {
                        _changedProperties.Add(update);
                    }
                    break;
                case SyncMode.Debounced:
                    lock (_lock)
                    {
                        _changedProperties.Add(update);
                        _debounceTimer?.Dispose();
                        _debounceTimer = new Timer(Commit, null, DebounceDelay, Timeout.InfiniteTimeSpan);
                    }
                    break;
            }
        }

        protected void Commit() => Commit(null);

        private void Commit(object? state)
        {
            List<UpdateProperty>? updates = null;

            lock (_lock)
            {
                if (_changedProperties.Count > 0)
                {
                    updates = _changedProperties.ToList();

                    _changedProperties.Clear();
                    _debounceTimer?.Dispose();
                    _debounceTimer = null;
                }
            }

            if (updates != null)
                _request?.RequestSync(updates);
        }

        protected object? GetValue(string propertyName)
            => _propCache.TryGetValue(propertyName, out var property) ? property.GetValue(this) : null;

        protected void SetValue(string propertyName, object? value)
        {
            if (_propCache.TryGetValue(propertyName, out var property))
                property.SetValue(this, value);
        }

        public void UpdateProperty(UpdateProperty update)
        {
            if (update.Action == UpdatePropertyType.Set)
            {
                SetValue(update.Property, update.Value);
            }
            else
            {
                var value = GetValue(update.Property);
                if (value is IList list)
                {
                    switch (update.Action)
                    {
                        case UpdatePropertyType.Add:
                            if (update.NewItems != null && update.NewStartingIndex.HasValue)
                            {
                                int index = update.NewStartingIndex.Value;
                                foreach (var item in update.NewItems)
                                {
                                    list.Insert(index++, item);
                                }
                            }
                            break;
                        case UpdatePropertyType.Remove:
                            if (update.OldItems != null)
                            {
                                foreach (var item in update.OldItems)
                                {
                                    list.Remove(item);
                                }
                            }
                            break;
                        case UpdatePropertyType.Replace:
                            if (update.NewItems != null && update.NewStartingIndex.HasValue)
                            {
                                int index = update.NewStartingIndex.Value;
                                foreach (var item in update.NewItems)
                                {
                                    if (index < list.Count)
                                        list[index++] = item;
                                }
                            }
                            break;
                        case UpdatePropertyType.Move:
                            if (update.OldStartingIndex.HasValue && update.NewStartingIndex.HasValue && update.OldItems?.Count == 1)
                            {
                                var item = update.OldItems[0];
                                list.RemoveAt(update.OldStartingIndex.Value);
                                list.Insert(update.NewStartingIndex.Value, item);
                            }
                            break;
                        case UpdatePropertyType.Reset:
                            list.Clear();
                            break;
                    }
                }
            }
        }

        public async Task<UIActionResult> ExecuteAsync(string methodName, object[]? parameters)
        {
            if (_methodCache.TryGetValue(methodName, out var method))
            {
                try
                {
                    var result = method.Invoke(this, parameters ?? Array.Empty<object>());
                    if (result is Task task)
                        await task;

                    return new UIActionResult { Success = true };
                }
                catch (Exception ex)
                {
                    return new UIActionResult { Success = false, ErrorMessage = ex.Message };
                }
            }

            return new UIActionResult { Success = false, ErrorMessage = "Action not found" };
        }

        public void Dispose()
        {
            lock (_lock)
            {
                _debounceTimer?.Dispose();
                _changedProperties.Clear();

                _debounceTimer = null;
            }
        }
    }
}
