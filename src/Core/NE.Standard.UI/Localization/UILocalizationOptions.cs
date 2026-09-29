using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Localization;

/// <summary>
/// Configures UI localization defaults.
/// </summary>
public sealed class UILocalizationOptions
{
    /// <summary>
    /// Gets or sets the fallback language used when a translation is not available for the requested language.
    /// </summary>
    public string DefaultLanguage { get; set; } = "en";

    /// <summary>Gets the prefixes a plain string on a translatable property must start with to be looked up as a key (<c>editor.</c>).</summary>
    /// <remarks>
    /// The framework's own <c>ui.</c> is always one; empty, any string is a key. What keeps content equal to a key — a name equal to a
    /// dictionary entry — from being translated; a <c>UIPhrase</c> is looked up whatever its key, and <c>UIPhrase.Text</c> by these prefixes.
    /// </remarks>
    public IList<string> KeyPrefixes { get; } = [];

    /// <summary>
    /// Gets or sets whether a word asked for and missing in the language asked is collected (<c>IUIMissingWords</c>) and logged
    /// once; <see langword="null"/> leaves it to the platform, which turns it on in development.
    /// </summary>
    public bool? ReportMissingWords { get; set; }

    /// <summary>
    /// Validates localization options.
    /// </summary>
    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(DefaultLanguage);

        foreach (var prefix in KeyPrefixes)
            ArgumentException.ThrowIfNullOrWhiteSpace(prefix, nameof(KeyPrefixes));
    }
}
