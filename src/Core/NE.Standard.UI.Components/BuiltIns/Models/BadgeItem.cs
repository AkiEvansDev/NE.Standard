using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing a badge item's icon and text for use in lists/collections bound to <see cref="IBadgeModel"/>.
/// </summary>
/// <remarks>Every styling property starts at <see langword="null"/>; what an item leaves unsaid is decided by the template drawing it.</remarks>
public partial class BadgeItem : RecursiveObservable, IBadgeModel, IContentItem
{
    /// <inheritdoc />
    /// <remarks>Init-only and non-notifying: a keyed collection indexes its items by this, so re-keying after insertion would break the id map.</remarks>
    [RecursiveMember(false)]
    public string Id { get; init; } = string.Empty;

    /// <inheritdoc />
    /// <remarks>Init-only and non-notifying: whether a word is a key is settled when the item is drawn. Sent only when set.</remarks>
    [RecursiveMember(false)]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool IsContent { get; init; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIBadgeType? BadgeStyle { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIThemeColor? BadgeColor { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIBadgeFill? BadgeFill { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial string? BadgeIcon { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIThemeColor? BadgeIconColor { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIIconSize? BadgeIconSize { get; set; }

    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    [JsonConverter(typeof(UIPhraseValueJsonConverter))]
    public partial UIPhrase? BadgeText { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UITextAppearance? BadgeTextType { get; set; }

    /// <inheritdoc />
    [Translatable]
    [RecursiveMember]
    [JsonConverter(typeof(UIPhraseValueJsonConverter))]
    public partial UIPhrase? BadgeTooltip { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial UIPopupPlacement? BadgeTooltipPlacement { get; set; }
}
