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
        Set = -1,

        /// <summary>
        /// An item was added to the collection.
        /// </summary>
        Add = 0,
        /// <summary>
        /// An item was removed from the collection.
        /// </summary>
        Remove = 1,
        /// <summary>
        /// An item was replaced in the collection.
        /// </summary>
        Replace = 2,
        /// <summary>
        /// An item was moved within the collection.
        /// </summary>
        Move = 3,
        /// <summary>
        /// The content of the collection was cleared.
        /// </summary>
        Reset = 4
    }

    [NEObject]
    public class UIUpdate
    {
        public UpdateType Type { get; set; } = UpdateType.Set;
        public string Property { get; set; } = default!;

        public object? Value { get; set; }

        public int? NewStartingIndex { get; set; }
        public List<object>? NewItems { get; set; }

        public int? OldStartingIndex { get; set; }
        public List<object>? OldItems { get; set; }
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

    public interface IInternalDataContext
    {
        string Id { get; set; }
        string? CircuitId { get; set; }

        string? Key { get; set; }
        IInternalModel? Model { get; set; }
        IInternalView? View { get; set; }

        Task<bool> UpdateUI(List<UIUpdate> updates);
    }

    public interface IInternalDataContextProvider
    {
        IInternalDataContext? GetCurrentDataContext();
    }

    public interface IDataContextProvider
    {
        DataContext Create(string client);
    }

    public class DataContext : IInternalDataContext
    {
        string IInternalDataContext.Id { get; set; } = default!;
        string? IInternalDataContext.CircuitId { get; set; }

        string? IInternalDataContext.Key { get; set; }
        IInternalModel? IInternalDataContext.Model { get; set; }
        IInternalView? IInternalDataContext.View { get; set; }

        Task<bool> IInternalDataContext.UpdateUI(List<UIUpdate> updates)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ShowDialog(string id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ShowNotification(UINotification notification)
        {
            throw new NotImplementedException();
        }
    }
}
