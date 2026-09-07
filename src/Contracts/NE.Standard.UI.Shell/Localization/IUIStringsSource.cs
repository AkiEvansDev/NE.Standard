using System.Collections.Generic;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// The words a package's own client chrome writes, keyed like <see cref="UIStrings"/> with their English: a translator
/// falls back to them and a page hands them to its client beside the framework's own. A package registers one as a service.
/// </summary>
public interface IUIStringsSource
{
    IReadOnlyDictionary<string, string> English { get; }
}
