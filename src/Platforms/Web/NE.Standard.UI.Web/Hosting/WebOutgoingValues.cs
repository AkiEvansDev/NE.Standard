using System;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The one gate for every outgoing change set: stages values too large for the hub beside it, which the client fetches by token
/// before applying (<c>docs/VALUES.md</c> §2).
/// </summary>
/// <remarks>A value serialized to measure and found small is reused as-is (<see cref="WebRawJsonValue"/>), so it's serialized only once.</remarks>
internal sealed class WebOutgoingValues
{
    /// <summary>The size past which a value is staged, in bytes of its JSON; the client's own threshold for the other direction.</summary>
    public const int LargeValueBytes = 8 * 1024;

    private readonly WebValueStagingStore _store;
    private readonly JsonSerializerOptions _options;

    public WebOutgoingValues(WebValueStagingStore store, IOptions<JsonHubProtocolOptions> hubProtocol)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentNullException.ThrowIfNull(hubProtocol);

        _store = store;
        // The hub's own options, converters included: the value is measured as the hub would write it.
        _options = hubProtocol.Value.PayloadSerializerOptions;
    }

    /// <summary>
    /// The change set with its large values staged for the session's <paramref name="readers"/>, the instances it goes to; the same
    /// instance when none is large. A value the session's outgoing allowance has no room for goes inline.
    /// </summary>
    public ServerChangeSet Stage(ServerChangeSet changes, string sessionId, IReadOnlyCollection<string> readers)
        => Stage(changes, sessionId, readers, attachOf: null);

    /// <summary>
    /// An attach's initial changes staged for its connection alone; whatever the connection's previous attach staged goes first, since
    /// this snapshot replaces it.
    /// </summary>
    public ServerChangeSet StageAttach(ServerChangeSet changes, string sessionId, string connectionId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(connectionId);

        _store.ReleaseAttach(connectionId);

        return Stage(changes, sessionId, [connectionId], connectionId);
    }

    private ServerChangeSet Stage(ServerChangeSet changes, string sessionId, IReadOnlyCollection<string> readers, string? attachOf)
    {
        ArgumentNullException.ThrowIfNull(changes);

        ServerUIUpdate[]? staged = null;

        for (var i = 0; i < changes.Updates.Length; i++)
        {
            if (changes.Updates[i] is not ServerValueUIUpdate update || MeasuredJson(update.Value) is not { } json)
                continue;

            staged ??= [.. changes.Updates];
            staged[i] = json.Length > LargeValueBytes && _store.TryStageOutgoing(sessionId, json, readers, attachOf, out var token)
                ? new ServerValueUIUpdate { Address = update.Address, ValueToken = token, Content = update.Content, ExceptInstanceId = update.ExceptInstanceId }
                : new ServerValueUIUpdate { Address = update.Address, Value = new WebRawJsonValue(json), Content = update.Content, ExceptInstanceId = update.ExceptInstanceId };
        }

        return staged is null ? changes : new ServerChangeSet { Updates = staged };
    }

    /// <summary>
    /// The value's JSON when serializing was needed to measure it, or null; a scalar is never large, and a short text is judged
    /// by length alone.
    /// </summary>
    private byte[]? MeasuredJson(object? value)
    {
        if (value is null or bool or char or Enum or DateTime or DateTimeOffset or TimeSpan or DateOnly or TimeOnly or Guid or decimal || value.GetType().IsPrimitive)
            return null;

        // A character is at most six bytes of JSON escaped: a text this short cannot pass the threshold.
        if (value is string text && text.Length * 6 <= LargeValueBytes)
            return null;

        return JsonSerializer.SerializeToUtf8Bytes(value, value.GetType(), _options);
    }

    /// <summary>A command's result with its changes staged.</summary>
    public UICommandExecutionResult Stage(UICommandExecutionResult result, string sessionId, IReadOnlyCollection<string> readers)
    {
        ArgumentNullException.ThrowIfNull(result);

        ServerChangeSet changes = Stage(result.Changes, sessionId, readers);

        return ReferenceEquals(changes, result.Changes) ? result : result with { Changes = changes };
    }
}
