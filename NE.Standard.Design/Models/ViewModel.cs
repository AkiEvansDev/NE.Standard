using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace NE.Standard.Design.Models
{
    internal interface IViewModel
    {
        Task<(IModel model, IView view)> LoadAsync(IClientBridge? bridge);
    }

    internal class ViewModel<TModel, TView> : IViewModel
        where TModel : IModel
        where TView : IView
    {
        private readonly IServiceProvider _serviceProvider;

        public ViewModel(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task<(IModel model, IView view)> LoadAsync(IClientBridge? bridge)
        {
            var model = ActivatorUtilities.CreateInstance<TModel>(_serviceProvider);
            var view = ActivatorUtilities.CreateInstance<TView>(_serviceProvider);

            model.Bridge = bridge;

            await model.InitAsync();
            await view.InitAsync();

            return (model, view);
        }
    }
}
