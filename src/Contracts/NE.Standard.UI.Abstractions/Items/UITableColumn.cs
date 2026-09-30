using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// One column of a table: its template key, header caption, track and cell alignment. A record class, not a struct,
/// so a package's column may subclass it.
/// </summary>
public record UITableColumn(string Key, string? Caption, UIGridUnit Width, UITextAlignment? Alignment = null)
{
    /// <summary>The prefix a column's template variant is keyed under.</summary>
    public const string TemplatePrefix = "column";

    /// <summary>The template-variant key this column's cells render through.</summary>
    public string TemplateKey => $"{TemplatePrefix}:{Key}";

    /// <summary>
    /// Whether the column stays in place while a wide table scrolls sideways under it. Pinned columns lead the table: one after an
    /// unpinned column is refused when it is added.
    /// </summary>
    public bool Pinned { get; init; }

    /// <summary>
    /// The viewport tier below which the column is hidden (track and cells) unless the viewer chose otherwise in a chooser;
    /// null shows it at every width.
    /// </summary>
    public UIResponsiveTier? HideBelow { get; init; }

    /// <summary>
    /// Whether the column starts hidden at every width; a chooser lists it unchecked, and the viewer's own word kept in the browser wins
    /// over it, as it wins over <see cref="HideBelow"/>. Only a host with a column chooser (the data grid) can show it again.
    /// </summary>
    public bool Hidden { get; init; }

    /// <summary>
    /// The icon drawn before the caption — in the header, beside a sort mark, and in a chooser's entry; the column's accessible name stays
    /// the caption.
    /// </summary>
    public string? Icon { get; init; }

    /// <summary>The colour <see cref="Icon"/> is drawn in; null draws it in the caption's own ink.</summary>
    public UIThemeColor? IconColor { get; init; }

    /// <summary>
    /// Whether the column belongs to the control rather than the author (e.g. a grid's checkbox column): no resize handle,
    /// and a chooser leaves it out.
    /// </summary>
    public bool Fixed { get; init; }

    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Key);
        Width.Validate();
    }
}
