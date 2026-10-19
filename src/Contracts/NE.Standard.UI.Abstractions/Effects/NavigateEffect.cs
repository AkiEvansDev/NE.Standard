using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Navigation;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to navigate to another UI route.
/// </summary>
public sealed class NavigateEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that navigates using the given navigation request.
    /// </summary>
    /// <remarks>
    /// A bare route — <c>"settings"</c> — gains its leading slash, as the route registry reads the one it was registered under. A query
    /// or a fragment alone is refused: <see cref="ReplaceAddressEffect"/> writes the page's query, <see cref="ScrollToEffect"/> shows a part.
    /// </remarks>
    [JsonConstructor]
    public NavigateEffect(UINavigationRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var route = UISiteAddress.Normalize(request.Route, nameof(request));

        Request = ReferenceEquals(route, request.Route) ? request : new UINavigationRequest { Route = route, Parameters = request.Parameters };
    }

    /// <summary>
    /// Creates an effect that navigates to an address of this site as written, its query and fragment included — the one a leave
    /// was asked about (<c>OnLeaveRequestedAsync</c>).
    /// </summary>
    public NavigateEffect(string address)
        : this(new UINavigationRequest { Route = !string.IsNullOrWhiteSpace(address) ? address : throw new ArgumentException("An address is required.", nameof(address)) })
    {
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.Navigate;

    /// <summary>
    /// Gets the navigation request.
    /// </summary>
    public UINavigationRequest Request { get; }
}
