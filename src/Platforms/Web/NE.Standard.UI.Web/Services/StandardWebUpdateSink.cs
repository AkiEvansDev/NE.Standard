using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Application;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Web.Services;

internal sealed partial class StandardWebUpdateSink : IUIUpdateSink
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Sending server UI changes to {InstanceCount} connection(s), tab '{ClientWindowId}'.")]
        public static partial void SendingChanges(ILogger logger, int instanceCount, string clientWindowId);

        [LoggerMessage(EventId = 2, Level = LogLevel.Debug, Message = "Sending command result to connection '{InstanceId}', tab '{ClientWindowId}'.")]
        public static partial void SendingCommandResult(ILogger logger, string instanceId, string clientWindowId);
    }

    private readonly IHubContext<WebUIHub> _hub;
    private readonly WebOutgoingValues _outgoing;
    private readonly IServiceProvider _services;
    private readonly ILogger<StandardWebUpdateSink> _logger;

    // The services a pushed language switch is completed from are read when one is pushed: the application is built after the sink.
    public StandardWebUpdateSink(IHubContext<WebUIHub> hub, WebOutgoingValues outgoing, IServiceProvider services, ILogger<StandardWebUpdateSink> logger)
    {
        ArgumentNullException.ThrowIfNull(hub);
        ArgumentNullException.ThrowIfNull(outgoing);
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(logger);

        _hub = hub;
        _outgoing = outgoing;
        _services = services;
        _logger = logger;
    }

    public async Task SendChangesAsync(UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(instanceIds);
        ArgumentNullException.ThrowIfNull(changes);

        handle.Instance.Validate();
        changes.Validate();

        if (instanceIds.Count == 0)
            return;

        Log.SendingChanges(_logger, instanceIds.Count, handle.Instance.WindowId);

        await _hub.Clients
            .Clients([.. instanceIds])
            .SendAsync("ui.changes", _outgoing.Stage(changes, handle.Session.SessionId, instanceIds.Count), cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task SendCommandResultAsync(UIHandle handle, UICommandExecutionResult result, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(result);

        handle.Instance.Validate();
        result.Validate();

        Log.SendingCommandResult(_logger, handle.Instance.Id, handle.Instance.WindowId);

        UICommandExecutionResult sent = NameWordsOfStoredLanguage(handle, result);

        await _hub.Clients
            .Client(handle.Instance.Id)
            .SendAsync("ui.commandResult", _outgoing.Stage(sent, handle.Session.SessionId, 1), cancellationToken)
            .ConfigureAwait(false);
    }

    /// <summary>
    /// A switch pushed for a session that already holds the language — a command's own <c>UpdateSessionAsync</c> — names where the
    /// words are, so the page fetches them without telling the session again. On a copy: the runtime's own result stays as it was.
    /// </summary>
    private UICommandExecutionResult NameWordsOfStoredLanguage(UIHandle handle, UICommandExecutionResult result)
    {
        ClientEffect[] effects = result.Command.Effects;
        ClientEffect[]? named = null;

        for (var i = 0; i < effects.Length; i++)
        {
            if (effects[i] is not SetLanguageEffect { Href: null } effect || !string.Equals(effect.Language, handle.Session.Language, StringComparison.Ordinal))
                continue;

            UIApplication application = _services.GetRequiredService<UIApplication>();
            ITranslator translator = application.Translator;
            var language = WebWordsEndpoint.TableLanguage(translator, effect.Language);

            named ??= [.. effects];
            named[i] = new SetLanguageEffect(effect.Language)
            {
                Href = WebWordsEndpoint.Resolve(translator, language, _services.GetServices<IUIStringsSource>(), application.MissingWords is not null).Href
            };
        }

        if (named is null)
            return result;

        return new UICommandExecutionResult
        {
            Command = result.Command.Success ? UICommandResult.Ok(named) : UICommandResult.Fail(result.Command.Error!, named),
            Changes = result.Changes,
            Accepted = result.Accepted,
            RequestId = result.RequestId
        };
    }
}
