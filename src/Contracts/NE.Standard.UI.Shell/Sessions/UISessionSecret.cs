using System;
using System.Buffers.Text;
using System.Security.Cryptography;
using System.Text;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// A session's secret — what the client carries, the web's cookie — and the id the framework knows the session by, which is
/// SHA-256 of the secret.
/// </summary>
/// <remarks>
/// Only the platform's edge, where the client's key is read and written, ever holds a secret: the stores, the runtimes and
/// everything a controller sees carry the id, which is no credential — a leaked store names sessions nobody can present.
/// </remarks>
public sealed class UISessionSecret
{
    private const int SecretBytes = 32;

    // What a client's key may be at most: longer is no secret this framework issued, and is not hashed.
    private const int MaxSecretLength = 128;

    private UISessionSecret(string value, string sessionId)
    {
        Value = value;
        SessionId = sessionId;
    }

    /// <summary>Gets the secret the client carries.</summary>
    public string Value { get; }

    /// <summary>Gets the id of the session the secret opens.</summary>
    public string SessionId { get; }

    /// <summary>Issues an unguessable secret — a predictable one is a session-fixation invitation — with its session id.</summary>
    public static UISessionSecret New()
    {
        var value = Base64Url.EncodeToString(RandomNumberGenerator.GetBytes(SecretBytes));

        return new UISessionSecret(value, ToSessionId(value));
    }

    /// <summary>The id of the session a secret opens: SHA-256 of it, as lower-case hex.</summary>
    /// <remarks>
    /// Hex rather than base64url: an id is a key in stores and folders that may compare without case, where two base64url ids
    /// differing only in case would be one.
    /// </remarks>
    public static string ToSessionId(string secret)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(secret);

        Span<byte> hash = stackalloc byte[SHA256.HashSizeInBytes];
        _ = SHA256.HashData(Encoding.UTF8.GetBytes(secret), hash);

        return Convert.ToHexStringLower(hash);
    }

    /// <summary>
    /// The id of the session a client's key opens, or <see langword="null"/> when the client presented none or one no secret of
    /// this framework's shape could be.
    /// </summary>
    public static string? TryToSessionId(string? secret)
        => string.IsNullOrWhiteSpace(secret) || secret.Length > MaxSecretLength ? null : ToSessionId(secret);
}
