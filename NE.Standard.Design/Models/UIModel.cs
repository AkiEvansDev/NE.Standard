using CommunityToolkit.Mvvm.ComponentModel;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Types;
using NE.Standard.Extensions;
using NE.Standard.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.Design.Models
{
    [AttributeUsage(AttributeTargets.Method)]
    public class UIAction : Attribute
    {
        public string Name { get; }
        public UIAction(string name) => Name = name;
    }

    [ObjectSerializable]
    public class UIActionResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public abstract class UIModel : ObservableObject, IDisposable
    {
        private readonly object _lock = new object();

        private readonly Dictionary<string, PropertyInfo> _propCache;
        private readonly Dictionary<string, MethodInfo> _methodCache;
        private readonly HashSet<string> _changedProperties;
        private Timer? _debounceTimer;

        private IUICallback? _callback;
        private Dictionary<string, string>? _propertiesMap;

        /// <summary>
        /// Set <see cref="SyncMode.None"/> for WPF app
        /// </summary>
        public SyncMode SyncMode { get; set; } = SyncMode.None;
        protected virtual TimeSpan DebounceDelay { get; } = TimeSpan.FromMilliseconds(150);

        public event Action<List<(string property, object? value)>>? SyncRequired;

        public UIModel()
        {
            var type = GetType();

            _changedProperties = new HashSet<string>();
            _methodCache = type
                .GetMethodsWithAttribute<UIAction>()
                .ToDictionary(m => m.GetCustomAttribute<UIAction>().Name, m => m);

            _propCache = new Dictionary<string, PropertyInfo>();
            foreach (var field in type.GetFieldsWithAttribute<ObservablePropertyAttribute>())
            {
                var property = type.GetProperty(GetPropertyNameFromField(field), ReflectionExtensions.Flags);
                if (property != null)
                    _propCache[property.Name] = property;
            }
        }

        private static string GetPropertyNameFromField(FieldInfo field)
        {
            var name = field.Name;

            if (name.StartsWith("_"))
                name = name[1..];

            return name.UpFirst();
        }

        internal void SetCallback(IUICallback callback, Dictionary<string, string> map)
        {
            _callback = callback;
            _propertiesMap = map;
        }

        protected bool RequestNavigate(string key)
        {
            if (_callback == null)
                return false;

            _callback!.RequestNavigate(key);
            return true;
        }

        protected bool RequestOpenDialog(string key)
        {
            if (_callback == null)
                return false;

            _callback!.RequestOpenDialog(key);
            return true;
        }

        protected bool RequestNotification(UINotification notification)
        {
            if (_callback == null)
                return false;

            _callback!.RequestNotification(notification);
            return true;
        }

        protected override void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            base.OnPropertyChanged(e);

            switch (SyncMode)
            {
                case SyncMode.Immediate:
                    RequestSync(new List<(string property, object? value)> { (e.PropertyName, GetValue(e.PropertyName)) });
                    break;
                case SyncMode.Batched:
                    lock (_lock)
                        _changedProperties.Add(e.PropertyName);
                    break;
                case SyncMode.Debounced:
                    lock (_lock)
                    {
                        _changedProperties.Add(e.PropertyName);
                        _debounceTimer?.Dispose();
                        _debounceTimer = new Timer(Commit, null, DebounceDelay, Timeout.InfiniteTimeSpan);
                    }
                    break;
            }
        }

        protected void Commit() => Commit(null);

        private void Commit(object? state)
        {
            List<(string property, object? value)>? updates = null;

            lock (_lock)
            {
                if (_changedProperties.Count > 0)
                {
                    updates = _changedProperties
                        .Select(p => (p, GetValue(p)))
                        .ToList();

                    _changedProperties.Clear();
                    _debounceTimer?.Dispose();
                    _debounceTimer = null;
                }
            }

            if (updates != null)
                RequestSync(updates);
        }

        private void RequestSync(List<(string property, object? value)> updates)
        {
            if (_callback == null || _propertiesMap == null)
                return;

            var send = new List<(string id, object? value)>();

            foreach (var (property, value) in updates)
            {
                if (_propertiesMap!.TryGetValue(property, out var id))
                    send.Add((id, value));
            }

            _callback?.RequestSync(send);
        }

        public virtual object? GetValue(string propertyName)
            => _propCache.TryGetValue(propertyName, out var property) ? property.GetValue(this) : null;

        public virtual void SetValue(string propertyName, object? value)
        {
            if (_propCache.TryGetValue(propertyName, out var property))
                property.SetValue(this, value);
        }

        public virtual async Task<UIActionResult> ExecuteAsync(string methodName, object[]? parameters)
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
