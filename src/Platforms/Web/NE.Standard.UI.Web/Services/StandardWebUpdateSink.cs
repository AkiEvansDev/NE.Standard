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
using NE.Standard.UI.Shell.Sessions;
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
            .SendAsync("ui.changes", _outgoing.Stage(changes, handle.Session.SessionId, instanceIds), cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task SendCommandResultAsync(UIHandle handle, UICommandExecutionResult result, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(result);

        handle.Instance.Validate();
        result.Validate();

        Log.SendingCommandResult(_logger, handle.Instance.Id, handle.Instance.WindowId);

        UICommandExecutionResult sent = MarkStoredSettings(handle, result);

        await _hub.Clients
            .Client(handle.Instance.Id)
            .SendAsync("ui.commandResult", _outgoing.Stage(sent, handle.Session.SessionId, [handle.Instance.Id]), cancellationToken)
            .ConfigureAwait(false);
    }

    /// <summary>
    /// A switch pushed for a session that already holds the setting — a command's own <c>UpdateSessionAsync</c>, another page's switch
    /// reaching this one — goes out marked stored, so the page applies it without telling the session again, whose write would
    /// reach the session's pages once more and could put an older value back: a language names where its words are, colours carry
    /// their stylesheet, a theme is marked stored. On a copy: the runtime's own result stays as it was.
    /// </summary>
    private UICommandExecutionResult MarkStoredSettings(UIHandle handle, UICommandExecutionResult result)
    {
        ClientEffect[] effects = result.Command.Effects;
        ClientEffect[]? named = null;

        for (var i = 0; i < effects.Length; i++)
        {
            if (MarkStored(handle.Session, effects[i]) is not ClientEffect marked)
                continue;

            named ??= [.. effects];
            named[i] = marked;
        }

        if (named is null)
            return result;

        return result with { Command = result.Command.Success ? UICommandResult.Ok(named) : UICommandResult.Fail(result.Command.Error!, named) };
    }

    /// <summary>The effect marked stored where it switches to what the session holds and is not marked yet; otherwise none.</summary>
    private ClientEffect? MarkStored(IUserSessionContext session, ClientEffect effect)
        => effect switch
        {
            SetLanguageEffect { Href: null } language when string.Equals(language.Language, session.Language, StringComparison.Ordinal) => new SetLanguageEffect(language.Language)
            {
                Href = WebWordsEndpoint.Resolve(_services.GetRequiredService<UIApplication>(), language.Language, _services.GetServices<IUIStringsSource>()).Href
            },
            SetThemeEffect { Stored: false } theme when theme.Mode == session.ThemeMode => new SetThemeEffect(theme.Mode) { Stored = true },
            SetThemeColorsEffect { Css: null } colors when Equals(colors.Colors, session.ThemeColors) => new SetThemeColorsEffect(colors.Colors)
            {
                Css = WebThemeColorsCss.For(_services.GetRequiredService<UIApplication>().Theme, colors.Colors)
            },
            _ => null
        };
}
