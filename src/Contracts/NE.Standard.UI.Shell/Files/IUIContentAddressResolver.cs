namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// Where the platform serves an <see cref="IUIContentProvider"/>'s content: the address a component's <c>Source</c>
/// or a link names.
/// </summary>
public interface IUIContentAddressResolver
{
    /// <summary>
    /// The address of one key.
    /// </summary>
    string AddressOf(string key);
}
