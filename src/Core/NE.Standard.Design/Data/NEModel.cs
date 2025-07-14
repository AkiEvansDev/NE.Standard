using CommunityToolkit.Mvvm.ComponentModel;
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

namespace NE.Standard.Design.Data
{
    public enum SyncMode
    {
        None,
        Immediate,
        Debounced
    }

    public interface IUIActionResult
    {
        bool Success { get; }
        string? Error { get; }
    }

    [NEObject]
    public class UIActionResult : IUIActionResult
    {
        public bool Success { get; set; }
        public string? Error { get; set; }
    }

    public interface IInternalModel : IDisposable
    {
        SyncMode Mode { get; set; }
        IInternalDataContext InternalDataContext { get; set; }

        Task InitAsync();

        object? GetValue(string propertyName);
        void SetValue(string propertyName, object? value);

        Task<IUIActionResult> Sync(List<UIUpdate> updates);
        Task<IUIActionResult> Execute(string action, object[]? parameters);
    }
    
    public abstract class NEModelItem : ObservableObject
    {
        public Guid Id { get; set; }
    }

    public abstract class NEModel<T> : ObservableObject, IInternalModel
        where T : NEDataContext
    {
        private readonly object _lock = new object();

        private readonly Dictionary<string, PropertyInfo> _collCache;
        private readonly Dictionary<string, PropertyInfo> _propCache;
        private readonly Dictionary<string, MethodInfo> _methodCache;
        private readonly List<UIUpdate> _changedProperties;

        private Timer? _debounceTimer;
        private SyncMode _mode = SyncMode.None;
        private IInternalDataContext _dataContext = default!;

        SyncMode IInternalModel.Mode
        {
            get => _mode;
            set => _mode = value;
        }

        IInternalDataContext IInternalModel.InternalDataContext
        {
            get => _dataContext;
            set => _dataContext = value;
        }

        protected T DataContext => (T)_dataContext;

        public NEModel()
        {
            var type = GetType();

            _changedProperties = new List<UIUpdate>();
            _methodCache = type
                .GetAllMethods()
                .Where(IsUIAction)
                .ToDictionary(m => m.Name, m => m);

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

        public virtual Task InitAsync()
        {
            return Task.CompletedTask;
        }

        private static bool IsUIAction(MethodInfo methodInfo)
        {
            var returnType = methodInfo.ReturnType;

            if (typeof(IUIActionResult).IsAssignableFrom(returnType))
                return true;

            if (returnType.IsGenericType
                && returnType.GetGenericTypeDefinition() == typeof(Task<>) &&
                typeof(IUIActionResult).IsAssignableFrom(returnType.GetGenericArguments()[0]))
            {
                return true;
            }

            return false;
        }

        private static string GetPropertyNameFromField(FieldInfo field)
        {
            var name = field.Name;

            if (name.StartsWith("_"))
                name = name[1..];

            return name.UpFirst();
        }

        protected override void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            base.OnPropertyChanged(e);

            if (_mode == SyncMode.None)
                return;

            if (_collCache.TryGetValue(e.PropertyName, out var property))
            {
                var value = property.GetValue(this);
                if (value is INotifyCollectionChanged notifyCollection)
                {
                    notifyCollection.CollectionChanged += (s, e) =>
                    {
                        if (_mode == SyncMode.None)
                            return;

                        Update(new UIUpdate
                        {
                            Type = (UpdateType)e.Action,
                            Property = property.Name,
                            NewItems = e.NewItems?.Cast<object>()?.ToList(),
                            NewStartingIndex = e.NewStartingIndex,
                            OldItems = e.OldItems?.Cast<object>()?.ToList(),
                            OldStartingIndex = e.OldStartingIndex
                        });
                    };
                }
            }

            Update(new UIUpdate
            {
                Type = UpdateType.Set,
                Property = property.Name,
                Value = GetValue(e.PropertyName)
            });
        }

        private void Update(UIUpdate update)
        {
            switch (_mode)
            {
                case SyncMode.Immediate:
                    Task.Run(async () => await _dataContext.UpdateUI(new List<UIUpdate> { update }));
                    break;
                case SyncMode.Debounced:
                    lock (_lock)
                    {
                        _changedProperties.Add(update);
                        _debounceTimer?.Dispose();
                        _debounceTimer = new Timer(async _ =>
                        {
                            if (_mode == SyncMode.None)
                                return;

                            List<UIUpdate>? updates = null;

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
                                await _dataContext.UpdateUI(updates);

                        }, null, TimeSpan.FromMilliseconds(250), Timeout.InfiniteTimeSpan);
                    }
                    break;
            }
        }

        object? IInternalModel.GetValue(string propertyName)
        {
            return GetValue(propertyName);
        }

        void IInternalModel.SetValue(string propertyName, object? value)
        {
            SetValue(propertyName, value);
        }

        Task<IUIActionResult> IInternalModel.Sync(List<UIUpdate> updates)
        {
            var saveMode = _mode;

            try
            {
                _mode = SyncMode.None;

                foreach (var update in updates)
                    UpdateProperty(update);

                return Task.FromResult<IUIActionResult>(new UIActionResult { Success = true });
            }
            catch (Exception ex)
            {
                return Task.FromResult<IUIActionResult>(new UIActionResult { Error = ex.Message });
            }
            finally
            {
                _mode = saveMode;
            }
        }

        async Task<IUIActionResult> IInternalModel.Execute(string action, object[]? parameters)
        {
            try
            {
                var result = ExecuteMethod(action, parameters);
                if (result is Task<IUIActionResult> task)
                {
                    await task;
                    result = task.Result;
                }

                if (result is IUIActionResult actionResult)
                    return actionResult;

                return new UIActionResult { Error = $"Action `{action}` not found" };
            }
            catch (Exception ex)
            {
                return new UIActionResult { Error = ex.Message };
            }
        }

        private void UpdateProperty(UIUpdate update)
        {
            if (update.Type == UpdateType.Set)
            {
                SetValue(update.Property, update.Value);
            }
            else
            {
                var value = GetValue(update.Property);
                if (value is IList list)
                {
                    switch (update.Type)
                    {
                        case UpdateType.Add:
                            throw new NotImplementedException();
                        case UpdateType.Remove:
                            throw new NotImplementedException();
                        case UpdateType.Replace:
                            throw new NotImplementedException();
                        case UpdateType.Move:
                            throw new NotImplementedException();
                        case UpdateType.Reset:
                            list.Clear();
                            break;
                    }
                }
            }
        }

        private object? GetValue(string propertyName)
            => _propCache.TryGetValue(propertyName, out var property) ? property.GetValue(this) : null;

        private void SetValue(string propertyName, object? value)
        {
            if (_propCache.TryGetValue(propertyName, out var property))
                property.SetValue(this, value);
        }

        private object? ExecuteMethod(string methodName, object[]? parameters)
        {
            if (_methodCache.TryGetValue(methodName, out var method))
                return method.Invoke(this, parameters ?? Array.Empty<object>());

            return null;
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
