using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// Answers the application's own protected content (a stored picture, an attachment) by key, for the session asking;
/// served at <see cref="IUIContentAddressResolver.AddressOf"/> so an <c>&lt;img&gt;</c> or link can name it.
/// </summary>
/// <remarks>
/// The provider is the whole authorization: answering <see langword="null"/> for anything the session may not have keeps
/// the host at "not found", never "forbidden", so a key's existence is never disclosed.
/// </remarks>
public interface IUIContentProvider
{
    /// <summary>
    /// Resolves the content behind a key for the session, or <see langword="null"/> when there is none or the
    /// session may not read it.
    /// </summary>
    Task<UIContent?> ResolveAsync(UIContentRequest request, CancellationToken cancellationToken = default);
}

/// <summary>
/// What a content request carries: the session the host resolved, and the key as the address named it.
/// </summary>
public sealed class UIContentRequest
{
    /// <summary>
    /// Gets the session asking; always a live one, and an authenticated one under an authenticated default policy.
    /// </summary>
    public required UserSessionState Session { get; init; }

    /// <summary>
    /// Gets the key, decoded — exactly what <see cref="IUIContentAddressResolver.AddressOf"/> was given.
    /// </summary>
    public required string Key { get; init; }
}

/// <summary>
/// Content answered by a provider; the host disposes the stream once it is sent.
/// </summary>
public sealed class UIContent : IAsyncDisposable, IDisposable
{
    /// <summary>
    /// Gets the readable content.
    /// </summary>
    public required Stream Content { get; init; }

    /// <summary>
    /// Gets the content type served.
    /// </summary>
    public required string ContentType { get; init; }

    /// <summary>
    /// Gets the name offered when the client is to save the content rather than show it; <see langword="null"/>
    /// shows it inline.
    /// </summary>
    public string? FileName { get; init; }

    /// <summary>
    /// Gets whether the key always answers the same bytes, so the client may cache them: <see langword="true"/> for a
    /// content-addressed or version-carrying key, false if its content can change in place.
    /// </summary>
    public bool Immutable { get; init; }

    /// <inheritdoc />
    public ValueTask DisposeAsync()
        => Content.DisposeAsync();

    /// <inheritdoc />
    public void Dispose()
        => Content.Dispose();
}
