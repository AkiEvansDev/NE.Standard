using Microsoft.Extensions.Logging;
using NE.Standard.Design.Components;
using NE.Standard.Types;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Design.Data
{
    public interface IPlatformRefresh
    {
        string Id { get; }
        void Refresh();
    }

    public interface IPlatformBinding
    {
        string GetKey(IBlock block);
        bool TryGetPath(IBlock block, string property, out string path);

        void OpenBinding(IBlock block, IPlatformRefresh blockRefresh);
        void CloseBinding(IBlock block);

        Task<bool> Update(IEnumerable<RecursiveChangedEventArgs> changes, INEModel model, IPlatformBridge bridge);

        bool TryGetIds(string path, out string[] ids);
        bool TryGetContext(string path, out IPlatformRefresh blockRefresh);
    }

    public interface IPlatformBridge
    {
        Task<bool> Set(IEnumerable<KeyValuePair<object?, string[]>> set);
        Task<bool> Call(string name, params object[]? parameters);
    }

    public interface ISessionContext : IDisposable
    {
        ILogger Logger { get; }

        string? CircuitId { get; set; }

        IPlatformBinding? BindingContext { get; set; }
        IPlatformBridge? Bridge { get; set; }

        string? Uri { get; set; }
        string? Query { get; set; }

        INEModel? Model { get; set; }
        INEView? View { get; set; }

        Task<bool> InitAsync(IEnumerable<KeyValuePair<string, string>> parameters);

        Task Update(IEnumerable<RecursiveChangedEventArgs> changes);
    }

    public interface ISessionContextProvider
    {
        ISessionContext? GetCurrentSessionContext();
    }

    public class SessionContext : ISessionContext
    {
        public ILogger Logger { get; }

        string? ISessionContext.CircuitId { get; set; }

        IPlatformBinding? ISessionContext.BindingContext { get; set; }
        IPlatformBridge? ISessionContext.Bridge { get; set; }

        string? ISessionContext.Uri { get; set; }
        string? ISessionContext.Query { get; set; }

        INEModel? ISessionContext.Model { get; set; }
        INEView? ISessionContext.View { get; set; }

        public SessionContext(ILogger<SessionContext> logger)
        {
            Logger = logger;
        }

        public virtual Task<bool> InitAsync(IEnumerable<KeyValuePair<string, string>> parameters)
        {
            return Task.FromResult(true);
        }

        public async Task Update(IEnumerable<RecursiveChangedEventArgs> changes)
        {
            if (this is ISessionContext session && session.Model != null && session.Bridge != null)
            {
                if (session.BindingContext != null && !await session.BindingContext.Update(changes, session.Model, session.Bridge))
                {
                    Logger.LogWarning("Client `Update` return false.");
                }
            }
            else
            {
                Logger.LogError("False SessionContext data.");
            }
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
