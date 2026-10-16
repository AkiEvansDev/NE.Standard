using NE.Standard.UI.Abstractions.Effects;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Has the page trade a one-time token for the key its sign-in moved its session to (<see cref="WebSessionKeyEndpoint"/>); the page
/// loads no other page until the trade answers.
/// </summary>
/// <remarks>The Web platform's own wire shape, pushed by <see cref="WebSessionKeys"/>.</remarks>
internal sealed class WebSessionKeyEffect(string token) : ClientEffect
{
    /// <summary>The kind the page's runtime trades the token by.</summary>
    public const string KindName = "SessionKey";

    /// <inheritdoc />
    public override string Kind => KindName;

    /// <summary>Gets the token: good once, for <see cref="WebSessionKeys.Lifetime"/>.</summary>
    public string Token { get; } = token;
}
