namespace NE.Standard.UI.Web.Hosting;

/// <summary>How a page reaches the framework's service worker, which shows its system notifications on a phone and takes their click.</summary>
public enum WebServiceWorkerMode
{
    /// <summary>None: a page shows its system notifications itself, which a phone's browser refuses — there it shows the fallback.</summary>
    Off,

    /// <summary>The page registers the framework's worker at <c>/_ne/</c>, where it controls no page of the application.</summary>
    Framework,

    /// <summary>
    /// The application's own worker imports the framework's — <c>importScripts("/_ne/sw.js")</c> — and the page waits for it rather
    /// than registering a second.
    /// </summary>
    Imported
}
