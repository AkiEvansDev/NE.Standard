using NE.Standard.Design.Components;
using System;
using System.Threading.Tasks;

namespace NE.Standard.Design.Data
{
    public interface INEView : IDisposable
    {
        ISessionContext Context { get; set; }
        IArea Area { get; }

        Task<bool> InitAsync();
    }

    public abstract class NEView<T> : INEView
        where T : ISessionContext
    {
        private ISessionContext _context = default!;

        ISessionContext INEView.Context
        {
            get => _context;
            set => _context = value;
        }

        protected T Context => (T)_context;

        public abstract IArea Area { get; }

        public virtual Task<bool> InitAsync()
        {
            return Task.FromResult(true);
        }

        public virtual void Dispose() { }
    }
}
