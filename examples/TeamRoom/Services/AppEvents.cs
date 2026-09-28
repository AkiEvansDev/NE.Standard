using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace TeamRoom.Services;

/// <summary>
/// What happened somewhere in the application, told to every open page that cares: a controller subscribes when it
/// starts and lets go when it is disposed, and pushes what it hears into its own runtime.
/// </summary>
/// <remarks>
/// In-process on purpose: one host, one list. Handlers run on the publisher's thread, inside the publisher's command, so they
/// only decide whether the event concerns them and queue the work (<c>TeamRoomController.Push</c>); nothing is read there.
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
/// the controller that sent it, which appended it inside its own command and must not do so twice. The readers are the
/// accounts that may read the conversation, or <see langword="null"/> for a room, which is everyone's.
/// </summary>
public sealed record MessagePosted(string ConversationId, long MessageId, string AuthorId, IReadOnlyList<string>? Readers, object? Origin) : AppEvent
{
    /// <summary>Whether the account can read the conversation, and so has a count or a feed that moves with it.</summary>
    public bool Reaches(string accountId)
        => Readers is null || Readers.Contains(accountId);
}

/// <summary>A message's text changed; the runtime that changed it is <paramref name="Origin"/>, so it does not apply it twice.</summary>
public sealed record MessageChanged(string ConversationId, long MessageId, object? Origin) : AppEvent;

/// <summary>A message is gone, with whatever was attached to it; an unread count that held it moves. Readers as on <see cref="MessagePosted"/>.</summary>
public sealed record MessageDeleted(string ConversationId, long MessageId, IReadOnlyList<string>? Readers, object? Origin) : AppEvent
{
    /// <summary>Whether the account can read the conversation.</summary>
    public bool Reaches(string accountId)
        => Readers is null || Readers.Contains(accountId);
}

/// <summary>A conversation was created or gained a member; the lists of <paramref name="AccountId"/> re-read, or every list when it is <see langword="null"/>.</summary>
public sealed record ConversationsChanged(string? AccountId) : AppEvent
{
    /// <summary>Whether the account's list shows the change.</summary>
    public bool Reaches(string accountId)
        => AccountId is null || AccountId == accountId;
}

/// <summary>The account read a conversation up to its newest message; its other pages' unread count is stale until they count again.</summary>
public sealed record MessagesRead(string AccountId) : AppEvent;

/// <summary>
/// The folder tree or a file's text changed. <paramref name="TreeChanged"/> says whether the tree itself moved — a node added,
/// renamed, moved or deleted — or only the text of <paramref name="NodeId"/>.
/// </summary>
public sealed record DocumentsChanged(string? NodeId, bool TreeChanged) : AppEvent;

/// <summary>An account was blocked, deleted, or changed its name, picture or role; its own pages react, and rows showing it re-read.</summary>
public sealed record AccountChanged(string AccountId, AccountChangeKind Kind) : AppEvent;

public enum AccountChangeKind
{
    Profile,
    Blocked,
    Deleted
}
