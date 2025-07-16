using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace NE.Standard.Design._old.Data
{
    internal interface IViewModel
    {
        Task<(IInternalModel model, IInternalView view)> LoadAsync(IInternalDataContext context, SyncMode mode);
    }

    internal class ViewModel<TModel, TView> : IViewModel
        where TModel : IInternalModel
        where TView : IInternalView
    {
        private readonly IServiceProvider _serviceProvider;

        public ViewModel(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task<(IInternalModel model, IInternalView view)> LoadAsync(IInternalDataContext context, SyncMode mode)
        {
            var model = ActivatorUtilities.CreateInstance<TModel>(_serviceProvider);
            var view = ActivatorUtilities.CreateInstance<TView>(_serviceProvider);

            model.Mode = mode;
            model.InternalDataContext = context;
            view.InternalDataContext = context;

            await model.InitAsync();
            await view.InitAsync();

            return (model, view);
        }
    }
}
