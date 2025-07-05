using Microsoft.Extensions.Logging;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Models;
using NE.Standard.Design.Styles;
using NE.Standard.Serialization;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace NE.Standard.Design
{
    [AttributeUsage(AttributeTargets.Class)]
    public class UIPermissionAttribute : Attribute
    {
        public string Permission { get; }
        public UIPermissionAttribute(string permission) => Permission = permission;
    }

    [ObjectSerializable]
    public class UserContext
    {
        public UIStyleConfig UIStyle { get; set; } = default!;

        public Dictionary<string, object>? Options { get; set; }
        public Dictionary<string, bool>? Permissions { get; set; }

        public bool HasPermission(string key)
            => Permissions?.TryGetValue(key, out var allowed) == true && allowed;
    }

    [ObjectSerializable]
    public class UIActionResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
    }

    [ObjectSerializable]
    public class UIPageResult : UIActionResult
    {
        public UIStyleConfig Style { get; set; } = default!;
        public UIAppLayout Layout { get; set; } = default!;
        public IServerModel? Model { get; set; }
        public IUIPage? Page { get; set; }
    }

    public interface IUIApp
    {
        string DefaultPage { get; }
        Task<UIPageResult> NavigateAsync(string key, string sessionId);
    }

    public abstract class UIApp : IUIApp
    {
        protected readonly ILogger _logger;
        private readonly Dictionary<string, Func<IPageModel>> _pages;
        private readonly Dictionary<string, string?> _permissionMap;

        public abstract string DefaultPage { get; }

        public UIApp(ILogger logger)
        {
            _logger = logger;
            _pages = new Dictionary<string, Func<IPageModel>>();
            _permissionMap = new Dictionary<string, string?>();
        }

        protected void RegisterPage<TPageModel>(string key, Func<IPageModel> factory)
            where TPageModel : IPageModel
        {
            _pages[key] = factory;

            var attr = typeof(TPageModel).GetCustomAttribute<UIPermissionAttribute>();
            _permissionMap[key] = attr?.Permission;
        }

        public async Task<UIPageResult> NavigateAsync(string key, string sessionId)
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
                (result.Model, result.Page) = await pageModel!.LoadAsync(context);

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

        protected abstract Task<UserContext> GetUserContextAsync(string sessionId);
        protected abstract Task<UIAppLayout> LayoutAsync(UserContext user);
    }
}
