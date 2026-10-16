using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing a file for a list of tiles bound to <see cref="IFileModel"/> — a message's attachments, a downloads list, an
/// upload's result — drawn by <see cref="Templates.DefaultFileTemplate"/>.
/// </summary>
public partial class FileItem : RecursiveObservable, IFileModel
{
    /// <inheritdoc />
    /// <remarks>Init-only and non-notifying: a keyed collection indexes its items by this, so re-keying after insertion would break the id map.</remarks>
    [RecursiveMember(false)]
    public string Id { get; init; } = string.Empty;

    /// <inheritdoc />
    [RecursiveMember]
    public partial string? FileName { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial long? FileSize { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial string? ContentType { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial string? Icon { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Loading { get; set; }
}
