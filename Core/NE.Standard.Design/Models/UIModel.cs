using CommunityToolkit.Mvvm.ComponentModel;
using NE.Standard.Design.Types;
using NE.Standard.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.Design.Models
{
    public abstract class UIModel : ObservableObject
    {
        private readonly Type _type;
        private readonly HashSet<string> _changedProperties;
        private Timer? _debounceTimer;

        /// <summary>
        /// Set <see cref="SyncMode.None"/> for WPF app
        /// </summary>
        public SyncMode SyncMode { get; set; } = SyncMode.None;

        protected virtual TimeSpan DebounceDelay { get; } = TimeSpan.FromMilliseconds(150);

        public event Action<List<(string property, object? value)>>? SyncRequired;
        public event Action<string>? OpenDialogRequired;
        public event Action<string, string, string?>? SendNotificationRequired;

        public UIModel()
        {
            _type = GetType();
            _changedProperties = new HashSet<string>();
        }

        protected override void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            base.OnPropertyChanged(e);

            switch (SyncMode)
            {
                case SyncMode.Immediate:
                    SyncRequired?.Invoke(new List<(string property, object? value)> { (e.PropertyName, GetValue(e.PropertyName)) });
                    break;
                case SyncMode.Batched:
                    _changedProperties.Add(e.PropertyName);
                    break;
                case SyncMode.Debounced:
                    _changedProperties.Add(e.PropertyName);
                    _debounceTimer?.Dispose();
                    _debounceTimer = new Timer(Commit, null, DebounceDelay, Timeout.InfiniteTimeSpan);
                    break;

            }
        }

        protected void Commit()
            => Commit(null);

        private void Commit(object? state)
        {
            if (_changedProperties.Count > 0)
            {
                var updates = _changedProperties
                    .Select(p => (p, GetValue(p)))
                    .ToList();

                _changedProperties.Clear();
                SyncRequired?.Invoke(updates);
            }
        }

        public virtual object? GetValue(string propertyName) 
            => _type.GetPropertyValue(this, propertyName);

        public virtual void SetValue(string propertyName, object? value)
            => _type.SetPropertyValue(this, propertyName, value);

        public virtual void Execute(string methodName, object[]? parameters)
            => _type.InvokeMethod(this, methodName, parameters ?? Array.Empty<object>());

        public virtual async Task ExecuteAsync(string methodName, object[]? parameters)
        {
            var result = _type.InvokeMethod(this, methodName, parameters ?? Array.Empty<object>());
            if (result is Task task)
                await task;
        }
    }
}
