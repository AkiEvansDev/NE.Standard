using System;
using NE.Standard.UI.Shell.Files;

namespace NE.Standard.UI.Files;

/// <summary>
/// What an upload, or a value staged for the page, is counted as against its session's allowance: its bytes, a fixed minimum for the
/// entry that keeps it, and an upload's name as held in memory.
/// </summary>
/// <remarks>Bytes alone left an empty file or value free, though each one still costs an entry in memory, and a file on disk.</remarks>
internal static class UIAllowanceCharge
{
    /// <summary>What every upload or staged value is counted as beyond its bytes, whatever its size.</summary>
    public const long EntryBytes = 1024;

    /// <summary>What a stored upload is counted as.</summary>
    public static long Of(UIUploadFile file)
    {
        ArgumentNullException.ThrowIfNull(file);

        return file.Size + Overhead(file.FileName);
    }

    /// <summary>What an upload of this name is counted as before its first byte: the entry and the name.</summary>
    public static long Overhead(string fileName)
    {
        ArgumentNullException.ThrowIfNull(fileName);

        return EntryBytes + ((long)fileName.Length * sizeof(char));
    }
}
