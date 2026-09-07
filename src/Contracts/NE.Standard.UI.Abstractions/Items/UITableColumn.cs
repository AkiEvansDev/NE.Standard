using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// One column of a table: the key its cell template is registered under, the caption its header shows, its track and how
/// its cells align. The template itself is a template variant of the table, keyed <c>column:{Key}</c>. A record class rather than a
/// struct, so a package's column may derive from it and carry more.
/// </summary>
public record UITableColumn(string Key, string? Caption, UIGridUnit Width, UITextAlignment? Alignment = null)
{
    /// <summary>The prefix a column's template variant is keyed under.</summary>
    public const string TemplatePrefix = "column";

    /// <summary>The template-variant key this column's cells render through.</summary>
    public string TemplateKey => $"{TemplatePrefix}:{Key}";

    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Key);
        Width.Validate();
    }
}
