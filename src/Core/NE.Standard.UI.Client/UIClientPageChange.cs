using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Effects;

namespace NE.Standard.UI.Client;

/// <summary>Describes what changed on a <see cref="UIClientPage"/> in one atomic update batch.</summary>
public sealed class UIClientPageChange
{
    /// <summary>Gets the property addresses whose values changed.</summary>
    public IReadOnlySet<UIPropertyAddress> Properties { get; init; } = FrozenSet<UIPropertyAddress>.Empty;

    /// <summary>Gets the item hosts whose visible rows changed.</summary>
    public IReadOnlySet<UIComponentAddress> Collections { get; init; } = FrozenSet<UIComponentAddress>.Empty;

    /// <summary>Gets the field addresses whose validation or refusal state changed.</summary>
    public IReadOnlySet<UIComponentAddress> Validations { get; init; } = FrozenSet<UIComponentAddress>.Empty;

    /// <summary>Gets the effects applied during this batch, in order.</summary>
    public IReadOnlyList<ClientEffect> Effects { get; init; } = [];

    /// <summary>Gets whether the set of open dialogs changed.</summary>
    public bool DialogsChanged { get; init; }

    /// <summary>Gets whether the active responsive tier changed.</summary>
    public bool TierChanged { get; init; }

    /// <summary>Gets whether the page's navigation address or history position changed.</summary>
    public bool NavigationChanged { get; init; }

    /// <summary>Gets whether the page's language or theme changed.</summary>
    public bool LanguageOrThemeChanged { get; init; }

    /// <summary>Gets whether the page was rebuilt from a full resync snapshot.</summary>
    public bool FullResync { get; init; }

    /// <summary>Gets whether this batch carries any change.</summary>
    public bool HasChanges
        => Properties.Count > 0
            || Collections.Count > 0
            || Validations.Count > 0
            || Effects.Count > 0
            || DialogsChanged
            || TierChanged
            || NavigationChanged
            || LanguageOrThemeChanged
            || FullResync;
}
