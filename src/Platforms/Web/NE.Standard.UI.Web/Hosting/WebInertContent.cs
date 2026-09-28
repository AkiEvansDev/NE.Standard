using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// What keeps a file the framework serves — the application's content, a staged download — inert when a browser opens it
/// directly rather than embedding it (<c>docs/FILES.md</c> §9).
/// </summary>
internal static class WebInertContent
{
    /// <summary>
    /// Runs nothing and fetches nothing but its own images, in a sandbox with an origin of its own; an <c>&lt;img&gt;</c> or a
    /// CSS background ignores it, so embedding is untouched.
    /// </summary>
    public const string Policy = "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox";

    /// <summary>
    /// Writes the policy, and marks a type a browser would render as a document to be saved instead of shown.
    /// </summary>
    public static void Apply(HttpResponse response, string? contentType)
    {
        ArgumentNullException.ThrowIfNull(response);

        response.Headers.ContentSecurityPolicy = Policy;

        if (RendersAsDocument(contentType) && string.IsNullOrEmpty(response.Headers.ContentDisposition))
            response.Headers.ContentDisposition = "attachment";
    }

    /// <summary>
    /// Whether a browser opening this type would render it as a document able to carry script: HTML, any XML (SVG included),
    /// XSL, a multipart stream — or a type that does not parse, which cannot be vouched for.
    /// </summary>
    public static bool RendersAsDocument(string? contentType)
    {
        if (!MediaTypeHeaderValue.TryParse(contentType, out MediaTypeHeaderValue? parsed) || !parsed.MediaType.HasValue)
            return true;

        ReadOnlySpan<char> type = parsed.MediaType.AsSpan();

        return type.Equals("text/html", StringComparison.OrdinalIgnoreCase)
            || type.Equals("application/xhtml+xml", StringComparison.OrdinalIgnoreCase)
            || type.Equals("text/xml", StringComparison.OrdinalIgnoreCase)
            || type.Equals("application/xml", StringComparison.OrdinalIgnoreCase)
            || type.Equals("text/xsl", StringComparison.OrdinalIgnoreCase)
            || type.EndsWith("+xml", StringComparison.OrdinalIgnoreCase)
            || type.StartsWith("multipart/", StringComparison.OrdinalIgnoreCase);
    }
}
