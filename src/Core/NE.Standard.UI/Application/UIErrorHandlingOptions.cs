namespace NE.Standard.UI.Application;

/// <summary>
/// How failures are surfaced: the routes used for unresolvable requests, and what a failed command tells the user.
/// </summary>
public sealed class UIErrorHandlingOptions
{
    /// <summary>
    /// Gets or sets the route used when a requested route was not registered, when configured.
    /// </summary>
    /// <remarks>
    /// Set through <c>UIApplicationBuilder.NotFoundView</c>, which also registers the page.
    /// </remarks>
    public string? NotFoundRoute { get; set; }

    /// <summary>
    /// Gets or sets the route used when an unhandled exception occurs while resolving a view, when configured.
    /// </summary>
    /// <remarks>
    /// Set through <c>UIApplicationBuilder.ErrorView</c>. Only resolution failures come here — a command that
    /// throws must not throw the user off the page, losing what they had typed, so those are notified instead.
    /// </remarks>
    public string? ErrorRoute { get; set; }

    /// <summary>
    /// Gets or sets whether a failed command with no effects of its own is reported to the user.
    /// </summary>
    /// <remarks>
    /// On by default: a command that silently does nothing is the worst of the available behaviours, and it was
    /// the behaviour before this existed. A command that returns its own effects is left alone — returning them
    /// is how an author takes over the reporting.
    /// </remarks>
    public bool NotifyOnCommandFailure { get; set; } = true;

    /// <summary>
    /// Gets or sets whether the real exception message reaches the browser.
    /// </summary>
    /// <remarks>
    /// Off by default, and it must stay off in production: an exception message routinely carries a connection
    /// string, a table name or a file path. Turn it on in Development, where seeing the actual failure in the
    /// page beats reading the log.
    /// </remarks>
    public bool IncludeExceptionDetail { get; set; }

    /// <summary>
    /// Gets or sets what a command refused by an authorization check tells the user.
    /// </summary>
    /// <remarks>
    /// Passed through the translator, which returns unknown keys unchanged — so this default reads as English
    /// as it stands, and an application that localizes replaces it with a translation key.
    /// </remarks>
    public string CommandRefusedMessage { get; set; } = "You are not allowed to do that.";

    /// <summary>
    /// Gets or sets what a command that failed for any other reason tells the user.
    /// </summary>
    public string CommandFailedMessage { get; set; } = "Something went wrong. Please try again.";
}
