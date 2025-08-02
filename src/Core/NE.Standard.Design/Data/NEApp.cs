using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;
using NE.Standard.Design.Common;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Design.Data
{
    public sealed class NENavigateResult : NEActionResult
    {
        public ISessionContext? Context { get; set; }
    }

    public interface INEApp
    {
        string DefaultUri { get; }
        UIStyle DefaultStyle { get; }

        Task<NENavigateResult> NavigateAsync<T>(string uri, string query, ISessionContextProvider contextProvider, SyncMode mode)
            where T : class, IPlatformBinding, new();
    }

    public abstract class NEApp : INEApp
    {
        private static readonly ConcurrentDictionary<string, IViewModel> _pages = new ConcurrentDictionary<string, IViewModel>();
        private readonly IServiceProvider _serviceProvider;

        public abstract string DefaultUri { get; }
        public abstract UIStyle DefaultStyle { get; }

        public NEApp(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected void RegisterPage<TModel, TView>(string uri)
            where TModel : class, INEModel
            where TView : class, INEView
        {
            _pages.GetOrAdd(uri, new ViewModel<TModel, TView>(_serviceProvider));
        }

        public async Task<NENavigateResult> NavigateAsync<T>(string uri, string query, ISessionContextProvider contextProvider, SyncMode mode)
            where T : class, IPlatformBinding, new()
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

            if (result.Context.Uri == uri && result.Context.Query == query && result.Context.Model != null && result.Context.View != null)
            {
                result.Success = true;
                return result;
            }

            if (_pages.TryGetValue(uri, out var viewModel))
            {
                var saveUri = result.Context.Uri;
                var saveQuery = result.Context.Query;

                try
                {
                    result.Context.BindingContext = new T();
                    result.Context.Uri = uri;
                    result.Context.Query = query;

                    (result.Context.Model, result.Context.View) = await viewModel.LoadAsync(result.Context, mode);

                    result.Success = true;

                    return result;
                }
                catch (Exception ex)
                {
                    result.Context.Uri = saveUri;
                    result.Context.Query = saveQuery;
                    result.Error = $"Error while navigate to `{uri}`: {ex.Message}";
                    return result;
                }
            }

            result.Error = $"Uri `{uri}` not found.";
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
