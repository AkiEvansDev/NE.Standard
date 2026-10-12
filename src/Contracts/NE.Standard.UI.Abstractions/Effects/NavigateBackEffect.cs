using System;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Goes back to where the page was reached from — the browser's Back, when the entry behind this one is of this site — and to
/// <see cref="Fallback"/> when there is none: a page opened from a bookmark, a link from elsewhere, a new tab.
/// </summary>
/// <remarks>
/// The step back is the browser's own, so it is what Back does: an entry of this route's runtime tells the controller
/// (<c>OnNavigatedAsync</c>), one of another runtime of a <c>route.Identity</c> route is gone to in place, any other loads its page; a
/// page holding unsaved work asks first, as it does for Back. The fallback is followed as a <see cref="NavigateEffect"/>'s address is,
/// the controller asked first while it holds unsaved work. Back names no address a link could carry, so unlike a navigation it runs in
/// an interaction, with no round trip: <c>UIIconButtons.Back().InteractOn(EventNames.Click, new NavigateBackEffect("/notes"))</c>.
/// </remarks>
public sealed class NavigateBackEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that goes back, or to <paramref name="fallback"/> — an address of this site, its query included — where
    /// there is nothing of this site to go back to.
    /// </summary>
    [JsonConstructor]
    public NavigateBackEffect(string fallback = "/")
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(fallback);
        Fallback = fallback;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.NavigateBack;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the address gone to where the entry behind this one is not of this site, or there is none.
    /// </summary>
    public string Fallback { get; }
}
