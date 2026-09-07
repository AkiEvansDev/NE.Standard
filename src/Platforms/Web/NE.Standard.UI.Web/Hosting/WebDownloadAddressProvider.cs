using System;
using NE.Standard.UI.Shell.Files;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// A staged download's address on the web: the file transfer prefix, plus the token.
/// </summary>
internal sealed class WebDownloadAddressProvider : IUIDownloadAddressProvider
{
    public string AddressOf(string token)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(token);
        return $"{WebFileEndpoints.Prefix}/{token}";
    }
}
