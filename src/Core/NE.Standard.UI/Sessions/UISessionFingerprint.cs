using System;
using System.Security.Cryptography;
using System.Text;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// What a log says in place of a session id: a short tag that tells one session's lines from another's, computed only when a line
/// is actually written.
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
