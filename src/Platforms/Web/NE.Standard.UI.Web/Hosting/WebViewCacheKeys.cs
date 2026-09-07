using System;
using NE.Standard.UI.Shell.Hosting;

namespace NE.Standard.UI.Web.Hosting;

internal static class WebViewCacheKeys
{
    public static string Create(UIViewResolution resolution)
    {
        ArgumentNullException.ThrowIfNull(resolution);

        // The compile's fingerprint too, so a render kept from before the code changed is never served to a page of the new compile.
        return $"{resolution.Route.ViewKey}:{resolution.Session.Language}:{resolution.View.Fingerprint}";
    }
}
