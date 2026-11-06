namespace NE.Standard.UI.Client;

/// <summary>A file the application sent the page to save.</summary>
public sealed record UIClientDownload(string FileName, string ContentType, byte[] Content);
