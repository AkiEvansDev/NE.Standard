using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// What keeps a file the framework serves — the application's content, a staged download — inert when a browser opens it
/// directly rather than embedding it, or a page names it as a script or a stylesheet (<c>docs/FILES.md</c> §9).
/// </summary>
internal static class WebInertContent
{
    /// <summary>
    /// Runs nothing and fetches nothing but its own images, in a sandbox with an origin of its own; an <c>&lt;img&gt;</c> or a
    /// CSS background ignores it, so embedding is untouched.
    /// </summary>
    public const string Policy = "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox";

    // The HTML standard's JavaScript MIME type essences: a script element, a module among them, runs any of them.
    private static readonly string[] JavaScriptTypes =
    [
        "application/ecmascript",
        "application/javascript",
        "application/x-ecmascript",
        "application/x-javascript",
        "text/ecmascript",
        "text/javascript",
        "text/javascript1.0",
        "text/javascript1.1",
        "text/javascript1.2",
        "text/javascript1.3",
        "text/javascript1.4",
        "text/javascript1.5",
        "text/jscript",
        "text/livescript",
        "text/x-ecmascript",
        "text/x-javascript"
    ];

    /// <summary>
    /// Writes the policy, marks a type a browser would render as a document or a page could run to be saved instead of shown, and
    /// answers the type to serve: the one given, or <c>application/octet-stream</c> for a type a page could run.
    /// </summary>
    public static string Apply(HttpResponse response, string contentType)
    {
        ArgumentNullException.ThrowIfNull(response);

        response.Headers.ContentSecurityPolicy = Policy;

        var runs = RunsAsSubresource(contentType);

        if ((runs || RendersAsDocument(contentType)) && string.IsNullOrEmpty(response.Headers.ContentDisposition))
            response.Headers.ContentDisposition = "attachment";

        // Under nosniff a browser runs no script or stylesheet of another type: an upload served back is never a page's <script src>,
        // which a host's script-src 'self' would let through.
        return runs ? "application/octet-stream" : contentType;
    }

    /// <summary>
    /// Whether a page could run this type as a subresource: the JavaScript family, a stylesheet, a WebAssembly module — or a type that
    /// does not parse, which cannot be vouched for.
    /// </summary>
    /// <remarks>
    /// Fails closed, as <see cref="RendersAsDocument"/> does: a browser reads a type more leniently than the parser here —
    /// <c>text/plain, text/javascript</c> is the last type of a list, <c>text/javascript;;</c> one with an empty parameter.
    /// </remarks>
    public static bool RunsAsSubresource(string? contentType)
    {
        if (!MediaTypeHeaderValue.TryParse(contentType, out MediaTypeHeaderValue? parsed) || !parsed.MediaType.HasValue)
            return true;

        ReadOnlySpan<char> type = parsed.MediaType.AsSpan();

        return type.Equals("text/css", StringComparison.OrdinalIgnoreCase)
            || type.Equals("application/wasm", StringComparison.OrdinalIgnoreCase)
            || IsJavaScript(type);
    }

    private static bool IsJavaScript(ReadOnlySpan<char> type)
    {
        foreach (var essence in JavaScriptTypes)
        {
            if (type.Equals(essence, StringComparison.OrdinalIgnoreCase))
                return true;
        }

        return false;
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
