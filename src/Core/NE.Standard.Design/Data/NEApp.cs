using Microsoft.Extensions.DependencyInjection;
using NE.Standard.Design.Common;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace NE.Standard.Design.Data
{
    public sealed class NENavigateResult : NEActionResult
    {
        public ISessionContext? Context { get; set; }
    }

    public interface INEApp
    {
        string DefaultKey { get; }
        UIStyle DefaultStyle { get; }

        Task<NENavigateResult> NavigateAsync(string key, ISessionContextProvider contextProvider, SyncMode mode);
    }

    public abstract class NEApp : INEApp
    {
        private static readonly ConcurrentDictionary<string, IViewModel> _pages = new ConcurrentDictionary<string, IViewModel>();
        private readonly IServiceProvider _serviceProvider;

        public abstract string DefaultKey { get; }
        public abstract UIStyle DefaultStyle { get; }

        public NEApp(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected void RegisterPage<TModel, TView>(string key)
            where TModel : class, INEModel
            where TView : class, INEView
        {
            _pages.GetOrAdd(key, new ViewModel<TModel, TView>(_serviceProvider));
        }

        public async Task<NENavigateResult> NavigateAsync(string key, ISessionContextProvider contextProvider, SyncMode mode)
        {
            var result = new NENavigateResult
            {
                Context = contextProvider.GetCurrentSessionContext()
            };

            if (result.Context == null)
            {
                result.Error = "Context not found.";
                return result;
            }

            if (result.Context.Key == key && result.Context.Model != null && result.Context.View != null)
            {
                result.Success = true;
                return result;
            }

            if (_pages.TryGetValue(key, out var viewModel))
            {
                try
                {
                    (result.Context.Model, result.Context.View) = await viewModel.LoadAsync(result.Context, mode);

                    result.Context.Key = key;
                    result.Success = true;

                    return result;
                }
                catch (Exception ex)
                {
                    result.Error = $"Error while navigate to `{key}`: {ex.Message}";
                    return result;
                }
            }

            result.Error = $"Key `{key}` not found.";
            return result;
        }

        private interface IViewModel
        {
            Task<(INEModel? model, INEView? view)> LoadAsync(ISessionContext context, SyncMode mode);
        }

        private class ViewModel<TModel, TView> : IViewModel
            where TModel : INEModel
            where TView : INEView
        {
            private readonly IServiceProvider _serviceProvider;

            public ViewModel(IServiceProvider serviceProvider)
            {
                _serviceProvider = serviceProvider;
            }

            public async Task<(INEModel? model, INEView? view)> LoadAsync(ISessionContext context, SyncMode mode)
            {
                var model = ActivatorUtilities.CreateInstance<TModel>(_serviceProvider);
                var view = ActivatorUtilities.CreateInstance<TView>(_serviceProvider);

                model.Mode = mode;
                model.Context = context;

                if (!await model.InitAsync())
                    return (null, null);
                
                view.Context = context;

                if (!await view.InitAsync())
                    return (null, null);

                return (model, view);
            }
        }
    }
}
