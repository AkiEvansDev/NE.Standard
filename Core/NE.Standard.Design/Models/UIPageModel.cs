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
    public abstract class UIPageModel
    {
        protected readonly ILogger _logger;
        protected internal readonly Dictionary<int, UIProperty> _propertiesMap;
        protected internal readonly Dictionary<string, UIProperty> _propertyBindingsMap;
        protected internal readonly Dictionary<int, UIButton> _buttonsMap;

        public UIPageModel(ILogger logger)
        {
            _logger = logger;
            _propertiesMap = new Dictionary<int, UIProperty>();
            _propertyBindingsMap = new Dictionary<string, UIProperty>();
            _buttonsMap = new Dictionary<int, UIButton>();
        }

        public abstract (UIModel? model, UIPage? ui) Load();

        protected internal void Map(UIContainer container, ref int id)
        {
            foreach (var element in container.Elements)
            {
                element.Id = id;
                id++;

                if (element is UIContainer subContainer)
                {
                    Map(subContainer, ref id);
                }
                else if (element is UIProperty property)
                {
                    _propertiesMap.Add(element.Id, property);
                    if (!property.BindingProperty.IsNull())
                        _propertyBindingsMap.Add(property.BindingProperty!, property);
                }
                else if (element is UIButton button)
                {
                    _buttonsMap.Add(element.Id, button);
                }
            }
        }
    }

    public abstract class UIPageModel<TModel, TPage> : UIPageModel
        where TModel : UIModel
        where TPage : UIPage
    {
        private Action<List<(int property, object? value)>>? _syncCallback;
        private Action<string>? _openDialogCallback;
        private Action<string, string, string?>? _sendNotificationCallback;

        protected TModel Model { get; private set; } = default!;

        public UIPageModel(ILogger logger) : base(logger) { }

        public override (UIModel? model, UIPage? ui) Load()
        {
            try
            {
                _propertiesMap.Clear();
                _propertyBindingsMap.Clear();
                _buttonsMap.Clear();

                Model = Init();
                Model.SyncRequired += OnSyncRequired;
                Model.OpenDialogRequired += (key) => _openDialogCallback?.Invoke(key);
                Model.SendNotificationRequired += (key, label, description) => _sendNotificationCallback?.Invoke(key, label, description);

                var ui = Render();
                var id = 0;

                Map(ui, ref id);

                return (Model, ui);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while loading page [Page]", GetType().Name);
            }

            return (null, null);
        }

        protected abstract TModel Init();
        protected abstract TPage Render();

        private void OnSyncRequired(List<(string property, object? value)> updates)
        {
            var send = new List<(int id, object? value)>();

            foreach (var (property, value) in updates)
            {
                if (_propertyBindingsMap.TryGetValue(property, out var prop))
                    send.Add((prop.Id, value));
            }

            _syncCallback?.Invoke(send);
        }

        public bool SyncProperties(Dictionary<int, object?> values)
        {
            var mode = Model.SyncMode;
            Model.SyncMode = SyncMode.None;

            try
            {
                foreach (var (id, value) in values)
                {
                    if (_propertiesMap.TryGetValue(id, out var prop) && !prop.BindingProperty.IsNull())
                        Model.SetValue(prop.BindingProperty!, value);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while SyncProperties for page [Page]", GetType().Name);
            }
            finally
            {
                Model.SyncMode = mode;
            }

            return false;
        }

        public async Task<bool> InvokeActionAsync(int id)
        {
            try
            {
                if (_buttonsMap.TryGetValue(id, out var button) && !button.Action.IsNull())
                {
                    if (button.IsAsync)
                        await Model.ExecuteAsync(button.Action!, button.Parameters);
                    else
                        Model.Execute(button.Action!, button.Parameters);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while InvokeActionAsync on page [Page]", GetType().Name);
            }

            return false;
        }

        public void SetSyncCallback(Action<List<(int property, object? value)>> callback)
        {
            _syncCallback = callback;
        }

        public void SetOpenDialogCallback(Action<string> callback)
        {
            _openDialogCallback = callback;
        }

        public void SetSendNotificationCallback(Action<string, string, string?> callback)
        {
            _sendNotificationCallback = callback;
        }
    }
}
