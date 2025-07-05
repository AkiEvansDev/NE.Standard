using Microsoft.Extensions.Logging;
using NE.Standard.Design.Elements;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Design.Models
{
    public interface IUIPageModel
    {
        Task<(IUIModel? model, IUIPage? ui)> LoadAsync(UserContext user, IUIRequest request);
        UIActionResult SyncProperties(List<UpdateProperty> updates);
        Task<UIActionResult> InvokeActionAsync(string action, object[]? parameters, List<UpdateProperty>? updates);
    }

    public abstract class UIPageModel<TModel, TPage> : IUIPageModel
        where TModel : IUIModel
        where TPage : IUIPage
    {
        protected readonly ILogger _logger;
        protected TModel Model { get; private set; } = default!;

        public UIPageModel(ILogger logger)
        {
            _logger = logger;
        }

        public async Task<(IUIModel? model, IUIPage? ui)> LoadAsync(UserContext user, IUIRequest request)
        {
            Model = await InitAsync(user);
            var ui = await RenderAsync(user);

            if (ui is IUIRequestModel requestModel)
                requestModel.SetRequest(request);

            return (Model, ui);
        }

        protected abstract Task<TModel> InitAsync(UserContext user);
        protected abstract Task<TPage> RenderAsync(UserContext user);

        public UIActionResult SyncProperties(List<UpdateProperty> updates)
        {
            var mode = Model.SyncMode;
            Model.SyncMode = SyncMode.None;

            try
            {
                foreach (var update in updates)
                {
                    Model.UpdateProperty(update);
                }

                return new UIActionResult { Success = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while SyncProperties for page [Page]", GetType().Name);
                return new UIActionResult { Success = false, ErrorMessage = ex.Message };
            }
            finally
            {
                Model.SyncMode = mode;
            }
        }

        public async Task<UIActionResult> InvokeActionAsync(string action, object[]? parameters, List<UpdateProperty>? updates)
        {
            UIActionResult result;

            if (updates != null)
            {
                result = SyncProperties(updates);
                if (!result.Success)
                    return result;
            }

            result = await Model.ExecuteAsync(action, parameters);

            if (!result.Success)
                _logger.LogError("Error while InvokeActionAsync for page [Page]: [Error]", GetType().Name, result.ErrorMessage);

            return result;
        }
    }
}
