using System;
using System.Security.Cryptography;
using System.Text;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// What a log says in place of a session id: the id is the credential the cookie carries, so a log that printed it would hand a
/// signed-in session to whoever reads the log. The fingerprint still tells one session's lines from another's, and is only
/// computed when a line is actually written.
/// </summary>
internal readonly record struct UISessionFingerprint(string? SessionId)
{
    public override string ToString()
    {
        if (string.IsNullOrEmpty(SessionId))
            return "none";

        Span<byte> hash = stackalloc byte[SHA256.HashSizeInBytes];
        _ = SHA256.HashData(Encoding.UTF8.GetBytes(SessionId), hash);

        return Convert.ToHexStringLower(hash[..6]);
    }
}
