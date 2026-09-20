namespace NE.Standard.UI.Web.Rendering;

public sealed class WebViewRenderCacheOptions
{
    public string? DirectoryPath { get; set; }

    public bool ClearOnStartup { get; set; } = true;

    /// <summary>
    /// How many rendered views this process keeps in memory; the least recently read go first past it.
    /// </summary>
    /// <remarks>
    /// A key is a view, a language and the compile fingerprint, so the normal count is views times languages. The bound exists
    /// because the language comes from the session, so an unbounded cache would let a caller exhaust memory by naming languages.
    /// </remarks>
    public int MaxHeldRenders { get; set; } = 256;
}
