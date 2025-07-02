using Microsoft.Extensions.Logging;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Models;
using NE.Standard.Design.Styles;
using NE.Standard.Serialization;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace NE.Standard.Design
{
    public interface IUICallback
    {
        void RequestSync(List<(string property, object? value)> updates);
        void RequestNavigate(string key);
        void RequestOpenDialog(string key);
        void RequestNotification(UINotification notification);
    }

    [ObjectSerializable]
    public class UIPageResult : UIActionResult
    {
        public UIStyleConfig Style { get; set; } = default!;
        public UIAppLayout Layout { get; set; } = default!;
        public UIModel? Model { get; set; }
        public UIPage? Page { get; set; }
    }

    public abstract class UIApp<TUserContext>
        where TUserContext : UserContext
    {
        protected readonly ILogger _logger;
        protected readonly Dictionary<string, Func<UIPageModel>> _pages;
        protected readonly Dictionary<string, string?> _permissionMap;

        public UIApp(ILogger logger)
        {
            _logger = logger;
            _pages = new Dictionary<string, Func<UIPageModel>>();
            _permissionMap = new Dictionary<string, string?>();
        }

        protected void RegisterPage<TPageModel>(string key, Func<TPageModel> factory)
            where TPageModel : UIPageModel
        {
            _pages[key] = factory;

            var attr = typeof(TPageModel).GetCustomAttribute<UIPermissionAttribute>();
            _permissionMap[key] = attr?.Permission;
        }

        public async Task<UIPageResult> NavigateAsync(string key, string sessionId, IUICallback callback)
        {
            var context = await GetUserContextAsync(sessionId);

            var result = new UIPageResult
            {
                Style = context.UIStyle,
                Layout = await LayoutAsync(context),
            };

            if (!_pages.TryGetValue(key, out var factory))
            {
                _logger.LogWarning("Not Found. Page [Page] is not registered", key);
                result.ErrorMessage = $"Not Found";
                return result;
            }

            var requiredPermission = _permissionMap[key];
            if (requiredPermission != null && !context.HasPermission(requiredPermission))
            {
                _logger.LogWarning("Unauthorized. [User] has not permission for [Page]", sessionId, key);
                result.ErrorMessage = "Unauthorized";
                return result;
            }

            try
            {
                var pageModel = factory();
                (result.Model, result.Page) = await pageModel!.LoadAsync(context, callback);

                result.Success = true;
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while loading page [Page]", key);
                result.ErrorMessage = ex.Message;
                return result;
            }
        }

        public abstract Task<TUserContext> GetUserContextAsync(string sessionId);
        public abstract Task<UIAppLayout> LayoutAsync(UserContext user);
    }
}
