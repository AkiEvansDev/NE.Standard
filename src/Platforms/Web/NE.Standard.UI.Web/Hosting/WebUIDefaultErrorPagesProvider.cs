using NE.Standard.UI.Application;
using NE.Standard.UI.Web.Views;

namespace NE.Standard.UI.Web.Hosting;

internal sealed class WebUIDefaultErrorPagesProvider : IUIDefaultErrorPagesProvider
{
    public void ConfigureDefaultPages(UIApplicationBuilder application)
    {
        if (!application.HasNotFoundView)
            _ = application.NotFoundView<DefaultNotFoundView>();

        if (!application.HasErrorView)
            _ = application.ErrorView<DefaultErrorView, DefaultErrorController>();
    }
}
