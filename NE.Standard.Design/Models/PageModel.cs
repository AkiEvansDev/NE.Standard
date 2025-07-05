using Microsoft.Extensions.Logging;
using NE.Standard.Design.Elements;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Design.Models
{
    public interface IUIPageModel
    {
        Task<(IUICallback? model, IUIPage? ui)> LoadAsync(UserContext user, IUIRequest request);
    }

    public abstract class PageModel<TModel, TPage> : IUIPageModel
        where TModel : IUICallback
        where TPage : IUIPage
    {
        protected readonly ILogger _logger;

        public PageModel(ILogger logger)
        {
            _logger = logger;
        }

        public async Task<(IUICallback? model, IUIPage? ui)> LoadAsync(UserContext user, IUIRequest request)
        {
            var model = await InitAsync(user);
            var ui = await RenderAsync(user);

            if (model is IUIRequestModel requestModel)
                requestModel.SetRequest(request);

            return (model, ui);
        }

        protected abstract Task<TModel> InitAsync(UserContext user);
        protected abstract Task<TPage> RenderAsync(UserContext user);
    }
}
