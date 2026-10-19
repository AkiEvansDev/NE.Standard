namespace NE.Standard.UI.Application;

/// <summary>What a platform decides for an option the application left unset, registered as a singleton by its startup.</summary>
public sealed class UIPlatformDefaults
{
    /// <summary>Gets whether missing words are reported when <c>UILocalizationOptions.ReportMissingWords</c> is unset.</summary>
    public bool ReportMissingWords { get; init; }

    /// <summary>Gets whether an author's mistake found as a page runs — a command's effect naming nothing — is told to the page's console too.</summary>
    public bool ReportsToPage { get; init; }
}
