namespace NE.Standard.UI.Application;

/// <summary>What a platform decides for an option the application left unset.</summary>
internal sealed class UIPlatformDefaults
{
    /// <summary>Gets whether missing words are reported when <c>UILocalizationOptions.ReportMissingWords</c> is unset.</summary>
    public bool ReportMissingWords { get; init; }
}
