using NE.Standard.Extensions;
using NE.Standard.Serialization;
using NE.Standard.Types;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
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

    public interface INEActionResult
    {
        bool Success { get; }
        string? Error { get; }
    }

    [NEObject]
    public class NEActionResult : INEActionResult
    {
        public bool Success { get; set; }
        public string? Error { get; set; }
    }

    public interface INEModel : IDisposable
    {
        SyncMode Mode { get; set; }
        ISessionContext Context { get; set; }

        Task<bool> InitAsync();
        Task<INEActionResult> Execute(string action, object[]? parameters);
    }

    public abstract class NEModel<T> : RecursiveObservable, INEModel
        where T : ISessionContext
    {
        private static readonly ConcurrentDictionary<Type, Dictionary<string, MethodInfo>> _typeCache = new ConcurrentDictionary<Type, Dictionary<string, MethodInfo>>();
        private readonly Type _type;

        private readonly List<RecursiveChangedEventArgs> _changes = new List<RecursiveChangedEventArgs>();
        private readonly object _lock = new object();
        private Timer? _debounceTimer;

        private SyncMode _mode = SyncMode.None;
        private ISessionContext _context = default!;

        SyncMode INEModel.Mode
        {
            get => _mode;
            set => _mode = value;
        }

        ISessionContext INEModel.Context
        {
            get => _context;
            set => _context = value;
        }

        protected T Context => (T)_context;

        public NEModel()
        {
            _type = GetType();
            _typeCache.GetOrAdd(_type, t => t.GetAllMethods()
                .Where(m =>
                {
                    var returnType = m.ReturnType;
                    if (returnType.IsGenericType && returnType.GetGenericTypeDefinition() == typeof(Task<>))
                        returnType = returnType.GetGenericArguments()[0];

                    return typeof(INEActionResult).IsAssignableFrom(returnType);
                })
                .ToDictionary(m => m.Name, m => m)
            );
        }

        public virtual Task<bool> InitAsync()
        {
            return Task.FromResult(true);
        }

        protected override void OnNotify(RecursiveChangedEventArgs e)
        {
            switch (_mode)
            {
                case SyncMode.Immediate:
                    Task.Run(async () => await _context.Update(new List<RecursiveChangedEventArgs> { e }));
                    break;
                case SyncMode.Debounced:
                    lock (_lock)
                    {
                        _changes.Add(e);
                        _debounceTimer?.Dispose();
                        _debounceTimer = new Timer(async _ =>
                        {
                            if (_mode == SyncMode.None)
                                return;

                            List<RecursiveChangedEventArgs>? updates = null;

                            lock (_lock)
                            {
                                if (_changes.Count > 0)
                                {
                                    updates = _changes.ToList();

                                    _changes.Clear();
                                    _debounceTimer?.Dispose();
                                    _debounceTimer = null;
                                }
                            }

                            if (updates != null)
                                await _context.Update(updates);

                        }, null, TimeSpan.FromMilliseconds(250), Timeout.InfiniteTimeSpan);
                    }
                    break;
            }
        }

        async Task<INEActionResult> INEModel.Execute(string action, object[]? parameters)
        {
            try
            {
                object? result = null;
                if (_typeCache[_type].TryGetValue(action, out var method))
                    result = method.Invoke(this, parameters ?? Array.Empty<object>());

                if (result is INEActionResult actionResult)
                    return actionResult;

                if (result is Task<INEActionResult> task)
                {
                    await task;
                    return task.Result;
                }

                return new NEActionResult { Error = $"Action `{action}` not found." };
            }
            catch (Exception ex)
            {
                return new NEActionResult { Error = $"Error while execute action `{action}`: {ex.Message}" };
            }
        }

        public virtual void Dispose()
        {
            lock (_lock)
            {
                _changes.Clear();
                _debounceTimer?.Dispose();
                _debounceTimer = null;
            }
        }
    }
}
