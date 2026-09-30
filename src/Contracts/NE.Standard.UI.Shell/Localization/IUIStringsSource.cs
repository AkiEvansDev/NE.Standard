using System.Collections.Frozen;
using System.Collections.Generic;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>The words a package's client chrome writes, keyed like <see cref="UIStrings"/> with their English.</summary>
/// <remarks>
/// A translator falls back to them, sent to the client beside the framework's own. A package registers one as a service.
/// </remarks>
public interface IUIStringsSource
{
    IReadOnlyDictionary<string, string> English { get; }

    /// <summary>
    /// The same words in the other languages the package ships, by language; an application opts in with <c>AddFrameworkWords</c>,
    /// ranked below its own sources.
    /// </summary>
    IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> Translations
        => FrozenDictionary<string, IReadOnlyDictionary<string, string>>.Empty;
}
