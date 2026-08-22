using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing a badge item's icon and text for use in lists/collections bound to <see cref="IBadgeModel"/>.
/// </summary>
public partial class BadgeItem : RecursiveObservable, IBadgeModel
{
    /// <inheritdoc />
    /// <remarks>
    /// Init-only and non-notifying, per <c>docs/PROJECT.md</c> §7: a keyed collection indexes its items by
    /// this, so a notifying setter would let an item be re-keyed after insertion, leaving the collection's
    /// id map pointing at the old key and every path built from the new one resolving to nothing.
    /// </remarks>
    [RecursiveMember(false)]
    public string Id { get; init; } = string.Empty;

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIBadgeType? BadgeStyle { get; set; } = UIBadgeType.Info;

    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    public partial string? BadgeIcon { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIThemeColor? BadgeIconColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Default);

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIIconSize? BadgeIconSize { get; set; } = UIIconSize.Small;

    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    public partial string? BadgeText { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UITextAppearance? BadgeTextType { get; set; } = UITextAppearance.Caption;

    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    public partial string? BadgeTooltip { get; set; }
}
