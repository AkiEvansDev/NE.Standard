using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Localization;

/// <summary>
/// The key-prefix rule the translator and the unkeyed-words check share: a text is a key when it starts with the framework's prefix
/// or one the application configured.
/// </summary>
internal static class UIKeyPrefixes
{
    /// <summary>The prefixes a key starts with, the framework's among them; none where the application configures none.</summary>
    public static string[] Build(IReadOnlyList<string>? keyPrefixes)
    {
        if (keyPrefixes is null || keyPrefixes.Count == 0)
            return [];

        HashSet<string> prefixes = new(StringComparer.Ordinal) { UITranslationRegistry.FrameworkPrefix };

        for (var i = 0; i < keyPrefixes.Count; i++)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(keyPrefixes[i]);
            _ = prefixes.Add(keyPrefixes[i]);
        }

        return [.. prefixes];
    }

    /// <summary>Whether a text starts with one of the prefixes.</summary>
    public static bool IsKey(string text, string[] prefixes)
    {
        for (var i = 0; i < prefixes.Length; i++)
        {
            if (text.StartsWith(prefixes[i], StringComparison.Ordinal))
                return true;
        }

        return false;
    }
}
