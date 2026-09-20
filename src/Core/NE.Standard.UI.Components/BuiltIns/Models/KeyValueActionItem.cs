using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing a key/value pair with an associated action button for use in lists/collections bound to <see cref="IKeyValueActionModel"/>.
/// </summary>
public partial class KeyValueActionItem : RecursiveObservable, IKeyValueActionModel
{
    /// <inheritdoc />
    /// <remarks>Init-only and non-notifying: a keyed collection indexes its items by this, so re-keying after insertion would break the id map.</remarks>
    [RecursiveMember(false)]
    public string Id { get; init; } = string.Empty;

    /// <inheritdoc />
    [RecursiveMember]
    public partial ITextModel Key { get; set; } = new TextItem();

    /// <inheritdoc />
    [RecursiveMember]
    public partial ITextModel Value { get; set; } = new TextItem();

    /// <inheritdoc />
    [RecursiveMember]
    public partial IButtonModel Action { get; set; } = new ButtonItem();

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? ShowInput { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial object? EditValue { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial string? InputTemplate { get; set; }
}
