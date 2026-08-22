namespace NE.Standard.UI.Application;

/// <summary>
/// Supplies default not-found/error views for an application that hasn't configured its own.
/// </summary>
public interface IUIDefaultErrorPagesProvider
{
    /// <summary>
    /// Configures the not-found/error views on the application builder, unless already configured.
    /// </summary>
    void ConfigureDefaultPages(UIApplicationBuilder application);
}
