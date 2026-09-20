using System;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Stages values too large for the hub beside the change set; the client fetches by token before applying (<c>docs/VALUES.md</c>
/// §2). The one gate for every outgoing change set. A value serialized to measure and found small is reused as-is
/// (<see cref="WebRawJsonValue"/>), so it's serialized only once.
/// </summary>
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

    /// <summary>The change set with its large values staged for a session's <paramref name="readers"/> tabs; the same instance when none is large.</summary>
    public ServerChangeSet Stage(ServerChangeSet changes, string sessionId, int readers)
    {
        ArgumentNullException.ThrowIfNull(changes);

        ServerUIUpdate[]? staged = null;

        for (var i = 0; i < changes.Updates.Length; i++)
        {
            if (changes.Updates[i] is not ServerValueUIUpdate update || MeasuredJson(update.Value) is not { } json)
                continue;

            staged ??= [.. changes.Updates];
            staged[i] = json.Length > LargeValueBytes
                ? new ServerValueUIUpdate { Address = update.Address, ValueToken = _store.StageOutgoing(sessionId, json, readers), ExceptInstanceId = update.ExceptInstanceId }
                : new ServerValueUIUpdate { Address = update.Address, Value = new WebRawJsonValue(json), ExceptInstanceId = update.ExceptInstanceId };
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
    public UICommandExecutionResult Stage(UICommandExecutionResult result, string sessionId, int readers)
    {
        ArgumentNullException.ThrowIfNull(result);

        ServerChangeSet changes = Stage(result.Changes, sessionId, readers);

        return ReferenceEquals(changes, result.Changes) ? result : new UICommandExecutionResult { Command = result.Command, Changes = changes };
    }
}
