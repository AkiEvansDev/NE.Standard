using Microsoft.Extensions.Logging;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Types;
using NE.Standard.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NE.Standard.Design.Models
{
    [AttributeUsage(AttributeTargets.Class)]
    public class UIPermissionAttribute : Attribute
    {
        public string Permission { get; }
        public UIPermissionAttribute(string permission) => Permission = permission;
    }

    public abstract class UIPageModel
    {
        protected readonly string _id;
        protected readonly ILogger _logger;

        protected internal readonly Dictionary<string, UIProperty> _propertiesMap;
        protected internal readonly Dictionary<string, UIButton> _buttonActionsMap;

        public UIPageModel(ILogger logger)
        {
            _id = GetType().Name.ToSnakeCase();
            _logger = logger;
            _propertiesMap = new Dictionary<string, UIProperty>();
            _buttonActionsMap = new Dictionary<string, UIButton>();
        }

        public abstract Task<(UIModel? model, UIPage? ui)> LoadAsync(UserContext user, IUICallback callback);

        protected internal void Map(UIContainer container, ref int id)
        {
            foreach (var element in container.Elements)
            {
                element.Id = GenerateUID(element, id);
                id++;

                if (element is UIContainer subContainer)
                {
                    Map(subContainer, ref id);
                }
                else if (element is UIProperty property)
                {
                    if (!property.BindingProperty.IsNull())
                        _propertiesMap.Add(property.BindingProperty!, property);
                }
                else if (element is UIButton button)
                {
                    if (!button.Action.IsNull())
                        _buttonActionsMap.Add(button.Action!, button);
                }
            }
        }

        private string GenerateUID(UIElement el, int id)
        {
            var prefix = "el";
            if (el is UIProperty)
                prefix = "inp";
            else if (el is UIButton)
                prefix = "btn";
            else if (el is UIDialog)
                prefix = "dlg";
            else if (el is UIContainer)
                prefix = "cnt";

            return $"{_id}_{prefix}_{id}";
        }
    }

    public abstract class UIPageModel<TModel, TPage> : UIPageModel
        where TModel : UIModel
        where TPage : UIPage
    {
        protected TModel Model { get; private set; } = default!;

        public UIPageModel(ILogger logger) : base(logger) { }

        public override async Task<(UIModel? model, UIPage? ui)> LoadAsync(UserContext user, IUICallback callback)
        {
            _propertiesMap.Clear();
            _buttonActionsMap.Clear();

            Model = await InitAsync(user);

            var ui = await RenderAsync(user);
            var id = 0;

            Map(ui, ref id);

            Model.SetCallback(callback, _propertiesMap.Values.ToDictionary(p => p.BindingProperty!, p => p.Id));

            return (Model, ui);
        }

        protected abstract Task<TModel> InitAsync(UserContext user);
        protected abstract Task<TPage> RenderAsync(UserContext user);

        public UIActionResult SyncProperties(Dictionary<string, object?> values)
        {
            var mode = Model.SyncMode;
            Model.SyncMode = SyncMode.None;

            try
            {
                foreach (var (id, value) in values)
                {
                    if (_propertiesMap.TryGetValue(id, out var prop))
                        Model.SetValue(prop.BindingProperty!, value);
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

        public async Task<UIActionResult> InvokeActionAsync(string action)
        {
            if (_buttonActionsMap.TryGetValue(action, out var button))
            {
                var result = await Model.ExecuteAsync(button.Action!, button.ServerParameters);

                if (!result.Success)
                    _logger.LogError("Error while InvokeActionAsync for page [Page]: [Error]", GetType().Name, result.ErrorMessage);

                return result;
            }

            return new UIActionResult { Success = false, ErrorMessage = "Action not found" };
        }
    }
}
