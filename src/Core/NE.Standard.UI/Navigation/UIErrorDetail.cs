using System;

namespace NE.Standard.UI.Navigation;

/// <summary>
/// A failure's own text, which the error route receives as its <c>message</c> parameter where <c>IncludeExceptionDetail</c> is on.
/// </summary>
/// <remarks>
/// Handed over in-process, never through the address: a parameter read from an address is text, so a crafted link cannot make an
/// error page that reads this type show words of its own on the application's origin.
/// </remarks>
public sealed class UIErrorDetail
{
    /// <summary>The name of the error route's parameter that carries it.</summary>
    public const string ParameterName = "message";

    /// <summary>Creates the detail of a failure whose text is <paramref name="message"/>.</summary>
    public UIErrorDetail(string message)
    {
        ArgumentNullException.ThrowIfNull(message);
        Message = message;
    }

    /// <summary>Gets the failure's text.</summary>
    public string Message { get; }
}
