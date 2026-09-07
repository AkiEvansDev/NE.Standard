using NE.Standard.UI.Shell.Services;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// Turns a staged download's token into the address the client fetches it from — the one piece of
/// <see cref="IUIDownloadService"/>'s default implementation the platform, not Core, knows how to answer.
/// </summary>
public interface IUIDownloadAddressProvider
{
    /// <summary>
    /// The address the client downloads a staged file's <paramref name="token"/> from.
    /// </summary>
    string AddressOf(string token);
}
