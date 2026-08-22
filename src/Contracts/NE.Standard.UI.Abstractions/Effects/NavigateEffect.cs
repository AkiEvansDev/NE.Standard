using System;
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
    public NavigateEffect(UINavigationRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        Request = request;
    }

    /// <inheritdoc />
    public override ClientEffectKind Kind => ClientEffectKind.Navigate;

    /// <summary>
    /// Gets the navigation request.
    /// </summary>
    public UINavigationRequest Request { get; }
}
