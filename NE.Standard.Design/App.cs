using NE.Standard.Design.Elements;
using NE.Standard.Design.Models;
using NE.Standard.Design.Styles;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Design
{
    public class ServerNavigateResult : ServerResult
    {
        public IModel Model { get; set; } = default!;
        public IView View { get; set; } = default!;
    }

    public interface IApp
    {
        string HomePage { get; }
        UIStyleConfig DefaultStyle { get; }
        UIApp UIApp { get; }
        Task<ServerNavigateResult> NavigateAsync(string link, IClientBridge? bridge);
    }

    public abstract class App : IApp
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly Dictionary<string, Func<IViewModel>> _pages;

        public abstract string HomePage { get; }
        public abstract UIStyleConfig DefaultStyle { get; }
        public abstract UIApp UIApp { get; }

        public App(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            _pages = new Dictionary<string, Func<IViewModel>>();
        }

        protected void RegisterPage<TModel, TView>(string link)
            where TModel : IModel
            where TView : IView
        {
            _pages[link] = () => new ViewModel<TModel, TView>(_serviceProvider);
        }

        async Task<ServerNavigateResult> IApp.NavigateAsync(string link, IClientBridge? bridge)
        {
            var result = new ServerNavigateResult();

            if (_pages.TryGetValue(link, out var factory))
            {
                try
                {
                    (result.Model, result.View) = await factory().LoadAsync(bridge);

                    result.Success = true;
                    return result;
                }
                catch (Exception ex)
                {
                    result.Error = ex.Message;
                    return result;
                }
            }

            result.Error = "Not Found";
            return result;
        }
    }
}
