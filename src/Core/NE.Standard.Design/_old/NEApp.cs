using NE.Standard.Design._old.Components;
using NE.Standard.Design._old.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Design._old
{
    public sealed class UINavigateResult : UIActionResult
    {
        public IInternalDataContext? Context { get; set; }
    }

    public interface IInternalApp
    {
        string HomePage { get; }
        UIStyle DefaultStyle { get; }

        Task<UINavigateResult> NavigateAsync(string key, IInternalDataContextProvider contextProvider, SyncMode mode);
    }

    public abstract class NEApp : IInternalApp
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly Dictionary<string, Func<IViewModel>> _pages;

        public abstract string HomePage { get; }
        public abstract UIStyle DefaultStyle { get; }

        public NEApp(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            _pages = new Dictionary<string, Func<IViewModel>>();
        }

        protected void RegisterPage<TModel, TView>(string key)
            where TModel : NEModel<NEDataContext>
            where TView : NEView<NEDataContext>
        {
            _pages[key] = () => new ViewModel<TModel, TView>(_serviceProvider);
        }

        async Task<UINavigateResult> IInternalApp.NavigateAsync(string key, IInternalDataContextProvider contextProvider, SyncMode mode)
        {
            var result = new UINavigateResult
            {
                Context = contextProvider.GetCurrentDataContext()
            };

            if (result.Context == null)
            {
                result.Error = "Context not found";
                return result;
            }

            if (result.Context.Key == key && result.Context.Model != null && result.Context.View != null)
            {
                result.Success = true;
                return result;
            }

            if (_pages.TryGetValue(key, out var factory))
            {
                try
                {
                    (result.Context.Model, result.Context.View) = await factory().LoadAsync(result.Context, mode);

                    result.Context.Key = key;
                    result.Success = true;

                    return result;
                }
                catch (Exception ex)
                {
                    result.Error = ex.Message;
                    return result;
                }
            }

            result.Error = $"Key `{key}` not found";
            return result;
        }
    }
}
