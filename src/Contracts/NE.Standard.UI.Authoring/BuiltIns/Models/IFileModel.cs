using NE.Standard.UI.Abstractions.Binding;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents the data contract for a file a tile draws: its name, size and type, and whether it is still being written.
/// </summary>
public interface IFileModel : IBindableItem
{
    /// <summary>
    /// Gets the file's name, shown on up to two lines; its extension picks the glyph.
    /// </summary>
    string? FileName { get; }

    /// <summary>
    /// Gets the file's size in bytes; unset shows none.
    /// </summary>
    long? FileSize { get; }

    /// <summary>
    /// Gets the file's MIME type, which picks the glyph where the name's extension says nothing.
    /// </summary>
    string? ContentType { get; }

    /// <summary>
    /// Gets the glyph shown in place of the one the file's kind picks.
    /// </summary>
    string? Icon { get; }

    /// <summary>
    /// Gets whether the file is still being written: a ring turns in the glyph's place.
    /// </summary>
    bool? Loading { get; }
}
