using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A file as a square tile — its kind's glyph (<see cref="UIFileGlyphs"/>), its name on up to two lines, its size under it — drawn as
/// an image input's shelf draws a file that is no picture; while <c>Loading</c>, a ring turns in the glyph's place. A message's
/// attachments, a downloads list, an upload's result.
/// </summary>
/// <remarks>The size is written by the page in the reader's language, as the shelf writes it: "1.5 MB", "1,5 МБ".</remarks>
[UIComponentPropertyBlock(typeof(IClickableComponent))]
public abstract partial class FileTileComponent<T> : VisualComponentBase<T>, IClickableComponent
    where T : FileTileComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the file's name, shown on up to two lines and whole as the tile's tooltip; its extension picks the glyph.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? FileName { get; set; }

    /// <summary>
    /// Gets or sets the file's size in bytes; unset shows none.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public long? FileSize { get; set; }

    /// <summary>
    /// Gets or sets the file's MIME type, which picks the glyph where the name's extension says nothing.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? ContentType { get; set; }

    /// <summary>
    /// Gets or sets the glyph shown in place of the one the file's kind picks.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? Icon { get; set; }

    /// <summary>
    /// Initializes the tile at the start of its cell, at its own size.
    /// </summary>
    protected FileTileComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Start;
        VerticalAlignment = UIAlignment.Start;
    }

    /// <summary>
    /// Registers a command to invoke when the tile is pressed — to open or download the file; the tile is pressable unless its author
    /// set or bound <c>Clickable</c>.
    /// </summary>
    public T OnClick(string command)
        => On(EventNames.Click, command);

    /// <summary>
    /// Registers a command with bound arguments to invoke when the tile is pressed.
    /// </summary>
    public T OnClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Click, command, arguments);

    /// <summary>
    /// Registers a command with literal arguments to invoke when the tile is pressed.
    /// </summary>
    public T OnClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Click, command, arguments);

    /// <summary>
    /// Runs the command on press with the key of the item the tile is drawn for — a message's attachment, a downloads list's row.
    /// </summary>
    public T OnClickWithItemKey(string command, string argumentName = "id")
        => OnClick(command, UIAction.ArgCurrentItemKey(argumentName));
}

/// <summary>
/// A file as a square tile: its kind's glyph, its name and its size.
/// </summary>
public sealed class FileTileComponent(string? id = null) : FileTileComponent<FileTileComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.file-tile";
}
