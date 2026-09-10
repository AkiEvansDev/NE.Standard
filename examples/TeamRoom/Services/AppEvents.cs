using System;
using System.Collections.Generic;
using System.Threading;

namespace TeamRoom.Services;

/// <summary>
/// What happened somewhere in the application, told to every open page that cares: a controller subscribes when it
/// starts and lets go when it is disposed, and pushes what it hears into its own runtime.
/// </summary>
/// <remarks>
/// In-process on purpose: one host, one list. Handlers run on the publisher's thread and must not block on another
/// runtime — they hand the work to <c>Context.Runtime.InvokeAsync</c> and return.
/// </remarks>
public sealed class AppEvents
{
    private readonly Lock _sync = new();
    private readonly List<Action<AppEvent>> _handlers = [];

    public IDisposable Subscribe(Action<AppEvent> handler)
    {
        ArgumentNullException.ThrowIfNull(handler);

        lock (_sync)
            _handlers.Add(handler);

        return new Subscription(this, handler);
    }

    public void Publish(AppEvent appEvent)
    {
        ArgumentNullException.ThrowIfNull(appEvent);

        Action<AppEvent>[] handlers;

        lock (_sync)
            handlers = [.. _handlers];

        foreach (Action<AppEvent> handler in handlers)
            handler(appEvent);
    }

    private void Unsubscribe(Action<AppEvent> handler)
    {
        lock (_sync)
            _ = _handlers.Remove(handler);
    }

    private sealed class Subscription(AppEvents owner, Action<AppEvent> handler) : IDisposable
    {
        public void Dispose()
            => owner.Unsubscribe(handler);
    }
}

public abstract record AppEvent;

/// <summary>
/// A message landed in a conversation; the readers of that conversation want it, everyone else wants a count. The origin is
/// the controller that sent it, which appended it inside its own command and must not do so twice.
/// </summary>
public sealed record MessagePosted(string ConversationId, long MessageId, string AuthorId, object? Origin) : AppEvent;

/// <summary>A message's text changed; the runtime that changed it is <paramref name="Origin"/>, so it does not apply it twice.</summary>
public sealed record MessageChanged(string ConversationId, long MessageId, object? Origin) : AppEvent;

/// <summary>A message is gone, with whatever was attached to it.</summary>
public sealed record MessageDeleted(string ConversationId, long MessageId, object? Origin) : AppEvent;

/// <summary>A conversation was created or gained a member; conversation lists re-read.</summary>
public sealed record ConversationsChanged(string? AccountId) : AppEvent;

/// <summary>The account read a conversation up to its newest message; its other pages' unread count is stale until they count again.</summary>
public sealed record MessagesRead(string AccountId) : AppEvent;

/// <summary>The folder tree changed shape or a file's text was saved.</summary>
public sealed record DocumentsChanged(string? NodeId) : AppEvent;

/// <summary>An account was blocked, deleted, or changed its name or picture; its own pages react, and rows showing it re-read.</summary>
public sealed record AccountChanged(string AccountId, AccountChangeKind Kind) : AppEvent;

public enum AccountChangeKind
{
    Profile,
    Blocked,
    Deleted
}
