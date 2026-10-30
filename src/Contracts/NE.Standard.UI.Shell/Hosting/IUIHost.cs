namespace NE.Standard.UI.Shell.Hosting;

/// <summary>
/// Combines view resolution, the client runtime endpoint and the server-drawn page's render.
/// </summary>
public interface IUIHost : IUIViewHost, IUIClientEndpoint, IUIRenderEndpoint { }
