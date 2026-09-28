namespace NE.Standard.UI.Web.Rendering;

/// <summary>
/// Configures the render cache (<c>FileSystemWebViewRenderCache</c>), which is best-effort: a folder it cannot use costs the
/// cache, not the page.
/// </summary>
public sealed class WebViewRenderCacheOptions
{
    /// <summary>
    /// Gets or sets the folder the cache keeps its own <c>renders</c> folder in, the only one it ever writes or empties; unset, a
    /// folder of this application's own under <c>NE.Standard.UI</c> in the system temp folder.
    /// </summary>
    public string? DirectoryPath { get; set; }

    /// <summary>
    /// Gets or sets whether the cache's folder is emptied when the host starts; left off, a start sweeps only each view's older
    /// compiles and abandoned temporary files, which is what a folder shared by several processes wants.
    /// </summary>
    public bool ClearOnStartup { get; set; } = true;

    /// <summary>
    /// How many rendered views this process keeps in memory; the least recently read go first past it.
    /// </summary>
    /// <remarks>
    /// A key is a view, a language and the compile fingerprint, so the normal count is views times languages. The bound exists
    /// because the language comes from the session, so an unbounded cache would let a caller exhaust memory by naming languages.
    /// </remarks>
    public int MaxHeldRenders { get; set; } = 256;

    /// <summary>
    /// How many bytes of markup and metadata the renders this process keeps in memory may take; the least recently read go first
    /// past it, as past <see cref="MaxHeldRenders"/>.
    /// </summary>
    /// <remarks>
    /// A count alone lets a few large views hold hundreds of megabytes; this bounds what the count cannot, whatever the pages weigh.
    /// </remarks>
    public long MaxHeldBytes { get; set; } = 128L * 1024 * 1024;
}
