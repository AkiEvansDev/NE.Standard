using NE.Standard.Types;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Design.Data
{
    public interface ISessionContext
    {
        string? CircuitId { get; set; }

        string? Key { get; set; }
        INEModel? Model { get; set; }
        INEView? View { get; set; }

        Task<bool> InitAsync(IEnumerable<KeyValuePair<string, string>> data);

        Task Update(IEnumerable<RecursiveChangedEventArgs> changes);
    }

    public interface ISessionContextProvider
    {
        ISessionContext? GetCurrentSessionContext();
    }

    public class SessionContext : ISessionContext, IDisposable
    {
        string? ISessionContext.CircuitId { get; set; }

        string? ISessionContext.Key { get; set; }
        INEModel? ISessionContext.Model { get; set; }
        INEView? ISessionContext.View { get; set; }

        public virtual Task<bool> InitAsync(IEnumerable<KeyValuePair<string, string>> data)
        {
            return Task.FromResult(true);
        }

        public Task Update(IEnumerable<RecursiveChangedEventArgs> changes)
        {
            throw new NotImplementedException();
        }

        public virtual void Dispose()
        {
            if (this is ISessionContext session)
            {
                session.View?.Dispose();
                session.Model?.Dispose();
            }
        }
    }
}
