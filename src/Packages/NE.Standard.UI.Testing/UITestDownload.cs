namespace NE.Standard.UI.Testing;

/// <summary>A file the application sent the page to save.</summary>
public sealed record UITestDownload(string FileName, string ContentType, byte[] Content);
