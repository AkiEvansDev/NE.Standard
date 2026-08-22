using System;
using NE.Standard.UI.Shell.Hosting;

namespace NE.Standard.UI.Web.Hosting;

internal static class WebViewCacheKeys
{
    public static string Create(UIViewResolution resolution)
    {
        ArgumentNullException.ThrowIfNull(resolution);

        return $"{resolution.Route.ViewKey}:{resolution.Session.Language}";
    }
}
