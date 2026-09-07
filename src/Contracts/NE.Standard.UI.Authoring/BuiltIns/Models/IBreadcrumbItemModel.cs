using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents one step of a breadcrumb trail: where it leads and how it reads.
/// </summary>
public interface IBreadcrumbItemModel : ITextBaseModel
{
    /// <summary>
    /// Gets the route this step leads back to. A step may carry a URL, a click command, or both.
    /// </summary>
    [SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "The value is only ever written verbatim into an href attribute; a Uri type would require additional rendering/converter plumbing with no benefit here.")]
    string? Url { get; }
}
