using NE.Standard.Design.Components;
using NE.Standard.Serialization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Design.Data
{
    public enum UpdateType
    {
        /// <summary>
        /// Only for property.
        /// </summary>
        Set = 0,

    }

    [NEObject]
    public class UIUpdate
    {
        public UpdateType Type { get; set; } = UpdateType.Set;
        public string Property { get; set; } = default!;
        public object? Value { get; set; }
    }

    public struct UINotification
    {
        public BlockStyle Style { get; set; }
        public string Message { get; set; }

        public UINotification(string message, BlockStyle style = BlockStyle.Info)
        {
            Style = style;
            Message = message;
        }
    }

    public interface IClientBridge
    {
        Task<bool> UpdateUI(List<UIUpdate> updates);
        Task<bool> ShowDialog(string id);
        Task<bool> ShowNotification(UINotification notification);
    }

    public interface IInternalDataContext
    {
        string Id { get; set; }
        string? CircuitId { get; set; }

        string? Key { get; set; }
        IInternalModel? Model { get; set; }
        IInternalView? View { get; set; }

        IClientBridge? Bridge { get; set; }

        Task<bool> UpdateUI(List<UIUpdate> updates);
    }

    public interface IInternalDataContextProvider
    {
        IInternalDataContext? GetCurrentDataContext();
    }

    public interface INEDataContextProvider
    {
        NEDataContext Create(string id, IEnumerable<KeyValuePair<string, string>> data);
    }

    public class NEDataContext : IInternalDataContext
    {
        private IClientBridge? _bridge;

        string IInternalDataContext.Id { get; set; } = default!;
        string? IInternalDataContext.CircuitId { get; set; }

        string? IInternalDataContext.Key { get; set; }
        IInternalModel? IInternalDataContext.Model { get; set; }
        IInternalView? IInternalDataContext.View { get; set; }

        IClientBridge? IInternalDataContext.Bridge
        {
            get => _bridge;
            set => _bridge = value;
        }

        Task<bool> IInternalDataContext.UpdateUI(List<UIUpdate> updates)
        {
            if (_bridge != null)
                return _bridge.UpdateUI(updates);

            return Task.FromResult(false);
        }

        public Task<bool> ShowDialog(string id)
        {
            if (_bridge != null)
                return _bridge.ShowDialog(id);

            return Task.FromResult(false);
        }

        public Task<bool> ShowNotification(UINotification notification)
        {
            if (_bridge != null)
                return _bridge.ShowNotification(notification);

            return Task.FromResult(false);
        }
    }
}
