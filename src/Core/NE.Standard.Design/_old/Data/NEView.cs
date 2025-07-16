using NE.Standard.Design._old.UI.Common;
using System.Threading.Tasks;

namespace NE.Standard.Design._old.Data
{
    public interface IInternalView
    {
        IInternalDataContext InternalDataContext { get; set; }
        IArea Area { get; }

        Task InitAsync();
    }

    public abstract class NEView<T> : IInternalView
        where T : NEDataContext
    {
        private IInternalDataContext _dataContext = default!;

        IInternalDataContext IInternalView.InternalDataContext
        {
            get => _dataContext;
            set => _dataContext = value;
        }

        protected T DataContext => (T)_dataContext;

        public abstract IArea Area { get; }

        public virtual Task InitAsync()
        {
            return Task.CompletedTask;
        }
    }
}
