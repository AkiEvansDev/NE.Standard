using System;

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

    /// <summary>
    /// Validates localization options.
    /// </summary>
    public void Validate()
        => ArgumentException.ThrowIfNullOrWhiteSpace(DefaultLanguage);
}
