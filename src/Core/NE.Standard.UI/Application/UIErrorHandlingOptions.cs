namespace NE.Standard.UI.Application;

/// <summary>
/// How failures are surfaced: the routes used for unresolvable requests, and what a failed command tells the user.
/// </summary>
public sealed class UIErrorHandlingOptions
{
    /// <summary>
    /// Gets or sets the route used when a requested route was not registered, when configured.
    /// </summary>
    public string? NotFoundRoute { get; set; }

    /// <summary>
    /// Gets or sets the route used when an unhandled exception occurs while resolving a view, when configured.
    /// A command that throws is reported to the user instead, rather than routed here.
    /// </summary>
    public string? ErrorRoute { get; set; }

    /// <summary>
    /// Gets or sets whether a failed command with no effects of its own is reported to the user; a command that
    /// returns its own effects is left alone.
    /// </summary>
    public bool NotifyOnCommandFailure { get; set; } = true;

    /// <summary>
    /// Gets or sets whether the real exception message reaches the client; must stay off in production, since
    /// exceptions routinely carry connection strings, table names or file paths.
    /// </summary>
    public bool IncludeExceptionDetail { get; set; }

    /// <summary>
    /// Gets or sets what a command refused by an authorization check tells the user.
    /// </summary>
    public string CommandRefusedMessage { get; set; } = "You are not allowed to do that.";

    /// <summary>
    /// Gets or sets what a command that failed for any other reason tells the user.
    /// </summary>
    public string CommandFailedMessage { get; set; } = "Something went wrong. Please try again.";

    /// <summary>
    /// Gets or sets what the error page's <c>message</c> parameter carries when <see cref="IncludeExceptionDetail"/>
    /// is off.
    /// </summary>
    public string ErrorPageMessage { get; set; } = "Something went wrong. Please try again.";
}
